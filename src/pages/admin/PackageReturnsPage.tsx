import { useEffect, useState } from 'react';
import AdminButton from '@/components/admin/AdminButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import { usePackageReturns } from '@/hooks/admin/usePackageReturns';
import type { PackageReturn, PackageReturnStatus } from '@/types/admin/packageReturn';

const STATUS_LABEL: Record<PackageReturnStatus, string> = {
    REQUESTED: 'Chờ xử lý',
    ACCEPTED: 'Đã chấp nhận',
    REJECTED: 'Đã từ chối',
};

const money = (value: number) => `${Number(value).toLocaleString('vi-VN')}đ`;
const time = (value: string | null) => (value ? new Date(value).toLocaleString('vi-VN') : '—');

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-black/10 py-2 text-sm">
            <dt className="font-semibold text-store-muted">{label}</dt>
            <dd className="m-0 break-words">{children}</dd>
        </div>
    );
}

/** Form khách đã gửi, kèm nút chấp nhận (nhập lại kho + email cho khách) hoặc từ chối. */
function ReturnDetail({ item, busy, onAccept, onReject, onRefund, onClose }: {
    item: PackageReturn;
    busy: boolean;
    onAccept: () => void;
    onReject: (note: string) => void;
    onRefund: () => void;
    onClose: () => void;
}) {
    const [rejecting, setRejecting] = useState(false);
    const [note, setNote] = useState('');
    return (
        <section className="rounded-[3px] border border-black bg-white p-6" aria-labelledby="return-detail-title">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-store-muted">Yêu cầu trả hàng</p>
                    <h2 id="return-detail-title" className="mt-1 text-xl font-bold">{item.packageName}</h2>
                </div>
                <AdminButton onClick={onClose}>Đóng</AdminButton>
            </div>
            <dl className="mt-4">
                <Row label="Trạng thái">{STATUS_LABEL[item.status]}</Row>
                {item.status === 'ACCEPTED' && <Row label="Hoàn tiền">{item.refundedAt ? 'Đã hoàn tiền' : 'Chờ hoàn tiền'}</Row>}
                <Row label="Khách hàng">{item.companyName ? `${item.companyName} · ` : ''}{item.contactName}</Row>
                <Row label="Liên hệ">{item.contactPhone} · {item.contactEmail}</Row>
                <Row label="Mã giao dịch">{item.paymentNumber ?? '—'}</Row>
                <Row label="Địa chỉ giao">{item.deliveryAddress}</Row>
                <Row label="Ngày giao">{item.deliveryDate} · giao lúc {time(item.deliveredAt)}</Row>
                <Row label="Gửi yêu cầu lúc">{time(item.createdAt)}</Row>
                <Row label="Lý do trả hàng"><span className="whitespace-pre-wrap">{item.reason}</span></Row>
                <Row label="Tiền hàng của kiện"><strong>{item.packageAmount == null ? 'Cần đối soát' : money(item.packageAmount)}</strong></Row>
                <Row label="Phí trả hàng (2%)">{item.returnFee == null ? 'Cần đối soát' : money(item.returnFee)}</Row>
                <Row label="Tiền dự kiến hoàn"><strong>{item.refundAmount == null ? 'Cần đối soát' : money(item.refundAmount)}</strong></Row>
                <Row label="Hoàn tiền về">{item.recipientBank} · {item.recipientAccount} · {item.recipientName}</Row>
                {item.reviewNote && <Row label="Lý do từ chối">{item.reviewNote}</Row>}
                {item.reviewedAt && <Row label="Xử lý lúc">{time(item.reviewedAt)}</Row>}
                {item.refundedAt && <Row label="Hoàn tiền lúc">{time(item.refundedAt)}</Row>}
                {item.transferReference && <Row label="Mã giao dịch hoàn">{item.transferReference}</Row>}
            </dl>
            {item.status === 'REQUESTED' && !rejecting && (
                <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" disabled={busy} onClick={onAccept} className="rounded-[3px] border border-black bg-store-green px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                        {busy ? 'Đang xử lý...' : 'Chấp nhận trả hàng'}
                    </button>
                    <button type="button" disabled={busy} onClick={() => setRejecting(true)} className="rounded-[3px] border border-red-700 bg-white px-4 py-2 text-sm font-bold text-red-700">
                        Từ chối
                    </button>
                    <p className="m-0 w-full text-xs text-store-muted">
                        Xác nhận sẽ nhập lại hàng của kiện vào kho và gửi email cho khách. Tiền hàng chuyển khoản thủ công vào tài khoản ở trên.
                    </p>
                </div>
            )}
            {item.status === 'REQUESTED' && rejecting && (
                <form className="mt-5 space-y-3" onSubmit={(event) => { event.preventDefault(); if (note.trim()) onReject(note.trim()); }}>
                    <label className="block text-sm font-semibold">
                        Lý do từ chối <span className="text-red-600">*</span>
                        <textarea rows={3} maxLength={2000} value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 w-full rounded-[3px] border border-black/40 p-2 font-normal" />
                    </label>
                    <div className="flex gap-3">
                        <AdminButton type="button" onClick={() => setRejecting(false)}>Quay lại</AdminButton>
                        <button type="submit" disabled={busy || !note.trim()} className="rounded-[3px] border border-red-700 bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                            Xác nhận từ chối
                        </button>
                    </div>
                </form>
            )}
            {item.status === 'ACCEPTED' && !item.refundedAt && item.refundAmount != null && (
                <div className="mt-5 space-y-3">
                    <p className="text-sm">Sau khi chuyển khoản thủ công, bấm nút bên dưới để ghi nhận khoản tiền đã hoàn.</p>
                    <button type="button" onClick={onRefund} disabled={busy} className="rounded-[3px] border border-black bg-store-green px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Đang ghi nhận...' : 'Đã hoàn tiền'}</button>
                </div>
            )}
        </section>
    );
}

