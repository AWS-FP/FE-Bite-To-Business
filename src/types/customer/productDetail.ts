export interface ProductTechnicalDetails {
    netWeightKg: number | null;
    tareWeightKg: number | null;
    volumeCm3: number | null;
    lengthCm: number | null;
    widthCm: number | null;
    heightCm: number | null;
    technicalContentVi: string | null;
    technicalContentEn: string | null;
    kitchenStorageContentVi: string | null;
    kitchenStorageContentEn: string | null;
    complianceVatContentVi: string | null;
    complianceVatContentEn: string | null;
    originContentVi: string | null;
    originContentEn: string | null;
    // Bảng dinh dưỡng tùy chọn, ví dụ basis "100g" và các dòng thành phần/hàm lượng.
    nutritionBasis?: string | null;
    nutritionFacts?: ProductNutritionFact[];
}

export interface ProductNutritionFact {
    nutrient: string;
    nutrientEn?: string | null;
    amount: string;
}

export interface CustomerProductDetail {
    id: string;
    brandId: string | null;
    brandName: string | null;
    brandLogoUrl: string | null;
    categoryId: string;
    categoryNameVi: string | null;
    categoryNameEn: string | null;
    sku: string;
    nameVi: string;
    nameEn: string;
    descriptionVi: string | null;
    descriptionEn: string | null;
    note: string | null;
    origin: string | null;
    distributorName?: string | null;
    packageSpecVi: string | null;
    packageSpecEn: string | null;
    unitCode: string;
    minOrderQuantity: number | null;
    quantityStep: number | null;
    vatRate?: number | null;
    imageUrl: string | null;
    cloudinaryPublicId: string | null;
    details: ProductTechnicalDetails | null;
}

export interface ProductPriceTier {
    id: string;
    minQuantity: number;
    maxQuantity: number | null;
    unitPrice: number;
}

export interface CustomerProductPricing {
    productId: string;
    sku: string;
    unitCode: string;
    currency: string;
    minOrderQuantity: number;
    quantityStep: number;
    priceAvailable: boolean;
    listPrice: number | null;
    salePrice: number | null;
    saleActive: boolean;
    priceTiers: ProductPriceTier[];
    inventoryAvailable: boolean;
    availableQuantity: number | null;
}
