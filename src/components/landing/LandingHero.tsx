
import { useTranslation } from 'react-i18next';
import LandingCarousel from './LandingCarousel';
import LandingPartners from './LandingPartners';
import { useLandingAudience } from '@/hooks/useLandingAudience';

const heroHighlights = [
    {
        title: 'introPages.hero.quantity',
        description: 'introPages.hero.quantityLabel',
    },
    {
        title: 'introPages.hero.categories',
        description: 'introPages.hero.categoriesLabel',
    },
    {
        title: 'introPages.hero.clear',
        description: 'introPages.hero.clearLabel',
    },
    {
        title: 'introPages.hero.groups',
        description: 'introPages.hero.groupsLabel',
    },
] as const;

export default function LandingHero() {
    const { t } = useTranslation('storefront');
    const { audience } = useLandingAudience();

    return (
        <section
            className="relative bg-store-green pt-12 pb-14 text-center sm:pt-16"
            id="top-hero"
        >
            <div className="mx-auto max-w-[1240px] px-6">
                {/* Hero badge */}
                <div className="mb-[18px] inline-flex items-center gap-2 rounded-full border-2 border-solid border-store-ink bg-store-yellow px-4 py-1.5 text-[13px] font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]">
                    <span>{t('introPages.hero.eyebrow')}</span>
                </div>

                {/* Hero title */}
                <h1
                    className="mx-auto mb-3.5 max-w-[900px] font-heading text-[clamp(38px,5.2vw,66px)] font-normal leading-[1.18] text-store-cream [text-shadow:3px_3px_0_var(--color-store-ink)] [&_em]:font-heading [&_em]:font-bold [&_em]:not-italic [&_em]:text-store-yellow"
                    id="heroMainTitle"
                >
                    {t(
                        audience === 'business'
                            ? 'landing.hero.businessTitle'
                            : 'landing.hero.personalTitle',
                    )}{' '}
                    <em>
                        {t(
                            audience === 'business'
                                ? 'landing.hero.businessHighlight'
                                : 'landing.hero.personalHighlight',
                        )}
                    </em>
                </h1>

                {/* Hero description */}
                <p
                    className="mx-auto mb-[18px] max-w-[660px] font-subtext text-[16.5px] text-store-cream"
                    id="heroSubText"
                >
                    {t(
                        audience === 'business'
                            ? 'landing.hero.businessDescription'
                            : 'landing.hero.personalDescription',
                    )}
                </p>

                {/* Hero actions */}
                <div className="mb-9 flex flex-wrap justify-center gap-3.5">
                    <a
                        href="#categories"
                        className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink bg-store-coral px-6 py-3 font-body text-[15px] font-bold text-white no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)]"
                    >
                        {t('introPages.hero.start')}

                        <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-store-ink text-xs text-store-yellow">
                            <img
                                src="/icons/arrow-right.svg"
                                className="btb-ui-icon"
                                alt=""
                                aria-hidden="true"
                            />
                        </span>
                    </a>

                    <a
                        href="#catalog-preview"
                        className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink bg-store-cream px-6 py-3 font-body text-[15px] font-bold text-store-ink no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow hover:shadow-[6px_6px_0_var(--color-store-ink)]"
                    >
                        {t('introPages.hero.catalog')}
                    </a>
                </div>

                {/* Introduction carousel */}
                <LandingCarousel />

                {/* Hero highlights */}
                <div className="mb-8 grid grid-cols-2 items-stretch gap-3 sm:gap-[18px] lg:grid-cols-4">
                    {heroHighlights.map(({ title, description }) => (
                        <div
                            key={title}
                            className="flex h-full min-w-0 flex-col rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-5 text-center shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px] sm:px-[18px] sm:py-[22px]"
                        >
                            <div className="mb-3 flex min-h-[2.4em] items-center justify-center font-heading text-xl font-bold leading-[1.2] text-store-coral sm:text-2xl xl:text-[32px]">
                                <span className="text-balance">
                                    {t(title)}
                                </span>
                            </div>

                            <p className="m-0 font-body text-[13.5px] font-bold leading-relaxed text-store-ink">
                                {t(description)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Brand partners */}
                <LandingPartners />
            </div>
        </section>
    );
}
