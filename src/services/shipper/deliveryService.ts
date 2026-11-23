import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { ClaimedPackage, Page, ReadyOrder } from '@/types/shipper/delivery';

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
