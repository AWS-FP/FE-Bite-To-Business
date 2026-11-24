import { useEffect, useState } from 'react';
import { getMyProductRequests } from '@/services/customer/productRequestService';
import type { MyProductRequest } from '@/types/customer/productRequest';
import type { PageResponse } from '@/types/pagination';

const PAGE_SIZE = 8;

/** Danh sách yêu cầu nhập hàng của khách, có phân trang và tải lại. */
export function useMyProductRequests() {
    const [page, setPage] = useState(0);
    const [result, setResult] = useState<PageResponse<MyProductRequest> | null>(null);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        getMyProductRequests(page, PAGE_SIZE, controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setResult(data);
                setError(false);
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            });
        return () => controller.abort();
    }, [page, reload]);

    const loading = !error && (result === null || result.page !== page);

    return {
        page,
        setPage,
        result,
        loading,
        error,
        retry: () => {
            setError(false);
            setReload((value) => value + 1);
        },
    };
}
