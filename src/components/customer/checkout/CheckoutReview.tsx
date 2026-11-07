import { BadgeCheck, MapPin } from 'lucide-react';
import { CHECKOUT_ITEMS, formatDate, formatPrice } from './checkoutData';
import type { DeliveryPackage } from './checkoutData';

type Props = { packages: DeliveryPackage[]; assignments: Record<string, string> };

export default function CheckoutReview({ packages, assignments }: Props) {
    return (
        <section className="btb-co-panel">
            <div className="btb-co-panel__head">
                <div className="btb-co-panel__icon btb-co-panel__icon--yellow"><BadgeCheck size={23} /></div>
                <div><span className="btb-co-overline">BÁO GIÁ DỰ KIẾN · UI DEMO</span><h2>Kiểm tra theo từng điểm giao</h2></div>
            </div>
            <p className="btb-co-panel__lead">Các món đã được nhóm theo chi nhánh. Giá và phí giao ở đây chỉ để minh họa giao diện, không phải báo giá do hệ thống phát hành.</p>
            <div className="btb-co-stack btb-co-stack--small">
                {packages.map(delivery => {
                    const products = CHECKOUT_ITEMS.filter(product => assignments[product.id] === delivery.id);
                    const subtotal = products.reduce((sum, product) => sum + product.price, 0);
                    return (
                        <article className="btb-co-quote" key={delivery.id}>
                            <div className="btb-co-quote__main">
                                <h3>{delivery.branchName}</h3>
                                <p><MapPin size={15} /> {delivery.address}</p>
                                <p className="btb-co-quote__date">{formatDate(delivery.date)} · {delivery.timeSlot}</p>
                                <div className="btb-co-quote__lines">
                                    {products.map(product => <div key={product.id}><span>{product.quantity} × {product.name}</span><strong>{formatPrice(product.price)}</strong></div>)}
                                </div>
                            </div>
                            <aside className="btb-co-quote__aside"><small>Tạm tính</small><strong>{formatPrice(subtotal)}</strong><span>Chưa gồm phí giao hàng</span></aside>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
