export interface CoverflowBannerSlide {
    id: string
    alt: string
    targetLink: string
    /**
     * TODO: PUT YOUR FULL DESIGNED POSTER IMAGE HERE
     * Example: imageUrl: '/images/banners/poster-1.png'
     */
    imageUrl: string
}

export interface HomeCategoryItem {
    key: string
    searchKeyword: string
    skuCount: number
    title: string
    subtitle: string
    cardBg: string
    iconUrl: string
}

export interface HomeProductCardItem {
    id: string
    categoryLabel: string
    sku: string
    name: string
    spec: string
    rating: number
    reviewCount: number
    listPrice: number
    salePrice?: number
    discountBadge?: string
    topLeftBadge?: string
    certBadge: string
    unit: string
    /**
     * TODO: PUT YOUR FOOD PRODUCT IMAGE HERE
     * Example: imageUrl: '/images/products/salmon.jpg'
     */
    imageUrl: string
}

export interface HomeComboPlanItem {
    id: string
    audienceBadge: string
    audienceBadgeBg: string
    highlightText: string
    title: string
    description: string
    features: string[]
    priceNote: string
    oldPrice?: string
    price: string
    unit: string
    ctaLabel: string
    ctaLink: string
    cardBg: string
}

export type ProfileBadgeType =
    | 'ADMIN'
    | 'MAINTENANCE'
    | 'CUSTOMER'
    | 'DELIVERY'
    | 'PENDING PROFILE'

export interface NotificationItemData {
    id: string
    category: 'system' | 'quote' | 'delivery'
    badge: string
    badgeBg: string
    badgeText: string
    title: string
    description: string
    timeAgo: string
    unread: boolean
    primaryActionLabel?: string
    secondaryActionLabel?: string
    isSystemUpdatePopup?: boolean
    popupVersion?: string
    popupHighlights?: { title: string; detail: string }[]
}

export interface ProductReviewItem {
    id: string
    author: string
    roleBadge?: string
    date: string
    rating: number
    comment: string
    cutenessScore: string
    likesLabel: string
    avatarBg: string
}

export interface ProductDetailCatalogItem {
    id: string
    sampleButtonLabel: string
    breadcrumbCategory: string
    breadcrumbSubcategory: string
    categoryUpper: string
    enterpriseName: string
    warehouseBadge: string
    skuCode: string
    masterCatalogCode: string
    name: string
    topLeftBadge: string
    certBadge: string
    listPrice: number
    sellingPrice: number
    priceWithVat: number
    vatRateLabel: string
    unit: string
    originCountry: string
    moqLabel: string
    nextOrderPromoText: string
    rating: number
    reviewCount: number
    /**
     * TODO: PUT 3 GALLERY IMAGES FOR THIS PRODUCT HERE
     */
    galleryImages: string[]
    highlights: {
        title: string
        subtitle: string
    }[]
    technicalSpecs: {
        enterpriseName: string
        enterpriseTaxId: string
        industryGroup: string
        tradeName: string
        netWeight: string
        tareWeight: string
        volume: string
        dimensions: string
        minimumQuantity: string
        vatInfo: string
        attributeFilter: string
    }
    kitchenCommitment: {
        badge: string
        title: string
        description: string
        bullets: string[]
    }
    chefStorageGuidelines: {
        tempZone: string
        shelfLifeUnopened: string
        shelfLifeOpened: string
        thawingMethod: string
        chefNotes: string[]
    }
    foodSafetyDossier: {
        certifications: { code: string; issuer: string; validUntil: string }[]
        microbialStandards: { parameter: string; limit: string; result: string }[]
    }
    originTraceability: {
        harvestRegion: string
        processingFacility: string
        importPort: string
        coldChainHub: string
        lotTimeline: { step: string; timestamp: string; detail: string }[]
    }
    reviews: ProductReviewItem[]
}

// 1. Coverflow Slider (6 full-card image posters)
export const COVERFLOW_SLIDES: CoverflowBannerSlide[] = [
    {
        id: 'slide-1',
        alt: 'Fresh Farm Vegetables Poster',
        targetLink: '/catalog?q=Vegetables',
        imageUrl: '', // <-- TODO: NHÉT HÌNH POSTER SLIDER #1 VÀO ĐÂY
    },
    {
        id: 'slide-2',
        alt: 'Clean Meat & Seafood Poster',
        targetLink: '/catalog?q=Seafood',
        imageUrl: '', // <-- TODO: NHÉT HÌNH POSTER SLIDER #2 VÀO ĐÂY
    },
    {
        id: 'slide-3',
        alt: 'Imported Fresh Fruits Poster',
        targetLink: '/catalog?q=Fruits',
        imageUrl: '', // <-- TODO: NHÉT HÌNH POSTER SLIDER #3 VÀO ĐÂY
    },
    {
        id: 'slide-4',
        alt: 'Barista Milk & Dairy Poster',
        targetLink: '/catalog?q=Milk',
        imageUrl: '', // <-- TODO: NHÉT HÌNH POSTER SLIDER #4 VÀO ĐÂY
    },
    {
        id: 'slide-5',
        alt: 'Omega-3 Eggs Early Market Poster',
        targetLink: '/catalog?q=Eggs',
        imageUrl: '', // <-- TODO: NHÉT HÌNH POSTER SLIDER #5 VÀO ĐÂY
    },
    {
        id: 'slide-6',
        alt: 'ST25 Rice & Bakery Flour Poster',
        targetLink: '/catalog?q=Rice',
        imageUrl: '', // <-- TODO: NHÉT HÌNH POSTER SLIDER #6 VÀO ĐÂY
    },
]

// 2. Partner Brands
export const PARTNER_BRANDS: string[] = [
    'DALAT GAP FARMS',
    'NORWAY SALMON AIR',
    'MEATDELI PARTNER',
    'MEKONG DELTA CO-OP',
    'GREENHOUSE VIET',
]

