// Public, read-only catalog endpoints. Consumed only by Customer storefront UI;
// no Admin/Ecommerce Executive frontend module is changed.
export interface CatalogBrand {
    id: string;
    name: string;
    logoUrl: string | null;
    descriptionVi: string | null;
    descriptionEn: string | null;
}

export interface CatalogProduct {
    id: string;
    brandId: string | null;
    categoryId: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    packageSpecVi: string | null;
    packageSpecEn: string | null;
    unitCode: string;
    imageUrl: string | null;
}

export interface CatalogProductPage {
    items: CatalogProduct[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
