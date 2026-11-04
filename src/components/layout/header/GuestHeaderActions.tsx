import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';
import type { ReactNode } from 'react';
type Props = { t: (key: string) => string };
export default function GuestHeaderActions({ t }: Props): ReactNode {
    return (
        <>
            <Link
                className="flex min-h-[42px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-2.5 text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-white"
                to={ROUTES.QUOTES}
                aria-label={t('header.quote')}
            >
                <img className="block shrink-0" src="/images/storefront/cart.svg" alt="" />
            </Link>

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
        </>
    );
}