// 3. 14 Categories
export const HOME_CATEGORIES: HomeCategoryItem[] = [
    {
        key: 'meatPoultry',
        searchKeyword: 'Meat and poultry',
        skuCount: 95,
        title: 'Meat & Poultry',
        subtitle: 'US/AU beef, chilled pork, chicken',
        cardBg: 'bg-white',
        iconUrl: '/icons/meat-on-bone-svgrepo-com.svg',
    },
    {
        key: 'fishSeafood',
        searchKeyword: 'Fish and seafood',
        skuCount: 78,
        title: 'Fish & Seafood',
        subtitle: 'Norwegian salmon, shrimp, squid',
        cardBg: 'bg-white',
        iconUrl: '/icons/lobster-svgrepo-com.svg',
    },
    {
        key: 'eggs',
        searchKeyword: 'Eggs',
        skuCount: 24,
        title: 'Fresh Eggs',
        subtitle: 'Free-range, Omega-3, duck, quail',
        cardBg: 'bg-white',
        iconUrl: '/icons/egg-svgrepo-com.svg',
    },
    {
        key: 'vegetablesMushrooms',
        searchKeyword: 'Vegetables and mushrooms',
        skuCount: 140,
        title: 'Vegetables & Mushrooms',
        subtitle: 'Dalat greens, organic mushrooms',
        cardBg: 'bg-white',
        iconUrl: '/icons/vegetables-carrot-svgrepo-com.svg',
    },
    {
        key: 'fruits',
        searchKeyword: 'Seasonal fruits',
        skuCount: 65,
        title: 'Fresh Fruits',
        subtitle: 'Seasonal & imported fruits',
        cardBg: 'bg-white',
        iconUrl: '/icons/fruits-fruit-svgrepo-com.svg',
    },
    {
        key: 'riceGrainsFlour',
        searchKeyword: 'Rice, grains and flour',
        skuCount: 48,
        title: 'Rice, Grains & Flour',
        subtitle: 'ST25 rice, pastry flour',
        cardBg: 'bg-white',
        iconUrl: '/icons/wheat-barley-svgrepo-com.svg',
    },
    {
        key: 'noodlesPasta',
        searchKeyword: 'Noodles and pasta',
        skuCount: 52,
        title: 'Noodles & Pasta',
        subtitle: 'Fresh noodles, spaghetti, dry pho',
        cardBg: 'bg-white',
        iconUrl: '/icons/spaghetti-svgrepo-com.svg',
    },
    {
        key: 'beansNuts',
        searchKeyword: 'Beans and nuts',
        skuCount: 36,
        title: 'Beans & Nuts',
        subtitle: 'Cashews, almonds, legumes',
        cardBg: 'bg-white',
        iconUrl: '/icons/beans-svgrepo-com.svg',
    },
    {
        key: 'dairyProducts',
        searchKeyword: 'Milk and dairy',
        skuCount: 64,
        title: 'Milk & Dairy',
        subtitle: 'Fresh milk, butter, cheese',
        cardBg: 'bg-white',
        iconUrl: '/icons/milk-carton-svgrepo-com.svg',
    },
    {
        key: 'tofuVegetarian',
        searchKeyword: 'Tofu and vegetarian',
        skuCount: 42,
        title: 'Tofu & Plant-Based',
        subtitle: 'Silken tofu, bean curd skin',
        cardBg: 'bg-white',
        iconUrl: '/icons/tofu-svgrepo-com.svg',
    },
    {
        key: 'oilSpicesSauces',
        searchKeyword: 'Cooking oil, spices and sauces',
        skuCount: 110,
        title: 'Oils, Spices & Sauces',
        subtitle: 'Cooking oil, Asian & Western sauces',
        cardBg: 'bg-white',
        iconUrl: '/icons/sauce-ketchup-svgrepo-com.svg',
    },
    {
        key: 'processedCanned',
        searchKeyword: 'Processed food',
        skuCount: 58,
        title: 'Processed & Canned',
        subtitle: 'Sausages, cold cuts, canned goods',
        cardBg: 'bg-white',
        iconUrl: '/icons/can-soda-svgrepo-com.svg',
    },
    {
        key: 'bakeryDesserts',
        searchKeyword: 'Bakery',
        skuCount: 39,
        title: 'Bakery & Desserts',
        subtitle: 'Frozen pastry dough, cake bases',
        cardBg: 'bg-white',
        iconUrl: '/icons/cake-svgrepo-com.svg',
    },
    {
        key: 'beveragesBarista',
        searchKeyword: 'Beverages',
        skuCount: 88,
        title: 'Beverages & Barista',
        subtitle: 'Tea, coffee, syrups, fruit jams',
        cardBg: 'bg-white',
        iconUrl: '/icons/drink-soda-svgrepo-com.svg',
    },
]

