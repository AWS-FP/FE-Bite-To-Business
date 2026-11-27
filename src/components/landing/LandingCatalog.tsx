import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CatalogShowcaseCard from '@/components/customer/CatalogShowcaseCard';
import ProductRequestSection from '@/components/customer/home/ProductRequestSection';
import { useAuthStore } from '@/store/admin/authStore';
import { useCatalogQuery } from '@/hooks/customer/useCatalogQuery';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import { getHomeCategories } from '@/services/customer/homeService';
import { loadProductPricing } from '@/services/customer/productDetailService';
import { ROUTES, routePaths } from '@/router/routes';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import type { CatalogProduct } from '@/types/customer/catalog';
import type { CustomerProductPricing } from '@/types/customer/productDetail';

type CatalogProps = {
    category: string;
    view: 'grid' | 'table';
    setCategory: (category: string) => void;
    setView: (view: 'grid' | 'table') => void;
};

const PAGE_SIZE = 8;

function ProductComparison({ products }: { products: CatalogProduct[] }) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en');
    const ids = products.map((product) => product.id);
    const { data, isPending, isError, refetch } = useCatalogQuery({
        queryKey: ['landingComparisonPricing', ids],
        queryFn: () => Promise.all(ids.map((id) => loadProductPricing(id).catch(() => null))),
        staleTime: 60_000,
    });
    const pricingById = new Map<string, CustomerProductPricing>(
        (data ?? []).flatMap((pricing) => pricing ? [[pricing.productId, pricing] as const] : []),
    );
    const headings = ['skuColumn', 'unitColumn', 'retailColumn', 'stockColumn', 'actionColumn'];
    return (
        <div className="overflow-x-auto rounded-xl border border-store-line bg-white">
            {(isError || data?.some((pricing) => pricing === null)) && (
                <p role="alert" className="p-4 text-sm text-danger">
                    {t('landing.live.pricingError')}{' '}
                    <button type="button" onClick={() => void refetch()} className="underline">{t('brandPage.retry')}</button>
                </p>
            )}
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-surface-green text-store-green">
                    <tr>
                        {headings.map((key) => <th key={key} scope="col" className="px-4 py-4 font-bold">{t(`landing.catalog.${key}`)}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const pricing = pricingById.get(product.id);
                        const name = english ? product.nameEn || product.nameVi : product.nameVi || product.nameEn;
                        const spec = english ? product.packageSpecEn || product.packageSpecVi : product.packageSpecVi || product.packageSpecEn;
                        const unitCode = pricing?.unitCode ?? product.unitCode;
                        const unit = t(`homePage.units.${unitCode.toLowerCase()}`, unitCode);
                        const listPrice = pricing?.priceAvailable ? pricing.listPrice : null;
                        const salePrice = pricing?.saleActive && listPrice != null && pricing.salePrice != null && pricing.salePrice >= 0 && pricing.salePrice < listPrice ? pricing.salePrice : null;
                        const price = salePrice ?? listPrice;
                        const available = pricing?.inventoryAvailable ? pricing.availableQuantity : null;
                        return (
                            <tr key={product.id} className="border-t border-store-line align-top">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        {product.imageUrl && <img src={product.imageUrl} alt="" loading="lazy" className="size-14 shrink-0 rounded-md bg-store-cream object-contain" />}
                                        <div className="min-w-0">
                                            <Link to={routePaths.productDetail(product.id)} className="font-semibold text-store-green hover:underline">{name}</Link>
                                            <p className="mt-1 text-xs text-store-muted">{product.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <p>{spec || unit}</p>
                                    {pricing && <p className="mt-1 text-xs text-store-muted">MOQ: {pricing.minOrderQuantity} {unit}</p>}
                                </td>
                                <td className="px-4 py-4">
                                    {isPending ? t('landing.live.pricingLoading') : price == null ? t('customerUI.priceUnavailable') : (
                                        <>
                                            {pricing?.saleActive && pricing.listPrice != null && price < pricing.listPrice && <p className="text-xs text-store-muted line-through">{formatCurrencyVnd(pricing.listPrice)}</p>}
                                            <p className="font-bold text-store-green">{formatCurrencyVnd(price)} / {unit}</p>
                                            {Boolean(pricing?.priceTiers?.length) && (
                                                <div className="mt-2 space-y-1 text-xs text-store-muted">
                                                    <p className="font-semibold">{t('landing.live.volumeTiers')}</p>
                                                    {pricing?.priceTiers.map((tier) => <p key={tier.id}>{tier.minQuantity}{tier.maxQuantity == null ? '+' : `–${tier.maxQuantity}`} {unit}: {formatCurrencyVnd(tier.unitPrice)} / {unit}</p>)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    {isPending ? t('customerUI.checkingStock') : available == null ? t('landing.live.stockUnknown') : available > 0 ? (
                                        <span className="font-semibold text-store-green">{t('landing.live.available', { count: available, unit })}</span>
                                    ) : <span className="font-semibold text-danger">{t('customerUI.outOfStock')}</span>}
                                </td>
                                <td className="px-4 py-4">
                                    <Link to={routePaths.productDetail(product.id)} className="inline-flex whitespace-nowrap rounded-full bg-store-yellow px-4 py-2 font-bold text-store-ink hover:bg-store-yellow/80">{t('landing.live.details')}</Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default function LandingCatalog({ category, view, setCategory, setView }: CatalogProps) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en');
    const session = useAuthStore((state) => state.session);
    const restoring = useAuthStore((state) => state.restoring);
    const { data: categories = [], isError: categoryError, refetch: retryCategories } = useCatalogQuery({
        queryKey: ['catalogCategories'],
        queryFn: ({ signal }) => getHomeCategories(signal),
    });
    const { data, isPending, isError, refetch } = useCatalogQuery({
        queryKey: ['catalogProducts', 1, '', category === 'all' ? null : category, undefined, PAGE_SIZE],
        queryFn: ({ signal }) => getCatalogProducts({ page: 0, size: PAGE_SIZE, categoryId: category === 'all' ? undefined : category, signal }),
        refetchOnWindowFocus: true,
    });
    const categoryLookup = new Map(categories.flatMap((parent) => [parent, ...parent.children]).map((item) => [item.id, item]));
    const products = data?.items ?? [];
    const catalogPath = category === 'all' ? ROUTES.CATALOG : `${ROUTES.CATALOG}?category=${encodeURIComponent(category)}`;
    const filterClass = 'shrink-0 rounded-full border border-store-line px-4 py-2.5 font-body text-sm font-semibold transition-colors hover:bg-store-yellow';

    return (
        <section id="categories" className="border-y border-store-line bg-store-cream py-12 sm:py-16">
            <div className="mx-auto max-w-[1320px] px-6">
                <div className="mb-8 grid items-end gap-5 lg:grid-cols-[5fr_7fr]">
                    <div>
                        <span className="mb-3 inline-block rounded-full bg-store-yellow px-4 py-1.5 font-body text-xs font-bold text-store-ink">{t('landing.catalog.eyebrow')}</span>
                        <h2 className="font-subheading text-[clamp(26px,3vw,36px)] font-bold leading-tight text-store-ink">{t('landing.catalog.title')}</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-store-muted">{t('landing.live.catalogDescription')}</p>
                </div>
                <div className="mb-6 flex flex-wrap gap-2.5" aria-label={t('customerUI.catalogTitle')}>
                    <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')} className={`${filterClass} ${category === 'all' ? 'bg-store-yellow' : 'bg-white'}`}>{t('customerUI.catalogAll')}</button>
                    {categories.map((item) => (
                        <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className={`${filterClass} ${category === item.id ? 'bg-store-yellow' : 'bg-white'}`}>
                            {english ? item.nameEn || item.nameVi : item.nameVi || item.nameEn}
                        </button>
                    ))}
                </div>
                {categoryError && <p role="status" className="mb-4 text-sm text-store-muted">{t('landing.live.categoriesError')}{' '}<button type="button" onClick={() => void retryCategories()} className="underline">{t('brandPage.retry')}</button></p>}
                <div id="catalog-preview" className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-store-ink">{t('landing.live.catalogTitle')}</p>
                    <div className="flex gap-2" role="group" aria-label={t('landing.live.viewMode')}>
                        {(['grid', 'table'] as const).map((mode) => (
                            <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)} className={`${filterClass} ${view === mode ? 'bg-store-yellow' : 'bg-white'}`}>{t(`landing.catalog.${mode}`)}</button>
                        ))}
                    </div>
                </div>
                {isPending ? <p role="status" className="py-12 text-center">{t('homePage.productsLoading')}</p> : isError ? (
                    <div role="alert" className="py-12 text-center text-sm text-danger">
                        {t('homePage.productsError')}{' '}<button type="button" onClick={() => void refetch()} className="underline">{t('brandPage.retry')}</button>
                    </div>
                ) : products.length === 0 ? <p role="status" className="py-12 text-center">{t('customerUI.catalogNoResults')}</p> : view === 'grid' ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => <CatalogShowcaseCard key={product.id} product={product} categoryNameVi={categoryLookup.get(product.categoryId)?.nameVi} categoryNameEn={categoryLookup.get(product.categoryId)?.nameEn} />)}
                    </div>
                ) : <ProductComparison products={products} />}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-store-line bg-white p-5 sm:p-6">
                    <div><h3 className="font-bold text-store-green">{t('landing.catalog.requestTitle')}</h3><p className="mt-1 text-sm text-store-muted">{t('landing.live.exploreMore')}</p></div>
                    <div className="flex flex-wrap items-center gap-2">
                        {!restoring && (!session || session.user.role === 'CUSTOMER') && (
                            <div className="rounded-lg bg-store-green px-2 py-1 text-store-cream"><ProductRequestSection /></div>
                        )}
                        <Link to={catalogPath} className="inline-flex rounded-full bg-store-yellow px-5 py-3 text-sm font-bold text-store-ink hover:bg-store-yellow/80">{t('landing.live.browseCatalog')}</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
