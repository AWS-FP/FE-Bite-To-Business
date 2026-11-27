import ListSkeleton from '@/components/common/ListSkeleton';
import { useEffect, useState } from 'react';
import AdminButton from '@/components/admin/AdminButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import { usePaymentReviews } from '@/hooks/admin/usePaymentReviews';
import type { PaymentReview, PaymentReviewAction, ResolvePaymentReviewInput } from '@/types/admin/paymentReview';

const REASON_LABEL: Record<string, string> = {
    UNMATCHED_ACCOUNT_OR_CODE: 'Sai nội dung chuyển khoản hoặc tài khoản nhận',
    PAYMENT_NOT_FOUND: 'Mã thanh toán không thuộc đơn nào',
    RESERVATION_EXPIRED: 'Tiền về sau khi đơn hết hạn giữ hàng',
    PAYMENT_STATE_OR_AMOUNT_MISMATCH: 'Sai số tiền, hoặc đơn đã thanh toán / đã huỷ',
};

const RESOLUTION_LABEL: Record<PaymentReviewAction, string> = {
    REFUNDED: 'Đã hoàn tiền',
    RESTORED: 'Đã khôi phục đơn',
    IGNORED: 'Đã bỏ qua',
};

const ORDER_STATUS_LABEL: Record<string, string> = {
    CONFIRMED: 'Chờ thanh toán',
    PROCESSING: 'Đang xử lý',
    COMPLETED: 'Đã thanh toán',
    CANCELLED: 'Đã huỷ',
};

const money = (value: number | null) => (value == null ? '—' : `${Number(value).toLocaleString('vi-VN')}đ`);
const time = (value: string | null) => (value ? new Date(value).toLocaleString('vi-VN') : '—');
const reason = (item: PaymentReview) => (item.reviewReason && REASON_LABEL[item.reviewReason]) || 'Cần kiểm tra';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-black/10 py-2 text-sm">
            <dt className="font-semibold text-store-muted">{label}</dt>
            <dd className="m-0 break-words">{children}</dd>
        </div>
    );
}

const inputClass = 'mt-1 w-full rounded-[3px] border border-black/40 p-2 font-normal';
const actionClass = 'rounded-[3px] border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50';

