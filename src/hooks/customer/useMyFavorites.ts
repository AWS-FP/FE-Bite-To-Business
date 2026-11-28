import { useEffect, useState } from 'react';
import { getMyFavorites } from '@/services/customer/favoriteService';
import type { FavoritePage } from '@/types/customer/favorite';

const PAGE_SIZE = 12;

/** Page of already-favorited products. Only refill after removal when more items exist. */
export function useMyFavorites() {
    const [page, setPage] = useState(0);
    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState<FavoritePage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        let changingPage = false;
        getMyFavorites(page, PAGE_SIZE, controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                if (data.content.length === 0 && page > 0) {
                    changingPage = true;
                    setPage(Math.max(0, data.totalPages - 1));
                } else {
                    setResult(data);
                    setError(false);
                }
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted && !changingPage) setLoading(false);
            });
        return () => controller.abort();
    }, [page, revision]);

    function onRemoved(productId: string) {
        if (result && page === 0 && result.totalPages <= 1) {
            // With only one page, the remaining cards are already available; no extra GET.
            setResult((current) => {
                if (!current || !current.content.some((item) => item.productId === productId)) return current;
                const totalElements = Math.max(0, current.totalElements - 1);
                return { ...current, content: current.content.filter((item) => item.productId !== productId), totalElements, totalPages: Math.ceil(totalElements / PAGE_SIZE) };
            });
        } else {
            setLoading(true);
            setRevision((value) => value + 1);
        }
    }

    function retry() {
        setError(false);
        setLoading(true);
        setRevision((n) => n + 1);
    }

    return { page, setPage, setLoading, result, loading, error, onRemoved, retry };
}
