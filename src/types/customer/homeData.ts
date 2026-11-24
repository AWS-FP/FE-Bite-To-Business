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
    /** True while the price is still being fetched; the card shows a placeholder, not "unavailable". */
    priceLoading?: boolean;
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
    actionUrl?: string;
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
