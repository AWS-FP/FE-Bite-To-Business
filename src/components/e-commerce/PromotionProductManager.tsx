import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronLeft, ChevronRight, Filter, Package, Search, Tag, X } from 'lucide-react';
import { executiveUi, useExecutiveText } from './executiveTokens';
import {
    executiveApi,
    type Promotion,
    type PromotionPriceUpdate,
    type PromotionProductChoice,
    type PromotionProductFilter,
} from '@/services/e-commerce/executiveAdminService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import { getCatalogBrands } from '@/services/customer/catalogReadService';
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';

const PAGE_SIZE = 20;
const MAX_ASSIGNED = 2000;
const money = (amount: number | null) =>
    amount === null ? '—' : `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
const numeric = (value: string) =>
    value.trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : NaN;

/** Keep IDs in React state, not in page data, so search and paging cannot lose unsaved selections. */
export default function PromotionProductManager({
    campaign,
    onClose,
    onSaved,
}: {
    campaign: Promotion;
    onClose: () => void;
    onSaved: () => void;
}) {
    const tr = useExecutiveText();
    const qc = useQueryClient();
    const flash = campaign.promotionType === 'FLASH_SALE';
    const [search, setSearch] = useState('');
    const [brandId, setBrandId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [discountOnly, setDiscountOnly] = useState(false);
    const [page, setPage] = useState(0);
    const [tab, setTab] = useState<'browse' | 'selected'>('browse');
    const [selectedSearch, setSelectedSearch] = useState('');
    const [selectedPage, setSelectedPage] = useState(0);
    const [selection, setSelection] = useState<string[] | null>(null);
    const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
    const [bulkMode, setBulkMode] = useState<'PERCENT' | 'AMOUNT'>('PERCENT');
    const [bulkAmount, setBulkAmount] = useState('10');
    const [bulkScope, setBulkScope] = useState<'MATCHING' | 'ALL'>('MATCHING');
    const [feedback, setFeedback] = useState('');
    const [bulkFeedback, setBulkFeedback] = useState('');

    const filter = useMemo<PromotionProductFilter>(
        () => ({
            q: search.trim(),
            brandId: brandId || null,
            categoryId: categoryId || null,
            inStockOnly,
            discountOnly,
        }),
        [search, brandId, categoryId, inStockOnly, discountOnly],
    );
    const assigned = useQuery({
        queryKey: ['ecom', 'promotion-product-ids', campaign.id],
        queryFn: () => executiveApi.promotionProductIds(campaign.id),
    });
    const products = useQuery({
        queryKey: ['ecom', 'promotion-product-options', campaign.id, filter, page],
        queryFn: () => executiveApi.promotionProductOptions(campaign.id, filter, page, PAGE_SIZE),
    });
    const brands = useQuery({ queryKey: ['ecom', 'brands'], queryFn: () => getCatalogBrands() });
    const categories = useQuery({
        queryKey: ['ecom', 'categories'],
        queryFn: () => getHomeCategories(),
    });
    const flatCategories = useMemo(() => {
        const output: { id: string; vi: string; en: string; depth: number }[] = [];
        function collect(items: HomeCategory[], depth: number) {
            for (const item of items) {
                output.push({ id: item.id, vi: item.nameVi, en: item.nameEn, depth });
                collect(item.children ?? [], depth + 1);
            }
        }
        collect(categories.data ?? [], 0);
        return output;
    }, [categories.data]);
    const selected = selection ?? assigned.data ?? [];
    const selectedKey = selected.join(',');
    const selectedSet = new Set(selected);
    const selectedDetails = useQuery({
        queryKey: ['ecom', 'promotion-selected-details', campaign.id, selectedKey],
        queryFn: () => executiveApi.promotionProductDetails(campaign.id, selected),
        enabled: assigned.isSuccess && selected.length > 0,
    });
    const details = useMemo(
        () => (selected.length ? (selectedDetails.data ?? []) : []),
        [selected.length, selectedDetails.data],
    );
    const filteredDetails = useMemo(
        () =>
            details.filter((item) => {
                const q = selectedSearch.trim().toLocaleLowerCase();
                return (
                    !q ||
                    [item.nameVi, item.nameEn, item.sku].some((name) =>
                        name.toLocaleLowerCase().includes(q),
                    )
                );
            }),
        [details, selectedSearch],
    );
    const selectedTotalPages = Math.max(1, Math.ceil(filteredDetails.length / PAGE_SIZE));
    const actualSelectedPage = Math.min(selectedPage, selectedTotalPages - 1);
    const visibleDetails = filteredDetails.slice(
        actualSelectedPage * PAGE_SIZE,
        (actualSelectedPage + 1) * PAGE_SIZE,
    );
    const detailMap = useMemo(() => new Map(details.map((item) => [item.id, item])), [details]);
    const membershipChanged =
        assigned.data !== undefined &&
        (selected.length !== assigned.data.length ||
            selected.some((id) => !assigned.data.includes(id)));

    const changes: PromotionPriceUpdate[] = [];
    let invalidPrice = false;
    for (const item of details) {
        const raw = priceDrafts[item.id];
        if (raw === undefined) continue;
        const proposed = raw.trim() === '' ? null : numeric(raw);
        if (
            proposed !== null &&
            (!Number.isInteger(proposed) ||
                item.listPrice === null ||
                proposed < 0 ||
                proposed >= item.listPrice)
        ) {
            invalidPrice = true;
            continue;
        }
        if (
            (proposed !== item.salePrice || item.saleDiscountPercent !== null) &&
            item.listPrice !== null
        ) {
            changes.push({
                productId: item.id,
                expectedListPrice: item.listPrice,
                expectedSalePrice: item.salePrice,
                expectedSaleDiscountPercent: item.saleDiscountPercent,
                newSalePrice: proposed,
            });
        }
    }
    const changed = membershipChanged || changes.length > 0;
    const canSave =
        assigned.isSuccess &&
        !selectedDetails.isFetching &&
        !selectedDetails.isError &&
        details.length === selected.length &&
        !invalidPrice &&
        changed;

    const save = useMutation({
        mutationFn: () =>
            executiveApi.savePromotionProducts(campaign.id, selected, changes, assigned.data ?? []),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['ecom', 'promotion-product-ids', campaign.id] });
            void qc.invalidateQueries({
                queryKey: ['ecom', 'promotion-product-options', campaign.id],
            });
            void qc.invalidateQueries({
                queryKey: ['ecom', 'promotion-selected-details', campaign.id],
            });
            void qc.invalidateQueries({ queryKey: ['ecom', 'promotions'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'images-promotions'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'products'] });
            for (const change of changes)
                void qc.invalidateQueries({
                    queryKey: ['ecom', 'product-pricing', change.productId],
                });
            onSaved();
            onClose();
        },
        onError: (error) =>
            setFeedback(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không lưu được. Kiểm tra giá sale, tồn kho, MOQ và trạng thái sản phẩm; nếu giá đã đổi ở nơi khác, tải lại trang.',
                        'Unable to save. Check prices, stock, MOQ and published status. Refresh if another editor changed a price.',
                    ),
                ),
            ),
    });
    const bulkSelect = useMutation({
        mutationFn: () => executiveApi.promotionMatchingProductIds(campaign.id, filter),
        onSuccess: (ids) => {
            const next = Array.from(new Set([...selected, ...ids]));
            if (next.length > (flash ? 8 : MAX_ASSIGNED)) {
                setFeedback(
                    tr(
                        `Bộ lọc có ${ids.length} sản phẩm. Giới hạn của chiến dịch này là ${flash ? 8 : MAX_ASSIGNED}. Hãy lọc hẹp hơn.`,
                        `The filter matches ${ids.length} products. This campaign allows ${flash ? 8 : MAX_ASSIGNED}. Narrow the filter.`,
                    ),
                );
                return;
            }
            if (
                ids.length >= 20 &&
                !window.confirm(
                    tr(
                        `Thêm ${ids.length} sản phẩm khớp bộ lọc vào danh sách?`,
                        `Add ${ids.length} matching products to the selection?`,
                    ),
                )
            )
                return;
            setSelection(next);
            setFeedback(
                tr(
                    `Đã thêm ${next.length - selected.length} sản phẩm từ bộ lọc.`,
                    `Added ${next.length - selected.length} products from the filters.`,
                ),
            );
        },
        onError: (e) =>
            setFeedback(
                executiveErrorMessage(
                    e,
                    tr('Không tải được danh sách lọc.', 'Cannot load matching products.'),
                ),
            ),
    });

    function toggle(item: PromotionProductChoice) {
        const next = new Set(selected);
        if (next.has(item.id)) {
            next.delete(item.id);
            setPriceDrafts((previous) => {
                const copy = { ...previous };
                delete copy[item.id];
                return copy;
            });
        } else if (next.size < (flash ? 8 : MAX_ASSIGNED)) next.add(item.id);
        else {
            setFeedback(tr('Đã đạt giới hạn số sản phẩm.', 'Product limit reached.'));
            return;
        }
        setSelection([...next]);
        setFeedback('');
    }
    function closeSafely() {
        if (
            changed &&
            !window.confirm(tr('Bỏ những thay đổi chưa lưu?', 'Discard unsaved changes?'))
        )
            return;
        onClose();
    }
    function clearSelected() {
        if (!selected.length) return;
        if (
            !window.confirm(
                tr(
                    `Bỏ chọn toàn bộ ${selected.length} sản phẩm?`,
                    `Unselect all ${selected.length} products?`,
                ),
            )
        )
            return;
        setSelection([]);
        setPriceDrafts({});
        setFeedback('');
    }
    async function applyBulk() {
        setBulkFeedback('');
        const amount = numeric(bulkAmount);
        if (
            !Number.isFinite(amount) ||
            amount <= 0 ||
            (bulkMode === 'PERCENT' && amount >= 100) ||
            (bulkMode === 'AMOUNT' && !Number.isInteger(amount))
        ) {
            setBulkFeedback(
                tr(
                    'Nhập giá trị giảm hợp lệ (phần trăm từ 0 đến dưới 100).',
                    'Enter a valid discount (percentage must be between 0 and 100).',
                ),
            );
            return;
        }
        if (selectedDetails.isFetching || details.length !== selected.length) return;
        let ids = selected;
        try {
            if (bulkScope === 'MATCHING') {
                const matches = await executiveApi.promotionMatchingProductIds(campaign.id, filter);
                const matching = new Set(matches);
                ids = selected.filter((id) => matching.has(id));
            }
        } catch (e) {
            setBulkFeedback(
                executiveErrorMessage(
                    e,
                    tr('Không áp dụng được bộ lọc.', 'Could not resolve current filters.'),
                ),
            );
            return;
        }
        const affected = ids
            .map((id) => detailMap.get(id))
            .filter((item): item is PromotionProductChoice => item !== undefined);
        const withListPrice = affected.filter(
            (item) => item.listPrice !== null && item.listPrice > 0,
        );
        if (!withListPrice.length) {
            setBulkFeedback(
                tr(
                    'Không có sản phẩm đã chọn nào khớp bộ lọc và có giá niêm yết hợp lệ.',
                    'No selected products match the filters with a valid list price.',
                ),
            );
            return;
        }
        if (
            bulkMode === 'AMOUNT' &&
            withListPrice.some((item) => item.listPrice !== null && amount >= item.listPrice)
        ) {
            setBulkFeedback(
                tr(
                    'Số tiền giảm phải nhỏ hơn giá niêm yết của từng sản phẩm.',
                    'Discount amount must be below every affected product’s list price.',
                ),
            );
            return;
        }
        const replacingTierDiscounts = withListPrice.filter(
            (item) => item.saleDiscountPercent !== null,
        ).length;
        const ok = window.confirm(
            tr(
                `Áp dụng giảm ${bulkMode === 'PERCENT' ? `${amount}%` : money(amount)} cho ${withListPrice.length} sản phẩm đã chọn? Giá sale thay đổi trên TOÀN HỆ THỐNG sau khi lưu. ${replacingTierDiscounts} sản phẩm sẽ bị thay thế phần trăm giảm theo bậc.`,
                `Apply a ${bulkMode === 'PERCENT' ? `${amount}%` : money(amount)} discount to ${withListPrice.length} selected products? Sale prices change SITE-WIDE when saved. ${replacingTierDiscounts} tier-percentage discounts will be replaced.`,
            ),
        );
        if (!ok) return;
        setPriceDrafts((previous) => {
            const next = { ...previous };
            for (const item of withListPrice) {
                const list = item.listPrice!;
                next[item.id] = String(
                    bulkMode === 'PERCENT'
                        ? Math.max(0, Math.floor((list * (100 - amount)) / 100))
                        : list - amount,
                );
            }
            return next;
        });
        setBulkFeedback(
            tr(
                `Đã chuẩn bị thay đổi giá cho ${withListPrice.length} sản phẩm. Bấm Lưu để áp dụng.`,
                `Prepared price changes for ${withListPrice.length} products. Click Save to apply.`,
            ),
        );
        setTab('selected');
    }

    function productRow(item: PromotionProductChoice, editing: boolean) {
        const active = selectedSet.has(item.id);
        const published =
            item.status === 'PUBLISHED' && item.unitCode !== 'COMBO' && item.categoryActive;
        const stockReady = item.availableQuantity >= item.minOrderQuantity;
        const raw = priceDrafts[item.id];
        const draft = raw === undefined ? item.salePrice : raw.trim() === '' ? null : numeric(raw);
        const priceReady =
            item.listPrice !== null &&
            item.listPrice > 0 &&
            draft !== null &&
            Number.isFinite(draft) &&
            draft >= 0 &&
            draft < item.listPrice;
        return (
            <div
                key={item.id}
                className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 sm:flex-nowrap ${active ? 'border-[#318664] bg-[#ecf6eb]' : 'border-[#e1e8df] bg-white'}`}
            >
                <label
                    className="flex shrink-0 items-center gap-1"
                    aria-label={tr('Chọn sản phẩm', 'Select product')}
                >
                    <input
                        type="checkbox"
                        checked={active}
                        disabled={
                            (!published && !active) ||
                            assigned.isLoading ||
                            save.isPending ||
                            bulkSelect.isPending
                        }
                        onChange={() => toggle(item)}
                        className="h-4 w-4 accent-[#15543b]"
                    />
                </label>
                {item.imageUrl ? (
                    <img
                        className="size-14 shrink-0 rounded-lg bg-white object-contain"
                        alt=""
                        src={item.imageUrl}
                    />
                ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#edf3eb]">
                        <Package size={22} />
                    </div>
                )}
                <div className="min-w-[145px] flex-1 text-sm">
                    <p className="font-bold text-[#173f30]">{tr(item.nameVi, item.nameEn)}</p>
                    <p className="mt-0.5 break-all text-xs text-[#667d71]">
                        {item.sku} · {item.status}
                    </p>
                    {item.legacyPromotionId && item.legacyPromotionId !== campaign.id && (
                        <p className="mt-1 text-xs text-[#597668]">
                            {tr('Chiến dịch khác', 'Other campaign')}:{' '}
                            {item.legacyPromotionName || item.legacyPromotionId}
                        </p>
                    )}
                    {!published && (
                        <p className="mt-1 text-xs text-red-600">
                            {tr(
                                'Chưa xuất bản, combo hoặc danh mục đang tắt.',
                                'Draft, combo or inactive category.',
                            )}
                        </p>
                    )}
                    {!stockReady && (
                        <p className="mt-1 text-xs text-amber-700">
                            {tr('Không đủ tồn kho theo MOQ.', 'Insufficient stock for MOQ.')}
                        </p>
                    )}
                    {item.saleDiscountPercent !== null && (
                        <p className="mt-1 text-xs text-amber-700">
                            {tr('Đang có giảm giá theo bậc', 'Current tier discount')}:{' '}
                            {item.saleDiscountPercent}%.
                            {tr(
                                ' Chỉnh giá sale sẽ thay thế mức này.',
                                ' Editing sale price will replace it.',
                            )}
                        </p>
                    )}
                    {!priceReady && (
                        <p className="mt-1 text-xs text-amber-700">
                            {tr('Chưa có giá sale hợp lệ.', 'No valid sale price.')}
                        </p>
                    )}
                </div>
                <div className="min-w-[145px] shrink-0 text-right text-xs">
                    <p className="font-semibold text-[#173f30]">
                        {tr('Giá niêm yết', 'List price')}: {money(item.listPrice)}
                    </p>
                    {editing ? (
                        <label className="mt-1 block font-medium text-[#173f30]">
                            {tr('Giá sale (VND)', 'Sale price (VND)')}
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    raw ?? (item.salePrice === null ? '' : String(item.salePrice))
                                }
                                disabled={save.isPending}
                                onChange={(event) =>
                                    setPriceDrafts((prev) => ({
                                        ...prev,
                                        [item.id]: event.target.value,
                                    }))
                                }
                                placeholder={tr('Để trống: không sale', 'Blank: no sale')}
                                className="mt-1 block h-9 w-full rounded-lg border border-[#b4ccbb] bg-white px-2 text-right text-sm focus:outline-none focus:ring-1 focus:ring-[#318664]"
                            />
                        </label>
                    ) : (
                        <p className="mt-1 font-bold text-[#176a46]">
                            {tr('Giá sale', 'Sale price')}: {money(item.salePrice)}
                        </p>
                    )}
                    <p className="mt-1 text-[#597668]">
                        {tr('Kho', 'Stock')}: {item.availableQuantity} / MOQ {item.minOrderQuantity}
                    </p>
                    {active && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[#0e6b45]">
                            <Check size={13} />
                            {tr('Đã chọn', 'Selected')}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/55 p-3 sm:p-6"
            onMouseDown={(event) => {
                if (event.currentTarget === event.target) closeSafely();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-label={tr('Sản phẩm áp dụng', 'Campaign products')}
                className="flex max-h-[93dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#faf8ed] shadow-2xl"
            >
                <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#d9e4d8] bg-white px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#123b2b]">
                            {tr('Sản phẩm áp dụng', 'Campaign products')}
                        </h2>
                        <p className="mt-1 text-sm text-[#597668]">
                            {tr(campaign.nameVi, campaign.nameEn)} ·{' '}
                            {flash ? 'FLASH SALE' : 'STANDARD'}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label={tr('Đóng', 'Close')}
                        onClick={closeSafely}
                        className="rounded-lg p-2 text-[#173f30] hover:bg-[#edf4e9]"
                    >
                        <X size={20} />
                    </button>
                </header>
                <div className="shrink-0 border-b border-[#d9e4d8] px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="relative flex min-w-[210px] flex-1 items-center gap-2 rounded-xl border border-[#b4ccbb] bg-white px-3">
                            <Search size={17} className="shrink-0 text-[#486c58]" />
                            <input
                                type="search"
                                value={search}
                                maxLength={100}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(0);
                                }}
                                placeholder={tr(
                                    'Tìm theo tên hoặc SKU...',
                                    'Search by name or SKU...',
                                )}
                                className="h-10 w-full min-w-0 border-0 bg-transparent text-sm outline-none focus:border-0 focus:outline-none"
                                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                            />
                        </label>
                        <span className="rounded-lg bg-[#eaf3e8] px-3 py-2 text-sm font-bold text-[#174632]">
                            {tr('Đã chọn', 'Selected')}: {selected.length}
                            {flash ? ' / 8' : ''}
                        </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Filter size={16} className="text-[#486c58]" />
                        <select
                            aria-label={tr('Lọc thương hiệu', 'Filter brand')}
                            value={brandId}
                            onChange={(e) => {
                                setBrandId(e.target.value);
                                setPage(0);
                            }}
                            className="min-w-[150px] flex-1 rounded-lg border border-[#b4ccbb] bg-white p-2 text-xs text-[#173f30]"
                        >
                            <option value="">{tr('Tất cả thương hiệu', 'All brands')}</option>
                            {brands.data?.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                        <select
                            aria-label={tr('Lọc danh mục', 'Filter category')}
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setPage(0);
                            }}
                            className="min-w-[165px] flex-1 rounded-lg border border-[#b4ccbb] bg-white p-2 text-xs text-[#173f30]"
                        >
                            <option value="">{tr('Tất cả danh mục', 'All categories')}</option>
                            {flatCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {'— '.repeat(cat.depth)}
                                    {tr(cat.vi, cat.en)}
                                </option>
                            ))}
                        </select>
                        <label className="flex items-center gap-1 text-xs text-[#173f30]">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => {
                                    setInStockOnly(e.target.checked);
                                    setPage(0);
                                }}
                            />
                            {tr('Đủ tồn kho', 'In stock')}
                        </label>
                        <label className="flex items-center gap-1 text-xs text-[#173f30]">
                            <input
                                type="checkbox"
                                checked={discountOnly}
                                onChange={(e) => {
                                    setDiscountOnly(e.target.checked);
                                    setPage(0);
                                }}
                            />
                            {tr('Đã có giá sale', 'Has sale price')}
                        </label>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex rounded-xl bg-white p-1 text-xs">
                            <button
                                type="button"
                                aria-pressed={tab === 'browse'}
                                onClick={() => setTab('browse')}
                                className={`rounded-lg px-3 py-2 font-bold ${tab === 'browse' ? 'bg-[#15543b] text-white' : 'text-[#15543b] hover:bg-[#edf4e9]'}`}
                            >
                                {tr('Danh sách sản phẩm', 'Browse products')}
                            </button>
                            <button
                                type="button"
                                aria-pressed={tab === 'selected'}
                                onClick={() => setTab('selected')}
                                className={`rounded-lg px-3 py-2 font-bold ${tab === 'selected' ? 'bg-[#15543b] text-white' : 'text-[#15543b] hover:bg-[#edf4e9]'}`}
                            >
                                {tr('Sản phẩm đã chọn', 'Selected products')} ({selected.length})
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                disabled={
                                    bulkSelect.isPending || assigned.isLoading || save.isPending
                                }
                                onClick={() => bulkSelect.mutate()}
                                className={executiveUi.secondary}
                            >
                                {bulkSelect.isPending
                                    ? tr('Đang tìm...', 'Finding...')
                                    : tr('Chọn tất cả khớp bộ lọc', 'Select all matching')}
                            </button>
                            <button
                                type="button"
                                disabled={!selected.length || save.isPending}
                                onClick={clearSelected}
                                className={executiveUi.secondary}
                            >
                                {tr('Bỏ chọn tất cả', 'Clear selection')}
                            </button>
                        </div>
                    </div>
                    {feedback && (
                        <p role="status" className="mt-2 text-xs text-[#8a4b04]">
                            {feedback}
                        </p>
                    )}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
                    {tab === 'browse' ? (
                        <>
                            {products.isFetching && (
                                <p
                                    role="status"
                                    className="py-2 text-center text-xs text-[#597668]"
                                >
                                    {tr('Đang tải...', 'Loading...')}
                                </p>
                            )}
                            {products.isError && (
                                <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
                                    {tr('Không tải được sản phẩm.', 'Unable to load products.')}
                                </p>
                            )}
                            {products.data?.items.length === 0 && (
                                <p className="py-8 text-center text-sm text-[#597668]">
                                    {tr('Không tìm thấy sản phẩm.', 'No matching products.')}
                                </p>
                            )}
                            <div className="space-y-2">
                                {products.data?.items.map((item) => productRow(item, false))}
                            </div>
                        </>
                    ) : (
                        <>
                            {selectedDetails.isFetching && (
                                <p
                                    role="status"
                                    className="py-3 text-center text-xs text-[#597668]"
                                >
                                    {tr(
                                        'Đang tải toàn bộ sản phẩm đã chọn...',
                                        'Loading all selected products...',
                                    )}
                                </p>
                            )}
                            {selectedDetails.isError && (
                                <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
                                    {tr(
                                        'Không tải được danh sách đã chọn.',
                                        'Cannot load selected products.',
                                    )}
                                </p>
                            )}
                            {!selected.length && (
                                <p className="py-8 text-center text-sm text-[#597668]">
                                    {tr(
                                        'Chưa chọn sản phẩm nào. Dùng bộ lọc và chọn tất cả để thêm nhanh.',
                                        'Nothing selected. Use filters and Select all matching to add products.',
                                    )}
                                </p>
                            )}
                            <p className="mb-3 text-xs text-[#597668]">
                                {tr(
                                    'Danh sách này bao gồm sản phẩm đã chọn từ MỌI trang và MỌI bộ lọc. Chỉnh giá sale tại cột bên phải.',
                                    'This list includes selections from ALL pages and filters. Edit sale prices on the right.',
                                )}
                            </p>
                            <input
                                type="search"
                                value={selectedSearch}
                                onChange={(e) => {
                                    setSelectedSearch(e.target.value);
                                    setSelectedPage(0);
                                }}
                                aria-label={tr(
                                    'Tìm trong sản phẩm đã chọn',
                                    'Search selected products',
                                )}
                                placeholder={tr(
                                    'Tìm trong sản phẩm đã chọn...',
                                    'Search within selected products...',
                                )}
                                className="mb-3 w-full rounded-lg border border-[#b4ccbb] bg-white px-3 py-2 text-sm"
                            />
                            {selected.length > 0 &&
                                details.length !== selected.length &&
                                !selectedDetails.isFetching && (
                                    <p role="alert" className="mb-2 text-sm text-red-700">
                                        {tr(
                                            'Có sản phẩm không còn tồn tại. Tải lại danh sách trước khi lưu.',
                                            'Some selected products are missing. Refresh before saving.',
                                        )}
                                    </p>
                                )}
                            {filteredDetails.length === 0 && selected.length > 0 && (
                                <p className="py-6 text-center text-sm text-[#597668]">
                                    {tr(
                                        'Không có sản phẩm đã chọn khớp tìm kiếm.',
                                        'No selected products match this search.',
                                    )}
                                </p>
                            )}
                            <div className="space-y-2">
                                {visibleDetails.map((item) => productRow(item, true))}
                            </div>
                        </>
                    )}
                </div>
                <div className="shrink-0 border-t border-[#d9e4d8] bg-[#eef3e9] px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#173f30]">
                        <Tag size={16} />
                        <strong>{tr('Giảm giá hàng loạt', 'Bulk discount')}</strong>
                        <select
                            aria-label={tr('Loại giảm', 'Discount type')}
                            value={bulkMode}
                            onChange={(e) => setBulkMode(e.target.value as 'PERCENT' | 'AMOUNT')}
                            className="rounded-lg border border-[#b4ccbb] bg-white p-2"
                        >
                            <option value="PERCENT">{tr('Phần trăm (%)', 'Percentage (%)')}</option>
                            <option value="AMOUNT">{tr('Số tiền (VND)', 'Amount (VND)')}</option>
                        </select>
                        <input
                            type="number"
                            step={bulkMode === 'PERCENT' ? '0.01' : '1'}
                            min="0"
                            value={bulkAmount}
                            onChange={(e) => setBulkAmount(e.target.value)}
                            aria-label={tr('Mức giảm', 'Discount value')}
                            className="w-24 rounded-lg border border-[#b4ccbb] bg-white p-2"
                        />
                        <select
                            value={bulkScope}
                            onChange={(e) => setBulkScope(e.target.value as 'MATCHING' | 'ALL')}
                            aria-label={tr('Phạm vi áp dụng', 'Apply scope')}
                            className="rounded-lg border border-[#b4ccbb] bg-white p-2"
                        >
                            <option value="MATCHING">
                                {tr('Đã chọn + khớp bộ lọc', 'Selected + matching filters')}
                            </option>
                            <option value="ALL">
                                {tr('Tất cả sản phẩm đã chọn', 'All selected products')}
                            </option>
                        </select>
                        <button
                            type="button"
                            disabled={
                                !selected.length || selectedDetails.isFetching || save.isPending
                            }
                            onClick={() => void applyBulk()}
                            className={executiveUi.secondary}
                        >
                            {tr('Áp dụng vào bản nháp', 'Apply to draft')}
                        </button>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-amber-900">
                        {tr(
                            'Giá sale là giá CẤP SẢN PHẨM, có thể ảnh hưởng các chiến dịch đang chạy. Chỉ thay đổi giá sale sau khi bấm Lưu; không thay đổi giá niêm yết hoặc giá bậc.',
                            'Sale prices are PRODUCT-WIDE and can affect other active promotions. Only Save writes prices; list prices and tiers remain unchanged.',
                        )}
                    </p>
                    {bulkFeedback && (
                        <p role="status" className="mt-2 text-xs text-[#174632]">
                            {bulkFeedback}
                        </p>
                    )}
                </div>
                <footer className="shrink-0 border-t border-[#d9e4d8] bg-white px-5 py-3">
                    {invalidPrice && (
                        <p role="alert" className="mb-2 text-xs text-red-700">
                            {tr(
                                'Giá sale phải là số VND nguyên, từ 0 đến thấp hơn giá niêm yết.',
                                'Sale price must be whole VND, from 0 to below list price.',
                            )}
                        </p>
                    )}
                    {save.isError && (
                        <p role="alert" className="mb-2 text-xs text-red-700">
                            {feedback}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {tab === 'browse' ? (
                            <div className="flex items-center gap-2 text-xs text-[#597668]">
                                <button
                                    type="button"
                                    onClick={() => setPage((v) => Math.max(0, v - 1))}
                                    disabled={page === 0 || products.isFetching}
                                    className={executiveUi.secondary}
                                    aria-label={tr('Trang trước', 'Previous page')}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {tr('Trang', 'Page')} {page + 1} /{' '}
                                {Math.max(1, products.data?.totalPages ?? 1)}
                                <button
                                    type="button"
                                    onClick={() => setPage((v) => v + 1)}
                                    disabled={
                                        products.isFetching ||
                                        !products.data ||
                                        page + 1 >= products.data.totalPages
                                    }
                                    className={executiveUi.secondary}
                                    aria-label={tr('Trang tiếp', 'Next page')}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-[#597668]">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPage((v) => Math.max(0, v - 1))}
                                    disabled={actualSelectedPage === 0}
                                    className={executiveUi.secondary}
                                    aria-label={tr('Trang trước', 'Previous page')}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {tr('Đã chọn', 'Selected')} {filteredDetails.length} ·{' '}
                                {tr('Trang', 'Page')} {actualSelectedPage + 1} /{' '}
                                {selectedTotalPages}
                                <button
                                    type="button"
                                    onClick={() => setSelectedPage((v) => v + 1)}
                                    disabled={actualSelectedPage + 1 >= selectedTotalPages}
                                    className={executiveUi.secondary}
                                    aria-label={tr('Trang tiếp', 'Next page')}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-[#597668]">
                                {changes.length} {tr('giá đang thay đổi', 'price changes')}
                            </span>
                            <button
                                type="button"
                                onClick={closeSafely}
                                className={executiveUi.secondary}
                            >
                                {tr('Đóng', 'Close')}
                            </button>
                            <button
                                type="button"
                                disabled={!canSave || save.isPending || bulkSelect.isPending}
                                onClick={() => {
                                    if (
                                        changes.length > 0 &&
                                        !window.confirm(
                                            tr(
                                                `Lưu ${changes.length} giá sale cấp sản phẩm và danh sách áp dụng? Giá mới có thể ảnh hưởng chương trình khác và thay thế giảm theo bậc.`,
                                                `Save ${changes.length} product-wide sale prices and campaign assignments? Other promotions and tier discounts may be affected.`,
                                            ),
                                        )
                                    )
                                        return;
                                    save.mutate();
                                }}
                                className={executiveUi.button}
                            >
                                {save.isPending
                                    ? tr('Đang lưu...', 'Saving...')
                                    : tr(
                                          'Lưu sản phẩm và giá sale',
                                          'Save products and sale prices',
                                      )}
                            </button>
                        </div>
                    </div>
                </footer>
            </section>
        </div>
    );
}
