import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Boxes, LayoutDashboard, LogOut, Megaphone, Menu, MessageSquare, Package, TicketPercent } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { logout } from '@/services/admin/authService';
import { useAuthStore } from '@/store/admin/authStore';
import WorkspaceSidebar from '@/layouts/WorkspaceSidebar';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import WorkspaceAccountMenu from '@/components/common/WorkspaceAccountMenu';
import LogoutConfirmation from '@/components/common/LogoutConfirmation';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import EcommerceWorkspaceSearch from '@/components/e-commerce/EcommerceWorkspaceSearch';
import '@/components/logistic/logistics.css';
import ExecutiveConfirmationProvider from '@/components/e-commerce/ExecutiveConfirmationProvider';

function EcommerceWorkspace() {
    const tr = useExecutiveText();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.session?.user ?? null);
    const clearSession = useAuthStore((state) => state.clearSession);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const loggingOut = useRef(false);
    const navigation = [
        { path: ROUTES.ECOMMERCE_DASHBOARD, label: tr('Tổng quan', 'Overview'), icon: <LayoutDashboard size={18} /> },
        { path: ROUTES.ECOMMERCE_PRODUCTS, label: tr('Sản phẩm & giá', 'Products & pricing'), icon: <Package size={18} /> },
        { path: ROUTES.ECOMMERCE_COMBOS, label: tr('Combo sản phẩm', 'Product combos'), icon: <Boxes size={18} /> },
        { path: ROUTES.ECOMMERCE_COUPONS, label: tr('Mã giảm giá', 'Coupons'), icon: <TicketPercent size={18} /> },
        { path: ROUTES.ECOMMERCE_PROMOTIONS, label: tr('Khuyến mãi', 'Promotions'), icon: <Megaphone size={18} /> },
        { path: ROUTES.ECOMMERCE_REVIEWS, label: tr('Đánh giá khách hàng', 'Customer reviews'), icon: <MessageSquare size={18} /> },
    ];
    const current = navigation.find((item) => location.pathname === item.path) ?? navigation[0];
    useEffect(() => { document.title = `${current.label} | Bite to Business`; }, [current.label]);

    async function handleLogout() {
        if (loggingOut.current) return;
        loggingOut.current = true;
        try { await logout(); } catch { /* End the local session if the server is unavailable. */ }
        finally {
            clearSession();
            queryClient.clear();
            navigate(ROUTES.LOGIN, { replace: true });
            loggingOut.current = false;
        }
    }
    return (
        <div data-role="ECOMMERCE_EXECUTIVE" data-layout="staff" className={`lg-workspace ${collapsed ? 'is-collapsed' : ''}`}>
            <a href="#ecommerce-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[200] focus:bg-store-yellow focus:p-3">{tr('Bỏ qua menu', 'Skip navigation')}</a>
            {mobileOpen && <button type="button" className="lg-sidebar-backdrop" aria-label={tr('Đóng menu', 'Close menu')} onClick={() => setMobileOpen(false)} />}
            <WorkspaceSidebar
                sidebarId="ecommerce-sidebar"
                homePath={ROUTES.HOME}
                className={`lg-shared-sidebar ${mobileOpen ? 'lg-shared-sidebar--open' : ''}`}
                workspaceLabel={tr('KHÔNG GIAN LÀM VIỆC', 'WORKSPACE')}
                isCollapsed={collapsed}
                onToggleCollapse={() => setCollapsed((value) => !value)}
                onNavigate={() => setMobileOpen(false)}
                groups={[
                    { label: tr('ĐIỀU HÀNH KINH DOANH', 'COMMERCE OPERATIONS'), items: navigation.slice(0, 3) },
                    { label: tr('MARKETING & NỘI DUNG', 'MARKETING & CONTENT'), items: navigation.slice(3, 5) },
                    { label: tr('KHÁCH HÀNG', 'CUSTOMERS'), items: navigation.slice(5) },
                ]}
            />
            <div className="lg-main-wrapper">
                <header className="lg-topbar">
                    <div className="lg-topbar-title">
                        <button type="button" className="lg-mobile-menu lg-icon-button" aria-label={tr('Mở menu', 'Open menu')} onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
                        <div className="lg-topbar-stamp"><small>BTB</small><strong>02</strong></div>
                        <div><div className="lg-topbar-eyebrow">{tr('KHÔNG GIAN QUẢN TRỊ', 'OPERATIONS WORKSPACE')}</div><div className="lg-topbar-script">{tr('Góc kinh doanh.', 'Commerce desk.')}</div></div>
                    </div>
                    <div className="lg-topbar-actions">
                        <EcommerceWorkspaceSearch />
                        <LanguageSwitcher />
                        <WorkspaceAccountMenu user={user} roleLabel={tr('Nhân viên E-commerce', 'E-commerce executive')} />
                        <button type="button" className="lg-logout" onClick={() => setConfirmLogout(true)}><LogOut size={16} />{tr('Đăng xuất', 'Sign out')}</button>
                    </div>
                </header>
                <main id="ecommerce-main" tabIndex={-1} className="mx-auto w-full max-w-[1660px] px-4 py-7 outline-none sm:px-7 lg:py-9"><Outlet /></main>
            </div>
            <LogoutConfirmation open={confirmLogout} onCancel={() => setConfirmLogout(false)} onConfirm={() => { setConfirmLogout(false); void handleLogout(); }} />
        </div>
    );
}

export default function EcommerceLayout() {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: { queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false }, mutations: { retry: false } },
    }));
    return <QueryClientProvider client={queryClient}><ExecutiveConfirmationProvider><EcommerceWorkspace /></ExecutiveConfirmationProvider></QueryClientProvider>;
}
