import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, FileText, PackagePlus, X, CheckCheck } from 'lucide-react';
import { executiveUi, useExecutiveText } from '@/components/e-commerce/executiveTokens';
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
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';

export default function EcommerceRequestsPage() {
    const tr = useExecutiveText();
    const qc = useQueryClient();
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [failed, setFailed] = useState(false);

    const list = useQuery({
        queryKey: ['ecom', 'requests', status, page],
        queryFn: () => executiveApi.productRequests(status || undefined, page, 20),
    });
    const detail = useQuery({
        queryKey: ['ecom', 'request-detail', selectedId],
        queryFn: () => executiveApi.productRequest(selectedId!),
        enabled: selectedId !== null,
    });
    const review = useMutation({
        mutationFn: (id: string) => executiveApi.startRequestReview(id),
        onSuccess: () => {
            setFeedback(
                tr(
                    'Đã tiếp nhận yêu cầu. Logistics sẽ xử lý nhập hàng và phản hồi khách.',
                    'Request marked for review. Logistics handles supply and customer responses.',
                ),
            );
            setFailed(false);
            void qc.invalidateQueries({ queryKey: ['ecom', 'requests'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'request-detail'] });
        },
        onError: (error) => {
            setFailed(true);
            setFeedback(
                executiveErrorMessage(
                    error,
                    tr('Không thể tiếp nhận yêu cầu.', 'Could not start reviewing this request.'),
                ),
            );
        },
    });

    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="07"
                eyebrow="CATALOG / SOURCING"
                title={tr('Yêu cầu sản phẩm mới', 'Product requests')}
                description={tr(
                    'Khách yêu cầu mặt hàng hoặc quy cách chưa có. E-commerce tiếp nhận để xem xét; Logistics xác nhận nguồn hàng và phản hồi.',
                    'Customers request unavailable products or packaging. E-commerce triages; Logistics confirms supply and responds.',
                )}
            />
            <ExecutiveFeedback message={feedback} error={failed} />
            <ExecutivePanel
                title={tr('Danh sách yêu cầu', 'Request inbox')}
                caption={list.data ? `${list.data.total} ${tr('yêu cầu', 'requests')}` : ''}
            >
                <div className="p-5 sm:max-w-[310px]">
                    <ExecutiveSelect
                        ariaLabel={tr('Trạng thái', 'Status')}
                        value={status}
                        onValueChange={(next) => {
                            setStatus(next);
                            setPage(0);
                        }}
                    >
                        <option value="">{tr('Tất cả trạng thái', 'All statuses')}</option>
                        {['PENDING', 'REVIEWING', 'ADDED', 'REJECTED'].map((s) => (
                            <option value={s} key={s}>
                                {s}
                            </option>
                        ))}
                    </ExecutiveSelect>
                </div>
                {list.isLoading ? (
                    <LoadingRows />
                ) : list.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={tr('Không tải được yêu cầu.', 'Failed to load requests.')}
                            retry={() => void list.refetch()}
                        />
                    </div>
                ) : !list.data?.items.length ? (
                    <ExecutiveEmpty
                        icon={<PackagePlus />}
                        title={tr('Chưa có yêu cầu', 'No requests')}
                        description={tr('Chọn trạng thái khác để tìm.', 'Try another status.')}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead>
                                <tr>
                                    {[
                                        tr('Sản phẩm yêu cầu', 'Requested product'),
                                        tr('Ghi chú khách', 'Customer note'),
                                        tr('Ngày gửi', 'Submitted'),
                                        tr('Trạng thái', 'Status'),
                                        tr('Thao tác', 'Actions'),
                                    ].map((h) => (
                                        <th className={executiveUi.th} key={h}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {list.data.items.map((req) => (
                                    <tr key={req.id} className="hover:bg-[#f6faf4]">
                                        <td className={`${executiveUi.td} max-w-[350px] font-bold`}>
                                            {req.productName}
                                        </td>
                                        <td className={`${executiveUi.td} max-w-[300px]`}>
                                            {req.customerNote || '—'}
                                        </td>
                                        <td className={executiveUi.td}>
                                            {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className={executiveUi.td}>
                                            <ExecutiveBadge status={req.status} />
                                        </td>
                                        <td className={executiveUi.td}>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    className={executiveUi.secondary}
                                                    onClick={() => setSelectedId(req.id)}
                                                >
                                                    {tr('Chi tiết', 'Details')}
                                                </button>
                                                {req.status === 'PENDING' && (
                                                    <button
                                                        type="button"
                                                        disabled={review.isPending}
                                                        className={executiveUi.button}
                                                        onClick={() => review.mutate(req.id)}
                                                    >
                                                        <CheckCheck size={15} />
                                                        {tr('Tiếp nhận', 'Review')}
                                                    </button>
                                                )}
                                            </div>
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
            {selectedId && (
                <div
                    role="presentation"
                    className="fixed inset-0 z-[175] flex justify-end bg-black/50"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setSelectedId(null);
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label={tr('Chi tiết yêu cầu', 'Request details')}
                        className="flex h-dvh w-full max-w-[620px] flex-col bg-[#faf7ec] shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b bg-white px-6 py-5">
                            <h2 className="m-0 text-xl font-extrabold">
                                {tr('Chi tiết yêu cầu sản phẩm', 'Product request details')}
                            </h2>
                            <button
                                type="button"
                                className={executiveUi.secondary}
                                aria-label={tr('Đóng', 'Close')}
                                onClick={() => setSelectedId(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 space-y-5 overflow-y-auto p-6">
                            {detail.isLoading ? (
                                <LoadingRows />
                            ) : detail.isError ? (
                                <ExecutiveError
                                    message={tr(
                                        'Không tải được chi tiết.',
                                        'Cannot load request details.',
                                    )}
                                />
                            ) : (
                                detail.data && (
                                    <>
                                        <div className="rounded-2xl border border-[#dce6da] bg-white p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="m-0 font-extrabold">
                                                    {detail.data.productName}
                                                </h3>
                                                <ExecutiveBadge status={detail.data.status} />
                                            </div>
                                            <p className="mt-4 text-sm">
                                                {detail.data.customerNote ||
                                                    tr('Không có ghi chú', 'No note')}
                                            </p>
                                            {detail.data.referenceUrl &&
                                                /^https?:\/\//i.test(detail.data.referenceUrl) && (
                                                    <a
                                                        href={detail.data.referenceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-flex items-center gap-2 text-sm text-[#1b6c4d] underline"
                                                    >
                                                        <ExternalLink size={16} />
                                                        {tr('Liên kết tham khảo', 'Reference link')}
                                                    </a>
                                                )}
                                            <p className="mt-4 text-xs text-[#6e8070]">
                                                {new Date(detail.data.createdAt).toLocaleString(
                                                    'vi-VN',
                                                )}
                                            </p>
                                        </div>
                                        <section className="rounded-2xl border border-[#dce6da] bg-white p-5">
                                            <h3 className="flex items-center gap-2 font-bold">
                                                <FileText size={17} />
                                                {tr('Lịch sử phản hồi', 'Response history')}
                                            </h3>
                                            {detail.data.responses?.length ? (
                                                detail.data.responses.map((res) => (
                                                    <div
                                                        key={res.id}
                                                        className="mt-3 rounded-xl bg-[#f2f8ef] p-4 text-sm"
                                                    >
                                                        <p className="font-semibold">
                                                            {res.responseNote}
                                                        </p>
                                                        {res.productName && (
                                                            <p className="mt-2">
                                                                {res.productName} ·{' '}
                                                                {res.sellingPrice ?? '—'}đ
                                                            </p>
                                                        )}
                                                        <p className="mt-2 text-xs text-[#65826c]">
                                                            {tr('Email', 'Email')}:{' '}
                                                            {res.emailStatus}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-[#67836e]">
                                                    {tr('Chưa có phản hồi.', 'No responses yet.')}
                                                </p>
                                            )}
                                        </section>
                                        <p className="text-sm text-[#536f5b]">
                                            {tr(
                                                'E-commerce tiếp nhận yêu cầu. Logistics phụ trách xác minh nguồn hàng, ghi nhận sản phẩm được bổ sung và gửi phản hồi khách.',
                                                'E-commerce triages the request. Logistics validates supply, records new products and sends customer responses.',
                                            )}
                                        </p>
                                        {detail.data.status === 'PENDING' && (
                                            <button
                                                type="button"
                                                className={executiveUi.button}
                                                disabled={review.isPending}
                                                onClick={() => review.mutate(detail.data!.id)}
                                            >
                                                <CheckCheck size={17} />
                                                {tr('Tiếp nhận xem xét', 'Start review')}
                                            </button>
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
