import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { usePartnerBrands } from '@/hooks/customer/usePartnerBrands';

export default function PartnerStrip() {
    const { t } = useTranslation('storefront');
    const { brands, error } = usePartnerBrands();
    const trackRef = useRef<HTMLDivElement>(null);

    // Chỉ là hiệu ứng cuộn của dải logo (UI), dữ liệu lấy từ usePartnerBrands.
    useEffect(() => {
        if (
            !brands.length ||
            !trackRef.current ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
            return;
        const track = trackRef.current;
        const animation = track.animate(
            [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
            {
                duration: Math.max(22000, brands.length * 3800),
                iterations: Infinity,
                easing: 'linear',
            },
        );
        const pause = () => animation.pause();
        const resume = () => animation.play();
        track.addEventListener('mouseenter', pause);
        track.addEventListener('mouseleave', resume);
        return () => {
            track.removeEventListener('mouseenter', pause);
            track.removeEventListener('mouseleave', resume);
            animation.cancel();
        };
    }, [brands]);

    return (
        <section
            className="border-y border-store-ink/15 bg-store-cream py-7 text-store-ink"
            aria-label={t('homePage.partnerTitle')}
        >
            <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
                <div className="mb-5 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
                    <h2 className="m-0 font-subheading text-lg font-bold sm:text-xl">
                        {t('homePage.partnerTitle')}
                    </h2>
                    <Link
                        to={ROUTES.BRANDS}
                        className="inline-flex items-center gap-2 text-sm font-extrabold text-store-green no-underline hover:underline"
                    >
                        {t('brandPage.allBrands')} <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
            {brands.length > 0 ? (
                <div className="overflow-hidden" aria-label={t('customerUI.brandLogos')}>
                    <div ref={trackRef} className="flex w-max items-center">
                        {[0, 1].map((copy) => (
                            <div
                                key={copy}
                                aria-hidden={copy === 1}
                                className="flex shrink-0 items-center gap-5 pr-5"
                            >
                                {brands.map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl bg-white px-4 py-3 shadow-sm"
                                        title={brand.name}
                                    >
                                        <img
                                            src={brand.logoUrl!}
                                            alt={copy === 0 ? brand.name : ''}
                                            className="h-full w-full object-contain"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="m-0 px-4 text-center text-sm text-store-muted">
                    {t(error ? 'customerUI.brandLoadError' : 'customerUI.brandEmpty')}
                </p>
            )}
        </section>
    );
}
