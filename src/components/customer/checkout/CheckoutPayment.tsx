import { Banknote, Check, Truck } from 'lucide-react';
import { formatDate } from './checkoutData';
import type { DeliveryPackage } from './checkoutData';

type Props = {
    packages: DeliveryPackage[];
    onEditDelivery: () => void;
};

export default function CheckoutPayment({ packages, onEditDelivery }: Props) {
    return (
        <div className="btb-co-stack">
            <section className="btb-co-panel">
                <div className="btb-co-panel__head">
                    <div className="btb-co-panel__icon btb-co-panel__icon--pink"><Truck size={22} /></div>
                    <div><span className="btb-co-overline">ĐỊA ĐIỂM GIAO HÀNG</span><h2>{packages.length} gói giao hàng</h2></div>
                    <button type="button" className="btb-co-link-button" onClick={onEditDelivery}>Chỉnh sửa</button>
                </div>
                <div className="btb-co-stack btb-co-stack--small">
                    {packages.map(delivery => <div className="btb-co-ready" key={delivery.id}><span className="btb-co-ready__icon"><Truck size={18} /></span><div><strong>{delivery.branchName}</strong><small>{delivery.address} · {delivery.receiver} · {delivery.phone}</small></div><span>{formatDate(delivery.date)}<small>{delivery.timeSlot}</small></span></div>)}
                </div>
            </section>
            <section className="btb-co-panel">
                <div className="btb-co-panel__head"><div className="btb-co-panel__icon btb-co-panel__icon--yellow"><Banknote size={22} /></div><div><span className="btb-co-overline">PHƯƠNG THỨC THANH TOÁN</span><h2>Chuyển khoản ngân hàng</h2></div></div>
                <div className="btb-co-payments">
                    <div className="btb-co-payment is-selected">
                        <span className="btb-co-payment__brand btb-co-payment__brand--bank"><Banknote size={25} /></span>
                        <span className="btb-co-payment__body"><small>CHUYỂN KHOẢN</small><strong>Ngân hàng</strong></span>
                        <span className="btb-co-payment__radio"><Check size={15} /></span>
                    </div>
                </div>
                <p>Thanh toán chưa khả dụng.</p>
            </section>
        </div>
    );
}
