/* Generated from the supplied HTML layout. Edit this section independently. */
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LandingCTA() {
    const navigate = useNavigate();
    const { t } = useTranslation('storefront');
    return (
        <section
            className="mt-10 border-t-[3px] border-solid border-store-ink bg-store-green py-16 text-store-cream"
            id="onboarding-cta"
        >
            <div className="mx-auto grid max-w-[1240px] grid-cols-[5fr_7fr] items-center gap-10 px-6">
                <div>
                    <span className="showcase-badge">{t('introPages.cta.eyebrow')}</span>
                    <h2 className="mb-3.5 font-subheading text-4xl font-bold leading-[1.2] text-white">
                        {t('introPages.cta.title')}
                        <br />
                        <span className="text-store-yellow">{t('introPages.cta.highlight')}</span> {t('introPages.cta.suffix')}
                    </h2>
                    <p className="mb-7 text-[15px] text-surface-green">
                        {t('introPages.cta.description')}
                    </p>
                    <div className="flex flex-wrap gap-3.5">
                        <button
                            type="button"
                            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-coral text-white"
                            id="btnCreateAccountCta"
                            onClick={() => navigate('/register')}
                        >
                            {t('header.register')}
                            <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-store-ink text-xs text-store-yellow">
                                <img
                                    src="/images/ui/arrow-right.svg"
                                    className="btb-ui-icon"
                                    alt=""
                                    aria-hidden="true"
                                />
                            </span>
                        </button>
                        <button
                            type="button"
                            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-cream text-store-ink hover:bg-store-yellow"
                            id="btnSignInCta"
                            style={{
                                background: 'transparent',
                                color: 'var(--color-white)',
                                borderColor:
                                    'color-mix(in srgb, var(--color-white) 40%, transparent)',
                            }}
                            onClick={() => navigate('/login')}
                        >
                            {t('header.login')}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-[18px] rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-[22px] py-[18px] text-store-ink shadow-[6px_6px_0_var(--color-store-ink)]">
                        <span className="min-w-12 rounded-xl border-2 border-solid border-store-ink bg-store-green px-3 py-1 text-center font-heading text-4xl font-normal leading-none text-store-yellow shadow-[3px_3px_0_var(--color-store-ink)]">
                            1
                        </span>
                        <div>
                            <strong className="mb-1 block font-subheading text-[19px] text-store-ink">
                                {t('introPages.cta.step1')}
                            </strong>
                            <span className="text-[13.5px] text-store-green">
                                {t('introPages.cta.step1Text')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-[18px] rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-[22px] py-[18px] text-store-ink shadow-[6px_6px_0_var(--color-store-ink)]">
                        <span className="min-w-12 rounded-xl border-2 border-solid border-store-ink bg-store-green px-3 py-1 text-center font-heading text-4xl font-normal leading-none text-store-yellow shadow-[3px_3px_0_var(--color-store-ink)]">
                            2
                        </span>
                        <div>
                            <strong className="mb-1 block font-subheading text-[19px] text-store-ink">
                                {t('introPages.cta.step2')}
                            </strong>
                            <span className="text-[13.5px] text-store-green">
                                {t('introPages.cta.step2Text')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-[18px] rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-[22px] py-[18px] text-store-ink shadow-[6px_6px_0_var(--color-store-ink)]">
                        <span className="min-w-12 rounded-xl border-2 border-solid border-store-ink bg-store-green px-3 py-1 text-center font-heading text-4xl font-normal leading-none text-store-yellow shadow-[3px_3px_0_var(--color-store-ink)]">
                            3
                        </span>
                        <div>
                            <strong className="mb-1 block font-subheading text-[19px] text-store-ink">
                                {t('introPages.cta.step3')}
                            </strong>
                            <span className="text-[13.5px] text-store-green">
                                {t('introPages.cta.step3Text')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