// 4. Early Market Flash Deals
export const FLASH_SALE_PRODUCTS: HomeProductCardItem[] = [
    {
        id: 'salmon',
        categoryLabel: 'FISH & SEAFOOD',
        sku: 'SEA-SAL-01',
        name: 'Fresh Norwegian Salmon Fillet (Sashimi Cut)',
        spec: 'Whole fillet 5-6kg',
        rating: 4.5,
        reviewCount: 420,
        listPrice: 485000,
        salePrice: 388000,
        discountBadge: '20% OFF',
        certBadge: 'GlobalGAP • Air Freight',
        unit: 'kg',
        imageUrl: '', // <-- TODO: NHÉT HÌNH MÓN ĂN FLASH SALE #1 VÀO ĐÂY
    },
    {
        id: 'cabbage',
        categoryLabel: 'VEGETABLES & MUSHROOMS',
        sku: 'KAM-VEG-02',
        name: 'Kamereo Shredded White Cabbage (K894)',
        spec: 'Pre-washed bag 1kg',
        rating: 4.6,
        reviewCount: 185,
        listPrice: 45000,
        salePrice: 36000,
        discountBadge: '20% OFF',
        certBadge: 'VietGAP • Dalat Farm',
        unit: 'bag',
        imageUrl: '', // <-- TODO: NHÉT HÌNH MÓN ĂN FLASH SALE #2 VÀO ĐÂY
    },
    {
        id: 'tuna',
        categoryLabel: 'FISH & SEAFOOD',
        sku: 'HNM-TUN-03',
        name: 'Ocean Yellowfin Saku Tuna Block (500g)',
        spec: 'Vacuum tray 500g',
        rating: 4.8,
        reviewCount: 310,
        listPrice: 260000,
        salePrice: 208000,
        discountBadge: '20% OFF',
        certBadge: 'HACCP • Sashimi Grade',
        unit: 'tray',
        imageUrl: '', // <-- TODO: NHÉT HÌNH MÓN ĂN FLASH SALE #3 VÀO ĐÂY
    },
    {
        id: 'salmon-belly',
        categoryLabel: 'FISH & SEAFOOD',
        sku: 'SEA-SAL-04',
        name: 'Norwegian Salmon Belly Strips (Trim D)',
        spec: 'Chilled tray 1kg',
        rating: 4.6,
        reviewCount: 215,
        listPrice: 420000,
        salePrice: 336000,
        discountBadge: '20% OFF',
        certBadge: 'GlobalGAP • Air Freight',
        unit: 'kg',
        imageUrl: '',
    },
    {
        id: 'tiger-shrimp',
        categoryLabel: 'FISH & SEAFOOD',
        sku: 'MPC-SHR-05',
        name: 'Minh Phu Black Tiger Shrimp HOSO (Size 20)',
        spec: 'Frozen box 1kg',
        rating: 4.7,
        reviewCount: 290,
        listPrice: 350000,
        salePrice: 280000,
        discountBadge: '20% OFF',
        certBadge: 'ASC Certified • Export',
        unit: 'box',
        imageUrl: '',
    },
    {
        id: 'au-striploin',
        categoryLabel: 'MEAT & POULTRY',
        sku: 'PAC-BEF-06',
        name: 'Chilled Australian Beef Striploin Steak Cut',
        spec: 'Vacuum pack 2kg',
        rating: 4.9,
        reviewCount: 512,
        listPrice: 620000,
        salePrice: 496000,
        discountBadge: '20% OFF',
        certBadge: 'MLA Australia • Chilled',
        unit: 'kg',
        imageUrl: '',
    },
    {
        id: 'omega-eggs',
        categoryLabel: 'FRESH EGGS',
        sku: 'MDF-EGG-07',
        name: 'Pasteurized Omega-3 Free-Range Chicken Eggs',
        spec: 'Tray of 30 eggs',
        rating: 4.8,
        reviewCount: 640,
        listPrice: 115000,
        salePrice: 92000,
        discountBadge: '20% OFF',
        certBadge: 'VietGAP • UV Sterilized',
        unit: 'tray',
        imageUrl: '',
    },
    {
        id: 'anchor-butter',
        categoryLabel: 'MILK & DAIRY',
        sku: 'ANC-DAI-08',
        name: 'Anchor New Zealand Unsalted Culinary Butter',
        spec: 'Bulk carton 5kg',
        rating: 4.9,
        reviewCount: 380,
        listPrice: 1250000,
        salePrice: 1000000,
        discountBadge: '20% OFF',
        certBadge: 'Fonterra NZ • Imported',
        unit: 'box',
        imageUrl: '',
    },
    {
        id: 'st25-rice',
        categoryLabel: 'RICE, GRAINS & FLOUR',
        sku: 'MKG-RIC-09',
        name: 'Soc Trang ST25 Premium Fragrant Jasmine Rice',
        spec: 'Commercial sack 25kg',
        rating: 4.8,
        reviewCount: 410,
        listPrice: 780000,
        salePrice: 624000,
        discountBadge: '20% OFF',
        certBadge: 'OCOP 5-Star • New Crop',
        unit: 'bag',
        imageUrl: '',
    },
]

// 5. B2B Standard Food Supply
export const STANDARD_B2B_PRODUCTS: HomeProductCardItem[] = [
    {
        id: 'salmon',
        categoryLabel: 'FISH & SEAFOOD',
        sku: 'SEA-SAL-01',
        name: 'Fresh Norwegian Salmon Fillet (Standard Vivian Cut)',
        spec: 'Whole fish 5-6kg',
        rating: 4.5,
        reviewCount: 420,
        listPrice: 485000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'GlobalGAP • Air Freight',
        unit: 'kg',
        imageUrl: '', // <-- TODO: NHÉT HÌNH MÓN ĂN B2B #1 VÀO ĐÂY
    },
    {
        id: 'cabbage',
        categoryLabel: 'VEGETABLES & MUSHROOMS',
        sku: 'KAM-VEG-02',
        name: 'Kamereo Shredded White Cabbage (K894)',
        spec: 'Pre-washed bag 1kg',
        rating: 4.6,
        reviewCount: 185,
        listPrice: 45000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'VietGAP • Dalat Farm',
        unit: 'bag',
        imageUrl: '', // <-- TODO: NHÉT HÌNH MÓN ĂN B2B #2 VÀO ĐÂY
    },
    {
        id: 'tuna',
        categoryLabel: 'FISH & SEAFOOD',
        sku: 'HNM-TUN-03',
        name: 'Ocean Yellowfin Saku Tuna Block (500g)',
        spec: 'Vacuum tray 500g',
        rating: 4.8,
        reviewCount: 310,
        listPrice: 260000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'HACCP • Sashimi Grade',
        unit: 'tray',
        imageUrl: '', // <-- TODO: NHÉT HÌNH MÓN ĂN B2B #3 VÀO ĐÂY
    },
    {
        id: 'b2b-prod-04',
        categoryLabel: 'FISH & SEAFOOD',
        sku: 'SEA-SAL-04',
        name: 'Hokkaido Japanese Sashimi Scallops (Size 20-30)',
        spec: 'Frozen box 1kg',
        rating: 4.7,
        reviewCount: 295,
        listPrice: 450000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'GlobalGAP • Air Freight',
        unit: 'kg',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-05',
        categoryLabel: 'MEAT & POULTRY',
        sku: 'US-BEF-05',
        name: 'US Choice Beef Short Plate Sliced (Hotpot Cut)',
        spec: 'Chilled tray 1kg',
        rating: 4.6,
        reviewCount: 510,
        listPrice: 320000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'USDA Choice • Chilled',
        unit: 'kg',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-06',
        categoryLabel: 'MILK & DAIRY',
        sku: 'BAR-MLK-06',
        name: 'Pasteurized Barista Fresh Milk Case (12 x 1L)',
        spec: 'Case of 12 cartons',
        rating: 4.9,
        reviewCount: 610,
        listPrice: 460000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'ISO 22000 • Cold Chain',
        unit: 'case',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-07',
        categoryLabel: 'VEGETABLES & MUSHROOMS',
        sku: 'DLT-SAL-07',
        name: 'Dalat Hydroponic Mixed Salad Greens (B2B Box)',
        spec: 'Box 2kg',
        rating: 4.7,
        reviewCount: 190,
        listPrice: 110000,
        topLeftBadge: 'Fresh Harvest',
        certBadge: 'VietGAP • Hydroponic',
        unit: 'box',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-08',
        categoryLabel: 'BAKERY & DESSERTS',
        sku: 'BKR-CRO-08',
        name: 'French Butter Croissant Frozen Dough (60 pcs)',
        spec: 'Carton 60 pieces',
        rating: 4.8,
        reviewCount: 245,
        listPrice: 690000,
        topLeftBadge: 'Chef Choice',
        certBadge: 'HACCP • Ready to Bake',
        unit: 'box',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-09',
        categoryLabel: 'OILS, SPICES & SAUCES',
        sku: 'KIK-SOY-09',
        name: 'Kikkoman Naturally Brewed Soy Sauce (18L Tin)',
        spec: 'Commercial tin 18L',
        rating: 4.9,
        reviewCount: 330,
        listPrice: 1380000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'Imported • Restaurant Tin',
        unit: 'tin',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-10',
        categoryLabel: 'TOFU & PLANT-BASED',
        sku: 'MDF-TOF-10',
        name: 'Organic Non-GMO Japanese Silken Tofu Tray',
        spec: 'Case of 12 boxes',
        rating: 4.6,
        reviewCount: 140,
        listPrice: 180000,
        topLeftBadge: 'Fresh Daily',
        certBadge: 'ISO 22000 • Non-GMO',
        unit: 'case',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-11',
        categoryLabel: 'NOODLES & PASTA',
        sku: 'ITA-PAS-11',
        name: 'De Cecco Durum Wheat Spaghetti No.12 (Bulk 5kg)',
        spec: 'Foodservice pack 5kg',
        rating: 4.8,
        reviewCount: 275,
        listPrice: 390000,
        topLeftBadge: 'B2B Bulk',
        certBadge: 'Imported Italy • Al Dente',
        unit: 'pack',
        imageUrl: '',
    },
    {
        id: 'b2b-prod-12',
        categoryLabel: 'BEVERAGES & BARISTA',
        sku: 'ARA-COF-12',
        name: 'Cau Dat Specialty Roasted Arabica Beans (1kg)',
        spec: 'Valve bag 1kg',
        rating: 4.9,
        reviewCount: 490,
        listPrice: 340000,
        topLeftBadge: '#1 Best Seller',
        certBadge: 'UTZ Certified • Medium Roast',
        unit: 'bag',
        imageUrl: '',
    },
]

