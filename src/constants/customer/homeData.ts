export interface CoverflowBannerSlide {
    id: string;
    alt: string;
    targetLink: string;

    imageUrl: string;
}

export interface HomeCategoryItem {
    key: string;
    searchKeyword: string;
    skuCount: number;
    title: string;
    subtitle: string;
    cardBg: string;
    iconUrl: string;
}

export interface HomeProductCardItem {
    id: string;
    nameVi?: string;
    nameEn?: string;
    categoryLabel: string;
    categoryLabelEn?: string;
    sku: string;
    name: string;
    spec: string;
    rating?: number;
    reviewCount?: number;
    listPrice: number | null;
    salePrice?: number;
    discountBadge?: string;
    topLeftBadge?: string;
    certBadge: string;
    unit: string;

    imageUrl: string;
    availableQuantity?: number;
    minOrderQuantity?: number;
    quantityStep?: number;
}

export interface HomeComboPlanItem {
    id: string;
    audienceBadge: string;
    audienceBadgeBg: string;
    highlightText: string;
    title: string;
    description: string;
    features: string[];
    priceNote: string;
    oldPrice?: string;
    price: string;
    unit: string;
    ctaLabel: string;
    ctaLink: string;
    cardBg: string;
}

export interface NotificationItemData {
    id: string;
    category: 'system' | 'quote' | 'delivery';
    badge: string;
    badgeBg: string;
    badgeText: string;
    title: string;
    description: string;
    timeAgo: string;
    unread: boolean;
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
    isSystemUpdatePopup?: boolean;
    popupVersion?: string;
    popupHighlights?: { title: string; detail: string }[];
}

export interface ProductReviewItem {
    id: string;
    author: string;
    roleBadge?: string;
    date: string;
    rating: number;
    comment: string;
    cutenessScore: string;
    likesLabel: string;
    avatarBg: string;
}

export interface ProductDetailCatalogItem {
    id: string;
    sampleButtonLabel: string;
    breadcrumbCategory: string;
    breadcrumbSubcategory: string;
    categoryUpper: string;
    enterpriseName: string;
    warehouseBadge: string;
    skuCode: string;
    masterCatalogCode: string;
    name: string;
    topLeftBadge: string;
    certBadge: string;
    listPrice: number;
    sellingPrice: number;
    priceWithVat: number;
    vatRateLabel: string;
    unit: string;
    originCountry: string;
    moqLabel: string;
    nextOrderPromoText: string;
    rating: number;
    reviewCount: number;
    galleryImages: string[];
    highlights: {
        title: string;
        subtitle: string;
    }[];
    technicalSpecs: {
        enterpriseName: string;
        enterpriseTaxId: string;
        industryGroup: string;
        tradeName: string;
        netWeight: string;
        tareWeight: string;
        volume: string;
        dimensions: string;
        minimumQuantity: string;
        vatInfo: string;
        attributeFilter: string;
    };
    kitchenCommitment: {
        badge: string;
        title: string;
        description: string;
        bullets: string[];
    };
    chefStorageGuidelines: {
        tempZone: string;
        shelfLifeUnopened: string;
        shelfLifeOpened: string;
        thawingMethod: string;
        chefNotes: string[];
    };
    foodSafetyDossier: {
        certifications: { code: string; issuer: string; validUntil: string }[];
        microbialStandards: { parameter: string; limit: string; result: string }[];
    };
    originTraceability: {
        harvestRegion: string;
        processingFacility: string;
        importPort: string;
        coldChainHub: string;
        lotTimeline: { step: string; timestamp: string; detail: string }[];
    };
    reviews: ProductReviewItem[];
}

// 1. Coverflow Slider (6 full-card image posters)
// Product/category/banner data comes from Customer and public catalog APIs.
// The only retained local data below is the existing non-Customer notification demo.

export const INITIAL_NOTIFICATIONS: NotificationItemData[] = [
    {
        id: 'noti-system-v42',
        category: 'system',
        badge: 'ADMIN ANNOUNCEMENT • V4.2',
        badgeBg: 'bg-danger',
        badgeText: 'text-white',
        title: 'System Update: Launching 5-Star Reviews & Auto e-VAT Invoice',
        description:
            'MD Foods has officially released V4.2 with public 5-star reviews, automatic e-VAT invoice issuance, and A2UI improvements. Click to view full release notes.',
        timeAgo: 'Just now',
        unread: true,
        primaryActionLabel: 'View System Update Popup',
        isSystemUpdatePopup: true,
        popupVersion: 'V4.2',
        popupHighlights: [
            {
                title: 'Public 5-Star Product Reviews:',
                detail: 'B2B partners can now submit half-star ratings and upload real kitchen photos directly on the product detail page for full transparency.',
            },
            {
                title: 'Automated e-VAT Invoicing:',
                detail: 'Connected directly with your 10-digit Tax ID (MST) and accounting Gmail to issue electronic VAT invoices automatically once delivery is completed.',
            },
            {
                title: 'Performance & Adaptive UI (A2UI) Upgrade:',
                detail: 'Upgraded quantity selectors, instant category filters, and smart AI shopping assistant bubble.',
            },
        ],
    },
    {
        id: 'noti-quote-884',
        category: 'quote',
        badge: 'QUOTE APPROVED',
        badgeBg: 'bg-surface-green',
        badgeText: 'text-store-ink',
        title: 'Quote #QT-2026-884 has been approved',
        description:
            '100% stock verified for all 5 line items. Please confirm your order within 24 hours to lock inventory reservation.',
        timeAgo: '5 mins ago',
        unread: true,
        primaryActionLabel: 'Confirm Order Now',
        secondaryActionLabel: 'View Details',
    },
    {
        id: 'noti-delivery-512',
        category: 'delivery',
        badge: 'IN_DELIVERY • ETA 18M',
        badgeBg: 'bg-store-yellow',
        badgeText: 'text-store-ink',
        title: 'Cold truck is delivering Order #ORD-2026-512',
        description:
            'Departed from Tan Thuan Cold Hub for 2 drop-off stops. Estimated arrival at District 3 Central Kitchen at 05:30 AM.',
        timeAgo: '22 mins ago',
        unread: true,
        primaryActionLabel: 'Open Vietmap Route',
    },
    {
        id: 'noti-sourcing-anchor',
        category: 'quote',
        badge: 'NEW SOURCING REPLY',
        badgeBg: 'bg-surface-soft',
        badgeText: 'text-store-muted',
        title: 'Added to Catalog: Anchor Unsalted Butter 25kg Block',
        description:
            'Selling Price: 4,250,000đ/carton • Available Stock: 18 cartons ready to order.',
        timeAgo: 'Yesterday',
        unread: false,
    },
];

// 8. Sample Product Detail Datasets (With full 1-star to 5-star reviews for testing filter reload!)
export function formatCurrencyVnd(amount: number): string {
    return `${amount.toLocaleString('vi-VN')}đ`;
}
