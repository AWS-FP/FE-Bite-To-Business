import { Minus, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatCurrencyVnd } from '../../../constants/customer/homeData';
import type { HomeProductCardItem } from '../../../constants/customer/homeData';
import { useCartStore } from '../../../store/customer/cartStore';

export default function ProductShowcaseCard({
    product,
    section = 'flash',
}: {
    product: HomeProductCardItem;
    section?: 'flash' | 'standard';
}) {
    const { t, i18n } = useTranslation('storefront');
    const [quantity, setQuantity] = useState(4);
    const addItemToCart = useCartStore((state) => state.addItem);

    const productKey = `homeProducts.${section}.${product.id}`;
    const categoryKey = product.categoryLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const localizedName = i18n.resolvedLanguage?.startsWith('en')
        ? product.nameEn ?? product.name
        : product.nameVi ?? product.name;
    const localizedSpec = t(`${productKey}.spec`, product.spec);
    const localizedUnit = t(`homePage.units.${product.unit}`, product.unit);
    const localizedCategory = t(`homePage.productCategories.${categoryKey}`, product.categoryLabel);
    const activeUnitPrice = product.salePrice ?? product.listPrice;
    const totalPrice = activeUnitPrice * quantity;

    function handleAddToOrder() {
        addItemToCart(
            {
                id: product.id,
                name: localizedName,
                spec: localizedSpec,
                unitPrice: product.listPrice,
                imageUrl: product.imageUrl,
            },
            quantity,
        );
    }

    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border border-solid border-store-line bg-white shadow-[0_3px_10px_color-mix(in_srgb,_var(--color-black)_6%,_transparent)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_color-mix(in_srgb,_var(--color-black)_12%,_transparent)]">
            <Link
                to={`/products/${product.id}`}
                className="relative block h-[200px] w-full overflow-hidden bg-surface-yellow no-underline"
            >
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={localizedName}
                        className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-store-ink">
                            {t('homePage.foodImage', { sku: product.sku })}
                        </span>
                        <span className="mt-1 text-[11px] text-store-muted">
                            {t('homePage.viewProductDetails')}
                        </span>
                    </div>
                )}

                {product.topLeftBadge && (
                    <span className="absolute top-3 left-3 rounded-full border border-solid border-store-ink bg-store-yellow px-3 py-1 text-[11px] font-extrabold text-store-ink shadow-[1px_1px_0_var(--color-store-ink)]">
                        {t(`homePage.productBadges.${product.topLeftBadge}`, product.topLeftBadge)}
                    </span>
                )}

                {product.discountBadge && (
                    <span className="absolute top-3 right-3 rounded-full border border-solid border-store-ink bg-surface-pink px-3 py-1 text-[11px] font-extrabold text-store-ink">
                        {t('homePage.discountBadge', {
                            percent: product.discountBadge.match(/\d+/)?.[0] ?? '0',
                        })}
                    </span>
                )}

                {product.certBadge && <span className="absolute right-3 bottom-3 rounded-md bg-store-green px-2.5 py-1 text-[10px] font-bold text-white">
                    {t(`homePage.productBadges.${product.certBadge}`, product.certBadge)}
                </span>}
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-store-muted">
                        <span>{localizedCategory}</span>
                        <span>SKU: {product.sku}</span>
                    </div>

                    <Link
                        to={`/products/${product.id}`}
                        className="mt-1.5 block font-subheading lining-nums text-lg font-bold leading-snug text-store-ink no-underline hover:text-store-ink"
                    >
                        {localizedName}
                    </Link>

                    {product.rating != null && product.reviewCount != null && <div className="mt-2 flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    className={
                                        star <= Math.round(product.rating ?? 0)
                                            ? 'fill-store-yellow text-store-ink'
                                            : 'fill-transparent text-store-ink'
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-[11px] text-store-muted">
                            {product.rating} (
                            {t('homePage.reviewCount', { count: product.reviewCount })})
                        </span>
                    </div>}

                    {/* Both discounted and regular products reserve exactly the same price space.
                        The current price sits on one baseline and starts at the same left edge. */}
                    <div className="mt-auto flex min-h-[82px] flex-col justify-end pt-3">
                        <div className="flex h-5 items-end">
                            {product.salePrice != null ? (
                                <span className="font-price text-sm leading-5 text-store-ink line-through tabular-nums">
                                    {formatCurrencyVnd(product.listPrice)} / {localizedUnit}
                                </span>
                            ) : (
                                <span aria-hidden="true" className="invisible text-sm">
                                    –
                                </span>
                            )}
                        </div>
                        <div className="flex h-9 items-end gap-1 whitespace-nowrap">
                            <span
                                className={`font-price text-[24px] font-black leading-none lining-nums tabular-nums ${product.salePrice != null ? 'text-danger' : 'text-store-ink'}`}
                            >
                                {formatCurrencyVnd(activeUnitPrice)}
                            </span>
                            <span
                                className={`font-price pb-0.5 text-sm font-bold leading-none ${product.salePrice != null ? 'text-danger' : 'text-store-ink'}`}
                            >
                                / {localizedUnit}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 border-0 border-t border-solid border-store-ink/15 pt-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-store-ink">
                        <span>{t('homePage.totalPrice', 'Total Price:')}</span>
                        <span>
                            {formatCurrencyVnd(totalPrice)} (x{quantity})
                        </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="flex h-9 items-center rounded-lg border border-solid border-store-ink bg-white px-2">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                aria-label={t('homePage.decreaseQuantity')}
                                className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent text-store-ink hover:text-danger"
                            >
                                <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="font-price min-w-[26px] text-center text-xs font-extrabold text-store-ink">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                aria-label={t('homePage.increaseQuantity')}
                                className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent text-store-ink hover:text-success"
                            >
                                <Plus size={13} strokeWidth={2.5} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToOrder}
                            className="h-9 flex-1 cursor-pointer rounded-lg border-0 bg-store-green px-4 text-xs font-bold text-white transition-colors hover:bg-store-green"
                        >
                            {t('homePage.addToOrder', 'Add to Order')}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
