export type PaymentReviewAction = 'REFUNDED' | 'RESTORED' | 'IGNORED';

/** Khoản SePay đã vào tài khoản nhưng không tự khớp đơn nào. */
export interface PaymentReview {
    transactionId: number;
    source: 'WEBHOOK' | 'RECONCILIATION';
    gateway: string;
    paymentCode: string | null;
    amount: number;
    referenceCode: string | null;
    content: string | null;
    reviewReason: string | null;
    receivedAt: string;
    paymentId: string | null;
    paymentStatus: string | null;
    paymentAmount: number | null;
    orderId: string | null;
    orderNumber: string | null;
    orderStatus: string | null;
    orderTotal: number | null;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    restorable: boolean;
    resolution: PaymentReviewAction | null;
    resolutionNote: string | null;
    refundReference: string | null;
    resolvedAt: string | null;
    resolvedByName: string | null;
    customerNotifiedAt: string | null;
}

export interface ResolvePaymentReviewInput {
    action: PaymentReviewAction;
    refundReference?: string;
    note?: string;
}
