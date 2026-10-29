import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import StoreUtilityBar from '../components/layout/header/StoreUtilityBar';
import StoreSearch from '../components/layout/header/StoreSearch';
import StoreAccountActions from '../components/layout/header/StoreAccountActions';
import StoreNavigation from '../components/layout/header/StoreNavigation';

export default function Header() {
    const { t } = useTranslation('storefront');

    return (
        <header className="relative z-30 border-0 border-b-2 border-solid border-[#00b9c9] bg-store-green font-body text-store-cream">
            <a
                className="sr-only rounded bg-store-yellow p-3 text-store-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
                href="#main-content"
            >
                {t('skipToContent')}
            </a>
            <StoreUtilityBar />
            <div className="mx-auto flex min-h-[100px] max-w-[1440px] items-center gap-3 px-5 py-3 max-[960px]:flex-wrap max-[960px]:gap-y-3 max-[640px]:gap-2 max-[640px]:px-3 max-[640px]:py-2.5">
                <Link
                    className="flex w-fit shrink-0 items-center gap-2 text-white no-underline max-[640px]:gap-1.5"
                    to={ROUTES.HOME}
                    aria-label={t('home')}
                >
                    <img
                        className="block h-auto w-[100px] shrink-0 object-contain max-[640px]:w-[52px]"
                        src="/images/storefront/brand-logo.png"
                        alt=""
                        width={100}
                        height={67}
                    />
                    <span className="brand-name flex flex-col text-[20px] leading-[1.1] tracking-[-0.5px] max-[640px]:text-[16px]">
                        <span>Bite to</span>
                        <span>Business</span>
                    </span>
                </Link>
                <StoreSearch />
                <StoreAccountActions />
            </div>
            <StoreNavigation />
        </header>
    );
}
