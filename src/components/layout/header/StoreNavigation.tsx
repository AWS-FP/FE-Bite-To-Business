import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';

export default function StoreNavigation() {
    const { t } = useTranslation('storefront');

    return (
        <nav
            className="border-0 border-t border-solid border-store-cream/10 bg-store-dark/75"
            aria-label={t('header.navigation')}
        >
            <div className="mx-auto flex min-h-[48px] max-w-[1440px] items-center gap-4 px-5 py-1.5 max-[640px]:gap-3 max-[640px]:px-3">
                <Link
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-solid border-store-ink bg-store-yellow px-3 py-1.5 text-[12px] font-extrabold text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-[#ffe96d] max-[640px]:px-2.5 max-[640px]:text-[11px]"
                    to={ROUTES.CATALOG}
                >
                    <img className="block shrink-0" src="/images/storefront/menu.svg" alt="" />
                    {t('header.categories')}
                </Link>
                <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto py-1.5 text-[12px] leading-[1.5] whitespace-nowrap [scrollbar-width:thin]">
                    <Link
                        className="text-store-cream no-underline hover:text-store-yellow"
                        to={`${ROUTES.CATALOG}?sale=true`}
                    >
                        {t('header.deals')}
                    </Link>
                    <Link
                        className="text-store-cream no-underline hover:text-store-yellow"
                        to={ROUTES.CATALOG}
                    >
                        {t('header.standardFood')}
                    </Link>
                    <Link
                        className="text-store-cream no-underline hover:text-store-yellow"
                        to={`${ROUTES.CATALOG}?type=combo`}
                    >
                        {t('header.combos')}
                    </Link>
                </div>
                <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#f490b1] min-[1440px]:flex">
                    {t('header.invoice')}
                    <img
                        className="block shrink-0"
                        src="/images/storefront/arrow-right.svg"
                        alt=""
                    />
                </span>
            </div>
        </nav>
    );
}
