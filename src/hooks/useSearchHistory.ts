import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/admin/authStore';
import {
    getSearchHistory,
    saveSearchHistory,
    deleteSearchHistoryEntry,
    clearSearchHistory,
} from '@/services/searchHistoryService';
import type { SearchHistoryResponse } from '@/types/searchHistory';

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
    const saveControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        loadControllerRef.current = controller;
        if (userId) {
            getSearchHistory(controller.signal)
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
            saveControllerRef.current?.abort();
        };
    }, [userId, sessionVersion]);

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
                    ...guestHistory.filter(
                        (value) => value.toLowerCase() !== keyword.toLowerCase(),
                    ),
                ].slice(0, 5),
            );
            return true;
        }
        loadControllerRef.current?.abort();
        saveControllerRef.current?.abort();
        const controller = new AbortController();
        saveControllerRef.current = controller;
        try {
            const rows = await saveSearchHistory(keyword, controller.signal);
            if (!controller.signal.aborted && isSameSession()) {
                setAccountHistory({ userId, sessionVersion, rows, unavailable: false });
            }
        } catch {
            if (!controller.signal.aborted && isSameSession()) {
                setAccountHistory({ userId, sessionVersion, rows: [], unavailable: true });
            }
        }
        return !controller.signal.aborted && isSameSession();
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
        saveControllerRef.current?.abort();
        try {
            const rows = id ? await deleteSearchHistoryEntry(id) : await clearSearchHistory();
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