/** Chi tiết khoản tiền + ba cách xử lý: hoàn tiền, khôi phục đơn, bỏ qua. */
function ReviewDetail({ item, busy, onResolve, onClose }: {
    item: PaymentReview;
    busy: boolean;
    onResolve: (input: ResolvePaymentReviewInput) => void;
    onClose: () => void;
}) {
    const [mode, setMode] = useState<PaymentReviewAction | null>(null);
    const [refundReference, setRefundReference] = useState('');
    const [note, setNote] = useState('');
    const canSubmit =
        mode === 'REFUNDED' ? refundReference.trim() !== '' : mode === 'IGNORED' ? note.trim() !== '' : mode === 'RESTORED';

    function submit(event: React.FormEvent) {
        event.preventDefault();
        if (!mode || !canSubmit) return;
        onResolve({
            action: mode,
            refundReference: mode === 'REFUNDED' ? refundReference.trim() : undefined,
            note: note.trim() || undefined,
        });
    }

    return (
        <section className="rounded-[3px] border border-black bg-white p-6" aria-labelledby="payment-review-title">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-store-muted">Khoản tiền cần xử lý</p>
                    <h2 id="payment-review-title" className="mt-1 text-xl font-bold">{money(item.amount)}</h2>
                    <p className="mt-1 text-sm font-semibold text-red-700">{reason(item)}</p>
                </div>
                <AdminButton onClick={onClose}>Đóng</AdminButton>
            </div>
            <dl className="mt-4">
                <Row label="Nhận lúc">{time(item.receivedAt)}{item.source === 'RECONCILIATION' ? ' · tìm thấy khi đối soát' : ''}</Row>
                <Row label="Nội dung CK"><span className="whitespace-pre-wrap">{item.content || '—'}</span></Row>
                <Row label="Mã tham chiếu">{item.referenceCode ?? '—'} · SePay #{item.transactionId}</Row>
                <Row label="Mã thanh toán">{item.paymentCode ?? '—'}</Row>
                {item.orderNumber ? (
                    <>
                        <Row label="Đơn hàng">
                            {item.orderNumber} · {ORDER_STATUS_LABEL[item.orderStatus ?? ''] ?? item.orderStatus}
                        </Row>
                        <Row label="Tổng đơn">{money(item.orderTotal)}</Row>
                        <Row label="Khách hàng">{item.contactName}</Row>
                        <Row label="Liên hệ">{item.contactPhone} · {item.contactEmail}</Row>
                        <Row label="Email cho khách">
                            {item.customerNotifiedAt ? `Đã gửi lúc ${time(item.customerNotifiedAt)}` : 'Đang chờ gửi'}
                        </Row>
                    </>
                ) : (
                    <Row label="Đơn hàng">Không tìm được đơn từ nội dung chuyển khoản</Row>
                )}
                {item.resolution && (
                    <>
                        <Row label="Kết quả">{RESOLUTION_LABEL[item.resolution]}</Row>
                        {item.refundReference && <Row label="Mã GD hoàn">{item.refundReference}</Row>}
                        {item.resolutionNote && <Row label="Ghi chú"><span className="whitespace-pre-wrap">{item.resolutionNote}</span></Row>}
                        <Row label="Xử lý bởi">{item.resolvedByName ?? '—'} · {time(item.resolvedAt)}</Row>
                    </>
                )}
            </dl>

            {!item.resolution && mode === null && (
                <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" disabled={busy} onClick={() => setMode('REFUNDED')} className={`${actionClass} border-black bg-store-green text-white`}>
                        Đã hoàn tiền
                    </button>
                    <button
                        type="button"
                        disabled={busy || !item.restorable}
                        title={item.restorable ? undefined : 'Chỉ khôi phục được khi đúng số tiền của đơn chưa thanh toán'}
                        onClick={() => setMode('RESTORED')}
                        className={`${actionClass} border-black bg-white text-black hover:bg-surface-soft`}
                    >
                        Khôi phục đơn
                    </button>
                    <button type="button" disabled={busy} onClick={() => setMode('IGNORED')} className={`${actionClass} border-red-700 bg-white text-red-700 hover:bg-red-50`}>
                        Bỏ qua
                    </button>
                    <p className="m-0 w-full text-xs text-store-muted">
                        Hoàn tiền: tự chuyển trả cho khách trong app ngân hàng rồi ghi lại mã giao dịch. Khôi phục đơn: giữ lại hàng cho
                        khách và coi như đã thanh toán (cần còn hàng). Bỏ qua: khoản tiền không liên quan đến đơn nào.
                    </p>
                </div>
            )}

            {!item.resolution && mode !== null && (
                <form className="mt-5 space-y-3" onSubmit={submit}>
                    {mode === 'REFUNDED' && (
                        <label className="block text-sm font-semibold">
                            Mã giao dịch hoàn tiền <span className="text-red-600">*</span>
                            <input value={refundReference} maxLength={100} onChange={(event) => setRefundReference(event.target.value)} className={inputClass} placeholder="VD: FT24123456789" />
                        </label>
                    )}
                    {mode === 'RESTORED' && (
                        <p className="m-0 rounded-[3px] border border-black/20 bg-surface-soft p-3 text-sm">
                            Đơn {item.orderNumber} sẽ được giữ hàng lại và chuyển sang đã thanh toán. Nếu không còn đủ hàng, hệ thống sẽ báo
                            và bạn cần hoàn tiền cho khách.
                        </p>
                    )}
                    <label className="block text-sm font-semibold">
                        Ghi chú {mode === 'IGNORED' && <span className="text-red-600">*</span>}
                        <textarea rows={3} maxLength={2000} value={note} onChange={(event) => setNote(event.target.value)} className={inputClass} />
                    </label>
                    <div className="flex gap-3">
                        <AdminButton type="button" onClick={() => setMode(null)}>Quay lại</AdminButton>
                        <button type="submit" disabled={busy || !canSubmit} className={`${actionClass} border-black bg-store-green text-white`}>
                            {busy ? 'Đang xử lý...' : `Xác nhận: ${RESOLUTION_LABEL[mode].toLowerCase()}`}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}

export default function PaymentReviewsPage() {
    const r = usePaymentReviews();

    useEffect(() => {
        document.title = 'Thanh toán cần xử lý | Bite to Business';
    }, []);

    return (
        <>
            <AdminPageHeader
                sectionNumber="01"
                eyebrow="PAYMENT REVIEWS"
                title="Thanh toán cần xử lý"
                description="Tiền khách đã chuyển vào tài khoản nhưng không tự khớp được đơn nào: đơn hết hạn, sai số tiền, sai nội dung hoặc trả trùng."
            >
                <AdminButton icon="refresh" busy={r.list.isFetching} onClick={() => void r.list.refetch()}>Làm mới</AdminButton>
            </AdminPageHeader>
            {r.feedback && (
                <p role={r.feedback.error ? 'alert' : 'status'} className={`mt-4 rounded-[3px] border p-3 text-sm ${r.feedback.error ? 'border-red-300 bg-red-50 text-red-700' : 'border-green-300 bg-green-50 text-store-green'}`}>
                    {r.feedback.message}
                </p>
            )}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <section className="min-w-0 rounded-[3px] border border-black bg-white" aria-labelledby="payment-review-list-title">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
                        <h2 id="payment-review-list-title" className="text-lg font-bold">Danh sách khoản tiền</h2>
                        <select aria-label="Lọc theo trạng thái" value={r.resolved ? 'RESOLVED' : 'OPEN'} onChange={(event) => r.changeResolved(event.target.value === 'RESOLVED')} className="rounded-[3px] border border-black px-3 py-2 text-sm">
                            <option value="OPEN">Chưa xử lý</option>
                            <option value="RESOLVED">Đã xử lý</option>
                        </select>
                    </div>
                    {r.list.isLoading && <ListSkeleton className="mt-4 border-t border-black/10" rowClassName="flex items-start justify-between gap-3 border-b border-black/10 px-6 py-4" />}
                    {r.list.isError && <p className="px-6 py-10 text-sm text-red-700" role="alert">Không tải được danh sách khoản tiền.</p>}
                    {r.list.data && r.list.data.content.length === 0 && (
                        <p className="px-6 py-10 text-sm text-store-muted">{r.resolved ? 'Chưa có khoản nào được xử lý.' : 'Không có khoản tiền nào cần xử lý.'}</p>
                    )}
                    {r.list.data && r.list.data.content.length > 0 && (
                        <ul className="m-0 mt-4 list-none divide-y divide-black/10 border-t border-black/10 p-0">
                            {r.list.data.content.map((item) => (
                                <li key={item.transactionId}>
                                    <button type="button" onClick={() => r.select(item.transactionId)} className={`flex w-full items-start justify-between gap-3 bg-transparent px-6 py-4 text-left hover:bg-surface-soft ${r.selected?.transactionId === item.transactionId ? 'bg-surface-soft' : ''}`}>
                                        <span className="min-w-0">
                                            <strong className="block truncate text-sm">
                                                {money(item.amount)}{item.orderNumber ? ` · ${item.orderNumber}` : ''}
                                            </strong>
                                            <span className="block text-xs text-store-muted">
                                                {item.contactName ? `${item.contactName} · ` : ''}{time(item.receivedAt)}
                                            </span>
                                        </span>
                                        <span className="shrink-0 text-right text-xs font-bold">
                                            {item.resolution ? RESOLUTION_LABEL[item.resolution] : reason(item)}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {r.list.data && r.list.data.totalPages > 1 && (
                        <div className="px-6 pb-6">
                            <Pagination page={r.page} totalPages={r.list.data.totalPages} loading={r.list.isFetching} onPageChange={r.setPage} />
                        </div>
                    )}
                </section>
                {r.selected ? (
                    <ReviewDetail
                        key={r.selected.transactionId}
                        item={r.selected}
                        busy={r.resolve.isPending}
                        onResolve={(input) => r.resolve.mutate({ id: r.selected!.transactionId, ...input })}
                        onClose={() => r.select(null)}
                    />
                ) : (
                    <p className="m-0 self-start rounded-[3px] border border-dashed border-black/40 p-6 text-sm text-store-muted">
                        Chọn một khoản bên trái để xem chi tiết và xử lý.
                    </p>
                )}
            </div>
        </>
    );
}
