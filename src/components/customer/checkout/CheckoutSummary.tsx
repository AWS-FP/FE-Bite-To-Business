import { ArrowRight, ArrowLeft } from 'lucide-react';
import { formatPrice } from './checkoutData';
import CheckoutProductImage from './CheckoutProductImage';
import type { CheckoutItem, DeliveryPackage } from './checkoutData';

type Props = {
    items: CheckoutItem[];
    step: number;
    packages: DeliveryPackage[];
    assignments: Record<string, string>;
    nextDisabled: boolean;
    onNext: () => void;
    onBack: () => void;
};

const CTA = ['Xem báo giá giao hàng', 'Tiếp tục đến ưu đãi', 'Chọn phương thức thanh toán', 'Xác nhận đơn hàng'];

export default function CheckoutSummary({ items, step, packages, assignments, nextDisabled, onNext, onBack }: Props) {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <aside className="btb-co-summary" aria-labelledby="co-summary-title">
            <span className="btb-co-summary__tape">TÓM TẮT ĐƠN</span>
            <div className="btb-co-summary__inner">
                <span className="btb-co-overline">{items.length} MẶT HÀNG · {packages.length} ĐIỂM GIAO</span>
                <h2 id="co-summary-title">Đơn hàng của bạn</h2>
                <div className="btb-co-summary__products">
                    {items.map(item => <div className="btb-co-summary__product" key={item.id}>
                        <CheckoutProductImage name={item.name} src={item.imageUrl} />
                        <div><strong>{item.name}</strong><small>{item.pack} · {packages.find(p => p.id === assignments[item.id])?.branchName ?? 'Chưa phân gói'}</small></div>
                        <b>{formatPrice(item.price)}</b>
                    </div>)}
                </div>
                <div className="btb-co-summary__math">
                    <div><span>Tạm tính</span><strong>{formatPrice(subtotal)}</strong></div>
                    <div><span>Phí giao hàng ({packages.length} gói)</span><strong>Chưa tính</strong></div>
                </div>
                <div className="btb-co-summary__total"><div><strong>Tạm tính</strong><small>Chưa gồm phí giao hàng</small></div><b>{formatPrice(subtotal)}</b></div>
                <div className="btb-co-summary__actions">
                    <button type="button" className="btb-co-summary__next" onClick={onNext} disabled={nextDisabled}>{CTA[step]} <ArrowRight size={19} /></button>
                    {step > 0 && <button type="button" className="btb-co-summary__back" onClick={onBack}><ArrowLeft size={16} /> Quay lại bước trước</button>}
                </div>
            </div>
        </aside>
    );
}
