export type DeliveryLanguage = 'vi' | 'en';
export type DeliveryStatus = 'IN_DELIVERY' | 'COMPLETED';

export interface DeliveryPackage {
    id: string;
    stopNumber: number;
    destinationName: string;
    distanceKm: number;
    recipient: string;
    phone: string;
    address: string;
    products: string;
    note: string;
}

export interface DeliveryTrip {
    id: string;
    orderCode: string;
    customer: string;
    packageCount: number;
    stopCount: number;
    distanceKm: number;
    etaMinutes: number;
    warehouse: string;
    status: DeliveryStatus;
    packages: DeliveryPackage[];
}

export interface DeliveryHistoryItem {
    id: string;
    orderCode: string;
    customer: string;
    packageCount: number;
    stopCount: number;
    eta: string;
    completedAt: string;
    differenceMinutes: number;
    status: 'COMPLETED';
}
