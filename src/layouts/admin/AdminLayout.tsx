import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/admin/authStore';
import { useRegistrationStats } from '@/hooks/admin/useRegistrations';
import { logout } from '@/services/admin/authService';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminIcon from '@/components/admin/AdminIcon';

function shouldRetryAdminRequest(failureCount: number, error: unknown) {
    if (failureCount >= 1) return false;
    if (!axios.isAxiosError(error) || !error.response) return true;
    return error.response.status >= 500;
}

// Header và sidebar thuộc layout. Các màn hình nghiệp vụ được đưa vào Outlet sau.
export default function AdminLayout() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: shouldRetryAdminRequest,
                    },
                    mutations: { retry: false },
                },
            }),
    );
    return (
        <QueryClientProvider client={queryClient}>
            <AdminWorkspace />
        </QueryClientProvider>
    );
}

function AdminWorkspace() {
    const { t } = useTranslation('admin');
    const location = useLocation();
    const navigate = useNavigate();
    const clearSession = useAuthStore((state) => state.clearSession);
    const user = useAuthStore((state) => state.session?.user ?? null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const statsQuery = useRegistrationStats();
    const queryClient = useQueryClient();
    const loggingOut = useRef(false);
    let sectionNumber = '01';
    if (location.pathname.startsWith(ROUTES.ADMIN_STAFF)) {
        sectionNumber = '02';
    }
    if (location.pathname.startsWith(ROUTES.ADMIN_SYSTEM)) {
        sectionNumber = '03';
    }

    async function handleLogout() {
        if (loggingOut.current) return;
        loggingOut.current = true;
        try {
            await logout();
        } catch {
            /* Luôn kết thúc phiên local khi dịch vụ thu hồi phiên không khả dụng. */
        } finally {
            clearSession();
            queryClient.clear();
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }

    return (
        <div
            className={`admin-layout grid min-h-dvh bg-surface-soft font-body text-black [&_button]:cursor-pointer [&_a]:text-inherit [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_label]:font-body [&_small]:font-body ${isCollapsed ? 'is-collapsed grid-cols-[84px_minmax(0,1fr)]' : 'grid-cols-[272px_minmax(0,1fr)]'}
        `}
            data-layout="admin"
        >
            <a
                className="admin-skip-link fixed top-2 left-3 z-[60] -translate-y-[180%] border border-black bg-store-yellow px-4 py-3 focus:translate-y-0"
                href="#admin-main-content"
            >
                {t('skipToContent')}
            </a>
            <AdminSidebar
                pendingCount={statsQuery.data?.pending}
                registrationsPath={ROUTES.ADMIN_REGISTRATIONS}
                staffPath={ROUTES.ADMIN_STAFF}
                systemPath={ROUTES.ADMIN_SYSTEM}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            <div className="admin-workspace min-w-0">
                <AdminHeader
                    user={user}
                    sectionNumber={sectionNumber}
                    onLogout={handleLogout}
                />
                <main
                    className="admin-main-content min-w-0 p-8 focus:outline-none"
                    id="admin-main-content"
                    tabIndex={-1}
                >
                    <Outlet />
                    <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] leading-[16.5px] text-store-muted">
                        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                        <p className="flex items-center gap-1.5">
                            <AdminIcon name="lock" />
                            {t('footer.adminOnly')}
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}
