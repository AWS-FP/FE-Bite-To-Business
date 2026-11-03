import { Banknote, Check, CreditCard, Smartphone, Truck } from 'lucide-react';
import { formatDate } from './checkoutData';
import type { DeliveryPackage, PaymentMethod } from './checkoutData';

type Props = {
    packages: DeliveryPackage[];
    method: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
    onEditDelivery: () => void;
};

const PAYMENTS: { id: PaymentMethod; eyebrow: string; title: string; description: string }[] = [
    { id: 'momo', eyebrow: 'VÍ ĐIỆN TỬ', title: 'MoMo', description: 'Minh họa phương thức thanh toán ví điện tử.' },
    { id: 'card', eyebrow: 'THẺ QUỐC TẾ', title: 'Visa / Mastercard', description: 'Minh họa thanh toán qua thẻ tín dụng hoặc ghi nợ.' },
    { id: 'bank', eyebrow: 'CHUYỂN KHOẢN', title: 'Ngân hàng', description: 'Minh họa xác nhận đơn qua chuyển khoản.' },
];

export default function CheckoutPayment({ packages, method, onMethodChange, onEditDelivery }: Props) {
    return (
        <div className="btb-co-stack">
            <section className="btb-co-panel">
                <div className="btb-co-panel__head">
                    <div className="btb-co-panel__icon btb-co-panel__icon--pink"><Truck size={22} /></div>
                    <div><span className="btb-co-overline">ĐỊA ĐIỂM ĐÃ XÁC NHẬN</span><h2>{packages.length} delivery packages sẵn sàng</h2></div>
                    <button type="button" className="btb-co-link-button" onClick={onEditDelivery}>Chỉnh sửa</button>
                </div>
                <div className="btb-co-stack btb-co-stack--small">
                    {packages.map(delivery => <div className="btb-co-ready" key={delivery.id}><span className="btb-co-ready__icon"><Truck size={18} /></span><div><strong>{delivery.branchName}</strong><small>{delivery.address} · {delivery.receiver} · {delivery.phone}</small></div><span>{formatDate(delivery.date)}<small>{delivery.timeSlot}</small></span></div>)}
                </div>
            </section>
            <section className="btb-co-panel">
                <div className="btb-co-panel__head"><div className="btb-co-panel__icon btb-co-panel__icon--yellow"><CreditCard size={22} /></div><div><span className="btb-co-overline">PHƯƠNG THỨC THANH TOÁN</span><h2>Chọn cách bạn muốn trả</h2></div></div>
                <div className="btb-co-payments" role="radiogroup" aria-label="Phương thức thanh toán">
                    {PAYMENTS.map(payment => <label key={payment.id} className={`btb-co-payment ${method === payment.id ? 'is-selected' : ''}`}>
                        <input type="radio" name="btb-checkout-payment" checked={method === payment.id} onChange={() => onMethodChange(payment.id)} />
                        <span className={`btb-co-payment__brand btb-co-payment__brand--${payment.id}`}>
                            {payment.id === 'momo' ? <Smartphone size={25} /> : payment.id === 'card' ? <CreditCard size={25} /> : <Banknote size={25} />}
                        </span>
                        <span className="btb-co-payment__body"><small>{payment.eyebrow}</small><strong>{payment.title}</strong><span>{payment.description}</span></span>
                        <span className="btb-co-payment__radio">{method === payment.id && <Check size={15} />}</span>
                    </label>)}
                </div>
                <div className="btb-co-payment-note"><span className="btb-co-payment-note__icon"><Smartphone size={24} /></span><p><strong>{method === 'momo' ? 'Mô phỏng thanh toán qua MoMo' : method === 'card' ? 'Mô phỏng thanh toán thẻ' : 'Mô phỏng chuyển khoản ngân hàng'}</strong><br />Chưa tích hợp cổng thanh toán hoặc xử lý giao dịch. Nhấn “Xác nhận” chỉ hiển thị kết quả demo.</p></div>
            </section>
        </div>
    );
}
