import { useCallback, useEffect, useRef, useState } from 'react';
import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface Stock { productId: string; sku: string; name: string; unit: string; imageUrl: string | null; onHand: number; reserved: number; available: number }
export interface ProductRequest { id: string; productName: string; customerNote: string | null; status: string; createdAt: string }
export interface CancelledPackage { packageId: string; orderId: string; packageName: string; packageNumber: string; cancelledAt: string }
interface Page<T> { content: T[]; totalPages: number }

export function useLogisticsList<T>(path: string, keyword = '') {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const latestRequest = useRef(0);
    const refresh = useCallback(async () => {
        const requestId = ++latestRequest.current;
        setLoading(true);
        setError('');
        try {
            const result = await http.get<ApiResponse<Page<T>>>(path, { params: { size: 10, page, ...(keyword ? { keyword } : {}) } });
            if (requestId !== latestRequest.current) return;
            setItems(result.data.data.content);
            setTotalPages(result.data.data.totalPages);
        } catch {
            if (requestId !== latestRequest.current) return;
            setError('Không tải được dữ liệu. Vui lòng thử lại.');
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    }, [path, page, keyword]);
    useEffect(() => { void refresh(); }, [refresh]);
    return { items, loading, error, refresh, page, setPage, totalPages };
}

export function useLogisticsActions(refresh: () => Promise<void>) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    async function submit(path: string, body?: object) {
        setBusy(true);
        setError('');
        try {
            await http.post(path, body);
            await refresh();
            return true;
        } catch {
            setError('Không thể xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.');
            return false;
        } finally {
            setBusy(false);
        }
    }
    return { submit, busy, error };
}
