import { Heart, Minus, Plus, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import type { HomeProductCardItem } from '@/types/customer/homeData';
import { useFavoriteToggle } from '@/hooks/customer/useFavoriteToggle';
import Skeleton from '@/components/common/Skeleton';
import { useProductCardPurchase } from '@/hooks/customer/useProductCardPurchase';

/** Only the customer API supplies product, price and promotion values. */
export default function ProductShowcaseCard({
    product,
    comboSummary,
}: {
    product: HomeProductCardItem;
    section?: 'flash' | 'standard';
    comboSummary?: { ingredients: string; savings: string };
}) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en');
    const name = english ? (product.nameEn ?? product.name) : (product.nameVi ?? product.name);
    const category = english
        ? (product.categoryLabelEn ?? product.categoryLabel)
        : product.categoryLabel;
    const unit = t(`homePage.units.${product.unit.toLowerCase()}`, product.unit);
    const image = product.imageUrl?.trim();
    // Presentation-only fallback: unrated products still show five empty stars.
    const reviewCount = product.reviewCount ?? 0;
    const rating = reviewCount > 0 ? (product.rating ?? 0) : 0;
    const {
        favorite,
        pending: savingFavorite,
        toggle: toggleFavorite,
    } = useFavoriteToggle(product.id);
    const {
        purchaseAllowed,
        quantity,
        setQuantity,
        minQuantity,
        step,
        available,
        inStock,
        validSale,
        unitPrice,
        discountPercent,
        totalPrice,
        handleAddToOrder,
    } = useProductCardPurchase(product, name);

    return (
        <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-none border border-store-line/90 bg-white shadow-[0_6px_0_-2px_rgba(9,51,36,0.26),0_10px_17px_rgba(9,51,36,0.12)] transition-[box-shadow,border-color] duration-300 hover:border-store-sage hover:shadow-[0_7px_0_-2px_rgba(9,51,36,0.34),0_13px_22px_rgba(9,51,36,0.18)]">
            <div className="relative border-b border-store-line/60 bg-[#fbfaf5]">
                <Link
                    to={`/products/${encodeURIComponent(product.id)}`}
                    className="flex h-[150px] items-center justify-center overflow-hidden p-3 no-underline sm:h-[158px]"
                    aria-label={name}
                >
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            className="h-full w-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-xs font-medium text-store-muted">
                            {t('customerUI.priceUnavailable', 'Product image unavailable')}
                        </div>
                    )}
                </Link>

                {validSale && (
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-[#e4483d] px-2 py-1 text-[11px] font-extrabold text-white shadow-sm">
                        -{discountPercent}%
                    </span>
                )}

                <button
                    type="button"
                    onClick={toggleFavorite}
                    disabled={!purchaseAllowed || savingFavorite}
                    aria-label={t(
                        favorite ? 'customerUI.removeFavorite' : 'customerUI.addFavorite',
                    )}
                    aria-pressed={favorite}
                    className={`absolute right-2.5 top-2.5 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-store-line bg-white/95 shadow-sm transition hover:scale-110 hover:bg-store-yellow disabled:opacity-60 ${favorite ? 'text-red-500' : 'text-store-green'}`}
                >
                    <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            <div className="flex min-w-0 flex-1 flex-col px-3.5 pb-3 pt-3">
                <p className="m-0 flex min-w-0 items-center justify-between gap-2 text-[10px] font-semibold text-store-muted">
                    <span className="min-w-0 truncate uppercase" title={category}>
                        {category}
                    </span>
                    <span className="max-w-[47%] shrink-0 truncate" title={product.sku}>
                        SKU: {product.sku}
                    </span>
                </p>

                <Link
                    to={`/products/${encodeURIComponent(product.id)}`}
                    className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-extrabold leading-5 text-store-ink no-underline hover:text-store-green"
                >
                    {name}
                </Link>

                <div className="mt-1.5 flex h-5 items-center gap-1.5">
                    <div className="flex shrink-0 items-center gap-px" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={12}
                                className={
                                    star <= Math.round(rating)
                                        ? 'fill-store-yellow text-store-ink'
                                        : 'fill-transparent text-store-ink/45'
                                }
                            />
                        ))}
                    </div>
                    <span className="truncate text-[10px] text-store-muted">
                        {rating} ({t('homePage.reviewCount', { count: reviewCount })})
                    </span>
                </div>

                {comboSummary && (
                    <div className="mt-2 h-10 min-w-0 text-xs leading-5 text-store-muted">
                        <p className="m-0 truncate" title={comboSummary.ingredients}>{comboSummary.ingredients}</p>
                        <p className="m-0 truncate font-semibold text-store-green" title={comboSummary.savings}>{comboSummary.savings || '\u00a0'}</p>
                    </div>
                )}
                <div className="mt-auto pt-2.5">
                    <div className="flex min-h-[16px] items-center gap-2">
                        {validSale && (
                            <span className="text-[11px] leading-4 text-store-muted line-through tabular-nums">
                                {formatCurrencyVnd(product.listPrice!)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-end gap-1">
                        <span
                            className={`font-price text-[20px] font-black leading-6 tabular-nums ${validSale ? 'text-[#d73a30]' : 'text-store-green'}`}
                        >
                            {product.priceLoading ? (
                                <Skeleton className="h-6 w-24" />
                            ) : unitPrice == null ? (
                                t('customerUI.priceUnavailable')
                            ) : (
                                formatCurrencyVnd(unitPrice)
                            )}
                        </span>
                        <span className="pb-0.5 text-xs font-bold text-store-muted">/ {unit}</span>
                    </div>
                </div>

                <div className="mt-2.5 border-t border-store-line/70 pt-2.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-store-ink">
                        <span>{t('homePage.totalPrice', 'Total Price:')}</span>
                        <span
                            className="truncate font-bold tabular-nums"
                            title={totalPrice == null ? undefined : formatCurrencyVnd(totalPrice)}
                        >
                            {totalPrice == null
                                ? '—'
                                : `${formatCurrencyVnd(totalPrice)} (×${quantity})`}
                        </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex h-9 shrink-0 items-center rounded-lg border border-store-line bg-white px-1">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(minQuantity, quantity - step))}
                                disabled={!purchaseAllowed || quantity <= minQuantity || !inStock}
                                aria-label={t('homePage.decreaseQuantity')}
                                className="grid h-7 w-6 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-store-ink hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="min-w-[23px] text-center text-xs font-bold tabular-nums text-store-ink">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + step)}
                                disabled={
                                    !purchaseAllowed || !inStock || (available != null && quantity + step > available)
                                }
                                aria-label={t('homePage.increaseQuantity')}
                                className="grid h-7 w-6 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-store-ink hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Plus size={13} strokeWidth={2.5} />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddToOrder}
                            disabled={
                                !purchaseAllowed || !inStock ||
                                unitPrice == null ||
                                (available != null && quantity > available)
                            }
                            className="h-9 min-w-0 flex-1 cursor-pointer rounded-lg border-0 bg-store-green px-2 text-[11px] font-bold text-white transition hover:bg-store-dark disabled:cursor-not-allowed disabled:bg-[#91a59d]"
                        >
                            {!purchaseAllowed ? (
                                t('customerUI.comboPreviewOnly')
                            ) : product.priceLoading ? (
                                <Skeleton className="mx-auto h-3 w-16" />
                            ) : unitPrice == null ? (
                                t('customerUI.priceUnavailable')
                            ) : inStock ? (
                                t('homePage.addToOrder', 'Add to Order')
                            ) : (
                                t('customerUI.outOfStock')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
