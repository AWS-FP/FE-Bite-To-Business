import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Package, RefreshCw, Search, X, Plus, Trash2, Save } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { executiveUi, useExecutiveText } from '@/components/e-commerce/executiveTokens';
import {
    ExecutiveBadge,
    ExecutiveFeedback,
    ExecutivePagination,
    ExecutiveSelect,
} from '@/components/e-commerce/ExecutiveControls';
import {
    ExecutiveEmpty,
    ExecutiveError,
    ExecutiveHeading,
    ExecutivePanel,
    LoadingRows,
} from '@/components/e-commerce/ExecutiveUI';
import {
    executiveApi,
    type AdminProduct,
    type PricingWrite,
} from '@/services/e-commerce/executiveAdminService';
import {
    formatVnd,
    getExecutiveVat,
    updateExecutiveVat,
} from '@/services/e-commerce/executiveReadService';
import { getCatalogBrands } from '@/services/customer/catalogReadService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';

function ProductDrawer({
    product,
    category,
    brand,
    onClose,
}: {
    product: AdminProduct;
    category: string;
    brand: string;
    onClose: () => void;
}) {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const pricing = useQuery({
        queryKey: ['ecom', 'product-pricing', product.id],
        queryFn: () => executiveApi.productPricing(product.id),
    });
    const vat = useQuery({
        queryKey: ['ecom', 'vat', product.id],
        queryFn: () => getExecutiveVat(product.id),
    });
    const [editing, setEditing] = useState<PricingWrite | null>(null);
    const [localStatus, setLocalStatus] = useState(product.status);
    const [vatInput, setVatInput] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [failed, setFailed] = useState(false);
    const tiers = editing?.tiers ?? pricing.data?.priceTiers ?? [];
    const makeDraft = (): PricingWrite => ({
        listPrice: pricing.data?.listPrice ?? 0,
        salePrice: pricing.data?.salePrice ?? null,
        saleDiscountPercent:
            pricing.data?.salePrice != null ? null : (pricing.data?.saleDiscountPercent ?? null),
        tiers: pricing.data?.priceTiers.map((t) => ({ ...t })) ?? [],
    });
    const pricingSave = useMutation({
        mutationFn: (payload: PricingWrite) => executiveApi.savePricing(product.id, payload),
        onSuccess: (saved) => {
            qc.setQueryData(['ecom', 'product-pricing', product.id], saved);
            setEditing(null);
            setFeedback(tr('Đã lưu giá sản phẩm.', 'Product prices saved.'));
            setFailed(false);
            void qc.invalidateQueries({ queryKey: ['ecom', 'product-pricing', product.id] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'products'] });
        },
        onError: (error) => {
            setFailed(true);
            setFeedback(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không lưu được giá: kiểm tra MOQ, giá niêm yết và các bậc giá. Các bậc đã được báo giá sử dụng không thể xóa.',
                        'Unable to save prices: verify MOQ, list price and tiers. Referenced tiers cannot be removed.',
                    ),
                ),
            );
        },
    });
    const vatSave = useMutation({
        mutationFn: (rate: number) => updateExecutiveVat(product.id, rate),
        onSuccess: () => {
            setFeedback(tr('Đã cập nhật VAT.', 'VAT saved.'));
            setFailed(false);
            void qc.invalidateQueries({ queryKey: ['ecom', 'vat', product.id] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'products'] });
        },
        onError: () => {
            setFailed(true);
            setFeedback(tr('Không thể lưu VAT.', 'VAT update failed.'));
        },
    });
    const statusSave = useMutation({
        mutationFn: (status: string) => executiveApi.setProductStatus(product.id, status),
        onSuccess: (_, status) => {
            setLocalStatus(status as AdminProduct['status']);
            setFeedback(tr('Đã cập nhật trạng thái sản phẩm.', 'Publication status updated.'));
            setFailed(false);
            void qc.invalidateQueries({ queryKey: ['ecom', 'products'] });
        },
        onError: () => {
            setFailed(true);
            setFeedback(
                tr(
                    'Không đổi được trạng thái. Kiểm tra giá và thông tin sản phẩm.',
                    'Could not change status. Check required product details and pricing.',
                ),
            );
        },
    });
    const changeTier = (
        index: number,
        key: 'minQuantity' | 'maxQuantity' | 'unitPrice',
        value: string,
    ) =>
        setEditing((prev) => {
            const draft = prev ?? makeDraft();
            return {
                ...draft,
                tiers: draft.tiers.map((item, i) =>
                    i === index
                        ? {
                              ...item,
                              [key]: value === '' && key === 'maxQuantity' ? null : Number(value),
                          }
                        : item,
                ),
            };
        });
    const selectStatus = (status: string) => {
        if (
            status !== localStatus &&
            window.confirm(
                tr(
                    `Chuyển trạng thái ${product.sku} thành ${status}?`,
                    `Change ${product.sku} to ${status}?`,
                ),
            )
        )
            statusSave.mutate(status);
    };
    return (
        <div
            className="fixed inset-0 z-[175] flex justify-end bg-black/50"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-label={tr('Chi tiết quản trị sản phẩm', 'Product management details')}
                className="flex h-dvh w-full max-w-[650px] flex-col bg-[#faf7ec] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b bg-white px-6 py-5">
                    <div className="flex items-center gap-4">
                        {product.imageUrl ? (
                            <img
                                alt=""
                                src={product.imageUrl}
                                className="size-16 rounded-xl border object-contain"
                            />
                        ) : (
                            <Package size={32} />
                        )}
                        <div>
                            <span className="text-xs font-bold uppercase text-[#648772]">
                                {product.sku}
                            </span>
                            <h2 className="mt-1 max-w-[420px] text-lg font-black">
                                {tr(product.nameVi, product.nameEn)}
                            </h2>
                            <p className="mt-1 text-xs text-[#6d7f71]">
                                {brand} · {category} · {product.unitCode}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label={tr('Đóng', 'Close')}
                        className="rounded-xl border bg-white p-2"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
                    <ExecutiveFeedback message={feedback} error={failed} />
                    <section className="rounded-2xl border border-[#dde8dc] bg-white p-5">
                        <h3 className="mb-3 font-bold">
                            {tr('Thông tin hàng hóa', 'Product information')}
                        </h3>
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-xs text-[#748577]">
                                    {tr('Quy cách', 'Packaging')}
                                </dt>
                                <dd className="font-semibold">
                                    {tr(product.packageSpecVi ?? '—', product.packageSpecEn ?? '—')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-[#748577]">
                                    {tr('Xuất xứ', 'Origin')}
                                </dt>
                                <dd className="font-semibold">{product.origin || '—'}</dd>
                            </div>
                        </dl>
                        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#536958]">
                            {tr(product.descriptionVi ?? '', product.descriptionEn ?? '') || '—'}
                        </p>
                    </section>
                    <section className="rounded-2xl border border-[#dde8dc] bg-white p-5">
                        <h3 className="mb-4 font-bold">
                            {tr('Trạng thái & thông số', 'Status and specifications')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-xs text-[#728576]">MOQ</span>
                                <strong className="block">
                                    {product.minOrderQuantity} {product.unitCode}
                                </strong>
                            </div>
                            <div>
                                <span className="text-xs text-[#728576]">
                                    {tr('Bước số lượng', 'Quantity step')}
                                </span>
                                <strong className="block">{product.quantityStep}</strong>
                            </div>
                            <div>
                                <span className="text-xs text-[#728576]">
                                    {tr('Ngày cập nhật', 'Updated')}
                                </span>
                                <strong className="block">
                                    {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                                </strong>
                            </div>
                            <div>
                                <span className="text-xs text-[#728576]">
                                    {tr('VAT (%)', 'VAT (%)')}
                                </span>
                                <strong className="block">{product.vatRate ?? '—'}</strong>
                            </div>
                        </div>
                        <ExecutiveSelect
                            label={tr('Trạng thái sản phẩm', 'Publication status')}
                            value={localStatus}
                            onValueChange={selectStatus}
                            disabled={statusSave.isPending}
                            className="mt-4"
                        >
                            <option value="DRAFT">DRAFT</option>
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                        </ExecutiveSelect>
                    </section>
                    <section className="rounded-2xl border border-[#dde8dc] bg-white p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h3 className="font-bold">
                                {tr('Giá bán & bảng giá sỉ', 'Prices and wholesale tiers')}
                            </h3>
                            {!editing && pricing.data && pricing.data.listPrice != null && (
                                <button
                                    type="button"
                                    className={executiveUi.secondary}
                                    onClick={() => setEditing(makeDraft())}
                                >
                                    {tr('Chỉnh sửa', 'Edit')}
                                </button>
                            )}
                        </div>
                        {pricing.isLoading ? (
                            <LoadingRows />
                        ) : pricing.isError ? (
                            <ExecutiveError
                                message={tr(
                                    'Không tải được giá bán.',
                                    'Failed to load product pricing.',
                                )}
                            />
                        ) : (
                            pricing.data && (
                                <>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <label className="text-xs font-semibold">
                                            {tr('Giá niêm yết (VND)', 'List price (VND)')}
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                readOnly
                                                aria-readonly="true"
                                                title={tr(
                                                    'Giá niêm yết do bộ phận quản lý danh mục thiết lập. E-commerce không được thay đổi.',
                                                    'List price is maintained by catalog administrators; E-commerce cannot edit it.',
                                                )}
                                                className={`${executiveUi.input} mt-2 !cursor-not-allowed !border-[#d7e0d5] !bg-[#edf2ec] !text-[#697a6e]`}
                                                value={pricing.data.listPrice ?? ''}
                                            />
                                        </label>
                                        <label className="text-xs font-semibold">
                                            {tr('Giá sale (VND)', 'Sale price (VND)')}
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                disabled={!editing}
                                                className={`${executiveUi.input} mt-2`}
                                                value={
                                                    editing
                                                        ? (editing.salePrice ?? '')
                                                        : (pricing.data.salePrice ?? '')
                                                }
                                                onChange={(e) =>
                                                    setEditing((prev) => ({
                                                        ...(prev ?? makeDraft()),
                                                        salePrice:
                                                            e.target.value === ''
                                                                ? null
                                                                : Number(e.target.value),
                                                        saleDiscountPercent: null,
                                                    }))
                                                }
                                            />
                                        </label>
                                    </div>
                                    {pricing.data.listPrice == null && (
                                        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                                            {tr(
                                                'Sản phẩm chưa được thiết lập giá niêm yết. E-commerce không được tạo giá niêm yết; hãy liên hệ bộ phận quản lý danh mục.',
                                                'This product has no list price. E-commerce cannot set list prices; contact catalog management.',
                                            )}
                                        </p>
                                    )}
                                    <p className="mt-3 text-xs text-[#6e8272]">
                                        {tr(
                                            'Giá niêm yết chỉ để xem, không thể chỉnh sửa bằng tài khoản E-commerce. Giá sale để trống nếu không áp dụng.',
                                            'List price is read-only for E-commerce. Leave sale price empty when unused.',
                                        )}
                                    </p>
                                    <div className="mt-5 overflow-x-auto">
                                        <table className="w-full min-w-[400px] text-left text-xs">
                                            <thead>
                                                <tr className="border-b text-[#668071]">
                                                    <th className="pb-3">{tr('Từ SL', 'From')}</th>
                                                    <th>{tr('Đến SL', 'To')}</th>
                                                    <th>{tr('Đơn giá', 'Unit price')}</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tiers.map((tier, i) => (
                                                    <tr
                                                        key={tier.id ?? i}
                                                        className="border-b border-[#edf1eb]"
                                                    >
                                                        <td className="py-2">
                                                            <input
                                                                aria-label={`Tier ${i + 1} min`}
                                                                disabled={!editing}
                                                                type="number"
                                                                step="any"
                                                                min="0.01"
                                                                value={tier.minQuantity}
                                                                onChange={(e) =>
                                                                    changeTier(
                                                                        i,
                                                                        'minQuantity',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                className={`${executiveUi.input} !h-9 !w-[105px]`}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                aria-label={`Tier ${i + 1} max`}
                                                                disabled={!editing}
                                                                type="number"
                                                                step="any"
                                                                min="0"
                                                                value={tier.maxQuantity ?? ''}
                                                                placeholder="∞"
                                                                onChange={(e) =>
                                                                    changeTier(
                                                                        i,
                                                                        'maxQuantity',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                className={`${executiveUi.input} !h-9 !w-[105px]`}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                aria-label={`Tier ${i + 1} price`}
                                                                disabled={!editing}
                                                                type="number"
                                                                step="1"
                                                                min="0"
                                                                value={tier.unitPrice}
                                                                onChange={(e) =>
                                                                    changeTier(
                                                                        i,
                                                                        'unitPrice',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                className={`${executiveUi.input} !h-9 !w-[125px]`}
                                                            />
                                                        </td>
                                                        <td>
                                                            {editing && (
                                                                <button
                                                                    type="button"
                                                                    aria-label={tr(
                                                                        'Xóa bậc giá',
                                                                        'Remove tier',
                                                                    )}
                                                                    onClick={() =>
                                                                        setEditing((prev) => ({
                                                                            ...(prev ??
                                                                                makeDraft()),
                                                                            tiers: (
                                                                                prev ?? makeDraft()
                                                                            ).tiers.filter(
                                                                                (_, j) => i !== j,
                                                                            ),
                                                                        }))
                                                                    }
                                                                    className="rounded-lg p-2 text-rose-600"
                                                                >
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {editing && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                className={executiveUi.secondary}
                                                onClick={() =>
                                                    setEditing((prev) => ({
                                                        ...(prev ?? makeDraft()),
                                                        tiers: [
                                                            ...(prev ?? makeDraft()).tiers,
                                                            {
                                                                minQuantity:
                                                                    product.minOrderQuantity,
                                                                maxQuantity: null,
                                                                unitPrice: 0,
                                                            },
                                                        ],
                                                    }))
                                                }
                                            >
                                                <Plus size={16} />
                                                {tr('Thêm bậc giá', 'Add tier')}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    pricingSave.isPending ||
                                                    !Number.isFinite(editing.listPrice) ||
                                                    editing.listPrice < 0
                                                }
                                                className={executiveUi.button}
                                                onClick={() => {
                                                    const ordered = [...editing.tiers].sort(
                                                        (a, b) => a.minQuantity - b.minQuantity,
                                                    );
                                                    const invalid = ordered.some(
                                                        (tier, i) =>
                                                            !Number.isFinite(tier.minQuantity) ||
                                                            !Number.isFinite(tier.unitPrice) ||
                                                            tier.minQuantity <
                                                                product.minOrderQuantity ||
                                                            (tier.minQuantity -
                                                                product.minOrderQuantity) %
                                                                product.quantityStep !==
                                                                0 ||
                                                            tier.unitPrice < 0 ||
                                                            !Number.isInteger(tier.unitPrice) ||
                                                            (tier.maxQuantity !== null &&
                                                                (tier.maxQuantity <
                                                                    tier.minQuantity ||
                                                                    !Number.isFinite(
                                                                        tier.maxQuantity,
                                                                    ))) ||
                                                            (i > 0 &&
                                                                (ordered[i - 1].maxQuantity ===
                                                                    null ||
                                                                    tier.minQuantity <=
                                                                        (ordered[i - 1]
                                                                            .maxQuantity ??
                                                                            Infinity))),
                                                    );
                                                    if (
                                                        invalid ||
                                                        (editing.salePrice !== null &&
                                                            editing.salePrice >= editing.listPrice)
                                                    ) {
                                                        setFailed(true);
                                                        setFeedback(
                                                            tr(
                                                                'Bảng giá không hợp lệ: bậc giá phải tăng, không chồng lấn, đúng MOQ/bước số lượng; giá sale phải thấp hơn giá niêm yết.',
                                                                'Invalid tiers: ranges must increase without overlap, match MOQ/step, and sale price must be below list price.',
                                                            ),
                                                        );
                                                        return;
                                                    }
                                                    setFailed(false);
                                                    setFeedback('');
                                                    pricingSave.mutate({
                                                        ...editing,
                                                        listPrice:
                                                            pricing.data.listPrice ??
                                                            editing.listPrice,
                                                        tiers: ordered,
                                                    });
                                                }}
                                            >
                                                <Save size={16} />
                                                {pricingSave.isPending
                                                    ? tr('Đang lưu...', 'Saving...')
                                                    : tr('Lưu bảng giá', 'Save pricing')}
                                            </button>
                                            <button
                                                type="button"
                                                className={executiveUi.secondary}
                                                onClick={() => setEditing(null)}
                                            >
                                                {tr('Hủy', 'Cancel')}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )
                        )}
                    </section>
                    <form
                        className="rounded-2xl border border-[#dde8dc] bg-white p-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (window.confirm(tr('Lưu thuế suất VAT mới?', 'Save new VAT rate?')))
                                vatSave.mutate(Number(vatInput ?? vat.data?.vatRate));
                        }}
                    >
                        <h3 className="mb-4 font-bold">{tr('Thuế VAT', 'VAT rate')}</h3>
                        {vat.isLoading ? (
                            <LoadingRows />
                        ) : (
                            <div className="flex flex-wrap items-end gap-3">
                                <label className="flex-1 text-xs font-semibold">
                                    {tr('Thuế suất (%)', 'VAT rate (%)')}
                                    <input
                                        aria-label="VAT"
                                        className={`${executiveUi.input} mt-2`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={vatInput ?? vat.data?.vatRate ?? ''}
                                        onChange={(e) => setVatInput(e.target.value)}
                                    />
                                </label>
                                <button
                                    className={executiveUi.button}
                                    type="submit"
                                    disabled={
                                        vatSave.isPending ||
                                        vat.isError ||
                                        vatInput === '' ||
                                        !Number.isFinite(Number(vatInput ?? vat.data?.vatRate)) ||
                                        Number(vatInput ?? vat.data?.vatRate) < 0 ||
                                        Number(vatInput ?? vat.data?.vatRate) > 100
                                    }
                                >
                                    {tr('Lưu VAT', 'Save VAT')}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
                <div className="flex justify-end border-t bg-white p-4">
                    <button type="button" className={executiveUi.secondary} onClick={onClose}>
                        {tr('Đóng', 'Close')}
                    </button>
                </div>
            </section>
        </div>
    );
}
export default function EcommerceProductsPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [params, setParams] = useSearchParams();
    const q = params.get('q') ?? '';
    const [draft, setDraft] = useState(q),
        [status, setStatus] = useState(''),
        [page, setPage] = useState(0),
        [selected, setSelected] = useState<AdminProduct | null>(null);
    const products = useQuery({
        queryKey: ['ecom', 'products', q, status, page],
        queryFn: () =>
            executiveApi.products({
                q: q || undefined,
                status: status || undefined,
                page,
                size: 20,
            }),
    });
    const brands = useQuery({ queryKey: ['ecom', 'brands'], queryFn: () => getCatalogBrands() });
    const categories = useQuery({
        queryKey: ['ecom', 'categories'],
        queryFn: () => getHomeCategories(),
    });
    const brandMap = new Map(brands.data?.map((b) => [b.id, b.name]));
    const categoryMap = new Map<string, HomeCategory>();
    const add = (items: HomeCategory[]) =>
        items.forEach((item) => {
            categoryMap.set(item.id, item);
            add(item.children);
        });
    add(categories.data ?? []);
    const rows = products.data?.items ?? [];
    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="02"
                eyebrow="CATALOG / PRICING"
                title={tr('Quản lý sản phẩm', 'Product management')}
                description={tr(
                    'Toàn bộ sản phẩm, giá bán, giá sỉ, trạng thái và VAT.',
                    'Manage all products, selling prices, wholesale tiers, publication status and VAT.',
                )}
                action={
                    <button
                        className={executiveUi.secondary}
                        type="button"
                        onClick={() =>
                            void qc.invalidateQueries({ queryKey: ['ecom', 'products'] })
                        }
                    >
                        <RefreshCw size={16} />
                        {tr('Làm mới', 'Refresh')}
                    </button>
                }
            />
            <ExecutivePanel
                title={tr('Danh mục sản phẩm', 'Product catalog')}
                caption={
                    products.data
                        ? `${products.data.total.toLocaleString('vi-VN')} ${tr('sản phẩm', 'products')}`
                        : ''
                }
            >
                <form
                    className="grid gap-3 p-5 sm:grid-cols-[minmax(220px,1fr)_190px_auto]"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setPage(0);
                        setParams(draft.trim() ? { q: draft.trim() } : {});
                    }}
                >
                    <div className="relative">
                        <Search size={17} className="absolute left-4 top-3.5 text-[#64866e]" />
                        <input
                            className={`${executiveUi.input} !pl-11`}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder={tr(
                                'Tìm SKU hoặc tên sản phẩm...',
                                'Search SKU or product name...',
                            )}
                            aria-label={tr('Tìm sản phẩm', 'Search products')}
                        />
                    </div>
                    <ExecutiveSelect
                        value={status}
                        ariaLabel={tr('Trạng thái', 'Status')}
                        onValueChange={(value) => {
                            setStatus(value);
                            setPage(0);
                        }}
                    >
                        <option value="">{tr('Tất cả trạng thái', 'All statuses')}</option>
                        {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </ExecutiveSelect>
                    <button type="submit" className={executiveUi.button}>
                        <Search size={16} />
                        {tr('Tìm kiếm', 'Search')}
                    </button>
                </form>
                {products.isLoading ? (
                    <LoadingRows />
                ) : products.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={tr(
                                'Không tải được danh mục quản trị. Kiểm tra token E-commerce.',
                                'Unable to load executive catalog. Check your role/session.',
                            )}
                            retry={() => void products.refetch()}
                        />
                    </div>
                ) : !rows.length ? (
                    <ExecutiveEmpty
                        title={tr('Không có sản phẩm phù hợp', 'No matching products')}
                        description={tr('Hãy thử bộ lọc khác.', 'Try a different filter.')}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
                            <thead>
                                <tr>
                                    {[
                                        tr('Sản phẩm', 'Product'),
                                        'SKU',
                                        tr('Thương hiệu / danh mục', 'Brand / category'),
                                        tr('Giá niêm yết / Sale', 'List / sale'),
                                        tr('Đơn vị / MOQ', 'Unit / MOQ'),
                                        'VAT',
                                        tr('Trạng thái', 'Status'),
                                        tr('Thao tác', 'Action'),
                                    ].map((h) => (
                                        <th key={h} className={executiveUi.th}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((p) => (
                                    <tr key={p.id} className="hover:bg-[#f7fbf7]">
                                        <td className={executiveUi.td}>
                                            <div className="flex min-w-[200px] items-center gap-3">
                                                {p.imageUrl ? (
                                                    <img
                                                        alt=""
                                                        src={p.imageUrl}
                                                        loading="lazy"
                                                        className="size-12 rounded-xl border object-contain"
                                                    />
                                                ) : (
                                                    <span className="grid size-12 place-items-center rounded-xl bg-[#eef4eb]">
                                                        <Package size={18} />
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    <strong className="line-clamp-2">
                                                        {tr(p.nameVi, p.nameEn)}
                                                    </strong>
                                                    <span className="mt-1 block text-[11px] text-[#6d8575]">
                                                        {tr(
                                                            p.packageSpecVi ?? '—',
                                                            p.packageSpecEn ?? '—',
                                                        )}
                                                    </span>
                                                    <span className="mt-1 block text-[11px] text-[#829789]">
                                                        {tr('Cập nhật', 'Updated')}:{' '}
                                                        {new Date(p.updatedAt).toLocaleDateString(
                                                            'vi-VN',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            className={`${executiveUi.td} max-w-[160px] break-all font-mono text-xs`}
                                        >
                                            {p.sku}
                                        </td>
                                        <td className={executiveUi.td}>
                                            <strong className="block text-xs">
                                                {brandMap.get(p.brandId ?? '') ?? '—'}
                                            </strong>
                                            <span className="mt-1 block text-xs text-[#6e8274]">
                                                {tr(
                                                    categoryMap.get(p.categoryId ?? '')?.nameVi ??
                                                        '—',
                                                    categoryMap.get(p.categoryId ?? '')?.nameEn ??
                                                        '—',
                                                )}
                                            </span>
                                        </td>
                                        <td className={executiveUi.td}>
                                            <strong className="block">
                                                {formatVnd(p.listPrice)}
                                            </strong>
                                            <span className="text-xs text-[#2d7651]">
                                                {p.salePrice != null ? formatVnd(p.salePrice) : '—'}
                                            </span>
                                        </td>
                                        <td className={executiveUi.td}>
                                            <strong>{p.unitCode}</strong>
                                            <span className="block text-xs text-[#6b8874]">
                                                MOQ {p.minOrderQuantity}
                                            </span>
                                        </td>
                                        <td className={executiveUi.td}>
                                            {p.vatRate == null ? '—' : `${p.vatRate}%`}
                                        </td>
                                        <td className={executiveUi.td}>
                                            <ExecutiveBadge status={p.status} />
                                        </td>
                                        <td className={executiveUi.td}>
                                            <button
                                                type="button"
                                                className={executiveUi.secondary}
                                                onClick={() => setSelected(p)}
                                            >
                                                <ClipboardList size={16} />
                                                {tr('Chi tiết', 'Details')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {products.data && (
                    <ExecutivePagination
                        page={page}
                        totalPages={products.data.totalPages}
                        onChange={setPage}
                        tr={tr}
                    />
                )}
            </ExecutivePanel>
            {selected && (
                <ProductDrawer
                    key={selected.id}
                    product={selected}
                    category={tr(
                        categoryMap.get(selected.categoryId ?? '')?.nameVi ?? '—',
                        categoryMap.get(selected.categoryId ?? '')?.nameEn ?? '—',
                    )}
                    brand={brandMap.get(selected.brandId ?? '') ?? '—'}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
