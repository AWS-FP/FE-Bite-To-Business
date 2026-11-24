import { http, publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import { getHomeProducts } from '@/services/customer/homeService';
import type { ExecutivePricing, ExecutiveVat } from '@/types/e-commerce/executiveRead';

export { getCatalogProducts, getHomeProducts };

export async function getExecutivePricing(productId: string): Promise<ExecutivePricing> {
    const { data } = await publicHttp.get<ApiResponse<ExecutivePricing>>(
        `/api/catalog/products/${encodeURIComponent(productId)}/pricing`,
    );

    return data.data;
}

export async function getExecutiveVat(productId: string): Promise<ExecutiveVat> {
    const { data } = await http.get<ApiResponse<ExecutiveVat>>(
        `/api/ecommerce/products/${encodeURIComponent(productId)}/vat-rate`,
    );

    return data.data;
}

export async function updateExecutiveVat(
    productId: string,
    vatRate: number,
): Promise<ExecutiveVat> {
    const { data } = await http.put<ApiResponse<ExecutiveVat>>(
        `/api/ecommerce/products/${encodeURIComponent(productId)}/vat-rate`,
        { vatRate },
    );

    return data.data;
}

export const formatVnd = (value: number | null | undefined): string =>
    value == null || !Number.isFinite(Number(value))
        ? '—'
        : `${Number(value).toLocaleString('vi-VN')}đ`;
