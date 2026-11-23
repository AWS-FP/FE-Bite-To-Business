export interface CreateProductRequest {
    productName: string;
    referenceUrl: string | null;
    note: string | null;
    notifyByEmail: boolean;
}
