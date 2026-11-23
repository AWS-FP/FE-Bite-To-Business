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

export async function getWorkspaceAvatarHistory(): Promise<string[]> {
    const response = await http.get<ApiResponse<string[]>>('/api/workspace/profile/avatars');
    return response.data.data;
}

export async function restoreWorkspaceAvatar(avatarUrl: string): Promise<AuthUser> {
    const response = await http.put<ApiResponse<AuthUser>>(
        '/api/workspace/profile/avatar/restore',
        { avatarUrl },
    );
    return response.data.data;
}
