import { REFUND_REASON_MAX, REFUND_STATUS_LABELS } from '@/constants/customer/refund';
import type { useOrderCancellation } from '@/hooks/customer/useOrderCancellation';

type Props = { cancellation: ReturnType<typeof useOrderCancellation> };

const money = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
const inputClass = 'w-full rounded border border-store-ink/30 px-3 py-2 text-sm';

/** Gửi yêu cầu hủy kiện của đơn đã thanh toán và theo dõi trạng thái duyệt/hoàn tiền. */
export default function OrderCancellationSection({ cancellation: c }: Props) {
    if (!c.paid) return null;
    if (!c.canRequest && c.requests.length === 0) return null;

    return (
        <section className="rounded-xl border-2 border-store-ink bg-white p-5 text-sm">
            <h2 className="mt-0 text-lg font-bold">Hủy kiện hàng</h2>
            {c.notice && <p role="status" className="rounded bg-green-50 p-3 text-store-green">{c.notice}</p>}
            {c.requests.length > 0 && (
                <ul className="m-0 mb-3 list-none space-y-2 p-0">
                    {c.requests.map((item) => (
                        <li key={item.id} className="rounded border border-store-ink/15 p-3">
                            <p className="m-0 font-bold">{item.packageName}</p>
                            <p className="m-0 text-xs text-store-muted">{REFUND_STATUS_LABELS[item.status] ?? item.status}</p>
                            {item.refundAmount != null && <p className="m-0 text-xs">Số tiền hoàn: {money(Number(item.refundAmount))}</p>}
                            {item.reviewNote && <p className="m-0 text-xs">Phản hồi: {item.reviewNote}</p>}
                            {item.transferReference && <p className="m-0 text-xs">Mã giao dịch: {item.transferReference}</p>}
                        </li>
                    ))}
                </ul>
            )}
            {c.canRequest && !c.open && (
                <>
                    <button type="button" onClick={c.start} className="w-full rounded border border-red-300 bg-white px-4 py-2 font-semibold text-red-700 hover:bg-red-50">
                        Yêu cầu hủy kiện
                    </button>
                    <p className="mb-0 text-xs text-store-muted">
                        Chỉ hủy được kiện chưa có nhân viên nhận giao. E-commerce duyệt xong sẽ hoàn tiền vào tài khoản bạn cung cấp.
                    </p>
                </>
            )}
            {c.open && (
                <form
                    className="space-y-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void c.submit();
                    }}
                >
                    <fieldset className="m-0 space-y-1 border-0 p-0">
                        <legend className="font-semibold">Chọn kiện muốn hủy</legend>
                        {c.cancellable.map((pack) => (
                            <label key={pack.packageId} className="flex items-center gap-2">
                                <input type="checkbox" checked={c.selected.includes(pack.packageId)} onChange={() => c.togglePackage(pack.packageId)} />
                                {pack.packageName}
                            </label>
                        ))}
                    </fieldset>
                    <label className="block">
                        <span className="font-semibold">Lý do hủy <span className="text-red-600">*</span></span>
                        <textarea className={inputClass} rows={3} maxLength={REFUND_REASON_MAX} value={c.form.reason} onChange={(e) => c.updateField('reason', e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="font-semibold">Ngân hàng nhận hoàn tiền <span className="text-red-600">*</span></span>
                        <input className={inputClass} maxLength={100} value={c.form.bank} onChange={(e) => c.updateField('bank', e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="font-semibold">Số tài khoản <span className="text-red-600">*</span></span>
                        <input className={inputClass} inputMode="numeric" maxLength={34} value={c.form.accountNumber} onChange={(e) => c.updateField('accountNumber', e.target.value)} />
                        {c.form.accountNumber && !c.accountValid && <span className="text-xs text-red-700">Số tài khoản chỉ gồm chữ số.</span>}
                    </label>
                    <label className="block">
                        <span className="font-semibold">Tên chủ tài khoản <span className="text-red-600">*</span></span>
                        <input className={inputClass} maxLength={200} value={c.form.accountName} onChange={(e) => c.updateField('accountName', e.target.value)} />
                    </label>
                    {c.error && <p role="alert" className="text-red-700">{c.error}</p>}
                    <div className="flex gap-2">
                        <button type="button" disabled={c.submitting} onClick={() => c.setOpen(false)} className="flex-1 rounded border border-store-ink px-4 py-2 font-semibold">
                            Quay lại
                        </button>
                        <button type="submit" disabled={!c.formValid || c.submitting} className="flex-1 rounded bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-50">
                            {c.submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
