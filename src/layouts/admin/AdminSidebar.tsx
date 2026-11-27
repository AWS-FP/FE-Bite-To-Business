import { Activity, Banknote, FileBarChart2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WorkspaceSidebar from '../WorkspaceSidebar';

interface AdminSidebarProps {
    registrationsPath: string;
    staffPath: string;
    returnsPath: string;
    paymentReviewsPath: string;
    openPaymentReviews?: number;
    systemPath: string;
    revenuePath: string;
    pendingCount?: number;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function AdminSidebar({
    registrationsPath,
    staffPath,
    returnsPath,
    paymentReviewsPath,
    openPaymentReviews,
    systemPath,
    revenuePath,
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
                        {
                            path: returnsPath,
                            label: t('navigation.returns'),
                            icon: <RotateCcw size={18} aria-hidden="true" />,
                        },
                        {
                            path: paymentReviewsPath,
                            label: t('navigation.paymentReviews'),
                            icon: <Banknote size={18} aria-hidden="true" />,
                            count: openPaymentReviews || undefined,
                            ariaLabel: openPaymentReviews
                                ? t('sidebar.openPaymentReviews', { count: openPaymentReviews })
                                : t('navigation.paymentReviews'),
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
                        {
                            path: revenuePath,
                            label: t('system.tabs.revenue'),
                            icon: <FileBarChart2 size={18} aria-hidden="true" />,
                        },
                    ],
                },
            ]}
        />
    );
}
