export interface RefundRequest {
    entireOrder: boolean;
    packageIds: string[];
    reason: string;
    bank: string;
    accountNumber: string;
    accountName: string;
}

export type RefundStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'REFUNDED';

export interface RefundRecord {
    id: string;
    requestGroupId: string;
    orderId: string;
    packageId: string;
    packageName: string;
    status: RefundStatus;
    reason: string;
    refundAmount: number | null;
    reviewNote: string | null;
    transferReference: string | null;
    createdAt: string;
    reviewedAt: string | null;
    refundedAt: string | null;
}
