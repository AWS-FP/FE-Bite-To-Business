/* Generated from the supplied HTML layout. Edit this section independently. */
import { useTranslation } from 'react-i18next';
import LandingCarousel from './LandingCarousel';
import LandingPartners from './LandingPartners';
import { useLandingAudience } from '@/hooks/useLandingAudience';

export default function LandingHero() {
    const { t, i18n } = useTranslation('storefront');
    const { audience } = useLandingAudience();
    const language = i18n.resolvedLanguage ?? i18n.language;
    return (
        <section className="relative bg-store-green pt-12 pb-14 text-center sm:pt-16" id="top-hero">
            <div className="mx-auto max-w-[1240px] px-6">
                <div className="mb-[18px] inline-flex items-center gap-2 rounded-full border-2 border-solid border-store-ink bg-store-yellow px-4 py-1.5 text-[13px] font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]">
                    <span>{t('introPages.hero.eyebrow')}</span>
                </div>
                <h1
                    className="mx-auto mb-3.5 max-w-[900px] font-heading text-[clamp(38px,5.2vw,66px)] font-normal leading-[1.18] text-store-cream [text-shadow:3px_3px_0_var(--color-store-ink)] [&_em]:font-heading [&_em]:font-normal [&_em]:not-italic [&_em]:text-store-yellow"
                    id="heroMainTitle"
                >
                    {language === 'en' ? (
                        <>
                            Food sourcing for <em>businesses and individuals</em>
                        </>
                    ) : audience === 'business' ? (
                        <>
                            Giải pháp mua thực phẩm cho <em>doanh nghiệp và đơn vị thu mua.</em>
                        </>
                    ) : (
                        <>
                            Thực phẩm thiết yếu cho <em>cá nhân và gia đình.</em>
                        </>
                    )}
                </h1>
                <p
                    className="mx-auto mb-[18px] max-w-[660px] font-subtext text-[16.5px] text-store-cream"
                    id="heroSubText"
                >
                    {language === 'en'
                        ? 'Discover products, compare package sizes and quantity-based pricing for each item, and explore a more organized shopping experience.'
                        : audience === 'business'
                            ? 'Khám phá nguồn thực phẩm, so sánh quy cách và giá theo số lượng từng sản phẩm, tập hợp nhu cầu vào một quy trình báo giá rõ ràng.'
                            : 'Khám phá thực phẩm theo nhu cầu gia đình, xem thông tin sản phẩm và quy cách, lưu trải nghiệm để tìm lại dễ hơn khi cần.'}
                </p>
                <div className="mb-9 flex flex-wrap justify-center gap-3.5">
                    <a href="#categories" className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-coral text-white">
                        {t('introPages.hero.start')}
                        <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-store-ink text-xs text-store-yellow">
                            <img
                                src="/images/ui/arrow-right.svg"
                                className="btb-ui-icon"
                                alt=""
                                aria-hidden="true"
                            />
                        </span>
                    </a>
                    <a href="#catalog-preview" className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-cream text-store-ink hover:bg-store-yellow">
                        {t('introPages.hero.catalog')}
                    </a>
                </div>
                <LandingCarousel />
                <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-[18px] lg:grid-cols-4">
                    <div className="rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-5 sm:px-[18px] sm:py-[22px] text-center shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="mb-1.5 font-heading text-[32px] font-normal leading-[1.1] text-store-coral">
                            {t('introPages.hero.quantity')}
                        </div>
                        <div className="text-[13.5px] font-bold text-store-ink">
                            {t('introPages.hero.quantityLabel')}
                        </div>
                    </div>
                    <div className="rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-5 sm:px-[18px] sm:py-[22px] text-center shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="mb-1.5 font-heading text-[32px] font-normal leading-[1.1] text-store-coral">
                            {t('introPages.hero.categories')}
                        </div>
                        <div className="text-[13.5px] font-bold text-store-ink">
                            {t('introPages.hero.categoriesLabel')}{' '}
                            <img
                                className="btb-ui-icon"
                                src="/images/ui/arrow-up-right.svg"
                                alt=""
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                    <div className="rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-5 sm:px-[18px] sm:py-[22px] text-center shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="mb-1.5 font-heading text-[32px] font-normal leading-[1.1] text-store-coral">
                            {t('introPages.hero.clear')}
                        </div>
                        <div className="text-[13.5px] font-bold text-store-ink">
                            {t('introPages.hero.clearLabel')}
                        </div>
                    </div>
                    <div className="rounded-[var(--radius-md)] border-[2.5px] border-solid border-store-ink bg-store-cream px-3 py-5 sm:px-[18px] sm:py-[22px] text-center shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px]">
                        <div className="mb-1.5 font-heading text-[32px] font-normal leading-[1.1] text-store-coral">
                            {t('introPages.hero.groups')}
                        </div>
                        <div className="text-[13.5px] font-bold text-store-ink">
                            {t('introPages.hero.groupsLabel')}
                        </div>
                    </div>
                </div>
                <LandingPartners />
            </div>
        </section>
    );
}
