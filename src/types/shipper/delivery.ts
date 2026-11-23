export type DeliveryLanguage = 'vi' | 'en';

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