// 6. Combo Packages
export const HOME_COMBO_PLANS: HomeComboPlanItem[] = [
    {
        id: 'combo-home-kitchen',
        audienceBadge: 'HOUSEHOLD 30 - 50 PAX',
        audienceBadgeBg: 'bg-[#FACC15]',
        highlightText: 'Save 110,000đ',
        title: '5-Day Fresh Kitchen Bundle',
        description:
            'Complete meat, fish, eggs, Dalat vegetables, and seasonal dessert fruits pre-portioned by tray.',
        features: [
            '15.5kg Chilled pork, AU beef & salmon fillet',
            '9.5kg Dalat organic vegetables & mushrooms (7 types)',
            '20 trays Omega-3 chicken eggs + 2 boxes silken tofu',
            '18.5kg Seasonal fresh fruits',
        ],
        priceNote: '760,000đ',
        oldPrice: '760,000đ',
        price: '2,450,000đ',
        unit: '/ week',
        ctaLabel: 'Order Bundle',
        ctaLink: '/catalog?type=combo',
        cardBg: 'bg-[#F6EFE2]',
    },
    {
        id: 'combo-barista-bakery',
        audienceBadge: 'CAFÉ & BAKERY',
        audienceBadgeBg: 'bg-[#F490B1]',
        highlightText: '18% Wholesale Off',
        title: 'Morning Barista & Pastry Combo',
        description:
            'Scheduled Mon - Wed - Fri delivery for coffee shops, with full input VAT invoices included.',
        features: [
            '2 Cases Pasteurized Barista Fresh Milk (24L)',
            '1 Case Frozen Croissant & Danish Dough (60 pcs)',
            '5kg Navel oranges, strawberries & yellow lemons',
            '4 Bottles Specialty Caramel Syrup & Sauce',
        ],
        priceNote: 'Weekly credit terms available',
        price: '2,450,000đ',
        unit: '/ batch',
        ctaLabel: 'Schedule Delivery',
        ctaLink: '/quotes',
        cardBg: 'bg-[#FFFFFF]',
    },
    {
        id: 'combo-restaurant-catering',
        audienceBadge: 'RESTAURANT & CANTEEN',
        audienceBadgeBg: 'bg-[#FACC15]',
        highlightText: '30-Day Price Lock',
        title: 'Standard Asian - Western Kitchen Pack',
        description:
            'Portion-cut to Executive Chef specifications, guaranteeing 0% prep waste.',
        features: [
            '10kg AU Beef Striploin, pork ribs & chicken thighs',
            '15kg Hydroponic salad greens, tomatoes, potatoes',
            '25kg ST25 Rice + 5kg Italian Pasta & Fresh Noodles',
            '10L Cooking Oil Can + Core kitchen base sauces',
        ],
        priceNote: 'Master supply contract',
        price: '4,890,000đ',
        unit: '/ batch',
        ctaLabel: 'Customize Portions',
        ctaLink: '/quotes',
        cardBg: 'bg-[#FFFFFF]',
    },
]

