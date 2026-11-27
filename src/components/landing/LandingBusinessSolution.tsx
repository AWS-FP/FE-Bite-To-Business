import { useTranslation } from 'react-i18next';
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export default function LandingBusinessSolution() {
    const { t } = useTranslation('storefront');
    const [openAccordion, setOpenAccordion] = useState(0);
    return (
        <section className="py-[72px]">
            <div className="mx-auto max-w-[1240px] px-6">
                <div className="rounded-[var(--radius-lg)] border-[3px] border-solid border-store-yellow bg-store-ink px-5 py-10 sm:px-12 sm:py-14 text-store-cream shadow-[10px_10px_0_var(--color-store-dark)]">
                    <div className="mx-auto mb-10 max-w-[680px] text-center [&_h2]:mb-4 [&_h2]:font-subheading [&_h2]:text-[clamp(28px,3.2vw,40px)] [&_h2]:font-bold [&_h2]:text-store-cream">
                        <h2>
                            {t('landing.solution.titleStart')}{' '}
                            <span className="rounded-lg bg-store-yellow px-2.5 font-medium italic text-store-ink">{t('landing.solution.titleHighlight')}</span>
                            {' '}{t('landing.solution.titleEnd')}
                        </h2>
                        <p
                            style={{
                                fontSize: '15px',
                                color: 'var(--color-surface-blue)',
                                marginBottom: '22px',
                            }}
                        >
                            {t('landing.solution.description')}
                        </p>
                        <a href="#onboarding-cta" className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-coral text-white">
                            {t('landing.solution.explore')}
                            <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-store-ink text-xs text-store-yellow">
                                <img
                                    src="/icons/arrow-right.svg"
                                    className="btb-ui-icon"
                                    alt=""
                                    aria-hidden="true"
                                />
                            </span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-2">
                        <div className="rounded-2xl bg-store-cream p-6 text-store-ink shadow-sm">
                            <h3 className="font-subheading text-xl font-bold text-store-green">{t('landing.live.solutionTitle')}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-store-muted">{t('landing.live.solutionDescription')}</p>
                            <div className="mt-5 grid gap-3">
                                {['quickTitle', 'stockTitle', 'routeTitle', 'pricingTitle'].map((key) => (
                                    <div key={key} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-store-green">
                                        <img src="/icons/check.svg" alt="" className="size-5 shrink-0 object-contain" />
                                        {t(`landing.solution.${key}`)}
                                    </div>
                                ))}
                            </div>
                            <Link to={ROUTES.CATALOG} className="mt-6 inline-flex rounded-full bg-store-yellow px-5 py-3 text-sm font-bold text-store-ink hover:bg-store-yellow/80">{t('landing.live.browseCatalog')}</Link>
                        </div>
                        <div className="flex flex-col gap-3" id="featureAccordionList">
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 0 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(0)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(0);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
                                    <span>{t('landing.solution.quickTitle')}</span>
                                    <span>
                                        <img
                                            src="/icons/chevron-up.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    {t('landing.solution.quickDescription')}
                                </div>
                            </div>
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 1 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(1)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(1);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
                                    <span>{t('landing.solution.stockTitle')}</span>
                                    <span>
                                        <img
                                            src="/icons/chevron-down.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    {t('landing.solution.stockDescription')}
                                </div>
                            </div>
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 2 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(2)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(2);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-bold text-store-cream">
                                    <span>
                                        {t('landing.solution.routeTitle')}
                                    </span>
                                    <span>
                                        <img
                                            src="/icons/chevron-down.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    {t('landing.solution.routeDescription')}
                                </div>
                            </div>
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 3 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(3)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(3);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-bold text-store-cream">
                                    <span>
                                        {t('landing.solution.pricingTitle')}
                                    </span>
                                    <span>
                                        <img
                                            src="/icons/chevron-down.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    {t('landing.solution.pricingDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}