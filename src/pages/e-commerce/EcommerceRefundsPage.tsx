import { ExecutiveArticleSkeleton } from '@/components/e-commerce/ExecutiveSkeletons';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Undo2 } from 'lucide-react';
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
} from '@/components/e-commerce/ExecutiveUI';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';

type Decision =
    | { id: string; action: 'APPROVE'; note?: string }
    | { id: string; action: 'REJECT'; note: string }
    | { id: string; action: 'REFUNDED'; reference: string };

const money = (value: number | null) => (value == null ? '—' : `${Number(value).toLocaleString('vi-VN')}đ`);

export default function EcommerceRefundsPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [status, setStatus] = useState('REQUESTED'),
        [page, setPage] = useState(0),
        [feedback, setFeedback] = useState({ message: '', error: false });
    const list = useQuery({
        queryKey: ['ecom', 'refunds', status, page],
        queryFn: () => executiveApi.refundRequests(status || undefined, page, 20),
    });
    const decide = useMutation({
        mutationFn: (d: Decision) =>
            d.action === 'APPROVE'
                ? executiveApi.approveRefund(d.id, d.note)
                : d.action === 'REJECT'
                  ? executiveApi.rejectRefund(d.id, d.note)
                  : executiveApi.markRefunded(d.id, d.reference),
        onSuccess: () => {
            setFeedback({ message: tr('Đã cập nhật yêu cầu hủy.', 'Cancellation request updated.'), error: false });
            void qc.invalidateQueries({ queryKey: ['ecom', 'refunds'] });
        },
        onError: (error) => {
            setFeedback({
                message: executiveErrorMessage(error, tr('Không xử lý được yêu cầu.', 'Cannot process this request.')),
                error: true,
            });
            void qc.invalidateQueries({ queryKey: ['ecom', 'refunds'] });
        },
    });

    function approve(id: string, packageName: string) {
        const note = window.prompt(
            tr(`Duyệt hủy "${packageName}". Ghi chú cho khách (không bắt buộc):`, `Approve cancelling "${packageName}". Note for the customer (optional):`),
        );
        if (note !== null) decide.mutate({ id, action: 'APPROVE', note: note.trim() || undefined });
    }
    function reject(id: string) {
        const note = window.prompt(tr('Nhập lý do từ chối (bắt buộc):', 'Enter a reason for declining:'));
        if (note?.trim()) decide.mutate({ id, action: 'REJECT', note: note.trim() });
    }
    function refunded(id: string) {
        const reference = window.prompt(tr('Nhập mã giao dịch chuyển khoản hoàn tiền:', 'Enter the refund transfer reference:'));
        if (reference?.trim()) decide.mutate({ id, action: 'REFUNDED', reference: reference.trim() });
    }

    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="09"
                eyebrow="CUSTOMER CANCELLATIONS"
                title={tr('Yêu cầu hủy hàng', 'Cancellation requests')}
                description={tr(
                    'Duyệt yêu cầu hủy kiện của khách đã thanh toán, rồi xác nhận khi đã chuyển khoản hoàn tiền.',
                    'Review cancellation requests on paid orders, then confirm once the refund is transferred.',
                )}
            />
            <ExecutiveFeedback message={feedback.message} error={feedback.error} />
            <ExecutivePanel
                title={tr('Danh sách yêu cầu', 'Requests')}
                caption={list.data ? `${list.data.total} ${tr('yêu cầu', 'requests')}` : ''}
            >
                <div className="p-5 sm:max-w-[300px]">
                    <ExecutiveSelect
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            setPage(0);
                        }}
                        ariaLabel={tr('Trạng thái', 'Status')}
                    >
                        <option value="">{tr('Tất cả', 'All')}</option>
                        <option value="REQUESTED">{tr('Chờ duyệt', 'Requested')}</option>
                        <option value="APPROVED">{tr('Chờ hoàn tiền', 'Approved')}</option>
                        <option value="REFUNDED">{tr('Đã hoàn tiền', 'Refunded')}</option>
                        <option value="REJECTED">{tr('Đã từ chối', 'Rejected')}</option>
                    </ExecutiveSelect>
                </div>
                {list.isLoading ? (
                    <ExecutiveArticleSkeleton kind="refunds" />
                ) : list.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={tr('Không tải được yêu cầu hủy.', 'Requests could not be loaded.')}
                            retry={() => void list.refetch()}
                        />
                    </div>
                ) : !list.data?.items.length ? (
                    <ExecutiveEmpty
                        icon={<Undo2 />}
                        title={tr('Không có yêu cầu', 'No requests')}
                        description={tr('Yêu cầu hủy của khách sẽ xuất hiện tại đây.', 'Customer cancellation requests appear here.')}
                    />
                ) : (
                    <div className="divide-y divide-[#edf1eb]">
                        {list.data.items.map((r) => (
                            <article key={r.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_200px]">
                                <div className="space-y-1 text-sm">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <strong>{r.packageName}</strong>
                                        <ExecutiveBadge status={r.status} />
                                    </div>
                                    <p className="text-xs text-[#758778]">
                                        {r.orderNumber} · {r.companyName || r.contactName} · {r.contactPhone} ·{' '}
                                        {new Date(r.createdAt).toLocaleString('vi-VN')}
                                    </p>
                                    <p>
                                        {tr('Giao', 'Delivery')}: {r.deliveryDate} · {r.deliveryAddress}
                                    </p>
                                    <p className="whitespace-pre-wrap text-[#3b5545]">
                                        {tr('Lý do', 'Reason')}: {r.reason}
                                    </p>
                                    <p>
                                        {tr('Hoàn về', 'Refund to')}: {r.recipientBank} · {r.recipientAccount} · {r.recipientName}
                                    </p>
                                    <p>
                                        {tr('Tiền hàng của kiện', 'Package amount')}: <strong>{money(r.packageAmount)}</strong>
                                        {r.refundAmount != null && <> · {tr('Số tiền hoàn', 'Refund')}: <strong>{money(r.refundAmount)}</strong></>}
                                    </p>
                                    {r.reviewNote && <p className="text-xs">{tr('Ghi chú', 'Note')}: {r.reviewNote}</p>}
                                    {r.transferReference && <p className="text-xs">{tr('Mã giao dịch', 'Reference')}: {r.transferReference}</p>}
                                </div>
                                <div className="flex flex-col items-stretch gap-2">
                                    {r.status === 'REQUESTED' && (
                                        <>
                                            <button type="button" disabled={decide.isPending} className={executiveUi.secondary} onClick={() => approve(r.id, r.packageName)}>
                                                {tr('Duyệt hủy', 'Approve')}
                                            </button>
                                            <button type="button" disabled={decide.isPending} className={executiveUi.secondary} onClick={() => reject(r.id)}>
                                                {tr('Từ chối', 'Decline')}
                                            </button>
                                        </>
                                    )}
                                    {r.status === 'APPROVED' && (
                                        <button type="button" disabled={decide.isPending} className={executiveUi.secondary} onClick={() => refunded(r.id)}>
                                            {tr('Đã hoàn tiền', 'Mark refunded')}
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                {list.data && (
                    <ExecutivePagination page={page} totalPages={list.data.totalPages} onChange={setPage} tr={tr} />
                )}
            </ExecutivePanel>
        </div>
    );
}
