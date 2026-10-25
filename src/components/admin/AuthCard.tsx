import { ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AuthCardProps {
    children: ReactNode;
    className?: string;
    isLogin?: boolean;
}

export default function AuthCard({ children, className = '', isLogin = false }: AuthCardProps) {
    const { t } = useTranslation();

    return (
        <section
            className={`auth-card relative h-fit w-[540px] max-w-full rounded-[28px] border-2 border-solid border-auth-ink bg-auth-cream px-[38px] pt-[76px] pb-10 shadow-[12px_12px_0_#17133a]
      [&_h1]:m-0 [&_h1]:scroll-mt-6 [&_h1]:font-heading [&_h1]:text-[36px] [&_h1]:leading-[1.15] [&_h1]:tracking-[-1.2px] [&_h1:focus]:outline-none
      max-[600px]:px-[22px] max-[600px]:pb-[30px] max-[600px]:shadow-[8px_8px_0_#17133a]
      max-[600px]:[&_h1]:text-[30px] max-[600px]:[&_h1]:tracking-[-0.8px]
      max-[360px]:px-[18px] max-[360px]:[&_h1]:text-[27px] ${className}`}
            aria-labelledby="auth-title"
        >
            <div
                className={`auth-offer-sticker absolute left-9 flex min-h-[68px] max-w-[calc(100%-48px)] items-center gap-3 border-2 border-solid border-auth-ink bg-[#ffe14d] px-4 py-2 shadow-[4px_4px_0_#17133a] max-[600px]:left-5 max-[600px]:px-3 ${isLogin ? '-top-[18px] origin-top-left -rotate-2 scale-90' : '-top-[14px] -rotate-2'}`}
            >
                <ShoppingBasket
                    className="shrink-0"
                    size={42}
                    strokeWidth={1.6}
                    aria-hidden="true"
                />
                <span className="text-[13px] leading-[1.35] font-bold">
                    {t('auth.stickerLine1')}
                    <br />
                    {t('auth.stickerLine2')}
                </span>
            </div>
            {children}
        </section>
    );
}
