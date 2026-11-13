import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { STAFF_WORKSPACES } from '@/constants/staffNavigation';
import { ROUTES } from '@/router/routes';
import { logout } from '@/services/admin/authService';
import { useAuthStore } from '@/store/admin/authStore';
import WorkspaceSidebar from '@/layouts/WorkspaceSidebar';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function EcommerceLayout() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <EcommerceWorkspace />
        </QueryClientProvider>
    );
}

function EcommerceWorkspace() {
    const { t } = useTranslation('workspace');
    const { t: common } = useTranslation('admin');
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.session?.user ?? null);
    const clearSession = useAuthStore((state) => state.clearSession);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const loggingOut = useRef(false);
    const workspace = STAFF_WORKSPACES.ECOMMERCE_EXECUTIVE;
    const currentIndex = workspace.items.findIndex(
        (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`),
    );
    const ecomLabels: Record<string, string> = { ecommerceDashboard: 'Tổng quan', ecommerceQuotes: 'Duyệt Báo Giá', ecommercePoster: 'AI Poster Studio' };
    const displayLabel = (key: string) => ecomLabels[key] ?? t(key);
    const pageLabel = displayLabel(workspace.items[Math.max(0, currentIndex)].label);

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
            className={`admin-layout grid min-h-dvh bg-surface-soft font-body text-black [&_button]:cursor-pointer [&_a]:text-inherit [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_button:focus-visible]:outline-[3px_solid_var(--color-status-active)] [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[3px_solid_var(--color-status-active)] [&_a:focus-visible]:outline-offset-4 ${isCollapsed ? 'is-collapsed grid-cols-[84px_minmax(0,1fr)]' : 'grid-cols-[195px_minmax(0,1fr)]'}`}
            data-layout="staff"
            data-role="ECOMMERCE_EXECUTIVE"
        >
            <a
                className="admin-skip-link fixed top-2 left-3 z-[60] -translate-y-[180%] border border-black bg-store-yellow px-4 py-3 focus:translate-y-0"
                href="#staff-main-content"
            >
                {common('skipToContent')}
            </a>
            <WorkspaceSidebar
                workspaceLabel={t(workspace.label)}
                logoSrc="/images/storefront/brand-logo.png"
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                groups={[
                    {
                        label: t('navigationGroup'),
                        items: workspace.items.map((item) => ({
                            path: item.path,
                            label: displayLabel(item.label),
                            icon: <item.icon size={18} aria-hidden="true" />,
                        })),
                    },
                ]}
            />
            <div className="admin-workspace min-w-0">
                    <header className="flex min-h-[58px] flex-wrap items-center justify-between gap-3 border-b-2 border-store-ink bg-store-cream px-5 py-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-3">
                            <input aria-label="Tìm nhanh" className="h-9 w-[min(300px,42vw)] rounded-lg border border-store-ink bg-white px-3 text-xs" placeholder="Tìm quote, SKU, coupon..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} onKeyDown={event => { if (event.key === 'Enter') navigate(`${ROUTES.ECOMMERCE_PRODUCTS}?q=${encodeURIComponent(globalSearch)}`); }} />
                            <small className="hidden font-bold text-emerald-700 lg:inline">{pageLabel}</small>
                        </div>
                        <div className="flex items-center gap-2"><LanguageSwitcher /><span className="rounded-lg border border-store-ink bg-white px-2 py-2 text-[10px] font-bold">Điều phối đơn</span><button type="button" className="rounded-lg border border-store-ink bg-white px-3 py-2 text-[11px] font-bold" onClick={handleLogout}>Đăng xuất</button><span className="grid size-9 place-items-center rounded-lg bg-store-pink text-xs font-bold">{user?.email?.slice(0, 2).toUpperCase() ?? 'EC'}</span></div>
                    </header>
                <main
                    className="admin-main-content min-w-0 p-5 focus:outline-none lg:p-7"
                    id="staff-main-content"
                    tabIndex={-1}
                >
                    <Outlet />
                </main>
                <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-store-ink bg-store-cream px-7 py-6 text-[10px] text-store-muted"><strong className="font-display text-sm text-store-ink">Bite to Business</strong><span>Đồng bộ kho: demo · Trạng thái hệ thống: giả lập · v2.4.0</span></footer>
            </div>
        </div>
    );
}
