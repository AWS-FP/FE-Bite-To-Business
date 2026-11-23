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

// Choices are stored server-side per authenticated customer, not in browser memory.
export interface CustomerNotificationPreferences {
    quoteApproval: boolean;
    quoteExpiry: boolean;
    deliveryEta: boolean;
    sourcingReply: boolean;
}
