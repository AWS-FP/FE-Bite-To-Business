import { useEffect, useRef, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { getCatalogSearchPath } from '@/constants/catalogNavigation';
import { SUGGESTION_DELAY_MS } from '@/constants/catalogSearch';
import { cleanSearchText, suggestionPath } from '@/utils/customer/catalogSearch';
import { canSuggest } from '@/validations/catalogSearch';
import { getCatalogSuggestions } from '@/services/customer/catalogReadService';
import useSearchHistory from '@/hooks/useSearchHistory';
import { useCatalogQuery } from './useCatalogQuery';
import { aiPagePath } from '@/a2ui/runtime/useA2uiActions';

export function useStoreSearch() {
    const [open, setOpen] = useState(false);
    const { t, i18n } = useTranslation('storefront');
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const catalogKeyword = location.pathname === ROUTES.CATALOG
        ? new URLSearchParams(location.search).get('q') ?? ''
        : '';
    const [keyword, setKeyword] = useState(catalogKeyword);
    const [searchMode, setSearchMode] = useState<'products' | 'ai'>('products');
    const [showAINotice, setShowAINotice] = useState(false);
    const { historyEntries, recordSearch, deleteSearch, clearHistory, deleting, deleteError } =
        useSearchHistory();
    const historyRef = useRef<HTMLElement>(null);
    const dragRef = useRef<{ startX: number; initialScroll: number; moved: boolean } | null>(null);
    const suppressHistoryClick = useRef(false);

    // Synchronize only on navigation, before rendering the new catalog results.
    const navigationKey = JSON.stringify([location.key, location.pathname, location.search]);
    const [previousNavigationKey, setPreviousNavigationKey] = useState(navigationKey);
    if (navigationKey !== previousNavigationKey) {
        setPreviousNavigationKey(navigationKey);
        if (location.pathname === ROUTES.CATALOG && searchMode === 'products') {
            setKeyword(catalogKeyword);
            setOpen(false);
        }
    }

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

    async function searchFor(value: string, path?: string) {
        const searchText = cleanSearchText(value);
        if (!searchText) return;

        if (searchMode === 'ai') {
            // Chế độ AI: AI ghép cả trang theo yêu cầu thay trang kết quả mặc định.
            setOpen(false);
            navigate(aiPagePath(searchText));
            return;
        }

        setOpen(false);
        setKeyword(searchText);
        // Navigation must never wait for the search-history network request.
        navigate(path ?? getCatalogSearchPath(searchText));
        void recordSearch(searchText);
    }

    async function handleHistoryClick(
        event: MouseEvent<HTMLAnchorElement>,
        word: string,
        path?: string,
    ) {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0)
            return;
        event.preventDefault();
        await searchFor(word, path);
    }

    const term = cleanSearchText(keyword);
    const [debounced, setDebounced] = useState('');
    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(term), SUGGESTION_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [term]);
    const enabled = open && searchMode === 'products' && term === debounced && canSuggest(term);
    const { data, isFetching, isError } = useCatalogQuery({
        // Detach from the previous request immediately while the next term debounces.
        queryKey: ['catalogSuggestions', enabled ? term : null],
        queryFn: ({ signal }) => getCatalogSuggestions(term, signal),
        enabled,
        retry: false,
    });

    function changeMode(mode: 'products' | 'ai') {
        setSearchMode(mode);
        setShowAINotice(false);
        setOpen(false);
    }

    function changeKeyword(value: string) {
        setKeyword(value);
        setOpen(true);
    }

    const suggestions = (enabled ? (data ?? []) : []).map((item) => {
        const label = i18n.resolvedLanguage?.startsWith('en') ? item.labelEn : item.labelVi;
        return {
            key: JSON.stringify([item.kind, item.id, item.labelVi, item.labelEn]),
            kind: item.kind,
            label,
            path: suggestionPath(item, label),
            keyword: item.kind === 'query' ? label : term,
            imageUrl: item.imageUrl ?? null,
        };
    });

    function handleKeys(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Escape' && open) {
            inputRef.current?.focus();
            setOpen(false);
            return;
        }
        const links = Array.from(menuRef.current?.querySelectorAll('a') ?? []);
        if (!links.length || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
        const current = links.indexOf(document.activeElement as HTMLAnchorElement);
        if (document.activeElement !== inputRef.current && current < 0) return;
        event.preventDefault();
        if (current === 0 && event.key === 'ArrowUp') inputRef.current?.focus();
        else
            links[
                event.key === 'ArrowDown'
                    ? (current + 1) % links.length
                    : current < 0
                      ? links.length - 1
                      : current - 1
            ]?.focus();
    }

    function guardHistoryDrag(event: MouseEvent<HTMLElement>) {
        if (suppressHistoryClick.current) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function confirmClear() {
        if (window.confirm(t('searchHistory.confirmClear'))) void clearHistory();
    }

    return {
        open,
        suggestionLoading:
            open && searchMode === 'products' && canSuggest(term) && (!enabled || isFetching),
        suggestionError: enabled && isError,
        showSuggestionMenu: open && searchMode === 'products' && canSuggest(term),
        showRecentSearches: open && searchMode === 'products' && !term && historyEntries.length > 0,
        keyword,
        changeKeyword,
        searchMode,
        changeMode,
        showAINotice,
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
    };
}
