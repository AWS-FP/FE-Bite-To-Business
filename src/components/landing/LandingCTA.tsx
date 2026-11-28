import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/admin/authStore';
import { getRoleHome, ROUTES } from '@/router/routes';

export default function LandingCTA() {
    const { t } = useTranslation('storefront');
    const session = useAuthStore((state) => state.session);
    const restoring = useAuthStore((state) => state.restoring);
    const guest = !session && !restoring;
    const staff = Boolean(session && session.user.role !== 'CUSTOMER');
    const shoppingPath = session && staff ? getRoleHome(session.user.role) : ROUTES.CATALOG;
    const steps = guest ? [1, 2, 3].map((number) => ({
        title: `introPages.cta.step${number}`,
        text: `introPages.cta.step${number}Text`,
    })) : [1, 2, 3].map((number) => ({
        title: `landing.live.shoppingStep${number}`,
        text: `landing.live.shoppingStep${number}Text`,
    }));
    const primaryClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-store-yellow px-6 py-3 font-body text-sm font-bold text-store-ink no-underline transition-colors hover:bg-white';
    const secondaryClass = 'inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 py-3 font-body text-sm font-bold text-store-cream no-underline transition-colors hover:bg-white/10';

    return (
        <section id="onboarding-cta" className="mt-10 border-t border-white/15 bg-store-green py-16 text-store-cream">
            <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 lg:grid-cols-[5fr_7fr]">
                <div>
                    <span className="font-body text-xs font-semibold uppercase tracking-wider text-store-yellow">{t('introPages.cta.eyebrow')}</span>
                    <h2 className="mt-3 font-subheading text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white">
                        {t('introPages.cta.title')}{' '}
                        <span className="text-store-yellow">{t('introPages.cta.highlight')}</span>{' '}{t('introPages.cta.suffix')}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-surface-green">{t('introPages.cta.description')}</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        {guest ? (
                            <>
                                <Link to={ROUTES.REGISTER} className={primaryClass}>{t('header.register')}<img src="/icons/arrow-right.svg" alt="" className="size-4 object-contain" /></Link>
                                <Link to={ROUTES.LOGIN} className={secondaryClass}>{t('header.login')}</Link>
                            </>
                        ) : (
                            <>
                                <Link to={shoppingPath} className={primaryClass}>{t(staff ? 'introPages.personal.workspace' : 'landing.live.browseCatalog')}<img src="/icons/arrow-right.svg" alt="" className="size-4 object-contain" /></Link>
                                {session?.user.role === 'CUSTOMER' && <Link to={ROUTES.ORDERS} className={secondaryClass}>{t('landing.live.myOrders')}</Link>}
                            </>
                        )}
                    </div>
                </div>
                <div className="grid gap-4">
                    {steps.map((step, index) => (
                        <article key={step.title} className="flex items-start gap-4 rounded-2xl border border-store-line bg-store-cream p-5 text-store-ink shadow-sm">
                            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-store-green font-body text-2xl font-bold text-store-yellow">{index + 1}</span>
                            <div>
                                <h3 className="font-subheading text-lg font-bold">{t(step.title)}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-store-green">{t(step.text)}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
