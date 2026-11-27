import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { A2uiSurface } from '@a2ui/react/v0_9';
import { ArrowLeft } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { getCatalogSearchPath } from '@/constants/catalogNavigation';
import { AgentHttpError, runAgent, type AgentEvent } from '@/a2ui/client/agentClient';
import { applyA2ui, getSurface } from '@/a2ui/runtime/a2uiRuntime';
import { createStablePage } from '@/a2ui/runtime/stablePage';
import {
    personalizationEnabled,
    subscribePersonalization,
    trackEvent,
} from '@/a2ui/telemetry/interactionTracker';
import { useAuthStore } from '@/store/admin/authStore';

const DEFAULT_PROMPT = 'Gợi ý trang mua sắm phù hợp với tôi';
const CACHE_PREFIX = 'btb.aiPage:catalog9:';
const CACHE_MS = 30 * 60 * 1000;

type View = {
    status: 'loading' | 'ready' | 'answer' | 'error';
    surfaceId?: string;
    error?: string;
    text?: string;
    notice?: string;
};

type CachedPage = { at: number; locale: 'vi' | 'en'; messages: unknown[] };
function readCache(key: string): CachedPage | null {
    try {
        const raw = sessionStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const cached = JSON.parse(raw) as CachedPage;
        return Date.now() - cached.at < CACHE_MS ? cached : null;
    } catch {
        return null;
    }
}

function writeCache(key: string, messages: unknown[], locale: 'vi' | 'en') {
    try {
        sessionStorage.setItem(
            CACHE_PREFIX + key,
            JSON.stringify({ at: Date.now(), messages, locale }),
        );
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
    const subject = params.get('subject')?.slice(0, 100) ?? '';
    const comparison = params.get('view') === 'table';
    const { i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi';
    const owner = useAuthStore((state) => state.session?.user.id);
    const personalized = useSyncExternalStore(subscribePersonalization, personalizationEnabled);
    const cacheKey = JSON.stringify([owner, personalized, prompt, subject, comparison]);
    const defaultPath = query ? getCatalogSearchPath(query) : '/';

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            {/* A language change keeps the same selected products and composition. */}
            <GeneratedSurface
                key={cacheKey}
                cacheKey={cacheKey}
                prompt={prompt}
                locale={locale}
                subject={subject}
                comparison={comparison}
                defaultPath={defaultPath}
            />
        </StorefrontLayout>
    );
}

function GeneratedSurface({
    prompt,
    locale,
    cacheKey,
    subject,
    comparison,
    defaultPath,
}: {
    prompt: string;
    locale: 'vi' | 'en';
    subject: string;
    comparison: boolean;
    cacheKey: string;
    defaultPath: string;
}) {
    const [view, setView] = useState<View>(() => {
        const cached = readCache(cacheKey);
        const surfaceId = cached ? applyA2ui(cached.messages) : undefined;
        return surfaceId ? { status: 'ready', surfaceId } : { status: 'loading' };
    });
    useEffect(() => {
        const cached = readCache(cacheKey);
        if (cached?.locale === locale) return;
        const abort = new AbortController();
        const started = performance.now();
        let errorText = '';
        let answerText = '';
        let receivedSurface = false;
        const onEvent = (event: AgentEvent) => {
            if (abort.signal.aborted) return;
            if (event.type === 'CUSTOM' && event.name === 'a2ui' && Array.isArray(event.value)) {
                const surfaceId = applyA2ui(event.value);
                if (surfaceId) {
                    receivedSurface = true;
                    writeCache(cacheKey, event.value, locale);
                    setView({ status: 'ready', surfaceId });
                    trackEvent('a2ui_render', {
                        surfaceId,
                        value: { ms: Math.round(performance.now() - started), mode: 'page' },
                    });
                }
            } else if (event.type === 'TEXT_MESSAGE_CONTENT') {
                answerText += event.delta;
            } else if (event.type === 'RUN_ERROR') {
                errorText = event.message;
            }
        };
        runAgent(
            {
                threadId: crypto.randomUUID(),
                runId: crypto.randomUUID(),
                messages: [{ role: 'user', content: prompt }],
                state: {
                    locale,
                    ...(comparison
                        ? { view: 'table' as const, lastQuery: subject || undefined }
                        : {}),
                },
                mode: 'page',
                stablePage: cached ? createStablePage(cached.messages, cached.locale) : undefined,
            },
            onEvent,
            abort.signal,
        )
            .then(() => {
                if (abort.signal.aborted) return;
                setView((current) =>
                    receivedSurface
                        ? current
                        : cached && current.status === 'ready'
                          ? {
                                ...current,
                                notice:
                                    locale === 'en'
                                        ? 'Text could not be translated right now. Your products and layout have been kept.'
                                        : 'Chưa chuyển được nội dung sang ngôn ngữ này. Danh sách sản phẩm và bố cục vẫn được giữ nguyên.',
                            }
                          : answerText && !errorText
                            ? { status: 'answer', text: answerText }
                            : {
                                  status: 'error',
                                  error: errorText || 'AI chưa dựng được trang lúc này.',
                              },
                );
            })
            .catch((err) => {
                if (abort.signal.aborted) return;
                if (cached) {
                    setView((current) => ({
                        ...current,
                        notice:
                            locale === 'en'
                                ? 'Translation is temporarily unavailable; your selection is unchanged.'
                                : 'Tạm thời chưa dịch được; lựa chọn sản phẩm được giữ nguyên.',
                    }));
                    return;
                }
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
    }, [cacheKey, prompt, locale, subject, comparison]);

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

            {view.notice && (
                <p
                    role="status"
                    className="rounded-xl border border-store-line bg-store-cream p-4 text-sm text-store-muted"
                >
                    {view.notice}
                </p>
            )}
            {view.status === 'answer' && (
                <div
                    role="status"
                    className="whitespace-pre-line rounded-xl border border-store-line bg-white p-5 text-sm text-store-ink"
                >
                    {view.text}
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
