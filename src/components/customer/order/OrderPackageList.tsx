import { RotateCcw } from 'lucide-react';
import type { usePackageReturn } from '@/hooks/customer/usePackageReturn';
import type { CustomerOrderPackage } from '@/types/customer/order';

const STATUS: Record<CustomerOrderPackage['deliveryStatus'], { label: string; className: string }> = {
    WAITING: { label: 'Chờ giao', className: 'bg-store-cream text-store-ink border-store-ink/30' },
    IN_DELIVERY: { label: 'Đang giao', className: 'bg-store-yellow text-store-ink border-store-ink' },
    DELIVERED: { label: 'Đã giao', className: 'bg-store-green text-white border-store-green' },
    CANCELLED: { label: 'Đã hủy', className: 'bg-red-50 text-red-700 border-red-200' },
};

const RETURN_LABEL = {
    REQUESTED: 'Đã gửi yêu cầu trả hàng, chờ Admin xử lý',
    ACCEPTED: 'Đã chấp nhận trả hàng',
    REJECTED: 'Yêu cầu trả hàng bị từ chối',
} as const;

const inputClass = 'w-full rounded border border-store-ink/30 px-3 py-2 text-sm';

type Props = {
    packages: CustomerOrderPackage[];
    returns: ReturnType<typeof usePackageReturn>;
};

/** Danh sách kiện của đơn: trạng thái giao từng kiện và nút trả hàng trong 24 giờ sau khi giao. */
export default function OrderPackageList({ packages, returns: r }: Props) {
    return (
        <section className="rounded-xl border-2 border-store-ink bg-white p-5">
            <h2 className="mt-0 text-xl font-bold">Các kiện giao hàng</h2>
            {r.notice && <p role="status" className="rounded bg-green-50 p-3 text-sm text-store-green">{r.notice}</p>}
            {packages.length === 0 && <p className="text-sm">Chưa có kiện giao hàng.</p>}
            {packages.map((pack) => {
                const status = STATUS[pack.deliveryStatus] ?? STATUS.WAITING;
                const formOpen = r.packageId === pack.packageId;
                return (
                    <div key={pack.packageId} className="border-t py-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="m-0 font-bold">{pack.packageName}</p>
                            <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${status.className}`}>{status.label}</span>
                        </div>
                        <p className="my-1">{pack.deliveryAddress}</p>
                        <p className="m-0 text-xs text-store-muted">
                            Ngày giao: {pack.deliveryDate}
                            {pack.recipientName ? ` · ${pack.recipientName}` : ''}
                            {pack.deliveredAt ? ` · Giao lúc ${new Date(pack.deliveredAt).toLocaleString('vi-VN')}` : ''}
                        </p>
                        {pack.returnStatus && <p className="mb-0 mt-2 text-xs font-semibold text-store-green">{RETURN_LABEL[pack.returnStatus]}</p>}
                        {pack.returnable && !formOpen && (
                            <button type="button" onClick={() => r.open(pack.packageId)} className="mt-2 inline-flex items-center gap-1.5 rounded border border-store-ink px-3 py-1.5 text-xs font-bold hover:bg-store-cream">
                                <RotateCcw size={14} aria-hidden="true" /> Trả hàng
                            </button>
                        )}
                        {formOpen && (
                            <form
                                className="mt-3 space-y-3 rounded-lg border border-store-ink/20 bg-store-cream/50 p-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    void r.submit();
                                }}
                            >
                                <p className="m-0 text-xs text-store-muted">Chỉ trả được trong 24 giờ sau khi giao. Tiền hàng sẽ được hoàn vào tài khoản dưới đây sau khi Admin chấp nhận.</p>
                                <label className="block">
                                    <span className="font-semibold">Lý do trả hàng <span className="text-red-600">*</span></span>
                                    <textarea className={inputClass} rows={3} maxLength={1000} value={r.form.reason} onChange={(e) => r.updateField('reason', e.target.value)} />
                                </label>
                                <label className="block">
                                    <span className="font-semibold">Ngân hàng <span className="text-red-600">*</span></span>
                                    <input className={inputClass} maxLength={100} value={r.form.bank} onChange={(e) => r.updateField('bank', e.target.value)} />
                                </label>
                                <label className="block">
                                    <span className="font-semibold">Số tài khoản <span className="text-red-600">*</span></span>
                                    <input className={inputClass} inputMode="numeric" maxLength={34} value={r.form.accountNumber} onChange={(e) => r.updateField('accountNumber', e.target.value)} />
                                    {r.form.accountNumber && !r.accountValid && <span className="text-xs text-red-700">Số tài khoản chỉ gồm chữ số.</span>}
                                </label>
                                <label className="block">
                                    <span className="font-semibold">Tên chủ tài khoản <span className="text-red-600">*</span></span>
                                    <input className={inputClass} maxLength={200} value={r.form.accountName} onChange={(e) => r.updateField('accountName', e.target.value)} />
                                </label>
                                {r.error && <p role="alert" className="m-0 text-red-700">{r.error}</p>}
                                <div className="flex gap-2">
                                    <button type="button" disabled={r.submitting} onClick={r.close} className="flex-1 rounded border border-store-ink bg-white px-4 py-2 font-semibold">Quay lại</button>
                                    <button type="submit" disabled={!r.formValid || r.submitting} className="flex-1 rounded bg-store-green px-4 py-2 font-semibold text-white disabled:opacity-50">
                                        {r.submitting ? 'Đang gửi...' : 'Gửi yêu cầu trả hàng'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                );
            })}
        </section>
    );
}
