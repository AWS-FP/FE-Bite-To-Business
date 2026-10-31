import { useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
    dryCategoryKeys,
    freshCategoryKeys,
    getCatalogSearchPath,
} from '../../../constants/catalogNavigation';
import useSearchHistory from '../../../hooks/useSearchHistory';

export default function StoreSearch() {
    const { t } = useTranslation('storefront');
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [categoryKey, setCategoryKey] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const { history, isLoadingHistory, isHistoryUnavailable, recordSearch } = useSearchHistory();
    const categoryKeys = [...freshCategoryKeys, ...dryCategoryKeys];

    async function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSearching) return;

        let searchText = keyword.trim();
        if (categoryKey) {
            searchText = `${t(`categories.${categoryKey}`)} ${searchText}`.trim();
        }
        searchText = searchText.replace(/\s+/gu, ' ').trim();
        if (!searchText) return;

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
        <div className="min-w-0 flex-1 max-[960px]:order-3 max-[960px]:basis-full">
            <form
                className="flex h-[46px] min-w-0 items-center rounded-full border-2 border-solid border-store-ink bg-[#fffdf9] shadow-[3px_3px_0_#14132b]"
                role="search"
                aria-label={t('search.label')}
                onSubmit={handleSearch}
            >
                <div className="relative ml-2 hidden w-[116px] shrink-0 border-0 border-r border-solid border-store-ink/20 pr-1.5 min-[640px]:block">
                    <select
                        className="h-7 w-full min-w-0 cursor-pointer appearance-none truncate border-0 bg-transparent pr-4 text-[10px] font-bold text-store-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-green"
                        aria-label={t('search.category')}
                        value={categoryKey}
                        onChange={(event) => setCategoryKey(event.target.value)}
                    >
                        <option value="">{t('search.allCategories')}</option>
                        {categoryKeys.map((key) => (
                            <option key={key} value={key}>
                                {t(`categories.${key}`)}
                            </option>
                        ))}
                    </select>
                    <img
                        className="pointer-events-none absolute top-[7px] right-1.5 block"
                        src="/images/storefront/chevron-down.svg"
                        alt=""
                    />
                </div>

                <input
                    className="h-9 min-w-0 flex-1 rounded-full border-0 bg-transparent px-2.5 text-[12px] text-store-ink outline-none placeholder:text-[#7a7d85] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-store-green"
                    type="search"
                    name="q"
                    aria-label={t('search.label')}
                    placeholder={t('search.placeholder')}
                    maxLength={100}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />

                <button
                    className="flex h-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-r-full border-0 border-l-2 border-solid border-store-ink bg-store-yellow px-3.5 text-[12px] font-extrabold text-store-ink transition-colors hover:bg-[#ffe96d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70 max-[640px]:px-3"
                    type="submit"
                    aria-label={t('search.submit')}
                    disabled={isSearching}
                    aria-busy={isSearching}
                >
                    <img className="block shrink-0" src="/images/storefront/search.svg" alt="" />
                    <span className="max-[640px]:hidden">{t('search.submit')}</span>
                </button>
            </form>

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
