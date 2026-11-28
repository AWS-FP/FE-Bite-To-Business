import ListSkeleton from '@/components/common/ListSkeleton';
import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { CalendarDays, ExternalLink, MessageSquare, PackagePlus, PackageSearch, Search, X } from 'lucide-react';
import { ExecutiveSelect } from '@/components/e-commerce/ExecutiveControls';
import { useDebouncedSearch } from '@/hooks/e-commerce/useDebouncedSearch';
import Pagination from '@/components/common/Pagination';
import LogisticsPageShell from '@/components/logistic/LogisticsPageShell';
import ProductCreateWizard from '@/components/logistic/ProductCreateWizard';
import { productRequestListKey, useProductRequests, type ProductRequest } from '@/hooks/logistic/useLogisticsData';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import { http } from '@/services/axiosClient';

type ResponseStep = 'choice' | 'reject' | 'confirm';
const requestStatuses = ['PENDING', 'REVIEWING', 'ADDED', 'REJECTED'] as const;
const statusStyles = {
    PENDING: 'bg-[#faf3e5] text-[#80591c]',
    REVIEWING: 'bg-[#eef1f8] text-[#435681]',
    ADDED: 'bg-[#edf4ed] text-[#386047]',
    REJECTED: 'bg-[#faf0ef] text-[#934b46]',
};

function referenceLink(value?: string | null) {
    if (!value) return null;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch { return null; }
}

function RequestCard({ item, english, tr, onRespond, onCreate }: {
    item: ProductRequest; english: boolean; tr: (value: string) => string;
    onRespond: () => void; onCreate: () => void;
}) {
    const tone = statusStyles[item.status as keyof typeof statusStyles] ?? 'bg-surface-soft text-store-muted';
    const actionable = item.status === 'PENDING' || item.status === 'REVIEWING';
    const reference = referenceLink(item.referenceUrl);
    const created = new Date(item.createdAt);
    return (
        <article className="grid gap-4 rounded-xl border border-solid border-[#e0e4dc] bg-[#fffefb] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className={`inline-flex items-center rounded-[4px] px-2.5 py-1 text-xs font-semibold ${tone}`}>
                        {tr(item.status)}
                    </span>
                    {!Number.isNaN(created.getTime()) && <time dateTime={item.createdAt} className="inline-flex items-center gap-1.5 text-xs text-store-muted">
                        <CalendarDays size={14} aria-hidden="true" />
                        {tr('Ngày gửi:')} {created.toLocaleDateString(english ? 'en-GB' : 'vi-VN')}
                    </time>}
                </div>
                <h3 className="mt-3 break-words font-heading text-base font-bold leading-6 text-store-ink">{item.productName}</h3>
                {item.customerNote && <div className="mt-3 rounded-lg bg-[#f6f5ef] px-3 py-2.5">
                    <p className="text-xs font-semibold text-store-muted">{tr('Ghi chú của khách hàng')}</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-store-ink">{item.customerNote}</p>
                </div>}
                {reference && <a href={reference} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-store-green underline underline-offset-2">
                    {tr('Link tham khảo')} <ExternalLink size={13} aria-hidden="true" />
                </a>}
            </div>
            {actionable && <div className="grid gap-2 sm:grid-cols-2 lg:w-44 lg:grid-cols-1">
                <button type="button" onClick={onRespond} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-solid border-store-green bg-store-green px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-store-dark focus-visible:!bg-store-dark">
                    <MessageSquare size={16} aria-hidden="true" />{tr('Phản hồi')}
                </button>
                <button type="button" onClick={onCreate} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-solid border-store-ink bg-store-yellow px-3 py-2 text-sm font-semibold text-store-ink transition-colors hover:bg-surface-yellow">
                    <PackagePlus size={16} aria-hidden="true" />{tr('Tạo sản phẩm')}
                </button>
            </div>}
        </article>
    );
}

