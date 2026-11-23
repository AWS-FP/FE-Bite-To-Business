import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { AdminPage, AdminPricing, AdminProduct, Coupon, CouponWrite, DashboardMetrics, ExecutiveReview, PricingWrite, ProductRequest, Promotion, PromotionPriceUpdate, PromotionProductChoice, PromotionProductFilter, PromotionWrite, Quote } from '@/types/e-commerce/executiveAdmin';

async function getData<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await http.get<ApiResponse<T>>(url, { params });
    return data.data;
}
async function postData<T>(url: string, payload?: unknown): Promise<T> {
    const { data } = await http.post<ApiResponse<T>>(url, payload);
    return data.data;
}
async function putData<T>(url: string, payload: unknown): Promise<T> {
    const { data } = await http.put<ApiResponse<T>>(url, payload);
    return data.data;
}
async function patchData<T>(
    url: string,
    payload: unknown,
    params?: Record<string, unknown>,
): Promise<T> {
    const { data } = await http.patch<ApiResponse<T>>(url, payload, { params });
    return data.data;
}

const api = '/api/ecommerce';
export const executiveApi = {
    metrics: (from: string, to: string) =>
        getData<DashboardMetrics>(`${api}/dashboard/metrics`, { from, to }),
    products: (params: { q?: string; status?: string; page: number; size: number }) =>
        getData<AdminPage<AdminProduct>>(`${api}/products`, params),
    productPricing: (id: string) => getData<AdminPricing>(`${api}/products/${id}/manage-pricing`),
    savePricing: (id: string, payload: PricingWrite) =>
        putData<AdminPricing>(`${api}/products/${id}/pricing`, payload),
    setProductStatus: (id: string, status: string) =>
        patchData<AdminProduct>(`${api}/products/${id}/status`, { status }),
    coupons: (page = 0, size = 20) => getData<AdminPage<Coupon>>(`${api}/coupons`, { page, size }),
    coupon: (id: string) => getData<Coupon>(`${api}/coupons/${id}`),
    createCoupon: (payload: CouponWrite) => postData<Coupon>(`${api}/coupons`, payload),
    updateCoupon: (id: string, payload: CouponWrite) =>
        putData<Coupon>(`${api}/coupons/${id}`, payload),
    setCouponActive: (id: string, active: boolean) =>
        patchData<Coupon>(`${api}/coupons/${id}/active`, {}, { active }),
    promotions: (status?: string, page = 0, size = 20, q?: string) =>
        getData<AdminPage<Promotion>>(`${api}/promotions`, { status, page, size, q }),
    promotion: (id: string) => getData<Promotion>(`${api}/promotions/${id}`),
    deletePromotion: async (id: string): Promise<void> => {
        await http.delete(`${api}/promotions/${encodeURIComponent(id)}`);
    },
    promotionProductIds: (id: string) => getData<string[]>(`${api}/promotions/${id}/product-ids`),
    promotionProductOptions: (id: string, filter: PromotionProductFilter, page = 0, size = 20) =>
        getData<AdminPage<PromotionProductChoice>>(`${api}/promotions/${id}/products`, {
            ...filter,
            page,
            size,
        }),
    promotionProductDetails: (id: string, productIds: string[]) =>
        postData<PromotionProductChoice[]>(`${api}/promotions/${id}/products/resolve`, {
            productIds,
        }),
    promotionMatchingProductIds: (id: string, filter: PromotionProductFilter) =>
        postData<string[]>(`${api}/promotions/${id}/products/matching`, filter),
    savePromotionProducts: (
        id: string,
        productIds: string[],
        priceUpdates: PromotionPriceUpdate[],
        expectedProductIds: string[],
    ) =>
        putData<Promotion>(`${api}/promotions/${id}/products`, {
            productIds,
            priceUpdates,
            expectedProductIds,
        }),
    createPromotion: (payload: PromotionWrite) => postData<Promotion>(`${api}/promotions`, payload),
    updatePromotion: (id: string, payload: PromotionWrite) =>
        putData<Promotion>(`${api}/promotions/${id}`, payload),
    promotionAction: (id: string, action: 'publish' | 'disable' | 'archive' | 'restore') =>
        postData<Promotion>(`${api}/promotions/${id}/${action}`),
    uploadPromotionImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await http.post<ApiResponse<{ imageUrl: string; publicId: string }>>(
            `${api}/promotions/images`,
            formData,
        );
        return data.data;
    },
    quotes: (status?: string, page = 0, size = 20) =>
        getData<AdminPage<Quote>>(`${api}/quotes`, { status, page, size }),
    quote: (id: string) => getData<Quote>(`${api}/quotes/${id}`),
    quoteReadiness: (id: string) =>
        getData<{
            quoteId: string;
            status: string;
            revision: number;
            approvalEnabled: boolean;
            checks: Record<
                | 'submitted'
                | 'hasItems'
                | 'vatComplete'
                | 'hasValidPackages'
                | 'allocationComplete'
                | 'stockAvailable',
                boolean
            >;
        }>(`${api}/quotes/${id}/readiness`),
    approveQuote: (id: string, expectedRevision: number) =>
        postData<Quote>(`${api}/quotes/${id}/decision`, { decision: 'APPROVED', expectedRevision }),
    rejectQuote: (id: string, expectedRevision: number, reason: string) =>
        postData<Quote>(`${api}/quotes/${id}/decision`, {
            decision: 'REJECTED',
            expectedRevision,
            reason,
        }),
    reviews: (status?: string, stars?: number, page = 0, size = 20) =>
        getData<AdminPage<ExecutiveReview>>(`${api}/reviews`, { status, stars, page, size }),
    moderateReview: (id: string, action: 'HIDE' | 'RESTORE', reason?: string) =>
        patchData<ExecutiveReview>(`${api}/reviews/${id}/moderation`, { action, reason }),
    productRequests: (status?: string, page = 0, size = 20) =>
        getData<AdminPage<ProductRequest>>(`${api}/product-requests`, { status, page, size }),
    productRequest: (id: string) =>
        getData<
            ProductRequest & {
                contactEmail?: string | null;
                notifyByEmail?: boolean;
                responses?: Array<{
                    id: string;
                    responseNote: string;
                    productName: string | null;
                    sellingPrice: number | null;
                    emailStatus: string;
                    createdAt: string;
                }>;
            }
        >(`${api}/product-requests/${id}`),
    startRequestReview: (id: string) =>
        patchData<ProductRequest>(`${api}/product-requests/${id}/start-review`, {}),
};
