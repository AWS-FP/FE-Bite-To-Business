import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface Page<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ReadyOrder {
    orderId: string;
    orderNumber: string;
    customerName: string;
    packages: { id: string; number: string; name: string; deliveryDate: string; address: string }[];
}

export interface ClaimedPackage {
    packageId: string;
    packageNumber: string;
    packageName: string;
    orderId: string;
    orderNumber: string;
    deliveryDate: string;
    deliveryTimeSlot: string | null;
    address: string;
    recipientName: string | null;
    recipientPhone: string | null;
    note: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    claimedAt: string;
    cancelled: boolean;
}

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
