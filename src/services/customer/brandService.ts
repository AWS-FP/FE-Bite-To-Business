import axios from 'axios';
import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import { getCatalogBrands } from '@/services/customer/catalogReadService';
import type { CatalogBrand, CatalogProduct } from '@/types/customer/catalog';
import type { CustomerBrand } from '@/types/customer/brand';

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
