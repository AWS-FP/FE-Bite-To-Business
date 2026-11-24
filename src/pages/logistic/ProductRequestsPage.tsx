import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Pagination from '@/components/common/Pagination';
import LogisticsPageShell, { ListStatus } from '@/components/logistic/LogisticsPageShell';
import ProductCreateWizard from '@/components/logistic/ProductCreateWizard';
import { useLogisticsList, type ProductRequest } from '@/hooks/logistic/useLogisticsData';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import type { CatalogProduct } from '@/types/customer/catalog';
import { http } from '@/services/axiosClient';

type ResponseStep = 'choice' | 'reject' | 'confirm';

export default function ProductRequestsPage() {
    const { tr, english } = useLogisticsText();
    const data = useLogisticsList<ProductRequest>('/api/logistics/product-requests');
    const [selected, setSelected] = useState<ProductRequest | null>(null);
    const [creating, setCreating] = useState<ProductRequest | null>(null);
    const [step, setStep] = useState<ResponseStep>('choice');
    const [note, setNote] = useState('');
    const [keyword, setKeyword] = useState('');
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [productId, setProductId] = useState('');
    const [productPage, setProductPage] = useState(0);
    const [productPages, setProductPages] = useState(0);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!selected || step !== 'confirm') return;
        const controller = new AbortController();
        setLoadingProducts(true);
        getCatalogProducts({ page: productPage, size: 10, q: search || undefined, signal: controller.signal })
            .then(result => { setProducts(result.items); setProductPages(result.totalPages); })
            .catch(() => { if (!controller.signal.aborted) setError(tr("Không tải được danh sách sản phẩm.")); })
            .finally(() => { if (!controller.signal.aborted) setLoadingProducts(false); });
        return () => controller.abort();
    }, [selected, step, search, productPage, tr]);

    function openResponse(item: ProductRequest) {
        setSelected(item);
        setStep('choice');
        setNote('');
        setKeyword('');
        setSearch('');
        setProductId('');
        setProductPage(0);
        setError('');
        setMessage('');
    }

    async function respond(decision: 'ADDED' | 'REJECTED') {
        if (!selected || busy || (decision === 'REJECTED' && !note.trim()) || (decision === 'ADDED' && !productId)) return;
        setBusy(true);
        setError('');
        try {
            await http.post(`/api/logistics/product-requests/${selected.id}/response`, {
                decision,
                note: decision === 'REJECTED' ? note.trim() : 'Sản phẩm bạn yêu cầu đã được bổ sung.',
                productId: decision === 'ADDED' ? productId : null,
            });
            setSelected(null);
            setMessage(tr("Đã lưu phản hồi. Email sẽ được gửi nếu khách đã chọn nhận thông báo."));
            void data.refresh();
        } catch {
            setError(tr("Không thể lưu phản hồi. Hãy kiểm tra sản phẩm đã được đăng bán và thử lại."));
        } finally {
            setBusy(false);
        }
    }

    if (creating) return <ProductCreateWizard request={creating} onClose={() => setCreating(null)} />;
    return <LogisticsPageShell number="04" label={tr("Yêu cầu khách hàng")} title={tr("Yêu cầu sản phẩm")} description={tr("Tiếp nhận và phản hồi yêu cầu từ khách hàng.")}>
        <section className="rounded-xl border border-store-line bg-white p-5">
            {message && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-green-800">{message}</p>}
            <ListStatus loading={data.loading} error={data.error} empty={data.items.length === 0} />
            {data.items.map(item => <article key={item.id} className="space-y-2 border-b py-4">
                <div className="flex justify-between gap-4"><strong>{item.productName}</strong><span>{tr(item.status)}</span></div>
                {item.customerNote && <p className="text-sm">{item.customerNote}</p>}
                {['PENDING', 'REVIEWING'].includes(item.status) && <div className="flex gap-2">
                    <button type="button" onClick={() => openResponse(item)} className="rounded bg-store-green px-3 py-2 text-white hover:opacity-90">{tr("Phản hồi")}</button>
                    <button type="button" onClick={() => setCreating(item)} className="rounded border border-black bg-store-yellow px-3 py-2 font-semibold hover:opacity-90">{tr("Tạo sản phẩm")}</button>
                </div>}
            </article>)}
            <Pagination page={data.page} totalPages={data.totalPages} loading={data.loading} onPageChange={data.setPage} />
        </section>
        {selected && createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5" onClick={() => { if (!busy) setSelected(null); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="response-title" className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border-2 border-black bg-white p-6" onClick={event => event.stopPropagation()}>
                <div className="flex items-start justify-between gap-4"><div><h2 id="response-title" className="text-xl font-bold">{step === 'choice' ? tr("Phản hồi yêu cầu") : step === 'reject' ? tr("Lý do từ chối") : tr("Xác nhận sản phẩm")}</h2><p className="mt-2 text-sm text-gray-600">{selected.productName}</p></div><button type="button" aria-label={tr("Đóng")} disabled={busy} onClick={() => setSelected(null)} className="rounded border border-black px-3 py-1 hover:bg-gray-100">✕</button></div>
                {step === 'choice' && <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setStep('reject')} className="rounded border border-red-700 px-4 py-2 text-red-700 hover:bg-red-50">{tr("Từ chối")}</button><button type="button" onClick={() => setStep('confirm')} className="rounded bg-store-green px-4 py-2 text-white hover:opacity-90">{tr("Xác nhận")}</button></div>}
                {step === 'reject' && <form onSubmit={event => { event.preventDefault(); void respond('REJECTED'); }}><label className="mt-5 block font-semibold" htmlFor="rejection-reason">{tr("Lý do từ chối *")}</label><textarea id="rejection-reason" required maxLength={2000} value={note} onChange={event => setNote(event.target.value)} className="mt-2 min-h-28 w-full resize-none rounded border border-gray-400 p-3" /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setStep('choice')} disabled={busy} className="rounded border px-4 py-2">{tr("Quay lại")}</button><button type="submit" disabled={busy || !note.trim()} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">{busy ? tr("Đang lưu...") : tr("Xác nhận từ chối")}</button></div></form>}
                {step === 'confirm' && <div className="mt-5"><p className="text-sm text-gray-600">{tr("Chọn sản phẩm đã đăng bán để gửi đúng đường dẫn cho khách hàng.")}</p><form className="mt-4 flex gap-2" onSubmit={event => { event.preventDefault(); setProductPage(0); setSearch(keyword.trim()); }}><input aria-label={tr("Tìm sản phẩm theo tên hoặc SKU")} placeholder={tr("Tìm tên hoặc mã SKU")} value={keyword} onChange={event => setKeyword(event.target.value)} className="min-w-0 flex-1 rounded border border-gray-400 p-2" /><button className="rounded border border-black px-4 py-2" type="submit">{tr("Tìm")}</button></form><div className="mt-3 max-h-56 overflow-y-auto">{loadingProducts ? <p>{tr("Đang tải sản phẩm...")}</p> : products.length === 0 ? <p>{tr("Không tìm thấy sản phẩm.")}</p> : products.map(product => <label key={product.id} className="flex cursor-pointer items-center gap-3 border-b py-3"><input type="radio" name="product" checked={productId === product.id} onChange={() => setProductId(product.id)} /><span>{english ? product.nameEn || product.nameVi : product.nameVi} <span className="text-sm text-gray-500">· {product.sku}</span></span></label>)}</div><Pagination page={productPage} totalPages={productPages} loading={loadingProducts} onPageChange={setProductPage} /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setStep('choice')} disabled={busy} className="rounded border px-4 py-2">{tr("Quay lại")}</button><button type="button" onClick={() => void respond('ADDED')} disabled={busy || !productId} className="rounded bg-store-green px-4 py-2 text-white disabled:opacity-50">{busy ? tr("Đang lưu...") : tr("Xác nhận")}</button></div></div>}
                {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
            </section>
        </div>, document.body)}
    </LogisticsPageShell>;
}
