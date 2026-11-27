import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCatalogQuery } from '@/hooks/customer/useCatalogQuery';
import { useTranslation } from 'react-i18next';
import { getHomeComboPage, getHomeCategories } from '@/services/customer/homeService';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { catalogPage } from '@/validations/catalogSearch';
import { ROUTES } from '@/router/routes';
import CatalogCategorySidebar from '@/components/customer/CatalogCategorySidebar';
import ProductShowcaseCard from './ProductShowcaseCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ComboCollection() {
    const { t } = useTranslation('storefront');
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const page = catalogPage(params.get('page'));
    const size = 12;
    const query = useCatalogQuery({
        queryKey: ['home-combos', page - 1, size],
        queryFn: ({ signal }) => getHomeComboPage(page - 1, size, signal),
    });
    const categories = useCatalogQuery({
        queryKey: ['catalogCategories'],
        queryFn: ({ signal }) => getHomeCategories(signal),
    });
    function changePage(next: number) {
        setParams((previous) => {
            const result = new URLSearchParams(previous);
            if (next === 1) result.delete('page');
            else result.set('page', String(next));
            return result;
        });
    }
    const pageButton =
        'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-store-ink bg-white px-3 text-xs font-bold text-store-ink hover:bg-surface-yellow disabled:cursor-not-allowed disabled:opacity-40';
    return (
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] xl:gap-8">
            <CatalogCategorySidebar
                categories={categories.data ?? []}
                categoryError={categories.isError}
                categoryLoading={categories.isPending}
                comboActive
                onCategorySelect={(id) => navigate(id ? `${ROUTES.CATALOG}?category=${encodeURIComponent(id)}` : ROUTES.CATALOG)}
            />
            <section className="min-w-0" aria-busy={query.isPending}>
                <h2 className="m-0 mt-2 font-subheading text-xl font-bold">
                    {t('customerUI.collection.combos')}
                </h2>
                {query.isError && (
                    <p role="alert" className="mt-6 text-danger">
                        {t('homePage.productsError')}
                    </p>
                )}
                {query.isSuccess && !query.data.items.length && (
                    <div className="mt-5 flex min-h-48 flex-col items-center justify-center rounded-xl bg-white p-6 text-center">
                        <PackageSearch size={34} className="text-store-sage" />
                        <p className="text-sm text-store-muted">{t('customerUI.comboEmpty')}</p>
                    </div>
                )}
                <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {query.isPending
                        ? Array.from({ length: size }, (_, i) => (
                              <ProductCardSkeleton key={i} combo />
                          ))
                        : query.data?.items.map((combo) => {
                              const price =
                                  combo.salePrice != null &&
                                  combo.listPrice != null &&
                                  combo.salePrice < combo.listPrice
                                      ? combo.salePrice
                                      : combo.listPrice;
                              const savings =
                                  price != null && combo.separateListPrice != null
                                      ? combo.separateListPrice - price
                                      : null;
                              return (
                                  <ProductShowcaseCard
                                      key={combo.productId}
                                      product={{
                                          id: combo.productId,
                                          sku: combo.sku,
                                          name: combo.nameVi,
                                          nameVi: combo.nameVi,
                                          nameEn: combo.nameEn,
                                          categoryLabel: t('header.combos'),
                                          spec: 'COMBO',
                                          unit: 'COMBO',
                                          certBadge: '',
                                          imageUrl: combo.imageUrl ?? '',
                                          listPrice: combo.listPrice,
                                          salePrice: combo.salePrice ?? undefined,
                                          availableQuantity: combo.availableQuantity,
                                          minOrderQuantity: combo.minOrderQuantity,
                                          quantityStep: combo.quantityStep,
                                          rating: combo.averageRating ?? undefined,
                                          reviewCount: combo.reviewCount,
                                      }}
                                      comboSummary={{
                                          ingredients: combo.servingCount
                                              ? t('customerUI.comboServings', {
                                                    count: combo.servingCount,
                                                    ingredients: combo.items.length,
                                                })
                                              : t('customerUI.comboIngredients', {
                                                    count: combo.items.length,
                                                }),
                                          savings:
                                              savings != null && savings > 0
                                                  ? t('customerUI.comboSavingsShort', {
                                                        amount: formatCurrencyVnd(savings),
                                                    })
                                                  : savings === 0
                                                    ? t('customerUI.comboSamePrice')
                                                    : '',
                                      }}
                                  />
                              );
                          })}
                </div>
                {(page > 1 || query.data?.hasNext) && (
                    <nav
                        aria-label={t('homePage.paginationLabel')}
                        className="mt-8 flex flex-wrap items-center justify-end gap-2 border-t border-store-ink/15 pt-4"
                    >
                        <button
                            type="button"
                            className={pageButton}
                            disabled={page === 1 || query.isPending}
                            onClick={() => changePage(page - 1)}
                        >
                            <ChevronLeft size={16} />
                            {t('customerUI.comboPrevious')}
                        </button>
                        <span className="rounded-lg bg-store-yellow px-3 py-2 text-xs font-bold tabular-nums">
                            {t('customerUI.comboPage', { page })}
                        </span>
                        <button
                            type="button"
                            className={pageButton}
                            disabled={!query.data?.hasNext || query.isPending}
                            onClick={() => changePage(page + 1)}
                        >
                            {t('customerUI.comboNext')}
                            <ChevronRight size={16} />
                        </button>
                    </nav>
                )}
            </section>
        </div>
    );
}
