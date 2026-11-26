import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getOpenPaymentReviewCount,
    getPaymentReviews,
    resolvePaymentReview,
} from '@/services/admin/paymentReviewService';
import type { ResolvePaymentReviewInput } from '@/types/admin/paymentReview';

const SUCCESS: Record<ResolvePaymentReviewInput['action'], string> = {
    REFUNDED: 'Đã ghi nhận hoàn tiền. Khách sẽ nhận email kèm mã giao dịch hoàn.',
    RESTORED: 'Đã khôi phục đơn và ghi nhận thanh toán. Khách sẽ nhận email báo đơn đã được khôi phục.',
    IGNORED: 'Đã bỏ qua khoản tiền này.',
};

function failure(error: unknown) {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { code?: string; errors?: { code?: string }[] } | undefined;
        if (data?.code === 'QUOTE_STOCK_UNAVAILABLE') {
            const count = data.errors?.filter((row) => row.code === 'INSUFFICIENT_STOCK').length ?? 0;
            return `Không đủ hàng để khôi phục đơn (${count} sản phẩm thiếu). Hãy hoàn tiền cho khách.`;
        }
        if (data?.code === 'PAYMENT_REVIEW_NOT_RESTORABLE') {
            return 'Không khôi phục được đơn: số tiền không khớp, đơn đã thanh toán hoặc không tìm thấy đơn. Hãy hoàn tiền cho khách.';
        }
        if (data?.code === 'PAYMENT_REVIEW_ALREADY_RESOLVED') {
            return 'Khoản này đã được xử lý trước đó.';
        }
    }
    return 'Không xử lý được khoản tiền này. Vui lòng thử lại.';
}

export function useOpenPaymentReviewCount() {
    return useQuery({
        queryKey: ['admin', 'payment-reviews', 'count'],
        queryFn: ({ signal }) => getOpenPaymentReviewCount(signal),
        staleTime: 60_000,
        refetchInterval: 5 * 60_000,
    });
}

/** Trang "Thanh toán cần xử lý": danh sách, chọn một khoản để hoàn tiền / khôi phục đơn / bỏ qua. */
export function usePaymentReviews() {
    const queryClient = useQueryClient();
    const [resolved, setResolved] = useState(false);
    const [page, setPage] = useState(0);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);

    const list = useQuery({
        queryKey: ['admin', 'payment-reviews', resolved, page],
        queryFn: ({ signal }) => getPaymentReviews(resolved, page, signal),
    });
    const selected = list.data?.content.find((item) => item.transactionId === selectedId) ?? null;

    const resolve = useMutation({
        mutationFn: (input: { id: number } & ResolvePaymentReviewInput) => {
            const { id, ...body } = input;
            return resolvePaymentReview(id, body);
        },
        onSuccess: (_, input) => {
            setFeedback({ message: SUCCESS[input.action], error: false });
            setSelectedId(null);
            void queryClient.invalidateQueries({ queryKey: ['admin', 'payment-reviews'] });
        },
        onError: (error) => {
            setFeedback({ message: failure(error), error: true });
            void queryClient.invalidateQueries({ queryKey: ['admin', 'payment-reviews'] });
        },
    });

    function changeResolved(next: boolean) {
        setResolved(next);
        setPage(0);
        setSelectedId(null);
    }

    function select(id: number | null) {
        setSelectedId(id);
        setFeedback(null);
    }

    return { resolved, changeResolved, page, setPage, list, selected, select, resolve, feedback };
}
