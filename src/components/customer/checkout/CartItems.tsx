import { ImageIcon, ShoppingBasket, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { ROUTES } from '@/router/routes';
import { cartRules, useCartStore, type CartItem } from '@/store/customer/cartStore';
import CartQuantityControl from './CartQuantityControl';

const productPath = (id: string) =>
    ROUTES.PRODUCT_DETAIL.replace(':productId', encodeURIComponent(id));

interface CartItemsProps {
    items: CartItem[];
    updateQuantity: (id: string, delta: number) => void;
}

export default function CartItems({ items }: CartItemsProps) {
    const { t, i18n } = useTranslation('quote');
    const english = i18n.resolvedLanguage === 'en';
    const setQuantity = useCartStore((state) => state.setQuantity);
    const setSelected = useCartStore((state) => state.setSelected);
    const selectAll = useCartStore((state) => state.selectAll);
    return (
        <section className="overflow-hidden rounded-2xl border border-store-ink/20 bg-white">
            <div className="flex items-center justify-between border-b border-store-ink/10 px-6 py-5">
                <div>
                    <h2 className="m-0 font-subheading text-xl font-bold">{t('cartTitle')}</h2>
                    <p className="mb-0 mt-1 text-sm text-store-muted">
                        {t('productCount', { count: items.length })}
                    </p>
                    {items.length > 0 && <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold"><input type="checkbox" className="size-4 accent-store-green" checked={items.every((item) => item.selected)} onChange={(event) => selectAll(event.target.checked)} />{t('selectAll')}</label>}
                </div>
                <ShoppingBasket className="text-store-green" />
            </div>
            {items.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <ShoppingBasket className="mx-auto mb-3 text-store-green" size={36} />
                    <p>{t('emptyCart')}</p>
                    <Link className="font-bold text-store-green underline" to={ROUTES.HOME}>
                        {t('browse')}
                    </Link>
                </div>
            ) : (
                items.map((item) => (
                    <article
                        key={item.id}
                        className="flex items-center gap-4 border-b border-store-ink/10 p-5 last:border-b-0"
                    >
                        <input type="checkbox" className="size-5 shrink-0 cursor-pointer accent-store-green" checked={item.selected === true} onChange={(event) => setSelected(item.id, event.target.checked)} aria-label={t('selectProduct', { name: (english ? item.nameEn : item.nameVi) || item.name })} />
                        <Link
                            to={productPath(item.id)}
                            tabIndex={-1}
                            aria-hidden="true"
                            className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-store-cream text-store-green"
                        >
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            ) : (
                                <ImageIcon size={26} />
                            )}
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h3 className="m-0 font-bold">
                                <Link
                                    to={productPath(item.id)}
                                    className="text-store-ink no-underline hover:text-store-green hover:underline"
                                >
                                    {(english ? item.nameEn : item.nameVi) || item.name}
                                </Link>
                            </h3>
                            <p className="my-1 text-sm text-store-muted">
                                {(english ? item.specEn : item.specVi) || item.spec}
                            </p>
                            <span className="font-bold">{formatCurrencyVnd(item.unitPrice)}</span>
                            {(() => {
                                const { min, max, cap } = cartRules(item);
                                return (
                                    <>
                                        <p className="mb-0 mt-1 text-xs text-store-muted">MOQ: {min}</p>
                                        {max != null && cap != null && cap < min && (
                                            <p role="alert" className="mb-0 mt-1 text-xs font-bold text-red-700">
                                                {t('stockBelowMinimum', { stock: max })}
                                            </p>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        {/* At the MOQ "-" is disabled; the trash button at the end removes the line. */}
                        <CartQuantityControl
                            item={item}
                            label={(english ? item.nameEn : item.nameVi) || item.name}
                        />
                        <strong className="min-w-28 text-right">
                            {formatCurrencyVnd(item.unitPrice * item.quantity)}
                        </strong>
                        <button
                            type="button"
                            aria-label={t('remove', {
                                name: (english ? item.nameEn : item.nameVi) || item.name,
                            })}
                            className="border-0 bg-transparent p-2 text-store-muted hover:text-danger"
                            onClick={() => setQuantity(item.id, 0)}
                        >
                            <Trash2 size={18} />
                        </button>
                    </article>
                ))
            )}
        </section>
    );
}
