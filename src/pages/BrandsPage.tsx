import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Search, Store, X } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import CustomerBrandTile from '@/components/brand/CustomerBrandTile';
import { getBrandDirectory, type CustomerBrand } from '@/services/customer/brandService';
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';
import { ROUTES } from '@/router/routes';

const BATCH_SIZE = 24;

/** Customer storefront, powered exclusively by published catalog/brand data. */
export default function BrandsPage() {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const [brands, setBrands] = useState<CustomerBrand[]>([]);
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(0);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        getBrandDirectory(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setBrands(data);
                setError(false);
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        getHomeCategories(controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) setCategories(data);
            })
            .catch(() => {
                /* Brand search remains usable if categories are unavailable. */
            });
        return () => controller.abort();
    }, [reload]);

    const selectedCategory = categories.find((category) => category.id === categoryId);
    const matchingCategoryIds = useMemo(() => {
        if (!selectedCategory) return new Set<string>();
        const gather = (item: HomeCategory): string[] => [
            item.id,
            ...item.children.flatMap(gather),
        ];
        return new Set(gather(selectedCategory));
    }, [selectedCategory]);

    const filteredBrands = useMemo(() => {
        const query = search.trim().toLocaleLowerCase(english ? 'en' : 'vi');
        return brands.filter((brand) => {
            if (selectedCategory && !brand.categoryIds.some((id) => matchingCategoryIds.has(id)))
                return false;
            return (
                !query ||
                [brand.name, brand.descriptionVi, brand.descriptionEn].some((value) =>
                    value?.toLocaleLowerCase(english ? 'en' : 'vi').includes(query),
                )
            );
        });
    }, [brands, search, selectedCategory, matchingCategoryIds, english]);

    const visibleBrands = filteredBrands.slice(0, visibleCount);
    const hasMore = visibleCount < filteredBrands.length;

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!hasMore || !target || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisibleCount((count) => Math.min(count + BATCH_SIZE, filteredBrands.length));
                }
            },
            { rootMargin: '350px' },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMore, filteredBrands.length, visibleCount]);

    const enriched = brands.some((brand) => brand.productCount !== null);
    const featuredLogos = brands.filter((brand) => Boolean(brand.logoUrl)).slice(0, 6);

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-[#fcf6e9] text-store-ink">
            <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-6">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-5 flex flex-wrap items-center gap-2 text-sm font-medium text-store-muted"
                >
                    <Link
                        to={ROUTES.HOME}
                        className="text-store-green no-underline hover:underline"
                    >
                        {t('home')}
                    </Link>
                    <ChevronRight size={14} aria-hidden="true" />
                    <span aria-current="page" className="font-bold text-store-ink">
                        {t('brandPage.brands')}
                    </span>
                </nav>

                <section className="relative isolate grid min-h-[260px] overflow-hidden rounded-[28px] bg-[#103c2c] text-white lg:grid-cols-[1fr_0.8fr]">
                    <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-[#fce46b]">
                            <Store size={15} /> {t('brandPage.eyebrow')}
                        </span>
                        <h1 className="m-0 max-w-[640px] font-subheading text-[34px] font-black leading-[1.15] sm:text-[46px]">
                            {t('brandPage.heroTitle')}
                        </h1>
                        <p className="mb-0 mt-4 max-w-[550px] text-sm leading-7 text-white/80 sm:text-base">
                            {t('brandPage.heroDescription')}
                        </p>
                    </div>
                    <div className="relative hidden min-h-[260px] items-center justify-center overflow-hidden bg-[#d8f1b8] p-6 lg:flex">
                        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-[#f3d85e]/50 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 right-0 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
                        <div className="relative grid w-full max-w-[490px] grid-cols-3 gap-3 -rotate-3">
                            {featuredLogos.map((brand, index) => (
                                <div
                                    key={brand.id}
                                    className={`flex aspect-[1.15] items-center justify-center rounded-2xl border-2 border-white bg-white p-3 shadow-lg ${index % 3 === 1 ? 'translate-y-4' : ''}`}
                                >
                                    <img
                                        src={brand.logoUrl!}
                                        alt={brand.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            ))}
                            {!featuredLogos.length && (
                                <Store
                                    size={90}
                                    className="col-span-3 mx-auto text-store-green/50"
                                />
                            )}
                        </div>
                    </div>
                </section>

                <section
                    className="mt-7 rounded-[24px] border border-[#e9ddc8] bg-white p-5 shadow-sm sm:p-7"
                    aria-label={t('brandPage.filterTitle')}
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="m-0 text-lg font-extrabold">{t('brandPage.filterTitle')}</h2>
                        <span className="text-sm font-bold text-store-green">
                            {t('brandPage.brandCount', { count: brands.length })}
                        </span>
                    </div>
                    <div className="relative mt-4 max-w-[610px]">
                        <Search
                            size={19}
                            aria-hidden="true"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-store-muted"
                        />
                        <input
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setVisibleCount(BATCH_SIZE);
                            }}
                            type="search"
                            placeholder={t('brandPage.searchPlaceholder')}
                            aria-label={t('brandPage.searchPlaceholder')}
                            className="h-12 w-full rounded-xl border border-[#d4ded6] bg-[#fbfcf9] pl-11 pr-12 text-sm text-store-ink outline-none transition focus:border-store-green focus:ring-2 focus:ring-store-green/15"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setVisibleCount(BATCH_SIZE);
                                }}
                                aria-label={t('brandPage.clearSearch')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-[#e8efe8]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {enriched && categories.length > 0 && (
                        <div
                            className="mt-5 flex flex-wrap gap-2"
                            aria-label={t('brandPage.categories')}
                        >
                            <button
                                type="button"
                                aria-pressed={!categoryId}
                                onClick={() => {
                                    setCategoryId(null);
                                    setVisibleCount(BATCH_SIZE);
                                }}
                                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${!categoryId ? 'border-store-green bg-store-green text-white' : 'border-[#d6e0d6] bg-white text-store-ink hover:bg-[#eef5ec]'}`}
                            >
                                {t('brandPage.allCategories')}
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    aria-pressed={category.id === categoryId}
                                    onClick={() => {
                                        setCategoryId(category.id);
                                        setVisibleCount(BATCH_SIZE);
                                    }}
                                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${category.id === categoryId ? 'border-store-green bg-store-green text-white' : 'border-[#d6e0d6] bg-white text-store-ink hover:bg-[#eef5ec]'}`}
                                >
                                    {english ? category.nameEn : category.nameVi}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-8" aria-labelledby="brand-directory-heading">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2
                                id="brand-directory-heading"
                                className="m-0 font-subheading text-[26px] font-black"
                            >
                                {t('brandPage.directoryTitle')}
                            </h2>
                            {!loading && !error && (
                                <p className="m-0 mt-1 text-sm text-store-muted">
                                    {t('brandPage.results', { count: filteredBrands.length })}
                                </p>
                            )}
                        </div>
                        <Link
                            to={ROUTES.CATALOG}
                            className="inline-flex items-center gap-2 rounded-full border border-store-green px-4 py-2 text-xs font-bold text-store-green no-underline hover:bg-store-green hover:text-white"
                        >
                            {t('brandPage.browseProducts')} <ArrowRight size={15} />
                        </Link>
                    </div>
                    {loading && (
                        <p
                            role="status"
                            className="rounded-2xl bg-white p-8 text-sm text-store-muted"
                        >
                            {t('brandPage.loading')}
                        </p>
                    )}
                    {error && !loading && (
                        <div
                            role="alert"
                            className="rounded-2xl bg-white p-8 text-sm text-store-muted"
                        >
                            <p>{t('brandPage.loadError')}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoading(true);
                                    setError(false);
                                    setReload((value) => value + 1);
                                }}
                                className="rounded-lg bg-store-green px-4 py-2 font-bold text-white"
                            >
                                {t('brandPage.retry')}
                            </button>
                        </div>
                    )}
                    {!loading && !error && !filteredBrands.length && (
                        <p className="rounded-2xl bg-white p-8 text-center text-sm text-store-muted">
                            {t('brandPage.noResults')}
                        </p>
                    )}
                    {!loading && !error && visibleBrands.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {visibleBrands.map((brand) => (
                                <CustomerBrandTile key={brand.id} brand={brand} brands={brands} />
                            ))}
                        </div>
                    )}
                    {hasMore && !loading && !error && (
                        <div
                            ref={loadMoreRef}
                            className="flex min-h-24 items-center justify-center py-7"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setVisibleCount((count) =>
                                        Math.min(count + BATCH_SIZE, filteredBrands.length),
                                    )
                                }
                                className="rounded-full border-2 border-store-green bg-white px-7 py-3 text-sm font-bold text-store-green hover:bg-[#eaf3e8]"
                            >
                                {t('brandPage.loadMore')}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </StorefrontLayout>
    );
}
