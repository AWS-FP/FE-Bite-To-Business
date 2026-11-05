/* Generated from the supplied HTML layout. Edit this section independently. */
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import LanguageSwitcher from '../common/LanguageSwitcher';

export default function LandingHeader() {
    const { t } = useTranslation('storefront');

    return (
        <header className="fixed inset-x-0 top-0 z-[1000] h-[104px] border-b-[3px] border-solid border-store-ink bg-store-green py-3.5">
            <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between gap-6 px-6">
                <Link
                    to={ROUTES.HOME}
                    className="flex w-fit shrink-0 items-center gap-2 text-store-cream no-underline"
                    aria-label={t('home')}
                >
                    <img
                        src="/images/storefront/brand-logo.png"
                        alt=""
                        className="block h-auto w-[100px] shrink-0 object-contain"
                        width={100}
                        height={67}
                    />

                    <span className="brand-name flex flex-col text-[20px] leading-[1.1] tracking-[-0.5px]">
                        <span>Bite to</span>
                        <span>Business</span>
                    </span>
                </Link>

                <nav aria-label={t('header.introductionNavigation')}>
                    <ul className="flex list-none items-center gap-7 text-sm font-bold [&_a]:text-store-cream [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-store-yellow">
                        <li>
                            <Link to={ROUTES.LANDING}>{t('header.landingPage')}</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.WHY_BTB}>{t('header.whyBtbPage')}</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.BTB_MODEL}>{t('header.b2bModelPage')}</Link>
                        </li>
                    </ul>
                </nav>
                <div className="flex shrink-0 items-center gap-3">
                    <LanguageSwitcher />
                    <div className="flex shrink-0 items-center gap-1.5">
                        <Link
                            className="store-sign-up flex min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-status-active px-3 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-surface-green"
                            to={ROUTES.REGISTER}
                        >
                            {t('header.register')}
                        </Link>
                        <Link
                            className="store-sign-in flex min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-3 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-white"
                            to={ROUTES.LOGIN}
                        >
                            {t('header.login')}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
