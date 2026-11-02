import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WorkspaceSidebar from '../WorkspaceSidebar';

interface AdminSidebarProps {
    registrationsPath: string;
    staffPath: string;
    systemPath: string;
    pendingCount?: number;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function AdminSidebar({
    registrationsPath,
    staffPath,
    systemPath,
    pendingCount,
    isCollapsed,
    onToggleCollapse,
}: AdminSidebarProps) {
    const { t } = useTranslation('admin');

    return (
        <WorkspaceSidebar
            workspaceLabel={t('workspace')}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
            groups={[
                {
                    label: t('sidebar.accountManagement'),
                    items: [
                        {
                            path: registrationsPath,
                            label: t('navigation.registrations'),
                            icon: (
                                <img
                                    src="/images/admin/customers.svg"
                                    alt=""
                                    width={18}
                                    height={18}
                                />
                            ),
                            count: pendingCount,
                            ariaLabel:
                                pendingCount !== undefined
                                    ? t('sidebar.pendingRegistrations', { count: pendingCount })
                                    : t('navigation.registrations'),
                        },
                        {
                            path: staffPath,
                            label: t('navigation.staff'),
                            icon: (
                                <img src="/images/admin/staff.svg" alt="" width={18} height={18} />
                            ),
                        },
                    ],
                },
                {
                    label: t('sidebar.systemManagement'),
                    items: [
                        {
                            path: systemPath,
                            label: t('navigation.system'),
                            icon: <Activity size={18} aria-hidden="true" />,
                        },
                    ],
                },
            ]}
        />
    );
}
