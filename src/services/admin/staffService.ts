import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { PageResponse } from '@/types/pagination';
import type { CreateStaffRequest, StaffAccount, StaffListParams } from '@/types/admin/staff';

export async function getStaff(params: StaffListParams, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<PageResponse<StaffAccount>>>('/api/admin/staff', {
        params,
        signal,
    });
    return response.data.data;
}

export async function createStaff(request: CreateStaffRequest) {
    const response = await http.post<ApiResponse<StaffAccount>>('/api/admin/staff', request);
    return response.data.data;
}
