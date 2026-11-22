import { useState } from 'react';
import { Sparkles, Trash2, X } from 'lucide-react';
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
    const { historyEntries, recordSearch, deleteSearch, clearHistory, deleting, deleteError } =
        useSearchHistory();

    async function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await searchFor(keyword);
    }

    async function searchFor(value: string) {
        const searchText = value.replace(/\s+/gu, ' ').trim();
        if (!searchText) return;

        if (searchMode === 'ai') {
            setShowAINotice(true);
            return;
        }

        if (isSearching) return;
        setIsSearching(true);
        try {
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
                <nav
                    className="mt-2 flex flex-wrap items-center gap-2 px-2"
                    aria-label={t('search.history')}
                >
                    {historyEntries.map((entry) => (
                        <span
                            key={entry.id}
                            className="inline-flex items-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-[11px] text-store-cream"
                        >
                            <Link
                                to={getCatalogSearchPath(entry.keyword)}
                                onClick={(event) => void handleHistoryClick(event, entry.keyword)}
                                className="px-3 py-1.5 text-store-cream no-underline hover:bg-white/10"
                            >
                                {entry.keyword}
                            </Link>
                            <button
                                type="button"
                                disabled={deleting}
                                aria-label={`${t('searchHistory.remove')}: ${entry.keyword}`}
                                title={t('searchHistory.remove')}
                                onClick={() => void deleteSearch(entry.id)}
                                className="flex size-7 cursor-pointer items-center justify-center border-0 border-l border-white/20 bg-transparent text-store-cream hover:bg-red-500/30 disabled:opacity-50"
                            >
                                <X size={13} aria-hidden="true" />
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={() => {
                            if (window.confirm(t('searchHistory.confirmClear')))
                                void clearHistory();
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-transparent px-2.5 py-1.5 text-[11px] text-store-cream hover:bg-red-500/20 disabled:opacity-50"
                    >
                        <Trash2 size={12} aria-hidden="true" />
                        {t('searchHistory.clearAll')}
                    </button>
                </nav>
            )}
            {deleteError && (
                <p role="alert" className="mt-1 px-2 text-xs text-red-200">
                    {t('searchHistory.deleteError')}
                </p>
            )}
        </div>
    );
}
