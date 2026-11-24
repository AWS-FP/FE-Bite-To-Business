import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { PackageReturnRequest, RefundRecord, RefundRequest } from '@/types/customer/refund';
export async function getOrderRefundRequests(orderId: string) {
    const { data } = await http.get<ApiResponse<RefundRecord[]>>(`/api/customer/orders/${encodeURIComponent(orderId)}/refund-requests`);
    return data.data;
}
export async function requestOrderRefund(orderId: string, request: RefundRequest) {
    const { data } = await http.post<ApiResponse<RefundRecord[]>>(`/api/customer/orders/${encodeURIComponent(orderId)}/refund-requests`, request);
    return data.data;
}

/** Khách yêu cầu trả package đã giao (trong 24 giờ sau khi giao). */
export async function requestPackageReturn(orderId: string, packageId: string, request: PackageReturnRequest) {
    await http.post(
        `/api/customer/orders/${encodeURIComponent(orderId)}/packages/${encodeURIComponent(packageId)}/return`,
        request,
    );
}
