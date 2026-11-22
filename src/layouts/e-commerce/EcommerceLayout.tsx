import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Megaphone,
    Menu,
    MessageSquare,
    Package,
    Search,
    Image,
    TicketPercent,
    X,
} from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { logout } from '@/services/admin/authService';
import { useAuthStore } from '@/store/admin/authStore';
import WorkspaceSidebar from '@/layouts/WorkspaceSidebar';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import WorkspaceAccountMenu from '@/components/common/WorkspaceAccountMenu';
import LogoutConfirmation from '@/components/common/LogoutConfirmation';
import { useExecutiveText } from '@/components/e-commerce/executiveTokens';

function EcommerceWorkspace() {
    const tr = useExecutiveText();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.session?.user ?? null);
    const clearSession = useAuthStore((s) => s.clearSession);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const loggingOut = useRef(false);
    const navigation = [
        {
            path: ROUTES.ECOMMERCE_DASHBOARD,
            label: tr('Tổng quan', 'Overview'),
            icon: <LayoutDashboard size={18} />,
        },
        {
            path: ROUTES.ECOMMERCE_PRODUCTS,
            label: tr('Sản phẩm & giá', 'Products & pricing'),
            icon: <Package size={18} />,
        },
        {
            path: ROUTES.ECOMMERCE_QUOTES,
            label: tr('Báo giá B2B', 'B2B quotes'),
            icon: <ClipboardList size={18} />,
        },
        {
            path: ROUTES.ECOMMERCE_COUPONS,
            label: tr('Mã giảm giá', 'Coupons'),
            icon: <TicketPercent size={18} />,
        },
        {
            path: ROUTES.ECOMMERCE_PROMOTIONS,
            label: tr('Khuyến mãi', 'Promotions'),
            icon: <Megaphone size={18} />,
        },
        {
            path: ROUTES.ECOMMERCE_POSTER,
            label: tr('Ảnh khuyến mãi', 'Promotion images'),
            icon: <Image size={18} />,
        },
        {
            path: ROUTES.ECOMMERCE_REQUESTS,
            label: tr('Yêu cầu sản phẩm', 'Product requests'),
            icon: <Package size={18} />,
        },
        {
            path: ROUTES.ECOMMERCE_REVIEWS,
            label: tr('Đánh giá khách hàng', 'Customer reviews'),
            icon: <MessageSquare size={18} />,
        },
    ];
    const current = navigation.find((item) => location.pathname === item.path) ?? navigation[0];

    useEffect(() => {
        document.title = `${current.label} | Bite to Business`;
    }, [current.label]);

    async function handleLogout() {
        if (loggingOut.current) return;
        loggingOut.current = true;
        try {
            await logout();
        } catch {
            /* Session can still be ended locally. */
        } finally {
            clearSession();
            queryClient.clear();
            navigate(ROUTES.LOGIN, { replace: true });
            loggingOut.current = false;
        }
    }

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        navigate(`${ROUTES.ECOMMERCE_PRODUCTS}?q=${encodeURIComponent(globalSearch.trim())}`);
    }

    return (
        <div
            data-role="ECOMMERCE_EXECUTIVE"
            data-layout="staff"
            className={`isolate min-h-dvh bg-[#faf5e7] font-body text-[#14392b] lg:grid ${collapsed ? 'is-collapsed lg:grid-cols-[84px_minmax(0,1fr)]' : 'lg:grid-cols-[272px_minmax(0,1fr)]'}`}
        >
            <a
                href="#ecommerce-main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[200] focus:bg-store-yellow focus:p-3"
            >
                {tr('Bỏ qua menu', 'Skip navigation')}
            </a>
            {mobileOpen && (
                <button
                    aria-label={tr('Đóng menu', 'Close menu')}
                    type="button"
                    className="fixed inset-0 z-[89] bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <div
                className={`fixed inset-y-0 left-0 z-[90] w-[min(272px,86vw)] transition-transform duration-200 lg:sticky lg:top-0 lg:z-30 lg:h-dvh lg:w-auto lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <WorkspaceSidebar
                    sidebarId="ecommerce-sidebar"
                    className="!relative !h-full !min-h-0 [&_.admin-navigation-link]:transition-[box-shadow,background-color] [&_.admin-navigation-link]:duration-100 [&_.admin-navigation-link[aria-current=page]]:!bg-[#ffe146] [&_.admin-navigation-link[aria-current=page]]:!shadow-[3px_3px_0_#173a2a]"
                    workspaceLabel={tr('KHÔNG GIAN E-COMMERCE', 'E-COMMERCE WORKSPACE')}
                    isCollapsed={collapsed}
                    onToggleCollapse={() => setCollapsed((v) => !v)}
                    onNavigate={() => setMobileOpen(false)}
                    groups={[
                        {
                            label: tr('ĐIỀU HÀNH KINH DOANH', 'COMMERCE OPERATIONS'),
                            items: navigation.slice(0, 3),
                        },
                        {
                            label: tr('MARKETING & NỘI DUNG', 'MARKETING & CONTENT'),
                            items: navigation.slice(3, 6),
                        },
                        {
                            label: tr('KHÁCH HÀNG & YÊU CẦU', 'CUSTOMERS & REQUESTS'),
                            items: navigation.slice(6),
                        },
                    ]}
                />
                <button
                    type="button"
                    aria-label={tr('Đóng menu', 'Close menu')}
                    onClick={() => setMobileOpen(false)}
                    className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg border bg-white lg:hidden"
                >
                    <X size={17} />
                </button>
            </div>
            <div className="min-w-0">
                <header className="flex min-h-[114px] flex-wrap items-center justify-between gap-4 border-b-4 border-[#172f25] bg-[#fcf5e5] px-4 py-5 sm:px-7">
                    <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="grid size-10 place-items-center rounded-lg border border-[#193e30] bg-white lg:hidden"
                            aria-label={tr('Mở menu', 'Open menu')}
                        >
                            <Menu size={21} />
                        </button>
                        <div className="hidden h-16 w-[52px] shrink-0 -rotate-3 flex-col items-center justify-center border-2 border-[#163b2a] bg-store-yellow shadow-[3px_3px_0_#163b2a] sm:flex">
                            <small className="text-[10px] font-black tracking-widest">BTB</small>
                            <strong className="font-display text-[27px]">02</strong>
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.20em] text-[#426750]">
                                {tr('KHÔNG GIAN QUẢN TRỊ', 'OPERATIONS WORKSPACE')}
                            </p>
                            <p className="mt-1 font-heading text-2xl leading-tight sm:text-3xl">
                                {tr('Góc kinh doanh.', 'Commerce desk.')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <form
                            role="search"
                            onSubmit={handleSearch}
                            className="group hidden h-[52px] w-[min(34vw,420px)] min-w-[260px] items-center gap-2 overflow-hidden rounded-[18px] border border-[#b9d5c3] bg-white p-1.5 shadow-[0_4px_16px_rgba(14,63,38,0.08)] transition focus-within:border-[#278254] focus-within:shadow-[0_0_0_4px_rgba(39,130,84,0.12)] md:flex"
                        >
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eaf4e8] text-[#226645]">
                                <Search size={18} aria-hidden="true" />
                            </span>
                            <input
                                value={globalSearch}
                                onChange={(event) => setGlobalSearch(event.target.value)}
                                placeholder={tr(
                                    'Tìm tên sản phẩm, SKU...',
                                    'Find products or SKU...',
                                )}
                                aria-label={tr('Tìm nhanh sản phẩm', 'Search products')}
                                autoComplete="off"
                                className="!h-auto !min-w-0 !flex-1 !rounded-none !border-0 !bg-transparent !px-1 !py-2 !text-sm !font-medium !text-[#174531] !shadow-none !outline-none !ring-0 placeholder:!text-[#899d8c] focus:!border-0 focus:!outline-none focus:!ring-0"
                            />
                            {globalSearch && (
                                <button
                                    type="button"
                                    onClick={() => setGlobalSearch('')}
                                    aria-label={tr('Xóa từ khóa', 'Clear search')}
                                    className="grid size-7 shrink-0 place-items-center rounded-lg text-[#648775] hover:bg-[#f1f7f0]"
                                >
                                    <X size={15} />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex h-9 shrink-0 items-center gap-1 rounded-xl bg-[#ffe36c] px-3 text-xs font-extrabold text-[#173d2b] transition hover:bg-[#ffda35]"
                                title={tr('Tìm sản phẩm', 'Search products')}
                            >
                                {tr('Tìm', 'Go')}
                            </button>
                        </form>
                        <LanguageSwitcher />
                        <WorkspaceAccountMenu
                            user={user}
                            roleLabel={tr('Nhân viên E-commerce', 'E-commerce executive')}
                        />
                        <button
                            type="button"
                            onClick={() => setConfirmLogout(true)}
                            className="hidden min-h-10 items-center gap-2 rounded-lg border border-[#173f30] bg-white px-3 text-xs font-bold hover:bg-[#ffeccc] sm:flex"
                        >
                            <LogOut size={16} />
                            {tr('Đăng xuất', 'Sign out')}
                        </button>
                    </div>
                </header>
                <main
                    id="ecommerce-main"
                    tabIndex={-1}
                    className="mx-auto w-full max-w-[1660px] px-4 py-7 outline-none sm:px-7 lg:py-9"
                >
                    <Outlet />
                </main>
                <footer className="flex flex-wrap justify-between gap-3 border-t border-[#e2dfd2] px-7 py-5 text-xs text-[#718176]">
                    <strong>Bite to Business / E-commerce</strong>
                    <span>
                        {tr('Công cụ quản trị E-commerce', 'E-commerce operations workspace')}
                    </span>
                </footer>
            </div>
            <LogoutConfirmation
                open={confirmLogout}
                onCancel={() => setConfirmLogout(false)}
                onConfirm={() => {
                    setConfirmLogout(false);
                    void handleLogout();
                }}
            />
        </div>
    );
}

export default function EcommerceLayout() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false },
                    mutations: { retry: false },
                },
            }),
    );
    return (
        <QueryClientProvider client={queryClient}>
            <EcommerceWorkspace />
        </QueryClientProvider>
    );
}
