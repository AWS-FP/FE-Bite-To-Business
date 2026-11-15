import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import LandingHeader from '@/components/landing/LandingHeader';
import Footer from '@/layouts/Footer';
import { ROUTES } from '@/router/routes';
import LandingPersonalization from '@/components/landing/LandingPersonalization';
import EditorialPhoto from './EditorialPhoto';
import '@/components/landing/landing.css';
import '@/components/landing/landingInfo.css';

type Props = {
    title: string;
    eyebrow: string;
    description: string;
    children: ReactNode;
    variant: 'why' | 'model';
};

const visuals = {
    why: {
        primary: 'market',
        secondary: 'chef',
        index: '01',
    },
    model: {
        primary: 'seafood',
        secondary: 'warehouse',
        index: '02',
    },
} as const;

export default function BTBInfoLayout({ title, eyebrow, description, children, variant }: Props) {
    const { t } = useTranslation('storefront');
    const visual = visuals[variant];

    return (
        <div className="flex min-h-dvh flex-col bg-store-cream text-store-ink">
            <div className="btb-landing flex-1">
                <LandingHeader />
                <main id="main-content" className="min-w-0 overflow-hidden bg-store-cream">
                    <section className="relative isolate overflow-hidden bg-store-green text-store-cream">
                        <div aria-hidden="true" className="pointer-events-none absolute -top-48 -right-36 size-[34rem] rounded-full border border-white/10" />
                        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-64 size-[34rem] rounded-full border border-white/10" />

                        <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 pt-14 pb-20 sm:px-8 lg:min-h-[630px] lg:grid-cols-[0.96fr_1.04fr] lg:gap-14 lg:py-20">
                            <div className="relative z-10 max-w-[620px]">
                                <span className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.19em] text-store-yellow uppercase">
                                    <span className="h-px w-8 bg-store-yellow" />
                                    {eyebrow}
                                </span>
                                <h1 className="mt-7 max-w-[680px] font-heading text-[clamp(2.8rem,5.5vw,5.4rem)] leading-[1.13] tracking-[-0.055em] text-store-cream">
                                    {title}
                                </h1>
                                <p className="mt-6 max-w-[530px] font-body text-[15px] leading-[1.9] text-white/75 sm:text-[17px]">
                                    {description}
                                </p>
                                <div className="mt-9 flex flex-wrap gap-3.5">
                                    <Link
                                        to={ROUTES.REGISTER}
                                        className="group inline-flex min-h-12 items-center gap-4 rounded-full bg-store-yellow px-6 py-3 text-[13px] font-extrabold text-store-ink shadow-[0_6px_0_rgba(0,0,0,.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,.13)]"
                                    >
                                        {t('introPages.start')}
                                        <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">↗</span>
                                    </Link>
                                    <Link
                                        to={ROUTES.LANDING}
                                        className="inline-flex min-h-12 items-center rounded-full border border-white/45 px-6 py-3 text-[13px] font-semibold text-white transition hover:border-white hover:bg-white/10"
                                    >
                                        {t('introPages.explore')}
                                    </Link>
                                </div>
                                <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/20 pt-5 text-xs text-white/70">
                                    <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-store-yellow" /> {t('introPages.visualBusiness')}</span>
                                    <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-store-pink" /> {t('introPages.visualPersonal')}</span>
                                </div>
                            </div>

                            <div className="relative mx-auto h-[385px] w-full max-w-[560px] sm:h-[480px] lg:h-[520px]" aria-label={variant === 'why' ? t('introPages.why.imageLabel') : t('introPages.model.imageLabel')} role="group">
                                <div className="absolute top-2 right-2 bottom-10 left-[8%] overflow-hidden rounded-[140px_20px_120px_20px] border-[7px] border-white/90 bg-store-sage shadow-[0_22px_65px_rgba(0,0,0,0.24)] sm:left-[14%]">
                                    <EditorialPhoto
                                        photo={visual.primary}
                                        alt=""
                                        loading="eager"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                        style={{ objectPosition: variant === 'why' ? 'center 45%' : 'center 50%' }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-store-dark/65 via-transparent to-transparent" />
                                </div>
                                <div className="absolute -bottom-3 left-0 w-[43%] rotate-[-6deg] overflow-hidden rounded-2xl border-[6px] border-white bg-store-cream shadow-[0_18px_40px_rgba(0,0,0,0.24)] sm:w-[40%]">
                                    <EditorialPhoto photo={visual.secondary} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                                </div>
                                <div className="absolute top-[11%] right-0 rotate-[7deg] rounded-xl bg-store-yellow px-5 py-4 text-store-ink shadow-[6px_7px_0_#14132b] sm:px-6">
                                    <span className="block font-price text-[36px] leading-none font-black tracking-[-0.08em] sm:text-[48px]">{visual.index}</span>
                                    <span className="mt-1 block text-[9px] font-extrabold tracking-[.18em] uppercase">BITE TO BUSINESS</span>
                                </div>
                                <div className="absolute right-[2%] bottom-14 rounded-xl border border-white/25 bg-store-dark/70 px-5 py-3 text-right text-white shadow-lg backdrop-blur-sm">
                                    <span className="block text-[10px] font-bold tracking-widest text-store-yellow">BTB</span>
                                    <span className="text-xs font-medium">{variant === 'why' ? t('introPages.hero.categoriesLabel') : t('introPages.hero.clearLabel')}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {children}
                    <LandingPersonalization />

                    <section className="bg-store-green py-14 text-store-cream sm:py-17">
                        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-8">
                            <div className="max-w-[630px]">
                                <span className="text-[11px] font-bold tracking-[.2em] text-store-yellow uppercase">{t('introPages.discover')}</span>
                                <h2 className="mt-4 font-heading text-[clamp(1.7rem,3vw,2.8rem)] leading-[1.3] tracking-tight">{t('introPages.discoverTitle')}</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link className="rounded-full border border-white/35 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-white/10" to={ROUTES.WHY_BTB}>{t('header.whyBtbPage')} ↗</Link>
                                <Link className="rounded-full bg-store-yellow px-5 py-3 text-[13px] font-bold text-store-ink transition hover:bg-white" to={ROUTES.BTB_MODEL}>{t('header.b2bModelPage')} ↗</Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
}
