import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface HomeProduct {
    productId: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    imageUrl: string | null;
    unitCode: string;
    listPrice: number | null;
    salePrice: number | null;
    availableQuantity: number | null;
    promotionId: string | null;
    promotionNameVi: string | null;
    promotionEndsAt: string | null;
    categoryId: string | null;
    categoryNameVi: string | null;
    categoryNameEn: string | null;
    packageSpecVi: string | null;
    packageSpecEn: string | null;
    minOrderQuantity: number;
    quantityStep: number;
    vatRate: number | null;
    averageRating: number | null;
    reviewCount: number;
}

export interface HomeCategory {
    id: string;
    parentId: string | null;
    code: string;
    nameVi: string;
    nameEn: string;
    descriptionVi: string | null;
    descriptionEn: string | null;
    imageSvg: string | null;
    sortOrder: number;
    productCount: number;
    children: HomeCategory[];
}

export interface HomeBanner {
    id: string;
    titleVi: string;
    titleEn: string;
    descriptionVi: string | null;
    descriptionEn: string | null;
    imageUrl: string | null;
    targetUrl: string | null;
    sortOrder: number;
}

export interface HomeComboItem {
    comboId: string;
    productId: string;
    sku: string;
    nameVi: string;
    /** Added by Customer HomePage API; optional for older backend versions. */
    nameEn?: string | null;
    unitCode: string;
    quantity: number;
    imageUrl: string | null;
}

export interface HomeCombo {
    productId: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    imageUrl: string | null;
    servingCount: number | null;
    listPrice: number | null;
    salePrice: number | null;
    availableQuantity: number;
    items: HomeComboItem[];
    minOrderQuantity: number;
    quantityStep: number;
    vatRate: number | null;
    averageRating: number | null;
    reviewCount: number;
}

export interface HomePromotion {
    id: string;
    nameVi: string;
    nameEn: string;
    contentVi: string | null;
    contentEn: string | null;
    startsAt: string;
    endsAt: string;
}

export interface HomeResponse {
    featuredProducts: HomeProduct[];
    bestSellingProducts: HomeProduct[];
    deepDiscountProducts: HomeProduct[];
    topRatedProducts: HomeProduct[];
    flashSaleProducts: HomeProduct[];
    combos: HomeCombo[];
    activePromotions: HomePromotion[];
    banners: HomeBanner[];
}

/** These routes are implemented inside BE features/customer/home, not ecommerce. */
export async function getHomeProducts(signal?: AbortSignal): Promise<HomeResponse> {
    const { data } = await publicHttp.get<ApiResponse<HomeResponse>>('/api/homepage', { signal });
    return data.data;
}

export async function getHomeCategories(signal?: AbortSignal): Promise<HomeCategory[]> {
    const { data } = await publicHttp.get<ApiResponse<HomeCategory[]>>('/api/homepage/categories', {
        signal,
    });
    return data.data;
}

export async function getHomeBanners(signal?: AbortSignal): Promise<HomeBanner[]> {
    const { data } = await publicHttp.get<ApiResponse<HomeBanner[]>>('/api/homepage/banners', {
        signal,
    });
    return data.data;
}
