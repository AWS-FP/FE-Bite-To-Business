import { Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { checkCartStock, useCartStore } from '@/store/customer/cartStore';
import { useCartFeedback } from '@/hooks/customer/useCartFeedback';
import CartPurchaseFeedback from '../CartPurchaseFeedback';
import { useStorefrontPurchaseAccess } from '@/hooks/customer/useStorefrontPurchaseAccess';
import type {
    CustomerProductDetail,
    CustomerProductPricing,
    ProductPriceTier,
} from '@/types/customer/productDetail';

type Props = {
    product: CustomerProductDetail;
    pricing: CustomerProductPricing | null;
    name: string;
    spec: string;
};

/** Compact purchase card. Sticky positioning belongs to the product-page grid. */
export default function CustomerProductPurchase({ product, pricing, name, spec }: Props) {
    const { t } = useTranslation('storefront');
    const tr = (key: string) => t(`productDetail.${key}`);
    const purchaseAllowed = useStorefrontPurchaseAccess();
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(() =>
        Math.max(1, Number(pricing?.minOrderQuantity ?? product.minOrderQuantity) || 1),
    );
    const { feedback, showFeedback, clearFeedback } = useCartFeedback();
    const added = feedback !== null && !feedback.limit;

    const min = Math.max(1, Number(pricing?.minOrderQuantity ?? product.minOrderQuantity) || 1);
    const step = Math.max(0.001, Number(pricing?.quantityStep ?? product.quantityStep) || 1);
    const selectedQuantity = Math.max(min, quantity);
    const availableQuantity = pricing?.inventoryAvailable
        ? Math.max(0, Number(pricing.availableQuantity) || 0)
        : 0;
    const priceAvailable = pricing?.priceAvailable === true && pricing.listPrice != null;
    const listPrice = priceAvailable ? pricing.listPrice : null;
    const salePrice =
        pricing?.saleActive &&
        listPrice != null &&
        pricing.salePrice != null &&
        pricing.salePrice < listPrice
            ? pricing.salePrice
            : null;
    const tiers = [...(pricing?.priceTiers ?? [])].sort((a, b) => a.minQuantity - b.minQuantity);
    const activeTier: ProductPriceTier | undefined = tiers.find(
        (tier) =>
            selectedQuantity >= tier.minQuantity &&
            (tier.maxQuantity == null || selectedQuantity <= tier.maxQuantity),
    );
    // Avoid stacking promotional and volume discounts without server confirmation.
    const unitPrice = salePrice ?? activeTier?.unitPrice ?? listPrice;
    const discountPercent =
        salePrice != null && listPrice != null ? Math.round((1 - salePrice / listPrice) * 100) : 0;
    const stockOk = pricing?.inventoryAvailable === true && availableQuantity >= min;
    const canAdd =
        purchaseAllowed && priceAvailable && unitPrice != null && stockOk;
    const rules = { id: product.id, minOrderQuantity: min, quantityStep: step, maxQuantity: availableQuantity };

    const setValidQuantity = (requested: number) => {
        const steps = Math.max(0, Math.round((requested - min) / step));
        const next = Number((min + steps * step).toFixed(3));
        if (next > selectedQuantity && stockOk) {
            const limit = checkCartStock(rules, next);
            if (limit) { showFeedback(limit); return; }
        }
        clearFeedback();
        setQuantity(next);
    };
    const goToTier = (tierMinimum: number) => {
        const steps = Math.max(0, Math.ceil((tierMinimum - min) / step));
        setValidQuantity(min + steps * step);
    };
    const submit = () => {
        if (!canAdd || unitPrice == null) return;
        const limit = addItem(
            {
                ...rules,
                name,
                nameVi: product.nameVi,
                nameEn: product.nameEn,
                spec: spec || product.unitCode,
                specVi: product.packageSpecVi,
                specEn: product.packageSpecEn,
                unitPrice,
                imageUrl: product.imageUrl ?? undefined,
            },
            selectedQuantity,
        );
        showFeedback(limit);
    };

    return (
        <section className="overflow-hidden rounded-xl border border-[#d7e3d7] bg-[#fcfdf9] text-[#173d2b] shadow-[0_10px_26px_rgba(4,32,22,0.16)]">
            <header className="flex items-center justify-between gap-2 bg-[#174b37] px-3.5 py-2.5 text-white">
                <div className="min-w-0">
                    <p className="m-0 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffe077]">
                        {tr('wholesaleBox')}
                    </p>
                    <h2 className="m-0 mt-0.5 text-sm font-extrabold leading-5">
                        {tr('orderOptions')}
                    </h2>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                        stockOk ? 'bg-[#ddf1dd] text-[#155034]' : 'bg-[#fff1e7] text-[#98542d]'
                    }`}
                >
                    {pricing == null
                        ? tr('stockUnknown')
                        : stockOk
                          ? tr('stockAvailable')
                          : tr('outOfStock')}
                </span>
            </header>

            <div className="space-y-2.5 p-3.5">
                <div className="flex items-start justify-between gap-2 border-b border-[#e2ebe2] pb-2.5">
                    <div className="min-w-0">
                        {salePrice != null && listPrice != null && (
                            <p className="m-0 text-xs text-[#89958c] line-through">
                                {formatCurrencyVnd(listPrice)}
                            </p>
                        )}
                        <div className="flex flex-wrap items-baseline gap-1.5">
                            <strong className="font-price text-[25px] font-extrabold leading-tight text-[#174e35]">
                                {unitPrice == null
                                    ? tr('priceUnavailable')
                                    : formatCurrencyVnd(unitPrice)}
                            </strong>
                            {unitPrice != null && (
                                <span className="text-xs font-semibold uppercase text-[#718476]">
                                    / {product.unitCode}
                                </span>
                            )}
                        </div>
                        {discountPercent > 0 && (
                            <span className="mt-1 inline-block rounded-md bg-[#fff3d2] px-2 py-0.5 text-xs font-bold text-[#a35827]">
                                {tr('promotionDiscount')}: -{discountPercent}%
                            </span>
                        )}
                    </div>
                    <span className="shrink-0 rounded-full bg-[#fff1ae] px-2 py-1 text-[10px] font-extrabold text-[#214a35]">
                        MOQ {min}
                    </span>
                </div>

                <div>
                    <h3 className="m-0 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#476858]">
                        {tr('wholesaleTiers')}
                    </h3>
                    {tiers.length === 0 ? (
                        <p className="m-0 text-xs text-[#789184]">{tr('noTiers')}</p>
                    ) : (
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                            {tiers.map((tier) => {
                                const active = activeTier?.id === tier.id;
                                return (
                                    <button
                                        key={tier.id}
                                        type="button"
                                        onClick={() => goToTier(tier.minQuantity)}
                                        aria-pressed={active}
                                        className={`min-w-[94px] flex-1 rounded-lg border px-1 py-1.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a835] ${
                                            active
                                                ? 'border-[#28734e] bg-[#edf7ed]'
                                                : 'border-[#e2eae1] bg-white hover:border-[#28734e]'
                                        }`}
                                    >
                                        <span className="block text-[10px] font-bold text-[#4c6a59]">
                                            {tier.minQuantity}
                                            {tier.maxQuantity == null
                                                ? '+'
                                                : `–${tier.maxQuantity}`}
                                        </span>
                                        <strong className="mt-0.5 block break-words text-[11px] font-extrabold tabular-nums text-[#174e35]">
                                            {formatCurrencyVnd(tier.unitPrice)}
                                        </strong>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-lg bg-[#edf5ec] p-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold">{tr('quantity')}</span>
                        <div className="flex h-8 items-center overflow-hidden rounded-lg border border-[#cdded0] bg-white">
                            <button
                                type="button"
                                aria-label={tr('decrease')}
                                onClick={() => setValidQuantity(selectedQuantity - step)}
                                disabled={selectedQuantity <= min}
                                className="grid h-8 w-8 place-items-center border-0 bg-transparent text-[#1b4e36] hover:bg-[#edf5ea] disabled:opacity-40"
                            >
                                <Minus size={14} />
                            </button>
                            <output className="min-w-8 text-center text-sm font-bold tabular-nums">
                                {selectedQuantity}
                            </output>
                            <button
                                type="button"
                                aria-label={tr('increase')}
                                onClick={() => setValidQuantity(selectedQuantity + step)}
                                disabled={!stockOk}
                                className="grid h-8 w-8 place-items-center border-0 bg-transparent text-[#1b4e36] hover:bg-[#edf5ea] disabled:opacity-40"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                    <p className="m-0 mt-1 text-[10px] text-[#70877a]">
                        {tr('stock')}:{' '}
                        {pricing == null ? '—' : `${availableQuantity} ${product.unitCode}`}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-2 border-t border-[#dce7d9] pt-2">
                        <span className="text-xs font-medium text-[#476858]">
                            {tr('estimatedTotal')}
                        </span>
                        <strong className="font-price text-lg font-extrabold text-[#174e35]">
                            {unitPrice != null
                                ? formatCurrencyVnd(unitPrice * selectedQuantity)
                                : '—'}
                        </strong>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={submit}
                    disabled={!canAdd}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border-0 bg-store-yellow px-3 py-2 text-sm font-extrabold text-[#153b2a] transition-colors hover:bg-[#ffdf68] disabled:cursor-not-allowed disabled:bg-[#d5e0d6] disabled:text-[#718778]"
                >
                    <ShoppingCart size={17} />
                    {!purchaseAllowed ? t('customerUI.comboPreviewOnly') : added ? tr('added') : canAdd ? tr('addToOrder') : tr('unavailableToOrder')}
                </button>
                <CartPurchaseFeedback feedback={feedback} unit={product.unitCode} />
                <div className="flex items-center gap-1.5 border-t border-[#e2ebe0] pt-1.5 text-[10px] font-medium text-[#407056]">
                    <Truck size={14} aria-hidden="true" /> {tr('delivery')}
                </div>
            </div>
        </section>
    );
}
