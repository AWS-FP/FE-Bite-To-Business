import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';
import type { ReactNode } from 'react';
type Props = { t: (key: string) => string; totalItemsCount: number };
export default function GuestHeaderActions({ t, totalItemsCount }: Props): ReactNode {
    return (
        <>
            <Link
                className="relative flex min-h-[52px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-4 text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-white"
                to={ROUTES.QUOTES}
                aria-label={`${t('header.quote')} (${totalItemsCount})`}
            >
                <span className="relative inline-flex">
                    <img className="block shrink-0" src="/images/storefront/cart.svg" alt="" />
                    {totalItemsCount > 0 && (
                        <span className="absolute -right-2 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-solid border-store-green bg-danger px-0.5 text-[9px] font-black leading-none text-white">
                            {totalItemsCount > 9 ? '9+' : totalItemsCount}
                        </span>
                    )}
                </span>
            </Link>

            <div className="flex shrink-0 items-center gap-1.5">
                <Link
                    className="store-sign-up flex min-h-[44px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-status-active px-8 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-surface-green"
                    to={ROUTES.REGISTER}
                >
                    {t('header.register')}
                </Link>
                <Link
                    className="store-sign-in flex min-h-[44px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-8 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-white"
                    to={ROUTES.LOGIN}
                >
                    {t('header.login')}
                </Link>
            </div>
        </>
    );
}
