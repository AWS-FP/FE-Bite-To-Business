import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AuthUser } from '@/types/admin/auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AdminHeaderProps {
    user: AuthUser | null;
    sectionNumber: string;
    pageLabel: string;
    isSidebarOpen: boolean;
    onOpenSidebar: () => void;
    onLogout: () => void;
}

export default function AdminHeader({
    user,
    sectionNumber,
    pageLabel,
    isSidebarOpen,
    onOpenSidebar,
    onLogout,
}: AdminHeaderProps) {
    const { t } = useTranslation('admin');
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);
    const accountButtonRef = useRef<HTMLButtonElement>(null);

    // Hiển thị tên và chữ viết tắt từ thông tin user đã đăng nhập.
    let displayName = '';
    let initials = '';
    if (user) {
        displayName = `${user.lastName} ${user.firstName}`.trim();
        if (!displayName) displayName = user.email;

        initials = `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`.toUpperCase();
        if (!initials) initials = user.email.charAt(0).toUpperCase();
    }

    useEffect(() => {
        if (!isAccountOpen) return;

        function handleOutsideClick(event: PointerEvent) {
            if (event.target instanceof Node && !accountRef.current?.contains(event.target)) {
                setIsAccountOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsAccountOpen(false);
                accountButtonRef.current?.focus();
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isAccountOpen]);

    return (
        <header className="admin-header relative z-10 flex min-h-[142px] items-center justify-between gap-6 border-b-[5px] border-black bg-[#fff8e8] px-8 py-6 max-[1151px]:flex-wrap max-[1151px]:gap-[22px] max-[600px]:px-4 max-[600px]:py-[22px]">
            <div className="admin-header-heading flex min-w-0 items-center gap-5 max-[600px]:w-full max-[600px]:gap-3">
                <button
                    className="admin-mobile-menu-button hidden size-9 shrink-0 place-items-center border border-black bg-white p-0 text-black max-[901px]:grid"
                    type="button"
                    aria-label={t('sidebar.open')}
                    aria-controls="admin-sidebar"
                    aria-expanded={isSidebarOpen}
                    onClick={onOpenSidebar}
                >
                    <Menu size={21} aria-hidden="true" />
                </button>

                <div
                    className="admin-section-stamp flex h-[76px] w-[58px] shrink-0 -rotate-5 flex-col items-center justify-center border border-black bg-[#ffe14d] p-[7px] shadow-[3px_3px_0_#000] max-[600px]:h-16 max-[600px]:w-[46px] max-[600px]:p-[6px]"
                    aria-hidden="true"
                >
                    <span className="w-[42px] border-b border-black pb-[3px] text-center font-label text-[11px] leading-[16.5px] font-semibold tracking-[1px] max-[600px]:w-8 max-[600px]:text-[9px] max-[600px]:leading-[14px]">
                        BTB
                    </span>
                    <strong className="font-display text-[33px] leading-[39.6px] font-extrabold max-[600px]:text-[28px] max-[600px]:leading-8">
                        {sectionNumber}
                    </strong>
                </div>

                <div className="admin-header-titles min-w-0">
                    <p className="admin-eyebrow font-label text-[10px] leading-[15px] font-semibold tracking-[1.5px] max-[600px]:text-[9px] max-[600px]:tracking-[1px]">
                        {t('workspace')}
                    </p>
                    <p className="admin-header-title pt-[3px] font-heading text-[34px] leading-[40.8px] tracking-[-0.8px] max-[600px]:text-[27px] max-[600px]:leading-[1.3]">
                        {t('header.title')}
                    </p>
                    <nav
                        className="admin-breadcrumb flex items-center gap-[7px] pt-2 font-subtext text-[11px] leading-[16.5px] font-medium max-[600px]:gap-[5px] max-[600px]:text-[9px] max-[600px]:leading-[1.5]"
                        aria-label={t('header.breadcrumb')}
                    >
                        <span>Admin</span>
                        <img
                            className="block shrink-0"
                            src="/images/admin/chevron-right.svg"
                            alt=""
                            width={11}
                            height={11}
                        />
                        <span aria-current="page">{pageLabel}</span>
                    </nav>
                </div>
            </div>

            <div className="admin-header-actions flex shrink-0 items-center gap-[17px] max-[1151px]:ml-auto max-[600px]:w-full max-[600px]:justify-end max-[600px]:gap-3 max-[360px]:gap-[10px]">
                <LanguageSwitcher />

                {user && (
                    <div className="admin-account relative" ref={accountRef}>
                        <button
                            className="admin-account-button group/account flex min-h-[51px] items-center gap-[9px] rounded-[2px] border border-black bg-white p-[7px] text-left text-black"
                            ref={accountButtonRef}
                            type="button"
                            aria-label={t('header.accountMenu', { name: displayName })}
                            aria-expanded={isAccountOpen}
                            aria-controls="admin-account-details"
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                        >
                            <span
                                className="admin-avatar grid size-[35px] shrink-0 place-items-center rounded-full border border-black bg-[#d9eea3] text-[11px] leading-[16.5px] font-bold"
                                aria-hidden="true"
                            >
                                {initials}
                            </span>
                            <span className="admin-account-label flex flex-col gap-[2px] max-[600px]:hidden">
                                <strong className="max-w-40 overflow-hidden text-[13px] leading-[19.5px] font-bold text-ellipsis whitespace-nowrap">
                                    {displayName}
                                </strong>
                                <span className="font-subtext text-[10px] leading-[15px] font-medium whitespace-nowrap">
                                    {t('header.role')}
                                </span>
                            </span>
                            <img
                                className="block shrink-0 admin-account-chevron ml-[3px] group-aria-expanded/account:rotate-180 max-[600px]:hidden"
                                src="/images/admin/chevron-down.svg"
                                alt=""
                                width={14}
                                height={19}
                            />
                        </button>

                        {isAccountOpen && (
                            <div
                                className="admin-account-popover absolute top-[calc(100%+12px)] right-0 w-[270px] border border-black bg-white p-4 text-[13px] leading-[1.6] wrap-anywhere shadow-[4px_4px_0_#000] max-[600px]:-right-[72px] max-[600px]:w-[260px]"
                                id="admin-account-details"
                            >
                                <div className="admin-account-popover-heading mb-[10px] flex items-center justify-between gap-2 border-b border-[#e0ddd4] pb-[10px]">
                                    <strong className="font-subheading">
                                        {t('header.accountDetails')}
                                    </strong>
                                    <button
                                        className="admin-icon-button grid place-items-center border-0 bg-transparent p-[3px] text-black hover:bg-[#0000000d]"
                                        type="button"
                                        aria-label={t('header.closeAccount')}
                                        onClick={() => {
                                            setIsAccountOpen(false);
                                            accountButtonRef.current?.focus();
                                        }}
                                    >
                                        <X size={16} aria-hidden="true" />
                                    </button>
                                </div>
                                <p>{displayName}</p>
                                <p className="admin-account-email font-subtext text-[12px] text-[#655f53] wrap-anywhere">
                                    {user.email}
                                </p>
                                <span className="admin-account-role mt-3 inline-block border border-black bg-[#d9eea3] px-2 py-[3px] font-label text-[11px]">
                                    {t('header.role')}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <button
                    className="admin-logout-button flex min-h-[45px] items-center justify-center gap-2 border border-black bg-[#ffb4ba] px-[13px] py-[10px] text-[12px] leading-[18px] whitespace-nowrap text-black shadow-[3px_3px_0_#000] hover:bg-[#ff9da6] active:translate-[2px] active:shadow-[1px_1px_0_#000] max-[360px]:px-[10px] max-[360px]:text-[11px]"
                    type="button"
                    onClick={onLogout}
                >
                    <img
                        className="block shrink-0"
                        src="/images/admin/logout.svg"
                        alt=""
                        width={17}
                        height={17}
                    />
                    <span>{t('header.logout')}</span>
                </button>
            </div>
        </header>
    );
}
