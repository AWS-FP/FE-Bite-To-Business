import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Search, X } from 'lucide-react';
import { useExecutiveText } from '@/components/e-commerce/executiveTokens';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';

interface CouponProductPickerProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    disabled?: boolean;
}

const PAGE_SIZE = 8;
const MAX_PRODUCTS = 200;

/** Select published products by name/SKU, never by manually typing UUIDs. */
export default function CouponProductPicker({ selectedIds, onChange, disabled = false }: CouponProductPickerProps) {
    const tr = useExecutiveText();
    const [draft, setDraft] = useState('');
    const [term, setTerm] = useState('');
    const [page, setPage] = useState(0);
    const products = useQuery({
        queryKey: ['ecom', 'coupon-product-picker', term, page],
        queryFn: () => executiveApi.products({ q: term || undefined, status: 'PUBLISHED', page, size: PAGE_SIZE }),
        staleTime: 60_000,
    });
    const rows = products.data?.items ?? [];
    const selected = new Set(selectedIds);

    function doSearch() {
        setTerm(draft.trim());
        setPage(0);
    }
    function toggle(id: string) {
        if (disabled) return;
        if (selected.has(id)) {
            onChange(selectedIds.filter((value) => value !== id));
        } else if (selectedIds.length < MAX_PRODUCTS) {
            onChange([...selectedIds, id]);
        }
    }

    return (
        <div className="space-y-3 rounded-2xl border border-[#d5e6d9] bg-[#f8fbf7] p-4 sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h3 className="text-sm font-extrabold text-[#153e2d]">
                        {tr('Chọn sản phẩm áp dụng', 'Eligible products')}
                    </h3>
                    <p className="mt-1 text-xs text-[#688070]">
                        {tr('Tìm theo tên hoặc SKU, tích để chọn sản phẩm đã đăng bán.', 'Search by name or SKU; select published products.')}
                    </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f2e8] px-3 py-1 text-xs font-bold text-[#1a6b42]">
                    <CheckCircle2 size={14} /> {selectedIds.length}/{MAX_PRODUCTS} {tr('đã chọn', 'selected')}
                </span>
            </div>
            <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#58806a]" size={17} />
                    <input
                        aria-label={tr('Tìm sản phẩm để áp dụng coupon', 'Search eligible products')}
                        className="h-11 w-full rounded-xl border border-[#c9ddce] bg-white pl-10 pr-3 text-sm text-[#153e2d] outline-none transition focus:border-[#248453] focus:ring-2 focus:ring-[#b7dcc6]"
                        placeholder={tr('Ví dụ: Coca-Cola hoặc SKU...', 'e.g. Coca-Cola or SKU...')}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') { event.preventDefault(); doSearch(); }
                        }}
                        disabled={disabled}
                    />
                </div>
                <button type="button" onClick={doSearch} disabled={disabled} className="rounded-xl bg-[#143e2a] px-4 text-sm font-bold text-white transition hover:bg-[#215b3b] disabled:opacity-50">
                    {tr('Tìm', 'Search')}
                </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#dbe9de] bg-white">
                <table className="w-full min-w-[500px] text-left text-sm">
                    <thead className="bg-[#edf5ec] text-xs text-[#4c6956]">
                        <tr>
                            <th className="w-14 px-3 py-3">{tr('Chọn', 'Select')}</th>
                            <th className="px-3 py-3">{tr('Sản phẩm', 'Product')}</th>
                            <th className="px-3 py-3">SKU</th>
                            <th className="px-3 py-3">{tr('Giá niêm yết', 'List price')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf1ed]">
                        {products.isLoading && <tr><td className="px-3 py-5 text-[#6f8475]" colSpan={4}>{tr('Đang tải sản phẩm...', 'Loading products...')}</td></tr>}
                        {products.isError && <tr><td className="px-3 py-5 text-rose-700" colSpan={4}>{tr('Không tải được sản phẩm. Kiểm tra API và thử tìm lại.', 'Could not load products. Check the API and retry.')}</td></tr>}
                        {!products.isLoading && !products.isError && rows.length === 0 && <tr><td className="px-3 py-5 text-[#6f8475]" colSpan={4}>{tr('Không có sản phẩm phù hợp.', 'No matching products.')}</td></tr>}
                        {rows.map((product) => (
                            <tr key={product.id} className={selected.has(product.id) ? 'bg-[#f0f8ef]' : 'hover:bg-[#fafcf9]'}>
                                <td className="px-3 py-3 align-middle">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(product.id)}
                                        onChange={() => toggle(product.id)}
                                        disabled={disabled || (!selected.has(product.id) && selectedIds.length >= MAX_PRODUCTS)}
                                        aria-label={`${tr('Chọn', 'Select')} ${tr(product.nameVi, product.nameEn)}`}
                                        className="size-4 accent-[#17613c]"
                                    />
                                </td>
                                <td className="px-3 py-3 font-semibold text-[#173e2e]">
                                    <div className="flex min-w-0 items-center gap-2">
                                        {product.imageUrl && <img src={product.imageUrl} alt="" className="size-9 shrink-0 rounded-lg border object-contain" />}
                                        <span className="line-clamp-2">{tr(product.nameVi, product.nameEn)}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-3 font-mono text-xs text-[#597263]">{product.sku}</td>
                                <td className="whitespace-nowrap px-3 py-3">{product.listPrice === null ? '—' : `${product.listPrice.toLocaleString('vi-VN')}đ`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {products.data && products.data.totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 text-xs text-[#647866]">
                    <span>{tr('Trang', 'Page')} {page + 1}/{products.data.totalPages}</span>
                    <div className="flex gap-2">
                        <button type="button" className="rounded-lg border border-[#cadbd0] bg-white px-3 py-2 disabled:opacity-40" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>{tr('Trước', 'Previous')}</button>
                        <button type="button" className="rounded-lg border border-[#cadbd0] bg-white px-3 py-2 disabled:opacity-40" disabled={page + 1 >= products.data.totalPages} onClick={() => setPage((p) => p + 1)}>{tr('Sau', 'Next')}</button>
                    </div>
                </div>
            )}
            {selectedIds.length > 0 && (
                <div className="rounded-xl bg-white p-3">
                    <div className="mb-2 text-xs font-bold text-[#54705d]">{tr('Danh sách đã chọn', 'Selected products')}</div>
                    <div className="flex flex-wrap gap-2">
                        {selectedIds.map((id) => {
                            const product = rows.find((item) => item.id === id);
                            return (
                                <button key={id} type="button" disabled={disabled} onClick={() => toggle(id)} title={id} className="inline-flex max-w-full items-center gap-1 rounded-lg border border-[#c6dec8] bg-[#f0f8f0] px-2.5 py-1.5 text-xs font-semibold text-[#245b3d] hover:bg-[#dfeedd]">
                                    <span className="max-w-[210px] truncate">{product ? tr(product.nameVi, product.nameEn) : `${tr('Sản phẩm đã chọn', 'Selected ID')} · ${id.slice(0, 8)}`}</span><X size={13} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
