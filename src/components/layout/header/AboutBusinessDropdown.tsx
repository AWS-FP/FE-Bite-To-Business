import { ArrowUpRight, ChevronDown, Info, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';

/**
 * Link từ khu mua hàng về Landing Page của Bite to Business.
 * Dùng chung trên mọi trang có Header; hỗ trợ click, Escape và click bên ngoài.
 */
export default function AboutBusinessDropdown() {
    const { t } = useTranslation('storefront');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: globalThis.PointerEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    return (
        <div ref={wrapperRef} className="relative shrink-0">
            <button
                ref={triggerRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className={`inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-3 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-yellow ${
                    isOpen
                        ? 'border-store-yellow bg-store-yellow text-store-ink'
                        : 'border-store-cream/20 bg-white/5 text-store-cream hover:border-store-yellow/60 hover:text-store-yellow'
                }`}
            >
                <Info size={14} aria-hidden="true" />
                <span>{t('header.aboutBusiness')}</span>
                <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    role="menu"
                    aria-label={t('header.aboutBusiness')}
                    className="absolute right-0 top-[calc(100%+9px)] z-[80] w-[230px] overflow-hidden rounded-2xl border border-solid border-[#D9E6DC] bg-[#FFFDF8] p-1.5 text-[#123B2E] shadow-[0_16px_32px_rgba(9,32,23,0.22)]"
                >
                    <Link
                        role="menuitem"
                        to={ROUTES.LANDING}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-[12px] font-bold text-[#123B2E] no-underline transition-colors hover:bg-[#EBF4EC] focus-visible:bg-[#EBF4EC] focus-visible:outline-none"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Info size={16} aria-hidden="true" />
                            {t('header.landingPage')}
                        </span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                    <div className="mx-2 border-t border-solid border-[#E5EBE5]" />
                    <Link
                        role="menuitem"
                        to={ROUTES.HOME}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-3 text-[12px] font-semibold text-[#123B2E] no-underline transition-colors hover:bg-[#EBF4EC] focus-visible:bg-[#EBF4EC] focus-visible:outline-none"
                    >
                        <ShoppingBag size={16} aria-hidden="true" />
                        {t('header.shopHomepage')}
                    </Link>
                </div>
            )}
        </div>
    );
}