export default function PackageReturnsPage() {
    const r = usePackageReturns();

    useEffect(() => {
        document.title = 'Yêu cầu trả hàng | Bite to Business';
    }, []);

    return (
        <>
            <AdminPageHeader
                eyebrow="PACKAGE RETURNS"
                title="Yêu cầu trả hàng"
            >
                <AdminButton icon="refresh" busy={r.list.isFetching} onClick={() => void r.list.refetch()}>Làm mới</AdminButton>
            </AdminPageHeader>
            {r.feedback && (
                <p role={r.feedback.error ? 'alert' : 'status'} className={`mt-4 rounded-[3px] border p-3 text-sm ${r.feedback.error ? 'border-red-300 bg-red-50 text-red-700' : 'border-green-300 bg-green-50 text-store-green'}`}>
                    {r.feedback.message}
                </p>
            )}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <section className="min-w-0 rounded-[3px] border border-black bg-white" aria-labelledby="return-list-title">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
                        <h2 id="return-list-title" className="text-lg font-bold">Danh sách yêu cầu</h2>
                        <select aria-label="Lọc theo trạng thái" value={r.status} onChange={(event) => r.changeStatus(event.target.value as PackageReturnStatus | '')} className="rounded-[3px] border border-black px-3 py-2 text-sm">
                            <option value="REQUESTED">Chờ xử lý</option>
                            <option value="ACCEPTED">Đã chấp nhận</option>
                            <option value="REJECTED">Đã từ chối</option>
                            <option value="">Tất cả</option>
                        </select>
                    </div>
                    {r.list.isLoading && <p className="px-6 py-10 text-sm" role="status">Đang tải...</p>}
                    {r.list.isError && <p className="px-6 py-10 text-sm text-red-700" role="alert">Không tải được danh sách yêu cầu trả hàng.</p>}
                    {r.list.data && r.list.data.content.length === 0 && <p className="px-6 py-10 text-sm text-store-muted">Không có yêu cầu nào.</p>}
                    {r.list.data && r.list.data.content.length > 0 && (
                        <ul className="m-0 mt-4 list-none divide-y divide-black/10 border-t border-black/10 p-0">
                            {r.list.data.content.map((item) => (
                                <li key={item.id}>
                                    <button type="button" onClick={() => r.setSelectedId(item.id)} className={`flex w-full items-start justify-between gap-3 bg-transparent px-6 py-4 text-left hover:bg-surface-soft ${r.selected?.id === item.id ? 'bg-surface-soft' : ''}`}>
                                        <span className="min-w-0">
                                            <strong className="block truncate text-sm">{item.packageName}</strong>
                                            <span className="block text-xs text-store-muted">{item.companyName || item.contactName} · {time(item.createdAt)}</span>
                                        </span>
                                        <span className="shrink-0 text-xs font-bold">{STATUS_LABEL[item.status]}</span>
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
                    <ReturnDetail
                        key={r.selected.id}
                        item={r.selected}
                        busy={r.decide.isPending || r.confirmRefund.isPending}
                        onAccept={() => r.decide.mutate({ id: r.selected!.id, accept: true })}
                        onReject={(note) => r.decide.mutate({ id: r.selected!.id, accept: false, note })}
                        onRefund={() => r.confirmRefund.mutate(r.selected!.id)}
                        onClose={() => r.setSelectedId(null)}
                    />
                ) : (
                    <p className="m-0 self-start rounded-[3px] border border-dashed border-black/40 p-6 text-sm text-store-muted">
                        Chọn một yêu cầu bên trái để xem form khách đã gửi.
                    </p>
                )}
            </div>
        </>
    );
}
