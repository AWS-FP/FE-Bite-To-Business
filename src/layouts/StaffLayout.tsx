import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { STAFF_WORKSPACES } from '@/constants/staffNavigation';
import { ROUTES } from '@/router/routes';
import { logout } from '@/services/admin/authService';
import { useAuthStore } from '@/store/admin/authStore';
import type { StaffRole } from '@/types/admin/staff';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceSidebar from './WorkspaceSidebar';

export default function StaffLayout({ role }: { role: StaffRole }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <StaffWorkspace role={role} />
        </QueryClientProvider>
    );
}

function StaffWorkspace({ role }: { role: StaffRole }) {
    const { t } = useTranslation('workspace');
    const { t: common } = useTranslation('admin');
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.session?.user ?? null);
    const clearSession = useAuthStore((state) => state.clearSession);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const loggingOut = useRef(false);
    const workspace = STAFF_WORKSPACES[role];
    const currentIndex = workspace.items.findIndex(
        (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`),
    );
    const pageLabel = t(workspace.items[Math.max(0, currentIndex)].label);

    useEffect(() => {
        document.title = `${pageLabel} | Bite to Business`;
    }, [pageLabel]);

    async function handleLogout() {
        if (loggingOut.current) return;
        loggingOut.current = true;
        try {
            await logout();
        } catch {
            /* Kết thúc phiên local nếu dịch vụ thu hồi phiên tạm thời không khả dụng. */
        } finally {
            clearSession();
            queryClient.clear();
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }

    return (
        <div
            className={`admin-layout grid min-h-dvh bg-surface-soft font-body text-black [&_button]:cursor-pointer [&_a]:text-inherit [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_button:focus-visible]:outline-[3px_solid_var(--color-status-active)] [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[3px_solid_var(--color-status-active)] [&_a:focus-visible]:outline-offset-4 ${isCollapsed ? 'is-collapsed grid-cols-[84px_minmax(0,1fr)]' : 'grid-cols-[272px_minmax(0,1fr)]'}`}
            data-layout="staff"
            data-role={role}
        >
            <a
                className="admin-skip-link fixed top-2 left-3 z-[60] -translate-y-[180%] border border-black bg-store-yellow px-4 py-3 focus:translate-y-0"
                href="#staff-main-content"
            >
                {common('skipToContent')}
            </a>
            <WorkspaceSidebar
                workspaceLabel={t(workspace.label)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                groups={[
                    {
                        label: t('navigationGroup'),
                        items: workspace.items.map((item) => ({
                            path: item.path,
                            label: t(item.label),
                            icon: <item.icon size={18} aria-hidden="true" />,
                        })),
                    },
                ]}
            />
            <div className="admin-workspace min-w-0">
                <WorkspaceHeader
                    user={user}
                    sectionNumber={String(Math.max(0, currentIndex) + 1).padStart(2, '0')}
                    pageLabel={pageLabel}
                    workspaceLabel={t(workspace.label)}
                    title={t(workspace.title)}
                    roleLabel={t(workspace.roleLabel)}
                    onLogout={handleLogout}
                />
                <main
                    className="admin-main-content min-w-0 p-8 focus:outline-none"
                    id="staff-main-content"
                    tabIndex={-1}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