// 7. Notifications Data
export const INITIAL_NOTIFICATIONS: NotificationItemData[] = [
    {
        id: 'noti-system-v42',
        category: 'system',
        badge: 'ADMIN ANNOUNCEMENT • V4.2',
        badgeBg: 'bg-[#EF4444]',
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
                detail:
                    'B2B partners can now submit half-star ratings and upload real kitchen photos directly on the product detail page for full transparency.',
            },
            {
                title: 'Automated e-VAT Invoicing:',
                detail:
                    'Connected directly with your 10-digit Tax ID (MST) and accounting Gmail to issue electronic VAT invoices automatically once delivery is completed.',
            },
            {
                title: 'Performance & Adaptive UI (A2UI) Upgrade:',
                detail:
                    'Upgraded quantity selectors, instant category filters, and smart AI shopping assistant bubble.',
            },
        ],
    },
    {
        id: 'noti-quote-884',
        category: 'quote',
        badge: 'QUOTE APPROVED',
        badgeBg: 'bg-[#DDF0E6]',
        badgeText: 'text-[#133425]',
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
        badgeBg: 'bg-[#FACC15]',
        badgeText: 'text-[#14132b]',
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
        badgeBg: 'bg-gray-200',
        badgeText: 'text-gray-700',
        title: 'Added to Catalog: Anchor Unsalted Butter 25kg Block',
        description:
            'Selling Price: 4,250,000đ/carton • Available Stock: 18 cartons ready to order.',
        timeAgo: 'Yesterday',
        unread: false,
    },
]

