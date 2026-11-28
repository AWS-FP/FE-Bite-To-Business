import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/admin/authStore';
import {
    getSearchHistory,
    saveSearchHistory,
    deleteSearchHistoryEntry,
    clearSearchHistory,
} from '@/services/searchHistoryService';
import type { SearchHistoryResponse } from '@/types/searchHistory';

const pendingMutations = new Map<string, Promise<SearchHistoryResponse[]>>();

function enqueueHistoryMutation(key: string, operation: () => Promise<SearchHistoryResponse[]>) {
    const pending = pendingMutations.get(key);
    const next = (pending ? pending.catch(() => undefined) : Promise.resolve()).then(operation);
    pendingMutations.set(key, next);
    const clean = () => { if (pendingMutations.get(key) === next) pendingMutations.delete(key); };
    void next.then(clean, clean);
    return next;
}

const guestHistoryKey = 'bitetobusiness.search-history';
export interface SearchHistoryEntry {
    id: string;
    keyword: string;
}
interface AccountHistory {
    userId: string;
    sessionVersion: number;
    rows: SearchHistoryResponse[];
    unavailable: boolean;
}

function readGuestHistory(): string[] {
    try {
        const stored: unknown = JSON.parse(sessionStorage.getItem(guestHistoryKey) || '[]');
        if (!Array.isArray(stored)) return [];
        return stored
            .filter(
                (item): item is string =>
                    typeof item === 'string' && item.trim().length > 0 && item.length <= 160,
            )
            .slice(0, 5);
    } catch {
        return [];
    }
}

export default function useSearchHistory() {
    const userId = useAuthStore((state) => state.session?.user.id);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const [guestHistory, setGuestHistory] = useState(readGuestHistory);
    const [accountHistory, setAccountHistory] = useState<AccountHistory | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const loadControllerRef = useRef<AbortController | null>(null);
    const sessionKey = `${userId ?? "guest"}:${sessionVersion}`;

    useEffect(() => {
        const controller = new AbortController();
        loadControllerRef.current = controller;
        if (userId) {
            // A remounted header can reuse the result of a still-pending submitted search.
            const pending = pendingMutations.get(sessionKey);
            (pending ?? getSearchHistory(controller.signal))
                .then((rows) => {
                    if (!controller.signal.aborted)
                        setAccountHistory({ userId, sessionVersion, rows, unavailable: false });
                })
                .catch(() => {
                    if (!controller.signal.aborted)
                        setAccountHistory({ userId, sessionVersion, rows: [], unavailable: true });
                });
        }
        return () => {
            controller.abort();
            // A submitted search must finish even if navigation unmounts the header.
        };
    }, [userId, sessionVersion, sessionKey]);

    const accountReady =
        accountHistory?.userId === userId && accountHistory?.sessionVersion === sessionVersion;
    const historyEntries: SearchHistoryEntry[] = userId
        ? accountReady
            ? (accountHistory?.rows ?? []).map(({ id, keyword }) => ({ id, keyword }))
            : []
        : guestHistory.map((keyword) => ({ id: keyword, keyword }));
    const history = historyEntries.map(({ keyword }) => keyword);
    const isLoadingHistory = Boolean(userId && !accountReady);
    const isHistoryUnavailable = Boolean(userId && accountReady && accountHistory?.unavailable);

    function storeGuestKeywords(values: string[]) {
        setGuestHistory(values);
        try {
            sessionStorage.setItem(guestHistoryKey, JSON.stringify(values));
        } catch {
            /* unavailable storage */
        }
    }
    function isSameSession() {
        const state = useAuthStore.getState();
        return state.session?.user.id === userId && state.sessionVersion === sessionVersion;
    }
    async function recordSearch(keyword: string): Promise<boolean> {
        if (!userId) {
            storeGuestKeywords(
                [
                    keyword,
                    ...readGuestHistory().filter(
                        (value) => value.toLowerCase() !== keyword.toLowerCase(),
                    ),
                ].slice(0, 5),
            );
            return true;
        }
        loadControllerRef.current?.abort();
        try {
            const rows = await enqueueHistoryMutation(sessionKey, () => {
                if (!isSameSession()) return Promise.reject(new Error('Search history session changed'));
                return saveSearchHistory(keyword);
            });
            if (isSameSession()) setAccountHistory({ userId, sessionVersion, rows, unavailable: false });
            return isSameSession();
        } catch {
            // A history write failure must not discard an already loaded history.
            if (isSameSession()) setAccountHistory(current => current?.userId === userId && current.sessionVersion === sessionVersion
                ? current : { userId, sessionVersion, rows: [], unavailable: true });
            return false;
        }
    }
    async function changeHistory(id?: string): Promise<boolean> {
        if (deleting) return false;
        setDeleting(true);
        setDeleteError(false);
        if (!userId) {
            storeGuestKeywords(id ? guestHistory.filter((value) => value !== id) : []);
            setDeleting(false);
            return true;
        }
        loadControllerRef.current?.abort();
        try {
            const rows = await enqueueHistoryMutation(sessionKey, () => {
                if (!isSameSession()) return Promise.reject(new Error('Search history session changed'));
                return id ? deleteSearchHistoryEntry(id) : clearSearchHistory();
            });
            if (isSameSession()) {
                setAccountHistory({ userId, sessionVersion, rows, unavailable: false });
            }
            return true;
        } catch {
            if (isSameSession()) setDeleteError(true);
            return false;
        } finally {
            setDeleting(false);
        }
    }

    return {
        history,
        historyEntries,
        isLoadingHistory,
        isHistoryUnavailable,
        recordSearch,
        deleteSearch: (id: string) => changeHistory(id),
        clearHistory: () => changeHistory(),
        deleting,
        deleteError,
    };
}
