import { env } from '@/lib/env';
import { personalizationEnabled } from '../telemetry/interactionTracker';

/** Trạng thái hiển thị BE trả qua STATE_SNAPSHOT; gửi lại ở lượt sau (khớp RunAgentInput.AgentState). */
export type AgentState = {
    locale?: 'vi' | 'en';
    view?: 'grid' | 'table' | null;
    density?: 'compact' | 'comfortable' | null;
    lastQuery?: string | null;
    lastSort?: string | null;
    lastIntents?: string[];
};

export type AgentEvent =
    | { type: 'RUN_STARTED'; runId: string }
    | { type: 'TEXT_MESSAGE_START'; messageId: string }
    | { type: 'TEXT_MESSAGE_CONTENT'; messageId: string; delta: string }
    | { type: 'TEXT_MESSAGE_END'; messageId: string }
    | { type: 'CUSTOM'; name: string; value: unknown }
    | { type: 'STATE_SNAPSHOT'; snapshot: AgentState }
    | { type: 'RUN_FINISHED'; runId: string }
    | { type: 'RUN_ERROR'; code: string; message: string };

export type AgentMessage = { role: 'user' | 'assistant'; content: string };

export class AgentHttpError extends Error {
    readonly status: number;
    readonly code?: string;

    constructor(status: number, code?: string) {
        super(`Agent request failed with ${status}`);
        this.status = status;
        this.code = code;
    }
}

/**
 * Gọi POST /api/ai/agent và đọc SSE (AG-UI events). Dùng fetch thay EventSource vì cần POST body;
 * cookie đăng nhập HttpOnly được gửi qua credentials: 'include'.
 */
export async function runAgent(
    input: {
        threadId: string;
        runId: string;
        messages: AgentMessage[];
        state?: AgentState;
        /** chat: trả lời kèm khối nhỏ; page: AI ghép cả trang. */
        mode?: 'chat' | 'page';
    },
    onEvent: (event: AgentEvent) => void,
    signal?: AbortSignal,
): Promise<void> {
    const state = { ...input.state, personalizationEnabled: personalizationEnabled() };
    delete state.lastIntents;
    if (state.lastQuery) state.lastQuery = state.lastQuery.slice(0, 100);
    const response = await fetch(`${env.apiBaseUrl}/api/ai/agent`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream, application/json' },
        body: JSON.stringify({
            ...input,
            state: Object.keys(state).length ? clean(state) : undefined,
        }),
        signal,
    });
    if (!response.ok || !response.body) {
        let code: string | undefined;
        try {
            code = (await response.json())?.code;
        } catch {
            code = undefined;
        }
        throw new AgentHttpError(response.status, code);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // Một chunk có thể chứa nửa event hoặc nhiều event; event SSE kết thúc bằng dòng trống.
        let boundary = buffer.search(/\r?\n\r?\n/);
        while (boundary >= 0) {
            const block = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary).replace(/^\r?\n\r?\n/, '');
            emit(block, onEvent);
            boundary = buffer.search(/\r?\n\r?\n/);
        }
    }
    if (buffer.trim()) emit(buffer, onEvent);
}

function emit(block: string, onEvent: (event: AgentEvent) => void) {
    const data = block
        .split(/\r?\n/)
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n');
    if (!data) return;
    try {
        onEvent(JSON.parse(data) as AgentEvent);
    } catch {
        // Bỏ qua event hỏng; runtime vẫn giữ surface hợp lệ gần nhất.
    }
}

function clean(state: Omit<AgentState, 'lastIntents'>) {
    return Object.fromEntries(
        Object.entries(state).filter(([, value]) => value != null && value !== ''),
    );
}
