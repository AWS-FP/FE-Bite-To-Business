import { useLandingAudience } from '@/hooks/useLandingAudience';
import { useTranslation } from 'react-i18next';

const steps = ['01', '02', '03', '04', '05', '06'];

export default function BTBModelOverview() {
    const { audience } = useLandingAudience();
    const { t } = useTranslation('storefront');
    return (
        <>
            <section className="btb-info__section" aria-labelledby="btb-model-title">
                <div className="mx-auto max-w-[1240px] px-6">
                    <span className="btb-info-eyebrow">{t('introPages.model.eyebrow')}</span>
                    <h2 id="btb-model-title">{t('introPages.model.heading')} <em>{t('introPages.model.highlight')}</em></h2>
                    <p className="btb-info__lede">{t('introPages.model.description')} <strong>{t('introPages.model.clarification')}</strong></p>
                    <div className="btb-info__actor-grid">
                        <article><span className="btb-info__actor-mark">A</span><h3>{t('introPages.model.suppliers')}</h3><p>{t('introPages.model.suppliersText')}</p></article>
                        <article><span className="btb-info__actor-mark">B</span><h3>{t('introPages.model.platform')}</h3><p>{t('introPages.model.platformText')}</p></article>
                        <article><span className="btb-info__actor-mark">C</span><h3>{t('introPages.model.buyers')}</h3><p>{t('introPages.model.buyersText')}</p></article>
                    </div>
                    <div className="btb-info__flow">
                        {steps.map((number, index) => <article key={number}><span>{number}</span><div><h3>{t(`introPages.model.steps.${index}.title`)}</h3><p>{t(`introPages.model.steps.${index}.text`)}</p></div></article>)}
                    </div>
                </div>
            </section>
            <section className="btb-info__section btb-info__section--mint">
                <div className="mx-auto max-w-[1240px] px-6 btb-info__split">
                    <div>
                        <span className="btb-info-eyebrow">{t('introPages.model.audienceEyebrow')}</span>
                        <h2>{t(audience === 'business' ? 'introPages.model.businessTitle' : 'introPages.model.personalTitle')}</h2>
                        <p>{audience === 'business'
                            ? t('introPages.model.businessText')
                            : t('introPages.model.personalText')}</p>
                        <p className="btb-info__micro">{t('introPages.model.note')}</p>
                    </div>
                    <div className="btb-info__placeholder" role="img" aria-label={t('introPages.model.imageLabel')}>
                        <img src="/images/ui/image-placeholder.svg" alt="" /><span>{t('introPages.model.imagePlaceholder')}</span>
                    </div>
                </div>
            </section>
        </>
    );
}
