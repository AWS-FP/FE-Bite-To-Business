import { useState } from 'react';
import type { FormEvent } from 'react';
import { ClipboardList, MapPin, PackageCheck, Pencil, Plus, Trash2, Truck } from 'lucide-react';
import { CHECKOUT_ITEMS, EMPTY_DELIVERY, formatDate, formatPrice, validateDelivery } from './checkoutData';
import CheckoutProductImage from './CheckoutProductImage';
import type { DeliveryDraft, DeliveryPackage } from './checkoutData';

export type DeliveryProps = {
    packages: DeliveryPackage[];
    assignments: Record<string, string>;
    onCreatePackage: (draft: DeliveryDraft) => void;
    onEditPackage: (id: string, draft: DeliveryDraft) => void;
    onDeletePackage: (id: string) => void;
    onAssign: (itemId: string, packageId: string) => void;
};

export default function CheckoutDelivery({
    packages, assignments, onCreatePackage, onEditPackage, onDeletePackage, onAssign,
}: DeliveryProps) {
    const [formOpen, setFormOpen] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<DeliveryDraft>({ ...EMPTY_DELIVERY });
    const [error, setError] = useState('');
    const assigned = CHECKOUT_ITEMS.filter(item => !!assignments[item.id]).length;
    const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    function patch<K extends keyof DeliveryDraft>(key: K, value: DeliveryDraft[K]) {
        setDraft(prev => ({ ...prev, [key]: value }));
        if (error) setError('');
    }

    function resetForm() {
        setEditingId(null);
        setDraft({ ...EMPTY_DELIVERY });
        setError('');
        setFormOpen(false);
    }

    function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const message = validateDelivery(draft);
        if (message) { setError(message); return; }
        if (editingId) onEditPackage(editingId, draft);
        else onCreatePackage(draft);
        resetForm();
    }

    function startEdit(item: DeliveryPackage) {
        const { id, ...data } = item;
        setDraft(data);
        setEditingId(id);
        setFormOpen(true);
        setError('');
    }

    return (
        <div className="btb-co-stack">
            <section className="btb-co-panel">
                <div className="btb-co-panel__head">
                    <div className="btb-co-panel__icon btb-co-panel__icon--pink"><ClipboardList size={22} /></div>
                    <div><span className="btb-co-overline">ĐƠN HÀNG CẦN ĐIỀU PHỐI</span><h2>Món hàng chưa phân phối</h2></div>
                    <span className="btb-co-counter">{CHECKOUT_ITEMS.length - assigned} chưa gán</span>
                </div>
                <div className="btb-co-item-list">
                    {CHECKOUT_ITEMS.map(item => (
                        <div className="btb-co-item" key={item.id}>
                            <CheckoutProductImage name={item.name} />
                            <div className="btb-co-item__details"><strong>{item.name}</strong><small>{item.sku} · {item.pack}</small></div>
                            <strong className="btb-co-item__price">{formatPrice(item.price)}</strong>
                            <label className="btb-co-item__select">
                                <span className="btb-co-sr-only">Điểm giao của {item.name}</span>
                                <select value={assignments[item.id] ?? ''} onChange={e => onAssign(item.id, e.target.value)} disabled={!packages.length}>
                                    <option value="">{packages.length ? 'Chọn gói giao' : 'Tạo gói trước'}</option>
                                    {packages.map(delivery => <option key={delivery.id} value={delivery.id}>{delivery.branchName}</option>)}
                                </select>
                            </label>
                        </div>
                    ))}
                </div>
                {assigned === CHECKOUT_ITEMS.length && <div className="btb-co-inline-success"><PackageCheck size={16} /> Đã phân bổ đủ {assigned} mặt hàng vào các điểm giao.</div>}
            </section>

            <section className="btb-co-panel">
                <div className="btb-co-panel__head">
                    <div className="btb-co-panel__icon btb-co-panel__icon--yellow"><PackageCheck size={22} /></div>
                    <div><span className="btb-co-overline">DELIVERY PACKAGES</span><h2>Điểm giao theo chi nhánh</h2></div>
                    {!formOpen && <button type="button" className="btb-co-mini-button" onClick={() => { setEditingId(null); setDraft({ ...EMPTY_DELIVERY }); setFormOpen(true); }}><Plus size={16} /> Tạo gói mới</button>}
                </div>
                {packages.map((delivery, index) => {
                    const lineItems = CHECKOUT_ITEMS.filter(item => assignments[item.id] === delivery.id);
                    return (
                        <article key={delivery.id} className="btb-co-delivery-card">
                            <div className="btb-co-delivery-card__top"><div><span className="btb-co-overline">GÓI GIAO {String(index + 1).padStart(2, '0')}</span><h3>{delivery.branchName}</h3></div>
                                <div className="btb-co-delivery-card__actions"><button type="button" aria-label={`Sửa ${delivery.branchName}`} onClick={() => startEdit(delivery)}><Pencil size={16} /></button><button type="button" aria-label={`Xóa ${delivery.branchName}`} onClick={() => onDeletePackage(delivery.id)}><Trash2 size={16} /></button></div>
                            </div>
                            <p><MapPin size={15} /> {delivery.address}</p>
                            <p><Truck size={15} /> {delivery.receiver} · {delivery.phone} · {formatDate(delivery.date)} · {delivery.timeSlot}</p>
                            <div className="btb-co-delivery-card__items">
                                <span>{lineItems.length} món đã gán</span>
                                <strong>{formatPrice(lineItems.reduce((sum, item) => sum + item.price, 0))}</strong>
                            </div>
                            <div className="btb-co-delivery-card__chips">{lineItems.length ? lineItems.map(item => <span key={item.id}>{item.name}</span>) : <small>Chưa có mặt hàng nào được phân vào gói giao này.</small>}</div>
                        </article>
                    );
                })}

                {formOpen && <form className="btb-co-delivery-form" onSubmit={submitForm} noValidate>
                    <div className="btb-co-delivery-form__heading"><Truck size={18} /><div><strong>{editingId ? 'Sửa thông tin điểm giao' : 'Tạo gói giao hàng đầu tiên'}</strong><small>Mỗi gói là một chi nhánh, với địa chỉ và người nhận riêng.</small></div></div>
                    <div className="btb-co-field"><label htmlFor="co-branch">Tên chi nhánh / gói giao <span>*</span></label><input id="co-branch" value={draft.branchName} placeholder="VD: Chi nhánh Quận 1" onChange={e => patch('branchName', e.target.value)} /></div>
                    <div className="btb-co-fields-2">
                        <div className="btb-co-field"><label htmlFor="co-receiver">Người nhận <span>*</span></label><input id="co-receiver" value={draft.receiver} placeholder="Họ và tên" onChange={e => patch('receiver', e.target.value)} /></div>
                        <div className="btb-co-field"><label htmlFor="co-phone">Số điện thoại <span>*</span></label><input id="co-phone" type="tel" value={draft.phone} placeholder="0900 000 000" onChange={e => patch('phone', e.target.value)} /></div>
                    </div>
                    <div className="btb-co-field"><label htmlFor="co-address">Địa chỉ giao hàng <span>*</span></label><input id="co-address" value={draft.address} placeholder="Số nhà, đường, phường/xã, quận/huyện" onChange={e => patch('address', e.target.value)} /></div>
                    <div className="btb-co-fields-2">
                        <div className="btb-co-field"><label htmlFor="co-date">Ngày giao <span>*</span></label><input id="co-date" type="date" min={minDate} value={draft.date} onChange={e => patch('date', e.target.value)} /></div>
                        <div className="btb-co-field"><label htmlFor="co-slot">Khung giờ giao <span>*</span></label><select id="co-slot" value={draft.timeSlot} onChange={e => patch('timeSlot', e.target.value)}><option value="08:00 - 11:00">08:00 – 11:00</option><option value="13:00 - 16:00">13:00 – 16:00</option><option value="17:00 - 20:00">17:00 – 20:00</option></select></div>
                    </div>
                    {error && <p className="btb-co-form-error" role="alert">{error}</p>}
                    <div className="btb-co-delivery-form__actions"><button type="button" className="btb-co-outline-button" onClick={resetForm}>Hủy</button><button type="submit" className="btb-co-mini-button"><PackageCheck size={16} /> {editingId ? 'Lưu thay đổi' : 'Tạo delivery package'}</button></div>
                </form>}
                {!formOpen && !packages.length && <button type="button" className="btb-co-empty-package" onClick={() => setFormOpen(true)}><Plus size={20} /> Tạo gói giao để bắt đầu phân chia hàng</button>}
            </section>
        </div>
    );
}
