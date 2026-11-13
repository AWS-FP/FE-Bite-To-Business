import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface QuoteItem {
    id: string;
    productId: string;
    nameVi: string;
    unitCode: string;
    quantity: number;
    listUnitPrice: number;
    volumeUnitPrice: number;
    saleUnitPrice: number;
    vatRate: number | null;
}

export interface Quote {
    id: string;
    revision: number;
    contactName: string | null;
    itemsSubtotal: number;
    volumeDiscountAmount: number;
    saleDiscountAmount: number;
    couponDiscountAmount: number;
    shippingFee: number;
    shippingCouponDiscountAmount: number;
    productCouponId: string | null;
    shippingCouponId: string | null;
    vatAmount: number | null;
    estimatedTotalAmount: number;
    items: QuoteItem[];
}

export interface QuotePackage {
    id: string;
    name: string;
    recipientName: string;
    recipientPhone: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    address: string;
    note: string | null;
    city: 'HCM' | 'HANOI';
    shippingFee: number;
    distanceMetres: number;
    items: { quoteItemId: string; quantity: number }[];
}

export async function createQuoteDraft() {
    const response = await http.post<ApiResponse<Quote>>('/api/customer/quotes/draft');
    return response.data.data;
}

export async function getQuote(id: string) {
    const response = await http.get<ApiResponse<Quote>>(`/api/customer/quotes/${id}`);
    return response.data.data;
}

export async function refreshQuotePrices(id: string) {
    const response = await http.post<ApiResponse<Quote>>(
        `/api/customer/quotes/${id}/refresh-prices`,
    );
    return response.data.data;
}

export async function addQuoteItem(id: string, productId: string, quantity: number) {
    const response = await http.put<ApiResponse<Quote>>(`/api/customer/quotes/${id}/items`, {
        productId,
        quantity,
    });
    return response.data.data;
}

export async function saveQuoteContact(
    id: string,
    contact: { name: string; phone: string; email: string },
) {
    const response = await http.put<ApiResponse<Quote>>(
        `/api/customer/quotes/${id}/contact`,
        contact,
    );
    return response.data.data;
}

export async function applyQuoteCoupons(id: string, productCode: string, shippingCode: string) {
    const response = await http.put<ApiResponse<Quote>>(`/api/customer/quotes/${id}/coupons`, {
        productCode: productCode.trim() || null,
        shippingCode: shippingCode.trim() || null,
    });
    return response.data.data;
}

export async function getQuotePackages(id: string) {
    const response = await http.get<ApiResponse<QuotePackage[]>>(
        `/api/customer/quotes/${id}/packages`,
    );
    return response.data.data;
}

export async function addQuotePackage(
    id: string,
    parcel: Omit<QuotePackage, 'id' | 'shippingFee' | 'distanceMetres'> & {
        latitude: number;
        longitude: number;
    },
) {
    const response = await http.post<ApiResponse<QuotePackage>>(
        `/api/customer/quotes/${id}/packages`,
        parcel,
    );
    return response.data.data;
}

export async function deleteQuotePackage(id: string, packageId: string) {
    await http.delete(`/api/customer/quotes/${id}/packages/${packageId}`);
}
