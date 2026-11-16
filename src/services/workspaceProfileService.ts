import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { AuthUser } from '@/types/admin/auth';

export async function uploadWorkspaceAvatar(file: File) {
    const data = new FormData();
    data.append('file', file);
    const response = await http.post<ApiResponse<AuthUser>>('/api/workspace/profile/avatar', data, {
        timeout: 60_000,
    });
    return response.data.data;
}
