import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import { useLogisticsText } from './useLogisticsText';

export interface Stock { productId: string; sku: string; name: string; unit: string; imageUrl: string | null; onHand: number; reserved: number; available: number }
export interface ProductRequest { id: string; productName: string; customerNote: string | null; status: string; createdAt: string }
interface Page<T> { content: T[]; totalPages: number }

export function useLogisticsList<T>(path: string, keyword = '', loadAll = false) {
    const { tr } = useLogisticsText();
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
            const result = await http.get<ApiResponse<Page<T>>>(path, { params: { size: loadAll ? 100 : 10, page: loadAll ? 0 : page, ...(keyword ? { keyword } : {}) } });
            if (requestId !== latestRequest.current) return;
            const allItems = [...result.data.data.content];
            if (loadAll) {
                for (let nextPage = 1; nextPage < result.data.data.totalPages; nextPage++) {
                    const next = await http.get<ApiResponse<Page<T>>>(path, { params: { size: 100, page: nextPage, ...(keyword ? { keyword } : {}) } });
                    if (requestId !== latestRequest.current) return;
                    allItems.push(...next.data.data.content);
                }
            }
            setItems(allItems);
            setTotalPages(result.data.data.totalPages);
        } catch {
            if (requestId !== latestRequest.current) return;
            setItems([]);
            setError('Không tải được dữ liệu. Vui lòng thử lại.');
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    }, [path, page, keyword, loadAll]);
    useEffect(() => { void refresh(); }, [refresh]);
    return { items, loading, error: error ? tr(error) : '', refresh, page, setPage, totalPages };
}

export function useLogisticsActions(refresh: () => Promise<void>) {
    const { tr } = useLogisticsText();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [errorDetail, setErrorDetail] = useState('');
    async function submit(path: string, body?: object) {
        setBusy(true);
        setError('');
        setErrorCode('');
        setErrorDetail('');
        try {
            await http.post(path, body);
            await refresh();
            return true;
        } catch (err) {
            if (axios.isAxiosError(err) && !err.response) {
                setError('Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối và tồn kho trước khi thử lại.');
            } else if (axios.isAxiosError(err)) {
                const data = err.response?.data as { code?: string; message?: string } | undefined;
                setError('Không thể xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.');
                setErrorCode(String(data?.code || err.response?.status || ''));
                setErrorDetail(data?.message || '');
            } else {
                setError('Không thể xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.');
            }
            return false;
        } finally {
            setBusy(false);
        }
    }
    return { submit, busy, error: error ? `${tr(error)}${errorCode ? ` (${errorCode})` : ''}${errorDetail ? ` ${errorDetail}` : ''}` : '' };
}
