import { useRef, useState, type FormEvent } from 'react';
import LogisticsPageShell, { ListStatus, Pagination } from '@/components/logistic/LogisticsPageShell';
import { useLogisticsActions, useLogisticsList, type Stock } from '@/hooks/logistic/useLogisticsData';
export default function ReceivePage() {
    const data = useLogisticsList<Stock>('/api/logistics/inventory');
    const action = useLogisticsActions(data.refresh);
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [success, setSuccess] = useState(false);
    const movementId = useRef<string | null>(null);
    async function save(event: FormEvent) {
        event.preventDefault();
        if (!productId || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0) return;
        movementId.current ??= crypto.randomUUID();
        const saved = await action.submit(`/api/logistics/inventory/${productId}/receipts`, { movementId: movementId.current, quantity: Number(quantity), reason: reason.trim() || null });
        if (saved) { setQuantity(''); setReason(''); movementId.current = null; setSuccess(true); }
    }
    function changed() { movementId.current = null; setSuccess(false); }
    return <LogisticsPageShell title="Nhập hàng" description="Ghi nhận số lượng sản phẩm nhận vào kho."><form onSubmit={save} className="max-w-2xl space-y-4 rounded-xl border border-store-line bg-white p-6">
        <ListStatus loading={data.loading} error={data.error} empty={data.items.length === 0} />
        <label className="block font-bold">Sản phẩm<select required value={productId} onChange={e => { setProductId(e.target.value); changed(); }} className="mt-2 w-full rounded border p-3 font-normal"><option value="">Chọn sản phẩm</option>{data.items.map(item => <option key={item.productId} value={item.productId}>{item.name} · {item.sku}</option>)}</select></label>
        <Pagination {...data} />
        <label className="block font-bold">Số lượng<input required type="number" min="0.001" step="0.001" value={quantity} onChange={e => { setQuantity(e.target.value); changed(); }} className="mt-2 w-full rounded border p-3 font-normal" /></label>
        <label className="block font-bold">Ghi chú<input maxLength={1000} value={reason} onChange={e => { setReason(e.target.value); changed(); }} className="mt-2 w-full rounded border p-3 font-normal" /></label>
        {action.error && <p role="alert" className="text-red-700">{action.error}</p>}{success && <p role="status" className="text-green-700">Đã ghi nhận nhập hàng.</p>}
        <button disabled={action.busy} className="rounded bg-store-green px-5 py-3 font-bold text-white disabled:opacity-50">{action.busy ? 'Đang lưu...' : 'Nhập hàng'}</button>
    </form></LogisticsPageShell>;
}
