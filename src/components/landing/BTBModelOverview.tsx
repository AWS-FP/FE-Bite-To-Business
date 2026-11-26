
import { useTranslation } from 'react-i18next';

const steps = [
    'select',
    'quote',
    'review',
    'confirm',
    'prepare',
    'pay',
    'deliver',
] as const;

const services = [
    {
        id: 'ecommerce',
        icon: 'list-svgrepo-com.svg',
    },
    {
        id: 'logistics',
        icon: 'landingpainpoints-icon-1.svg',
    },
    {
        id: 'delivery',
        icon: 'landingpainpoints-icon-2.svg',
    },
] as const;

export default function BTBModelOverview() {
    const { t } = useTranslation('storefront');
    const prefix = 'introPages.aboutV2.model';

    return (
        <>
            {/* Customer purchasing journey */}
            <section
                id="btb-purchase-flow"
                className="scroll-mt-40 bg-store-cream px-5 py-14 sm:py-20"
            >
                <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div className="self-start">
                        <span className="inline-flex rounded-full bg-store-yellow px-4 py-2 text-xs font-bold uppercase tracking-wide text-store-green">
                            {t(`${prefix}.flowEyebrow`)}
                        </span>

                        <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-tight text-store-green sm:text-5xl">
                            {t(`${prefix}.flowTitle`)}
                        </h2>

                        <p className="mt-5 text-base leading-relaxed text-store-muted">
                            {t(`${prefix}.flowIntro`)}
                        </p>

                        <div className="mt-8 overflow-hidden rounded-3xl">
                            <img
                                src="/images/warehouse.jpg"
                                alt={t('landing.carousel.warehouseAlt')}
                                className="h-64 w-full object-cover sm:h-80"
                                loading="lazy"
                            />
                        </div>

                        <div className="mt-2 text-xs text-store-muted">
                            {t('landing.carousel.illustration')}
                        </div>

                        <div className="mt-7 rounded-2xl border border-store-line bg-white p-6">
                            <div className="flex items-center gap-3">
                                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-green">
                                    <img
                                        src="/icons/check.svg"
                                        alt=""
                                        className="size-5"
                                    />
                                </div>

                                <h3 className="text-lg font-bold text-store-green">
                                    {t(`${prefix}.stockTitle`)}
                                </h3>
                            </div>

                            <p className="mt-4 text-sm leading-relaxed text-store-muted">
                                {t(`${prefix}.stockText`)}
                            </p>
                        </div>
                    </div>

                    {/* Step-by-step process */}
                    <ol className="relative m-0 list-none space-y-5 p-0">
                        {steps.map((step, index) => (
                            <li
                                key={step}
                                className="relative flex items-start gap-5"
                            >
                                {index < steps.length - 1 && (
                                    <div
                                        aria-hidden="true"
                                        className="absolute bottom-[-20px] left-[23px] top-12 w-px bg-store-green/20"
                                    />
                                )}

                                <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-store-green text-base font-bold text-store-yellow">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                <article className="min-w-0 flex-1 rounded-2xl border border-store-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                                    <span className="text-xs font-semibold text-store-muted">
                                        {t(`${prefix}.steps.${step}.actor`)}
                                    </span>

                                    <h3 className="mt-2 text-xl font-bold leading-snug text-store-green">
                                        {t(`${prefix}.steps.${step}.title`)}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-store-muted">
                                        {t(`${prefix}.steps.${step}.text`)}
                                    </p>
                                </article>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* What BTB provides */}
            <section className="bg-store-green px-5 py-14 text-store-cream sm:py-20">
                <div className="mx-auto max-w-[1320px]">
                    <div className="mx-auto mb-10 max-w-3xl text-center">
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-store-cream sm:text-4xl">
                            {t(`${prefix}.rolesTitle`)}
                        </h2>

                        <p className="mt-4 text-base leading-relaxed text-store-muted-light">
                            {t(`${prefix}.rolesIntro`)}
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {services.map(({ id, icon }) => (
                            <article
                                key={id}
                                className="rounded-2xl border border-white/15 bg-white/5 p-7 transition-colors hover:bg-white/10"
                            >
                                <div className="flex size-14 items-center justify-center rounded-xl bg-store-yellow">
                                    <img
                                        src={`/icons/${icon}`}
                                        alt=""
                                        aria-hidden="true"
                                        className="size-7 object-contain"
                                    />
                                </div>

                                <h3 className="mt-6 text-xl font-bold text-store-cream">
                                    {t(`${prefix}.roles.${id}.title`)}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-store-muted-light">
                                    {t(`${prefix}.roles.${id}.text`)}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
