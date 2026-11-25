import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Search, X } from 'lucide-react';
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
import { formatVnd } from '@/services/e-commerce/executiveReadService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';

export default function EcommerceQuotesPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [status, setStatus] = useState(''),
        [page, setPage] = useState(0),
        [term, setTerm] = useState(''),
        [activeId, setActiveId] = useState<string | null>(null),
        [reason, setReason] = useState(''),
        [feedback, setFeedback] = useState('');
    const list = useQuery({
        queryKey: ['ecom', 'quotes', status, page],
        queryFn: () => executiveApi.quotes(status || undefined, page, 20),
    });
    const detail = useQuery({
        queryKey: ['ecom', 'quote', activeId],
        queryFn: () => executiveApi.quote(activeId!),
        enabled: !!activeId,
    });
    const readiness = useQuery({
        queryKey: ['ecom', 'quote-readiness', activeId],
        queryFn: () => executiveApi.quoteReadiness(activeId!),
        enabled: !!activeId && detail.data?.status === 'PENDING_APPROVAL',
    });
    const decision = useMutation({
        mutationFn: (action: 'approve' | 'reject') =>
            action === 'approve'
                ? executiveApi.approveQuote(activeId!, detail.data!.revision)
                : executiveApi.rejectQuote(activeId!, detail.data!.revision, reason.trim()),
        onSuccess: (quote) => {
            qc.setQueryData(['ecom', 'quote', quote.id], quote);
            setFeedback(
                quote.status === 'APPROVED'
                    ? tr('Đã duyệt báo giá.', 'Quote approved.')
                    : tr('Đã từ chối báo giá.', 'Quote rejected.'),
            );
            setReason('');
            setActiveId(null);
            void qc.invalidateQueries({ queryKey: ['ecom', 'quotes'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'metrics'] });
        },
        onError: (error) =>
            setFeedback(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không xử lý được báo giá. Tải lại chi tiết để kiểm tra phiên bản.',
                        'Quote decision failed. Reload the details and check the revision.',
                    ),
                ),
            ),
    });
    const data =
        list.data?.items.filter(
            (q) =>
                !term.trim() ||
                `${q.quoteNumber} ${q.companyName ?? ''} ${q.contactName ?? ''}`
                    .toLowerCase()
                    .includes(term.toLowerCase()),
        ) ?? [];
    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="03"
                eyebrow="B2B / QUOTATIONS"
                title={tr('Quản lý báo giá B2B', 'B2B quotations')}
                description={tr(
                    'Xem chi tiết và xử lý báo giá khách hàng đã gửi.',
                    'Inspect quotes, revisions, totals and authorized review decisions.',
                )}
            />
            <ExecutiveFeedback message={feedback} error={decision.isError} />
            <ExecutivePanel
                title={tr('Hộp thư báo giá', 'Quotation inbox')}
                caption={list.data ? `${list.data.total} ${tr('báo giá', 'quotes')}` : ''}
            >
                <div className="grid gap-3 p-5 sm:grid-cols-[200px_1fr]">
                    <ExecutiveSelect
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            setPage(0);
                        }}
                        ariaLabel={tr('Lọc trạng thái', 'Status filter')}
                    >
                        <option value="">{tr('Tất cả trạng thái', 'All statuses')}</option>
                        {[
                            'DRAFT',
                            'PENDING_APPROVAL',
                            'APPROVED',
                            'REJECTED',
                            'ACCEPTED',
                            'EXPIRED',
                            'CANCELLED',
                        ].map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </ExecutiveSelect>
                    <div className="relative">
                        <Search size={17} className="absolute left-4 top-3.5 text-[#678670]" />
                        <input
                            className={`${executiveUi.input} !pl-11`}
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder={tr(
                                'Lọc mã báo giá / doanh nghiệp trong trang...',
                                'Filter quote number / company in this page...',
                            )}
                        />
                    </div>
                </div>
                {list.isLoading ? (
                    <LoadingRows />
                ) : list.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={tr('Không tải được báo giá.', 'Failed to load quotations.')}
                            retry={() => void list.refetch()}
                        />
                    </div>
                ) : !data.length ? (
                    <ExecutiveEmpty
                        icon={<ClipboardList size={25} />}
                        title={tr('Không tìm thấy báo giá', 'No quotations found')}
                        description={tr('Thử chọn trạng thái khác.', 'Try another status.')}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[930px] text-left text-sm">
                            <thead>
                                <tr>
                                    {[
                                        tr('Mã báo giá', 'Quote'),
                                        tr('Doanh nghiệp / liên hệ', 'Company / contact'),
                                        tr('Giá trị', 'Amount'),
                                        tr('Phiên bản', 'Revision'),
                                        tr('Gửi lúc', 'Submitted'),
                                        tr('Trạng thái', 'Status'),
                                        '',
                                    ].map((h) => (
                                        <th className={executiveUi.th} key={h}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((q) => (
                                    <tr key={q.id} className="hover:bg-[#f8fbf6]">
                                        <td className={`${executiveUi.td} font-bold`}>
                                            {q.quoteNumber}
                                        </td>
                                        <td className={executiveUi.td}>
                                            <strong className="block">
                                                {q.companyName || '—'}
                                            </strong>
                                            <span className="text-xs text-[#6b7f70]">
                                                {q.contactName || '—'}
                                            </span>
                                        </td>
                                        <td className={`${executiveUi.td} font-bold`}>
                                            {formatVnd(q.totalAmount)}
                                        </td>
                                        <td className={executiveUi.td}>#{q.revision}</td>
                                        <td className={executiveUi.td}>
                                            {q.submittedAt
                                                ? new Date(q.submittedAt).toLocaleDateString(
                                                      'vi-VN',
                                                  )
                                                : '—'}
                                        </td>
                                        <td className={executiveUi.td}>
                                            <ExecutiveBadge status={q.status} />
                                        </td>
                                        <td className={executiveUi.td}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFeedback('');
                                                    decision.reset();
                                                    setActiveId(q.id);
                                                    setReason('');
                                                }}
                                                className={executiveUi.secondary}
                                            >
                                                {tr('Xem', 'View')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
            {activeId && (
                <div
                    className="fixed inset-0 z-[175] flex justify-end bg-black/45"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setActiveId(null);
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label={tr('Chi tiết báo giá', 'Quote detail')}
                        className="flex h-dvh w-full max-w-[700px] flex-col bg-[#fbf8ee]"
                    >
                        <header className="flex items-center justify-between gap-3 border-b bg-white px-6 py-5">
                            <h2 className="text-xl font-extrabold">
                                {tr('Chi tiết báo giá', 'Quotation details')}
                            </h2>
                            <button
                                aria-label={tr('Đóng', 'Close')}
                                type="button"
                                onClick={() => setActiveId(null)}
                            >
                                <X />
                            </button>
                        </header>
                        <div className="flex-1 space-y-5 overflow-y-auto p-6">
                            {decision.isError && feedback && (
                                <ExecutiveFeedback message={feedback} error />
                            )}
                            {detail.isLoading ? (
                                <LoadingRows />
                            ) : detail.isError ? (
                                <ExecutiveError
                                    message={tr(
                                        'Không tải được chi tiết báo giá.',
                                        'Unable to load quote details.',
                                    )}
                                />
                            ) : (
                                detail.data && (
                                    <>
                                        <div className="rounded-2xl border bg-white p-5">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <strong className="text-xl">
                                                    {detail.data.quoteNumber}
                                                </strong>
                                                <ExecutiveBadge status={detail.data.status} />
                                            </div>
                                            <p className="mt-2 text-sm">
                                                {detail.data.companyName || '—'} ·{' '}
                                                {detail.data.contactName || '—'} · Rev{' '}
                                                {detail.data.revision}
                                            </p>
                                            <div className="mt-4 grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
                                                <span>
                                                    {tr('Tạm tính', 'Subtotal')}:{' '}
                                                    <b>{formatVnd(detail.data.itemsSubtotal)}</b>
                                                </span>
                                                <span>
                                                    {tr('Giảm theo SL', 'Volume discount')}:{' '}
                                                    <b>
                                                        {formatVnd(
                                                            detail.data.volumeDiscountAmount,
                                                        )}
                                                    </b>
                                                </span>
                                                <span>
                                                    {tr('Giảm giá sale', 'Sale discount')}:{' '}
                                                    <b>
                                                        {formatVnd(detail.data.saleDiscountAmount)}
                                                    </b>
                                                </span>
                                                <span>
                                                    VAT: <b>{formatVnd(detail.data.vatAmount)}</b>
                                                </span>
                                                <span className="font-bold">
                                                    {tr('Tổng', 'Total')}:{' '}
                                                    {formatVnd(detail.data.totalAmount)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-[#dce8da] bg-[#f3faf0] p-4 text-sm leading-6">
                                            {detail.data.status === 'DRAFT'
                                                ? tr(
                                                      'Bản nháp do khách hàng sở hữu. Nhân viên không được tự gửi, sửa hay duyệt khi khách chưa nộp báo giá.',
                                                      'Customer-owned draft. Staff cannot submit, alter or approve it before the customer submits.',
                                                  )
                                                : detail.data.status === 'PENDING_APPROVAL'
                                                  ? tr(
                                                        'Báo giá đang chờ xét duyệt.',
                                                        'This quotation is awaiting review.',
                                                    )
                                                  : tr(
                                                        'Báo giá này đã qua trạng thái chờ duyệt. Chỉ có thể xem lịch sử và dữ liệu của bản đã lưu.',
                                                        'This quote is no longer pending approval. History and saved details remain available for inspection.',
                                                    )}
                                            {detail.data.reviewNote && (
                                                <p className="mt-2 border-t pt-2">
                                                    <b>{tr('Ghi chú xét duyệt', 'Review note')}:</b>{' '}
                                                    {detail.data.reviewNote}
                                                </p>
                                            )}
                                        </div>
                                        <div className="rounded-2xl border bg-white p-5">
                                            <h3 className="mb-4 font-bold">
                                                {tr('Sản phẩm trong báo giá', 'Quoted products')}
                                            </h3>
                                            <div className="divide-y">
                                                {detail.data.items?.map((i) => (
                                                    <div
                                                        key={i.id}
                                                        className="flex items-start justify-between gap-3 py-3 text-sm"
                                                    >
                                                        <div>
                                                            <b>{tr(i.nameVi, i.nameEn)}</b>
                                                            <p className="mt-1 font-mono text-xs text-[#708275]">
                                                                {i.sku} · {i.quantity} {i.unitCode}{' '}
                                                                · VAT {i.vatRate ?? '—'}%
                                                            </p>
                                                        </div>
                                                        <b className="shrink-0">
                                                            {formatVnd(i.lineTotal)}
                                                        </b>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border bg-white p-5">
                                            <h3 className="mb-3 font-bold">
                                                {tr('Lịch sử phiên bản', 'Revision history')}
                                            </h3>
                                            <div className="space-y-3">
                                                {detail.data.revisions?.map((r, i) => (
                                                    <div
                                                        key={`${r.revision}-${i}`}
                                                        className="rounded-xl bg-[#f5f8f2] p-3 text-sm"
                                                    >
                                                        <strong>Rev {r.revision}</strong> ·{' '}
                                                        {new Date(r.createdAt).toLocaleDateString(
                                                            'vi-VN',
                                                        )}
                                                        <p className="mt-1 text-xs">
                                                            {r.changeNote || '—'}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-[#d9e8db] bg-white p-5">
                                            <h3 className="mb-2 font-extrabold">
                                                {tr(
                                                    'Kiểm tra trước khi duyệt',
                                                    'Approval readiness',
                                                )}
                                            </h3>
                                            {detail.data.status !== 'PENDING_APPROVAL' ? (
                                                <p className="rounded-xl bg-[#f2f7ef] p-3 text-sm leading-6 text-[#496750]">
                                                    {detail.data.status === 'DRAFT'
                                                        ? tr(
                                                              'Đây là bản nháp của khách hàng. Chỉ khi khách gửi báo giá để xét duyệt, bộ phận E-commerce mới cần xử lý.',
                                                              'This quote is still a customer draft. The customer must submit it for review first.',
                                                          )
                                                        : tr(
                                                              'Báo giá này không ở trạng thái chờ duyệt. Không có thao tác phê duyệt mới.',
                                                              'This quote is not awaiting approval.',
                                                          )}
                                                </p>
                                            ) : readiness.isLoading ? (
                                                <p className="text-sm">
                                                    {tr('Đang kiểm tra...', 'Checking...')}
                                                </p>
                                            ) : readiness.isError ? (
                                                <div className="space-y-2 rounded-xl border border-rose-100 bg-rose-50 p-3">
                                                    <p className="text-sm text-rose-700">
                                                        {executiveErrorMessage(
                                                            readiness.error,
                                                            tr(
                                                                'Không tải được điều kiện xét duyệt.',
                                                                'Readiness could not be checked.',
                                                            ),
                                                        )}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        className={executiveUi.secondary}
                                                        onClick={() => void readiness.refetch()}
                                                    >
                                                        {tr(
                                                            'Thử kiểm tra lại',
                                                            'Retry readiness check',
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                readiness.data && (
                                                    <>
                                                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                                                            {(
                                                                [
                                                                    [
                                                                        'submitted',
                                                                        tr(
                                                                            'Khách đã gửi duyệt',
                                                                            'Customer submitted',
                                                                        ),
                                                                    ],
                                                                    [
                                                                        'hasItems',
                                                                        tr(
                                                                            'Có sản phẩm',
                                                                            'Contains products',
                                                                        ),
                                                                    ],
                                                                    [
                                                                        'vatComplete',
                                                                        tr(
                                                                            'VAT đầy đủ',
                                                                            'VAT configured',
                                                                        ),
                                                                    ],
                                                                    [
                                                                        'hasValidPackages',
                                                                        tr(
                                                                            'Địa chỉ hợp lệ',
                                                                            'Addresses verified',
                                                                        ),
                                                                    ],
                                                                    [
                                                                        'allocationComplete',
                                                                        tr(
                                                                            'Phân bổ kiện đầy đủ',
                                                                            'Packages allocated',
                                                                        ),
                                                                    ],
                                                                    [
                                                                        'stockAvailable',
                                                                        tr(
                                                                            'Đủ hàng khả dụng',
                                                                            'Stock available',
                                                                        ),
                                                                    ],
                                                                ] as const
                                                            ).map(([key, label]) => (
                                                                <div
                                                                    key={key}
                                                                    className="flex items-center justify-between gap-2 rounded-lg bg-[#f5f8f2] px-3 py-2"
                                                                >
                                                                    <span>{label}</span>
                                                                    <span
                                                                        className={
                                                                            readiness.data!.checks[
                                                                                key
                                                                            ]
                                                                                ? 'font-bold text-emerald-700'
                                                                                : 'font-bold text-rose-700'
                                                                        }
                                                                    >
                                                                        {readiness.data!.checks[key]
                                                                            ? '✓'
                                                                            : '✕'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {detail.data.expiresAt &&
                                                            Date.parse(detail.data.expiresAt) <=
                                                                readiness.dataUpdatedAt && (
                                                                <p className="mt-3 text-sm">
                                                                    {tr(
                                                                        'Báo giá đã hết hạn.',
                                                                        'This quotation has expired.',
                                                                    )}
                                                                </p>
                                                            )}
                                                        <button
                                                            type="button"
                                                            className={executiveUi.button + ' mt-3'}
                                                            disabled={
                                                                !readiness.data.approvalEnabled ||
                                                                readiness.data.revision !==
                                                                    detail.data.revision ||
                                                                decision.isPending
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        tr(
                                                                            'Duyệt báo giá này?',
                                                                            'Approve this quotation?',
                                                                        ),
                                                                    )
                                                                )
                                                                    decision.mutate('approve');
                                                            }}
                                                        >
                                                            {tr(
                                                                'Duyệt báo giá',
                                                                'Approve quotation',
                                                            )}
                                                        </button>
                                                    </>
                                                )
                                            )}
                                        </div>
                                        {detail.data.status === 'PENDING_APPROVAL' && (
                                            <form
                                                className="rounded-2xl border border-rose-200 bg-white p-5"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                        reason.trim() &&
                                                        window.confirm(
                                                            tr(
                                                                'Xác nhận từ chối báo giá?',
                                                                'Reject this quotation?',
                                                            ),
                                                        )
                                                    )
                                                        decision.mutate('reject');
                                                }}
                                            >
                                                <h3 className="font-bold text-rose-700">
                                                    {tr('Từ chối báo giá', 'Reject quotation')}
                                                </h3>
                                                <textarea
                                                    className={`${executiveUi.input} !h-auto py-3`}
                                                    rows={3}
                                                    minLength={3}
                                                    maxLength={2000}
                                                    required
                                                    placeholder={tr(
                                                        'Lý do từ chối...',
                                                        'Reason for rejection...',
                                                    )}
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                />
                                                <button
                                                    className="mt-3 rounded-xl bg-rose-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                                                    disabled={decision.isPending || !reason.trim()}
                                                >
                                                    {tr('Xác nhận từ chối', 'Confirm rejection')}
                                                </button>
                                            </form>
                                        )}
                                    </>
                                )
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
