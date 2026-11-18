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
    const { history, recordSearch } = useSearchHistory();

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
                className="focus-border-group flex h-[46px] min-w-0 items-center rounded-full border-2 border-solid border-store-ink bg-store-cream shadow-[3px_3px_0_var(--color-store-ink)] focus-within:border-store-green"
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

            {/* Only show actual past searches. No empty/loading/unavailable debug-like status line. */}
            {history.length > 0 && (
                <nav
                    className="mt-2 flex flex-wrap items-center gap-1.5 px-2"
                    aria-label={t('search.history')}
                >
                    {history.map((searchText) => (
                        <Link
                            key={searchText}
                            to={getCatalogSearchPath(searchText)}
                            onClick={(event) => handleHistoryClick(event, searchText)}
                            className="shrink-0 rounded-full border border-solid border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-store-cream no-underline hover:bg-white/20"
                        >
                            {searchText}
                        </Link>
                    ))}
                </nav>
            )}
        </div>
    );
}
