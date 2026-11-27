import { useTranslation } from 'react-i18next';
import { PackageSearch } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import type { HomeCategory } from '@/types/customer/home';
import { useCatalogBrowser } from '@/hooks/customer/useCatalogBrowser';
import SectionPaginationBar from '@/components/customer/home/SectionPaginationBar';
import ProductCardSkeleton from '@/components/customer/home/ProductCardSkeleton';
import CatalogShowcaseCard from '@/components/customer/CatalogShowcaseCard';
import CatalogCategorySidebar from '@/components/customer/CatalogCategorySidebar';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

export default function CustomerCatalogPage() {
    const { t, i18n } = useTranslation('storefront');

    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;

    const {
        categories,
        categoryError,
        categoryLoading,
        pageData,
        loading,
        error,
        categoryId,
        query,
        page,
        size,
        selected,
        categoryLookup,
        setFilter,
    } = useCatalogBrowser();

    const title = (item: HomeCategory) => (english ? item.nameEn : item.nameVi);

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            {/* Same 1440px + 20px gutters as the main navigation above. */}
            <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-7 sm:pt-9">
                <PageNav
                    back={{
                        label: t('home'),
                        to: ROUTES.HOME,
                    }}
                />

                <header className="mt-4 rounded-[18px] bg-store-green px-5 py-4 text-white sm:px-7 sm:py-5">
                    <h1 className="m-0 font-subheading text-2xl font-bold sm:text-3xl">
                        {query.trim()
                            ? t('search.resultsFor', {
                                  query: query.trim(),
                              })
                            : t('customerUI.catalogTitle')}
                    </h1>

                    <p className="mb-0 mt-1 text-[13px] leading-5 text-white/80 sm:text-sm">
                        {query.trim() ? t('search.resultsIntro') : t('customerUI.catalogIntro')}
                    </p>
                </header>

                <div className="mt-7 grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] xl:gap-8">
                    <CatalogCategorySidebar
                        categories={categories}
                        categoryError={categoryError}
                        categoryLoading={categoryLoading}
                        categoryId={categoryId}
                        onCategorySelect={(id) => setFilter('category', id)}
                    />

                    <section className="min-w-0">
                        <h2 className="m-0 mt-2 font-subheading text-xl font-bold">
                            {query.trim()
                                ? t('search.matchingProducts')
                                : selected
                                  ? title(selected)
                                  : t('customerUI.catalogShowing')}
                        </h2>

                        {query.trim() && !loading && !error && pageData && (
                            <p className="mt-2 text-sm text-store-muted" role="status">
                                {t('search.resultCount', {
                                    count: pageData.totalElements,
                                })}
                            </p>
                        )}

                        {loading && (
                            <div
                                aria-busy="true"
                                className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                            >
                                {Array.from({ length: size }, (_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </div>
                        )}

                        {error && (
                            <p role="alert" className="mt-6 text-danger">
                                {t('homePage.productsError')}
                            </p>
                        )}

                        {!loading && !error && !pageData?.items.length && (
                            <div className="mt-5 flex min-h-48 flex-col items-center justify-center rounded-xl bg-white p-6 text-center">
                                <PackageSearch size={34} className="text-store-sage" />

                                <p className="text-sm text-store-muted">
                                    {t('customerUI.catalogNoResults')}
                                </p>
                            </div>
                        )}

                        {!loading && !error && pageData && pageData.items.length > 0 && (
                            <>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {pageData.items.map((product) => (
                                        <CatalogShowcaseCard
                                            key={product.id}
                                            product={product}
                                            categoryNameVi={
                                                categoryLookup.get(product.categoryId)?.nameVi ?? ''
                                            }
                                            categoryNameEn={
                                                categoryLookup.get(product.categoryId)?.nameEn ?? ''
                                            }
                                        />
                                    ))}
                                </div>

                                <SectionPaginationBar
                                    currentPage={page}
                                    totalPages={pageData.totalPages}
                                    totalItems={pageData.totalElements}
                                    pageSize={size}
                                    onPageChange={(next) =>
                                        setFilter('page', next === 1 ? undefined : String(next))
                                    }
                                />
                            </>
                        )}
                    </section>
                </div>
            </div>
        </StorefrontLayout>
    );
}
