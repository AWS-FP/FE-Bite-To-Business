import EditorialPhoto from './EditorialPhoto';
import { useLandingAudience } from '@/hooks/useLandingAudience';
import { useTranslation } from 'react-i18next';

const steps = ['01', '02', '03', '04', '05', '06'];

export default function BTBModelOverview() {
    const { audience } = useLandingAudience();
    const { t } = useTranslation('storefront');
    const isBusiness = audience === 'business';

    const actors = [
        { id: '01', title: 'introPages.model.suppliers', text: 'introPages.model.suppliersText', color: 'bg-store-pink' },
        { id: '02', title: 'introPages.model.platform', text: 'introPages.model.platformText', color: 'bg-store-yellow' },
        { id: '03', title: 'introPages.model.buyers', text: 'introPages.model.buyersText', color: 'bg-store-mint' },
    ];

    return (
        <>
            <section className="py-18 sm:py-24" aria-labelledby="btb-model-title">
                <div className="mx-auto max-w-[1240px] px-6 md:px-8">
                    <div className="max-w-[900px]">
                        <span className="font-label text-xs font-semibold tracking-[.16em] text-store-green uppercase">{t('introPages.model.eyebrow')}</span>
                        <h2 id="btb-model-title" className="mt-4 font-heading text-[clamp(2rem,4vw,3.65rem)] leading-[1.26] tracking-[-.04em]">
                            {t('introPages.model.heading')} <em className="not-italic text-store-coral">{t('introPages.model.highlight')}</em>
                        </h2>
                        <p className="mt-5 text-[15px] leading-[1.95] text-store-muted">{t('introPages.model.description')} <strong className="font-semibold text-store-ink">{t('introPages.model.clarification')}</strong></p>
                    </div>

                    <div className="relative mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
                        {actors.map((actor, index) => (
                            <article key={actor.id} className="relative rounded-[23px] border border-store-line bg-white px-7 py-8 shadow-[0_12px_30px_rgba(20,19,43,.05)]">
                                <span className={`grid size-14 place-items-center rounded-2xl ${actor.color} font-price text-[20px] font-black text-store-ink`}>{actor.id}</span>
                                <h3 className="mt-6 font-display text-[21px] font-bold tracking-tight">{t(actor.title)}</h3>
                                <p className="mt-3 text-[13px] leading-[1.9] text-store-muted">{t(actor.text)}</p>
                                {index !== actors.length - 1 && <span aria-hidden="true" className="absolute right-4 bottom-7 text-2xl text-store-sage md:-right-4 md:top-1/2 md:bottom-auto md:z-10 md:grid md:size-8 md:-translate-y-1/2 md:place-items-center md:rounded-full md:bg-store-yellow md:text-store-ink">→</span>}
                            </article>
                        ))}
                    </div>

                    <div className="mt-18 grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <span className="font-label text-[11px] font-semibold tracking-[.17em] text-store-green uppercase">BITE TO BUSINESS / 06</span>
                            <h3 className="mt-5 font-heading text-[clamp(1.8rem,3vw,2.7rem)] leading-[1.35] tracking-[-.03em]">{t('introPages.model.heading')}</h3>
                            <p className="mt-4 max-w-[380px] text-[14px] leading-[1.9] text-store-muted">{t('introPages.model.description')}</p>
                            <div className="mt-7 hidden h-[210px] overflow-hidden rounded-2xl lg:block">
                                <EditorialPhoto photo="warehouse" alt="" loading="lazy" className="h-full w-full object-cover" />
                            </div>
                        </div>
                        <div className="relative grid gap-3 border-l-2 border-store-line pl-5 sm:pl-8">
                            {steps.map((number, index) => (
                                <article key={number} className="relative flex items-start gap-4 rounded-[18px] border border-store-line bg-white px-5 py-5 shadow-sm sm:gap-6 sm:px-6">
                                    <span aria-hidden="true" className="absolute top-8 -left-[27px] size-3 rounded-full border-2 border-store-cream bg-store-coral sm:-left-[39px]" />
                                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-store-cream font-price text-[17px] font-bold text-store-coral sm:size-14">{number}</span>
                                    <div>
                                        <h4 className="font-display text-[16px] leading-[1.4] font-bold text-store-ink sm:text-[19px]">{t(`introPages.model.steps.${index}.title`)}</h4>
                                        <p className="mt-2 text-[13px] leading-[1.85] text-store-muted">{t(`introPages.model.steps.${index}.text`)}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-store-line bg-[#EAF1E8] py-18 sm:py-22">
                <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[.88fr_1.12fr] lg:gap-16">
                    <div>
                        <span className="font-label text-xs tracking-[.16em] text-store-green uppercase">{t('introPages.model.audienceEyebrow')}</span>
                        <h2 className="mt-5 font-heading text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.3] tracking-[-.035em]">{t(isBusiness ? 'introPages.model.businessTitle' : 'introPages.model.personalTitle')}</h2>
                        <p className="mt-5 max-w-[490px] text-[15px] leading-[1.9] text-store-muted">{t(isBusiness ? 'introPages.model.businessText' : 'introPages.model.personalText')}</p>
                        <p className="mt-6 max-w-[500px] rounded-xl border-l-4 border-store-yellow bg-white/75 p-4 text-[12px] leading-[1.85] text-store-muted">{t('introPages.model.note')}</p>
                    </div>
                    <div className="relative overflow-hidden rounded-[28px] border-[6px] border-white bg-store-green shadow-[0_22px_50px_rgba(18,55,42,.17)]" role="img" aria-label={t('introPages.model.imageLabel')}>
                        <EditorialPhoto photo={isBusiness ? 'seafood' : 'produce'} alt="" loading="lazy" decoding="async" className="aspect-[5/4] w-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-store-dark/85 to-transparent px-6 pt-24 pb-6 text-white">
                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-wide sm:text-xs">
                                <span className="rounded-full bg-white/20 px-3 py-2 backdrop-blur-sm">{t('introPages.model.suppliers')}</span>
                                <span aria-hidden="true">→</span>
                                <span className="rounded-full bg-store-yellow px-3 py-2 text-store-ink">BTB</span>
                                <span aria-hidden="true">→</span>
                                <span className="rounded-full bg-white/20 px-3 py-2 backdrop-blur-sm">{t('introPages.model.buyers')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
