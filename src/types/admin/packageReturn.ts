export type PackageReturnStatus = 'REQUESTED' | 'ACCEPTED' | 'REJECTED';

/** Yêu cầu trả hàng khách gửi cho một package đã giao. */
export interface PackageReturn {
    id: string;
    status: PackageReturnStatus;
    reason: string;
    recipientBank: string;
    recipientAccount: string;
    recipientName: string;
    reviewNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
    packageId: string;
    packageName: string;
    deliveryDate: string;
    deliveryAddress: string;
    packageRecipient: string | null;
    recipientPhone: string | null;
    deliveredAt: string | null;
    orderId: string;
    customerId: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    companyName: string | null;
    paymentNumber: string | null;
    packageAmount: number;
}
