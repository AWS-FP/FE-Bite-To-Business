import { useTranslation } from 'react-i18next';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import StoreUtilityBar from '../components/layout/header/StoreUtilityBar';
import StoreSearch from '../components/layout/header/StoreSearch';
import StoreAccountActions from '../components/layout/header/StoreAccountActions';
import StoreNavigation from '../components/layout/header/StoreNavigation';

export default function Header() {
    const { t } = useTranslation('storefront');
    const headerRef = useRef<HTMLElement>(null);
    const spacerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        function updateHeaderHeight() {
            if (!headerRef.current) return;
            const height = `${headerRef.current.offsetHeight}px`;
            if (spacerRef.current) spacerRef.current.style.height = height;
            document.getElementById('main-content')?.style.setProperty('scroll-margin-top', height);
        }

        updateHeaderHeight();
        const observer = new ResizeObserver(updateHeaderHeight);
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div ref={spacerRef} className="shrink-0" aria-hidden="true" />
            <header
                ref={headerRef}
                className="fixed inset-x-0 top-0 z-30 border-0 border-b-2 border-solid border-role-logistics bg-store-green font-body text-store-cream"
            >
                <a
                    className="sr-only rounded bg-store-yellow p-3 text-store-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
                    href="#main-content"
                >
                    {t('skipToContent')}
                </a>
                <StoreUtilityBar />
                <div className="mx-auto flex min-h-[100px] max-w-[1440px] items-center gap-3 px-5 py-3">
                    <Link
                        className="flex w-fit shrink-0 items-center gap-2 text-white no-underline"
                        to={ROUTES.HOME}
                        aria-label={t('home')}
                    >
                        <img
                            className="block h-auto w-[100px] shrink-0 object-contain"
                            src="/images/storefront/brand-logo.png"
                            alt=""
                            width={100}
                            height={67}
                        />
                        <span className="brand-name flex flex-col text-[20px] leading-[1.1] tracking-[-0.5px]">
                            <span>Bite to</span>
                            <span>Business</span>
                        </span>
                    </Link>
                    <StoreSearch />
                    <StoreAccountActions />
                </div>
                <StoreNavigation />
            </header>
        </>
    );
}
