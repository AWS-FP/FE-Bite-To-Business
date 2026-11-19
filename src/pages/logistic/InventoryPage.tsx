import { Boxes, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { LogisticsPageHeader, ListStatus } from '@/components/logistic/LogisticsPageShell';
import { useLogisticsActions, useLogisticsList, type Stock } from '@/hooks/logistic/useLogisticsData';

export default function InventoryPage() {
    const [search, setSearch] = useState('');
    const [keyword, setKeyword] = useState('');
    const data = useLogisticsList<Stock>('/api/logistics/inventory', keyword);
    const action = useLogisticsActions(data.refresh);
    const [selected, setSelected] = useState<Stock | null>(null);
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [movementId, setMovementId] = useState('');
    const [clearing, setClearing] = useState<Stock | null>(null);

    function searchInventory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        data.setPage(0);
        setKeyword(search.trim());
    }

    function openAdjustment(item: Stock) {
        setSelected(item);
        setQuantity('');
        setReason('');
        setMovementId(crypto.randomUUID());
    }

    async function saveAdjustment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selected || !Number.isFinite(Number(quantity)) || Number(quantity) === 0 || !reason.trim()) return;
        const saved = await action.submit(`/api/logistics/inventory/${selected.productId}/adjustments`, {
            movementId,
            quantity: Number(quantity),
            reason: reason.trim(),
        });
        if (saved) setSelected(null);
    }

    async function clearAvailable() {
        if (!clearing) return;
        const saved = await action.submit(`/api/logistics/inventory/${clearing.productId}/clear-available`, { movementId });
        if (saved) setClearing(null);
    }

    return (
        <div className="mx-auto max-w-[1400px] space-y-6 text-black">
            <LogisticsPageHeader number="01" label="Quản lý kho" title="Sổ cái tồn kho">
                <button type="button" onClick={() => void data.refresh()} disabled={data.loading} className="flex shrink-0 items-center gap-2 rounded-[3px] border border-black bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-store-cream disabled:opacity-50">
                    <RefreshCw size={16} aria-hidden="true" /> Làm mới
                </button>
            </LogisticsPageHeader>

            <section className="overflow-hidden rounded-xl border-2 border-black bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-store-line px-6 py-5">
                    <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-store-cream text-store-green"><Boxes size={20} aria-hidden="true" /></span>
                    <div><h2 className="font-subheading text-lg font-bold">Chi tiết tồn kho</h2><p className="mt-1 text-xs text-store-muted">Số liệu theo từng mã sản phẩm</p></div></div>
                    <form onSubmit={searchInventory} className="flex items-center gap-2">
                        <label htmlFor="inventory-search" className="sr-only">Tìm theo tên sản phẩm hoặc mã SKU</label>
                        <input id="inventory-search" value={search} onChange={(event) => setSearch(event.target.value)} maxLength={200} placeholder="Tìm sản phẩm hoặc mã SKU..." className="w-72 rounded border border-black bg-white px-3 py-2 text-sm" />
                        <button type="submit" className="flex items-center gap-2 rounded border border-black bg-store-yellow px-3 py-2 text-sm font-semibold"><Search size={16} aria-hidden="true" /> Tìm</button>
                    </form>
                </div>
                {(data.loading || data.error || data.items.length === 0) && (
                    <div className="px-6 py-8"><ListStatus loading={data.loading} error={data.error} empty={data.items.length === 0} /></div>
                )}
                {!data.error && data.items.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1650px] border-collapse text-center text-sm">
                            <thead className="whitespace-nowrap bg-store-cream text-[11px] font-bold uppercase tracking-[0.06em] text-store-green">
                                <tr><th scope="col" className="px-6 py-4">Sản phẩm</th><th scope="col" className="px-4 py-4">Mã SKU</th><th scope="col" className="px-4 py-4">Đơn vị</th><th scope="col" className="px-4 py-4 text-center">Trong kho</th><th scope="col" className="px-4 py-4 text-center">Đã giữ</th><th scope="col" className="px-4 py-4 text-center">Có thể bán</th><th scope="col" className="px-6 py-4">Trạng thái</th><th scope="col" className="px-6 py-4">Thao tác</th></tr>
                            </thead>
                            <tbody>
                                {data.items.map((item) => (
                                    <tr key={item.productId} className="border-t border-store-line/70 hover:bg-store-cream/50">
                                        <td className="px-6 py-4 font-semibold">{item.name}</td>
                                        <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-store-muted">{item.sku}</td>
                                        <td className="px-4 py-4 text-store-muted">{item.unit}</td>
                                        <td className="px-4 py-4 text-center font-price font-semibold tabular-nums">{item.onHand.toLocaleString('vi-VN')}</td>
                                        <td className="px-4 py-4 text-center font-price tabular-nums text-store-muted">{item.reserved.toLocaleString('vi-VN')}</td>
                                        <td className="px-4 py-4 text-center font-price font-bold tabular-nums text-store-green">{item.available.toLocaleString('vi-VN')}</td>
                                        <td className="px-6 py-4"><span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${item.available > 0 ? 'bg-surface-green text-store-green' : 'bg-danger-soft text-danger-strong'}`}>{item.available > 0 ? 'Còn hàng' : 'Không còn hàng bán'}</span></td>
                                        <td className="px-6 py-4"><div className="flex justify-center gap-2 whitespace-nowrap"><button type="button" onClick={() => openAdjustment(item)} className="rounded border border-black px-3 py-2 font-semibold hover:bg-store-cream">Điều chỉnh</button><button type="button" disabled={item.available <= 0} onClick={() => { setClearing(item); setMovementId(crypto.randomUUID()); }} className="rounded border border-red-700 px-3 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40">Xóa tồn</button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination page={data.page} totalPages={data.totalPages} loading={data.loading} onPageChange={data.setPage} />
            </section>
            {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={() => !action.busy && setSelected(null)}>
                <form onSubmit={saveAdjustment} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="adjust-stock-title" className="w-full max-w-md space-y-4 rounded-xl border border-black bg-white p-6">
                    <h2 id="adjust-stock-title" className="font-subheading text-xl font-bold">Điều chỉnh tồn kho</h2>
                    <p className="text-sm">{selected.name} · Trong kho: {selected.onHand} {selected.unit} · Đã giữ: {selected.reserved}</p>
                    <label className="block text-sm font-semibold">Số lượng điều chỉnh
                        <input type="number" step="0.001" required value={quantity} onChange={(event) => setQuantity(event.target.value)} className="mt-2 w-full rounded border border-black px-3 py-2" />
                        <span className="mt-1 block font-normal text-store-muted">Nhập số dương để tăng, số âm để giảm.</span>
                    </label>
                    <label className="block text-sm font-semibold">Lý do
                        <textarea required maxLength={1000} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 w-full rounded border border-black px-3 py-2" />
                    </label>
                    {action.error && <p role="alert" className="text-sm text-red-700">{action.error}</p>}
                    <div className="flex justify-end gap-3"><button type="button" disabled={action.busy} onClick={() => setSelected(null)} className="rounded border border-black px-4 py-2">Hủy</button><button type="submit" disabled={action.busy} className="rounded border border-black bg-store-yellow px-4 py-2 font-semibold disabled:opacity-50">{action.busy ? 'Đang lưu...' : 'Lưu điều chỉnh'}</button></div>
                </form>
            </div>}
            <ConfirmModal open={Boolean(clearing)} title="Xóa tồn khả dụng" message={<>Xác nhận xóa hàng tồn kho khả dụng <strong>{clearing?.name}</strong>?</>} confirmLabel="Xác nhận xóa" danger busy={action.busy} error={action.error} onCancel={() => setClearing(null)} onConfirm={() => void clearAvailable()} />
        </div>
    );
}
