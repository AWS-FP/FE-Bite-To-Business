import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MessageProcessor, type ActionPayload } from '@a2ui/web_core/v0_9';
import type { ReactComponentImplementation } from '@a2ui/react/v0_9';
import { ALLOWED_ACTIONS, btbCatalog, BTB_CATALOG_ID } from '../catalog/btbCatalog';
import type { A2uiProduct } from '../catalog/productTypes';
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

type ActionHandler = (action: ActionPayload, product: A2uiProduct | null) => void;

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

let actionHandler: ActionHandler | null = null;
/** Khung chat đăng ký handler có navigate/cart; processor chỉ có một handler toàn cục. */
export function setAssistantActionHandler(handler: ActionHandler | null) {
    actionHandler = handler;
}

let processor: MessageProcessor<ReactComponentImplementation> | null = null;
export function getProcessor() {
    if (!processor) {
        processor = new MessageProcessor<ReactComponentImplementation>([btbCatalog], (action) => {
            if (!ALLOWED_ACTIONS.has(action.name)) return;
            const product = findProduct(action.surfaceId, action.context?.productId);
            trackEvent('a2ui_action', {
                surfaceId: action.surfaceId,
                component: action.sourceComponentId,
                target:
                    typeof action.context?.productId === 'string'
                        ? action.context.productId
                        : undefined,
                value: { name: action.name },
            });
            actionHandler?.(action, product);
        });
    }
    return processor;
}

/** Đưa message A2UI vào processor; message sai catalog/schema bị bỏ để không làm vỡ khung chat. */
function applyA2ui(messages: unknown[]): string | undefined {
    let surfaceId: string | undefined;
    for (const message of messages) {
        try {
            const create = (message as { createSurface?: { surfaceId: string; catalogId: string } })
                .createSurface;
            if (create && create.catalogId !== BTB_CATALOG_ID) continue;
            if (create && getProcessor().model.surfacesMap.has(create.surfaceId)) continue;
            getProcessor().processMessages(message as never);
            surfaceId = create?.surfaceId ?? surfaceId;
        } catch (error) {
            console.warn('A2UI message rejected', error);
            trackEvent('a2ui_rejected', { value: { reason: String(error).slice(0, 200) } });
        }
    }
    return surfaceId;
}

function findProduct(surfaceId: string, productId: unknown): A2uiProduct | null {
    if (typeof productId !== 'string') return null;
    for (const entry of useAssistantStore.getState().entries) {
        if (entry.surfaceId !== surfaceId) continue;
        for (const message of entry.a2ui ?? []) {
            const update = (
                message as { updateDataModel?: { value?: { products?: A2uiProduct[] } } }
            ).updateDataModel;
            const found = update?.value?.products?.find(
                (product) => product.productId === productId,
            );
            if (found) return found;
        }
    }
    return null;
}

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

function componentTypes(messages: unknown[]): string[] {
    for (const message of messages) {
        const update = (message as { updateComponents?: { components?: { component?: string }[] } })
            .updateComponents;
        if (update?.components)
            return update.components.map((component) => component.component ?? '?');
    }
    return [];
}
