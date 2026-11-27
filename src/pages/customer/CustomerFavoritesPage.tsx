import Skeleton from '@/components/common/Skeleton';
import { ChevronLeft, ChevronRight, Heart, ImageOff, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { ROUTES, routePaths } from '@/router/routes';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { useMyFavorites } from '@/hooks/customer/useMyFavorites';
import PageNav from '@/components/common/PageNav';

export default function CustomerFavoritesPage() {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const tr = (key: string) => t(`customerUI.favoritesPage.${key}`);
    const { page, setPage, setLoading, result, loading, error, removing, remove, retry } = useMyFavorites();

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
<div aria-busy="true" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <div key={i} className="border border-store-line bg-white"><Skeleton className="h-48 w-full rounded-none"/><div className="space-y-3 p-4"><Skeleton className="h-5 w-4/5"/><Skeleton className="h-4 w-1/2"/><Skeleton className="h-9 w-full"/></div></div>)}</div>
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
                                <article
                                    key={product.productId}
                                    className="
    isolate flex min-w-0 flex-col
    overflow-hidden rounded-none
    border border-store-line bg-white
    shadow-[5px_7px_0_rgba(17,58,42,0.18)]
    transition-shadow duration-300
    hover:shadow-[7px_10px_0_rgba(17,58,42,0.25)]
  "
                                >
                                    {/* Product image */}
                                    <Link
                                        to={routePaths.productDetail(product.productId)}
                                        className="
      relative flex h-48 shrink-0
      items-center justify-center
      overflow-hidden bg-[#f8f8f2] p-3
    "
                                    >
                                        {product.imageUrl ? (
                                            <img
                                                loading="lazy"
                                                src={product.imageUrl}
                                                alt={english ? product.nameEn : product.nameVi}
                                                className="
          block h-full w-full max-h-full max-w-full
          object-contain
          transition-transform duration-300
          hover:scale-105
        "
                                            />
                                        ) : (
                                            <ImageOff size={35} className="text-store-muted" />
                                        )}
                                    </Link>

                                    {/* Product information */}
                                    <div className="relative z-10 flex flex-1 flex-col gap-3 bg-white p-4">
                                        <p className="m-0 truncate text-xs text-store-muted">
                                            {product.sku}
                                        </p>

                                        <Link
                                            to={routePaths.productDetail(product.productId)}
                                            className="
        line-clamp-2 min-h-10
        text-sm font-bold leading-5
        text-store-ink no-underline
        hover:text-store-green
      "
                                        >
                                            {english
                                                ? product.nameEn || product.nameVi
                                                : product.nameVi || product.nameEn}
                                        </Link>

                                        <p className="m-0 mt-auto text-lg font-extrabold text-store-green">
                                            {product.listPrice == null
                                                ? tr('priceUnavailable')
                                                : formatCurrencyVnd(product.listPrice)}
                                        </p>

                                        <button
                                            type="button"
                                            disabled={removing === product.productId}
                                            onClick={() => void remove(product.productId)}
                                            className="
        inline-flex items-center justify-center gap-2
        border border-store-line bg-white
        px-3 py-2 text-xs font-bold
        text-store-green transition-colors
        hover:bg-store-cream
        disabled:opacity-50
      "
                                        >
                                            <Trash2 size={15} />
                                            {tr('remove')}
                                        </button>
                                    </div>
                                </article>
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
