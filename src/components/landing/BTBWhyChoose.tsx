
import { useTranslation } from 'react-i18next';
import EditorialPhoto from './EditorialPhoto';

const benefits = [
    { id: 'catalog', icon: 'list-svgrepo-com.svg' },
    { id: 'pricing', icon: 'cashier-svgrepo-com.svg' },
    { id: 'stock', icon: 'check.svg' },
    { id: 'delivery', icon: 'landingpainpoints-icon-2.svg' },
    { id: 'history', icon: 'history-svgrepo-com.svg' },
    { id: 'direct', icon: 'cart-large-svgrepo-com.svg' },
] as const;

const audiences = [
    { id: 'business', photo: 'kitchen' },
    { id: 'personal', photo: 'vegetables' },
] as const;

export default function BTBWhyChoose() {
    const { t } = useTranslation('storefront');
    const prefix = 'introPages.aboutV2.why';

    return (
        <>
            {/* Customer benefits */}
            <section className="bg-store-cream px-5 py-14 sm:py-20">
                <div className="mx-auto max-w-[1320px]">
                    <div className="mb-10 max-w-3xl">
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-store-green sm:text-4xl">
                            {t(`${prefix}.benefitsTitle`)}
                        </h2>

                        <p className="mt-4 text-base leading-relaxed text-store-muted">
                            {t(`${prefix}.benefitsIntro`)}
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {benefits.map(({ id, icon }) => (
                            <article
                                key={id}
                                className="group rounded-2xl border border-store-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-store-green/30 hover:shadow-lg"
                            >
                                <div className="flex size-14 items-center justify-center rounded-xl bg-surface-green transition-colors group-hover:bg-store-yellow">
                                    <img
                                        src={`/icons/${icon}`}
                                        alt=""
                                        aria-hidden="true"
                                        className="size-7 object-contain"
                                        loading="lazy"
                                    />
                                </div>

                                <h3 className="mt-6 text-xl font-bold leading-snug text-store-green">
                                    {t(`${prefix}.benefits.${id}.title`)}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-store-muted sm:text-base">
                                    {t(`${prefix}.benefits.${id}.text`)}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer groups */}
            <section className="border-y border-store-line bg-surface-green px-5 py-14 sm:py-20">
                <div className="mx-auto max-w-[1320px]">
                    <div className="mx-auto mb-10 max-w-3xl text-center">
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-store-green sm:text-4xl">
                            {t(`${prefix}.audiencesTitle`)}
                        </h2>

                        <p className="mt-4 text-base leading-relaxed text-store-muted">
                            {t(`${prefix}.audiencesIntro`)}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {audiences.map(({ id, photo }) => (
                            <article
                                key={id}
                                className="group overflow-hidden rounded-3xl border border-store-line bg-white shadow-sm"
                            >
                                <div className="relative h-60 overflow-hidden sm:h-72">
                                    <EditorialPhoto
                                        photo={photo}
                                        alt={t(`${prefix}.audiences.${id}.imageAlt`)}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                    <span className="absolute right-4 top-4 rounded-full bg-store-dark/85 px-3 py-1.5 text-xs text-white">
                                        {t('landing.carousel.illustration')}
                                    </span>
                                </div>

                                <div className="p-7 sm:p-9">
                                    <h3 className="text-2xl font-bold text-store-green">
                                        {t(`${prefix}.audiences.${id}.title`)}
                                    </h3>

                                    <p className="mt-4 text-base leading-relaxed text-store-muted">
                                        {t(`${prefix}.audiences.${id}.text`)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
