import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

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
    deliveryTimeSlot: string | null;
    cancelled: boolean;
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
export interface CustomerInvoice {
    orderId: string;
    orderNumber: string;
    invoiceStatus: string;
    invoiceNumber: string | null;
    vatAmount: number;
    totalAmount: number;
    pdfUrl: string | null;
    issuedAt: string | null;
    downloadable: boolean;
}
export interface VatLine {
    productId: string;
    sku: string;
    nameVi: string;
    quantity: number;
    vatRate: number;
    amountExcludingVat: number;
    vatAmount: number;
    lineTotal: number;
}
export interface OrderVatPreview {
    orderId: string;
    orderNumber: string;
    vatAmount: number;
    totalAmount: number;
    items: VatLine[];
    disclaimer: string;
}

/** All endpoints require a logged-in CUSTOMER; http handles Bearer/refresh. */
export async function getCustomerOrders(page = 0, size = 10, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<CustomerOrdersPage>>('/api/customer/orders', {
        params: { page, size },
        signal,
    });
    return data.data;
}
export async function getCustomerOrder(orderId: string, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<CustomerOrderDetail>>(
        `/api/customer/orders/${encodeURIComponent(orderId)}`,
        { signal },
    );
    return data.data;
}
export async function getCustomerInvoice(orderId: string) {
    const { data } = await http.get<ApiResponse<CustomerInvoice>>(
        `/api/customer/orders/${encodeURIComponent(orderId)}/invoice`,
    );
    return data.data;
}
export async function getOrderVatPreview(orderId: string) {
    const { data } = await http.get<ApiResponse<OrderVatPreview>>(
        `/api/customer/orders/${encodeURIComponent(orderId)}/vat-preview`,
    );
    return data.data;
}
