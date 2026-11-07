import { useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { useEcommerceData } from '@/components/e-commerce/useEcommerceData';
import { CATEGORIES, money, newId, toCsv, type EcommerceProduct, type ProductState } from '@/components/e-commerce/ecommerceData';
import { DemoNotice, Dialog, Empty, Metric, PageTitle, ui } from '@/components/e-commerce/EcommerceUI';

const emptyProduct = (): EcommerceProduct => ({
    id: '', name: '', sku: '', brand: '', category: CATEGORIES[0], unit: 'kg', price: 0,
    stock: 0, state: 'draft', description: '', updatedAt: '', moq: 20, step: 5, volumeTiers: [{ min: 1, price: 0 }],
});

function ProductForm({ original, products, onClose, onSave }: {
    original: EcommerceProduct | null;
    products: EcommerceProduct[];
    onClose: () => void;
    onSave: (product: EcommerceProduct) => void;
}) {
    const [draft, setDraft] = useState<EcommerceProduct>(() => original ? { ...original } : emptyProduct());
    const [error, setError] = useState('');
    const update = <K extends keyof EcommerceProduct>(field: K, value: EcommerceProduct[K]) => setDraft(prev => ({ ...prev, [field]: value }));

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const sku = draft.sku.trim().toUpperCase();
        if (!draft.name.trim() || !sku || !draft.brand.trim() || !draft.unit.trim()) { setError('Vui lòng nhập đủ tên, mã SKU, thương hiệu và đơn vị.'); return; }
        if (products.some(p => p.sku.toLowerCase() === sku.toLowerCase() && p.id !== original?.id)) { setError('Mã SKU đã tồn tại.'); return; }
        if (!Number.isFinite(draft.price) || draft.price <= 0 || !Number.isInteger(draft.stock) || draft.stock < 0) { setError('Giá phải lớn hơn 0 và tồn kho phải là số nguyên không âm.'); return; }
        onSave({ ...draft, id: original?.id ?? newId('prd'), name: draft.name.trim(), sku, brand: draft.brand.trim(), unit: draft.unit.trim(), description: draft.description.trim(), updatedAt: new Date().toISOString().slice(0, 10) });
    }

    return <Dialog title={original ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'} description="Nhập thông tin sản phẩm. Bạn có thể lưu nháp trước khi hiển thị trên gian hàng." onClose={onClose} wide>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={ui.label} htmlFor="prod-name">Tên sản phẩm *</label><input id="prod-name" required maxLength={120} className={ui.input} value={draft.name} onChange={e => update('name', e.target.value)} placeholder="Ví dụ: Cà phê Cold Brew" /></div>
            <div><label className={ui.label} htmlFor="prod-sku">Mã SKU *</label><input id="prod-sku" required maxLength={36} className={ui.input} value={draft.sku} onChange={e => update('sku', e.target.value)} placeholder="BTB-BEV-010" /></div>
            <div><label className={ui.label} htmlFor="prod-brand">Thương hiệu *</label><input id="prod-brand" required maxLength={80} className={ui.input} value={draft.brand} onChange={e => update('brand', e.target.value)} placeholder="Thương hiệu" /></div>
            <div><label className={ui.label} htmlFor="prod-category">Danh mục</label><select id="prod-category" className={ui.select} value={draft.category} onChange={e => update('category', e.target.value)}>{CATEGORIES.map(x => <option key={x}>{x}</option>)}</select></div>
            <div><label className={ui.label} htmlFor="prod-unit">Đơn vị bán *</label><input id="prod-unit" required maxLength={40} className={ui.input} value={draft.unit} onChange={e => update('unit', e.target.value)} placeholder="kg, thùng, chai..." /></div>
            <div><label className={ui.label} htmlFor="prod-price">Giá bán (VNĐ) *</label><input id="prod-price" className={ui.input} required type="number" min="1" step="1000" value={draft.price || ''} onChange={e => update('price', Number(e.target.value))} /></div>
            <div><label className={ui.label} htmlFor="prod-stock">Tồn kho (demo) *</label><input id="prod-stock" className={ui.input} required type="number" min="0" step="1" value={draft.stock} onChange={e => update('stock', Number(e.target.value))} /></div>
            <div><label className={ui.label} htmlFor="prod-state">Hiển thị</label><select id="prod-state" className={ui.select} value={draft.state} onChange={e => update('state', e.target.value as ProductState)}><option value="draft">Bản nháp</option><option value="active">Đang bán</option><option value="hidden">Ẩn sản phẩm</option></select></div>
            <div><label className={ui.label}>MOQ (đơn vị)</label><input type="number" min="1" className={ui.input} value={draft.moq ?? 20} onChange={e => update('moq', Math.max(1, Number(e.target.value)))} /></div>
            <div><label className={ui.label}>Bước số lượng</label><input type="number" min="1" className={ui.input} value={draft.step ?? 5} onChange={e => update('step', Math.max(1, Number(e.target.value)))} /></div>
            <fieldset className="sm:col-span-2 rounded-xl border border-store-line p-3"><legend className="text-xs font-bold text-emerald-700">VOLUME PRICING</legend>{(draft.volumeTiers ?? []).map((tier, i) => <div key={i} className="mt-2 flex gap-2"><label className="flex-1 text-xs">Từ số lượng<input className={ui.input} type="number" min="1" value={tier.min} onChange={e => update('volumeTiers', (draft.volumeTiers ?? []).map((t, j) => j === i ? { ...t, min: Number(e.target.value) } : t))} /></label><label className="flex-1 text-xs">Đơn giá<input className={ui.input} type="number" min="0" value={tier.price} onChange={e => update('volumeTiers', (draft.volumeTiers ?? []).map((t, j) => j === i ? { ...t, price: Number(e.target.value) } : t))} /></label><button type="button" className="px-2 text-red-500" onClick={() => update('volumeTiers', (draft.volumeTiers ?? []).filter((_, j) => j !== i))}>Xóa</button></div>)}<button type="button" className={`${ui.secondary} mt-2`} onClick={() => update('volumeTiers', [...(draft.volumeTiers ?? []), { min: 1, price: draft.price }])}>+ Thêm bậc</button></fieldset>
            <div className="sm:col-span-2"><label className={ui.label} htmlFor="prod-description">Mô tả sản phẩm</label><textarea id="prod-description" rows={3} maxLength={500} className={ui.input} value={draft.description} onChange={e => update('description', e.target.value)} placeholder="Mô tả ngắn về sản phẩm..." /></div>
            <div className="sm:col-span-2 flex items-center gap-3 border border-dashed border-store-line-strong bg-white p-3 text-[11px] text-store-muted"><img src="/images/ui/e-commerce/image-placeholder.svg" alt="" width="40" height="40" />Chưa có ảnh minh họa. Giữ khung ảnh trống, bổ sung ảnh từ thư viện sản phẩm khi có API.</div>
            {error && <p className="sm:col-span-2 text-[12px] font-semibold text-danger" role="alert">{error}</p>}
            <div className="sm:col-span-2 flex justify-end gap-2 border-t border-store-line pt-4"><button className={ui.secondary} type="button" onClick={onClose}>Hủy</button><button className={ui.primary} type="submit">{original ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button></div>
        </form>
    </Dialog>;
}

export default function EcommerceProductsPage() {
    const { data, updateProducts, resetDemo } = useEcommerceData();
    const { products, campaigns, coupons } = data;
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [sort, setSort] = useState('recent');
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<EcommerceProduct | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const pageSize = 6;

    const visible = useMemo(() => products.filter(p => {
        const matchesSearch = `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(search.trim().toLowerCase());
        return matchesSearch && (category === 'all' || p.category === category) && (status === 'all' || p.state === status || (status === 'out-of-stock' && p.stock === 0));
    }).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name, 'vi') : b.updatedAt.localeCompare(a.updatedAt)), [products, search, category, status, sort]);
    const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paged = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const resetPage = () => setPage(1);

    function save(product: EcommerceProduct) {
        updateProducts(list => editing ? list.map(p => p.id === product.id ? product : p) : [product, ...list]);
        setFormOpen(false); setEditing(null); resetPage();
    }
    function remove(product: EcommerceProduct) {
        if (campaigns.some(c => c.productIds.includes(product.id))) { window.alert('Sản phẩm đang được gắn trong chương trình khuyến mãi. Hãy gỡ liên kết trước khi xóa.'); return; }
        if (!window.confirm(`Xóa sản phẩm demo "${product.name}"?`)) return;
        updateProducts(list => list.filter(p => p.id !== product.id));
    }
    function toggle(product: EcommerceProduct) {
        const next: ProductState = product.state === 'active' ? 'hidden' : 'active';
        updateProducts(list => list.map(p => p.id === product.id ? { ...p, state: next, updatedAt: new Date().toISOString().slice(0, 10) } : p));
    }

    return <div className="min-w-0 pb-12">
        <PageTitle eyebrow="01 / QUẢN LÝ DANH MỤC" title="Sản phẩm & gian hàng" description="Cập nhật sản phẩm, giá bán, trạng thái hiển thị và kiểm tra hàng sắp hết để phối hợp cùng Logistics.">
            <button type="button" className={ui.secondary} onClick={() => toCsv(['SKU', 'Sản phẩm', 'Thương hiệu', 'Danh mục', 'Đơn vị', 'Giá', 'Tồn kho', 'Trạng thái'], visible.map(p => [p.sku, p.name, p.brand, p.category, p.unit, p.price, p.stock, p.state]), 'btb-products-demo.csv')}>Xuất CSV</button>
            <button className={ui.primary} type="button" onClick={() => { setEditing(null); setFormOpen(true); }}><img src="/images/ui/e-commerce/plus.svg" alt="" width="16" height="16" /> Thêm sản phẩm</button>
        </PageTitle>
        <DemoNotice />

        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <Metric label="Tổng sản phẩm" value={products.length} note="Trong danh mục demo" icon="box" />
            <Metric label="Đang hiển thị" value={products.filter(p => p.state === 'active').length} note="Có thể xem trên gian hàng" icon="check" tint="bg-surface-green" />
            <Metric label="Sắp hết hàng (≤ 20)" value={products.filter(p => p.stock > 0 && p.stock <= 20).length} note="Cần phối hợp kho" icon="clock" tint="bg-surface-yellow" />
            <Metric label="Hết hàng" value={products.filter(p => p.stock === 0).length} note="Cần cập nhật tồn kho" icon="info" tint="bg-surface-pink" />
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
            <div className={`${ui.panel} flex flex-wrap items-center justify-between gap-4 bg-store-green p-5 text-white`}>
                <div><p className="font-label text-[10px] tracking-[0.2em] text-store-yellow">ĐIỀU PHỐI CÔNG VIỆC</p><h2 className="mt-1 font-display text-[21px] font-bold">Sẵn sàng cho chiến dịch tiếp theo?</h2><p className="mt-1 text-[11px] text-green-100">{campaigns.length} chương trình · {coupons.length} coupon trong workspace demo</p></div>
                <div className="flex flex-wrap gap-2"><Link className="border border-white bg-white px-3 py-2 text-[11px] font-bold text-store-green hover:bg-store-yellow" to={ROUTES.ECOMMERCE_PROMOTIONS}>Xem khuyến mãi</Link><Link className="border border-white px-3 py-2 text-[11px] font-bold text-white hover:bg-white/10" to={ROUTES.ECOMMERCE_COUPONS}>Quản lý coupon</Link></div>
            </div>
            <div className={`${ui.panel} bg-store-cream p-5`}><p className="font-label text-[10px] font-bold tracking-[0.15em] text-store-coral">LƯU Ý VẬN HÀNH</p><h3 className="mt-2 font-display text-[17px] font-bold">Kiểm tra trước khi đăng bán</h3><p className="mt-2 text-[12px] leading-5 text-store-muted">Tên, SKU, giá, tồn kho và trạng thái cần nhất quán. Thay đổi tồn kho thật phải được đồng bộ với Logistics qua API.</p></div>
        </div>

        <section aria-label="Danh mục SKU và bảng giá">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-store-ink bg-white p-4"><div><small className="text-[10px] font-bold tracking-widest text-emerald-700">SOURCE OF TRUTH</small><h2 className="font-display text-lg font-extrabold">Điều hành catalog theo quy chuẩn B2B</h2><p className="text-[11px] text-store-muted">Tồn thực tế cần đồng bộ Logistics; dữ liệu trang này chỉ là demo.</p></div><button className={ui.secondary} onClick={() => { if (window.confirm('Khôi phục dữ liệu E-commerce demo?')) { resetDemo(); setSearch(''); setStatus('all'); setCategory('all'); resetPage() } }}>Khôi phục dữ liệu</button></div>
            <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><label className="relative"><span className="sr-only">Tìm sản phẩm</span><input className={ui.input} placeholder="Tên, SKU, thương hiệu..." value={search} onChange={e => { setSearch(e.target.value); resetPage() }} /></label><select aria-label="Danh mục" className={ui.select} value={category} onChange={e => { setCategory(e.target.value); resetPage() }}><option value="all">Tất cả danh mục</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><select aria-label="Tình trạng" className={ui.select} value={status} onChange={e => { setStatus(e.target.value); resetPage() }}><option value="all">Tất cả</option><option value="active">Đang bán</option><option value="draft">Còn nháp</option><option value="hidden">Ẩn</option><option value="out-of-stock">Hết hàng</option></select><select aria-label="Sắp xếp" className={ui.select} value={sort} onChange={e => setSort(e.target.value)}><option value="recent">Cập nhật mới</option><option value="name">Tên A–Z</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option></select></div>
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{paged.map(p => <article key={p.id} className="overflow-hidden rounded-xl border-2 border-store-ink bg-white shadow-[2px_3px_0_#14132b]"><div className="relative grid h-36 place-items-center bg-[#e5ece9]"><div className="flex flex-col items-center gap-2 text-xs text-slate-400"><img src="/images/ui/e-commerce/image-placeholder.svg" alt="" width="40" height="40" /><span>Ảnh đang cập nhật</span></div><button className="absolute right-2 top-2 rounded-md border bg-white px-2 py-1 text-xs" aria-label={`Chỉnh sửa ${p.name}`} onClick={() => { setEditing(p); setFormOpen(true) }}>✎</button><span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-bold">{p.stock === 0 ? 'Hết hàng' : p.stock <= 20 ? 'Bán chạy · Sắp hết' : p.state === 'draft' ? 'Nháp' : 'Đang bán'}</span></div><div className="p-4"><small className="font-bold text-emerald-700">{p.brand}</small><h3 className="mt-1 min-h-10 font-display text-sm font-extrabold">{p.name}</h3><small className="block font-mono text-slate-400">{p.sku}</small><div className="mt-3 flex justify-between"><strong className="font-price text-lg text-red-600">{money(p.price)}</strong><small className={`font-bold ${p.stock <= 20 ? 'text-red-600' : 'text-emerald-700'}`}>{p.stock} {p.unit}</small></div><div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center text-[10px]"><div><small className="block text-slate-400">Đơn vị</small>{p.unit}</div><div><small className="block text-slate-400">MOQ</small>{p.moq ?? 20}</div><div><small className="block text-slate-400">Bước</small>{p.step ?? 5}</div></div><div className="mt-3 flex gap-2"><button className={`${ui.secondary} flex-1`} onClick={() => { setEditing(p); setFormOpen(true) }}>Sửa</button><button className={`${ui.secondary} flex-1`} onClick={() => toggle(p)}>{p.state === 'active' ? 'Ẩn' : 'Hiện'}</button><button className="rounded border px-2 text-xs text-red-600" onClick={() => remove(p)} aria-label={`Xóa ${p.name}`}>×</button></div></div></article>)}{visible.length === 0 && <Empty text="Không tìm thấy sản phẩm phù hợp." />}</div><div className="mt-4 flex justify-between text-xs"><span>Hiển thị {paged.length}/{visible.length} sản phẩm · Trang {currentPage}/{totalPages}</span><div className="flex gap-2"><button className={ui.secondary} disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>Trước</button><button className={ui.secondary} disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>Tiếp</button></div></div>
        </section>
        {formOpen && <ProductForm original={editing} products={products} onSave={save} onClose={() => { setEditing(null); setFormOpen(false); }} />}
    </div>;
}
