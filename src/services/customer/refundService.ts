import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface RefundRequest {
    entireOrder: boolean;
    packageIds: string[];
    reason: string;
    bank: string;
    accountNumber: string;
    accountName: string;
}
export interface RefundRecord {
    id: string;
    requestGroupId: string;
    orderId: string;
    packageId: string;
    packageName: string;
    status: string;
    reason: string;
    createdAt: string;
}
export async function getOrderRefundRequests(orderId: string) {
    const { data } = await http.get<ApiResponse<RefundRecord[]>>(`/api/customer/orders/${encodeURIComponent(orderId)}/refund-requests`);
    return data.data;
}
export async function requestOrderRefund(orderId: string, request: RefundRequest) {
    const { data } = await http.post<ApiResponse<RefundRecord[]>>(`/api/customer/orders/${encodeURIComponent(orderId)}/refund-requests`, request);
    return data.data;
}
