import { useTranslation } from 'react-i18next';
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useState } from 'react';

export default function LandingBusinessSolution({
    showToast,
}: {
    showToast: (key: string) => void;
}) {
    const { t } = useTranslation('storefront');
    const [openAccordion, setOpenAccordion] = useState(0);
    return (
        <section className="py-[72px]">
            <div className="mx-auto max-w-[1240px] px-6">
                <div className="rounded-[var(--radius-lg)] border-[3px] border-solid border-store-yellow bg-store-ink px-12 py-14 text-store-cream shadow-[10px_10px_0_var(--color-store-dark)]">
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
                    <div className="grid grid-cols-2 items-center gap-9">
                        <div className="rounded-[var(--radius-md)] border-[3px] border-solid border-store-ink bg-store-cream p-[22px] text-store-ink shadow-[6px_6px_0_var(--color-store-coral)]">
                            <div className="mb-3.5 flex items-center justify-between border-b-2 border-solid border-store-ink pb-3">
                                <div>
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: 'var(--forest)',
                                        }}
                                    >
                                        {t('landing.solution.draft')}
                                    </div>
                                    <strong
                                        style={{
                                            fontFamily: 'var(--font-subheading)',
                                            fontSize: '18px',
                                        }}
                                    >
                                        {t('landing.solution.quoteTitle')}
                                    </strong>
                                </div>
                                <span
                                    style={{
                                        background: 'var(--yellow-tint)',
                                        color: 'var(--color-warning)',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        padding: '4px 10px',
                                        borderRadius: '99px',
                                    }}
                                >
                                    {t('landing.solution.revision')}
                                </span>
                            </div>
                            <div className="mb-2.5 flex items-center justify-between rounded-[var(--radius-sm)] border-2 border-solid border-store-ink bg-store-cream px-3.5 py-2.5 text-[13px] shadow-[3px_3px_0_var(--color-store-ink)]">
                                <div>
                                    <strong>{t('landing.solution.salmon')}</strong>
                                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                        {t('landing.solution.salmonNote')}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <strong style={{ color: 'var(--forest)' }}>
                                        {t('landing.solution.salmonPrice')}
                                    </strong>
                                    <div style={{ fontSize: '11px', color: 'var(--coral)' }}>
                                        {t('landing.solution.salmonSavings')}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2.5 flex items-center justify-between rounded-[var(--radius-sm)] border-2 border-solid border-store-ink bg-store-cream px-3.5 py-2.5 text-[13px] shadow-[3px_3px_0_var(--color-store-ink)]">
                                <div>
                                    <strong>{t('landing.solution.springRolls')}</strong>
                                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                        {t('landing.solution.springRollNote')}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <strong style={{ color: 'var(--forest)' }}>
                                        {t('landing.solution.springRollPrice')}
                                    </strong>
                                    <div style={{ fontSize: '11px', color: 'var(--green-ok)' }}>
                                        {t('landing.solution.stock')}
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '14px',
                                    paddingTop: '12px',
                                    borderTop: 'var(--border-subtle)',
                                }}
                            >
                                <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
                                    {t('landing.solution.coupon')}{' '}
                                    <code>MDFOOD10</code>{' '}
                                    (-10%)
                                </span>
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-coral text-white"
                                    id="btnMockupConfirmOrder"
                                    style={{ padding: '8px 18px', fontSize: '13px' }}
                                    onClick={() =>
                                        showToast(
                                            'landing.solution.confirmToast',
                                        )
                                    }
                                >
                                    {t('landing.solution.confirm')}
                                </button>
                            </div>
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
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
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
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
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