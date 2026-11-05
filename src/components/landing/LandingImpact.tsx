/* Generated from the supplied HTML layout. Edit this section independently. */
import { useTranslation } from 'react-i18next';

export default function LandingImpact() {
    const { t } = useTranslation('storefront');
    return (
        <section className="py-[72px] !pt-4">
            <div className="mx-auto max-w-[1240px] px-6">
                <div className="mx-auto mb-11 max-w-[720px] text-center">
                    <span className="mb-2.5 inline-block rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3.5 py-1 font-label text-[15px] font-normal text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]">{t('introPages.impact.eyebrow')}</span>
                    <h2 className="mb-2.5 font-subheading text-[clamp(28px,3.2vw,40px)] font-normal leading-[1.22] text-store-cream">
                        {t('introPages.impact.title')}
                    </h2>
                    <p className="font-heading text-lg font-normal not-italic text-store-pink">
                        {t('introPages.impact.description')}
                    </p>
                </div>
                <div className="grid grid-cols-4 gap-5">
                    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="has-svg-bg flex h-[150px] items-center justify-center border-b-[2.5px] border-solid border-store-ink bg-store-cream text-[46px]">
                            <div className="svg-bg-watermark watermark-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="13" r="8" />
                                    <path d="M12 9V13L14.5 14.5" />
                                    <path d="M9.5 2H14.5" />
                                    <path d="M19 5L20.5 6.5" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 bg-store-ink px-[18px] py-5 text-center text-white">
                            <div className="mb-1.5 font-price text-[34px] font-normal leading-[1.1] text-store-yellow tabular-nums">
                                ↓ 50%
                            </div>
                            <div className="text-[13px] text-store-cream">
                                {t('introPages.impact.time')}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="has-svg-bg flex h-[150px] items-center justify-center border-b-[2.5px] border-solid border-store-ink bg-store-cream text-[46px]">
                            <div className="svg-bg-watermark watermark-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <ellipse cx="10" cy="7" rx="6" ry="3" />
                                    <path d="M4 7V12C4 13.66 6.69 15 10 15C13.31 15 16 13.66 16 12V7" />
                                    <path d="M4 12V17C4 18.66 6.69 20 10 20C13.31 20 16 18.66 16 17V12" />
                                    <path d="M16 10.5C18.5 11 20 12.1 20 13.5V18C20 19.5 17.8 20.7 15 21" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 bg-store-ink px-[18px] py-5 text-center text-white">
                            <div className="mb-1.5 font-price text-[34px] font-normal leading-[1.1] text-store-yellow tabular-nums">
                                ↓ 15%
                            </div>
                            <div className="text-[13px] text-store-cream">
                                {t('introPages.impact.cost')}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="has-svg-bg flex h-[150px] items-center justify-center border-b-[2.5px] border-solid border-store-ink bg-store-cream text-[46px]">
                            <div className="svg-bg-watermark watermark-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="2" y="6" width="13" height="11" rx="1.5" />
                                    <path d="M15 9H19L22 12.5V17H15V9Z" />
                                    <circle cx="6.5" cy="17.5" r="2" />
                                    <circle cx="18.5" cy="17.5" r="2" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 bg-store-ink px-[18px] py-5 text-center text-white">
                            <div className="mb-1.5 font-price text-[34px] font-normal leading-[1.1] text-store-yellow tabular-nums">
                                ↑ 99%
                            </div>
                            <div className="text-[13px] text-store-cream">
                                {t('introPages.impact.delivery')}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="has-svg-bg flex h-[150px] items-center justify-center border-b-[2.5px] border-solid border-store-ink bg-store-cream text-[46px]">
                            <div className="svg-bg-watermark watermark-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 3V21H21" />
                                    <rect x="7" y="12" width="3" height="6" rx="0.5" />
                                    <rect x="12" y="8" width="3" height="10" rx="0.5" />
                                    <rect x="17" y="5" width="3" height="13" rx="0.5" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 bg-store-ink px-[18px] py-5 text-center text-white">
                            <div className="mb-1.5 font-price text-[34px] font-normal leading-[1.1] text-store-yellow tabular-nums">
                                ↑ 20%
                            </div>
                            <div className="text-[13px] text-store-cream">
                                {t('introPages.impact.finance')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
