export interface CreateProductRequest {
    productName: string;
    referenceUrl: string | null;
    note: string | null;
    notifyByEmail: boolean;
}

export type ProductRequestStatus = 'PENDING' | 'REVIEWING' | 'ADDED' | 'REJECTED';

/** Yêu cầu khách đã gửi, kèm phản hồi mới nhất của Logistics. */
export interface MyProductRequest {
    id: string;
    productName: string;
    referenceUrl: string | null;
    customerNote: string | null;
    status: ProductRequestStatus;
    notifyByEmail: boolean;
    createdAt: string;
    updatedAt: string;
    responseNote: string | null;
    respondedAt: string | null;
    addedProductId: string | null;
    addedProductName: string | null;
    sellingPrice: number | null;
    unitCode: string | null;
}
