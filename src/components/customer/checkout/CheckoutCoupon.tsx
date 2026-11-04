import { useState } from 'react';
import type { FormEvent } from 'react';
import { BadgePercent, Check, Tag } from 'lucide-react';
import { CHECKOUT_ITEMS, DEMO_COUPON, formatPrice } from './checkoutData';
import type { DeliveryPackage } from './checkoutData';

type Props = {
    applied: boolean;
    onApply: (applied: boolean) => void;
    packages: DeliveryPackage[];
    assignments: Record<string, string>;
};

export default function CheckoutCoupon({ applied, onApply, packages, assignments }: Props) {
    const [input, setInput] = useState(applied ? DEMO_COUPON : '');
    const [message, setMessage] = useState('');

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (input.trim().toUpperCase() === DEMO_COUPON) {
            onApply(true);
            setMessage('Đã áp dụng mã minh họa. Bạn được giảm 50.000đ trong bản demo.');
        } else {
            onApply(false);
            setMessage(`Mã không hợp lệ. Mã dùng thử: ${DEMO_COUPON}.`);
        }
    }

    return (
        <section className="btb-co-panel btb-co-panel--coupon">
            <div className="btb-co-coupon-row">
                <div>
                    <span className="btb-co-overline">MÃ KHUYẾN MÃI</span>
                    <h2>Thêm ưu đãi vào báo giá</h2>
                    <p>Nhập <b>{DEMO_COUPON}</b> để dùng thử mã giảm 50.000đ cho đơn hàng này.</p>
                </div>
                <form className="btb-co-coupon-input" onSubmit={submit}>
                    <label className="btb-co-sr-only" htmlFor="co-coupon">Mã ưu đãi</label>
                    <input id="co-coupon" value={input} onChange={e => { setInput(e.target.value); setMessage(''); }} placeholder="Nhập mã ưu đãi" />
                    <button type="submit">Áp dụng</button>
                </form>
            </div>
            {applied && <div className="btb-co-inline-success"><Check size={17} /> Đã giảm 50.000đ cho đơn hàng mẫu.</div>}
            {message && <p className="btb-co-form-message" role="status"><BadgePercent size={15} /> {message}</p>}
            <div className="btb-co-coupon-packages">
                {packages.map(delivery => {
                    const products = CHECKOUT_ITEMS.filter(product => assignments[product.id] === delivery.id);
                    return <div key={delivery.id}><span><Tag size={13} /> {delivery.branchName}</span><strong>{products.length} món · {formatPrice(products.reduce((sum, product) => sum + product.price, 0))}</strong></div>;
                })}
            </div>
        </section>
    );
}
