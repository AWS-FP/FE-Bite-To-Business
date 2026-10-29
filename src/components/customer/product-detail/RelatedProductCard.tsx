import { Minus, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrencyVnd } from '../../../constants/customer/homeData';
import type { HomeProductCardItem } from '../../../constants/customer/homeData';
import { useCartStore } from '../../../store/customer/cartStore';
import { routePaths } from '../../../router/routes';
const getProductDetailPath = routePaths.productDetail;

export default function RelatedProductCard({
                                               product,
                                               onSelectProduct,
                                           }: {
    product: HomeProductCardItem;
    onSelectProduct: (id: string) => void;
}) {
    const [qty, setQty] = useState(4);
    const addItemToCart = useCartStore((state) => state.addItem);
    const unitPrice = product.salePrice ?? product.listPrice;
    const total = unitPrice * qty;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border-2 border-solid border-[#14132b] bg-[#14132b] shadow-[4px_4px_0_#14132b] transition-all duration-300 hover:-translate-y-1">
            <Link
                to={getProductDetailPath(product.id)}
                onClick={() => onSelectProduct(product.id)}
                className="relative block h-[190px] w-full cursor-pointer overflow-hidden rounded-t-[14px] bg-[#E2E8F0] no-underline"
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
                        <span className="mt-1 text-[11px] text-slate-500">
                            Put imageUrl in homeData.ts
                        </span>
                    </div>
                )}

                {product.topLeftBadge && (
                    <span className="absolute top-3 left-3 rounded-full border border-solid border-[#14132b] bg-[#FACC15] px-3 py-1 text-[11px] font-extrabold text-[#14132b] shadow-[1px_1px_0_#14132b]">
                        {product.topLeftBadge}
                    </span>
                )}

                <span className="absolute right-3 bottom-3 rounded-md bg-[#133425] px-2.5 py-1 text-[10px] font-bold text-white">
                    {product.certBadge}
                </span>
            </Link>

            <div className="flex flex-1 flex-col justify-between rounded-b-[14px] bg-white p-4">
                <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        <span>{product.categoryLabel}</span>
                        <span>SKU: {product.sku}</span>
                    </div>

                    <Link
                        to={getProductDetailPath(product.id)}
                        onClick={() => onSelectProduct(product.id)}
                        className="mt-1.5 block cursor-pointer border-0 bg-transparent p-0 text-left font-serif text-lg font-bold leading-snug text-[#14132b] no-underline hover:text-[#133425]"
                    >
                        {product.name}
                    </Link>

                    <div className="mt-2 flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={13}
                                    className={
                                        s <= Math.round(product.rating)
                                            ? 'fill-[#FACC15] text-[#14132b]'
                                            : 'fill-transparent text-slate-300'
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                            {product.rating} ({product.reviewCount} reviews)
                        </span>
                    </div>

                    <div className="mt-3 text-2xl font-black text-[#133425]">
                        {formatCurrencyVnd(unitPrice)}{' '}
                        <span className="text-base font-bold">/ {product.unit}</span>
                    </div>
                </div>

                <div className="mt-4 border-0 border-t border-solid border-slate-200 pt-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#14132b]">
                        <span>Total Price:</span>
                        <span>
                            {formatCurrencyVnd(total)} (x{qty})
                        </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="flex h-9 items-center rounded-lg border border-solid border-[#14132b] bg-slate-50 px-2">
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent text-[#14132b]"
                            >
                                <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="min-w-[24px] text-center text-xs font-extrabold text-[#14132b]">
                                {qty}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQty((q) => q + 1)}
                                className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent text-[#14132b]"
                            >
                                <Plus size={12} strokeWidth={2.5} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                addItemToCart(
                                    {
                                        id: product.id,
                                        name: product.name,
                                        spec: product.spec,
                                        unitPrice,
                                        imageUrl: product.imageUrl,
                                    },
                                    qty,
                                )
                            }
                            className="h-9 flex-1 cursor-pointer rounded-lg border-0 bg-[#133425] px-4 text-xs font-bold text-white transition-colors hover:bg-[#1b4934]"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
