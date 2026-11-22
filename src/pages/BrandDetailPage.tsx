import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';
import type { CatalogBrand, CatalogProduct } from '@/services/customer/catalogReadService';
import {
    brandPath,
    findBrandBySlug,
    getBrandDirectory,
    getBrandsInSameCategories,
    getProductsOfBrand,
    type CustomerBrand,
} from '@/services/customer/brandService';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

const PRODUCT_BATCH = 12;

/** Public brand storefront. The product cards are exactly the Customer/Homepage product cards. */
export default function BrandDetailPage() {
    const { brandSlug: slug } = useParams<{ brandSlug: string }>();
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const location = useLocation();
    const navigate = useNavigate();
    const [directory, setDirectory] = useState<CustomerBrand[]>([]);
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [brandsError, setBrandsError] = useState(false);
    const [productResult, setProductResult] = useState<{
        brandId: string;
        items: CatalogProduct[];
        error: boolean;
    } | null>(null);
    const [relatedResult, setRelatedResult] = useState<{
        brandId: string;
        items: CatalogBrand[];
        error: boolean;
    } | null>(null);
    const [productLimit, setProductLimit] = useState<{ brandId: string; count: number } | null>(
        null,
    );
    const [sort, setSort] = useState<'name_asc' | 'name_desc'>('name_asc');
    const [reload, setReload] = useState(0);
    const productSentinel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        getBrandDirectory(controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setDirectory(items);
            })
            .catch(() => {
                if (!controller.signal.aborted) setBrandsError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setBrandsLoading(false);
            });
        getHomeCategories(controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setCategories(items);
            })
            .catch(() => {
                /* Product cards can still show without category labels. */
            });
        return () => controller.abort();
    }, [reload]);

    const brand = useMemo(() => findBrandBySlug(directory, slug), [directory, slug]);
    const brandId = brand?.id;
    const products = useMemo(
        () => (productResult && productResult.brandId === brandId ? productResult.items : []),
        [productResult, brandId],
    );
    const productsLoaded = Boolean(brandId && productResult?.brandId === brandId);
    const productsLoading = Boolean(brandId && !productsLoaded);
    const productsError = Boolean(productsLoaded && productResult?.error);
    const related = useMemo(
        () => (relatedResult && relatedResult.brandId === brandId ? relatedResult.items : []),
        [relatedResult, brandId],
    );
    const relatedLoading = Boolean(brandId && relatedResult?.brandId !== brandId);
    const relatedError = Boolean(
        brandId && relatedResult && relatedResult.brandId === brandId && relatedResult.error,
    );
    const productCount =
        productLimit && productLimit.brandId === brandId ? productLimit.count : PRODUCT_BATCH;

    useEffect(() => {
        if (!brand || !location.pathname.startsWith('/brands/')) return;
        // Old share links remain functional, while canonical URLs use /brand/:slug.
        navigate(brandPath(brand, directory), { replace: true });
    }, [brand, directory, location.pathname, navigate]);

    useEffect(() => {
        if (!brandId) return;
        const controller = new AbortController();
        getProductsOfBrand(brandId, controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setProductResult({ brandId, items, error: false });
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setProductResult({ brandId, items: [], error: true });
            });
        getBrandsInSameCategories(brandId, controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setRelatedResult({ brandId, items, error: false });
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setRelatedResult({ brandId, items: [], error: true });
            });
        return () => controller.abort();
    }, [brandId]);

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            const left = (english ? a.nameEn : a.nameVi) || a.nameVi;
            const right = (english ? b.nameEn : b.nameVi) || b.nameVi;
            return (
                (sort === 'name_asc' ? 1 : -1) * left.localeCompare(right, english ? 'en' : 'vi')
            );
        });
    }, [products, sort, english]);
    const shownProducts = sortedProducts.slice(0, productCount);
    const hasMoreProducts = productCount < sortedProducts.length;

    useEffect(() => {
        const target = productSentinel.current;
        if (!hasMoreProducts || !target || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((item) => item.isIntersecting)) {
                    if (brandId)
                        setProductLimit((previous) => ({
                            brandId,
                            count: Math.min(
                                (previous?.brandId === brandId ? previous.count : PRODUCT_BATCH) +
                                    PRODUCT_BATCH,
                                sortedProducts.length,
                            ),
                        }));
                }
            },
            { rootMargin: '280px' },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMoreProducts, sortedProducts.length, productCount, brandId]);

    const categoryNames = useMemo(() => {
        const map = new Map<string, HomeCategory>();
        const visit = (category: HomeCategory) => {
            map.set(category.id, category);
            category.children.forEach(visit);
        };
        categories.forEach(visit);
        return map;
    }, [categories]);

    // If the optional related endpoint is not installed yet, derive exact matches
    // from the directory's published-product category IDs, never from brand names.
    const matchedBrands = useMemo(() => {
        if (!brand) return [];
        if (!relatedError) return related;
        const active = new Set(brand.categoryIds);
        return directory
            .filter((item) => item.id !== brand.id && item.categoryIds.some((id) => active.has(id)))
            .sort((a, b) => {
                const aCount = a.categoryIds.filter((id) => active.has(id)).length;
                const bCount = b.categoryIds.filter((id) => active.has(id)).length;
                return bCount - aCount || a.name.localeCompare(b.name);
            })
            .slice(0, 12);
    }, [brand, relatedError, related, directory]);

    const description = brand
        ? (english ? brand.descriptionEn : brand.descriptionVi)?.trim() ||
          (english ? brand.descriptionVi : brand.descriptionEn)?.trim()
        : '';
    const showRelated = productsLoaded && !productsLoading && !productsError && !hasMoreProducts;

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
                    <p
                        role="status"
                        className="rounded-[24px] bg-white p-10 text-sm text-store-muted"
                    >
                        {t('brandPage.loading')}
                    </p>
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
                                    onClick={() => {
                                        setBrandsLoading(true);
                                        setBrandsError(false);
                                        setReload((value) => value + 1);
                                    }}
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
                                    onChange={(nextSort) => {
                                        setSort(nextSort);
                                        if (brandId) {
                                            setProductLimit({
                                                brandId,
                                                count: PRODUCT_BATCH,
                                            });
                                        }
                                    }}
                                />
                            </div>
                            {productsLoading && (
                                <p
                                    role="status"
                                    className="py-12 text-center text-sm text-store-muted"
                                >
                                    {t('brandPage.loadingProducts')}
                                </p>
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
                                        onClick={() => {
                                            if (brandId)
                                                setProductLimit({
                                                    brandId,
                                                    count: Math.min(
                                                        productCount + PRODUCT_BATCH,
                                                        sortedProducts.length,
                                                    ),
                                                });
                                        }}
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
                                    <p role="status" className="py-7 text-sm text-store-muted">
                                        {t('brandPage.loading')}
                                    </p>
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
