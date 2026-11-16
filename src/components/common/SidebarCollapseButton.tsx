import { useTranslation } from 'react-i18next';

interface SidebarCollapseButtonProps {
    isCollapsed: boolean;
    onToggle: () => void;
    sidebarId: string;
}

export default function SidebarCollapseButton({ isCollapsed, onToggle, sidebarId }: SidebarCollapseButtonProps) {
    const { t } = useTranslation('admin');
    const label = isCollapsed ? t('sidebar.expand') : t('sidebar.collapse');

    return (
        <button
            className="admin-collapse-button grid place-items-center border-0 bg-transparent p-[3px] text-black hover:bg-black/5"
            type="button"
            title={label}
            aria-label={label}
            aria-expanded={!isCollapsed}
            aria-controls={sidebarId}
            onClick={onToggle}
        >
            <img src="/images/admin/sidebar-collapse.svg" alt="" width={19} height={19} className={isCollapsed ? 'rotate-180' : ''} />
        </button>
    );
}
