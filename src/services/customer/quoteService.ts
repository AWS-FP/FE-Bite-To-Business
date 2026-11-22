import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface QuoteItem {
    id: string;
    productId: string;
    nameVi: string;
    nameEn?: string | null;
    unitCode: string;
    quantity: number;
    quantityStep: number | null;
    listUnitPrice: number;
    volumeUnitPrice: number;
    saleUnitPrice: number;
    vatRate: number | null;
    /** VAT on this line after its product-coupon share; null when the product has no VAT rate yet. */
    productVatAmount: number | null;
}

export type CouponScope = 'PRODUCT' | 'SHIPPING';

export interface AvailableCoupon {
    id: string;
    code: string;
    appliesTo: CouponScope;
    productScope: 'ALL' | 'SELECTED';
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount: number | null;
    endsAt: string;
    applicable: boolean;
    reason: 'MIN_ORDER_NOT_MET' | 'NO_ELIGIBLE_PRODUCT' | null;
    estimatedDiscount: number;
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
    /** Null until every product in the quote has a VAT rate. */
    vatAmount: number | null;
    /** VAT of the lines that do have a rate, available even when vatAmount is null. */
    productVatAmount: number;
    vatStatus: 'COMPLETE' | 'PRODUCT_RATES_MISSING';
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

export interface QuotePackageAmount {
    merchandise: number;
    productCoupon: number;
    vat: number;
    shippingFee: number;
    shippingCoupon: number;
    total: number;
}

export async function getQuotePackageTotals(id: string, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<Record<string, QuotePackageAmount>>>(
        `/api/customer/quotes/${id}/package-totals`,
        { signal },
    );
    return response.data.data;
}

export async function createQuoteDraft() {
    const response = await http.post<ApiResponse<Quote>>('/api/customer/quotes/draft');
    return response.data.data;
}

export async function createQuoteFromCart(items: { productId: string; quantity: number }[]) {
    const response = await http.post<ApiResponse<Quote>>('/api/customer/quotes/draft/from-cart', {
        items,
    });
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

export async function getAvailableCoupons(id: string, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<AvailableCoupon[]>>(
        `/api/customer/quotes/${id}/coupons/available`,
        { signal },
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
        {
            ...parcel,
            latitude: Number(parcel.latitude.toFixed(6)),
            longitude: Number(parcel.longitude.toFixed(6)),
        },
        { timeout: 25_000 },
    );
    return response.data.data;
}

export async function deleteQuotePackage(id: string, packageId: string) {
    await http.delete(`/api/customer/quotes/${id}/packages/${packageId}`);
}

/** Additional endpoints in BE features/customer/controller/CustomerQuoteController. */
export interface QuoteSummary {
    id: string;
    quoteNumber: string;
    status: string;
    revision: number;
    reviewNote: string | null;
    createdAt: string;
    submittedAt: string | null;
    updatedAt: string;
}
export interface CustomerQuotePage {
    content: QuoteSummary[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
export interface QuoteAvailability {
    available: boolean;
    items: {
        productId: string;
        sku: string;
        requestedQuantity: number;
        availableQuantity: number;
        available: boolean;
    }[];
}
export interface CreatedOrder {
    orderId: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    reservationExpiresAt: string | null;
}
export async function getMyQuotes(page = 0, size = 10) {
    const { data } = await http.get<ApiResponse<CustomerQuotePage>>('/api/customer/quotes', {
        params: { page, size },
    });
    return data.data;
}
export async function getQuoteAvailability(quoteId: string) {
    const { data } = await http.get<ApiResponse<QuoteAvailability>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/availability`,
    );
    return data.data;
}
export async function validateQuotePricing(quoteId: string, revision: number) {
    const { data } = await http.post<ApiResponse<Quote>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/validate-pricing`,
        { revision },
    );
    return data.data;
}
export async function placeOrderFromQuote(quoteId: string, revision: number) {
    const { data } = await http.post<ApiResponse<CreatedOrder>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/orders`,
        { revision },
    );
    return data.data;
}
export async function removeQuoteItem(quoteId: string, itemId: string) {
    const { data } = await http.delete<ApiResponse<Quote>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/items/${encodeURIComponent(itemId)}`,
    );
    return data.data;
}
export async function updateQuotePackage(
    quoteId: string,
    packageId: string,
    parcel: Omit<QuotePackage, 'id' | 'shippingFee' | 'distanceMetres'> & {
        latitude: number;
        longitude: number;
    },
) {
    const { data } = await http.put<ApiResponse<QuotePackage>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/packages/${encodeURIComponent(packageId)}`,
        {
            ...parcel,
            latitude: Number(parcel.latitude.toFixed(6)),
            longitude: Number(parcel.longitude.toFixed(6)),
        },
    );
    return data.data;
}
