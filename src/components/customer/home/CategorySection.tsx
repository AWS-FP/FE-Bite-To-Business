import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/router/routes';
import { useHomeModelContext } from './HomeModel';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryArtwork from '../CategoryArtwork';
import Skeleton from '@/components/common/Skeleton';

export default function CategorySection() {
    const { t, categories, loadingCategories, categoryError } = useHomeModelContext();
    const { i18n } = useTranslation('storefront');
    return (
        <section
            id="catalog-categories"
            className="mx-auto max-w-[1320px] scroll-mt-32 px-4 pb-10 pt-12 sm:px-6"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-store-yellow">
                        {t('customerUI.categoriesTag')}
                    </span>
                    <h2 className="m-0 mt-1 font-subheading text-4xl font-bold text-store-cream">
                        {t('homePage.ecosystemTitle', 'Comprehensive Ingredient Catalog')}
                    </h2>
                </div>
                <Link
                    to={ROUTES.CATALOG}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-store-ink bg-store-cream px-5 py-3 text-xs font-extrabold text-store-ink no-underline"
                >
                    {t('customerUI.showAllProducts')} <ArrowRight size={15} />
                </Link>
            </div>
            <div
                aria-busy={loadingCategories}
                className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7"
            >
                {loadingCategories
                    ? Array.from({ length: 14 }, (_, i) => (
                          <div
                              key={i}
                              aria-hidden="true"
                              className="flex min-h-[206px] flex-col gap-2 rounded-2xl border border-store-line bg-white p-4"
                          >
                              <Skeleton className="h-4 w-16 rounded-full" />
                              <Skeleton className="ml-auto mt-auto size-14 rounded-xl" />
                              <Skeleton className="h-5 w-4/5" />
                              <Skeleton className="h-3 w-2/3" />
                          </div>
                      ))
                    : categories.map((cat) => (
                          <Link
                              key={cat.id}
                              to={`${ROUTES.CATALOG}?category=${encodeURIComponent(cat.id)}`}
                              className="group relative flex min-h-[206px] flex-col overflow-hidden rounded-2xl border border-store-line bg-white p-4 text-store-ink no-underline shadow-sm transition hover:-translate-y-1 hover:bg-surface-yellow hover:shadow-lg"
                          >
                              <div className="pointer-events-none absolute bottom-2 right-1 group-hover:scale-110">
                                  <CategoryArtwork
                                      categoryKey={`${cat.code} ${cat.nameEn} ${cat.nameVi}`}
                                      iconUrl={cat.imageSvg ?? ''}
                                  />
                              </div>
                              <span className="relative z-10 self-start rounded-full border border-store-ink bg-surface-green px-2 py-0.5 text-[10px] font-extrabold">
                                  {cat.productCount} SKU
                              </span>
                              <div className="relative z-10 mt-auto min-w-0">
                                  <h3 className="m-0 font-subheading text-[19px] font-bold leading-tight">
                                      {i18n.resolvedLanguage?.startsWith('en')
                                          ? cat.nameEn
                                          : cat.nameVi}
                                  </h3>
                                  <p className="m-0 mt-1 line-clamp-2 text-[11px] text-store-muted">
                                      {(i18n.resolvedLanguage?.startsWith('en')
                                          ? cat.descriptionEn
                                          : cat.descriptionVi) ?? ''}
                                  </p>
                              </div>
                          </Link>
                      ))}
            </div>
            {!loadingCategories && categories.length === 0 && (
                <p className="text-sm text-white/80" role={categoryError ? 'alert' : undefined}>
                    {t(categoryError ? 'homePage.productsError' : 'customerUI.emptyCategories')}
                </p>
            )}
        </section>
    );
}
