import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/admin/authStore';
import { useRegistrationStats } from '@/hooks/admin/useRegistrations';
import { logout } from '@/services/admin/authService';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

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
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const statsQuery = useRegistrationStats();
    const queryClient = useQueryClient();
    const loggingOut = useRef(false);

    // Giữ hàm đóng menu ổn định để effect khóa cuộn của sidebar không chạy lại khi đổi ngôn ngữ.
    const closeMobileSidebar = useCallback(() => {
        setIsMobileOpen(false);
    }, []);

    useEffect(() => {
        const desktopScreen = window.matchMedia('(min-width: 901px)');
        function handleScreenChange() {
            if (desktopScreen.matches) setIsMobileOpen(false);
        }
        desktopScreen.addEventListener('change', handleScreenChange);
        return () => desktopScreen.removeEventListener('change', handleScreenChange);
    }, []);

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
            className={`admin-layout grid min-h-dvh grid-cols-[248px_minmax(0,1fr)] bg-[#f8f7f3] font-body text-black
        max-[901px]:grid-cols-[minmax(0,1fr)]
        [&_button]:cursor-pointer [&_a]:text-inherit [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0
        [&_button:focus-visible]:outline-[3px_solid_#376e55] [&_button:focus-visible]:outline-offset-4
        [&_a:focus-visible]:outline-[3px_solid_#376e55] [&_a:focus-visible]:outline-offset-4
        ${isCollapsed ? 'is-collapsed min-[901px]:grid-cols-[84px_minmax(0,1fr)]' : ''}
        ${isMobileOpen ? 'is-mobile-open' : ''}`}
            data-layout="admin"
        >
            <a
                className="admin-skip-link fixed top-2 left-3 z-[60] -translate-y-[180%] border border-black bg-[#ffe14d] px-4 py-3 focus:translate-y-0"
                href="#admin-main-content"
            >
                {t('skipToContent')}
            </a>
            {isMobileOpen && (
                <button
                    className="admin-sidebar-overlay fixed inset-0 z-30 hidden border-0 bg-[#00000066] max-[901px]:block"
                    type="button"
                    aria-label={t('sidebar.close')}
                    onClick={closeMobileSidebar}
                    tabIndex={-1}
                />
            )}

            <AdminSidebar
                pendingCount={statsQuery.data?.pending}
                registrationsPath={ROUTES.ADMIN_REGISTRATIONS}
                staffPath={ROUTES.ADMIN_STAFF}
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                onCloseMobile={closeMobileSidebar}
            />

            <div className="admin-workspace min-w-0">
                <AdminHeader
                    user={user}
                    isStaffPage={location.pathname.startsWith(ROUTES.ADMIN_STAFF)}
                    isSidebarOpen={isMobileOpen}
                    onOpenSidebar={() => setIsMobileOpen(true)}
                    onLogout={handleLogout}
                />
                <main
                    className="admin-main-content min-w-0 p-8 focus:outline-none max-[901px]:p-6 max-[600px]:px-4"
                    id="admin-main-content"
                    tabIndex={-1}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
