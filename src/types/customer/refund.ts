export interface RefundRequest {
    entireOrder: boolean;
    packageIds: string[];
    reason: string;
    bank: string;
    accountNumber: string;
    accountName: string;
}

export interface RefundRecord {
    id: string;
    requestGroupId: string;
    orderId: string;
    packageId: string;
    packageName: string;
    status: string;
    reason: string;
    createdAt: string;
}
