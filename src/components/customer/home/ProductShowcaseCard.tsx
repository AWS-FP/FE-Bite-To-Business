import { Minus, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatCurrencyVnd } from '../../../constants/customer/homeData';
import type { HomeProductCardItem } from '../../../constants/customer/homeData';
import { useCartStore } from '../../../store/customer/cartStore';

export default function ProductShowcaseCard({ product }: { product: HomeProductCardItem }) {
    const { t } = useTranslation('storefront');
    const [quantity, setQuantity] = useState(4);
    const addItemToCart = useCartStore((state) => state.addItem);

    const activeUnitPrice = product.salePrice ?? product.listPrice;
    const totalPrice = activeUnitPrice * quantity;

    function handleAddToOrder() {
        addItemToCart(
            {
                id: product.id,
                name: product.name,
                spec: product.spec,
                unitPrice: activeUnitPrice,
                imageUrl: product.imageUrl,
            },
            quantity,
        );
    }

    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border border-solid border-[#D6CFC2] bg-white shadow-[0_3px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
            <Link
                to={`/products/${product.id}`}
                className="relative block h-[200px] w-full overflow-hidden bg-[#EBE6DC] no-underline"
            >
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#133425]">
                            [ Food Image — {product.sku} ]
                        </span>
                        <span className="mt-1 text-[11px] text-[#6B7280]">
                            Click to view Product Details
                        </span>
                    </div>
                )}

                {product.topLeftBadge && (
                    <span className="absolute top-3 left-3 rounded-full border border-solid border-[#14132b] bg-[#FACC15] px-3 py-1 text-[11px] font-extrabold text-[#14132b] shadow-[1px_1px_0_#14132b]">
                        {product.topLeftBadge}
                    </span>
                )}

                {product.discountBadge && (
                    <span className="absolute top-3 right-3 rounded-full border border-solid border-[#14132b] bg-[#F9C6D3] px-3 py-1 text-[11px] font-extrabold text-[#14132b]">
                        {product.discountBadge}
                    </span>
                )}

                <span className="absolute right-3 bottom-3 rounded-md bg-[#133425] px-2.5 py-1 text-[10px] font-bold text-white">
                    {product.certBadge}
                </span>
            </Link>

            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-[#5C6B62]">
                        <span>{product.categoryLabel}</span>
                        <span>SKU: {product.sku}</span>
                    </div>

                    <Link
                        to={`/products/${product.id}`}
                        className="mt-1.5 block font-serif text-lg font-bold leading-snug text-[#14132b] no-underline hover:text-[#133425]"
                    >
                        {product.name}
                    </Link>

                    <div className="mt-2 flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    className={
                                        star <= Math.round(product.rating)
                                            ? 'fill-[#FACC15] text-[#14132b]'
                                            : 'fill-transparent text-[#14132b]'
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-[11px] text-[#7A7D85]">
                            {product.rating} ({product.reviewCount} reviews)
                        </span>
                    </div>

                    <div className="mt-3">
                        {product.salePrice ? (
                            <>
                                <div className="text-sm font-medium text-[#2F5242] line-through">
                                    {formatCurrencyVnd(product.listPrice)} / {product.unit}
                                </div>
                                <div className="mt-0.5 text-right text-2xl font-black text-[#DC2626]">
                                    {formatCurrencyVnd(product.salePrice)}{' '}
                                    <span className="text-base font-bold">/ {product.unit}</span>
                                </div>
                            </>
                        ) : (
                            <div className="mt-2 text-2xl font-black text-[#133425]">
                                {formatCurrencyVnd(product.listPrice)}{' '}
                                <span className="text-base font-bold">/ {product.unit}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 border-0 border-t border-solid border-[#14132b]/15 pt-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#14132b]">
                        <span>{t('homePage.totalPrice', 'Total Price:')}</span>
                        <span>
                            {formatCurrencyVnd(totalPrice)} (x{quantity})
                        </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="flex h-9 items-center rounded-lg border border-solid border-[#14132b] bg-white px-2">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                aria-label="Decrease quantity"
                                className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent text-[#14132b] hover:text-[#DC2626]"
                            >
                                <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="min-w-[26px] text-center text-xs font-extrabold text-[#14132b]">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                aria-label="Increase quantity"
                                className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent text-[#14132b] hover:text-[#15803D]"
                            >
                                <Plus size={13} strokeWidth={2.5} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToOrder}
                            className="h-9 flex-1 cursor-pointer rounded-lg border-0 bg-[#133425] px-4 text-xs font-bold text-white transition-colors hover:bg-[#1b4934]"
                        >
                            {t('homePage.addToOrder', 'Add to Order')}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
