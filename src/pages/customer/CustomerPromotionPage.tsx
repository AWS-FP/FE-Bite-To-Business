import { useState } from 'react';
import { useCatalogQuery } from '@/hooks/customer/useCatalogQuery';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import PageNav from '@/components/common/PageNav';
import Skeleton from '@/components/common/Skeleton';
import ProductCardSkeleton from '@/components/customer/home/ProductCardSkeleton';
import ProductShowcaseCard from '@/components/customer/home/ProductShowcaseCard';
import { getHomePromotionProducts } from '@/services/customer/homeService';
import { toCardIncludingUnpriced } from '@/utils/customer/homeProductMapper';
import { ROUTES } from '@/router/routes';

const PAGE_SIZE = 12;
const UUID_PATTERN = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export default function CustomerPromotionPage() {
    const { promotionId } = useParams();
    return <PromotionProducts key={promotionId} id={promotionId ?? ''} />;
}

function PromotionProducts({ id }: { id: string }) {
    const { t, i18n } = useTranslation('storefront');
    const [page, setPage] = useState(0);
    const validId = UUID_PATTERN.test(id);
    const { data, isPending, isError, error, refetch } = useCatalogQuery({
        queryKey: ['homepage', 'promotion', id, page],
        queryFn: ({ signal }) => getHomePromotionProducts(id, page, PAGE_SIZE, signal),
        enabled: validId,
        retry: false,
    });
    const promotion = data?.promotion;
    const english = i18n.resolvedLanguage?.startsWith('en');
    const title =
        promotion &&
        (english ? promotion.nameEn || promotion.nameVi : promotion.nameVi || promotion.nameEn);
    const description =
        promotion &&
        (english
            ? promotion.contentEn || promotion.contentVi
            : promotion.contentVi || promotion.contentEn);
    const products = data?.items.map(toCardIncludingUnpriced) ?? [];
    const expired = !validId || (isAxiosError(error) && error.response?.status === 404);
    const loading = validId && isPending;
    const paginationButton =
        'inline-flex items-center gap-2 rounded-lg border border-store-green bg-white px-4 py-2 text-sm font-semibold text-store-green hover:bg-store-yellow disabled:cursor-not-allowed disabled:opacity-40';

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            <div className="mx-auto max-w-[1320px] px-4 py-9 sm:px-6">
                <PageNav back={{ label: t('home'), to: ROUTES.HOME }} />
                <div className="mt-4 min-h-24 rounded-[18px] bg-store-green px-5 py-4 text-white sm:px-7 sm:py-5">
                    {loading ? (
                        <div aria-busy="true" className="space-y-3">
                            <Skeleton className="h-8 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ) : (
                        <>
                            <h1 className="m-0 font-subheading text-2xl font-bold sm:text-3xl">
                                {title || t('customerUI.promotionPage.title')}
                            </h1>
                            {description && (
                                <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                                    {description}
                                </p>
                            )}
                        </>
                    )}
                </div>
                {loading && (
                    <div
                        aria-busy="true"
                        className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    >
                        {Array.from({ length: PAGE_SIZE }, (_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                )}
                {(isError || !validId) && (
                    <p role="alert" className="mt-6 rounded-xl bg-white p-5">
                        {t(
                            expired
                                ? 'customerUI.promotionPage.unavailable'
                                : 'homePage.productsError',
                        )}
                        {!expired && (
                            <button type="button" className="ml-4 font-bold underline" onClick={() => void refetch()}>
                                {t('retry')}
                            </button>
                        )}
                    </p>
                )}
                {data && products.length === 0 && (
                    <div className="mt-6 flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-8 text-center">
                        <PackageOpen size={30} className="text-store-sage" />
                        <p className="m-0 text-sm text-store-muted">{t('customerUI.groupEmpty')}</p>
                    </div>
                )}
                {data && products.length > 0 && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductShowcaseCard
                                key={product.id}
                                product={product}
                                section="standard"
                            />
                        ))}
                    </div>
                )}
                {data && (page > 0 || data.hasNext) && (
                    <nav
                        aria-label={t('homePage.paginationLabel')}
                        className="mt-8 flex flex-wrap items-center justify-between gap-3"
                    >
                        <button
                            type="button"
                            className={paginationButton}
                            disabled={page === 0}
                            onClick={() => setPage((value) => value - 1)}
                        >
                            <ChevronLeft size={16} />
                            {t('homePage.previousPage')}
                        </button>
                        <span className="text-sm">
                            {t('homePage.pageNumber', { page: page + 1 })}
                        </span>
                        <button
                            type="button"
                            className={paginationButton}
                            disabled={!data.hasNext}
                            onClick={() => setPage((value) => value + 1)}
                        >
                            {t('homePage.nextPage')}
                            <ChevronRight size={16} />
                        </button>
                    </nav>
                )}
            </div>
        </StorefrontLayout>
    );
}
