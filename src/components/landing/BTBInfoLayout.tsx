import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import LandingHeader from '@/components/landing/LandingHeader';
import Footer from '@/layouts/Footer';
import { ROUTES } from '@/router/routes';
import LandingPersonalization from '@/components/landing/LandingPersonalization';
import '@/components/landing/landing.css';
import '@/components/landing/landingInfo.css';

type Props = { title: string; eyebrow: string; description: string; children: ReactNode };
export default function BTBInfoLayout({ title, eyebrow, description, children }: Props) {
    const { t } = useTranslation('storefront');
    return (
        <div className="flex min-h-dvh flex-col bg-store-cream">
            <div className="btb-landing flex-1">
                <LandingHeader />
                <main id="main-content" className="btb-info">
                    <section className="btb-info__hero">
                        <div className="mx-auto max-w-[1240px] px-6">
                            <span className="btb-info-eyebrow">{eyebrow}</span>
                            <h1>{title}</h1>
                            <p>{description}</p>
                            <div className="btb-info__hero-actions">
                                <Link className="btb-info__action" to={ROUTES.REGISTER}>
                                    {t('introPages.start')}
                                </Link>
                                <Link
                                    className="btb-info__action btb-info__action--outline"
                                    to={ROUTES.LANDING}
                                >
                                    {t('introPages.explore')}
                                </Link>
                            </div>
                            <div className="btb-info__visual" aria-hidden="true">
                                <span>BTB</span>
                                <span>{t('introPages.visualBusiness')}</span>
                                <span>{t('introPages.visualPersonal')}</span>
                            </div>
                        </div>
                    </section>
                    {children}
                    <LandingPersonalization />
                    <section className="btb-info__bottom">
                        <div className="mx-auto max-w-[1240px] px-6 btb-info__bottom-inner">
                            <div>
                                <span className="btb-info-eyebrow">{t('introPages.discover')}</span>
                                <h2>{t('introPages.discoverTitle')}</h2>
                            </div>
                            <div className="btb-info__bottom-links">
                                <Link to={ROUTES.WHY_BTB}>{t('header.whyBtbPage')}</Link>
                                <Link to={ROUTES.BTB_MODEL}>{t('header.b2bModelPage')}</Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
}
