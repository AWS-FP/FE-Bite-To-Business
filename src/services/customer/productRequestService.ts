import { http } from '@/services/axiosClient';
import type { CreateProductRequest } from '@/types/customer/productRequest';

/** Customer gửi yêu cầu bổ sung sản phẩm chưa có trong danh mục. */
export async function createProductRequest(request: CreateProductRequest): Promise<void> {
    await http.post('/api/customer/product-requests', request);
}
