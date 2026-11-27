import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { A2uiSurface } from '@a2ui/react/v0_9';
import { ArrowLeft } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { getCatalogSearchPath } from '@/constants/catalogNavigation';
import { AgentHttpError, runAgent, type AgentEvent } from '@/a2ui/client/agentClient';
import { applyA2ui, getSurface } from '@/a2ui/runtime/a2uiRuntime';
import {
    personalizationEnabled,
    subscribePersonalization,
    trackEvent,
} from '@/a2ui/telemetry/interactionTracker';
import { useAuthStore } from '@/store/admin/authStore';

const DEFAULT_PROMPT = 'Gợi ý trang mua sắm phù hợp với tôi';
const CACHE_PREFIX = 'btb.aiPage:catalog7:';
const CACHE_MS = 30 * 60 * 1000;

type View = { status: 'loading' | 'ready' | 'error'; surfaceId?: string; error?: string };

function readCache(key: string): unknown[] | null {
    try {
        const raw = sessionStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const cached = JSON.parse(raw) as { at: number; messages: unknown[] };
        return Date.now() - cached.at < CACHE_MS ? cached.messages : null;
    } catch {
        return null;
    }
}

function writeCache(key: string, messages: unknown[]) {
    try {
        sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), messages }));
    } catch {
        /* storage đầy hoặc bị chặn: vẫn hiển thị trang, chỉ không giữ lại khi Back */
    }
}

/**
 * Trang do AI dựng (chế độ Page): BE ghép widget A2UI theo mục đích người dùng, FE render bằng thư viện
 * widget. Trang mặc định vẫn luôn mở được; lỗi AI thì hiện lối về trang mặc định.
 */
export default function AiGeneratedPage() {
    const [params] = useSearchParams();
    const query = params.get('q')?.trim() ?? '';
    const prompt = query || DEFAULT_PROMPT;
    const { i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi';
    const owner = useAuthStore((state) => state.session?.user.id);
    const personalized = useSyncExternalStore(subscribePersonalization, personalizationEnabled);
    const cacheKey = JSON.stringify([owner, personalized, locale, prompt]);
    const defaultPath = query ? getCatalogSearchPath(query) : '/';

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            {/* key: đổi yêu cầu, ngôn ngữ hoặc bấm Dựng lại thì dựng một trang mới từ đầu. */}
            <GeneratedSurface
                key={cacheKey}
                cacheKey={cacheKey}
                prompt={prompt}
                locale={locale}
                useCache={true}
                defaultPath={defaultPath}
            />
        </StorefrontLayout>
    );
}

function GeneratedSurface({
    prompt,
    locale,
    cacheKey,
    useCache,
    defaultPath,
}: {
    prompt: string;
    locale: 'vi' | 'en';
    useCache: boolean;
    cacheKey: string;
    defaultPath: string;
}) {
    const [view, setView] = useState<View>(() => {
        const cached = useCache ? readCache(cacheKey) : null;
        const surfaceId = cached ? applyA2ui(cached) : undefined;
        return surfaceId ? { status: 'ready', surfaceId } : { status: 'loading' };
    });
    const fromCache = view.status === 'ready' && useCache;

    useEffect(() => {
        if (fromCache) return;
        const abort = new AbortController();
        const started = performance.now();
        let errorText = '';
        const onEvent = (event: AgentEvent) => {
            if (event.type === 'CUSTOM' && event.name === 'a2ui' && Array.isArray(event.value)) {
                const surfaceId = applyA2ui(event.value);
                if (surfaceId) {
                    writeCache(cacheKey, event.value);
                    setView({ status: 'ready', surfaceId });
                    trackEvent('a2ui_render', {
                        surfaceId,
                        value: { ms: Math.round(performance.now() - started), mode: 'page' },
                    });
                }
            } else if (event.type === 'RUN_ERROR') {
                errorText = event.message;
            }
        };
        runAgent(
            {
                threadId: crypto.randomUUID(),
                runId: crypto.randomUUID(),
                messages: [{ role: 'user', content: prompt }],
                state: { locale },
                mode: 'page',
            },
            onEvent,
            abort.signal,
        )
            .then(() => {
                if (abort.signal.aborted) return;
                setView((current) =>
                    current.status === 'ready'
                        ? current
                        : {
                              status: 'error',
                              error: errorText || 'AI chưa dựng được trang lúc này.',
                          },
                );
            })
            .catch((err) => {
                if (abort.signal.aborted) return;
                const status = err instanceof AgentHttpError ? err.status : 0;
                setView({
                    status: 'error',
                    error:
                        status === 429
                            ? 'Bạn đã dùng hết lượt dựng trang bằng AI trong giờ này.'
                            : 'AI chưa dựng được trang lúc này.',
                });
            });
        return () => abort.abort();
        // fromCache chỉ quyết định ở lần đầu; component được dựng lại (key) khi yêu cầu đổi.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const surface = view.status === 'ready' ? getSurface(view.surfaceId) : undefined;

    return (
        <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 font-semibold !text-store-green visited:!text-store-green hover:!text-store-ink underline underline-offset-4"
                >
                    <ArrowLeft size={16} aria-hidden="true" />{' '}
                    {locale === 'en' ? 'Back to home' : 'Về trang chủ'}
                </Link>
            </div>

            {view.status === 'loading' && (
                <div
                    className="space-y-6 animate-pulse"
                    role="status"
                    aria-label={locale === 'en' ? 'Preparing your page' : 'Đang chuẩn bị giao diện'}
                >
                    <span className="sr-only">
                        {locale === 'en' ? 'Preparing your page' : 'Đang chuẩn bị giao diện'}
                    </span>
                    <div className="h-10 w-2/3 max-w-lg rounded-lg bg-stone-300/60" />
                    <div className="h-4 w-4/5 max-w-2xl rounded bg-stone-300/40" />
                    <div className="rounded-2xl border border-stone-200 bg-white/70 p-6 space-y-5">
                        <div className="h-7 w-40 rounded bg-stone-300/60" />
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 rounded-xl bg-stone-300/50" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 w-2/3 rounded bg-stone-300/50" />
                                    <div className="h-3 w-1/3 rounded bg-stone-300/40" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view.status === 'error' && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
                    <p className="font-bold">{view.error}</p>
                    <p className="mt-1">
                        Bạn vẫn có thể dùng{' '}
                        <Link to={defaultPath} className="font-semibold underline">
                            trang mặc định
                        </Link>
                        .
                    </p>
                </div>
            )}

            {surface && (
                <div className="a2ui-page text-store-ink [--a2ui-color-on-background:var(--color-store-ink)] [--a2ui-color-on-surface:var(--color-store-ink)] [--a2ui-text-caption-color:var(--color-store-ink)] [--a2ui-text-color-text:var(--color-store-ink)]">
                    <A2uiSurface surface={surface} />
                </div>
            )}
        </div>
    );
}
