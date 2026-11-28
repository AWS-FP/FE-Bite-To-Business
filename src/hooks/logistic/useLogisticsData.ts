import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import { useLogisticsText } from './useLogisticsText';

export interface Stock { productId: string; sku: string; name: string; unit: string; imageUrl: string | null; onHand: number; reserved: number; available: number; productStatus: string; active: boolean }
export interface ProductRequest { id: string; productName: string; customerNote: string | null; status: string; createdAt: string; referenceUrl?: string | null }
interface Page<T> { content: T[]; totalPages: number }

export const productRequestListKey = ['logistics', 'product-requests'] as const;

export function useProductRequests(page: number, keyword: string, status: string, enabled: boolean) {
    return useQuery({
        queryKey: [...productRequestListKey, page, keyword, status],
        queryFn: async ({ signal }) => {
            const result = await http.get<ApiResponse<Page<ProductRequest> & { totalElements: number }>>('/api/logistics/product-requests', {
                params: { size: 10, page, ...(keyword ? { keyword } : {}), ...(status ? { status } : {}) },
                signal,
            });
            return result.data.data;
        },
        enabled,
    });
}

export function useLogisticsList<T>(path: string, keyword = '', status = '') {
    const { tr } = useLogisticsText();
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const requests = useRef<{ id: number; controller: AbortController | null }>({
        id: 0,
        controller: null,
    });
    const refresh = useCallback(async () => {
        const state = requests.current;
        const requestId = ++state.id;
        state.controller?.abort();
        const controller = new AbortController();
        state.controller = controller;
        setLoading(true);
        setError('');
        try {
            const result = await http.get<ApiResponse<Page<T>>>(path, {
                params: { size: 10, page, ...(keyword ? { keyword } : {}), ...(status ? { status } : {}) },
                signal: controller.signal,
            });
            if (requestId !== state.id) return;
            setItems(result.data.data.content);
            setTotalPages(result.data.data.totalPages);
        } catch {
            if (requestId !== state.id) return;
            setItems([]);
            setError('Không tải được dữ liệu. Vui lòng thử lại.');
        } finally {
            if (requestId === state.id) {
                state.controller = null;
                setLoading(false);
            }
        }
    }, [path, page, keyword, status]);
    useEffect(() => {
        const state = requests.current;
        let cancelled = false;
        // Start after the effect setup; skip obsolete setups (including Strict Mode replay).
        queueMicrotask(() => {
            if (!cancelled) void refresh();
        });
        return () => {
            cancelled = true;
            state.id++;
            state.controller?.abort();
            state.controller = null;
        };
    }, [refresh]);
    return { items, loading, error: error ? tr(error) : '', refresh, page, setPage, totalPages };
}

export function useLogisticsActions(refresh: () => Promise<void>) {
    const { tr } = useLogisticsText();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [errorDetail, setErrorDetail] = useState('');
    async function submit(path: string, body?: object, method: 'post' | 'delete' = 'post') {
        setBusy(true);
        setError('');
        setErrorCode('');
        setErrorDetail('');
        try {
            await http.request({url:path,method,data:body});
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
