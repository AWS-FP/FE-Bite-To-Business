import { ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useHomeModelContext } from './home/HomeModel';

/** All slides are published banner images returned by Customer Homepage API. */
export default function CoverflowSlider() {
    const { t, i18n } = useTranslation('storefront');
    const { banners } = useHomeModelContext();
    const slides = banners.filter((item) => Boolean(item.imageUrl?.trim()));
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const current = slides.length ? active % slides.length : 0;

    useEffect(() => {
        if (slides.length < 2 || paused) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = window.setInterval(
            () => setActive((previous) => (previous + 1) % slides.length),
            4500,
        );
        return () => window.clearInterval(timer);
    }, [slides.length, paused]);

    const go = (direction: number) => {
        if (slides.length > 1)
            setActive((previous) => (previous + direction + slides.length) % slides.length);
    };

    return (
        <section
            aria-label={t('homePage.sliderLabel')}
            className="overflow-hidden bg-store-green px-4 py-8 sm:px-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') go(-1);
                if (event.key === 'ArrowRight') go(1);
            }}
        >
            <div className="relative mx-auto max-w-[1320px] rounded-[28px] bg-store-dark/70 px-3 pb-16 pt-6 sm:px-14 sm:pt-9">
                {slides.length === 0 ? (
                    <div className="flex min-h-[290px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/35 bg-white/5 px-6 text-center text-store-cream sm:min-h-[390px]">
                        <Megaphone size={34} className="mb-4 text-store-yellow" />
                        <h2 className="m-0 font-subheading text-xl font-bold">
                            {t('customerUI.bannerEmptyTitle')}
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-white/70">
                            {t('customerUI.bannerEmptyDescription')}
                        </p>
                    </div>
                ) : (
                    <>
                        <div
                            className="relative h-[290px] overflow-hidden sm:h-[390px]"
                            aria-live="off"
                        >
                            {slides.map((slide, index) => {
                                const clockwise = (index - current + slides.length) % slides.length;
                                const offset =
                                    clockwise > slides.length / 2
                                        ? clockwise - slides.length
                                        : clockwise;
                                const visible = Math.abs(offset) <= 2;
                                const heading = i18n.resolvedLanguage?.startsWith('en')
                                    ? slide.titleEn
                                    : slide.titleVi;
                                const target =
                                    slide.targetUrl?.startsWith('/') &&
                                    !slide.targetUrl.startsWith('//')
                                        ? slide.targetUrl
                                        : null;
                                const content = (
                                    <>
                                        <img
                                            src={slide.imageUrl!}
                                            alt={heading}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-store-dark/90 via-store-dark/30 to-transparent px-5 pb-5 pt-14 text-center text-sm font-bold text-white sm:text-lg">
                                            {heading}
                                        </div>
                                    </>
                                );
                                return (
                                    <div
                                        key={slide.id}
                                        aria-hidden={!visible}
                                        className="absolute left-1/2 top-0 h-[95%] w-[75%] overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl transition-[transform,opacity] duration-700 ease-out sm:w-[58%]"
                                        style={{
                                            transform: `translateX(calc(-50% + ${offset * 55}%)) perspective(950px) rotateY(${-offset * 25}deg) scale(${offset === 0 ? 1 : 0.82})`,
                                            opacity: visible
                                                ? Math.abs(offset) === 2
                                                    ? 0.35
                                                    : 1
                                                : 0,
                                            zIndex: 10 - Math.abs(offset),
                                            pointerEvents: offset === 0 ? 'auto' : 'none',
                                        }}
                                    >
                                        {target && offset === 0 ? (
                                            <Link
                                                to={target}
                                                className="relative block h-full w-full"
                                                tabIndex={0}
                                            >
                                                {content}
                                            </Link>
                                        ) : (
                                            <div className="relative h-full w-full">{content}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {slides.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => go(-1)}
                                    aria-label={t('homePage.previousSlide')}
                                    className="absolute left-2 top-[45%] z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-store-green shadow-lg transition hover:bg-store-yellow sm:left-3"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go(1)}
                                    aria-label={t('homePage.nextSlide')}
                                    className="absolute right-2 top-[45%] z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-store-green shadow-lg transition hover:bg-store-yellow sm:right-3"
                                >
                                    <ChevronRight size={22} />
                                </button>
                                <div
                                    className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-2"
                                    role="group"
                                    aria-label={t('customerUI.bannerSlides')}
                                >
                                    {slides.map((item, index) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setActive(index)}
                                            aria-label={t('customerUI.bannerSlideNumber', {
                                                count: index + 1,
                                            })}
                                            aria-current={index === current ? 'true' : undefined}
                                            className={`h-3 w-3 cursor-pointer rounded-full border border-white/60 transition-colors ${index === current ? 'bg-store-yellow' : 'bg-white/50 hover:bg-white'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
