/**
 * Store khung chat trợ lý (chế độ chat): lịch sử hội thoại, gọi /api/ai/agent, áp surface A2UI trả về.
 * Lưu ở sessionStorage để tải lại trang vẫn dựng lại được các khối giao diện cũ (last valid surface).
 * Ngắn hạn: STATE_SNAPSHOT (kiểu hiển thị, từ khóa, sort) được gửi lại ở lượt sau qua `state`.
 */
import { create } from 'zustand';
import { useAuthStore } from '@/store/admin/authStore';
import { createJSONStorage, persist } from 'zustand/middleware';
import { applyA2ui } from './a2uiRuntime';
import { AgentHttpError, runAgent, type AgentEvent, type AgentState } from '../client/agentClient';
import { trackEvent } from '../telemetry/interactionTracker';
import { safeAssistantText } from './assistantText';

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
    owner: string | null;
    threadId: string;
    entries: ChatEntry[];
    agentState: AgentState;
    busy: boolean;
    open: boolean;
    pendingPage: { prompt: string; subject?: string; view?: 'table' } | null;
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
            owner: null,
            threadId: newId(),
            entries: [],
            agentState: {},
            busy: false,
            open: false,
            pendingPage: null,
            setOpen: (open) => set({ open }),
            reset: () =>
                set({
                    threadId: newId(),
                    entries: [],
                    agentState: {},
                    busy: false,
                    pendingPage: null,
                }),
            note: (text) =>
                set((state) => ({
                    entries: [...state.entries, { id: newId(), role: 'system', text }],
                })),
            send: async (text, locale) => {
                const content = text.trim();
                if (!content || get().busy) return;
                const threadId = get().threadId;
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
                let rawResponseText = '';
                const push = (patch: Partial<ChatEntry>) =>
                    set((state) => {
                        if (state.threadId !== threadId) return state;
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
                    if (get().threadId !== threadId) return;
                    if (event.type === 'CUSTOM' && event.name === 'open_ai_page') {
                        const value = event.value as {
                            prompt?: unknown;
                            subject?: unknown;
                            view?: unknown;
                        };
                        if (typeof value?.prompt === 'string' && value.prompt.trim()) {
                            set({
                                pendingPage: {
                                    prompt: value.prompt,
                                    subject:
                                        typeof value.subject === 'string'
                                            ? value.subject
                                            : undefined,
                                    view: value.view === 'table' ? 'table' : undefined,
                                },
                            });
                        }
                    } else if (event.type === 'TEXT_MESSAGE_CONTENT') {
                        rawResponseText += event.delta;
                        push({ text: safeAssistantText(rawResponseText, locale) });
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
                            threadId,
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
                                ? error instanceof AgentHttpError &&
                                  error.code === 'AI_RATE_LIMIT_EXCEEDED'
                                    ? 'Bạn đã dùng hết 50 lượt hỏi AI trong một giờ. Vui lòng thử lại sau.'
                                    : 'Trợ lý đang nhận quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.'
                                : status === 401
                                  ? 'Phiên đăng nhập có thể đã hết hạn. Bạn hãy đăng nhập lại rồi thử nhé.'
                                  : status === 403
                                    ? 'Trợ lý mua hàng chỉ dành cho khách hàng.'
                                    : status === 400
                                      ? 'Không thể xử lý nội dung hoặc trạng thái cuộc trò chuyện. Hãy tạo cuộc trò chuyện mới rồi thử lại.'
                                      : status >= 500
                                        ? `Máy chủ trợ lý đang gặp lỗi (${status}). Vui lòng thử lại sau.`
                                        : status === 0
                                          ? 'Không kết nối được đến trợ lý. Hãy kiểm tra kết nối hoặc máy chủ BE.'
                                          : `Trợ lý chưa thể phản hồi (mã ${status}). Vui lòng thử lại.`,
                    });
                } finally {
                    if (get().threadId === threadId) set({ busy: false });
                }
            },
        }),
        {
            name: 'btb.assistant',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                owner: state.owner,
                threadId: state.threadId,
                entries: state.entries.slice(-30),
                agentState: state.agentState,
            }),
            // Dựng lại các surface hợp lệ gần nhất từ message đã lưu.
            onRehydrateStorage: () => (state) => {
                state?.entries.forEach((entry) => {
                    if (entry.role === 'assistant' && entry.text) {
                        const safe = safeAssistantText(entry.text, state.agentState.locale);
                        if (safe !== entry.text) {
                            entry.text = safe;
                            entry.a2ui = undefined;
                            entry.surfaceId = undefined;
                        }
                    }
                    if (entry.a2ui) applyA2ui(entry.a2ui);
                });
            },
        },
    ),
);

function syncChatOwner(auth: ReturnType<typeof useAuthStore.getState>) {
    if (auth.restoring) return;
    const owner = auth.session?.user.id ?? null;
    const chat = useAssistantStore.getState();
    if (owner !== chat.owner || (!owner && chat.entries.length > 0)) {
        useAssistantStore.setState({
            owner,
            threadId: newId(),
            entries: [],
            agentState: {},
            busy: false,
            open: false,
            pendingPage: null,
        });
    }
}

syncChatOwner(useAuthStore.getState());
useAuthStore.subscribe(syncChatOwner);

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
