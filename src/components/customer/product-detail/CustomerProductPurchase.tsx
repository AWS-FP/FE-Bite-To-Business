import { CheckCircle2, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { useCartStore } from '@/store/customer/cartStore';
import type {
    CustomerProductDetail,
    CustomerProductPricing,
    ProductPriceTier,
} from '@/services/customer/productDetailService';

export default function CustomerProductPurchase({
    product,
    pricing,
    name,
    spec,
}: {
    product: CustomerProductDetail;
    pricing: CustomerProductPricing | null;
    name: string;
    spec: string;
}) {
    const { t } = useTranslation('storefront');
    const tr = (key: string) => t(`productDetail.${key}`);
    const [quantity, setQuantity] = useState(() =>
        Math.max(1, Number(pricing?.minOrderQuantity ?? product.minOrderQuantity) || 1),
    );
    const [added, setAdded] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const minimumFromApi = pricing?.minOrderQuantity ?? product.minOrderQuantity;
    const min = Math.max(1, Number(minimumFromApi) || 1);
    const step = Math.max(0.001, Number(pricing?.quantityStep ?? product.quantityStep) || 1);
    const selectedQuantity = Math.max(min, quantity);
    const availableQuantity =
        pricing == null
            ? null
            : pricing.inventoryAvailable
              ? Math.max(0, Number(pricing.availableQuantity) || 0)
              : 0;
    const listPrice =
        pricing?.priceAvailable && pricing.listPrice != null ? pricing.listPrice : null;
    const salePrice =
        pricing?.saleActive &&
        listPrice != null &&
        pricing.salePrice != null &&
        pricing.salePrice < listPrice
            ? pricing.salePrice
            : null;
    const tiers = (pricing?.priceTiers ?? []).slice().sort((a, b) => a.minQuantity - b.minQuantity);
    const activeTier: ProductPriceTier | undefined = tiers.find(
        (tier) =>
            selectedQuantity >= tier.minQuantity &&
            (tier.maxQuantity == null || selectedQuantity <= tier.maxQuantity),
    );
    // Do not stack an active promotion and a wholesale tier discount without BE confirmation.
    const displayPrice = salePrice ?? activeTier?.unitPrice ?? listPrice;
    const discountPercent =
        salePrice != null && listPrice != null ? Math.round((1 - salePrice / listPrice) * 100) : 0;
    const stockOk =
        pricing?.inventoryAvailable === true &&
        availableQuantity != null &&
        availableQuantity >= min;
    const canAdd =
        minimumFromApi != null &&
        pricing?.priceAvailable === true &&
        displayPrice != null &&
        stockOk &&
        availableQuantity != null &&
        selectedQuantity <= availableQuantity;

    const setValidQuantity = (requested: number) => {
        setAdded(false);
        const stepsFromMin = Math.max(0, Math.round((requested - min) / step));
        setQuantity(Number((min + stepsFromMin * step).toFixed(3)));
    };
    const goToTier = (tierMinimum: number) => {
        const stepsFromMin = Math.max(0, Math.ceil((tierMinimum - min) / step));
        setValidQuantity(min + stepsFromMin * step);
    };
    const submit = () => {
        if (!canAdd || displayPrice == null) return;
        addItem(
            {
                id: product.id,
                name,
                spec: spec || product.unitCode,
                unitPrice: displayPrice,
                imageUrl: product.imageUrl ?? undefined,
            },
            selectedQuantity,
        );
        setAdded(true);
    };

    return (
        <section className="overflow-hidden rounded-[26px] border border-[#dce9dc] bg-white text-[#173d2b] shadow-[0_14px_34px_rgba(4,32,22,0.14)]">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[radial-gradient(ellipse_at_top_right,#3b6750_0%,transparent_75%)] bg-[#173d2b] px-5 py-[25px] text-white sm:px-6">
                <div>
                    <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ffdc62]">
                        {tr('wholesaleBox')}
                    </p>
                    <h2 className="m-0 mt-1 text-lg font-bold">{tr('orderOptions')}</h2>
                </div>
                <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${stockOk ? 'bg-[#e3f3df] text-[#155034]' : 'bg-[#fff1e7] text-[#98542d]'}`}
                >
                    {pricing == null
                        ? tr('stockUnknown')
                        : stockOk
                          ? tr('stockAvailable')
                          : tr('outOfStock')}
                </span>
            </div>
            <div className="space-y-6 px-5 py-6 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        {salePrice != null && listPrice != null && (
                            <p className="m-0 text-sm text-[#89958c] line-through">
                                {formatCurrencyVnd(listPrice)}
                            </p>
                        )}
                        <div className="mt-1 flex flex-wrap items-baseline gap-1">
                            <strong className="font-price text-[36px] font-extrabold leading-tight text-[#174e35]">
                                {displayPrice == null
                                    ? tr('priceUnavailable')
                                    : formatCurrencyVnd(displayPrice)}
                            </strong>
                            {displayPrice != null && (
                                <span className="text-sm font-semibold text-[#718476]">
                                    / {product.unitCode}
                                </span>
                            )}
                        </div>
                        {discountPercent > 0 && (
                            <span className="mt-2 inline-block bg-[#fff3d2] px-2 py-1 text-xs font-bold text-[#a35827]">
                                {tr('promotionDiscount')}: -{discountPercent}%
                            </span>
                        )}
                    </div>
                    {minimumFromApi != null && (
                        <div className="shrink-0 rounded-xl bg-[#fff1ae] px-3 py-2 text-xs font-extrabold text-[#214a35]">
                            MOQ {min}
                        </div>
                    )}
                </div>

                <div className="border-t border-[#e5eee5] pt-5">
                    <h3 className="m-0 mb-3 text-xs font-bold uppercase tracking-wider text-[#476858]">
                        {tr('wholesaleTiers')}
                    </h3>
                    {tiers.length === 0 ? (
                        <p className="m-0 text-sm text-[#789184]">{tr('noTiers')}</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {tiers.map((tier) => {
                                const active = activeTier?.id === tier.id;
                                return (
                                    <button
                                        key={tier.id}
                                        type="button"
                                        onClick={() => goToTier(tier.minQuantity)}
                                        aria-pressed={active}
                                        className={`min-w-0 rounded-lg border px-2 py-3 text-center transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#2c7550] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a835] ${active ? 'border-[#28734e] bg-[#edf7ed] shadow-[inset_0_0_0_1px_#28734e]' : 'border-[#e3eae1] bg-[#fafbf8]'}`}
                                    >
                                        <span className="block text-xs font-bold tabular-nums text-[#4c6a59]">
                                            {tier.minQuantity}
                                            {tier.maxQuantity == null
                                                ? '+'
                                                : `–${tier.maxQuantity}`}
                                        </span>
                                        <strong className="mt-1 block text-sm font-extrabold tabular-nums text-[#174e35]">
                                            {formatCurrencyVnd(tier.unitPrice)}
                                        </strong>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-xl bg-[#f4f8f1] p-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-bold">{tr('quantity')}</span>
                        <div className="flex h-10 items-center overflow-hidden rounded-lg border border-[#cdded0] bg-white">
                            <button
                                type="button"
                                aria-label={tr('decrease')}
                                onClick={() => setValidQuantity(selectedQuantity - step)}
                                disabled={selectedQuantity <= min}
                                className="grid h-10 w-9 place-items-center border-0 bg-transparent text-[#1b4e36] transition-colors hover:bg-[#edf5ea] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Minus size={15} />
                            </button>
                            <output className="min-w-9 text-center text-sm font-bold tabular-nums">
                                {selectedQuantity}
                            </output>
                            <button
                                type="button"
                                aria-label={tr('increase')}
                                onClick={() => setValidQuantity(selectedQuantity + step)}
                                disabled={
                                    !stockOk ||
                                    availableQuantity == null ||
                                    selectedQuantity + step > availableQuantity
                                }
                                className="grid h-10 w-9 place-items-center border-0 bg-transparent text-[#1b4e36] transition-colors hover:bg-[#edf5ea] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Plus size={15} />
                            </button>
                        </div>
                    </div>
                    <p className="m-0 mt-2 text-xs text-[#70877a]">
                        {tr('stock')}:{' '}
                        {availableQuantity == null
                            ? '—'
                            : `${availableQuantity} ${product.unitCode}`}
                    </p>
                    <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-[#dce7d9] pt-3">
                        <span className="text-sm text-[#476858]">{tr('estimatedTotal')}</span>
                        <strong className="font-price text-xl font-extrabold text-[#174e35]">
                            {displayPrice != null
                                ? formatCurrencyVnd(displayPrice * selectedQuantity)
                                : '—'}
                        </strong>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={submit}
                    disabled={!canAdd}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-0 bg-[#ffd84a] px-4 py-3 text-sm font-extrabold text-[#153b2a] shadow-[0_4px_0_#c9a82b] transition-[background-color,transform,box-shadow] hover:bg-[#ffdf68] active:translate-y-0.5 active:shadow-[0_2px_0_#c9a82b] disabled:cursor-not-allowed disabled:bg-[#d5e0d6] disabled:text-[#718778] disabled:shadow-none"
                >
                    <ShoppingCart size={19} />
                    {added ? tr('added') : canAdd ? tr('addToOrder') : tr('unavailableToOrder')}
                </button>
                {added && (
                    <p
                        role="status"
                        className="m-0 flex items-center gap-2 text-sm font-bold text-[#21704c]"
                    >
                        <CheckCircle2 size={17} />
                        {tr('added')}
                    </p>
                )}
                <p className="m-0 text-xs leading-6 text-[#6f877b]">{tr('estimateNote')}</p>
                <div className="flex flex-wrap justify-between gap-3 border-t border-[#e2ebe0] pt-4 text-xs font-medium text-[#407056]">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck size={16} />
                        {tr('secure')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Truck size={16} />
                        {tr('delivery')}
                    </span>
                </div>
            </div>
        </section>
    );
}
