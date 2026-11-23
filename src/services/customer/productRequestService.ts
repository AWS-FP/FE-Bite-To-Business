import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { PageResponse } from '@/types/pagination';
import type { CreateProductRequest, MyProductRequest } from '@/types/customer/productRequest';

/** Customer gửi yêu cầu bổ sung sản phẩm chưa có trong danh mục. */
export async function createProductRequest(request: CreateProductRequest): Promise<void> {
    await http.post('/api/customer/product-requests', request);
}

/** Các yêu cầu khách đã gửi, mới nhất trước. */
export async function getMyProductRequests(page: number, size: number, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<PageResponse<MyProductRequest>>>('/api/customer/product-requests', {
        params: { page, size },
        signal,
    });
    return data.data;
}
