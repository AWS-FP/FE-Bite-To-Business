import { ImageIcon, Minus, Plus, ShoppingBasket, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { ROUTES } from '@/router/routes';
import type { CartItem } from '@/store/customer/cartStore';

interface CartItemsProps {
    items: CartItem[];
    updateQuantity: (id: string, delta: number) => void;
}

export default function CartItems({ items, updateQuantity }: CartItemsProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-store-ink/20 bg-white">
            <div className="flex items-center justify-between border-b border-store-ink/10 px-6 py-5">
                <div>
                    <h2 className="m-0 font-subheading text-xl font-bold">Sản phẩm trong giỏ</h2>
                    <p className="mb-0 mt-1 text-sm text-store-muted">{items.length} sản phẩm</p>
                </div>
                <ShoppingBasket className="text-store-green" />
            </div>
            {items.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <ShoppingBasket className="mx-auto mb-3 text-store-green" size={36} />
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <Link className="font-bold text-store-green underline" to={ROUTES.HOME}>
                        Xem sản phẩm
                    </Link>
                </div>
            ) : (
                items.map((item) => (
                    <article
                        key={item.id}
                        className="flex items-center gap-4 border-b border-store-ink/10 p-5 last:border-b-0"
                    >
                        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-store-cream text-store-green">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <ImageIcon size={26} />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="m-0 font-bold">{item.name}</h3>
                            <p className="my-1 text-sm text-store-muted">{item.spec}</p>
                            <span className="font-bold">{formatCurrencyVnd(item.unitPrice)}</span>
                        </div>
                        <div className="flex items-center rounded-lg border border-store-ink/25">
                            <button
                                type="button"
                                aria-label={`Giảm số lượng ${item.name}`}
                                className="grid size-9 place-items-center border-0 bg-transparent"
                                onClick={() => updateQuantity(item.id, -1)}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="min-w-8 text-center font-bold">{item.quantity}</span>
                            <button
                                type="button"
                                aria-label={`Tăng số lượng ${item.name}`}
                                className="grid size-9 place-items-center border-0 bg-transparent"
                                onClick={() => updateQuantity(item.id, 1)}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <strong className="min-w-28 text-right">
                            {formatCurrencyVnd(item.unitPrice * item.quantity)}
                        </strong>
                        <button
                            type="button"
                            aria-label={`Xóa ${item.name}`}
                            className="border-0 bg-transparent p-2 text-store-muted hover:text-danger"
                            onClick={() => updateQuantity(item.id, -item.quantity)}
                        >
                            <Trash2 size={18} />
                        </button>
                    </article>
                ))
            )}
        </section>
    );
}
