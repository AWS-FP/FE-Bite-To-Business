import { ArrowRight, Clock3, Sparkles, TrendingUp, BadgePercent, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomeModelContext } from './HomeModel';
import ProductCarousel from './ProductCarousel';

export default function ProductsSection() {
    const {
        t,
        loadingProducts,
        productError,
        flashProducts,
        standardProducts,
        bestSellingProducts,
        deepDiscountProducts,
        topRatedProducts,
    } = useHomeModelContext();
    const groups = [
        {
            id: 'best-selling-products',
            emptyText: t('customerUI.bestSellingEmpty'),
            title: t('customerUI.bestSelling'),
            hint: t('customerUI.bestSellingHint'),
            products: bestSellingProducts,
            icon: TrendingUp,
            url: '/collections/best-selling',
        },
        {
            id: 'deep-discount-products',
            emptyText: t('customerUI.deepDiscountEmpty'),
            title: t('customerUI.deepDiscount'),
            hint: t('customerUI.deepDiscountHint'),
            products: deepDiscountProducts,
            icon: BadgePercent,
            url: '/collections/deep-discount',
        },
        {
            id: 'top-rated-products',
            emptyText: t('customerUI.topRatedEmpty'),
            title: t('customerUI.topRated'),
            hint: t('customerUI.topRatedHint'),
            products: topRatedProducts,
            icon: Star,
            url: '/collections/top-rated',
        },
    ];
    return (
        <section className="mx-auto max-w-[1320px] space-y-8 px-4 py-9 sm:px-6">
            <div
                id="early-market-deals"
                className="rounded-[24px] bg-store-cream px-4 py-6 text-store-ink shadow-lg sm:px-6"
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="m-0 inline-flex items-center gap-2 font-subheading text-xl font-extrabold sm:text-2xl">
                        <BadgePercent className="text-store-green" />
                        {t('homePage.flashDealsTitle')}
                    </h2>
                    <Link
                        to="/collections/deals"
                        className="inline-flex items-center gap-1 text-sm font-bold text-store-green no-underline hover:underline"
                    >
                        {t('customerUI.viewAll')}
                        <ArrowRight size={16} />
                    </Link>
                </div>
                {loadingProducts ? (
                    <div className="mt-5">
                        <ProductCarousel
                            products={[]}
                            label={t('homePage.flashDealsTitle')}
                            loading
                        />
                    </div>
                ) : productError ? (
                    <p role="alert" className="mt-5 text-sm text-danger">
                        {t('homePage.productsError')}
                    </p>
                ) : flashProducts.length ? (
                    <div className="mt-5">
                        <ProductCarousel
                            products={flashProducts}
                            label={t('homePage.flashDealsTitle')}
                        />
                    </div>
                ) : (
                    <p className="mt-5 flex items-center gap-2 rounded-xl bg-white/75 p-4 text-sm text-store-muted">
                        <Clock3 size={18} />
                        {t('customerUI.flashEmptyHint')}
                    </p>
                )}
            </div>
            <div
                id="b2b-standard-supply"
                className="rounded-[24px] bg-store-cream px-4 py-6 text-store-ink shadow-lg sm:px-6"
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="m-0 inline-flex items-center gap-2 font-subheading text-xl font-extrabold sm:text-2xl">
                        <Sparkles className="text-store-green" />
                        {t('homePage.standardSupplyTitle')}
                    </h2>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-1 text-sm font-bold text-store-green no-underline hover:underline"
                    >
                        {t('customerUI.viewAll')}
                        <ArrowRight size={16} />
                    </Link>
                </div>
                {loadingProducts ? (
                    <div className="mt-5">
                        <ProductCarousel
                            products={[]}
                            label={t('homePage.standardSupplyTitle')}
                            loading
                        />
                    </div>
                ) : productError ? (
                    <p role="alert" className="mt-5 text-sm text-danger">
                        {t('homePage.productsError')}
                    </p>
                ) : standardProducts.length ? (
                    <div className="mt-5">
                        <ProductCarousel
                            products={standardProducts}
                            label={t('homePage.standardSupplyTitle')}
                        />
                    </div>
                ) : (
                    !loadingProducts && (
                        <p className="mt-5 text-sm text-store-muted">
                            {t('homePage.productsEmpty')}
                        </p>
                    )
                )}
            </div>
            {groups.map((group) => {
                const Icon = group.icon;
                return (
                    <div
                        key={group.id}
                        id={group.id}
                        className="rounded-[24px] bg-store-cream px-4 py-6 text-store-ink shadow-lg sm:px-6"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="m-0 inline-flex items-center gap-2 font-subheading text-xl font-extrabold sm:text-2xl">
                                    <Icon className="text-store-green" size={21} />
                                    {group.title}
                                </h2>
                                <p className="mt-1 text-xs text-store-muted">{group.hint}</p>
                            </div>
                            <Link
                                to={group.url}
                                className="inline-flex items-center gap-1 text-sm font-bold text-store-green no-underline hover:underline"
                            >
                                {t('customerUI.viewAll')}
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        {loadingProducts ? (
                            <ProductCarousel products={[]} label={group.title} loading />
                        ) : productError ? (
                            <p role="alert" className="mt-3 text-sm text-danger">
                                {t('homePage.productsError')}
                            </p>
                        ) : group.products.length ? (
                            <ProductCarousel products={group.products} label={group.title} />
                        ) : !loadingProducts && !productError ? (
                            <p className="mt-3 flex items-center gap-2 rounded-xl bg-white/70 p-4 text-sm text-store-muted">
                                <Clock3 size={18} />
                                {group.emptyText}
                            </p>
                        ) : null}
                    </div>
                );
            })}
        </section>
    );
}
