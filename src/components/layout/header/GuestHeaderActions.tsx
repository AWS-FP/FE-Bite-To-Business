import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';
import type { ReactNode } from 'react';
type Props = { t: (key: string) => string; setDemoLoggedIn: (next: boolean) => void };
export default function GuestHeaderActions({ t, setDemoLoggedIn }: Props): ReactNode {
    return (
        <>
            <Link
                className="flex min-h-[42px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-2.5 text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-white max-[640px]:min-h-[44px] max-[640px]:px-2"
                to={ROUTES.QUOTES}
                aria-label={t('header.quote')}
            >
                <img className="block shrink-0" src="/images/storefront/cart.svg" alt="" />
            </Link>

            <div className="flex shrink-0 items-center gap-1.5">
                <Link
                    className="store-sign-up flex min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-[#7EBC89] px-3 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-[#91c99b]"
                    to={ROUTES.REGISTER}
                >
                    {t('header.register')}
                </Link>
                <Link
                    className="store-sign-in flex min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-3 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-white"
                    to={ROUTES.LOGIN}
                >
                    {t('header.login')}
                </Link>
                {import.meta.env.DEV && (
                    <button
                        type="button"
                        onClick={() => setDemoLoggedIn(true)}
                        className="cursor-pointer rounded-full border border-dashed border-store-yellow bg-store-dark/80 px-2.5 py-1.5 text-[10px] font-bold text-store-yellow hover:bg-store-yellow hover:text-store-ink"
                    >
                        Preview account
                    </button>
                )}
            </div>
        </>
    );
}
