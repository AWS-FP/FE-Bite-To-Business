import { useEffect, useRef } from 'react';
import { useHomeModelContext } from './HomeModel.tsx';
import { PARTNER_CATALOG_BRANDS } from '../../../constants/customer/partnerBrands';

// All names come from 2_brands(1).csv; each lane displays half the catalog.
const BRAND_LANES = [
    PARTNER_CATALOG_BRANDS.slice(0, 54),
    PARTNER_CATALOG_BRANDS.slice(54),
];

export default function PartnerStrip() {
    const { t } = useHomeModelContext();
    const sectionRef = useRef<HTMLElement | null>(null);
    const laneRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // The Web Animations API keeps the motion on the compositor: no custom CSS
        // keyframes, animation plugin, or global stylesheet changes are needed.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const animations = laneRefs.current
            .filter((lane): lane is HTMLDivElement => lane !== null)
            .map((lane, index) => {
                // Two identical groups per lane allow a seamless loop.
                const isReversed = index === 1;
                return lane.animate(
                    [
                        { transform: isReversed ? 'translateX(-50%)' : 'translateX(0)' },
                        { transform: isReversed ? 'translateX(0)' : 'translateX(-50%)' },
                    ],
                    {
                        duration: index === 0 ? 105000 : 115000,
                        iterations: Infinity,
                        easing: 'linear',
                    },
                );
            });

        const container = sectionRef.current;
        const pause = () => animations.forEach((animation) => animation.pause());
        const resume = () => animations.forEach((animation) => animation.play());

        container?.addEventListener('mouseenter', pause);
        container?.addEventListener('mouseleave', resume);

        return () => {
            container?.removeEventListener('mouseenter', pause);
            container?.removeEventListener('mouseleave', resume);
            animations.forEach((animation) => animation.cancel());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            aria-label={t('homePage.partnerTitle', 'Brands in the Bite to Business catalog')}
            className="overflow-hidden border-y border-[#17133A]/20 bg-[#FAF3E3] py-7 text-[#14132b]"
        >
            <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-5 lg:grid-cols-[330px_minmax(0,1fr)]">
                <h2 className="m-0 max-w-[430px] font-['Times_New_Roman',Georgia,serif] text-xl font-bold leading-snug text-[#14132b] sm:text-2xl">
                    {t('homePage.partnerTitle', 'Discover brands in the Bite to Business catalog.')}
                </h2>

                <div className="min-w-0 space-y-3 overflow-hidden" aria-label="Catalog brands">
                    {BRAND_LANES.map((brands, index) => (
                        <div key={index} className="w-full overflow-hidden">
                            <div
                                ref={(node) => {
                                    laneRefs.current[index] = node;
                                }}
                                className="flex w-max"
                            >
                                {[0, 1].map((copy) => (
                                    <div
                                        key={copy}
                                        aria-hidden={copy === 1}
                                        className="flex shrink-0 items-center gap-3 pr-3"
                                    >
                                        {brands.map((brand) => (
                                            <span
                                                key={brand}
                                                className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full border-2 border-[#17133A] bg-[#FFE14D] px-5 text-xs font-extrabold text-[#17133A] transition-colors hover:bg-white"
                                            >
                                                {brand}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
