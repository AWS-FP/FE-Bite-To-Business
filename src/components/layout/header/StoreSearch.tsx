import { useEffect, useRef, useState } from 'react';
import { Sparkles, Trash2, X } from 'lucide-react';
import type { FormEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { getCatalogSearchPath } from '../../../constants/catalogNavigation';
import useSearchHistory from '../../../hooks/useSearchHistory';
import SearchModeDropdown from './SearchModeDropdown';
import { useAssistantStore } from '@/a2ui/runtime/assistantStore';
import { trackEvent } from '@/a2ui/telemetry/interactionTracker';

export default function StoreSearch() {
    const { t, i18n } = useTranslation('storefront');
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [searchMode, setSearchMode] = useState<'products' | 'ai'>('products');
    const [showAINotice, setShowAINotice] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { historyEntries, recordSearch, deleteSearch, clearHistory, deleting, deleteError } =
        useSearchHistory();
    const historyRef = useRef<HTMLElement>(null);
    const dragRef = useRef<{ startX: number; initialScroll: number; moved: boolean } | null>(null);
    const suppressHistoryClick = useRef(false);

    function startDrag(event: React.PointerEvent<HTMLElement>) {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        const container = historyRef.current;
        if (!container) return;
        dragRef.current = {
            startX: event.clientX,
            initialScroll: container.scrollLeft,
            moved: false,
        };
    }
    function moveDrag(event: React.PointerEvent<HTMLElement>) {
        const drag = dragRef.current;
        const container = historyRef.current;
        if (!drag || !container) return;
        const distance = event.clientX - drag.startX;
        if (Math.abs(distance) > 5) drag.moved = true;
        if (drag.moved) {
            container.scrollLeft = drag.initialScroll - distance;
            suppressHistoryClick.current = true;
        }
    }
    function stopDrag() {
        dragRef.current = null;
        // Pointerup occurs before click; keep the guard until the browser dispatches it.
        window.setTimeout(() => {
            suppressHistoryClick.current = false;
        }, 0);
    }
    // Mouse-wheel scrolling moves search chips horizontally. A non-passive native
    // listener is required because React registers wheel listeners as passive.
    useEffect(() => {
        const container = historyRef.current;
        if (!container) return;

        function handleHistoryWheel(event: WheelEvent) {
            if (!container || event.ctrlKey) return;
            // Touchpads already send horizontal deltaX; let the browser handle those.
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

            const maxScroll = container.scrollWidth - container.clientWidth;
            if (maxScroll <= 1 || event.deltaY === 0) return;
            const multiplier =
                event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? container.clientWidth : 1;
            const distance = event.deltaY * multiplier;
            const nextScroll = Math.max(0, Math.min(maxScroll, container.scrollLeft + distance));
            // At either end, do not trap the wheel: allow the page to scroll normally.
            if (Math.abs(nextScroll - container.scrollLeft) < 0.5) return;
            event.preventDefault();
            container.scrollLeft = nextScroll;
        }

        container.addEventListener('wheel', handleHistoryWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleHistoryWheel);
    }, [historyEntries.length]);

    async function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await searchFor(keyword);
    }

    async function searchFor(value: string) {
        const searchText = value.replace(/\s+/gu, ' ').trim();
        if (!searchText) return;

        if (searchMode === 'ai') {
            // Chế độ AI: mở trợ lý mua hàng và gửi câu hỏi để AI dựng giao diện kết quả.
            const assistant = useAssistantStore.getState();
            assistant.setOpen(true);
            setKeyword('');
            void assistant.send(searchText, i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi');
            return;
        }

        if (isSearching) return;
        setIsSearching(true);
        try {
            trackEvent('search', { value: { q: searchText } });
            const shouldNavigate = await recordSearch(searchText);
            if (shouldNavigate) navigate(getCatalogSearchPath(searchText));
        } finally {
            setIsSearching(false);
        }
    }

    async function handleHistoryClick(event: MouseEvent<HTMLAnchorElement>, word: string) {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0)
            return;
        event.preventDefault();
        await searchFor(word);
    }

    return (
        <div className="min-w-0 max-w-[720px] flex-[1_1_720px]">
            <form
                className="focus-border-group flex h-[52px] min-w-0 items-center rounded-full border-2 border-solid border-store-ink bg-store-cream shadow-[3px_3px_0_var(--color-store-ink)] focus-within:border-store-green"
                role="search"
                aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.label')}
                onSubmit={handleSearch}
            >
                <SearchModeDropdown
                    value={searchMode}
                    onChange={(mode) => {
                        setSearchMode(mode);
                        setShowAINotice(false);
                    }}
                />

                <input
                    className="h-9 min-w-0 flex-1 rounded-full border-0 bg-transparent px-2.5 text-[12px] text-store-ink outline-none placeholder:text-store-muted"
                    type="search"
                    name="q"
                    aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.label')}
                    placeholder={t(
                        searchMode === 'ai' ? 'search.aiPlaceholder' : 'search.placeholder',
                    )}
                    maxLength={100}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />

                <button
                    className="flex h-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-r-full border-0 border-l-2 border-solid border-store-ink bg-store-yellow px-3.5 text-[12px] font-extrabold text-store-ink transition-colors hover:bg-[#ffe97b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
                    type="submit"
                    aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.submit')}
                    disabled={isSearching}
                >
                    {searchMode === 'ai' ? (
                        <Sparkles size={16} className="shrink-0" aria-hidden="true" />
                    ) : (
                        <img
                            className="block shrink-0"
                            src="/images/storefront/search.svg"
                            alt=""
                        />
                    )}
                    <span>{t(searchMode === 'ai' ? 'search.askAI' : 'search.submit')}</span>
                </button>
            </form>

            {showAINotice && (
                <p className="mt-2 px-2 text-[11px] leading-[1.5] text-store-cream" role="status">
                    {t('search.aiUnavailable')}
                </p>
            )}

            {historyEntries.length > 0 && (
                <div className="mt-2 flex min-w-0 items-center gap-1.5 border-0 bg-transparent py-1">
                    <nav
                        ref={historyRef}
                        className="flex min-w-0 flex-1 cursor-grab select-none items-center gap-2 overflow-x-auto whitespace-nowrap touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
                        aria-label={t('search.history')}
                        onPointerDown={startDrag}
                        onPointerMove={moveDrag}
                        onPointerUp={stopDrag}
                        onPointerCancel={stopDrag}
                        onPointerLeave={stopDrag}
                        onClickCapture={(event) => {
                            if (suppressHistoryClick.current) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }}
                    >
                        {historyEntries.map((entry) => (
                            <span
                                key={entry.id}
                                className="inline-flex max-w-[220px] shrink-0 items-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-[11px] text-store-cream"
                            >
                                <Link
                                    to={getCatalogSearchPath(entry.keyword)}
                                    onClick={(event) =>
                                        void handleHistoryClick(event, entry.keyword)
                                    }
                                    title={entry.keyword}
                                    className="block min-w-0 max-w-[182px] truncate px-3 py-1.5 text-store-cream no-underline hover:bg-white/10"
                                >
                                    {entry.keyword}
                                </Link>
                                <button
                                    type="button"
                                    disabled={deleting}
                                    aria-label={`${t('searchHistory.remove')}: ${entry.keyword}`}
                                    title={t('searchHistory.remove')}
                                    onClick={() => void deleteSearch(entry.id)}
                                    className="flex size-7 shrink-0 cursor-pointer items-center justify-center border-0 border-l border-white/20 bg-transparent text-store-cream hover:bg-red-500/30 disabled:opacity-50"
                                >
                                    <X size={13} aria-hidden="true" />
                                </button>
                            </span>
                        ))}
                    </nav>
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={() => {
                            if (window.confirm(t('searchHistory.confirmClear')))
                                void clearHistory();
                        }}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-transparent px-2.5 py-1.5 text-[11px] text-store-cream hover:bg-red-500/20 disabled:opacity-50"
                    >
                        <Trash2 size={12} aria-hidden="true" />
                        {t('searchHistory.clearAll')}
                    </button>
                </div>
            )}
            {deleteError && (
                <p role="alert" className="mt-1 px-2 text-xs text-red-200">
                    {t('searchHistory.deleteError')}
                </p>
            )}
        </div>
    );
}
