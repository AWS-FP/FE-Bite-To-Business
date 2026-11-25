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
    /** Supabase server clock determines expiry (not the browser clock). */
    expired?: boolean;
    imageUrl: string | null;
    status: string;
    promotionType: 'STANDARD' | 'FLASH_SALE';
    publishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type PromotionProductChoice = {
    id: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    imageUrl: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    unitCode: string;
    listPrice: number | null;
    salePrice: number | null;
    minOrderQuantity: number;
    availableQuantity: number;
    legacyPromotionId: string | null;
    legacyPromotionName: string | null;
    brandId: string | null;
    categoryId: string | null;
    saleDiscountPercent: number | null;
    categoryActive: boolean;
    selected: boolean;
};

export type PromotionProductFilter = {
    q: string;
    brandId: string | null;
    categoryId: string | null;
    inStockOnly: boolean;
    discountOnly: boolean;
};

export type PromotionPriceUpdate = {
    productId: string;
    expectedListPrice: number;
    expectedSalePrice: number | null;
    expectedSaleDiscountPercent: number | null;
    newSalePrice: number | null;
};

export type PromotionWrite = Pick<
    Promotion,
    | 'nameVi'
    | 'nameEn'
    | 'contentVi'
    | 'contentEn'
    | 'startsAt'
    | 'endsAt'
    | 'imageUrl'
    | 'promotionType'
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

/** Yêu cầu hủy package của khách (một dòng package_refunds). */
export interface ExecutiveRefund {
    id: string;
    requestGroupId: string | null;
    status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'REFUNDED';
    reason: string;
    recipientBank: string | null;
    recipientAccount: string | null;
    recipientName: string | null;
    refundAmount: number | null;
    reviewNote: string | null;
    transferReference: string | null;
    createdAt: string;
    reviewedAt: string | null;
    refundedAt: string | null;
    packageId: string;
    packageName: string;
    cancelledAt: string | null;
    deliveryDate: string;
    deliveryAddress: string;
    orderId: string;
    orderNumber: string;
    customerId: string;
    companyName: string | null;
    contactName: string;
    contactPhone: string;
    packageAmount: number;
}
