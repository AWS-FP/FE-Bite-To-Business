import { http, publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import {
    getCatalogProducts,
    type CatalogProductPage,
} from '@/services/customer/catalogReadService';
import { getHomeProducts, type HomeResponse } from '@/services/customer/homeService';

export type { CatalogProductPage, HomeResponse };
export { getCatalogProducts, getHomeProducts };

export interface ExecutivePriceTier {
    id: string;
    minQuantity: number;
    maxQuantity: number | null;
    unitPrice: number;
}

export interface ExecutivePricing {
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
    inventoryAvailable: boolean;
    availableQuantity: number | null;
    priceTiers: ExecutivePriceTier[];
}

export interface ExecutiveVat {
    productId: string;
    sku: string;
    vatRate: number | null;
    vatUpdatedAt: string | null;
}

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
