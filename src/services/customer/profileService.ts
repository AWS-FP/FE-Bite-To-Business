import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { CustomerProfile, UpdateCustomerProfile } from '@/types/customer/profile';

export async function getCustomerProfile(signal?: AbortSignal) {
    const response = await http.get<ApiResponse<CustomerProfile>>('/api/customer/profile', {
        signal,
    });
    return response.data.data;
}

export async function updateCustomerProfile(request: UpdateCustomerProfile) {
    const response = await http.put<ApiResponse<CustomerProfile>>('/api/customer/profile', request);
    return response.data.data;
}
