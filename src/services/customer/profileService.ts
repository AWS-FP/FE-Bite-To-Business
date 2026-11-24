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

export async function uploadCustomerAvatar(file: File) {
    const data = new FormData();
    data.append('file', file);
    const response = await http.post<ApiResponse<CustomerProfile>>(
        '/api/customer/profile/avatar',
        data,
        {
            timeout: 60_000,
        },
    );
    return response.data.data;
}

/** Server-side history; URLs cannot be supplied freely when restoring. */
export async function getCustomerAvatarHistory(): Promise<string[]> {
    const response = await http.get<ApiResponse<string[]>>('/api/customer/profile/avatars');
    return response.data.data;
}

export async function restoreCustomerAvatar(avatarUrl: string): Promise<CustomerProfile> {
    const response = await http.put<ApiResponse<CustomerProfile>>(
        '/api/customer/profile/avatar/restore',
        { avatarUrl },
    );
    return response.data.data;
}
