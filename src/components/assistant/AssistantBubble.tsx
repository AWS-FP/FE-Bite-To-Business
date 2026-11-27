/**
 * Khung chat "Trợ lý mua hàng" nổi trên storefront. AI chỉ dành cho Customer đã đăng nhập: Guest bấm nút sẽ được
 * đưa tới trang đăng nhập rồi quay lại trang đang xem. Hiển thị tin nhắn và render surface A2UI
 * của từng lượt bằng A2uiSurface; action trên surface được xử lý bởi useA2uiActions (RootLayout).
 * Có ô tích bật/tắt dùng thói quen duyệt web để cá nhân hóa.
 */
import {
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type FormEvent,
    type CSSProperties,
    type PointerEvent,
    type KeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { Loader2, MoveDiagonal2, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { A2uiSurface } from '@a2ui/react/v0_9';
import { useAuthStore } from '@/store/admin/authStore';
import { useAssistantStore, type ChatEntry } from '@/a2ui/runtime/assistantStore';
import { getSurface } from '@/a2ui/runtime/a2uiRuntime';
import { aiPagePath } from '@/a2ui/runtime/useA2uiActions';
import './AssistantBubble.css';
import {
    personalizationEnabled,
    setPersonalizationEnabled,
    subscribePersonalization,
} from '@/a2ui/telemetry/interactionTracker';

/** Trợ lý mua hàng: chat + giao diện A2UI do AI sinh. Nhân viên/Admin không thấy; Guest thấy nút mời đăng nhập. */
export default function AssistantBubble() {
    const role = useAuthStore((state) => state.session?.user.role);
    const navigate = useNavigate();
    const location = useLocation();
    const { i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi';
    const { entries, busy, open, pendingPage, setOpen, send, reset } = useAssistantStore();
    const [text, setText] = useState('');
    const [size, setSize] = useState({ width: 440, height: 680 });
    const drag = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
    const personalize = useSyncExternalStore(subscribePersonalization, personalizationEnabled);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [entries.length, busy]);

    useEffect(() => {
        if (!pendingPage) return;
        useAssistantStore.setState({ pendingPage: null, open: false });
        navigate(aiPagePath(pendingPage));
    }, [pendingPage, navigate]);

    function resize(width: number, height: number) {
        setSize({
            width: Math.max(340, Math.min(width, window.innerWidth - 40)),
            height: Math.max(320, Math.min(height, window.innerHeight - 40)),
        });
    }

    function startResize(event: PointerEvent<HTMLButtonElement>) {
        if (event.button !== 0) return;
        const panel = event.currentTarget.parentElement?.getBoundingClientRect();
        if (!panel) return;
        event.preventDefault();
        drag.current = {
            x: event.clientX,
            y: event.clientY,
            width: panel.width,
            height: panel.height,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function moveResize(event: PointerEvent<HTMLButtonElement>) {
        if (!drag.current) return;
        resize(
            drag.current.width + drag.current.x - event.clientX,
            drag.current.height + drag.current.y - event.clientY,
        );
    }

    function resizeWithKeys(event: KeyboardEvent<HTMLButtonElement>) {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        resize(
            size.width + (event.key === 'ArrowLeft' ? 32 : event.key === 'ArrowRight' ? -32 : 0),
            size.height + (event.key === 'ArrowUp' ? 32 : event.key === 'ArrowDown' ? -32 : 0),
        );
    }

    if (role && role !== 'CUSTOMER') return null;

    function submit(event: FormEvent) {
        event.preventDefault();
        const value = text.trim();
        if (!value) return;
        setText('');
        void send(value, locale);
    }

    // Guest có thể còn trạng thái open từ phiên trước (sessionStorage): luôn hiện nút mời đăng nhập.
    if (!open || role !== 'CUSTOMER') {
        return (
            <button
                type="button"
                onClick={() =>
                    role === 'CUSTOMER'
                        ? setOpen(true)
                        : // Guest: AI cần biết đúng khách (ý định, thói quen) nên phải đăng nhập trước.
                          navigate(ROUTES.LOGIN, {
                              state: {
                                  from: { pathname: location.pathname, search: location.search },
                              },
                          })
                }
                title={role === 'CUSTOMER' ? undefined : 'Đăng nhập để dùng trợ lý AI'}
                className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-store-green px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-store-dark"
            >
                <Sparkles size={18} aria-hidden="true" /> Trợ lý mua hàng
            </button>
        );
    }

    return (
        <section
            aria-label="Trợ lý mua hàng"
            className="assistant-panel fixed inset-x-2 bottom-2 z-50 flex h-[min(680px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-xl border border-store-line bg-white shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5"
            style={
                {
                    '--assistant-width': `${size.width}px`,
                    '--assistant-height': `${size.height}px`,
                } as CSSProperties
            }
        >
            <button
                type="button"
                className="absolute left-0 top-0 z-10 hidden size-6 touch-none cursor-nwse-resize rounded-br border-0 bg-white/15 text-white sm:block"
                aria-label={
                    locale === 'en'
                        ? 'Resize chat using drag or arrow keys'
                        : 'Kéo hoặc dùng phím mũi tên để đổi kích thước chat'
                }
                onPointerDown={startResize}
                onPointerMove={moveResize}
                onPointerUp={() => {
                    drag.current = null;
                }}
                onPointerCancel={() => {
                    drag.current = null;
                }}
                onLostPointerCapture={() => {
                    drag.current = null;
                }}
                onKeyDown={resizeWithKeys}
            >
                <MoveDiagonal2 size={14} aria-hidden="true" />
            </button>
            <header className="flex items-center justify-between gap-2 bg-store-green px-4 py-3 text-white">
                <div>
                    <p className="flex items-center gap-2 text-sm font-bold">
                        <Sparkles size={16} aria-hidden="true" /> Trợ lý mua hàng
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={reset}
                        title="Cuộc trò chuyện mới"
                        className="rounded border-0 bg-transparent p-1.5 text-white hover:bg-white/10"
                    >
                        <RotateCcw size={16} aria-hidden="true" />
                        <span className="sr-only">Cuộc trò chuyện mới</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded border-0 bg-transparent p-1.5 text-white hover:bg-white/10"
                    >
                        <X size={18} aria-hidden="true" />
                        <span className="sr-only">Đóng</span>
                    </button>
                </div>
            </header>

            <div
                ref={listRef}
                className="min-h-0 min-w-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden bg-store-cream/40 px-3 py-3"
            >
                {entries.length === 0 && (
                    <div className="space-y-2 text-sm text-store-muted">
                        <p>Bạn cần mua gì? Mình sẽ dựng giao diện phù hợp, ví dụ:</p>
                        {[
                            'Có ba chỉ bò không?',
                            'So sánh whipping cream dạng bảng',
                            'Có gì mới về không?',
                        ].map((sample) => (
                            <button
                                key={sample}
                                type="button"
                                onClick={() => void send(sample, locale)}
                                className="block rounded-full bg-white px-3 py-1 text-xs font-semibold text-store-green shadow-sm"
                            >
                                {sample}
                            </button>
                        ))}
                    </div>
                )}
                {entries.map((entry) => (
                    <Entry key={entry.id} entry={entry} />
                ))}
                {busy && (
                    <p
                        className="inline-flex items-center gap-2 text-xs text-store-muted"
                        role="status"
                    >
                        <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Đang tìm
                        kiếm…
                    </p>
                )}
            </div>

            <form onSubmit={submit} className="border-t border-store-line bg-white p-2">
                <div className="flex gap-2">
                    <input
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        maxLength={1000}
                        placeholder="Hỏi về sản phẩm, giá sỉ, tồn kho…"
                        className="min-w-0 flex-1 rounded border border-store-line bg-white px-3 py-2 text-sm text-store-ink outline-none focus:border-store-green"
                    />
                    <button
                        type="submit"
                        disabled={busy || !text.trim()}
                        className="rounded bg-store-green px-3 text-white disabled:opacity-40"
                    >
                        <Send size={16} aria-hidden="true" />
                        <span className="sr-only">Gửi</span>
                    </button>
                </div>
                <label className="mt-1 flex items-center gap-1 text-[11px] text-store-muted">
                    <input
                        type="checkbox"
                        checked={personalize}
                        onChange={(event) => setPersonalizationEnabled(event.target.checked)}
                    />
                    {locale === 'en'
                        ? 'Use my customer profile, searches and browsing activity for personalized suggestions'
                        : 'Dùng hồ sơ, lịch sử tìm kiếm và duyệt web của tôi để cá nhân hóa gợi ý'}
                </label>
            </form>
        </section>
    );
}

/** Một mục hội thoại: tin nhắn người dùng, ghi chú hệ thống, hoặc câu trả lời kèm surface A2UI. */
function Entry({ entry }: { entry: ChatEntry }) {
    if (entry.role === 'user') {
        return (
            <p className="ml-auto max-w-[85%] rounded-lg bg-store-green px-3 py-2 text-sm text-white">
                {entry.text}
            </p>
        );
    }
    if (entry.role === 'system') {
        return <p className="text-center text-[11px] text-store-muted">{entry.text}</p>;
    }
    const surface = getSurface(entry.surfaceId);
    return (
        <div className="space-y-2">
            {entry.text && (
                <p
                    className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${entry.error ? 'bg-red-50 text-red-800' : 'bg-white text-black shadow-sm'}`}
                >
                    {entry.text}
                </p>
            )}
            {surface && (
                <div className="a2ui-surface min-w-0 max-w-full overflow-x-auto rounded-lg bg-white p-2 text-store-ink shadow-sm [--a2ui-color-on-background:var(--color-store-ink)] [--a2ui-color-on-surface:var(--color-store-ink)] [--a2ui-text-caption-color:var(--color-store-ink)] [--a2ui-text-color-text:var(--color-store-ink)]">
                    <A2uiSurface surface={surface} />
                </div>
            )}
        </div>
    );
}
