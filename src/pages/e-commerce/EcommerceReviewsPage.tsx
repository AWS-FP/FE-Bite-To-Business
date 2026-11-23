import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Star } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import {
    ExecutiveBadge,
    ExecutiveFeedback,
    ExecutivePagination,
    ExecutiveSelect,
} from '@/components/e-commerce/ExecutiveControls';
import {
    ExecutiveEmpty,
    ExecutiveError,
    ExecutiveHeading,
    ExecutivePanel,
    LoadingRows,
} from '@/components/e-commerce/ExecutiveUI';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { useAuthStore } from '@/store/admin/authStore';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';

export default function EcommerceReviewsPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const ownUserId = useAuthStore((state) => state.session?.user?.id);
    const [status, setStatus] = useState(''),
        [stars, setStars] = useState(''),
        [page, setPage] = useState(0),
        [feedback, setFeedback] = useState('');
    const list = useQuery({
        queryKey: ['ecom', 'reviews', status, stars, page],
        queryFn: () =>
            executiveApi.reviews(status || undefined, stars ? Number(stars) : undefined, page, 20),
    });
    const mutate = useMutation({
        mutationFn: ({
            id,
            action,
            reason,
        }: {
            id: string;
            action: 'HIDE' | 'RESTORE';
            reason?: string;
        }) => executiveApi.moderateReview(id, action, reason),
        onSuccess: () => {
            setFeedback(tr('Cập nhật đánh giá thành công.', 'Review moderation saved.'));
            void qc.invalidateQueries({ queryKey: ['ecom', 'reviews'] });
        },
        onError: (error) =>
            setFeedback(
                executiveErrorMessage(
                    error,
                    tr('Không thể xử lý đánh giá.', 'Cannot moderate this review.'),
                ),
            ),
    });
    function hide(id: string) {
        const reason = window.prompt(
            tr('Nhập lý do ẩn đánh giá (bắt buộc):', 'Enter a reason for hiding the review:'),
        );
        if (reason?.trim()) mutate.mutate({ id, action: 'HIDE', reason: reason.trim() });
    }
    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="08"
                eyebrow="CUSTOMER FEEDBACK"
                title={tr('Kiểm duyệt đánh giá', 'Review moderation')}
                description={tr(
                    'Theo dõi đánh giá, sản phẩm và nội dung vi phạm.',
                    'Inspect feedback and moderate policy-violating reviews.',
                )}
            />
            <ExecutiveFeedback
                message={feedback}
                error={feedback.startsWith('Không') || feedback.startsWith('Cannot')}
            />
            <ExecutivePanel
                title={tr('Đánh giá khách hàng', 'Customer reviews')}
                caption={list.data ? `${list.data.total} ${tr('đánh giá', 'reviews')}` : ''}
            >
                <div className="grid gap-3 p-5 sm:max-w-[590px] sm:grid-cols-2">
                    <ExecutiveSelect
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            setPage(0);
                        }}
                        ariaLabel={tr('Trạng thái', 'Status')}
                    >
                        <option value="">{tr('Tất cả đánh giá', 'All reviews')}</option>
                        <option value="VISIBLE">VISIBLE</option>
                        <option value="HIDDEN">HIDDEN</option>
                    </ExecutiveSelect>
                    <ExecutiveSelect
                        value={stars}
                        onValueChange={(next) => {
                            setStars(next);
                            setPage(0);
                        }}
                        ariaLabel={tr('Lọc theo số sao', 'Filter by stars')}
                    >
                        <option value="">{tr('Tất cả mức sao', 'All ratings')}</option>
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={String(n)}>
                                {tr(
                                    `${n} sao${n < 5 ? ` đến dưới ${n + 1} sao` : ''}`,
                                    `${n} stars${n < 5 ? ` to under ${n + 1}` : ''}`,
                                )}
                            </option>
                        ))}
                    </ExecutiveSelect>
                </div>
                {list.isLoading ? (
                    <LoadingRows />
                ) : list.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={tr('Không tải được đánh giá.', 'Reviews could not be loaded.')}
                            retry={() => void list.refetch()}
                        />
                    </div>
                ) : !list.data?.items.length ? (
                    <ExecutiveEmpty
                        icon={<MessageCircle />}
                        title={tr('Chưa có đánh giá', 'No reviews')}
                        description={tr(
                            'Đánh giá sẽ xuất hiện khi khách gửi lên.',
                            'Reviews appear when customers submit feedback.',
                        )}
                    />
                ) : (
                    <div className="divide-y divide-[#edf1eb]">
                        {list.data.items.map((r) => (
                            <article key={r.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_170px]">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <strong className="text-sm">
                                            {tr(r.productNameVi, r.productNameEn)}
                                        </strong>
                                        <ExecutiveBadge
                                            status={r.deletedAt ? 'HIDDEN' : 'VISIBLE'}
                                        />
                                    </div>
                                    <p className="mt-2 flex items-center gap-1 text-xs text-[#866b11]">
                                        <Star size={15} fill="currentColor" /> {r.rating}/5 ·{' '}
                                        {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#3b5545]">
                                        {r.content || tr('(Không có nội dung)', '(No comment)')}
                                    </p>
                                    <p className="mt-2 break-all text-[11px] text-[#758778]">
                                        Product ID: {r.productId}
                                    </p>
                                    {r.deletionReason && (
                                        <p className="mt-2 text-xs text-rose-700">
                                            {tr('Lý do ẩn', 'Hidden reason')}: {r.deletionReason}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-start justify-end">
                                    {!r.deletedAt ? (
                                        <button
                                            type="button"
                                            disabled={mutate.isPending}
                                            className={executiveUi.secondary}
                                            onClick={() => hide(r.id)}
                                        >
                                            {tr('Ẩn đánh giá', 'Hide review')}
                                        </button>
                                    ) : r.deletedBy === ownUserId ? (
                                        <button
                                            type="button"
                                            disabled={mutate.isPending}
                                            className={executiveUi.secondary}
                                            onClick={() =>
                                                mutate.mutate({ id: r.id, action: 'RESTORE' })
                                            }
                                        >
                                            {tr('Hiện lại', 'Restore')}
                                        </button>
                                    ) : (
                                        <span className="text-xs text-[#738577]">
                                            {tr(
                                                'Đã ẩn bởi nhân viên khác',
                                                'Hidden by another moderator',
                                            )}
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                {list.data && (
                    <ExecutivePagination
                        page={page}
                        totalPages={list.data.totalPages}
                        onChange={setPage}
                        tr={tr}
                    />
                )}
            </ExecutivePanel>
        </div>
    );
}
