import ListSkeleton from '@/components/common/ListSkeleton';
import { ArrowRight, Clock3, Image as ImageIcon, Search, Sparkles, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCatalogSearchPath } from '../../../constants/catalogNavigation';
import { useStoreSearch } from '@/hooks/customer/useStoreSearch';
import { SEARCH_MAX_LENGTH } from '@/constants/catalogSearch';
import SearchModeDropdown from './SearchModeDropdown';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function StoreSearch() {
    const { t, i18n } = useTranslation('storefront');
    const {
        keyword,
        changeKeyword,
        showSuggestionMenu,
        suggestionLoading,
        suggestionError,
        showRecentSearches,
        searchMode,
        changeMode,
        showAINotice,
        historyEntries,
        historyPath,
        deleteSearch,
        confirmClear,
        clearHistoryOpen,
        setClearHistoryOpen,
        confirmClearHistory,
        deleting,
        deleteError,
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
                className="flex h-[52px] min-w-0 items-center rounded-full border-2 border-solid border-store-ink bg-store-cream shadow-[3px_3px_0_var(--color-store-ink)] focus-within:border-store-green"
                role="search"
                aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.label')}
                onSubmit={handleSearch}
            >
                <SearchModeDropdown
                    value={searchMode}
                    onChange={changeMode}
                    onOpen={() => setOpen(false)}
                />

                <input
                    ref={inputRef}
                    className="store-search-input h-9 min-w-0 flex-1 rounded-full !border-0 bg-transparent px-2.5 text-[12px] text-store-ink !outline-none !shadow-none focus:!border-0 focus:!outline-none focus:!shadow-none placeholder:text-store-muted"
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
                {keyword && (
                    <button
                        type="button"
                        onClick={() => {
                            changeKeyword('');
                            inputRef.current?.focus();
                        }}
                        aria-label={
                            i18n.resolvedLanguage?.startsWith('en')
                                ? 'Clear search'
                                : 'Xóa nội dung tìm kiếm'
                        }
                        className="mr-1 grid size-8 shrink-0 place-items-center rounded-full border-0 bg-transparent text-store-green hover:bg-store-green/10"
                    >
                        <X size={15} aria-hidden="true" />
                    </button>
                )}

                <button
                    className="flex h-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-r-full border-0 border-l-2 border-solid border-store-ink bg-store-yellow px-3.5 text-[12px] font-extrabold text-store-ink transition-colors hover:bg-[#ffe97b] focus-visible:!outline-none focus-visible:!bg-surface-yellow disabled:cursor-wait disabled:opacity-70"
                    type="submit"
                    aria-label={t(searchMode === 'ai' ? 'search.askAI' : 'search.submit')}
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

            {(showSuggestionMenu || showRecentSearches) && (
                <nav
                    ref={menuRef}
                    aria-label={t(showRecentSearches ? 'search.history' : 'search.suggestions')}
                    className="absolute inset-x-0 top-[calc(100%+8px)] z-[90] max-h-[min(420px,65dvh)] overflow-y-auto overscroll-contain rounded-2xl border border-solid border-store-line bg-white p-2.5 text-store-ink shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                >
                    {showRecentSearches ? (
                        <>
                            <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-1">
                                <p className="m-0 text-[11px] font-extrabold uppercase tracking-wide text-store-muted">
                                    {t('search.history')}
                                </p>
                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={confirmClear}
                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border-0 bg-transparent px-1.5 py-1 text-xs text-store-muted hover:text-danger disabled:opacity-40"
                                >
                                    <Trash2 size={13} /> {t('searchHistory.clearAll')}
                                </button>
                            </div>
                            {historyEntries.slice(0, 7).map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center gap-2 rounded-xl hover:bg-store-cream"
                                >
                                    <Link
                                        to={historyPath(entry.keyword)}
                                        onClick={(event) =>
                                            void handleHistoryClick(event, entry.keyword)
                                        }
                                        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-store-ink no-underline focus-visible:!outline-none focus-visible:bg-surface-green"
                                    >
                                        <Clock3 size={15} className="shrink-0 text-store-muted" />
                                        <span className="truncate">{entry.keyword}</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => void deleteSearch(entry.id)}
                                        disabled={deleting}
                                        aria-label={`${t('searchHistory.remove')}: ${entry.keyword}`}
                                        className="mr-2 flex size-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-store-muted hover:bg-red-50 hover:text-danger disabled:opacity-40"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <p className="m-0 px-2 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-wide text-store-muted">
                                {t('search.suggestions')}
                            </p>
                            {suggestionLoading ? (
                                <ListSkeleton count={3} image lines={2} action={false} rowClassName="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5" />
                            ) : suggestionError ? (
                                <p role="status" className="m-0 px-3 py-5 text-sm text-store-muted">
                                    {t('search.suggestionUnavailable')}
                                </p>
                            ) : suggestions.length ? (
                                suggestions.map((item) => (
                                    <Link
                                        key={item.key}
                                        to={item.path}
                                        onClick={(event) =>
                                            void handleHistoryClick(event, item.keyword, item.path)
                                        }
                                        className="group flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-store-ink no-underline transition-colors hover:bg-store-cream focus-visible:bg-store-cream focus-visible:!outline-none focus-visible:bg-surface-green"
                                    >
                                        {item.kind === 'product' ? (
                                            item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt=""
                                                    loading="lazy"
                                                    className="size-12 shrink-0 rounded-lg border border-solid border-store-line bg-white object-contain p-1"
                                                />
                                            ) : (
                                                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-green text-store-muted">
                                                    <ImageIcon size={18} />
                                                </span>
                                            )
                                        ) : (
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-green text-store-green">
                                                <Search size={17} />
                                            </span>
                                        )}
                                        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-5">
                                            {item.label}
                                        </span>
                                        {item.kind !== 'product' && (
                                            <span className="shrink-0 rounded-full bg-surface-green px-2 py-1 text-[10px] font-semibold text-store-muted">
                                                {t(`search.kinds.${item.kind}`)}
                                            </span>
                                        )}
                                    </Link>
                                ))
                            ) : (
                                <p className="m-0 px-3 py-5 text-sm text-store-muted">
                                    {t('search.noSuggestions')}
                                </p>
                            )}
                            <Link
                                to={getCatalogSearchPath(keyword.trim())}
                                onClick={(event) => void handleHistoryClick(event, keyword.trim())}
                                className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-solid border-store-line bg-store-cream px-3 py-3 text-xs font-bold text-store-green no-underline hover:bg-surface-yellow focus-visible:!outline-none focus-visible:bg-surface-green"
                            >
                                <span className="min-w-0 truncate">
                                    {t('search.viewAll', { query: keyword.trim() })}
                                </span>
                                <ArrowRight size={15} />
                            </Link>
                        </>
                    )}
                </nav>
            )}

            {showAINotice && (
                <p className="mt-2 px-2 text-[11px] leading-[1.5] text-store-cream" role="status">
                    {t('search.aiUnavailable')}
                </p>
            )}

            {deleteError && (
                <p role="alert" className="mt-1 px-2 text-xs text-red-200">
                    {t('searchHistory.deleteError')}
                </p>
            )}
            <ConfirmModal
                open={clearHistoryOpen}
                title={t('searchHistory.clearAll')}
                message={t('searchHistory.confirmClear')}
                confirmLabel={t('searchHistory.clearAll')}
                cancelLabel={i18n.resolvedLanguage?.startsWith('en') ? 'Cancel' : 'Hủy'}
                busy={deleting}
                error={deleteError ? t('searchHistory.deleteError') : undefined}
                danger
                onConfirm={() => void confirmClearHistory()}
                onCancel={() => setClearHistoryOpen(false)}
            />
        </div>
    );
}
