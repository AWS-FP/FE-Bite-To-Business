import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHomeModelContext } from './HomeModel';
import { formatCurrencyVnd } from '@/constants/customer/homeData';

export default function CombosSection() {
    const { combos } = useHomeModelContext();
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en');
    return (
        <section id="fb-combo-packages" className="mx-auto max-w-[1320px] px-5 pt-12 pb-8">
            <h2 className="m-0 font-subheading text-4xl font-bold text-store-cream">
                {t('customerUI.comboTitle')}
            </h2>
            <div className="mt-7 grid gap-6 md:grid-cols-3">
                {combos.map((combo) => (
                    <article
                        key={combo.productId}
                        className="flex flex-col overflow-hidden rounded-[22px] bg-white text-store-ink shadow-[0_12px_24px_rgba(0,0,0,.13)]"
                    >
                        <div className="h-48 bg-store-cream">
                            {combo.imageUrl ? (
                                <img
                                    src={combo.imageUrl}
                                    alt={english ? combo.nameEn : combo.nameVi}
                                    className="h-full w-full object-cover"
                                />
                            ) : null}
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-[11px] font-bold text-store-muted">
                                {t('customerUI.comboServings', {
                                    count: combo.servingCount ?? 0,
                                    ingredients: combo.items.length,
                                })}
                            </span>
                            <h3 className="m-0 font-subheading text-xl font-bold">
                                {english ? combo.nameEn : combo.nameVi}
                            </h3>
                            <ul className="m-0 list-disc pl-5 text-xs text-store-muted">
                                {combo.items.slice(0, 4).map((item) => (
                                    <li key={item.productId}>
                                        {english ? item.nameEn?.trim() || item.sku : item.nameVi} ×{' '}
                                        {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                                <div>
                                    <strong className="font-price text-2xl">
                                        {formatCurrencyVnd(combo.salePrice ?? combo.listPrice ?? 0)}
                                    </strong>
                                    <p className="m-0 text-[11px] text-store-muted">
                                        {combo.availableQuantity > 0
                                            ? t('customerUI.comboAvailable', {
                                                  count: combo.availableQuantity,
                                              })
                                            : t('customerUI.comboSoldOut')}
                                    </p>
                                </div>
                                <Link
                                    to={`/products/${combo.productId}`}
                                    className="rounded-full bg-store-yellow px-4 py-2 text-xs font-bold text-store-ink no-underline"
                                >
                                    {t('customerUI.comboDetails')}
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            {combos.length === 0 && (
                <p className="text-sm text-white/80">{t('customerUI.comboEmpty')}</p>
            )}
        </section>
    );
}
