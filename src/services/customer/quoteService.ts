import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { SavedCoupon, CreatedOrder, CustomerQuotePage, Quote, QuoteAvailability, QuotePackage, QuotePackageAmount } from '@/types/customer/quote';

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

export async function inspectQuoteCoupon(quoteId: string, code: string) {
    const { data } = await http.post<ApiResponse<SavedCoupon>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/coupons/inspect`, { code },
    );
    return data.data;
}

export async function getReusableCoupons(quoteId: string, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<SavedCoupon[]>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/coupons/reusable`, { signal },
    );
    return data.data;
}

export async function replaceQuoteCart(quoteId: string, revision: number, items: { productId: string; quantity: number }[]) {
    const { data } = await http.put<ApiResponse<Quote>>(
        `/api/customer/quotes/${encodeURIComponent(quoteId)}/cart`, { items }, { params: { revision } },
    );
    return data.data;
}
