import BrandTileSkeleton from '@/components/brand/BrandTileSkeleton';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Store, X } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import CustomerBrandTile from '@/components/brand/CustomerBrandTile';
import { useBrandDirectory } from '@/hooks/customer/useBrandDirectory';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

/** Customer storefront, powered exclusively by published catalog/brand data. */
export default function BrandsPage() {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const {
        brands, categories, search, categoryId, loading, error, filteredBrands, visibleBrands,
        visibleCount, hasMore, enriched, featuredLogos, changeSearch, chooseCategory, showMore, retry,
    } = useBrandDirectory(english);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Cuộn tới cuối danh sách thì hiển thị thêm (chỉ là UI, việc tính toán nằm trong hook).
    useEffect(() => {
        const target = loadMoreRef.current;
        if (!hasMore || !target || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    showMore();
                }
            },
            { rootMargin: '350px' },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMore, filteredBrands.length, visibleCount, showMore]);

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-[#fcf6e9] text-store-ink">
            <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-6">
                <PageNav
                    className="mb-5"
                    items={[
                        { label: t('home'), to: ROUTES.HOME },
                        { label: t('brandPage.brands') },
                    ]}
                />

                <section className="relative isolate grid min-h-[185px] overflow-hidden rounded-[20px] bg-[#103c2c] text-white lg:grid-cols-[1fr_0.8fr]">
                    <div className="relative z-10 flex flex-col justify-center p-5 sm:p-7 lg:p-8">
                        <span className="mb-2.5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#fce46b]">
                            <Store size={15} /> {t('brandPage.eyebrow')}
                        </span>
                        <h1 className="m-0 max-w-[640px] font-subheading text-[27px] font-black leading-tight sm:text-[34px]">
                            {t('brandPage.heroTitle')}
                        </h1>
                        <p className="mb-0 mt-2 max-w-[550px] text-[13px] leading-5 text-white/80 sm:text-sm">
                            {t('brandPage.heroDescription')}
                        </p>
                    </div>
                    <div className="relative hidden min-h-[185px] items-center justify-center overflow-hidden bg-[#d8f1b8] p-4 lg:flex">
                        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-[#f3d85e]/50 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 right-0 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
                        <div className="relative grid w-full max-w-[330px] grid-cols-3 gap-2 -rotate-3">
                            {featuredLogos.map((brand, index) => (
                                <div
                                    key={brand.id}
                                    className={`flex aspect-[1.4] items-center justify-center rounded-xl border-2 border-white bg-white p-2 shadow-lg ${index % 3 === 1 ? 'translate-y-2' : ''}`}
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
                            onChange={(event) => changeSearch(event.target.value)}
                            type="search"
                            placeholder={t('brandPage.searchPlaceholder')}
                            aria-label={t('brandPage.searchPlaceholder')}
                            className="h-12 w-full rounded-xl border border-[#d4ded6] bg-[#fbfcf9] pl-11 pr-12 text-sm text-store-ink outline-none transition focus:border-store-green focus:ring-2 focus:ring-store-green/15"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => changeSearch('')}
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
                                onClick={() => chooseCategory(null)}
                                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${!categoryId ? 'border-store-green bg-store-green text-white' : 'border-[#d6e0d6] bg-white text-store-ink hover:bg-[#eef5ec]'}`}
                            >
                                {t('brandPage.allCategories')}
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    aria-pressed={category.id === categoryId}
                                    onClick={() => chooseCategory(category.id)}
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
<div aria-busy="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <BrandTileSkeleton key={i}/>)}</div>
)}
                    {error && !loading && (
                        <div
                            role="alert"
                            className="rounded-2xl bg-white p-8 text-sm text-store-muted"
                        >
                            <p>{t('brandPage.loadError')}</p>
                            <button
                                type="button"
                                onClick={retry}
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
                                onClick={showMore}
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
