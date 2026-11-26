import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { CustomerOrderDetail, CustomerOrderGroup, CustomerOrdersPage } from '@/types/customer/order';
import type { Quote } from '@/types/customer/quote';
export async function getCustomerOrders(
    page = 0,
    size = 10,
    signal?: AbortSignal,
    group: CustomerOrderGroup = 'ALL',
) {
    const { data } = await http.get<ApiResponse<CustomerOrdersPage>>('/api/customer/orders', {
        params: { group, page, size },
        signal,
    });
    return data.data;
}
export async function getCustomerOrder(orderId: string, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<CustomerOrderDetail>>(
        `/api/customer/orders/${encodeURIComponent(orderId)}`,
        { signal },
    );
    return data.data;
}
/** Cancels my unpaid order; BE returns reserved stock and responds with the updated detail. */
export async function cancelCustomerOrder(orderId: string) {
    const { data } = await http.post<ApiResponse<CustomerOrderDetail>>(
        `/api/customer/orders/${encodeURIComponent(orderId)}/cancel`,
    );
    return data.data;
}

/** Prepares a NEW validated quote from my previous order; does not charge or place an order. */
export async function reorderCustomerOrder(orderId: string): Promise<Quote> {
    const { data } = await http.post<ApiResponse<Quote>>(
        `/api/customer/orders/${encodeURIComponent(orderId)}/reorder`,
        {},
        { timeout: 60_000 },
    );
    return data.data;
}
