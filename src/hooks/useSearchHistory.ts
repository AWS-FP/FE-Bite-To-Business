import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/admin/authStore';
import { getSearchHistory, saveSearchHistory } from '@/services/searchHistoryService';
import type { SearchHistoryResponse } from '@/types/searchHistory';

const guestHistoryKey = 'bitetobusiness.search-history';

interface AccountHistory {
    userId: string;
    sessionVersion: number;
    keywords: string[];
    unavailable: boolean;
}

function readGuestHistory(): string[] {
    try {
        const savedHistory: unknown = JSON.parse(sessionStorage.getItem(guestHistoryKey) || '[]');
        if (!Array.isArray(savedHistory)) return [];

        const keywords: string[] = [];
        for (const keyword of savedHistory) {
            if (typeof keyword === 'string' && keyword.trim() && keyword.length <= 160) {
                keywords.push(keyword);
            }
            if (keywords.length === 5) break;
        }
        return keywords;
    } catch {
        return [];
    }
}

function readKeywords(rows: SearchHistoryResponse[]): string[] {
    const keywords: string[] = [];
    for (const row of rows) {
        keywords.push(row.keyword);
    }
    return keywords;
}

export default function useSearchHistory() {
    const userId = useAuthStore((state) => state.session?.user.id);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const [guestHistory, setGuestHistory] = useState(readGuestHistory);
    const [accountHistory, setAccountHistory] = useState<AccountHistory | null>(null);
    const loadControllerRef = useRef<AbortController | null>(null);
    const saveControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        loadControllerRef.current = controller;

        if (userId) {
            // Chỉ tài khoản đăng nhập gọi BE. Kết quả cũ bị bỏ khi logout/đổi tài khoản.
            getSearchHistory(controller.signal)
                .then((rows) => {
                    if (controller.signal.aborted) return;
                    setAccountHistory({
                        userId,
                        sessionVersion,
                        keywords: readKeywords(rows),
                        unavailable: false,
                    });
                })
                .catch(() => {
                    if (controller.signal.aborted) return;
                    setAccountHistory({ userId, sessionVersion, keywords: [], unavailable: true });
                });
        }

        return () => {
            controller.abort();
            saveControllerRef.current?.abort();
        };
    }, [userId, sessionVersion]);

    let history = guestHistory;
    let isLoadingHistory = false;
    let isHistoryUnavailable = false;
    if (userId) {
        // Không hiện lịch sử Guest hoặc tài khoản cũ trong lúc chờ API của tài khoản mới.
        history = [];
        isLoadingHistory = true;
        if (accountHistory?.userId === userId && accountHistory.sessionVersion === sessionVersion) {
            history = accountHistory.keywords;
            isLoadingHistory = false;
            isHistoryUnavailable = accountHistory.unavailable;
        }
    }

    async function recordSearch(keyword: string): Promise<boolean> {
        if (!userId) {
            const nextHistory = [keyword];
            for (const oldKeyword of guestHistory) {
                if (oldKeyword.toLowerCase() !== keyword.toLowerCase() && nextHistory.length < 5) {
                    nextHistory.push(oldKeyword);
                }
            }
            setGuestHistory(nextHistory);

            try {
                sessionStorage.setItem(guestHistoryKey, JSON.stringify(nextHistory));
            } catch {
                // Không lưu được trên trình duyệt vẫn cho Guest tìm kiếm.
            }
            return true;
        }

        // Hủy GET đang chờ để nó không ghi đè kết quả mới sau khi lưu từ khóa.
        loadControllerRef.current?.abort();
        saveControllerRef.current?.abort();
        const controller = new AbortController();
        saveControllerRef.current = controller;

        try {
            const rows = await saveSearchHistory(keyword, controller.signal);
            if (!controller.signal.aborted) {
                setAccountHistory({
                    userId,
                    sessionVersion,
                    keywords: readKeywords(rows),
                    unavailable: false,
                });
            }
        } catch {
            if (!controller.signal.aborted) {
                setAccountHistory({ userId, sessionVersion, keywords: [], unavailable: true });
            }
            // API lịch sử lỗi không ngăn người dùng tiếp tục tìm sản phẩm.
        }

        // Không điều hướng muộn nếu page đã đóng, user logout hoặc vừa đổi tài khoản.
        const currentState = useAuthStore.getState();
        return (
            !controller.signal.aborted &&
            currentState.session?.user.id === userId &&
            currentState.sessionVersion === sessionVersion
        );
    }

    return { history, isLoadingHistory, isHistoryUnavailable, recordSearch };
}
