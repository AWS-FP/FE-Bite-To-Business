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
