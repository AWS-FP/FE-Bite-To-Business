import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, PackageSearch } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import type { HomeCategory } from '@/types/customer/home';
import { useCatalogBrowser } from '@/hooks/customer/useCatalogBrowser';
import SectionPaginationBar from '@/components/customer/home/SectionPaginationBar';
import CatalogShowcaseCard from '@/components/customer/CatalogShowcaseCard';
import CategoryIcon from '@/components/customer/CategoryIcon';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

export default function CustomerCatalogPage() {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const { categories, categoryError, pageData, loading, error, categoryId, page, size, selected, categoryLookup, setFilter } =
        useCatalogBrowser();
    const [expanded, setExpanded] = useState<string | null>(null);
    const title = (item: HomeCategory) => (english ? item.nameEn : item.nameVi);

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            {/* Same 1440px + 20px gutters as the main navigation above. */}
            <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-7 sm:pt-9">
                <PageNav back={{ label: t('home'), to: ROUTES.HOME }} />

                <header className="mt-5 rounded-[22px] bg-store-green px-6 py-7 text-white sm:px-9 sm:py-9">
                    <h1 className="m-0 font-subheading text-3xl font-bold sm:text-4xl">
                        {t('customerUI.catalogTitle')}
                    </h1>
                    <p className="mb-0 mt-2 text-sm text-white/80">
                        {t('customerUI.catalogIntro')}
                    </p>
                </header>

                <div className="mt-7 grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] xl:gap-8">
                    <aside className="min-w-0 rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-[calc(var(--store-header-height,150px)+1rem)] lg:flex lg:max-h-[max(12rem,calc(100dvh-var(--store-header-height,150px)-1rem))] lg:flex-col">
                        <h2 className="mb-3 mt-0 font-subheading text-base font-bold">
                            {t('customerUI.categoryTitle')}
                        </h2>
                        {categoryError && (
                            <p className="text-xs text-danger">{t('customerUI.categoryError')}</p>
                        )}
                        <button
                            type="button"
                            onClick={() => setFilter('category')}
                            aria-current={!categoryId ? 'page' : undefined}
                            className={`mb-2 w-full rounded-lg border-0 px-3 py-3 text-left text-sm font-bold transition-colors ${
                                !categoryId
                                    ? 'bg-store-yellow text-store-ink'
                                    : 'bg-surface-soft hover:bg-surface-green'
                            }`}
                        >
                            {t('customerUI.catalogAll')}
                        </button>

                        <nav
                            aria-label={t('customerUI.categorySelect')}
                            className="max-h-[62vh] overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-green lg:min-h-0 lg:max-h-none lg:flex-1"
                            tabIndex={0}
                        >
                            {categories.map((parent) => {
                                const selectedParent =
                                    categoryId === parent.id ||
                                    parent.children.some((child) => child.id === categoryId);
                                const open =
                                    expanded === parent.id || (expanded === null && selectedParent);

                                return (
                                    <div
                                        key={parent.id}
                                        className="border-b border-store-line/60 py-1 last:border-b-0"
                                    >
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                aria-current={
                                                    categoryId === parent.id ? 'page' : undefined
                                                }
                                                onClick={() => {
                                                    setExpanded(parent.id);
                                                    setFilter('category', parent.id);
                                                }}
                                                className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border-0 px-2.5 py-3 text-left text-sm font-semibold transition-colors ${
                                                    selectedParent
                                                        ? 'bg-surface-green text-store-green'
                                                        : 'text-store-ink hover:bg-surface-soft'
                                                }`}
                                            >
                                                <CategoryIcon
                                                    category={parent}
                                                    className="h-7 w-7 shrink-0"
                                                />
                                                <span className="min-w-0 flex-1 break-words leading-5">
                                                    {title(parent)}
                                                </span>
                                            </button>
                                            {parent.children.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setExpanded(open ? '' : parent.id)
                                                    }
                                                    aria-label={t('customerUI.expandCategory', {
                                                        name: title(parent),
                                                    })}
                                                    aria-expanded={open}
                                                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-store-line text-store-green transition hover:bg-surface-green"
                                                >
                                                    <ChevronDown
                                                        size={17}
                                                        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        {parent.children.length > 0 && (
                                            <div
                                                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                                aria-hidden={!open}
                                                inert={!open}
                                            >
                                                <div className="min-h-0 overflow-hidden">
                                                    <div className="mb-2 ml-6 mt-1 space-y-0.5 border-0 border-l border-solid border-store-green/20 pl-3">
                                                        {parent.children.map((child) => (
                                                            <button
                                                                key={child.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    setFilter('category', child.id)
                                                                }
                                                                aria-current={
                                                                    categoryId === child.id
                                                                        ? 'page'
                                                                        : undefined
                                                                }
                                                                className={`group flex w-full min-w-0 items-center gap-2 rounded-lg border-0 px-2 py-2 text-left text-xs leading-5 transition-colors ${
                                                                    categoryId === child.id
                                                                        ? 'bg-surface-green font-bold text-store-green'
                                                                        : 'bg-transparent text-store-muted hover:bg-surface-soft hover:text-store-green'
                                                                }`}
                                                            >
                                                                <ChevronRight
                                                                    aria-hidden="true"
                                                                    size={14}
                                                                    strokeWidth={2}
                                                                    className="shrink-0 text-store-green/70 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
                                                                />
                                                                <span className="min-w-0 flex-1 break-words">
                                                                    {title(child)}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </aside>

                    <section className="min-w-0">
                        <h2 className="m-0 mt-2 font-subheading text-xl font-bold">
                            {selected ? title(selected) : t('customerUI.catalogShowing')}
                        </h2>
                        {loading && (
                            <p role="status" className="mt-6">
                                {t('homePage.productsLoading')}
                            </p>
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
