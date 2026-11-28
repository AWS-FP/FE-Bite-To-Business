export interface WarehouseProductOption {
    id: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    status: 'DRAFT' | 'PUBLISHED';
    imageUrl: string | null;
}

export interface WarehouseProductDetail extends WarehouseProductOption {
    categoryId: string | null;
    brandId: string | null;
    distributorId: string | null;
    origin: string | null;
    descriptionVi: string | null;
    descriptionEn: string | null;
    note: string | null;
    specVi: string | null;
    specEn: string | null;
    unit: string;
    minOrder: number;
    vat: number | null;
    price: number | null;
    netWeight: number | null;
    tareWeight: number | null;
    volume: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    technicalVi: string | null;
    technicalEn: string | null;
    storageVi: string | null;
    storageEn: string | null;
    nutritionBasis: string | null;
    nutritionFacts: { nutrient: string; nutrientEn: string; amount: string }[];
    tiers: { id: string; min: number; max: number | null; price: number }[];
}

export interface WarehouseProductPage {
    items: WarehouseProductOption[];
    total: number;
    totalPages: number;
}
