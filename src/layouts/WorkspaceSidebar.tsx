import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

interface NavigationItem {
    path: string;
    label: string;
    icon: ReactNode;
    count?: number;
    ariaLabel?: string;
}

interface WorkspaceSidebarProps {
    workspaceLabel: string;
    groups: { label: string; items: NavigationItem[] }[];
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function WorkspaceSidebar({
    workspaceLabel,
    groups,
    isCollapsed,
    onToggleCollapse,
}: WorkspaceSidebarProps) {
    const { t } = useTranslation('admin');

    return (
        <aside
            className="admin-sidebar sticky top-0 flex h-dvh min-h-[450px] flex-col overflow-y-auto border-r-2 border-black bg-store-cream px-4 pt-[25px] pb-4 [scrollbar-width:thin]"
            id="workspace-sidebar"
            aria-label={workspaceLabel}
        >
            <Link
                className="admin-brand flex min-h-[98px] items-center gap-2 px-1 py-3 no-underline [.is-collapsed_&]:justify-center [.is-collapsed_&]:px-0"
                to={ROUTES.HOME}
                aria-label={t('common:home')}
            >
                <img
                    className="block shrink-0 object-contain [.is-collapsed_&]:h-[38px] [.is-collapsed_&]:w-[48px]"
                    src="/images/admin/brand-logo.png"
                    alt=""
                    width={88}
                    height={68}
                />
                <span className="admin-brand-name brand-name flex flex-col text-[24px] leading-[28.8px] tracking-[-0.3px] [.is-collapsed_&]:hidden">
                    <span>Bite to</span>
                    <span>Business</span>
                </span>
            </Link>
            <p className="admin-sidebar-workspace flex min-h-[35px] items-center gap-[7px] px-[5px] pt-5 text-[10px] leading-[15px] font-bold tracking-[1px] [.is-collapsed_&]:justify-center [.is-collapsed_&]:px-0">
                <span className="size-[6px] shrink-0 rounded-full bg-black" aria-hidden="true" />
                <span className="admin-sidebar-text [.is-collapsed_&]:hidden">
                    {workspaceLabel}
                </span>
            </p>
            <div className="admin-sidebar-divider my-[22px] h-[2px] shrink-0 bg-black" />

            {groups.map((group, index) => (
                <div key={group.label} className={index > 0 ? 'pt-8' : ''}>
                    <p className="admin-sidebar-group admin-sidebar-text pb-[13px] pl-[5px] text-[10px] leading-[15px] font-bold tracking-[1px] [.is-collapsed_&]:hidden">
                        {group.label}
                    </p>
                    <nav
                        className="admin-sidebar-navigation flex flex-col gap-[7px]"
                        aria-label={group.label}
                    >
                        {group.items.map((item) => (
                            <NavLink
                                key={item.path}
                                className="admin-navigation-link relative flex min-h-[51px] items-center gap-[9px] rounded-[3px] border border-black bg-white px-[11px] py-[9px] text-[13px] leading-[18.2px] font-normal no-underline hover:bg-surface-yellow aria-[current=page]:bg-store-yellow aria-[current=page]:font-bold aria-[current=page]:shadow-[3px_3px_0_var(--color-black)] hover:aria-[current=page]:bg-store-yellow [.is-collapsed_&]:justify-center [.is-collapsed_&]:px-2"
                                to={item.path}
                                title={item.label}
                                aria-label={item.ariaLabel || item.label}
                            >
                                <span className="flex shrink-0" aria-hidden="true">
                                    {item.icon}
                                </span>
                                <span className="admin-sidebar-text min-w-0 flex-1 [.is-collapsed_&]:hidden">
                                    {item.label}
                                </span>
                                {item.count !== undefined && (
                                    <span
                                        className="admin-pending-count ml-auto shrink-0 rounded-[2px] border border-black bg-white px-[5px] py-px text-[11px] leading-[16.5px] font-bold [.is-collapsed_&]:absolute [.is-collapsed_&]:-top-[6px] [.is-collapsed_&]:-right-[6px] [.is-collapsed_&]:px-[3px] [.is-collapsed_&]:py-0 [.is-collapsed_&]:text-[9px] [.is-collapsed_&]:leading-[14px]"
                                        aria-hidden="true"
                                    >
                                        {item.count}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            ))}

            <div className="admin-sidebar-bottom mt-auto pt-12 before:mb-[15px] before:block before:border-t before:border-black before:content-['']">
                <button
                    className="admin-collapse-button admin-icon-button ml-auto grid place-items-center border-0 bg-transparent p-[3px] text-black hover:bg-black/5 [.is-collapsed_&]:mr-auto"
                    type="button"
                    title={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
                    aria-label={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
                    aria-expanded={!isCollapsed}
                    aria-controls="workspace-sidebar"
                    onClick={onToggleCollapse}
                >
                    <img
                        className="block shrink-0 [.is-collapsed_&]:rotate-180"
                        src="/images/admin/sidebar-collapse.svg"
                        alt=""
                        width={19}
                        height={19}
                    />
                </button>
            </div>
        </aside>
    );
}
