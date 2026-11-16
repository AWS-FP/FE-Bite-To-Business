import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface CustomerNotification {
    id: string;
    notificationType: string;
    titleVi: string;
    titleEn: string;
    contentVi: string;
    contentEn: string;
    actionUrl: string | null;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
}
export interface NotificationsPage {
    content: CustomerNotification[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
export async function getCustomerNotifications(page = 0, size = 20, unreadOnly = false) {
    const { data } = await http.get<ApiResponse<NotificationsPage>>('/api/customer/notifications', {
        params: { page, size, unreadOnly },
    });
    return data.data;
}
export async function getUnreadNotificationCount() {
    const { data } = await http.get<ApiResponse<{ unreadCount: number }>>('/api/customer/notifications/unread-count');
    return data.data.unreadCount;
}
export async function markNotificationRead(id: string) {
    const { data } = await http.patch<ApiResponse<{ updatedCount: number }>>(`/api/customer/notifications/${encodeURIComponent(id)}/read`);
    return data.data;
}
export async function markAllNotificationsRead() {
    const { data } = await http.patch<ApiResponse<{ updatedCount: number }>>('/api/customer/notifications/read-all');
    return data.data;
}
