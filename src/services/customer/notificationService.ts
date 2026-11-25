import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { CustomerNotificationPreferences, NotificationsPage } from '@/types/customer/notification';
export async function getCustomerNotifications(page = 0, size = 20, unreadOnly = false) {
    const { data } = await http.get<ApiResponse<NotificationsPage>>('/api/customer/notifications', {
        params: { page, size, unreadOnly },
    });
    return data.data;
}
export async function getUnreadNotificationCount() {
    const { data } = await http.get<ApiResponse<{ unreadCount: number }>>(
        '/api/customer/notifications/unread-count',
    );
    return data.data.unreadCount;
}
export async function markNotificationRead(id: string) {
    const { data } = await http.patch<ApiResponse<{ updatedCount: number }>>(
        `/api/customer/notifications/${encodeURIComponent(id)}/read`,
    );
    return data.data;
}
export async function markAllNotificationsRead() {
    const { data } = await http.patch<ApiResponse<{ updatedCount: number }>>(
        '/api/customer/notifications/read-all',
    );
    return data.data;
}
export async function getNotificationPreferences() {
    const { data } = await http.get<ApiResponse<CustomerNotificationPreferences>>(
        '/api/customer/notifications/preferences',
    );
    return data.data;
}
export async function updateNotificationPreferences(preferences: CustomerNotificationPreferences) {
    const { data } = await http.put<ApiResponse<CustomerNotificationPreferences>>(
        '/api/customer/notifications/preferences',
        preferences,
    );
    return data.data;
}
