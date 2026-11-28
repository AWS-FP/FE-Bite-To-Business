import BrandTileSkeleton from '@/components/brand/BrandTileSkeleton';
import ProductCardSkeleton from '@/components/customer/home/ProductCardSkeleton';
import Skeleton from '@/components/common/Skeleton';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowRight,
    PackageSearch,
    ShieldCheck,
    Store,
} from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import CatalogShowcaseCard from '@/components/customer/CatalogShowcaseCard';
import CustomerBrandTile from '@/components/brand/CustomerBrandTile';
import BrandSortDropdown from '@/components/brand/BrandSortDropdown';
import { useBrandDetail } from '@/hooks/customer/useBrandDetail';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

/** Public brand storefront. The product cards are exactly the Customer/Homepage product cards. */
export default function BrandDetailPage() {
    const { brandSlug: slug } = useParams<{ brandSlug: string }>();
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const {
        directory, brandsLoading, brandsError, brand, products, productsLoading, productsError,
        relatedLoading, sort, shownProducts, hasMoreProducts,
        categoryNames, matchedBrands, description, showRelated, retry, changeSort, showMoreProducts,
    } = useBrandDetail(slug, english);
    const productSentinel = useRef<HTMLDivElement>(null);

    // Cuộn tới cuối danh sách thì hiển thị thêm sản phẩm (UI); việc tính toán nằm trong hook.
    useEffect(() => {
        const target = productSentinel.current;
        if (!hasMoreProducts || !target || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((item) => item.isIntersecting)) showMoreProducts();
            },
            { rootMargin: '280px' },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMoreProducts, showMoreProducts]);

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-[#fcf6e9] text-store-ink">
            <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-6">
                <PageNav
                    className="mb-5"
                    items={[
                        { label: t('home'), to: ROUTES.HOME },
                        { label: t('brandPage.brands'), to: ROUTES.BRANDS },
                        ...(brand ? [{ label: brand.name }] : []),
                    ]}
                />

                {brandsLoading && (
<div aria-busy="true" className="rounded-[24px] bg-white p-10"><Skeleton className="h-24 w-24"/><Skeleton className="mt-4 h-8 w-1/2"/><Skeleton className="mt-3 h-4 w-3/4"/></div>
)}
                {!brandsLoading && (brandsError || !brand) && (
                    <div className="rounded-[24px] border border-[#e5e0d8] bg-white p-10">
                        <PackageSearch size={36} className="text-store-green" />
                        <h1 className="mt-4 text-2xl font-black">
                            {t(brandsError ? 'brandPage.loadError' : 'brandPage.notFound')}
                        </h1>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                to={ROUTES.BRANDS}
                                className="rounded-full bg-store-green px-6 py-3 text-sm font-bold text-white no-underline"
                            >
                                {t('brandPage.allBrands')}
                            </Link>
                            {brandsError && (
                                <button
                                    type="button"
                                    onClick={retry}
                                    className="rounded-full border border-store-green px-6 py-3 text-sm font-bold text-store-green"
                                >
                                    {t('brandPage.retry')}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {!brandsLoading && brand && (
                    <>
                        <section
                            className="relative grid overflow-hidden rounded-[28px] border border-[#d4dfd6] bg-white shadow-sm lg:grid-cols-[220px_1fr]"
                            aria-labelledby="brand-detail-title"
                        >
                            <div className="flex min-h-[200px] items-center justify-center bg-[#e5f0dd] p-8">
                                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[26px] border border-white bg-white p-5 shadow-[0_8px_25px_rgba(9,51,36,0.12)]">
                                    {brand.logoUrl ? (
                                        <img
                                            src={brand.logoUrl}
                                            alt={brand.name}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <span className="font-subheading text-6xl font-black text-store-green">
                                            {brand.name.slice(0, 1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center p-7 sm:p-9">
                                <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#ebf4e8] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-store-green">
                                    <Store size={13} /> {t('brandPage.officialBrand')}
                                </span>
                                <h1
                                    id="brand-detail-title"
                                    className="m-0 font-subheading text-[32px] font-black leading-tight sm:text-[42px]"
                                >
                                    {brand.name}
                                </h1>
                                {description && (
                                    <p className="mb-0 mt-3 max-w-[850px] whitespace-pre-line text-[14px] leading-7 text-store-muted">
                                        {description}
                                    </p>
                                )}
                                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-store-green">
                                    <span className="inline-flex items-center gap-1.5">
                                        <ShieldCheck size={15} /> {t('brandPage.catalogProducts')}
                                    </span>
                                    <span className="rounded-full border border-[#d8e6d9] px-3 py-1.5">
                                        {t('brandPage.productCount', {
                                            count: brand.productCount ?? products.length,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section
                            className="mt-8 rounded-[26px] border border-[#e6e0d5] bg-white p-5 sm:p-7"
                            aria-labelledby="brand-products-heading"
                        >
                            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#ebeee7] pb-5">
                                <div>
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-store-green">
                                        {t('brandPage.productsEyebrow')}
                                    </span>
                                    <h2
                                        id="brand-products-heading"
                                        className="mb-0 mt-1 font-subheading text-[28px] font-black"
                                    >
                                        {t('brandPage.productsTitle', { brand: brand.name })}
                                    </h2>
                                    {!productsLoading && !productsError && (
                                        <p className="m-0 mt-1 text-sm text-store-muted">
                                            {t('brandPage.productCount', {
                                                count: products.length,
                                            })}
                                        </p>
                                    )}
                                </div>
                                <BrandSortDropdown
                                    value={sort}
                                    onChange={changeSort}
                                />
                            </div>
                            {productsLoading && (
<div aria-busy="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i}/>)}</div>
)}
                            {productsError && (
                                <p
                                    role="alert"
                                    className="py-12 text-center text-sm text-store-muted"
                                >
                                    {t('brandPage.productError')}
                                </p>
                            )}
                            {!productsLoading && !productsError && !products.length && (
                                <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#f6f8f3] px-5 py-14 text-center">
                                    <PackageSearch size={39} className="text-store-green/60" />
                                    <p className="m-0 text-sm text-store-muted">
                                        {t('brandPage.noProducts')}
                                    </p>
                                    <Link
                                        to={ROUTES.CATALOG}
                                        className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-store-green no-underline hover:underline"
                                    >
                                        {t('brandPage.browseProducts')} <ArrowRight size={15} />
                                    </Link>
                                </div>
                            )}
                            {shownProducts.length > 0 && !productsLoading && !productsError && (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {shownProducts.map((product) => {
                                        const category = categoryNames.get(product.categoryId);
                                        return (
                                            <CatalogShowcaseCard
                                                key={product.id}
                                                product={product}
                                                categoryNameVi={category?.nameVi ?? ''}
                                                categoryNameEn={category?.nameEn ?? ''}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                            {hasMoreProducts && !productsLoading && !productsError && (
                                <div
                                    ref={productSentinel}
                                    className="flex min-h-24 items-center justify-center pt-7"
                                >
                                    <button
                                        type="button"
                                        onClick={showMoreProducts}
                                        className="rounded-full border-2 border-store-green bg-white px-7 py-3 text-sm font-bold text-store-green hover:bg-[#eaf3e8]"
                                    >
                                        {t('brandPage.moreProducts')}
                                    </button>
                                </div>
                            )}
                        </section>

                        {showRelated && (
                            <section
                                className="mt-8 rounded-[26px] border border-[#e6e0d5] bg-white p-5 sm:p-7"
                                aria-labelledby="brand-related-heading"
                            >
                                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                                    <div>
                                        <span className="text-xs font-extrabold uppercase tracking-widest text-store-green">
                                            {t('brandPage.discoverMore')}
                                        </span>
                                        <h2
                                            id="brand-related-heading"
                                            className="mb-0 mt-1 font-subheading text-[28px] font-black"
                                        >
                                            {t('brandPage.relatedBrands')}
                                        </h2>
                                        <p className="m-0 mt-2 text-sm text-store-muted">
                                            {t('brandPage.relatedDescription')}
                                        </p>
                                    </div>
                                    <Link
                                        to={ROUTES.BRANDS}
                                        className="inline-flex items-center gap-2 text-sm font-extrabold text-store-green no-underline hover:underline"
                                    >
                                        {t('brandPage.allBrands')} <ArrowRight size={15} />
                                    </Link>
                                </div>
                                {relatedLoading && (
<div aria-busy="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <BrandTileSkeleton key={i}/>)}</div>
)}
                                {!relatedLoading && matchedBrands.length > 0 && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                        {matchedBrands.map((item) => (
                                            <CustomerBrandTile
                                                key={item.id}
                                                brand={
                                                    directory.find(
                                                        (entry) => entry.id === item.id,
                                                    ) ?? item
                                                }
                                                brands={directory}
                                            />
                                        ))}
                                    </div>
                                )}
                                {!relatedLoading && !matchedBrands.length && (
                                    <p className="rounded-xl bg-[#f6f8f3] p-6 text-sm text-store-muted">
                                        {t('brandPage.noRelated')}
                                    </p>
                                )}
                            </section>
                        )}
                        <PageNav
                            className="mt-7"
                            back={{ label: t('brandPage.backToBrands'), to: ROUTES.BRANDS }}
                        />
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
