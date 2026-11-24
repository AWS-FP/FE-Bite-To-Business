import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';
import ProductRequestSection from '@/components/customer/home/ProductRequestSection';
import AboutBusinessDropdown from './AboutBusinessDropdown';

export default function StoreNavigation() {
    const { t } = useTranslation('storefront');
    const { pathname } = useLocation();
    const [requestOpen, setRequestOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const current = requestOpen
        ? 'request'
        : aboutOpen
          ? 'about'
          : pathname === '/collections/deals'
            ? 'deals'
            : pathname === '/collections/combos'
              ? 'combos'
              : pathname === ROUTES.BRANDS ||
                  pathname.startsWith('/brands/') ||
                  pathname.startsWith('/brand/')
                ? 'brands'
                : [
                        ROUTES.LANDING,
                        ROUTES.WHY_BTB,
                        ROUTES.BTB_MODEL,
                    ].some((route) => route === pathname)
                  ? 'about'
                  : 'categories';
    const linkStyle = (active: boolean) =>
        `inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold no-underline transition-colors ${active ? 'bg-store-yellow text-store-ink' : 'text-store-cream hover:bg-white/10 hover:text-store-yellow'}`;
    return (
        <nav
            className="border-0 border-t border-solid border-store-cream/10 bg-store-dark/75"
            aria-label={t('header.navigation')}
        >
            <div className="mx-auto flex min-h-[42px] max-w-[1440px] items-center justify-center gap-4 px-5 py-1">
                <Link
                    to={ROUTES.CATALOG}
                    className={`${linkStyle(current === 'categories')} text-[12px]`}
                    aria-current={current === 'categories' ? 'page' : undefined}
                >
                    <img
                        src="/images/storefront/menu.svg"
                        width={16}
                        height={16}
                        alt=""
                        className={current === 'categories' ? '' : 'brightness-0 invert'}
                    />
                    {t('header.categories')}
                </Link>
                <div className="flex shrink-0 items-center gap-4 py-1.5 text-[12px] leading-[1.5] whitespace-nowrap">
                    <Link
                        className={linkStyle(current === 'deals')}
                        to="/collections/deals"
                        aria-current={current === 'deals' ? 'page' : undefined}
                    >
                        {t('header.deals')}
                    </Link>
                    <Link
                        className={linkStyle(current === 'brands')}
                        to={ROUTES.BRANDS}
                        aria-current={current === 'brands' ? 'page' : undefined}
                    >
                        {t('brandPage.brands')}
                    </Link>
                    <Link
                        className={linkStyle(current === 'combos')}
                        to="/collections/combos"
                        aria-current={current === 'combos' ? 'page' : undefined}
                    >
                        {t('header.combos')}
                    </Link>
                    <ProductRequestSection onOpenChange={setRequestOpen} />
                </div>
                <AboutBusinessDropdown active={current === 'about'} onOpenChange={setAboutOpen} />
            </div>
        </nav>
    );
}
