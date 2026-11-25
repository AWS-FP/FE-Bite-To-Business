import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { PageResponse } from '@/types/pagination';
import type { PaymentReview, ResolvePaymentReviewInput } from '@/types/admin/paymentReview';

const endpoint = '/api/admin/payments/sepay/review';

export async function getPaymentReviews(resolved: boolean, page: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<PageResponse<PaymentReview>>>(endpoint, {
        params: { resolved, page, size: 10 },
        signal,
    });
    return response.data.data;
}

export async function getOpenPaymentReviewCount(signal?: AbortSignal) {
    const response = await http.get<ApiResponse<{ open: number }>>(`${endpoint}/count`, { signal });
    return response.data.data.open;
}

export async function resolvePaymentReview(transactionId: number, input: ResolvePaymentReviewInput) {
    await http.post(`${endpoint}/${encodeURIComponent(String(transactionId))}/resolve`, input);
}
