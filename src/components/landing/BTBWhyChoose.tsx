import EditorialPhoto from './EditorialPhoto';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { useLandingAudience } from '@/hooks/useLandingAudience';
import { useTranslation } from 'react-i18next';

const advantages = ['01', '02', '03', '04', '05', '06'];

export default function BTBWhyChoose() {
    const { audience } = useLandingAudience();
    const { t } = useTranslation('storefront');
    const isBusiness = audience === 'business';

    return (
        <>
            <section className="py-18 sm:py-24" aria-labelledby="btb-why-title">
                <div className="mx-auto max-w-[1240px] px-6 md:px-8">
                    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-end lg:gap-20">
                        <div>
                            <span className="font-label text-xs font-semibold tracking-[.16em] text-store-green uppercase">{t('introPages.why.eyebrow')}</span>
                            <h2 id="btb-why-title" className="mt-4 font-heading text-[clamp(2rem,3.5vw,3.35rem)] leading-[1.3] tracking-[-.04em] text-store-ink">
                                {t('introPages.why.heading')} <em className="not-italic text-store-coral">{t('introPages.why.highlight')}</em>
                            </h2>
                        </div>
                        <p className="max-w-[590px] border-l-2 border-store-coral pl-6 text-[15px] leading-[1.95] text-store-muted sm:text-[16px]">{t('introPages.why.description')}</p>
                    </div>
                    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {advantages.map((number, index) => (
                            <article key={number} className="group relative flex min-h-[238px] flex-col overflow-hidden rounded-[22px] border border-store-line bg-white p-7 shadow-[0_10px_28px_rgba(20,19,43,0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-store-green/60 hover:shadow-[0_18px_34px_rgba(20,19,43,0.10)]">
                                <div aria-hidden="true" className={`absolute top-0 right-0 h-1.5 w-full ${index % 3 === 0 ? 'bg-store-yellow' : index % 3 === 1 ? 'bg-store-mint' : 'bg-store-pink'}`} />
                                <div className="flex items-center justify-between">
                                    <span className="font-price text-[15px] font-extrabold tracking-wider text-store-coral">{number} / 06</span>
                                    <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-store-cream text-lg text-store-green transition group-hover:bg-store-green group-hover:text-white">↗</span>
                                </div>
                                <h3 className="mt-7 max-w-[285px] font-display text-[19px] leading-[1.35] font-bold tracking-tight text-store-ink">{t(`introPages.why.benefits.${index}.title`)}</h3>
                                <p className="mt-3 text-[13px] leading-[1.85] text-store-muted">{t(`introPages.why.benefits.${index}.description`)}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-store-line bg-[#EAF1E8] py-18 sm:py-22">
                <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 md:px-8 lg:grid-cols-2 lg:gap-20">
                    <div className="relative order-2 lg:order-1">
                        <div className="relative overflow-hidden rounded-[28px] bg-store-green shadow-[0_22px_55px_rgba(18,55,42,.15)]">
                            <EditorialPhoto photo={isBusiness ? 'seafood' : 'produce'} alt={t('introPages.why.imageLabel')} loading="lazy" decoding="async" className="aspect-[5/4] w-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-store-dark/55 via-transparent to-transparent" />
                            <span className="absolute bottom-6 left-6 rounded-full border border-white/35 bg-white/90 px-4 py-2 text-[11px] font-extrabold tracking-[.08em] text-store-green uppercase backdrop-blur-sm">{t(isBusiness ? 'introPages.personal.business' : 'introPages.personal.personal')}</span>
                        </div>
                        <div aria-hidden="true" className="absolute -right-4 -bottom-5 -z-10 h-36 w-36 rounded-[28px] bg-store-yellow sm:-right-6" />
                    </div>
                    <div className="order-1 lg:order-2">
                        <span className="font-label text-xs tracking-[.16em] text-store-green uppercase">{t('introPages.why.audienceEyebrow')}</span>
                        <h2 className="mt-5 font-heading text-[clamp(2rem,3.7vw,3.6rem)] leading-[1.25] tracking-[-.04em]">{t(isBusiness ? 'introPages.why.businessTitle' : 'introPages.why.personalTitle')}</h2>
                        <p className="mt-6 max-w-[500px] text-[15px] leading-[1.9] text-store-muted">{t(isBusiness ? 'introPages.why.businessDescription' : 'introPages.why.personalDescription')}</p>
                        <Link className="mt-8 inline-flex items-center gap-3 border-b-2 border-store-green pb-2 text-[13px] font-bold text-store-green transition hover:gap-5" to={ROUTES.BTB_MODEL}>{t('introPages.why.viewModel')} <span aria-hidden="true">↗</span></Link>
                    </div>
                </div>
            </section>

            <section className="bg-store-yellow/65 py-6">
                <div className="mx-auto flex max-w-[1240px] gap-3 px-6 text-[12px] leading-[1.85] text-store-ink/80 md:px-8">
                    <span aria-hidden="true" className="mt-[1px] text-lg font-black">ⓘ</span>
                    <p><strong className="font-bold">{t('introPages.why.noticeTitle')}</strong> {t('introPages.why.notice')}</p>
                </div>
            </section>
        </>
    );
}