export default function ProductRequestsPage() {
    const { tr, english } = useLogisticsText();
    const [status, setStatus] = useState('');
    const [requestSearch, setRequestSearch] = useState('');
    const [page, setPage] = useState(0);
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<ProductRequest | null>(null);
    const [creating, setCreating] = useState<ProductRequest | null>(null);
    const requestKeyword = useDebouncedSearch(requestSearch.trim());
    const waitingForSearch = requestSearch.trim() !== requestKeyword;
    const data = useProductRequests(page, requestKeyword, status, !waitingForSearch && !creating);
    const listLoading = waitingForSearch || data.isPending || data.isFetching;
    const [step, setStep] = useState<ResponseStep>('choice');
    const [note, setNote] = useState('');
    const [keyword, setKeyword] = useState('');
    const [search, setSearch] = useState('');
    const [productId, setProductId] = useState('');
    const [productPage, setProductPage] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const productResults = useQuery({
        queryKey: ['logistics', 'request-response-products', productPage, search],
        queryFn: ({ signal }) => getCatalogProducts({ page: productPage, size: 10, q: search || undefined, signal }),
        enabled: Boolean(selected) && step === 'confirm',
    });
    const products = productResults.data?.items ?? [];
    const productPages = productResults.data?.totalPages ?? 0;
    const loadingProducts = productResults.isPending || productResults.isFetching;

    function changeRequestSearch(value: string) {
        setRequestSearch(value);
        if (value.trim() !== requestSearch.trim()) setPage(0);
    }

    function changeStatus(value: string) {
        setStatus(value);
        setPage(0);
    }

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
            // A response can remove the last item from a filtered page.
            if (page > 0) {
                void queryClient.invalidateQueries({ queryKey: productRequestListKey, refetchType: 'none' });
                setPage(0);
            } else {
                void queryClient.invalidateQueries({ queryKey: productRequestListKey });
            }
        } catch {
            setError(tr("Không thể lưu phản hồi. Hãy kiểm tra sản phẩm đã được đăng bán và thử lại."));
        } finally {
            setBusy(false);
        }
    }

    if (creating) return <ProductCreateWizard request={creating} onClose={() => setCreating(null)} />;
    return <LogisticsPageShell number="04" label={tr('Yêu cầu khách hàng')} title={tr('Yêu cầu sản phẩm')} description={tr('Tiếp nhận và phản hồi yêu cầu từ khách hàng.')}>
        <section className="space-y-4">
            <span role="status" className="sr-only">
                {listLoading || data.isError ? '—' : (data.data?.totalElements ?? 0).toLocaleString(english ? 'en-US' : 'vi-VN')} {tr('kết quả')}
            </span>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)]">
                <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-solid border-store-line bg-[#fcfcfa] px-3 focus-within:border-store-sage">
                    <Search size={18} className="shrink-0 text-store-sage" aria-hidden="true" />
                    <input type="search" value={requestSearch} maxLength={200} onChange={event => changeRequestSearch(event.target.value)}
                        aria-label={tr('Tìm yêu cầu sản phẩm')} placeholder={tr('Tìm tên sản phẩm, thương hiệu hoặc ghi chú...')}
                        className="store-search-input h-full min-w-0 flex-1 appearance-none !border-0 !bg-transparent text-sm text-store-ink !outline-none !shadow-none placeholder:text-store-muted" />
                    {requestSearch && <button type="button" onClick={() => changeRequestSearch('')} aria-label={tr('Xóa tìm kiếm')} className="grid size-7 shrink-0 place-items-center rounded-md !border-0 bg-transparent text-store-muted hover:bg-surface-green focus-visible:!bg-surface-green"><X size={16} aria-hidden="true" /></button>}
                </div>
                <ExecutiveSelect value={status} ariaLabel={tr('Trạng thái')} onValueChange={changeStatus}>
                    <option value="">{tr('Tất cả trạng thái')}</option>
                    {requestStatuses.map(value => <option key={value} value={value}>{tr(value)}</option>)}
                </ExecutiveSelect>
            </div>
            <div className="space-y-3" aria-busy={listLoading}>
                {message && <p role="status" className="rounded-lg border border-solid border-success/25 bg-surface-green p-3 text-sm text-success">{message}</p>}
                {listLoading ? <ListSkeleton count={3} lines={3} rowClassName="flex items-center justify-between gap-4 rounded-xl border border-solid border-[#e0e4dc] bg-[#fffefb] p-5 min-h-28" />
                    : data.isError ? <div role="alert" className="rounded-xl border border-solid border-danger-line bg-white p-5 text-sm text-danger-strong">
                        <p>{tr('Không tải được dữ liệu. Vui lòng thử lại.')}</p>
                        <button type="button" onClick={() => void data.refetch()} className="mt-3 rounded-lg border border-solid border-store-line bg-white px-3 py-2 text-store-green hover:bg-surface-green">{tr('Làm mới')}</button>
                    </div>
                    : !data.data?.content.length ? <div className="flex flex-col items-center gap-3 rounded-xl border border-solid border-[#e0e4dc] bg-[#fffefb] px-5 py-12 text-center">
                        <PackageSearch size={32} className="text-store-sage" aria-hidden="true" />
                        <h3 className="font-heading text-base text-store-ink">{tr('Không tìm thấy yêu cầu phù hợp.')}</h3>
                        {(requestSearch || status) && <button type="button" onClick={() => { changeRequestSearch(''); changeStatus(''); }} className="rounded-lg border border-solid border-store-line bg-white px-3 py-2 text-sm font-semibold text-store-green hover:bg-surface-green">{tr('Xóa bộ lọc')}</button>}
                    </div>
                    : data.data.content.map(item => <RequestCard key={item.id} item={item} tr={tr} english={english} onRespond={() => openResponse(item)} onCreate={() => setCreating(item)} />)}
            </div>
            {!waitingForSearch && !data.isError && <Pagination page={page} totalPages={data.data?.totalPages ?? 0} loading={listLoading} onPageChange={setPage} />}
        </section>
        {selected && createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5" onClick={() => { if (!busy) setSelected(null); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="response-title" className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border-2 border-black bg-white p-6" onClick={event => event.stopPropagation()}>
                <div className="flex items-start justify-between gap-4"><div><h2 id="response-title" className="text-xl font-bold">{step === 'choice' ? tr("Phản hồi yêu cầu") : step === 'reject' ? tr("Lý do từ chối") : tr("Xác nhận sản phẩm")}</h2><p className="mt-2 text-sm text-gray-600">{selected.productName}</p></div><button type="button" aria-label={tr("Đóng")} disabled={busy} onClick={() => setSelected(null)} className="rounded border border-black px-3 py-1 hover:bg-gray-100">✕</button></div>
                {step === 'choice' && <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setStep('reject')} className="rounded border border-red-700 px-4 py-2 text-red-700 hover:bg-red-50">{tr("Từ chối")}</button><button type="button" onClick={() => setStep('confirm')} className="rounded bg-store-green px-4 py-2 text-white hover:opacity-90">{tr("Xác nhận")}</button></div>}
                {step === 'reject' && <form onSubmit={event => { event.preventDefault(); void respond('REJECTED'); }}><label className="mt-5 block font-semibold" htmlFor="rejection-reason">{tr("Lý do từ chối *")}</label><textarea id="rejection-reason" required maxLength={2000} value={note} onChange={event => setNote(event.target.value)} className="mt-2 min-h-28 w-full resize-none rounded border border-gray-400 p-3" /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setStep('choice')} disabled={busy} className="rounded border px-4 py-2">{tr("Quay lại")}</button><button type="submit" disabled={busy || !note.trim()} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">{busy ? tr("Đang lưu...") : tr("Xác nhận từ chối")}</button></div></form>}
                {step === 'confirm' && <div className="mt-5"><p className="text-sm text-gray-600">{tr("Chọn sản phẩm đã đăng bán để gửi đúng đường dẫn cho khách hàng.")}</p><form className="mt-4 flex gap-2" onSubmit={event => { event.preventDefault(); setProductPage(0); setSearch(keyword.trim()); }}><input aria-label={tr("Tìm sản phẩm theo tên hoặc SKU")} placeholder={tr("Tìm tên hoặc mã SKU")} value={keyword} onChange={event => setKeyword(event.target.value)} className="min-w-0 flex-1 rounded border border-gray-400 p-2" /><button className="rounded border border-black px-4 py-2" type="submit">{tr("Tìm")}</button></form><div className="mt-3 max-h-56 overflow-y-auto">{loadingProducts ? <ListSkeleton count={3} lines={1} action={false} rowClassName="flex items-center gap-3 border-b py-3" /> : productResults.isError ? <p role="alert" className="text-danger-strong">{tr('Không tải được danh sách sản phẩm.')}</p> : products.length === 0 ? <p>{tr("Không tìm thấy sản phẩm.")}</p> : products.map(product => <label key={product.id} className="flex cursor-pointer items-center gap-3 border-b py-3"><input type="radio" name="product" checked={productId === product.id} onChange={() => setProductId(product.id)} /><span>{english ? product.nameEn || product.nameVi : product.nameVi} <span className="text-sm text-gray-500">· {product.sku}</span></span></label>)}</div><Pagination page={productPage} totalPages={productPages} loading={loadingProducts} onPageChange={setProductPage} /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setStep('choice')} disabled={busy} className="rounded border px-4 py-2">{tr("Quay lại")}</button><button type="button" onClick={() => void respond('ADDED')} disabled={busy || !productId} className="rounded bg-store-green px-4 py-2 text-white disabled:opacity-50">{busy ? tr("Đang lưu...") : tr("Xác nhận")}</button></div></div>}
                {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
            </section>
        </div>, document.body)}
    </LogisticsPageShell>;
}
