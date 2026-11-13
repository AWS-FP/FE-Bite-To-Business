import { useTranslation } from 'react-i18next';
import type { AuthUser } from '@/types/admin/auth';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import WorkspaceAccountMenu from '@/components/common/WorkspaceAccountMenu';

interface WorkspaceHeaderProps {
    user: AuthUser | null;
    sectionNumber: string;
    onLogout: () => void;
    workspaceLabel: string;
    title: string;
    roleLabel: string;
}

export default function WorkspaceHeader({
    user,
    sectionNumber,
    onLogout,
    workspaceLabel,
    title,
    roleLabel,
}: WorkspaceHeaderProps) {
    const { t } = useTranslation('admin');
    return (
        <header className="admin-header relative z-10 flex min-h-[142px] items-center justify-between gap-6 border-b-[5px] border-black bg-store-cream px-8 py-6 max-[1151px]:flex-wrap max-[1151px]:gap-[22px]">
            <div className="admin-header-heading flex min-w-0 items-center gap-5">
                <div
                    className="admin-section-stamp flex h-[76px] w-[58px] shrink-0 -rotate-5 flex-col items-center justify-center border border-black bg-store-yellow p-[7px] shadow-[3px_3px_0_var(--color-black)]"
                    aria-hidden="true"
                >
                    <span className="w-[42px] border-b border-black pb-[3px] text-center font-label text-[11px] leading-[16.5px] font-semibold tracking-[1px]">
                        BTB
                    </span>
                    <strong className="font-display text-[33px] leading-[39.6px] font-extrabold">
                        {sectionNumber}
                    </strong>
                </div>

                <div className="admin-header-titles min-w-0">
                    <p className="admin-eyebrow font-label text-[10px] leading-[15px] font-semibold tracking-[1.5px]">
                        {workspaceLabel}
                    </p>
                    <p className="admin-header-title pt-[3px] font-heading text-[34px] leading-[40.8px] tracking-[-0.8px]">
                        {title}
                    </p>
                </div>
            </div>

            <div className="admin-header-actions flex shrink-0 items-center gap-[17px] max-[1151px]:ml-auto">
                <LanguageSwitcher />

                <WorkspaceAccountMenu user={user} roleLabel={roleLabel} />

                <button
                    className="admin-logout-button flex h-[53px] items-center justify-center gap-2 border border-black bg-danger px-[13px] py-[10px] text-[12px] leading-[18px] whitespace-nowrap text-black hover:brightness-95"
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
