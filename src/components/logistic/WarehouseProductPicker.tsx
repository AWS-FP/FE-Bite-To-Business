import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { Dialog } from '@/components/e-commerce/EcommerceUI';
import ListSkeleton from '@/components/common/ListSkeleton';
import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { getEditableProducts } from '@/services/logistic/warehouseProductService';

export default function WarehouseProductPicker({ onSelect, onClose }: {
    onSelect: (id: string) => void; onClose: () => void;
}) {
    const { tr, english } = useLogisticsText();
    const [keyword, setKeyword] = useState('');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const term = keyword.trim();
    useEffect(() => {
        if (term === query) return;
        const timer = window.setTimeout(() => { setQuery(term); setPage(0); }, 300);
        return () => window.clearTimeout(timer);
    }, [term, query]);
    const enabled = term === query;
    const result = useQuery({
        queryKey: ['logistics', 'editable-products', enabled ? query : null, page],
        queryFn: ({ signal }) => getEditableProducts(query, page, signal),
        enabled,
        staleTime: 30_000,
    });
    const rows = result.data?.items ?? [];
    return (
        <Dialog title={tr('Chọn sản phẩm cần chỉnh sửa')} onClose={onClose} wide>
            <input autoComplete="off" aria-label={tr('Tìm sản phẩm theo tên hoặc SKU')}
                placeholder={tr('Tìm tên hoặc mã SKU')} value={keyword} maxLength={160}
                onChange={e => setKeyword(e.target.value)}
                className="mb-4 w-full rounded border border-store-line bg-white px-3 py-2 text-sm focus:border-store-green" />
            {!enabled || result.isPending ? <ListSkeleton count={5} image lines={2} action={false} /> : result.isError ? (
                <p role="alert" className="py-4 text-red-700">{tr('Không tải được danh sách sản phẩm.')}</p>
            ) : rows.length === 0 ? <p className="py-4 text-store-muted">{tr('Không tìm thấy sản phẩm.')}</p> : (
                <div className="divide-y divide-store-line">
                    {rows.map(product => <button type="button" key={product.id} onClick={() => onSelect(product.id)}
                        className="flex w-full items-center gap-3 rounded px-2 py-3 text-left hover:bg-white focus-visible:bg-white">
                        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded border border-store-line bg-white">
                            {product.imageUrl ? <img src={product.imageUrl} alt="" className="size-full object-contain" loading="lazy" /> : <Package size={20} />}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block break-words text-sm font-semibold">{english ? product.nameEn || product.nameVi : product.nameVi}</span>
                            <span className="text-xs text-store-muted">{product.sku}</span>
                        </span>
                        <span className="shrink-0 rounded bg-white px-2 py-1 text-xs">{tr(product.status === 'DRAFT' ? 'Bản nháp' : 'Đã đăng bán')}</span>
                    </button>)}
                </div>
            )}
            {enabled && result.data && result.data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                    <button type="button" className="rounded border border-store-line bg-white px-3 py-2 disabled:opacity-50" disabled={page === 0} onClick={() => setPage(p => p - 1)}>{tr('Quay lại')}</button>
                    <span>{page + 1} / {result.data.totalPages}</span>
                    <button type="button" className="rounded border border-store-line bg-white px-3 py-2 disabled:opacity-50" disabled={page + 1 >= result.data.totalPages} onClick={() => setPage(p => p + 1)}>{tr('Tiếp tục')}</button>
                </div>
            )}
        </Dialog>
    );
}
