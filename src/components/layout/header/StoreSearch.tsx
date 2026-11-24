import { Sparkles, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCatalogSearchPath } from '../../../constants/catalogNavigation';
import { useStoreSearch } from '@/hooks/customer/useStoreSearch';
import { SEARCH_MAX_LENGTH } from '@/constants/catalogSearch';
import SearchModeDropdown from './SearchModeDropdown';

export default function StoreSearch() {
    const { t } = useTranslation('storefront');
    const {
        keyword,
        changeKeyword,
        searchMode,
        changeMode,
        showAINotice,
        isSearching,
        historyEntries,
        deleteSearch,
        confirmClear,
        deleting,
        deleteError,
        historyRef,
        guardHistoryDrag,
        startDrag,
        moveDrag,
        stopDrag,
        handleSearch,
        handleHistoryClick,
        setOpen,
        suggestions,
        inputRef,
        menuRef,
        handleKeys,
    } = useStoreSearch();
    return (
        <div
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
            }}
            onKeyDown={handleKeys}
            className="relative min-w-0 max-w-[720px] flex-[1_1_720px]"
        >
            <form
                className="focus-border-group flex h-[52px] min-w-0 items-center rounded-full border-2 border-solid border-store-ink bg-store-cream shadow-[3px_3px_0_var(--color-store-ink)] focus-within:border-store-green"
                role="search"
                aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.label')}
                onSubmit={handleSearch}
            >
                <SearchModeDropdown value={searchMode} onChange={changeMode} />

                <input
                    ref={inputRef}
                    className="h-9 min-w-0 flex-1 rounded-full border-0 bg-transparent px-2.5 text-[12px] text-store-ink outline-none placeholder:text-store-muted"
                    type="search"
                    name="q"
                    aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.label')}
                    placeholder={t(
                        searchMode === 'ai' ? 'search.aiPlaceholder' : 'search.placeholder',
                    )}
                    autoComplete="off"
                    onFocus={() => setOpen(true)}
                    maxLength={SEARCH_MAX_LENGTH}
                    value={keyword}
                    onChange={(event) => changeKeyword(event.target.value)}
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

            {suggestions.length > 0 && (
                <nav
                    ref={menuRef}
                    aria-label={t('search.suggestions')}
                    className="absolute inset-x-0 z-50 max-h-80 overflow-y-auto rounded-xl bg-white p-2 text-store-ink shadow-lg"
                >
                    {suggestions.map((item) => (
                        <Link
                            key={item.key}
                            to={item.path}
                            onClick={(event) =>
                                void handleHistoryClick(event, item.keyword, item.path)
                            }
                            className="flex justify-between gap-3 rounded px-3 py-2 text-sm hover:bg-store-cream focus:bg-store-cream"
                        >
                            <span>{item.label}</span>
                            <small>{t(`search.kinds.${item.kind}`)}</small>
                        </Link>
                    ))}
                </nav>
            )}

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
                        onClickCapture={guardHistoryDrag}
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
                        onClick={confirmClear}
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
