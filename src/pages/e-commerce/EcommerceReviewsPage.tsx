import { ExecutiveArticleSkeleton } from '@/components/e-commerce/ExecutiveSkeletons';
import { MessageCircle, Star, Trash2 } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveReviews } from '@/hooks/e-commerce/useExecutiveReviews';
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
} from '@/components/e-commerce/ExecutiveUI';

export default function EcommerceReviewsPage() {
    const {
        tr, ownUserId, status, stars, page, setPage, feedback, failed, list, busy,
        changeStatus, changeStars, hide, restore, remove,
    } = useExecutiveReviews();
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
                error={failed}
            />
            <ExecutivePanel
                title={tr('Đánh giá khách hàng', 'Customer reviews')}
                caption={list.data ? `${list.data.total} ${tr('đánh giá', 'reviews')}` : ''}
            >
                <div className="grid gap-3 p-5 sm:max-w-[590px] sm:grid-cols-2">
                    <ExecutiveSelect
                        value={status}
                        onValueChange={changeStatus}
                        ariaLabel={tr('Trạng thái', 'Status')}
                    >
                        <option value="">{tr('Tất cả đánh giá', 'All reviews')}</option>
                        <option value="VISIBLE">VISIBLE</option>
                        <option value="HIDDEN">HIDDEN</option>
                    </ExecutiveSelect>
                    <ExecutiveSelect
                        value={stars}
                        onValueChange={changeStars}
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
                    <ExecutiveArticleSkeleton kind="reviews" />
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
                                <div className="flex flex-wrap items-start justify-end gap-2">
                                    {!r.deletedAt ? (
                                        <button
                                            type="button"
                                            disabled={busy}
                                            className={executiveUi.secondary}
                                            onClick={() => hide(r.id)}
                                        >
                                            {tr('Ẩn đánh giá', 'Hide review')}
                                        </button>
                                    ) : r.deletedBy === ownUserId ? (
                                        <button
                                            type="button"
                                            disabled={busy}
                                            className={executiveUi.secondary}
                                            onClick={() => restore(r.id)}
                                        >
                                            {tr('Hiện lại', 'Restore')}
                                        </button>
                                    ) : (
                                        <span className="self-center text-xs text-[#738577]">
                                            {tr(
                                                'Đã ẩn bởi nhân viên khác',
                                                'Hidden by another moderator',
                                            )}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() => remove(r.id)}
                                        aria-label={tr('Xóa vĩnh viễn đánh giá', 'Permanently delete review')}
                                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Trash2 size={15} aria-hidden="true" />
                                        {tr('Xóa đánh giá', 'Delete review')}
                                    </button>
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
