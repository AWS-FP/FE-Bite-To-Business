import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { PageResponse } from '@/types/pagination';
import type { PackageReturn, PackageReturnStatus } from '@/types/admin/packageReturn';

const endpoint = '/api/admin/package-returns';

export async function getPackageReturns(status: PackageReturnStatus | undefined, page: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<PageResponse<PackageReturn>>>(endpoint, {
        params: { status, page, size: 10 },
        signal,
    });
    return response.data.data;
}

export async function acceptPackageReturn(id: string) {
    const response = await http.patch<ApiResponse<PackageReturn>>(`${endpoint}/${encodeURIComponent(id)}/accept`);
    return response.data.data;
}

export async function rejectPackageReturn(id: string, note: string) {
    const response = await http.patch<ApiResponse<PackageReturn>>(`${endpoint}/${encodeURIComponent(id)}/reject`, { note });
    return response.data.data;
}
