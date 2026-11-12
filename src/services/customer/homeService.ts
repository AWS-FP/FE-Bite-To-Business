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
}

interface HomeResponse {
    featuredProducts: HomeProduct[];
    flashSaleProducts: HomeProduct[];
}

export async function getHomeProducts(signal: AbortSignal) {
    const response = await publicHttp.get<ApiResponse<HomeResponse>>('/api/catalog/home', { signal });
    return response.data.data;
}
