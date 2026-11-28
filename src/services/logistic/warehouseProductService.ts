import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { WarehouseProductDetail, WarehouseProductPage } from '@/types/logistic/warehouseProduct';

const path = '/api/logistics/products';

export async function getEditableProducts(q: string, page: number, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<WarehouseProductPage>>(path, {
        params: { q, page, size: 15 }, signal,
    });
    return data.data;
}

export async function getEditableProduct(id: string, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<WarehouseProductDetail>>(`${path}/${id}`, { signal });
    return data.data;
}
