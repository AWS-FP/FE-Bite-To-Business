import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { CatalogBrand, CatalogProductPage } from '@/types/customer/catalog';
export async function getCatalogBrands(signal?: AbortSignal): Promise<CatalogBrand[]> {
    const response = await publicHttp.get<ApiResponse<CatalogBrand[]>>('/api/catalog/brands', {
        signal,
    });
    return response.data.data;
}
export async function getCatalogProducts(options: {
    page: number;
    size: number;
    q?: string;
    categoryId?: string;
    brandId?: string;
    signal?: AbortSignal;
}): Promise<CatalogProductPage> {
    const { signal, ...params } = options;
    const response = await publicHttp.get<ApiResponse<CatalogProductPage>>(
        '/api/catalog/products',
        {
            signal,
            params,
        },
    );
    return response.data.data;
}
