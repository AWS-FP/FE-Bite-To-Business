
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
        <>
            {/*
                TẦNG 1: UTILITY BAR
                Cuộn khỏi màn hình bình thường.
            */}
            <div className="relative z-20 bg-store-green">
                <StoreUtilityBar />
            </div>

            {/*
                TẦNG 2: MAIN HEADER
                Chỉ tầng này sử dụng sticky.
                Không dùng JS scroll nên không bị giật.
            */}
            <header
                className="
                    sticky top-0 z-50 w-full
                    border-0 outline-none ring-0
                    bg-store-green
                    font-body text-store-cream
                "
            >
                {/* Accessibility */}
                <a
                    href="#main-content"
                    className="
                        sr-only rounded bg-store-yellow
                        p-3 text-store-ink
                        focus:not-sr-only
                        focus:absolute focus:left-2 focus:top-2
                        focus:z-50
                    "
                >
                    {t('skipToContent')}
                </a>

                {/* Main Header Content */}
                <div
                    className="
                        mx-auto flex min-h-[76px]
                        max-w-[1440px]
                        items-center gap-3
                        px-5 py-2

                        max-[960px]:flex-wrap
                        max-[960px]:gap-y-3

                        max-[640px]:gap-2
                        max-[640px]:px-3
                        max-[640px]:py-2
                    "
                >
                    {/* BRAND LOGO */}
                    <Link
                        to={ROUTES.HOME}
                        aria-label={t('home')}
                        className="
                            flex w-fit shrink-0
                            items-center gap-2
                            text-white no-underline

                            max-[640px]:gap-1.5
                        "
                    >
                        <img
                            src="/images/storefront/brand-logo.png"
                            alt=""
                            width={76}
                            height={51}
                            className="
                                block h-auto w-[76px]
                                shrink-0 object-contain

                                max-[640px]:w-[48px]
                            "
                        />

                        <span
                            className="
                                brand-name flex flex-col
                                text-[17px]
                                leading-[1.1]
                                tracking-[-0.5px]

                                max-[640px]:text-[14px]
                            "
                        >
                            <span>Bite to</span>
                            <span>Business</span>
                        </span>
                    </Link>

                    {/* SEARCH BAR */}
                    <StoreSearch />

                    {/* CART, NOTIFICATIONS, ACCOUNT */}
                    <StoreAccountActions />
                </div>
            </header>

            {/*
                TẦNG 3: NAVIGATION
                Không sticky, cuộn khỏi màn hình.
            */}
            <div className="relative z-20 bg-store-green">
                <StoreNavigation />
            </div>
        </>
    );
}
