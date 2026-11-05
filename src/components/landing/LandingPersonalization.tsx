import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/admin/authStore';
import { getRoleHome } from '@/router/routes';
import { useLandingAudience } from '@/hooks/useLandingAudience';
import { useTranslation } from 'react-i18next';

export default function LandingPersonalization() {
    const { t } = useTranslation('storefront');
    const { audience, setAudience } = useLandingAudience();
    const session = useAuthStore((s) => s.session);
    const customer = session?.user.role === 'CUSTOMER';
    const options = [
        { id: 'business' as const, label: t('introPages.personal.business'), sub: t('introPages.personal.businessSub') },
        { id: 'personal' as const, label: t('introPages.personal.personal'), sub: t('introPages.personal.personalSub') },
    ];
    return (
        <section
            className="border-y-2 border-solid border-store-ink bg-store-cream py-[55px]"
            aria-labelledby="btb-personal-title"
        >
            <div className="mx-auto grid w-full max-w-[1240px] grid-cols-[1fr_1.15fr] items-center gap-[34px] px-6">
                <div className="[&_h2]:my-3.5 [&_h2]:font-subheading [&_h2]:text-[clamp(27px,3vw,39px)] [&_h2]:font-normal [&_h2]:leading-[1.25] [&_h2]:text-store-ink [&_em]:font-subheading [&_em]:text-store-coral [&_p]:text-sm [&_p]:leading-[1.7] [&_p]:text-store-green">
                    <span className="btb-info-eyebrow">{t('introPages.personal.eyebrow')}</span>
                    <h2 id="btb-personal-title">
                        {t('introPages.personal.title')} <em>{t('introPages.personal.highlight')}</em>
                    </h2>
                    <p>
                        {t('introPages.personal.description')}
                    </p>
                </div>
                <div className="min-w-0">
                    <div
                        className="grid grid-cols-2 gap-2.5"
                        role="group"
                        aria-label={t('introPages.personal.label')}
                    >
                        {options.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`cursor-pointer rounded-xl border-2 border-solid border-store-ink p-4 text-left text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] [&_span]:block [&_span]:text-sm [&_span]:font-extrabold [&_small]:mt-1.5 [&_small]:block [&_small]:text-[11px] [&_small]:leading-[1.5] ${audience === option.id ? 'bg-store-yellow' : 'bg-store-cream'}`}
                                onClick={() => setAudience(option.id)}
                                aria-pressed={audience === option.id}
                            >
                                <span>{option.label}</span>
                                <small>{option.sub}</small>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center justify-between gap-3.5 pt-[17px] [&>span]:text-xs [&>span]:leading-[1.5] [&>span]:text-store-green [&_a]:inline-flex [&_a]:shrink-0 [&_a]:items-center [&_a]:gap-[7px] [&_a]:rounded-lg [&_a]:bg-store-green [&_a]:px-3 [&_a]:py-2.5 [&_a]:text-xs [&_a]:font-bold [&_a]:text-store-cream [&_a]:no-underline [&_img]:h-[15px] [&_img]:w-[15px] [&_img]:brightness-0 [&_img]:invert">
                        <span>
                            {customer
                                ? t('introPages.personal.customer')
                                : t('introPages.personal.guest')}
                        </span>
                        <Link
                            to={
                                customer
                                    ? '/profile'
                                    : session
                                      ? getRoleHome(session.user.role)
                                      : '/register'
                            }
                        >
                            {customer
                                ? t('introPages.personal.profile')
                                : session
                                  ? t('introPages.personal.workspace')
                                  : t('introPages.personal.register')}
                            <img src="/images/ui/arrow-up-right.svg" alt="" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
