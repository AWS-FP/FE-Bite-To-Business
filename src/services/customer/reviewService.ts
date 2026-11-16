import { http, publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface CustomerReview {
    id: string;
    productId: string;
    customerId: string;
    reviewerName: string;
    rating: number;
    content: string | null;
    createdAt: string;
    updatedAt: string;
    images: { id: string; imageUrl: string; sortOrder: number }[];
}
export interface CustomerReviewsPage {
    content: CustomerReview[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
export interface ProductReviewsPage extends CustomerReviewsPage {
    averageRating: number | null;
}
export interface ReviewInput { rating: number; content?: string }

export async function getMyReviews(page = 0, size = 10) {
    const { data } = await http.get<ApiResponse<CustomerReviewsPage>>('/api/customer/reviews', { params: { page, size } });
    return data.data;
}
export async function getProductReviews(productId: string, page = 0, size = 10) {
    const { data } = await publicHttp.get<ApiResponse<ProductReviewsPage>>(
        `/api/catalog/products/${encodeURIComponent(productId)}/reviews`, { params: { page, size } },
    );
    return data.data;
}
export async function createReview(productId: string, input: ReviewInput, images: File[] = []) {
    const form = new FormData();
    form.append('productId', productId);
    form.append('rating', String(input.rating));
    if (input.content) form.append('content', input.content);
    images.forEach(file => form.append('images', file));
    const { data } = await http.post<ApiResponse<CustomerReview>>('/api/customer/reviews', form);
    return data.data;
}
export async function updateReview(reviewId: string, input: ReviewInput) {
    const { data } = await http.put<ApiResponse<CustomerReview>>(`/api/customer/reviews/${encodeURIComponent(reviewId)}`, input);
    return data.data;
}
export async function addReviewImages(reviewId: string, images: File[]) {
    const form = new FormData();
    images.forEach(file => form.append('images', file));
    const { data } = await http.post<ApiResponse<CustomerReview>>(`/api/customer/reviews/${encodeURIComponent(reviewId)}/images`, form);
    return data.data;
}
export async function deleteReviewImage(reviewId: string, imageId: string) {
    const { data } = await http.delete<ApiResponse<CustomerReview>>(`/api/customer/reviews/${encodeURIComponent(reviewId)}/images/${encodeURIComponent(imageId)}`);
    return data.data;
}
export async function deleteReview(reviewId: string): Promise<void> {
    await http.delete(`/api/customer/reviews/${encodeURIComponent(reviewId)}`);
}
