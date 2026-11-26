export interface CustomerOrderSummary {
    orderId: string;
    orderNumber: string;
    status: 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    paymentStatus: string | null;
    itemsSubtotal: number;
    vatAmount: number;
    shippingFee: number;
    totalAmount: number;
    confirmedAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
}

export interface CustomerOrderItem {
    itemId: string;
    productId: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    unitCode: string;
    quantity: number;
    saleUnitPrice: number;
    vatRate: number;
    vatAmount: number;
    lineTotal: number;
}

export interface CustomerOrderPackage {
    packageId: string;
    packageNumber: string;
    packageName: string;
    deliveryDate: string;
    deliveryAddress: string;
    recipientName: string | null;
    recipientPhone: string | null;
    cancelled: boolean;
    deliveryStatus: 'WAITING' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED';
    deliveredAt: string | null;
    returnStatus: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | null;
    returnable: boolean;
    packageAmount: number | null;
    returnFee: number | null;
    refundAmount: number | null;
}

export interface CustomerOrderDetail {
    order: CustomerOrderSummary;
    items: CustomerOrderItem[];
    packages: CustomerOrderPackage[];
}

export interface CustomerOrdersPage {
    content: CustomerOrderSummary[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

/** All endpoints require a logged-in CUSTOMER; http handles Bearer/refresh. */
/** ACTIVE = awaiting payment or delivery; FINISHED = completed or cancelled. */
export type CustomerOrderGroup = 'ALL' | 'ACTIVE' | 'FINISHED';
