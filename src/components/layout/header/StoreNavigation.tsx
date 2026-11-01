import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';
import CategoryMegaMenu from '../../CategoryMegaMenu';

export default function StoreNavigation() {
    const { t } = useTranslation('storefront');

    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    const [menuTop, setMenuTop] = useState(0);

    const navRef = useRef<HTMLElement>(null);
    const categoryButtonRef = useRef<HTMLButtonElement>(null);

    // Mở/đóng Mega Menu ngay trên trang hiện tại
    function toggleCategoryMenu() {
        const bottom = navRef.current?.getBoundingClientRect().bottom ?? 0;

        setMenuTop(bottom);
        setIsCategoryMenuOpen((current) => !current);
    }

    // Đóng menu và trả focus về nút mở
    const closeCategoryMenu = useCallback(() => {
        setIsCategoryMenuOpen(false);
        categoryButtonRef.current?.focus();
    }, []);

    // Cập nhật vị trí Mega Menu khi resize hoặc scroll
    useEffect(() => {
        if (!isCategoryMenuOpen) return;

        function updatePosition() {
            const bottom = navRef.current?.getBoundingClientRect().bottom ?? 0;

            setMenuTop(bottom);
        }

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isCategoryMenuOpen]);

    return (
        <>
            <nav
                ref={navRef}
                className="border-0 border-t border-solid border-store-cream/10 bg-store-dark/75"
                aria-label={t('header.navigation')}
            >
                <div className="mx-auto flex min-h-[48px] max-w-[1440px] items-center gap-4 px-5 py-1.5 max-[640px]:gap-3 max-[640px]:px-3">
                    {/* Nút mở danh mục */}
                    <button
                        ref={categoryButtonRef}
                        type="button"
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border-2 border-solid border-store-ink bg-store-yellow px-3 py-1.5 text-[12px] font-extrabold text-store-ink shadow-[2px_2px_0_#14132b] hover:bg-[#ffe96d] max-[640px]:px-2.5 max-[640px]:text-[11px]"
                        aria-haspopup="dialog"
                        aria-expanded={isCategoryMenuOpen}
                        aria-controls={isCategoryMenuOpen ? 'btb-category-mega-menu' : undefined}
                        onClick={toggleCategoryMenu}
                    >
                        <img
                            className="block shrink-0"
                            src="/images/storefront/menu.svg"
                            width={16}
                            height={16}
                            alt=""
                        />

                        {t('header.categories')}
                    </button>

                    {/* Các liên kết Header giữ nguyên */}
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

                    {/* Thông điệp VAT */}
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

            {/* Mega Menu hiển thị trên trang hiện tại */}
            <CategoryMegaMenu open={isCategoryMenuOpen} top={menuTop} onClose={closeCategoryMenu} />
        </>
    );
}

// Header mua sắm dùng chung; page nào cần thì import trực tiếp.
