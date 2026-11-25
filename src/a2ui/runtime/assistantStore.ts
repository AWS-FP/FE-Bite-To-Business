/**
 * Store khung chat trợ lý (chế độ chat): lịch sử hội thoại, gọi /api/ai/agent, áp surface A2UI trả về.
 * Lưu ở sessionStorage để tải lại trang vẫn dựng lại được các khối giao diện cũ (last valid surface).
 * Ngắn hạn: STATE_SNAPSHOT (kiểu hiển thị, từ khóa, sort) được gửi lại ở lượt sau qua `state`.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { applyA2ui } from './a2uiRuntime';
import { AgentHttpError, runAgent, type AgentEvent, type AgentState } from '../client/agentClient';
import { trackEvent } from '../telemetry/interactionTracker';

export type ChatEntry = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    text?: string;
    /** Surface A2UI của lượt này; message gốc được giữ để dựng lại sau khi tải lại trang. */
    surfaceId?: string;
    a2ui?: unknown[];
    error?: boolean;
};

type AssistantState = {
    threadId: string;
    entries: ChatEntry[];
    agentState: AgentState;
    busy: boolean;
    open: boolean;
    setOpen: (open: boolean) => void;
    send: (text: string, locale: 'vi' | 'en') => Promise<void>;
    /** Ghi chú cục bộ (vd. đã thêm vào giỏ) — không gửi cho model như lời trợ lý. */
    note: (text: string) => void;
    reset: () => void;
};

const newId = () => crypto.randomUUID();

export const useAssistantStore = create<AssistantState>()(
    persist(
        (set, get) => ({
            threadId: newId(),
            entries: [],
            agentState: {},
            busy: false,
            open: false,
            setOpen: (open) => set({ open }),
            reset: () => set({ threadId: newId(), entries: [], agentState: {} }),
            note: (text) =>
                set((state) => ({
                    entries: [...state.entries, { id: newId(), role: 'system', text }],
                })),
            send: async (text, locale) => {
                const content = text.trim();
                if (!content || get().busy) return;
                const userEntry: ChatEntry = { id: newId(), role: 'user', text: content };
                set((state) => ({ entries: [...state.entries, userEntry], busy: true }));
                trackEvent('assistant_prompt', { value: { length: content.length } });
                const history = get()
                    .entries.filter(
                        (entry) => entry.role !== 'system' && entry.text && !entry.error,
                    )
                    .slice(-10)
                    .map((entry) => ({
                        role: entry.role as 'user' | 'assistant',
                        content: entry.text!,
                    }));
                const reply: ChatEntry = { id: newId(), role: 'assistant' };
                const started = performance.now();
                let firstSurfaceMs: number | null = null;
                const push = (patch: Partial<ChatEntry>) =>
                    set((state) => {
                        const exists = state.entries.some((entry) => entry.id === reply.id);
                        const next = { ...reply, ...patch };
                        Object.assign(reply, patch);
                        return {
                            entries: exists
                                ? state.entries.map((entry) =>
                                      entry.id === reply.id ? next : entry,
                                  )
                                : [...state.entries, next],
                        };
                    });
                const onEvent = (event: AgentEvent) => {
                    if (event.type === 'TEXT_MESSAGE_CONTENT') {
                        push({ text: (reply.text ?? '') + event.delta });
                    } else if (
                        event.type === 'CUSTOM' &&
                        event.name === 'a2ui' &&
                        Array.isArray(event.value)
                    ) {
                        const surfaceId = applyA2ui(event.value);
                        if (surfaceId) {
                            firstSurfaceMs ??= Math.round(performance.now() - started);
                            push({ surfaceId, a2ui: event.value });
                            trackEvent('a2ui_render', {
                                surfaceId,
                                value: {
                                    ms: firstSurfaceMs,
                                    components: componentTypes(event.value),
                                },
                            });
                        }
                    } else if (event.type === 'STATE_SNAPSHOT') {
                        set({ agentState: event.snapshot });
                    } else if (event.type === 'RUN_ERROR') {
                        push({ text: event.message, error: true });
                    }
                };
                try {
                    await runAgent(
                        {
                            threadId: get().threadId,
                            runId: newId(),
                            messages: history,
                            state: { ...get().agentState, locale },
                        },
                        onEvent,
                    );
                } catch (error) {
                    const status = error instanceof AgentHttpError ? error.status : 0;
                    push({
                        error: true,
                        text:
                            status === 429
                                ? 'Bạn đã dùng hết lượt hỏi trợ lý trong giờ này. Vui lòng thử lại sau.'
                                : status === 403
                                  ? 'Trợ lý mua hàng chỉ dành cho khách hàng.'
                                  : 'Trợ lý hiện chưa thể phản hồi. Bạn vẫn có thể tìm sản phẩm ở trang danh mục.',
                    });
                } finally {
                    set({ busy: false });
                }
            },
        }),
        {
            name: 'btb.assistant',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                threadId: state.threadId,
                entries: state.entries.slice(-30),
                agentState: state.agentState,
            }),
            // Dựng lại các surface hợp lệ gần nhất từ message đã lưu.
            onRehydrateStorage: () => (state) => {
                state?.entries.forEach((entry) => entry.a2ui && applyA2ui(entry.a2ui));
            },
        },
    ),
);

/** Loại component trong message updateComponents, ghi vào sự kiện a2ui_render (đếm số lần hiển thị). */
function componentTypes(messages: unknown[]): string[] {
    for (const message of messages) {
        const update = (message as { updateComponents?: { components?: { component?: string }[] } })
            .updateComponents;
        if (update?.components)
            return update.components.map((component) => component.component ?? '?');
    }
    return [];
}
