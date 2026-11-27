import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { useCatalogQuery } from '@/hooks/customer/useCatalogQuery';
import { getHomeCombo } from '@/services/customer/homeService';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import Skeleton from '@/components/common/Skeleton';

export default function ComboIngredients({ productId }: { productId: string }) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en');
    const query = useCatalogQuery({
        queryKey: ['home-combo', productId],
        queryFn: ({ signal }) => getHomeCombo(productId, signal),
    });
    const combo = query.data;
    const separate = combo?.separateListPrice;
    const price = combo?.salePrice ?? combo?.listPrice;
    const savings = separate != null && price != null ? separate - price : null;
    return (
        <section
            aria-busy={query.isPending}
            className="mt-6 rounded-xl bg-white p-5 text-store-ink"
        >
            <h2 className="mb-3 font-subheading text-lg font-bold">
                {t('customerUI.comboIngredientsHeading')}
            </h2>
            {query.isPending ? (
                <>
                    <div className="mb-4 space-y-3 rounded-xl border border-store-green/15 bg-store-cream/40 p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {[0, 1].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-3 w-3/4" />
                                    <Skeleton className="h-5 w-1/2" />
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="flex gap-3 border-b border-store-line py-3">
                            <Skeleton className="size-12" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </>
            ) : query.isError ? (
                <p role="alert" className="text-sm text-store-muted">
                    {t('homePage.productsError')}
                </p>
            ) : (
                <div>
                    <div className="mb-4 rounded-xl border border-store-green/15 bg-store-cream/40 p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <p className="m-0 text-xs text-store-muted">
                                    {t('customerUI.comboSeparatePrice')}
                                </p>
                                <p className="m-0 font-bold tabular-nums">
                                    {separate == null
                                        ? t('customerUI.priceUnavailable')
                                        : formatCurrencyVnd(separate)}
                                </p>
                            </div>
                            <div>
                                <p className="m-0 text-xs text-store-muted">
                                    {t('customerUI.comboPrice')}
                                </p>
                                <p className="m-0 font-bold text-store-green tabular-nums">
                                    {price == null
                                        ? t('customerUI.priceUnavailable')
                                        : formatCurrencyVnd(price)}
                                </p>
                            </div>
                        </div>
                        <p className="mb-0 mt-3 text-sm font-semibold text-store-dark">
                            {savings == null
                                ? t('customerUI.comboComparisonUnavailable')
                                : savings > 0
                                  ? t('customerUI.comboSavings', {
                                        amount: formatCurrencyVnd(savings),
                                    })
                                  : savings === 0
                                    ? t('customerUI.comboSamePrice')
                                    : t('customerUI.comboHigherPrice', {
                                          amount: formatCurrencyVnd(-savings),
                                      })}
                        </p>
                        <p className="mb-0 mt-1 text-xs text-store-muted">
                            {t('customerUI.comboComparisonNote')}
                        </p>
                    </div>
                    <div className="divide-y divide-store-line">
                        {query.data?.items.map((item) => (
                            <Link
                                key={item.productId}
                                to={`/products/${encodeURIComponent(item.productId)}`}
                                className="flex min-w-0 items-center gap-3 py-3 text-store-ink no-underline hover:text-store-green"
                            >
                                <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-store-cream">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt=""
                                            className="size-full object-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Package size={20} />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="break-words text-sm font-bold">
                                        {english ? item.nameEn || item.nameVi : item.nameVi}
                                    </div>
                                    <div className="break-all text-xs text-store-muted">
                                        {item.sku}
                                    </div>
                                </div>
                                <span className="shrink-0 text-sm font-semibold tabular-nums">
                                    {item.quantity}{' '}
                                    {t(
                                        `homePage.units.${item.unitCode.toLowerCase()}`,
                                        item.unitCode,
                                    )}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
