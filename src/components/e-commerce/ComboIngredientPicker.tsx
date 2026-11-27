import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Plus, Search, X } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { executiveComboApi } from '@/services/e-commerce/executiveComboService';
import type { ComboIngredient } from '@/types/e-commerce/executiveCombo';
import { ExecutivePagination } from './ExecutiveControls';
import { ExecutiveError, LoadingRows } from './ExecutiveUI';

export type SelectedIngredient = ComboIngredient & { quantity: string };
export default function ComboIngredientPicker({
    items,
    onChange,
    disabled = false,
}: {
    items: SelectedIngredient[];
    onChange: (items: SelectedIngredient[]) => void;
    disabled?: boolean;
}) {
    const tr = useExecutiveText();
    const [draft, setDraft] = useState('');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(0);
    const query = useQuery({
        queryKey: ['ecom', 'combo-ingredients', q, page],
        queryFn: ({ signal }) => executiveComboApi.ingredients(q, page, signal),
    });
    const search = () => {
        setQ(draft.trim());
        setPage(0);
    };
    const name = (p: ComboIngredient) => tr(p.nameVi, p.nameEn || p.nameVi);
    return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <section className="min-w-0 rounded-xl border border-[#d9e5dc] p-4">
                <h3 className="text-sm font-bold text-store-dark">
                    {tr('Tìm sản phẩm thành phần', 'Find ingredients')}
                </h3>
                <div className="mt-3 flex gap-2">
                    <input
                        aria-label={tr('Tìm theo SKU hoặc tên', 'Search by SKU or name')}
                        placeholder={tr('Tên hoặc SKU', 'Name or SKU')}
                        maxLength={100}
                        className={executiveUi.input}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                setQ(draft.trim());
                                setPage(0);
                            }
                        }}
                    />
                    <button type="button" className={executiveUi.secondary} onClick={search}>
                        <Search size={16} />
                        {tr('Tìm', 'Search')}
                    </button>
                </div>
                <div className="mt-3 max-h-[420px] overflow-y-auto">
                    {query.isPending ? (
                        <LoadingRows />
                    ) : query.isError ? (
                        <ExecutiveError
                            message={tr('Không tải được sản phẩm.', 'Unable to load products.')}
                            retry={() => void query.refetch()}
                        />
                    ) : query.data?.items.length ? (
                        query.data.items.map((p) => {
                            const added = items.some((item) => item.id === p.id);
                            return (
                                <div
                                    key={p.id}
                                    className="flex min-w-0 items-center gap-3 border-b border-[#edf0ea] py-3"
                                >
                                    <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-store-cream">
                                        {p.imageUrl ? (
                                            <img
                                                alt=""
                                                src={p.imageUrl}
                                                loading="lazy"
                                                className="size-full object-contain"
                                            />
                                        ) : (
                                            <Package size={20} />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="m-0 truncate text-sm font-bold"
                                            title={name(p)}
                                        >
                                            {name(p)}
                                        </p>
                                        <p className="m-0 truncate text-xs text-store-muted">
                                            {p.sku} · {p.unitCode} · {tr('Bước', 'Step')}{' '}
                                            {p.quantityStep}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={disabled || added || items.length >= 100}
                                        onClick={() =>
                                            onChange([
                                                ...items,
                                                { ...p, quantity: String(p.quantityStep) },
                                            ])
                                        }
                                        className={executiveUi.secondary}
                                        aria-label={`${tr('Thêm', 'Add')} ${name(p)}`}
                                    >
                                        <Plus size={15} />
                                        {added ? tr('Đã chọn', 'Added') : tr('Thêm', 'Add')}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="py-4 text-sm text-store-muted">
                            {tr('Không tìm thấy sản phẩm.', 'No products found.')}
                        </p>
                    )}
                </div>
                {query.data && (
                    <ExecutivePagination
                        page={page}
                        totalPages={query.data.totalPages}
                        onChange={setPage}
                        tr={tr}
                    />
                )}
            </section>
            <section className="min-w-0 rounded-xl border border-[#d9e5dc] bg-[#f7faf7] p-4">
                <h3 className="text-sm font-bold text-store-dark">
                    {tr('Thành phần đã chọn', 'Selected ingredients')} ({items.length})
                </h3>
                <p className="mt-1 text-xs text-store-muted">
                    {tr(
                        'Số lượng cho một combo phải dương và đúng bước số lượng, không áp dụng MOQ bán riêng.',
                        'Quantity per combo must be positive and follow the quantity increment, independent of standalone MOQ.',
                    )}
                </p>
                {!items.length && (
                    <p className="py-6 text-sm text-store-muted">
                        {tr('Chưa chọn sản phẩm.', 'No ingredients selected.')}
                    </p>
                )}
                <div className="max-h-[480px] space-y-2 overflow-y-auto">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-[#d9e5dc] bg-white p-3"
                        >
                            <div className="flex items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <p className="m-0 break-words text-sm font-bold">
                                        {name(item)}
                                    </p>
                                    <p className="m-0 text-xs text-store-muted">
                                        {item.sku} · {item.unitCode} · {tr('Bước', 'Step')}{' '}
                                        {item.quantityStep}
                                    </p>
                                    {item.status !== 'PUBLISHED' && (
                                        <p className="m-0 text-xs text-red-700">
                                            {tr(
                                                'Sản phẩm không còn được đăng bán.',
                                                'Product is no longer published.',
                                            )}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => onChange(items.filter((p) => p.id !== item.id))}
                                    className="rounded-lg p-1 text-red-700 hover:bg-red-50"
                                    aria-label={`${tr('Bỏ', 'Remove')} ${name(item)}`}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <label className="mt-2 block text-xs font-semibold">
                                {tr('Số lượng', 'Quantity')}
                                <input
                                    required
                                    disabled={disabled}
                                    className={`${executiveUi.input} mt-1`}
                                    type="number"
                                    min={item.quantityStep}
                                    step={item.quantityStep}
                                    max={999999999}
                                    value={item.quantity}
                                    onChange={(e) =>
                                        onChange(
                                            items.map((p) =>
                                                p.id === item.id
                                                    ? { ...p, quantity: e.target.value }
                                                    : p,
                                            ),
                                        )
                                    }
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
