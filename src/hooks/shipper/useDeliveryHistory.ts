import { useEffect, useState } from 'react';
import { getDeliveryHistory } from '@/services/shipper/deliveryService';
import type { ClaimedPackage, Page } from '@/types/shipper/delivery';
import { deliveryErrorMessage } from '@/hooks/shipper/useDeliveryBoard';

/** Lịch sử package đã giao của nhân viên giao hàng, phân trang 10 package mỗi trang. */
export function useDeliveryHistory() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState<Page<ClaimedPackage> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        getDeliveryHistory(page, controller.signal)
            .then((result) => {
                setData(result);
                setError('');
            })
            .catch((err) => {
                if (!controller.signal.aborted) setError(deliveryErrorMessage(err));
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [page, reloadKey]);

    return {
        data,
        page,
        loading,
        error,
        changePage: (next: number) => {
            setLoading(true);
            setPage(next);
        },
        refresh: () => {
            setLoading(true);
            setReloadKey((key) => key + 1);
        },
    };
}
