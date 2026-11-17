import { useState } from 'react';
import LogisticsPageShell, { ListStatus, Pagination } from '@/components/logistic/LogisticsPageShell';
import { useLogisticsActions, useLogisticsList, type ProductRequest, type Stock } from '@/hooks/logistic/useLogisticsData';
export default function ProductRequestsPage() {
    const data = useLogisticsList<ProductRequest>('/api/logistics/product-requests');
    const products = useLogisticsList<Stock>('/api/logistics/inventory');
    const action = useLogisticsActions(data.refresh);
    const [selected, setSelected] = useState('');
    const [decision, setDecision] = useState('REJECTED');
    const [note, setNote] = useState('');
    const [productId, setProductId] = useState('');
    async function respond() {
        if (!selected || !note.trim() || (decision === 'ADDED' && !productId.trim())) return;
        const ok = await action.submit(`/api/logistics/product-requests/${selected}/response`, { decision, note, productId: decision === 'ADDED' ? productId.trim() : null });
        if (ok) { setSelected(''); setNote(''); setProductId(''); }
    }
    return <LogisticsPageShell title="Yêu cầu sản phẩm" description="Tiếp nhận và phản hồi yêu cầu từ khách hàng."><section className="rounded-xl border border-store-line bg-white p-5">
        <ListStatus loading={data.loading} error={data.error} empty={data.items.length === 0} />
        {data.items.map(item => <article key={item.id} className="space-y-2 border-b py-4"><div className="flex justify-between gap-4"><strong>{item.productName}</strong><span>{item.status}</span></div>{item.customerNote && <p className="text-sm">{item.customerNote}</p>}{['PENDING', 'REVIEWING'].includes(item.status) && <div className="flex gap-2"><button type="button" disabled={action.busy} onClick={() => void action.submit(`/api/logistics/product-requests/${item.id}/start-review`)} className="rounded border px-3 py-2">Nhận xử lý</button><button type="button" onClick={() => setSelected(item.id)} className="rounded bg-store-green px-3 py-2 text-white">Phản hồi</button></div>}</article>)}
        <Pagination {...data} />
    </section>{selected && <section className="max-w-2xl space-y-4 rounded-xl border border-store-line bg-white p-6"><h2 className="text-xl font-bold">Phản hồi yêu cầu</h2><label className="block">Kết quả<select value={decision} onChange={e => setDecision(e.target.value)} className="mt-2 w-full rounded border p-3"><option value="REJECTED">Từ chối</option><option value="ADDED">Đã thêm sản phẩm</option></select></label>{decision === 'ADDED' && <><label className="block">Sản phẩm<select value={productId} onChange={e => setProductId(e.target.value)} className="mt-2 w-full rounded border p-3"><option value="">Chọn sản phẩm</option>{products.items.map(item => <option key={item.productId} value={item.productId}>{item.name} · {item.sku}</option>)}</select></label><ListStatus loading={products.loading} error={products.error} empty={products.items.length === 0} /><Pagination {...products} /></>}<label className="block">Nội dung<textarea value={note} maxLength={2000} onChange={e => setNote(e.target.value)} className="mt-2 w-full rounded border p-3" /></label><div className="flex gap-2"><button type="button" onClick={() => void respond()} disabled={action.busy || !note.trim()} className="rounded bg-store-green px-4 py-2 text-white disabled:opacity-50">Lưu phản hồi</button><button type="button" onClick={() => setSelected('')} className="rounded border px-4 py-2">Đóng</button></div></section>}{action.error && <p role="alert" className="text-red-700">{action.error}</p>}</LogisticsPageShell>;
}
