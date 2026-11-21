import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export type AdminPage<T> = {
    items: T[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
};
export type AdminProduct = {
    id: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    brandId: string | null;
    categoryId: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    unitCode: string;
    imageUrl: string | null;
    vatRate: number | null;
    origin: string | null;
    packageSpecVi: string | null;
    packageSpecEn: string | null;
    descriptionVi: string | null;
    descriptionEn: string | null;
    minOrderQuantity: number;
    quantityStep: number;
    listPrice: number | null;
    salePrice: number | null;
    saleDiscountPercent: number | null;
    createdAt: string;
    updatedAt: string;
};
export type PriceTier = {
    id?: string;
    minQuantity: number;
    maxQuantity: number | null;
    unitPrice: number;
};
export type AdminPricing = {
    productId: string;
    sku: string;
    unitCode: string;
    minOrderQuantity: number;
    quantityStep: number;
    listPrice: number | null;
    salePrice: number | null;
    saleDiscountPercent: number | null;
    priceTiers: PriceTier[];
};
export type PricingWrite = {
    listPrice: number;
    salePrice: number | null;
    saleDiscountPercent: number | null;
    tiers: PriceTier[];
};
export type Coupon = {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount: number | null;
    startsAt: string;
    endsAt: string;
    usageLimit: number | null;
    usageLimitPerUser: number | null;
    isActive: boolean;
    appliesTo: string;
    productScope: string;
    usedCount?: number;
    createdAt?: string;
    productIds?: string[];
};
export type CouponWrite = Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>;
export type Promotion = {
    id: string;
    nameVi: string;
    nameEn: string;
    contentVi: string | null;
    contentEn: string | null;
    startsAt: string;
    endsAt: string;
    imageUrl: string | null;
    status: string;
    publishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};
export type PromotionWrite = Pick<
    Promotion,
    'nameVi' | 'nameEn' | 'contentVi' | 'contentEn' | 'startsAt' | 'endsAt' | 'imageUrl'
>;
export type Quote = {
    id: string;
    quoteNumber: string;
    customerId: string;
    status: string;
    revision: number;
    companyName: string | null;
    contactName: string | null;
    itemsSubtotal: number;
    volumeDiscountAmount: number;
    saleDiscountAmount: number;
    couponDiscountAmount: number;
    shippingFee: number;
    vatAmount: number;
    totalAmount: number;
    submittedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    reviewNote?: string | null;
    note?: string | null;
    items?: Array<{
        id: string;
        productId: string;
        sku: string;
        nameVi: string;
        nameEn: string;
        quantity: number;
        unitCode: string;
        lineTotal: number;
        vatRate: number | null;
    }>;
    revisions?: Array<{ revision: number; changeNote: string | null; createdAt: string }>;
};
export type ExecutiveReview = {
    id: string;
    productId: string;
    customerId: string;
    rating: number;
    content: string;
    deletedAt: string | null;
    deletedBy: string | null;
    deletionReason: string | null;
    createdAt: string;
    updatedAt: string;
    productNameVi: string;
    productNameEn: string;
};
export type ProductRequest = {
    id: string;
    customerId: string;
    productName: string;
    referenceUrl: string | null;
    status: string;
    customerNote: string | null;
    createdAt: string;
    updatedAt: string;
};
export type DashboardMetrics = {
    publishedProducts: number;
    draftProducts: number;
    archivedProducts: number;
    pendingQuotes: number;
    approvedQuotes: number;
    rejectedQuotes: number;
    activePromotions: number;
    completedOrders: number;
    revenue: number;
    couponOrders: number;
    couponConversionRate: number | null;
};

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
    promotions: (status?: string, page = 0, size = 20) =>
        getData<AdminPage<Promotion>>(`${api}/promotions`, { status, page, size }),
    promotion: (id: string) => getData<Promotion>(`${api}/promotions/${id}`),
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
