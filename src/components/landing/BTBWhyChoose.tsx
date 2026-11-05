import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { useLandingAudience } from '@/hooks/useLandingAudience';
import { useTranslation } from 'react-i18next';

const advantages = ['01', '02', '03', '04', '05', '06'];

export default function BTBWhyChoose() {
    const { audience } = useLandingAudience();
    const { t } = useTranslation('storefront');
    return (
        <>
            <section className="btb-info__section" aria-labelledby="btb-why-title">
                <div className="mx-auto max-w-[1240px] px-6">
                    <span className="btb-info-eyebrow">{t('introPages.why.eyebrow')}</span>
                    <h2 id="btb-why-title">{t('introPages.why.heading')} <em>{t('introPages.why.highlight')}</em></h2>
                    <p className="btb-info__lede">{t('introPages.why.description')}</p>
                    <div className="btb-info__benefits">
                        {advantages.map((number, index) => (
                            <article key={number} className="btb-info__benefit">
                                <span className="btb-info__benefit-number">{number}</span>
                                <h3>{t(`introPages.why.benefits.${index}.title`)}</h3><p>{t(`introPages.why.benefits.${index}.description`)}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            <section className="btb-info__section btb-info__section--mint">
                <div className="mx-auto max-w-[1240px] px-6 btb-info__split">
                    <div>
                        <span className="btb-info-eyebrow">{t('introPages.why.audienceEyebrow')}</span>
                        <h2>{t(audience === 'business' ? 'introPages.why.businessTitle' : 'introPages.why.personalTitle')}</h2>
                        <p>{audience === 'business'
                            ? t('introPages.why.businessDescription')
                            : t('introPages.why.personalDescription')}</p>
                        <Link className="btb-info__text-link" to={ROUTES.BTB_MODEL}>{t('introPages.why.viewModel')} <img src="/images/ui/arrow-right.svg" alt="" /></Link>
                    </div>
                    <div className="btb-info__placeholder" role="img" aria-label={t('introPages.why.imageLabel')}>
                        <img src="/images/ui/image-placeholder.svg" alt="" /><span>{t('introPages.why.imagePlaceholder')}</span>
                    </div>
                </div>
            </section>
            <section className="btb-info__section btb-info__notice">
                <div className="mx-auto max-w-[1240px] px-6"><strong>{t('introPages.why.noticeTitle')}</strong> {t('introPages.why.notice')}</div>
            </section>
        </>
    );
}
