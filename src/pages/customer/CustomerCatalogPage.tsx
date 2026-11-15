import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Folder, PackageSearch, Search } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { getHomeCategories } from '@/services/customer/homeService';
import type { HomeCategory } from '@/services/customer/homeService';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import type { CatalogProductPage } from '@/services/customer/catalogReadService';
import SectionPaginationBar from '@/components/customer/home/SectionPaginationBar';
import CustomerFavoriteButton from '@/components/customer/CustomerFavoriteButton';
import { ROUTES } from '@/router/routes';

export default function CustomerCatalogPage() {
    const { t, i18n } = useTranslation('storefront');
    const en = i18n.resolvedLanguage?.startsWith('en');
    const [params, setParams] = useSearchParams();
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [categoryError, setCategoryError] = useState(false);
    const [pageData, setPageData] = useState<CatalogProductPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [draftSearch, setDraftSearch] = useState(params.get('q') ?? '');
    const categoryId = params.get('category');
    const query = params.get('q') ?? '';
    const page = Math.max(1, Number(params.get('page') || 1) || 1);
    const size = 12;
    const title = (item: HomeCategory) => (en ? item.nameEn : item.nameVi);

    useEffect(() => {
        const controller = new AbortController();
        getHomeCategories(controller.signal)
            .then(setCategories)
            .catch(() => {
                if (!controller.signal.aborted) setCategoryError(true);
            });
        return () => controller.abort();
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        getCatalogProducts({
            page: page - 1,
            size,
            q: query.trim() || undefined,
            categoryId: categoryId ?? undefined,
            signal: controller.signal,
        })
            .then((result) => {
                if (!controller.signal.aborted) {
                    setPageData(result);
                    setError(false);
                }
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [page, query, categoryId]);
    const selected = categories
        .flatMap((item) => [item, ...item.children])
        .find((item) => item.id === categoryId);
    const setFilter = (key: 'category' | 'q' | 'page', value?: string) => {
        setLoading(true);
        setParams((previous) => {
            const next = new URLSearchParams(previous);
            if (value) next.set(key, value);
            else next.delete(key);
            if (key !== 'page') next.delete('page');
            return next;
        });
    };
    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            <main className="mx-auto max-w-[1320px] px-4 py-9 sm:px-6">
                <Link
                    to={ROUTES.HOME}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-store-green no-underline"
                >
                    <ArrowLeft size={17} />
                    {t('home')}
                </Link>
                <div className="mt-5 rounded-[24px] bg-store-green p-7 text-white sm:p-9">
                    <h1 className="m-0 font-subheading text-3xl font-bold">
                        {t('customerUI.catalogTitle')}
                    </h1>
                    <p className="mt-2 text-sm text-white/80">{t('customerUI.catalogIntro')}</p>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
                    <aside className="self-start rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-4">
                        <h2 className="mb-3 mt-0 font-subheading text-base font-bold">
                            {t('customerUI.categoryTitle')}
                        </h2>
                        {categoryError && (
                            <p className="text-xs text-danger">{t('customerUI.categoryError')}</p>
                        )}
                        <button
                            type="button"
                            onClick={() => setFilter('category')}
                            className={`mb-2 w-full rounded-lg p-3 text-left text-sm font-bold ${!categoryId ? 'bg-store-yellow' : 'bg-surface-soft hover:bg-surface-green'}`}
                        >
                            {t('customerUI.catalogAll')}
                        </button>
                        <nav
                            aria-label={t('customerUI.categorySelect')}
                            className="max-h-[65vh] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {categories.map((parent) => {
                                const selectedParent =
                                    categoryId === parent.id ||
                                    parent.children.some((item) => item.id === categoryId);
                                // null means automatic expansion of the selected branch.
                                // An empty string means the user explicitly collapsed it.
                                const open =
                                    expanded === parent.id || (expanded === null && selectedParent);
                                const selectedDirectly = categoryId === parent.id;
                                return (
                                    <div
                                        key={parent.id}
                                        className="border-b border-store-line/60 last:border-b-0"
                                    >
                                        <div className="flex min-h-12 items-center gap-1 py-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExpanded(parent.id);
                                                    setFilter('category', parent.id);
                                                }}
                                                aria-current={selectedDirectly ? 'page' : undefined}
                                                className={`group relative flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg py-2 pl-3 pr-1 text-left text-sm font-semibold transition-colors hover:text-store-green ${
                                                    selectedParent
                                                        ? 'text-store-green'
                                                        : 'text-store-ink'
                                                }`}
                                            >
                                                {selectedParent && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-store-green"
                                                    />
                                                )}
                                                <Folder
                                                    size={17}
                                                    strokeWidth={1.8}
                                                    className="shrink-0 text-store-green"
                                                />
                                                <span className="min-w-0 flex-1">
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
                                                    className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-store-muted transition-colors hover:bg-surface-green hover:text-store-green"
                                                >
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                        {open && parent.children.length > 0 && (
                                            <div className="mb-2 ml-5 space-y-0.5 border-l border-store-line pl-3">
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
                                                        className={`flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-2 text-left text-xs leading-5 transition-colors ${
                                                            categoryId === child.id
                                                                ? 'bg-surface-green font-bold text-store-green'
                                                                : 'text-store-muted hover:bg-surface-soft hover:text-store-ink'
                                                        }`}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60"
                                                        />
                                                        <span className="min-w-0 flex-1">
                                                            {title(child)}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </aside>
                    <div className="min-w-0">
                        <form
                            className="flex gap-2 rounded-xl bg-white p-3 shadow-sm"
                            onSubmit={(event) => {
                                event.preventDefault();
                                setFilter('q', draftSearch.trim());
                            }}
                        >
                            <label htmlFor="catalog-search" className="sr-only">
                                {t('customerUI.catalogSearchLabel')}
                            </label>
                            <input
                                id="catalog-search"
                                value={draftSearch}
                                onChange={(e) => setDraftSearch(e.target.value)}
                                placeholder={t('customerUI.catalogSearchPlaceholder')}
                                className="min-w-0 flex-1 rounded-lg border border-store-line px-4 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg bg-store-yellow"
                                aria-label={t('search.submit')}
                            >
                                <Search size={18} />
                            </button>
                        </form>
                        <h2 className="mb-2 mt-6 font-subheading text-xl font-bold">
                            {selected ? title(selected) : t('customerUI.catalogShowing')}
                        </h2>
                        <p className="mt-0 text-xs text-store-muted">
                            {t('customerUI.catalogInfo')}
                        </p>
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
                                        <article
                                            key={product.id}
                                            className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-store-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <Link
                                                to={`/products/${encodeURIComponent(product.id)}`}
                                                className="block h-40 overflow-hidden bg-surface-soft p-3"
                                            >
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={en ? product.nameEn : product.nameVi}
                                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.07]"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="grid h-full place-items-center">
                                                        <PackageSearch
                                                            size={26}
                                                            className="text-store-sage"
                                                        />
                                                    </div>
                                                )}
                                            </Link>
                                            <CustomerFavoriteButton productId={product.id} />
                                            <div className="flex flex-1 flex-col gap-2 p-3.5">
                                                <p className="m-0 truncate text-[10px] text-store-muted">
                                                    SKU: {product.sku}
                                                </p>
                                                <Link
                                                    to={`/products/${encodeURIComponent(product.id)}`}
                                                    className="line-clamp-2 min-h-12 text-sm font-bold text-store-ink no-underline hover:text-store-green"
                                                >
                                                    {en ? product.nameEn : product.nameVi}
                                                </Link>
                                                <p className="mt-auto text-xs text-store-muted">
                                                    {(en
                                                        ? product.packageSpecEn
                                                        : product.packageSpecVi) ||
                                                        product.unitCode}
                                                </p>
                                                <p className="m-0 text-xs text-store-muted">
                                                    {t('customerUI.priceUnavailable')}
                                                </p>
                                            </div>
                                        </article>
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
                    </div>
                </div>
            </main>
        </StorefrontLayout>
    );
}
