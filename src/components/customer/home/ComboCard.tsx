import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Skeleton from '@/components/common/Skeleton';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import type { HomeCombo } from '@/types/customer/home';

export default function ComboCard({ combo }: { combo?: HomeCombo }) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en');
    const name = combo ? (english ? combo.nameEn || combo.nameVi : combo.nameVi) : '';
    const separate = combo?.separateListPrice;
    const price = combo?.salePrice ?? combo?.listPrice;
    const savings = separate != null && price != null ? separate - price : null;
    return (
        <article
            aria-hidden={!combo || undefined}
            className="flex h-full min-w-0 flex-col overflow-hidden rounded-[22px] bg-white text-store-ink shadow-sm"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-store-cream">
                {!combo ? (
                    <Skeleton className="h-full w-full rounded-none" />
                ) : combo.imageUrl ? (
                    <img
                        src={combo.imageUrl}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <div className="grid h-full place-items-center text-store-sage">
                        <PackageOpen size={34} aria-hidden="true" />
                    </div>
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
                <div className="flex h-4 min-w-0 items-center text-[11px] font-bold text-store-muted">
                    {combo ? (
                        <span className="truncate">
                            {combo.servingCount
                                ? t('customerUI.comboServings', {
                                      count: combo.servingCount,
                                      ingredients: combo.items.length,
                                  })
                                : t('customerUI.comboIngredients', {
                                      count: combo.items.length,
                                  })}
                        </span>
                    ) : (
                        <Skeleton className="h-3 w-2/3" />
                    )}
                </div>
                <h3
                    title={name || undefined}
                    className="m-0 line-clamp-2 h-12 break-words font-subheading text-lg font-bold leading-6"
                >
                    {combo ? (
                        name
                    ) : (
                        <>
                            <Skeleton className="mt-1 h-4 w-full" />
                            <Skeleton className="mt-2 h-4 w-2/3" />
                        </>
                    )}
                </h3>
                <ul className="m-0 h-[84px] min-w-0 list-none space-y-1 overflow-hidden p-0 text-xs leading-4 text-store-muted">
                    {combo ? (
                        <>
                            {combo.items.slice(0, 3).map((item) => (
                                <li
                                    key={item.productId}
                                    className="flex min-w-0 items-center gap-2"
                                >
                                    <span
                                        className="min-w-0 flex-1 truncate"
                                        title={english ? item.nameEn || item.nameVi : item.nameVi}
                                    >
                                        {english ? item.nameEn || item.nameVi : item.nameVi}
                                    </span>
                                    <span className="shrink-0 tabular-nums">× {item.quantity}</span>
                                </li>
                            ))}
                            {combo.items.length > 3 && (
                                <li>
                                    {t('customerUI.comboMoreItems', {
                                        count: combo.items.length - 3,
                                    })}
                                </li>
                            )}
                        </>
                    ) : (
                        Array.from({ length: 4 }, (_, i) => (
                            <li key={i} className="flex h-4 items-center">
                                <Skeleton className="h-2.5 w-4/5" />
                            </li>
                        ))
                    )}
                </ul>
                <div className="mt-auto min-h-[112px] space-y-2 border-t border-store-line pt-3">
                    {combo ? (
                        <>
                            <div className="min-w-0 break-words font-price text-lg font-bold leading-6 text-store-green tabular-nums">
                                {combo.listPrice == null
                                    ? t('customerUI.priceUnavailable')
                                    : formatCurrencyVnd(combo.salePrice ?? combo.listPrice)}
                            </div>
                            <div
                                className="h-5 truncate text-xs font-semibold text-store-green"
                                title={
                                    savings != null && savings > 0
                                        ? `${t('customerUI.comboSavings', { amount: formatCurrencyVnd(savings) })} · ${t('customerUI.comboComparisonNote')}`
                                        : undefined
                                }
                            >
                                {savings != null && savings > 0
                                    ? t('customerUI.comboSavingsShort', {
                                          amount: formatCurrencyVnd(savings),
                                      })
                                    : savings === 0
                                      ? t('customerUI.comboSamePrice')
                                      : ' '}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[11px] text-store-muted">
                                    {(combo.availableQuantity ?? 0) > 0
                                        ? t('customerUI.comboAvailable', {
                                              count: combo.availableQuantity,
                                          })
                                        : t('customerUI.outOfStock')}
                                </span>
                                <Link
                                    to={`/products/${encodeURIComponent(combo.productId)}`}
                                    className="shrink-0 rounded-full bg-store-yellow px-3 py-2 text-xs font-bold text-store-ink no-underline"
                                >
                                    {t('customerUI.comboDetails')}
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-6 w-2/3" />
                            <Skeleton className="h-5 w-3/4" />
                            <div className="flex justify-between gap-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}
