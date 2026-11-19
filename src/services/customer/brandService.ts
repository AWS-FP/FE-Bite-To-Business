import axios from 'axios';
import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import {
    getCatalogBrands,
    type CatalogBrand,
    type CatalogProduct,
} from '@/services/customer/catalogReadService';

/** Enriched public brand listing supplied by Customer Brand Discovery in BE. */
export interface CustomerBrand extends CatalogBrand {
    productCount: number | null;
    categoryIds: string[];
}

export async function getBrandDirectory(signal?: AbortSignal): Promise<CustomerBrand[]> {
    try {
        const response = await publicHttp.get<ApiResponse<CustomerBrand[]>>(
            '/api/catalog/brands/directory',
            { signal },
        );
        return response.data.data;
    } catch (error) {
        // FE can show the directory even before the optional Customer BE package is deployed.
        // The legacy /{id} handler may answer 400 for the literal "directory" path.
        // Fall back only for 400/404; connection/server errors remain visible to users.
        if (!axios.isAxiosError(error) || ![400, 404].includes(error.response?.status ?? 0)) throw error;
        const brands = await getCatalogBrands(signal);
        return brands.map((brand) => ({ ...brand, productCount: null, categoryIds: [] }));
    }
}

export async function getProductsOfBrand(
    brandId: string,
    signal?: AbortSignal,
): Promise<CatalogProduct[]> {
    const response = await publicHttp.get<ApiResponse<CatalogProduct[]>>(
        `/api/catalog/brands/${encodeURIComponent(brandId)}/products`,
        { signal },
    );
    return response.data.data;
}

export async function getBrandsInSameCategories(
    brandId: string,
    signal?: AbortSignal,
): Promise<CatalogBrand[]> {
    const response = await publicHttp.get<ApiResponse<CatalogBrand[]>>(
        `/api/catalog/brands/${encodeURIComponent(brandId)}/related`,
        { signal, params: { limit: 12 } },
    );
    return response.data.data;
}

/** Keep human-readable URLs and avoid collisions if two brands have the same display name. */
export function brandSlug(name: string): string {
    return name
        .toLocaleLowerCase('vi-VN')
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'thuong-hieu';
}

export function brandPath(brand: CatalogBrand, brands: CatalogBrand[]): string {
    const base = brandSlug(brand.name);
    const duplicate = brands.some((item) => item.id !== brand.id && brandSlug(item.name) === base);
    return `/brand/${encodeURIComponent(duplicate ? `${base}-${brand.id}` : base)}`;
}

export function findBrandBySlug(brands: CustomerBrand[], slug?: string): CustomerBrand | null {
    if (!slug) return null;
    let value: string;
    try { value = decodeURIComponent(slug); } catch { return null; }
    return brands.find((brand) => brandPath(brand, brands).split('/').pop() === value) ?? null;
}
