import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { FormEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { getCatalogSearchPath } from '../../../constants/catalogNavigation';
import useSearchHistory from '../../../hooks/useSearchHistory';
import SearchModeDropdown from './SearchModeDropdown';

export default function StoreSearch() {
    const { t } = useTranslation('storefront');
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [searchMode, setSearchMode] = useState<'products' | 'ai'>('products');
    const [showAINotice, setShowAINotice] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { history, isLoadingHistory, isHistoryUnavailable, recordSearch } = useSearchHistory();

    async function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSearching) return;

        const searchText = keyword.replace(/\s+/gu, ' ').trim();
        if (!searchText) return;

        if (searchMode === 'ai') {
            setShowAINotice(true);
            return;
        }

        await searchFor(searchText);
    }

    async function searchFor(searchText: string) {
        if (isSearching) return;
        setIsSearching(true);
        try {
            const canNavigate = await recordSearch(searchText);
            if (canNavigate) navigate(getCatalogSearchPath(searchText));
        } finally {
            setIsSearching(false);
        }
    }

    async function handleHistoryClick(event: MouseEvent<HTMLAnchorElement>, searchText: string) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
            return;
        event.preventDefault();
        await searchFor(searchText);
    }

    return (
        <div className="min-w-0 flex-1">
            <form
                className="flex h-[46px] min-w-0 items-center rounded-full border-2 border-solid border-store-ink bg-store-cream shadow-[3px_3px_0_var(--color-store-ink)]"
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
                    className="h-9 min-w-0 flex-1 rounded-full border-0 bg-transparent px-2.5 text-[12px] text-store-ink outline-none placeholder:text-store-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-store-green"
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
                    className="flex h-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-r-full border-0 border-l-2 border-solid border-store-ink bg-store-yellow px-3.5 text-[12px] font-extrabold text-store-ink transition-colors hover:bg-store-yellow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
                    type="submit"
                    aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.submit')}
                    disabled={isSearching}
                    aria-busy={isSearching}
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

            <div
                className="mt-2 flex min-h-[20px] items-center gap-1.5 overflow-x-auto px-2 text-[11px] leading-[1.5] [scrollbar-width:thin]"
                aria-label={t('search.history')}
            >
                <span className="shrink-0 text-store-cream/75">{t('search.history')}</span>
                {isLoadingHistory && (
                    <span className="shrink-0 text-store-cream/60" role="status">
                        · {t('search.loadingHistory')}
                    </span>
                )}
                {isHistoryUnavailable && (
                    <span className="shrink-0 text-store-cream/60" role="status">
                        · {t('search.historyUnavailable')}
                    </span>
                )}
                {!isLoadingHistory && !isHistoryUnavailable && history.length === 0 && (
                    <span className="shrink-0 text-store-cream/60">
                        · {t('search.emptyHistory')}
                    </span>
                )}
                {history.map((searchText) => (
                    <Link
                        className="shrink-0 rounded-full border border-solid border-white/15 bg-white/10 px-2 py-0.5 text-store-cream no-underline hover:bg-white/20"
                        key={searchText}
                        to={getCatalogSearchPath(searchText)}
                        onClick={(event) => handleHistoryClick(event, searchText)}
                    >
                        {searchText}
                    </Link>
                ))}
            </div>
        </div>
    );
}
