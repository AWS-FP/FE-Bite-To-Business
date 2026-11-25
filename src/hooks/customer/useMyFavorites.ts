import { useEffect, useState } from 'react';
import { getMyFavorites, removeFavorite } from '@/services/customer/favoriteService';
import type { FavoritePage } from '@/types/customer/favorite';

const PAGE_SIZE = 12;

/** Danh sách sản phẩm yêu thích theo trang, kèm bỏ yêu thích và tải lại. */
export function useMyFavorites() {
    const [page, setPage] = useState(0);
    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState<FavoritePage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [removing, setRemoving] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        getMyFavorites(page, PAGE_SIZE)
            .then((data) => {
                if (!alive) return;
                // Bỏ sản phẩm cuối cùng ở một trang không phải trang đầu có thể làm trang đó trống.
                if (data.content.length === 0 && page > 0) {
                    setPage(page - 1);
                } else {
                    setResult(data);
                    setError(false);
                }
            })
            .catch(() => {
                if (alive) setError(true);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [page, revision]);

    async function remove(productId: string) {
        setRemoving(productId);
        try {
            await removeFavorite(productId);
            setLoading(true);
            setRevision((value) => value + 1);
        } catch {
            setError(true);
        } finally {
            setRemoving(null);
        }
    }

    function retry() {
        setError(false);
        setLoading(true);
        setRevision((n) => n + 1);
    }

    return { page, setPage, setLoading, result, loading, error, removing, remove, retry };
}
