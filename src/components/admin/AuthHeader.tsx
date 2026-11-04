import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import LanguageSwitcher from '../LanguageSwitcher';

// Header dùng chung cho các trang trong feature auth.
export default function AuthHeader() {
    const { t } = useTranslation();

    return (
        <header className="auth-header relative z-[2] border-0 border-b border-solid border-white/13">
            <div className="auth-header-inner mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-5 px-10 py-1">
                <Link
                    className="auth-brand inline-flex items-center gap-2 font-brand text-[20px] font-normal tracking-[-0.5px] text-white no-underline"
                    to={ROUTES.HOME}
                    aria-label={t('auth.home')}
                >
                    <img
                        className="auth-brand-logo block h-10 w-[60px] shrink-0 object-contain"
                        src="/logo.svg"
                        alt=""
                        width={60}
                        height={40}
                    />
                    <span className="brand-name">Bite to Business</span>
                </Link>

                <nav
                    className="auth-header-actions flex items-center gap-3"
                    aria-label={t('auth.navigation')}
                >
                    <LanguageSwitcher />
                </nav>
            </div>
        </header>
    );
}