// 8. Sample Product Detail Datasets (With full 1-star to 5-star reviews for testing filter reload!)
export const CATALOG_PRODUCT_DETAILS: Record<string, ProductDetailCatalogItem> =
    {
        salmon: {
            id: 'salmon',
            sampleButtonLabel: 'Norwegian Salmon',
            breadcrumbCategory: 'Fish & Seafood',
            breadcrumbSubcategory: 'Fresh Fish & Sashimi',
            categoryUpper: 'FISH AND SEAFOOD',
            enterpriseName: 'NORWAY SALMON AIR',
            warehouseBadge: 'Available in District 7 warehouse',
            skuCode: 'SEA-SAL-01 / MDF-FISH-SALMONFILLET-CH-1KG',
            masterCatalogCode: 'MDF-FISH-SALMONFILLET-CH-1KG',
            name: 'Fresh Norwegian Salmon Fillet (Standard Vivian-style cut)',
            topLeftBadge: '#1 Best Seller',
            certBadge: 'GlobalGAP - Air Freight',
            listPrice: 719000,
            sellingPrice: 485000,
            priceWithVat: 523800,
            vatRateLabel: '8%',
            unit: 'kg',
            originCountry: 'Norway / Vietnam',
            moqLabel: '2kg',
            nextOrderPromoText: 'Save up to 20% on your next order.',
            rating: 4.5,
            reviewCount: 420,
            galleryImages: ['', '', ''], // <-- TODO: NHÉT 3 HÌNH GALLERY CỦA CÁ HỒI VÀO ĐÂY
            highlights: [
                {
                    title: 'Standard Trim C',
                    subtitle: 'Remove all pin bones',
                },
                {
                    title: 'Store at 0–2°C',
                    subtitle: 'Refrigerated truck',
                },
                {
                    title: '1-to-1 replacement',
                    subtitle: 'Within 2 hours in the kitchen',
                },
            ],
            technicalSpecs: {
                enterpriseName:
                    'MD Foods Direct Supply (Partner: SalMar Norway Salmon Air Co., Ltd)',
                enterpriseTaxId: '0318899201 (Verified B2B Supplier)',
                industryGroup: 'Fish and seafood',
                tradeName: 'Fresh Norwegian Salmon Fillet Trim C Tray 1kg Breakdown',
                netWeight: '1.0 kg (Can be cut into individual 0.5 kg trays)',
                tareWeight: '0.020 kg (Foam tray & vacuum sealed)',
                volume: '0.0018 m³',
                dimensions: '20 cm × 3 cm × 30 cm',
                minimumQuantity: '2kg',
                vatInfo: '8% (Automatic electronic invoice issuance)',
                attributeFilter: 'Eat raw, Fresh, Sashimi grade',
            },
            kitchenCommitment: {
                badge: '0% WEIGHT LOSS COMMITMENT FOR KITCHENS',
                title: 'Optimizing Food Cost for Japanese & European Restaurants',
                description:
                    'Ingredients are processed according to international Trim C standards: spinal bone, ribs, belly fin, excess belly fat have been removed, and 100% of the pin bones have been plucked clean. Upon receiving the product, chefs can immediately cut and slice it for Sashimi, Nigiri, or pan-sear it right away.',
                bullets: [
                    'Sashimi-grade freshness maintained within 72 hours of arriving at Tan Son Nhat Airport.',
                    'Support the portion tray division as requested by the Head Chef.',
                    '30-day price stabilization contract for F&B chains and corporate canteens.',
                ],
            },
            chefStorageGuidelines: {
                tempZone: 'Chilled 0°C to 2°C (Dedicated Sashimi Chiller)',
                shelfLifeUnopened: '5 Days from packing date (Vacuum sealed)',
                shelfLifeOpened: 'Consume within 24 hours after opening vacuum seal',
                thawingMethod:
                    'Never freeze or soak in water; keep chilled on crushed ice bed covered with absorbent paper.',
                chefNotes: [
                    'Use separate sanitized sashimi knife (Yanagiba) to prevent cross-contamination.',
                    'Pat dry with culinary paper towel every 12 hours to preserve firm flesh texture.',
                    'Belly section is ideal for Aburi Nigiri; loin section is best for thick Sashimi cuts.',
                ],
            },
            foodSafetyDossier: {
                certifications: [
                    {
                        code: 'GlobalGAP Aquaculture #GGN-4052852',
                        issuer: 'Norwegian Seafood Council',
                        validUntil: '31/12/2027',
                    },
                    {
                        code: 'HACCP & ISO 22000:2018 Cold Chain',
                        issuer: 'SGS Vietnam Certification',
                        validUntil: '15/09/2027',
                    },
                    {
                        code: 'Veterinary Health & Quarantine Certificate',
                        issuer: 'Tan Son Nhat Animal Quarantine Dept.',
                        validUntil: 'Updated per Air Batch',
                    },
                ],
                microbialStandards: [
                    {
                        parameter: 'Histamine Level',
                        limit: '< 50 mg/kg',
                        result: '4.2 mg/kg (Passed)',
                    },
                    {
                        parameter: 'Salmonella spp.',
                        limit: 'Not detected / 25g',
                        result: 'Negative (Passed)',
                    },
                    {
                        parameter: 'Core Flesh Temperature on Arrival',
                        limit: '0.0°C – 2.0°C',
                        result: '1.1°C (Passed)',
                    },
                ],
            },
            originTraceability: {
                harvestRegion: 'Frøya Fjords, Trøndelag, Norway (FAO Area 27)',
                processingFacility: 'MD Foods Cleanroom Processing Hub — District 7',
                importPort: 'Tan Son Nhat International Cargo Terminal (SGN)',
                coldChainHub: 'Landmark 81 / Tan Thuan Cold Storage Hub',
                lotTimeline: [
                    {
                        step: '1. Harvest & Primary Ice Packing',
                        timestamp: 'Day 0 — 06:00 UTC',
                        detail:
                            'Harvested at Frøya cold-water fjords and packed in thermo boxes at 0.5°C.',
                    },
                    {
                        step: '2. Air Freight Express to Ho Chi Minh City',
                        timestamp: 'Day 1 — 18:30 GMT+7',
                        detail:
                            'Direct temperature-controlled cargo flight to Tan Son Nhat Airport.',
                    },
                    {
                        step: '3. Trim C Filleting & Pin-Bone Removal',
                        timestamp: 'Day 2 — 02:00 GMT+7',
                        detail:
                            'Filleted in 4°C cleanroom, vacuum-packed in 1kg trays, ready for 05:00 AM kitchen delivery.',
                    },
                ],
            },
            reviews: [
                {
                    id: 'rev-sal-5a',
                    author: "kimo's no.1 fan",
                    roleBadge: 'HEAD CHEF • OMAKASE D1',
                    date: '12/04/2026',
                    rating: 5,
                    comment:
                        'Trim C quality is super consistent across all 20 trays we ordered this week. Automatic VAT invoice arrived in our accounting Gmail right after delivery!',
                    cutenessScore: 'sashimi grade: 10/10',
                    likesLabel: '69k',
                    avatarBg: 'from-[#A7F3D0] to-[#10B981]',
                },
                {
                    id: 'rev-sal-5b',
                    author: 'Chef Kenji Sato',
                    roleBadge: 'SUSHI BAR CHAIN',
                    date: '11/04/2026',
                    rating: 5,
                    comment:
                        'Zero pin bones, firm orange flesh and clean white marbling. Core temperature upon arrival at 05:20 AM was 1.2°C.',
                    cutenessScore: 'freshness: 100/10',
                    likesLabel: '24k',
                    avatarBg: 'from-[#BAE6FD] to-[#0284C7]',
                },
                {
                    id: 'rev-sal-4a',
                    author: 'Vivian Banshee',
                    roleBadge: 'VIP PARTNER',
                    date: '09/04/2026',
                    rating: 4,
                    comment:
                        'omg this has to be the best design ever from Kimo, i just love him so much >O<, if i ever win a lottery i would hire Mr. Kimo immediately ^w^',
                    cutenessScore: 'cuteness: ∞∞∞∞∞∞∞∞∞∞/10',
                    likesLabel: '42k',
                    avatarBg: 'from-[#C4B5FD] to-[#818CF8]',
                },
                {
                    id: 'rev-sal-4b',
                    author: 'not Vivian fr',
                    roleBadge: 'BISTRO OWNER',
                    date: '08/04/2026',
                    rating: 4,
                    comment:
                        'Great salmon fillet, vacuum trays are super clean. Deducting 1 star only because our security guard delayed the truck by 10 mins.',
                    cutenessScore: 'packaging: 9.5/10',
                    likesLabel: '10k',
                    avatarBg: 'from-[#FBCFE8] to-[#EC4899]',
                },
                {
                    id: 'rev-sal-3a',
                    author: 'Lotus Hotel Purchasing',
                    roleBadge: 'HOTEL BANQUET',
                    date: '05/04/2026',
                    rating: 3,
                    comment:
                        'Fish quality is good, but one tray in our 15kg batch was cut slightly thinner near the tail section. Still worked fine for pan-seared salmon.',
                    cutenessScore: 'portion uniformity: 7.5/10',
                    likesLabel: '1.2k',
                    avatarBg: 'from-[#FDE68A] to-[#D97706]',
                },
                {
                    id: 'rev-sal-2a',
                    author: 'poke_station_d7',
                    roleBadge: 'POKE KITCHEN',
                    date: '02/04/2026',
                    rating: 2,
                    comment:
                        'Ordered late at 11:30 PM so missed the first 05:00 AM cold truck wave and had to wait for the 08:30 AM trip. Fish itself was fresh though.',
                    cutenessScore: 'delivery slot: 6/10',
                    likesLabel: '340',
                    avatarBg: 'from-[#FED7AA] to-[#EA580C]',
                },
                {
                    id: 'rev-sal-1a',
                    author: 'ramen_alley_q3',
                    roleBadge: 'NEW BUYER',
                    date: '29/03/2026',
                    rating: 1,
                    comment:
                        'Accidentally ordered whole fillet instead of 0.5kg pre-portioned trays because I forgot to fill the kitchen note box. Support helped us swap it within 2 hours.',
                    cutenessScore: 'resolved by support',
                    likesLabel: '128',
                    avatarBg: 'from-[#FECACA] to-[#DC2626]',
                },
            ],
        },

        cabbage: {
            id: 'cabbage',
            sampleButtonLabel: 'Kamereo Cabbage (K894)',
            breadcrumbCategory: 'Vegetables & Mushrooms',
            breadcrumbSubcategory: 'Pre-washed Salad Greens',
            categoryUpper: 'VEGETABLES AND MUSHROOMS',
            enterpriseName: 'DALAT GAP FARMS',
            warehouseBadge: 'Available in District 7 warehouse',
            skuCode: 'KAM-VEG-02 / KAM-VEG-CABBAGE-SHRED-1KG',
            masterCatalogCode: 'KAM-VEG-CABBAGE-SHRED-1KG',
            name: 'Kamereo Shredded White Cabbage (Ready-to-Use 1kg Pack)',
            topLeftBadge: 'Kitchen Saver',
            certBadge: 'VietGAP - Dalat Farm',
            listPrice: 55000,
            sellingPrice: 45000,
            priceWithVat: 48600,
            vatRateLabel: '8%',
            unit: 'bag',
            originCountry: 'Lam Dong, Vietnam',
            moqLabel: '5 bags',
            nextOrderPromoText: 'Volume discount available from 20 bags.',
            rating: 4.6,
            reviewCount: 185,
            galleryImages: ['', '', ''],
            highlights: [
                {
                    title: '1.5mm Fine Shred',
                    subtitle: 'Zero knife prep needed',
                },
                {
                    title: 'Store at 2–6°C',
                    subtitle: 'Crisp for 4 days',
                },
                {
                    title: '100% Usable Yield',
                    subtitle: 'Outer leaves & core removed',
                },
            ],
            technicalSpecs: {
                enterpriseName:
                    'MD Foods Direct Supply (Partner: Dalat GAP High-Tech Agriculture Co., Ltd)',
                enterpriseTaxId: '5800412903 (Verified VietGAP Producer)',
                industryGroup: 'Vegetables and mushrooms',
                tradeName: 'Pre-Washed Shredded White Cabbage 1kg Foodservice Bag',
                netWeight: '1.0 kg (100% edible shredded yield)',
                tareWeight: '0.015 kg (Breathable food-grade PE bag)',
                volume: '0.0032 m³',
                dimensions: '25 cm × 8 cm × 32 cm',
                minimumQuantity: '5 bags',
                vatInfo: '8% (Automatic electronic invoice issuance)',
                attributeFilter: 'Pre-washed, Ready-to-eat salad, Tonkatsu side',
            },
            kitchenCommitment: {
                badge: 'SAVE 45 MINS PREP TIME PER SHIFT',
                title: 'Standardized Crispness for Tonkatsu & Salad Bars',
                description:
                    'Harvested at 1,500m elevation in Dalat, triple-washed in ozonated chilled water, spin-dried, and precision-shredded to 1.5mm ribbons.',
                bullets: [
                    'Eliminates 25% core & outer leaf waste in commercial kitchens.',
                    'Packed in breathable micro-perforated bags to prevent condensation.',
                    'Daily morning harvest delivery straight to Ho Chi Minh City kitchens.',
                ],
            },
            chefStorageGuidelines: {
                tempZone: 'Chilled Vegetable Crisper 2°C to 6°C',
                shelfLifeUnopened: '4 Days from delivery date',
                shelfLifeOpened: 'Use within 12 hours after opening bag',
                thawingMethod:
                    'Keep away from rear evaporator fans to prevent leaf dehydration.',
                chefNotes: [
                    'Soak in ice water for 2 minutes before plating for extra crunch.',
                    'Keep bags in separate crate on delivery truck to avoid crushing.',
                ],
            },
            foodSafetyDossier: {
                certifications: [
                    {
                        code: 'VietGAP Crop Certificate #VG-LD-2026',
                        issuer: 'Lam Dong Dept. of Agriculture',
                        validUntil: '20/11/2027',
                    },
                ],
                microbialStandards: [
                    {
                        parameter: 'Pesticide Residue',
                        limit: 'Below MRL',
                        result: 'Not Detected (Passed)',
                    },
                    {
                        parameter: 'E. coli',
                        limit: '< 10 CFU/g',
                        result: 'Negative (Passed)',
                    },
                ],
            },
            originTraceability: {
                harvestRegion: 'Lac Duong Highland Farms, Dalat, Lam Dong',
                processingFacility: 'MD Foods Vegetable Wash & Cut Center',
                importPort: 'Domestic Cold Truck Line (Dalat -> HCMC)',
                coldChainHub: 'Landmark 81 / Tan Thuan Cold Storage Hub',
                lotTimeline: [
                    {
                        step: '1. Morning Farm Harvest',
                        timestamp: 'Day 0 — 05:00 AM',
                        detail: 'Hand-harvested at Lac Duong farm and pre-cooled to 4°C.',
                    },
                    {
                        step: '2. Ozonated Wash & 1.5mm Shredding',
                        timestamp: 'Day 0 — 14:00 PM',
                        detail: 'Processed in cleanroom and packed in 1kg breathable bags.',
                    },
                ],
            },
            reviews: [
                {
                    id: 'rev-cab-5',
                    author: 'Vivian Banshee',
                    roleBadge: 'TONKATSU HOUSE',
                    date: '10/04/2026',
                    rating: 5,
                    comment:
                        'Saves our kitchen staff so much time every morning! Shreds are super even and crisp.',
                    cutenessScore: 'crispness: 10/10',
                    likesLabel: '12k',
                    avatarBg: 'from-[#C4B5FD] to-[#818CF8]',
                },
                {
                    id: 'rev-cab-4',
                    author: 'Green Bowl Salad',
                    roleBadge: 'SALAD CHAIN',
                    date: '07/04/2026',
                    rating: 4,
                    comment:
                        'Very clean and dry inside the bag, zero water pooling at the bottom.',
                    cutenessScore: 'dryness: 9/10',
                    likesLabel: '3.4k',
                    avatarBg: 'from-[#A7F3D0] to-[#10B981]',
                },
                {
                    id: 'rev-cab-3',
                    author: 'Bento Express D3',
                    roleBadge: 'CLOUD KITCHEN',
                    date: '04/04/2026',
                    rating: 3,
                    comment:
                        'Good quality overall, wish there was a 2.5kg jumbo bag option for high-volume lunch shifts.',
                    cutenessScore: 'pack size: 7.5/10',
                    likesLabel: '820',
                    avatarBg: 'from-[#FDE68A] to-[#D97706]',
                },
                {
                    id: 'rev-cab-2',
                    author: 'Katsu Corner',
                    roleBadge: 'BISTRO',
                    date: '01/04/2026',
                    rating: 2,
                    comment:
                        'One bag had slightly thicker 3mm cuts near the bottom, though still fresh.',
                    cutenessScore: 'cut thickness: 6.5/10',
                    likesLabel: '190',
                    avatarBg: 'from-[#FED7AA] to-[#EA580C]',
                },
                {
                    id: 'rev-cab-1',
                    author: 'test_kitchen_09',
                    roleBadge: 'CANTEEN',
                    date: '28/03/2026',
                    rating: 1,
                    comment:
                        'Our kitchen staff left the bag next to the hot stove so it wilted—reminding our team to put it straight into the 4°C chiller next time.',
                    cutenessScore: 'storage note',
                    likesLabel: '95',
                    avatarBg: 'from-[#FECACA] to-[#DC2626]',
                },
            ],
        },

        tuna: {
            id: 'tuna',
            sampleButtonLabel: 'Saku Tuna (500g)',
            breadcrumbCategory: 'Fish & Seafood',
            breadcrumbSubcategory: 'Sashimi Blocks',
            categoryUpper: 'FISH AND SEAFOOD',
            enterpriseName: 'MEKONG DELTA CO-OP',
            warehouseBadge: 'Available in District 7 warehouse',
            skuCode: 'HNM-TUN-03 / HNM-FISH-TUNASAKU-FZ-500G',
            masterCatalogCode: 'HNM-FISH-TUNASAKU-FZ-500G',
            name: 'Ocean Yellowfin Saku Tuna Block (Sashimi AAA Grade 500g)',
            topLeftBadge: 'Sashimi AAA',
            certBadge: 'HACCP - Ultra Low Temp',
            listPrice: 310000,
            sellingPrice: 260000,
            priceWithVat: 280800,
            vatRateLabel: '8%',
            unit: 'tray',
            originCountry: 'Khanh Hoa, Vietnam',
            moqLabel: '3 trays',
            nextOrderPromoText: 'Buy 10 trays to unlock Tier-2 wholesale pricing.',
            rating: 4.8,
            reviewCount: 310,
            galleryImages: ['', '', ''],
            highlights: [
                {
                    title: 'Rectangular Saku Block',
                    subtitle: 'Zero sinew, uniform slices',
                },
                {
                    title: 'Store at -18°C to -40°C',
                    subtitle: 'Flash-frozen at sea',
                },
                {
                    title: 'Ruby Red Color',
                    subtitle: 'poke & sashimi ready',
                },
            ],
            technicalSpecs: {
                enterpriseName:
                    'MD Foods Direct Supply (Partner: Hai Nam Ocean Fishery Export JSC)',
                enterpriseTaxId: '4200591824 (Verified Export Fishery)',
                industryGroup: 'Fish and seafood',
                tradeName: 'Yellowfin Tuna Saku Block AAA Sashimi Grade 500g',
                netWeight: '0.50 kg (2 blocks per vacuum pack)',
                tareWeight: '0.015 kg (PE vacuum film)',
                volume: '0.0009 m³',
                dimensions: '18 cm × 3 cm × 12 cm',
                minimumQuantity: '3 trays',
                vatInfo: '8% (Automatic electronic invoice issuance)',
                attributeFilter: 'Sashimi block, Poke bowl, Tataki',
            },
            kitchenCommitment: {
                badge: '100% SINEW-FREE RECTANGULAR SAKU CUT',
                title: 'Uniform Portioning for Sushi Bars & Poke Chains',
                description:
                    'Cut from the prime center loin of line-caught ocean Yellowfin Tuna. Every block is shaped to uniform height and width so chefs can slice identical sashimi pieces with zero trim loss.',
                bullets: [
                    'Blast-frozen at -60°C immediately after catch to lock ruby-red myoglobin.',
                    'Individually vacuum-packed for accurate daily inventory control.',
                    'Full export-grade histamine and heavy-metal lab clearance.',
                ],
            },
            chefStorageGuidelines: {
                tempZone: 'Deep Freezer -18°C or below',
                shelfLifeUnopened: '6 Months frozen at -18°C',
                shelfLifeOpened: '24 Hours chilled at 0–2°C after thawing',
                thawingMethod:
                    'Thaw in warm salted water (3% salinity at 30°C) for 3 minutes, pat dry, then chill in refrigerator for 30 minutes.',
                chefNotes: [
                    'Never thaw inside the vacuum bag to avoid drip purge.',
                    'Wrap in absorbent paper after thawing for firm ruby-red slices.',
                ],
            },
            foodSafetyDossier: {
                certifications: [
                    {
                        code: 'EU Export Fishery Code #DL-408',
                        issuer: 'NAFIQAD Vietnam',
                        validUntil: '30/12/2027',
                    },
                ],
                microbialStandards: [
                    {
                        parameter: 'Mercury (Hg)',
                        limit: '< 1.0 mg/kg',
                        result: '0.18 mg/kg (Passed)',
                    },
                ],
            },
            originTraceability: {
                harvestRegion: 'Central Vietnam Deep Sea Fishing Grounds (FAO 71)',
                processingFacility: 'Nha Trang Export Seafood Plant',
                importPort: 'Cold Chain Container to HCMC',
                coldChainHub: 'Landmark 81 / Tan Thuan Cold Storage Hub',
                lotTimeline: [
                    {
                        step: '1. Line-Caught & -60°C Blast Frozen',
                        timestamp: 'Batch #TUN-2026-10',
                        detail: 'Processed into center-loin Saku blocks and vacuum sealed.',
                    },
                ],
            },
            reviews: [
                {
                    id: 'rev-tun-5',
                    author: 'Vivian Banshee',
                    roleBadge: 'IZAKAYA OWNER',
                    date: '11/04/2026',
                    rating: 5,
                    comment:
                        'Ruby red color holds up beautifully in our Poke bowls. Zero sinew!',
                    cutenessScore: 'saku cut: 10/10',
                    likesLabel: '19k',
                    avatarBg: 'from-[#C4B5FD] to-[#818CF8]',
                },
                {
                    id: 'rev-tun-4',
                    author: 'Aloha Poke Saigon',
                    roleBadge: 'POKE CHAIN',
                    date: '08/04/2026',
                    rating: 4,
                    comment:
                        'Uniform block geometry makes cubing for poke bowls super fast and accurate.',
                    cutenessScore: 'yield: 9.5/10',
                    likesLabel: '5.1k',
                    avatarBg: 'from-[#BAE6FD] to-[#0284C7]',
                },
                {
                    id: 'rev-tun-3',
                    author: 'Sakura Dining',
                    roleBadge: 'JAPANESE RESTAURANT',
                    date: '03/04/2026',
                    rating: 3,
                    comment:
                        'Requires following the warm salt-water thawing guide strictly for best color.',
                    cutenessScore: 'thawing care: 8/10',
                    likesLabel: '610',
                    avatarBg: 'from-[#FDE68A] to-[#D97706]',
                },
            ],
        },
    }

export function formatCurrencyVnd(amount: number): string {
    return `${amount.toLocaleString('vi-VN')}đ`
}
