/* Generated from the supplied HTML layout. Edit this section independently. */
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import LanguageSwitcher from './LanguageSwitcher';

export default function LandingHeader() {
    const { t } = useTranslation('storefront');

    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <Link
                    to={ROUTES.HOME}
                    className="flex w-fit shrink-0 items-center gap-2 text-store-ink no-underline"
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

                <ul className="nav-links">
                    <li>
                        <Link to={ROUTES.LANDING}>Trang giới thiệu</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.WHY_BTB}>Vì sao chọn BTB?</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.BTB_MODEL}>Mô hình BTB</Link>
                    </li>
                </ul>
                <div className="nav-right shrink-0">
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
