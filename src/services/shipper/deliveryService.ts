import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { ClaimedPackage, Page, ReadyOrder, DeliveryRoute } from '@/types/shipper/delivery';

export async function getReadyOrders(page: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<Page<ReadyOrder>>>('/api/delivery/ready-orders', {
        params: { page, size: 10 },
        signal,
    });
    return response.data.data;
}

export async function getMyPackages(page: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<Page<ClaimedPackage>>>(
        '/api/delivery/packages/mine',
        {
            params: { page, size: 10 },
            signal,
        },
    );
    return response.data.data;
}

/** Package đã giao xong của nhân viên hiện tại, mới nhất trước. */
export async function getDeliveryHistory(page: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<Page<ClaimedPackage>>>(
        '/api/delivery/packages/history',
        {
            params: { page, size: 10 },
            signal,
        },
    );
    return response.data.data;
}

export async function claimPackage(packageId: string) {
    const response = await http.post<ApiResponse<ClaimedPackage>>(
        `/api/delivery/packages/${packageId}/claim`,
    );
    return response.data.data;
}

export async function getPackageDetail(packageId: string) {
    const response = await http.get<ApiResponse<ClaimedPackage>>(`/api/delivery/packages/${encodeURIComponent(packageId)}`);
    return response.data.data;
}

/** Xác nhận đã giao package; giao xong package cuối cùng thì đơn hàng hoàn thành. */
export async function completePackage(packageId: string) {
    const response = await http.post<ApiResponse<ClaimedPackage>>(
        `/api/delivery/packages/${encodeURIComponent(packageId)}/complete`,
    );
    return response.data.data;
}


/** Đường đi từ vị trí hiện tại tới điểm giao của package (BE gọi VietMap Route). */
export async function getPackageRoute(packageId: string, lat: number, lng: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<DeliveryRoute>>(`/api/delivery/packages/${encodeURIComponent(packageId)}/route`, {
        params: { lat, lng },
        signal,
    });
    return response.data.data;
}
