import { ArrowRight, ImageIcon, Minus, Plus, ShoppingBasket, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/admin/authStore';
import { useCartStore } from '@/store/customer/cartStore';
import { formatCurrencyVnd } from '@/constants/customer/homeData';

export default function CartPage() {
    const { t } = useTranslation('storefront');
    const navigate = useNavigate();
    const session = useAuthStore((state) => state.session);
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const [message, setMessage] = useState('');
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    function continueToQuote() {
        if (!session) {
            navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.QUOTES } } });
            return;
        }
        if (session.user.role !== 'CUSTOMER') {
            setMessage(t('cart.customerOnly'));
            return;
        }
        setMessage(t('cart.quoteUnavailable'));
    }

    return (
        <div className="min-h-screen bg-store-cream text-store-ink">
            <Header />
            <main id="main-content" className="mx-auto min-h-[55vh] max-w-[1440px] px-5 py-10">
                <p className="m-0 text-xs font-bold tracking-widest uppercase text-store-green">Bite to Business</p>
                <h1 className="mt-2 mb-3 font-display text-4xl font-bold">{t('cart.title')}</h1>
                <p className="mb-8 text-sm text-store-muted">{t('cart.description')}</p>

                {items.length === 0 ? (
                    <section className="rounded-2xl border border-store-ink/20 bg-white p-10 text-center">
                        <ShoppingBasket className="mx-auto mb-4 text-store-green" size={36} aria-hidden="true" />
                        <h2 className="mb-3 font-subheading text-xl font-bold">{t('cart.empty')}</h2>
                        <Link to={ROUTES.HOME} className="font-bold text-store-green underline underline-offset-4">
                            {t('cart.browse')}
                        </Link>
                    </section>
                ) : (
                    <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
                        <section className="overflow-hidden rounded-2xl border border-store-ink/20 bg-white" aria-label={t('cart.items')}>
                            {items.map((item) => (
                                <article key={item.id} className="flex items-center gap-5 border-0 border-b border-solid border-store-ink/10 p-5 last:border-b-0">
                                    <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-store-cream text-store-green">
                                        {item.imageUrl ? <img src={item.imageUrl} alt="" className="size-full object-cover" /> : <ImageIcon size={26} aria-hidden="true" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="m-0 font-subheading text-base font-bold">{item.name}</h2>
                                        <p className="mt-1 mb-2 text-sm text-store-muted">{item.spec}</p>
                                        <span className="font-bold">{formatCurrencyVnd(item.unitPrice)}</span>
                                    </div>
                                    <div className="flex items-center rounded-lg border border-store-ink/30">
                                        <button type="button" className="grid size-9 place-items-center border-0 bg-transparent text-store-ink" onClick={() => updateQuantity(item.id, -1)} aria-label={t('cart.decrease', { name: item.name })}><Minus size={16} /></button>
                                        <span className="min-w-8 text-center font-bold" aria-label={t('cart.quantity')}>{item.quantity}</span>
                                        <button type="button" className="grid size-9 place-items-center border-0 bg-transparent text-store-ink" onClick={() => updateQuantity(item.id, 1)} aria-label={t('cart.increase', { name: item.name })}><Plus size={16} /></button>
                                    </div>
                                    <strong className="min-w-28 text-right">{formatCurrencyVnd(item.unitPrice * item.quantity)}</strong>
                                    <button type="button" className="grid size-9 place-items-center border-0 bg-transparent text-store-muted hover:text-danger" onClick={() => updateQuantity(item.id, -item.quantity)} aria-label={t('cart.remove', { name: item.name })}><Trash2 size={18} /></button>
                                </article>
                            ))}
                        </section>

                        <aside className="rounded-2xl border border-store-ink/20 bg-white p-6">
                            <h2 className="mb-5 font-subheading text-xl font-bold">{t('cart.summary')}</h2>
                            <div className="flex justify-between gap-3 border-0 border-b border-solid border-store-ink/10 pb-4">
                                <span>{t('cart.subtotal')}</span>
                                <strong>{formatCurrencyVnd(subtotal)}</strong>
                            </div>
                            <p className="my-4 text-sm leading-relaxed text-store-muted">{t('cart.estimateNote')}</p>
                            <button type="button" onClick={continueToQuote} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-0 bg-store-green px-4 py-3 font-bold text-white hover:opacity-90">
                                {session ? t('cart.continue') : t('cart.signIn')}
                                <ArrowRight size={17} aria-hidden="true" />
                            </button>
                            {message && <p role="status" className="mt-4 mb-0 text-sm text-store-ink">{message}</p>}
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
