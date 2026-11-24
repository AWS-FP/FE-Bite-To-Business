import { useTranslation } from 'react-i18next';
import BtbImagePlaceholder from './BtbImagePlaceholder';
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useEffect, useRef, useState } from 'react';
export default function LandingCarousel() {
    const { t } = useTranslation('storefront');
    const [slide, setSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [playing, setPlaying] = useState(true);
    const progressRef = useRef(0);
    const changeSlide = (next: number) => {
        setSlide((next + 5) % 5);
        progressRef.current = 0;
        setProgress(0);
    };
    useEffect(() => {
        if (!playing) return;
        const tick = window.setInterval(() => {
            progressRef.current += 100 / 90;
            if (progressRef.current >= 100) {
                progressRef.current = 0;
                setSlide((current) => (current + 1) % 5);
            }
            setProgress(progressRef.current);
        }, 50);
        return () => window.clearInterval(tick);
    }, [playing]);
    return (
        <div className="mb-8 text-left">
            <div className="relative h-[570px] w-full overflow-hidden sm:h-[520px] lg:h-[500px] rounded-[var(--radius-lg)] border-[3px] border-solid border-store-ink bg-store-ink shadow-[8px_8px_0_var(--color-store-ink)]" id="heroCarouselViewport">
                <span className="pointer-events-none absolute top-9 right-5 z-[25] rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold tracking-wide text-white/85 backdrop-blur-sm">{t('landing.carousel.illustration')}</span>
                <div className="absolute top-4 right-5 left-5 z-20 grid grid-cols-5 gap-2">
                    <div
                        className="h-[5px] cursor-pointer overflow-hidden rounded-full bg-store-cream/35"
                        data-slide="0"
                        aria-label={t('landing.carousel.goToSlide', { number: 1 })}
                        onClick={() => changeSlide(0)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                changeSlide(0);
                            }
                        }}
                    >
                        <div
                            className="h-full w-0 rounded-full bg-store-yellow transition-[width] duration-100 ease-linear"
                            id="progFill0"
                            style={{
                                width: slide > 0 ? '100%' : slide < 0 ? '0%' : `${progress}%`,
                            }}
                        ></div>
                    </div>
                    <div
                        className="h-[5px] cursor-pointer overflow-hidden rounded-full bg-store-cream/35"
                        data-slide="1"
                        aria-label={t('landing.carousel.goToSlide', { number: 2 })}
                        onClick={() => changeSlide(1)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                changeSlide(1);
                            }
                        }}
                    >
                        <div
                            className="h-full w-0 rounded-full bg-store-yellow transition-[width] duration-100 ease-linear"
                            id="progFill1"
                            style={{
                                width: slide > 1 ? '100%' : slide < 1 ? '0%' : `${progress}%`,
                            }}
                        ></div>
                    </div>
                    <div
                        className="h-[5px] cursor-pointer overflow-hidden rounded-full bg-store-cream/35"
                        data-slide="2"
                        aria-label={t('landing.carousel.goToSlide', { number: 3 })}
                        onClick={() => changeSlide(2)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                changeSlide(2);
                            }
                        }}
                    >
                        <div
                            className="h-full w-0 rounded-full bg-store-yellow transition-[width] duration-100 ease-linear"
                            id="progFill2"
                            style={{
                                width: slide > 2 ? '100%' : slide < 2 ? '0%' : `${progress}%`,
                            }}
                        ></div>
                    </div>
                    <div
                        className="h-[5px] cursor-pointer overflow-hidden rounded-full bg-store-cream/35"
                        data-slide="3"
                        aria-label={t('landing.carousel.goToSlide', { number: 4 })}
                        onClick={() => changeSlide(3)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                changeSlide(3);
                            }
                        }}
                    >
                        <div
                            className="h-full w-0 rounded-full bg-store-yellow transition-[width] duration-100 ease-linear"
                            id="progFill3"
                            style={{
                                width: slide > 3 ? '100%' : slide < 3 ? '0%' : `${progress}%`,
                            }}
                        ></div>
                    </div>
                    <div
                        className="h-[5px] cursor-pointer overflow-hidden rounded-full bg-store-cream/35"
                        data-slide="4"
                        aria-label={t('landing.carousel.goToSlide', { number: 5 })}
                        onClick={() => changeSlide(4)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                changeSlide(4);
                            }
                        }}
                    >
                        <div
                            className="h-full w-0 rounded-full bg-store-yellow transition-[width] duration-100 ease-linear"
                            id="progFill4"
                            style={{
                                width: slide > 4 ? '100%' : slide < 4 ? '0%' : `${progress}%`,
                            }}
                        ></div>
                    </div>
                </div>
                <div className="pointer-events-none absolute top-8 right-6 left-6 z-20 flex items-center justify-between">
                    <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border-2 border-solid border-store-yellow bg-store-ink px-3.5 py-1.5 text-xs font-bold text-store-cream shadow-[3px_3px_0_var(--color-store-ink)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--green-ok)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-status-active)_25%,transparent)]"></span>
                        <span id="carouselStatusText">{t('landing.carousel.status', { current: String(slide + 1).padStart(2, '0'), total: '05' })}</span>
                    </div>
                </div>
                <button
                    type="button"
                    className="absolute top-1/2 left-[18px] z-[25] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-solid border-store-ink bg-store-yellow text-[22px] font-extrabold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-transform hover:scale-[1.06] hover:bg-store-coral hover:text-white"
                    id="btnPrevSlide"
                    aria-label={t('landing.carousel.previous')}
                    onClick={() => changeSlide(slide - 1)}
                >
                    <img
                        src="/icons/chevron-left.svg"
                        alt=""
                        aria-hidden="true"
                        className="btb-ui-icon"
                    />
                </button>
                <button
                    type="button"
                    className="absolute top-1/2 right-[18px] z-[25] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-solid border-store-ink bg-store-yellow text-[22px] font-extrabold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-transform hover:scale-[1.06] hover:bg-store-coral hover:text-white"
                    id="btnNextSlide"
                    aria-label={t('landing.carousel.next')}
                    onClick={() => changeSlide(slide + 1)}
                >
                    <img
                        src="/icons/chevron-right.svg"
                        alt=""
                        aria-hidden="true"
                        className="btb-ui-icon"
                    />
                </button>
                <div
                    className="flex h-full w-[500%] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    id="heroCarouselTrack"
                    style={{ transform: `translateX(-${slide * 20}%)` }}
                >
                    <div className={'group relative flex h-full w-1/5 items-end overflow-hidden' + (slide === 0 ? ' active' : '')}>
                        <BtbImagePlaceholder className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition-transform duration-[5000ms] ease-out group-[.active]:scale-[1.11]" label={t('landing.carousel.warehouseAlt')} photo="warehouse" />
                        <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-store-ink)_30%,transparent)_0%,color-mix(in_srgb,var(--color-store-ink)_15%,transparent)_40%,color-mix(in_srgb,var(--color-store-green)_88%,transparent)_85%,color-mix(in_srgb,var(--color-store-ink)_96%,transparent)_100%)]"></div>
                        <div className="relative z-[5] flex w-full flex-wrap items-end justify-between gap-7 pt-12 pr-6 pb-7 pl-6 sm:pr-[76px] sm:pb-9 sm:pl-10 text-white">
                            <div className="max-w-[640px]">
                                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3 py-1 font-label text-xs font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]">
                                    {t('landing.carousel.warehouseScene')}
                                </span>
                                <h2 className="mb-2.5 font-subheading text-[clamp(24px,3vw,34px)] font-normal leading-[1.22] text-store-cream">
                                    {t('landing.carousel.warehouseTitle')}
                                </h2>
                                <p className="font-subtext text-[14.5px] leading-[1.55] text-store-cream">
                                    {t('landing.carousel.warehouseDescription')}
                                </p>
                            </div>
                            <div className="relative min-w-[280px] max-w-[340px] rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-4 text-store-ink shadow-[6px_6px_0_var(--color-store-ink)]">
                                <span className="absolute -top-[11px] right-3.5 rotate-2 rounded border-2 border-solid border-store-ink bg-store-pink px-2.5 py-0.5 text-[10px] font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]">Real-time Stock</span>
                                <div
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: 'var(--forest)',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {t('landing.carousel.noOversell')}
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-subheading)',
                                        fontWeight: '800',
                                        fontSize: '17px',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Available = On Hand − Reserved
                                </div>
                                <div style={{ fontSize: '12.5px', color: 'var(--text-body)' }}>
                                    {t('landing.carousel.reserveStock')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'group relative flex h-full w-1/5 items-end overflow-hidden' + (slide === 1 ? ' active' : '')}>
                        <BtbImagePlaceholder className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition-transform duration-[5000ms] ease-out group-[.active]:scale-[1.11]" label={t('landing.carousel.coldStorageAlt')} photo="seafood" />
                        <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-store-ink)_30%,transparent)_0%,color-mix(in_srgb,var(--color-store-ink)_15%,transparent)_40%,color-mix(in_srgb,var(--color-store-green)_88%,transparent)_85%,color-mix(in_srgb,var(--color-store-ink)_96%,transparent)_100%)]"></div>
                        <div className="relative z-[5] flex w-full flex-wrap items-end justify-between gap-7 pt-12 pr-6 pb-7 pl-6 sm:pr-[76px] sm:pb-9 sm:pl-10 text-white">
                            <div className="max-w-[640px]">
                                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3 py-1 font-label text-xs font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]">
                                    {t('landing.carousel.coldScene')}
                                </span>
                                <h2 className="mb-2.5 font-subheading text-[clamp(24px,3vw,34px)] font-normal leading-[1.22] text-store-cream">
                                    {t('landing.carousel.coldTitle')}
                                </h2>
                                <p className="font-subtext text-[14.5px] leading-[1.55] text-store-cream">
                                    {t('landing.carousel.coldDescription')}
                                </p>
                            </div>
                            <div className="relative min-w-[280px] max-w-[340px] rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-4 text-store-ink shadow-[6px_6px_0_var(--color-store-ink)]">
                                <span
                                    className="absolute -top-[11px] right-3.5 rotate-2 rounded border-2 border-solid border-store-ink bg-store-pink px-2.5 py-0.5 text-[10px] font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]"
                                    style={{ background: 'var(--yellow-soft)' }}
                                >
                                    {t('landing.carousel.haccp')}
                                </span>
                                <div
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: 'var(--coral)',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {t('landing.carousel.consistentQuality')}
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-subheading)',
                                        fontWeight: '800',
                                        fontSize: '17px',
                                        marginBottom: '6px',
                                    }}
                                >
                                    {t('landing.carousel.multiLocation')}
                                </div>
                                <div style={{ fontSize: '12.5px', color: 'var(--text-body)' }}>
                                    {t('landing.carousel.multiLocationDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'group relative flex h-full w-1/5 items-end overflow-hidden' + (slide === 2 ? ' active' : '')}>
                        <BtbImagePlaceholder className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition-transform duration-[5000ms] ease-out group-[.active]:scale-[1.11]" label={t('landing.carousel.ingredientsAlt')} photo="market" />
                        <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-store-ink)_30%,transparent)_0%,color-mix(in_srgb,var(--color-store-ink)_15%,transparent)_40%,color-mix(in_srgb,var(--color-store-green)_88%,transparent)_85%,color-mix(in_srgb,var(--color-store-ink)_96%,transparent)_100%)]"></div>
                        <div className="relative z-[5] flex w-full flex-wrap items-end justify-between gap-7 pt-12 pr-6 pb-7 pl-6 sm:pr-[76px] sm:pb-9 sm:pl-10 text-white">
                            <div className="max-w-[640px]">
                                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3 py-1 font-label text-xs font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]">
                                    {t('landing.carousel.foodScene')}
                                </span>
                                <h2 className="mb-2.5 font-subheading text-[clamp(24px,3vw,34px)] font-normal leading-[1.22] text-store-cream">
                                    {t('landing.carousel.foodTitle')}
                                </h2>
                                <p className="font-subtext text-[14.5px] leading-[1.55] text-store-cream">
                                    {t('landing.carousel.foodDescription')}
                                </p>
                            </div>
                            <div className="relative min-w-[280px] max-w-[340px] rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-4 text-store-ink shadow-[6px_6px_0_var(--color-store-ink)]">
                                <span className="absolute -top-[11px] right-3.5 rotate-2 rounded border-2 border-solid border-store-ink bg-store-pink px-2.5 py-0.5 text-[10px] font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]">{t('landing.carousel.poster')}</span>
                                <div
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: 'var(--coral)',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {t('landing.carousel.stackedOffers')}
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-subheading)',
                                        fontWeight: '800',
                                        fontSize: '17px',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Volume Pricing + Sale + Coupon
                                </div>
                                <div style={{ fontSize: '12.5px', color: 'var(--text-body)' }}>
                                    {t('landing.carousel.stackedDescription')}{' '}
                                    <code>MDFOOD10</code>.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'group relative flex h-full w-1/5 items-end overflow-hidden' + (slide === 3 ? ' active' : '')}>
                        <BtbImagePlaceholder className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition-transform duration-[5000ms] ease-out group-[.active]:scale-[1.11]" label={t('landing.carousel.deliveryAlt')} photo="warehouse" />
                        <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-store-ink)_30%,transparent)_0%,color-mix(in_srgb,var(--color-store-ink)_15%,transparent)_40%,color-mix(in_srgb,var(--color-store-green)_88%,transparent)_85%,color-mix(in_srgb,var(--color-store-ink)_96%,transparent)_100%)]"></div>
                        <div className="relative z-[5] flex w-full flex-wrap items-end justify-between gap-7 pt-12 pr-6 pb-7 pl-6 sm:pr-[76px] sm:pb-9 sm:pl-10 text-white">
                            <div className="max-w-[640px]">
                                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3 py-1 font-label text-xs font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]">
                                    {t('landing.carousel.deliveryScene')}
                                </span>
                                <h2 className="mb-2.5 font-subheading text-[clamp(24px,3vw,34px)] font-normal leading-[1.22] text-store-cream">
                                    {t('landing.carousel.deliveryTitle')}
                                </h2>
                                <p className="font-subtext text-[14.5px] leading-[1.55] text-store-cream">
                                    {t('landing.carousel.deliveryDescription')}
                                </p>
                            </div>
                            <div className="relative min-w-[280px] max-w-[340px] rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-4 text-store-ink shadow-[6px_6px_0_var(--color-store-ink)]">
                                <span
                                    className="absolute -top-[11px] right-3.5 rotate-2 rounded border-2 border-solid border-store-ink bg-store-pink px-2.5 py-0.5 text-[10px] font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)]"
                                    style={{
                                        background: 'var(--green-soft-bg)',
                                        color: 'var(--forest)',
                                    }}
                                >
                                    {t('landing.carousel.onTime')}
                                </span>
                                <div
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: 'var(--forest)',
                                        marginBottom: '4px',
                                    }}
                                >
                                    VIETMAP ROUTE &amp; ETA
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-subheading)',
                                        fontWeight: '800',
                                        fontSize: '17px',
                                        marginBottom: '6px',
                                    }}
                                >
                                    {t('landing.carousel.deliveryStatus')}
                                </div>
                                <div style={{ fontSize: '12.5px', color: 'var(--text-body)' }}>
                                    {t('landing.carousel.deliveryStatusDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'group relative flex h-full w-1/5 items-end overflow-hidden' + (slide === 4 ? ' active' : '')}>
                        <div className="relative z-[5] flex h-full w-full flex-col items-center justify-center bg-store-cream px-6 py-10 text-center text-store-ink">
                            <span
                                className="mb-[18px] inline-flex items-center gap-2 rounded-full border-2 border-solid border-store-ink bg-store-yellow px-4 py-1.5 text-[13px] font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]"
                                style={{
                                    background: 'var(--green-soft-bg)',
                                    color: 'var(--forest)',
                                    marginBottom: '14px',
                                }}
                            >
                                {t('landing.carousel.safetyTitle')}
                            </span>
                            <div className="mb-3.5 inline-flex items-center gap-4">
                                <img
                                    src="/images/storefront/brand-logo.png"
                                    alt={t('landing.carousel.logoAlt')}
                                    className="haccp-logo-img"
                                />
                                <div className="font-heading text-[clamp(36px,5vw,58px)] font-normal leading-none tracking-[0.02em] text-store-ink">BITE TO BUSINESS</div>
                            </div>
                            <div className="mb-[18px] font-body text-[clamp(18px,2.4vw,26px)] font-extrabold tracking-[0.12em] text-store-coral">
                                HACCP CODEX &amp; AI A2UI PLATFORM 2026
                            </div>
                            <p
                                style={{
                                    maxWidth: '620px',
                                    fontSize: '15px',
                                    color: 'var(--text-body)',
                                    marginBottom: '22px',
                                }}
                            >
                                {t('landing.carousel.safetyDescription')}
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                }}
                            >
                                <a href="#onboarding-cta" className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-coral text-white">
                                    {t('landing.carousel.openAccount')}{' '}
                                    <img
                                        className="btb-ui-icon"
                                        src="/icons/arrow-right.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </a>
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-cream text-store-ink hover:bg-store-yellow"
                                    id="btnReplayCarousel"
                                    onClick={() => {
                                        setPlaying(true);
                                        changeSlide(0);
                                    }}
                                >
                                    <img
                                        className="btb-ui-icon"
                                        src="/icons/rotate-ccw.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />{' '}
                                    {t('landing.carousel.replay')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute right-6 bottom-6 z-[25] flex items-center gap-2.5">
                    <button
                        type="button"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream text-[15px] text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-colors hover:bg-store-coral hover:text-white"
                        id="btnPlayPauseCarousel"
                        title={t('landing.carousel.playPause')}
                        aria-label={t('landing.carousel.playPause')}
                        onClick={() => setPlaying((v) => !v)}
                    >
                        <img
                            className="btb-ui-icon"
                            src={playing ? '/icons/pause.svg' : '/icons/play.svg'}
                            alt=""
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        type="button"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream text-[15px] text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-colors hover:bg-store-coral hover:text-white"
                        id="btnMuteCarousel"
                        disabled
                        title={t('landing.carousel.muted')}
                        aria-label={t('landing.carousel.muted')}
                    >
                        <img
                            src="/icons/volume-off.svg"
                            alt=""
                            aria-hidden="true"
                            className="btb-ui-icon"
                        />
                    </button>
                </div>
            </div>
            <div className="mt-3.5 grid grid-cols-5 gap-2.5">
                <button
                    type="button"
                    className={'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-2.5 text-left font-body text-[12.5px] font-bold text-store-ink shadow-[5px_5px_0_var(--color-store-ink)] transition-colors hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:bg-store-coral [&.active]:text-white' + (slide === 0 ? ' active' : '')}
                    data-chapter="0"
                    onClick={() => changeSlide(0)}
                >
                    <span className="rounded-md border-[1.5px] border-solid border-store-ink bg-store-yellow px-1.5 py-0.5 font-heading text-sm font-normal text-store-green">01</span>
                    <span>{t('landing.carousel.warehouseTab')}</span>
                </button>
                <button
                    type="button"
                    className={'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-2.5 text-left font-body text-[12.5px] font-bold text-store-ink shadow-[5px_5px_0_var(--color-store-ink)] transition-colors hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:bg-store-coral [&.active]:text-white' + (slide === 1 ? ' active' : '')}
                    data-chapter="1"
                    onClick={() => changeSlide(1)}
                >
                    <span className="rounded-md border-[1.5px] border-solid border-store-ink bg-store-yellow px-1.5 py-0.5 font-heading text-sm font-normal text-store-green">02</span>
                    <span>{t('landing.carousel.coldTab')}</span>
                </button>
                <button
                    type="button"
                    className={'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-2.5 text-left font-body text-[12.5px] font-bold text-store-ink shadow-[5px_5px_0_var(--color-store-ink)] transition-colors hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:bg-store-coral [&.active]:text-white' + (slide === 2 ? ' active' : '')}
                    data-chapter="2"
                    onClick={() => changeSlide(2)}
                >
                    <span className="rounded-md border-[1.5px] border-solid border-store-ink bg-store-yellow px-1.5 py-0.5 font-heading text-sm font-normal text-store-green">03</span>
                    <span>{t('landing.carousel.foodTab')}</span>
                </button>
                <button
                    type="button"
                    className={'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-2.5 text-left font-body text-[12.5px] font-bold text-store-ink shadow-[5px_5px_0_var(--color-store-ink)] transition-colors hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:bg-store-coral [&.active]:text-white' + (slide === 3 ? ' active' : '')}
                    data-chapter="3"
                    onClick={() => changeSlide(3)}
                >
                    <span className="rounded-md border-[1.5px] border-solid border-store-ink bg-store-yellow px-1.5 py-0.5 font-heading text-sm font-normal text-store-green">04</span>
                    <span>{t('landing.carousel.deliveryTab')}</span>
                </button>
                <button
                    type="button"
                    className={'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-2.5 text-left font-body text-[12.5px] font-bold text-store-ink shadow-[5px_5px_0_var(--color-store-ink)] transition-colors hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:bg-store-coral [&.active]:text-white' + (slide === 4 ? ' active' : '')}
                    data-chapter="4"
                    onClick={() => changeSlide(4)}
                >
                    <span className="rounded-md border-[1.5px] border-solid border-store-ink bg-store-yellow px-1.5 py-0.5 font-heading text-sm font-normal text-store-green">05</span>
                    <span>{t('landing.carousel.safetyTab')}</span>
                </button>
            </div>
        </div>
    );
}