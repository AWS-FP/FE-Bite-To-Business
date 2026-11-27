import ProductCardSkeleton from '@/components/customer/home/ProductCardSkeleton';
import ProductShowcaseCard from '@/components/customer/home/ProductShowcaseCard';
import { toCardIncludingUnpriced } from '@/utils/customer/homeProductMapper';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { ROUTES } from '@/router/routes';
import { useMyFavorites } from '@/hooks/customer/useMyFavorites';
import PageNav from '@/components/common/PageNav';

export default function CustomerFavoritesPage() {
    const { t } = useTranslation('storefront');
    const tr = (key: string) => t(`customerUI.favoritesPage.${key}`);
    const { page, setPage, setLoading, result, loading, error, onRemoved, retry } = useMyFavorites();

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            <div className="mx-auto max-w-[1320px] px-4 pb-16 pt-8 sm:px-6">
                <PageNav back={{ label: tr('browse'), to: ROUTES.CATALOG }} />
                <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-store-green px-5 py-4 text-white sm:px-7 sm:py-5">
                    <Heart size={24} className="shrink-0 text-store-yellow" />
                    <div>
                        <h1 className="m-0 font-subheading text-xl font-bold sm:text-2xl">
                            {tr('title')}
                        </h1>
                        <p className="m-0 mt-1 text-sm text-white/80">{tr('subtitle')}</p>
                    </div>
                </div>
                {loading && (
                    <div aria-busy="true" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 12 }, (_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                )}
                {error && (
                    <div
                        role="alert"
                        className="mt-7 rounded-lg border border-red-200 bg-white p-5 text-red-700"
                    >
                        {tr('error')}
                        <button
                            type="button"
                            className="ml-4 font-bold underline"
                            onClick={retry}
                        >
                            {tr('retry')}
                        </button>
                    </div>
                )}
                {!loading && !error && result && result.content.length === 0 && (
                    <div className="mt-7 flex flex-col items-center gap-3 rounded-xl bg-white p-10 text-center shadow-sm">
                        <Heart size={36} className="text-store-sage" />
                        <p className="text-store-muted">{tr('empty')}</p>
                        <Link to={ROUTES.CATALOG} className="font-bold text-store-green">
                            {tr('browse')}
                        </Link>
                    </div>
                )}
                {!loading && !error && result && result.content.length > 0 && (
                    <>
                        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {result.content.map((product) => (
                                <ProductShowcaseCard
                                    key={product.productId}
                                    product={toCardIncludingUnpriced(product)}
                                    section="standard"
                                    knownFavorite
                                    onFavoriteRemoved={onRemoved}
                                />
                            ))}
                        </div>
                        {result.totalPages > 1 && (
                            <nav
                                aria-label={tr('pagination')}
                                className="mt-9 flex items-center justify-center gap-3"
                            >
                                <button
                                    type="button"
                                    disabled={page === 0}
                                    onClick={() => {
                                        setLoading(true);
                                        setPage((n) => n - 1);
                                    }}
                                    className="grid h-10 w-10 place-items-center rounded-lg border border-store-line bg-white disabled:opacity-40"
                                    aria-label={tr('previous')}
                                >
                                    <ChevronLeft />
                                </button>
                                <span className="text-sm font-semibold" aria-live="polite">
                                    {page + 1} / {result.totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page + 1 >= result.totalPages}
                                    onClick={() => {
                                        setLoading(true);
                                        setPage((n) => n + 1);
                                    }}
                                    className="grid h-10 w-10 place-items-center rounded-lg border border-store-line bg-white disabled:opacity-40"
                                    aria-label={tr('next')}
                                >
                                    <ChevronRight />
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
