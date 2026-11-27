
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCatalogQuery } from '@/hooks/customer/useCatalogQuery';
import { getBrandDirectory } from '@/services/customer/brandService';
import { brandPath } from '@/utils/customer/brandPath';
import { ROUTES } from '@/router/routes';

interface BrandLogoProps {
  name: string;
  logoUrl: string | null;
}

function BrandLogo({ name, logoUrl }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2 sm:size-16">
      {logoUrl && !failed ? (
        <img
          src={logoUrl}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-body text-2xl font-bold text-store-green"
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function LandingPartners() {
  const { t } = useTranslation('storefront');

  const { data, isPending, isError, refetch } = useCatalogQuery({
    queryKey: ['landingBrandDirectory'],
    queryFn: ({ signal }) => getBrandDirectory(signal),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });

  const brands = (data ?? []).filter(
    (brand) => (brand.productCount ?? 0) > 0,
  );

  const countsUnavailable = Boolean(
    data?.some((brand) => brand.productCount === null),
  );

  const animate = brands.length > 4;

  return (
    <section
      aria-label={t('landing.live.brandsTitle')}
      className="py-4 text-store-cream"
    >
      {/* Section header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-left">
        <h2 className="font-body text-lg font-bold">
          {t('landing.live.brandsTitle')}
        </h2>

        <Link
          to={ROUTES.BRANDS}
          className="text-sm font-semibold text-store-yellow no-underline hover:underline"
        >
          {t('brandPage.allBrands')}
        </Link>
      </div>

      {/* Loading state */}
      {isPending ? (
        <p role="status" className="py-5 text-sm">
          {t('landing.live.brandsLoading')}
        </p>
      ) : isError || countsUnavailable ? (
        /* Error state */
        <div
          role="status"
          className="flex flex-wrap items-center justify-center gap-3 py-5 text-sm"
        >
          <span>{t('customerUI.brandLoadError')}</span>

          <button
            type="button"
            onClick={() => void refetch()}
            className="underline"
          >
            {t('brandPage.retry')}
          </button>
        </div>
      ) : brands.length === 0 ? (
        /* Empty state */
        <p role="status" className="py-5 text-sm">
          {t('landing.live.brandsEmpty')}
        </p>
      ) : (
        /* Brand marquee */
        <div
          className={
            animate
              ? 'overflow-x-auto [scrollbar-width:none] motion-reduce:[scrollbar-width:thin]'
              : 'overflow-x-auto'
          }
        >
          <div
            className={
              animate
                ? 'flex w-max motion-safe:animate-[marqueeScroll_60s_linear_infinite] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]'
                : 'flex w-max max-w-full flex-wrap gap-3'
            }
            style={
              animate
                ? {
                  animationDuration: `${Math.max(
                    28,
                    brands.length * 3,
                  )}s`,
                }
                : undefined
            }
          >
            {[false, ...(animate ? [true] : [])].map(
              (duplicate) => (
                <div
                  key={String(duplicate)}
                  aria-hidden={duplicate || undefined}
                  className={`flex shrink-0 gap-3 ${animate
                      ? 'pr-3'
                      : 'max-w-full flex-wrap'
                    } ${duplicate
                      ? 'motion-reduce:hidden'
                      : ''
                    }`}
                >
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      to={brandPath(brand, data ?? [])}
                      tabIndex={
                        duplicate ? -1 : undefined
                      }
                      className="group flex min-h-24 w-60 shrink-0 items-center gap-4 rounded-xl border border-white/20 bg-store-dark px-4 py-3 text-left no-underline transition-colors duration-200 hover:border-store-yellow hover:bg-store-green focus-visible:outline-2 focus-visible:outline-store-yellow"
                    >
                      <BrandLogo
                        key={brand.logoUrl}
                        name={brand.name}
                        logoUrl={brand.logoUrl}
                      />

                      <div className="min-w-0 flex-1">
                        <span
                          title={brand.name}
                          className="block break-words font-body text-base font-semibold leading-snug text-store-cream"
                        >
                          {brand.name}
                        </span>

                        <span className="mt-1 block font-body text-xs font-medium text-store-yellow">
                          {t(
                            'brandPage.productCount',
                            {
                              count:
                                brand.productCount ??
                                0,
                            },
                          )}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </section>
  );
}
