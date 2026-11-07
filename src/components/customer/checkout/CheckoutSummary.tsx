import { ArrowRight, ArrowLeft, LockKeyhole, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CHECKOUT_ITEMS, DEMO_COUPON, DEMO_DISCOUNT, formatPrice } from './checkoutData';
import CheckoutProductImage from './CheckoutProductImage';
import type { DeliveryPackage } from './checkoutData';

type Props = {
    step: number;
    packages: DeliveryPackage[];
    assignments: Record<string, string>;
    coupon: boolean;
    nextDisabled: boolean;
    helper: string;
    onNext: () => void;
    onBack: () => void;
};

const CTA = ['Xem báo giá giao hàng', 'Tiếp tục đến ưu đãi', 'Chọn phương thức thanh toán', 'Xác nhận đơn demo'];

export default function CheckoutSummary({ step, packages, assignments, coupon, nextDisabled, helper, onNext, onBack }: Props) {
    const subtotal = CHECKOUT_ITEMS.reduce((sum, item) => sum + item.price, 0);
    const discount = coupon ? DEMO_DISCOUNT : 0;
    const total = subtotal - discount;
    const assigned = CHECKOUT_ITEMS.filter(item => assignments[item.id]).length;

    return (
        <aside className="btb-co-summary" aria-labelledby="co-summary-title">
            <span className="btb-co-summary__tape">TÓM TẮT ĐƠN</span>
            <div className="btb-co-summary__inner">
                <span className="btb-co-overline">{CHECKOUT_ITEMS.length} MẶT HÀNG · {packages.length} ĐIỂM GIAO</span>
                <h2 id="co-summary-title">Đơn hàng của bạn</h2>
                <div className="btb-co-summary__products">
                    {CHECKOUT_ITEMS.map(item => <div className="btb-co-summary__product" key={item.id}>
                        <CheckoutProductImage name={item.name} />
                        <div><strong>{item.name}</strong><small>{item.pack} · {packages.find(p => p.id === assignments[item.id])?.branchName ?? 'Chưa phân gói'}</small></div>
                        <b>{formatPrice(item.price)}</b>
                    </div>)}
                </div>
                <div className="btb-co-summary__math">
                    <div><span>Tạm tính</span><strong>{formatPrice(subtotal)}</strong></div>
                    <div><span>Phí giao hàng ({packages.length} gói)</span><strong>Chưa tính</strong></div>
                    {coupon && <div className="btb-co-summary__discount"><span>Ưu đãi {DEMO_COUPON}</span><strong>-{formatPrice(discount)}</strong></div>}
                </div>
                <div className="btb-co-summary__total"><div><strong>Tạm tính</strong><small>Giá mẫu, chưa gồm phí giao hàng</small></div><b>{formatPrice(total)}</b></div>
                {step === 0 && <div className={`btb-co-summary__helper ${nextDisabled ? 'is-warning' : 'is-ready'}`}>{nextDisabled ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}{helper || `${assigned}/${CHECKOUT_ITEMS.length} mặt hàng đã phân gói`}</div>}
                {step > 0 && <p className="btb-co-summary__demo">Đây là giao diện demo; chưa có thanh toán hay tạo đơn thực tế.</p>}
                <div className="btb-co-summary__actions">
                    <button type="button" className="btb-co-summary__next" onClick={onNext} disabled={nextDisabled}>{CTA[step]} <ArrowRight size={19} /></button>
                    {step > 0 && <button type="button" className="btb-co-summary__back" onClick={onBack}><ArrowLeft size={16} /> Quay lại bước trước</button>}
                </div>
                <div className="btb-co-summary__security"><LockKeyhole size={14} /> Thông tin chỉ được dùng để minh họa giao diện.</div>
            </div>
        </aside>
    );
}
