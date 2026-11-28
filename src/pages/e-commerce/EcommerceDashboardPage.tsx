import Skeleton from '@/components/common/Skeleton';
import DashboardCatalogIllustration from '@/components/e-commerce/DashboardCatalogIllustration';
import { ExecutiveTableSkeleton } from '@/components/e-commerce/ExecutiveSkeletons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import {
    ArrowRight,
    BarChart3,
    Package,
    ShoppingBag,
    TrendingUp,
} from 'lucide-react';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { ExecutiveBadge, ExecutiveFeedback } from '@/components/e-commerce/ExecutiveControls';
import { ExecutiveHeading, ExecutivePanel } from '@/components/e-commerce/ExecutiveUI';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { formatVnd } from '@/services/e-commerce/executiveReadService';

function dateParam(value: Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
        value.getDate(),
    ).padStart(2, '0')}`;
}

export default function EcommerceDashboardPage() {
    const tr = useExecutiveText();
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthLabel = new Intl.DateTimeFormat(tr('vi-VN', 'en-US'), {
        month: 'long',
        year: 'numeric',
    }).format(today);
    const metrics = useQuery({
        queryKey: ['ecom', 'metrics', dateParam(from), dateParam(today)],
        queryFn: () => executiveApi.metrics(dateParam(from), dateParam(today)),
    });
    const products = useQuery({
        queryKey: ['ecom', 'dashboard-products'],
        queryFn: () => executiveApi.products({ page: 0, size: 8 }),
    });
    const m = metrics.data;

    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="01"
                eyebrow={tr('TỔNG QUAN VẬN HÀNH', 'COMMERCE OVERVIEW')}
                title={tr('Tổng quan E-commerce', 'E-commerce overview')}
                description={tr(
                    'Chỉ số sản phẩm và doanh thu hoàn tất trong tháng hiện tại.',
                    'Product and completed-order performance for the current month.',
                )}
            />

            {(metrics.isError || products.isError) && (
                <ExecutiveFeedback
                    error
                    message={tr(
                        'Một số dữ liệu chưa tải được. Vui lòng thử lại.',
                        'Some data could not load. Please try again.',
                    )}
                />
            )}

            <section aria-label={tr('Kết quả kinh doanh', 'Sales performance')} className="relative overflow-hidden rounded-[32px] border-[2.5px] border-store-ink bg-store-green px-5 py-5 text-white shadow-[0_7px_0_0_var(--color-store-ink)] sm:px-7 sm:py-7">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-8 top-10 size-24 rounded-full border border-white/10 bg-white/5" />
                    <div className="absolute left-1/3 top-6 size-16 rounded-full border border-white/10 bg-store-yellow/10" />
                    <div className="absolute bottom-4 right-8 size-28 rounded-full border border-white/10 bg-white/5" />
                    <div className="absolute -right-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-[28px] border border-white/10 bg-white/5" />
                </div>
                <div className="relative flex flex-wrap items-center justify-between gap-5">
                    <div className="min-w-0">
                        <span className="mb-3 inline-flex -rotate-[2deg] rounded-md border-2 border-store-ink bg-store-yellow px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-store-ink shadow-[3px_3px_0_0_var(--color-store-ink)]">
                            {tr('Bảng điều hành', 'Control board')}
                        </span>
                        <h2 className="m-0 font-heading text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                            {tr('Hoạt động kinh doanh', 'Commerce operations')}
                        </h2>
                    </div>
                    <div className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                        {monthLabel}
                    </div>
                </div>
                <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
                    {[
                        {
                            label: tr('Doanh thu hoàn thành', 'Completed order revenue'),
                            value: m ? formatVnd(m.revenue) : '—',
                            detail: tr('Chỉ tính đơn đã hoàn thành', 'Completed orders only'),
                            icon: TrendingUp,
                            featured: true,
                        },
                        {
                            label: tr('Đơn hàng hoàn thành', 'Completed orders'),
                            value: m?.completedOrders ?? '—',
                            detail: tr('Trong tháng hiện tại', 'Current month'),
                            icon: ShoppingBag,
                            featured: false,
                        },
                        {
                            label: tr('Đơn có sử dụng coupon', 'Coupon orders'),
                            value: m?.couponOrders ?? '—',
                            detail: tr('Trong kỳ báo cáo', 'Reporting period'),
                            icon: BarChart3,
                            featured: false,
                        },
                    ].map(({ label, value, detail, icon: Icon, featured }) => (
                        <div key={label} className={`min-w-0 rounded-2xl border border-solid border-white/20 bg-white/10 p-4 sm:p-5 ${featured ? 'sm:col-span-2 xl:col-span-1' : ''}`}>
                            <div className="flex items-start justify-between gap-3">
                                <p className="m-0 text-xs font-bold uppercase tracking-wide text-white/85">{label}</p>
                                <Icon size={20} className="shrink-0 text-store-yellow" aria-hidden="true" />
                            </div>
                            <div className="mt-3 break-words font-price text-3xl font-extrabold tabular-nums text-store-yellow">
                                {metrics.isLoading ? <Skeleton className="h-9 w-24 max-w-full" /> : value}
                            </div>
                            <p className="mb-0 mt-2 text-xs leading-5 text-white/75">{detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3" aria-label={tr('Sản phẩm và khuyến mãi', 'Catalog and promotions')}>
                <h2 className="m-0 text-base font-bold text-store-ink">
                    {tr('Sản phẩm và khuyến mãi', 'Catalog and promotions')}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: tr('Sản phẩm đã đăng', 'Published products'),
                            value: m?.publishedProducts,
                            illustration: 'published' as const,
                            tone: 'bg-[#eef7ef] border-[#c5ddcc] text-[#20603c] shadow-[0_4px_0_0_rgba(32,96,60,0.12)]',
                            to: ROUTES.ECOMMERCE_PRODUCTS,
                        },
                        {
                            label: tr('Sản phẩm nháp', 'Draft products'),
                            value: m?.draftProducts,
                            illustration: 'draft' as const,
                            tone: 'bg-[#eef5fb] border-[#cbddeb] text-[#285e88] shadow-[0_4px_0_0_rgba(40,94,136,0.12)]',
                            to: ROUTES.ECOMMERCE_PRODUCTS,
                        },
                        {
                            label: tr('Khuyến mãi đang chạy', 'Active promotions'),
                            value: m?.activePromotions,
                            illustration: 'promotion' as const,
                            tone: 'bg-[#fff9df] border-[#ecdba0] text-[#795b14] shadow-[0_4px_0_0_rgba(121,91,20,0.12)]',
                            to: ROUTES.ECOMMERCE_PROMOTIONS,
                        },
                    ].map(({ label, value, illustration, tone, to }) => (
                        <Link
                            key={label}
                            to={to}
                            className={`group relative flex min-h-[158px] min-w-0 flex-col justify-between overflow-hidden rounded-[22px] border-2 border-solid p-5 text-store-ink no-underline transition hover:-translate-y-0.5 ${tone}`}
                        >
                            <DashboardCatalogIllustration kind={illustration} />
                            <div className="relative flex items-start justify-between gap-3">
                                <p className="m-0 min-w-0 break-words text-xs font-bold uppercase tracking-[0.16em] text-current/75">
                                    {label}
                                </p>
                                <ArrowRight
                                    size={18}
                                    className="shrink-0 text-current transition-transform group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="relative mt-6 min-w-0 pr-[76px] sm:pr-[62px] xl:pr-[108px] 2xl:pr-[126px]">
                                <strong className="block break-words font-price text-[38px] font-black leading-none tabular-nums text-current">
                                    {metrics.isLoading ? (
                                        <Skeleton className="h-10 w-16" />
                                    ) : (
                                        value ?? '—'
                                    )}
                                </strong>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="grid gap-5">
                <ExecutivePanel
                    title={tr('Sản phẩm cập nhật gần đây', 'Recently updated products')}
                    caption={tr('Danh sách theo lần cập nhật gần nhất', 'Products ordered by latest update')}
                    action={
                        <Link
                            to={ROUTES.ECOMMERCE_PRODUCTS}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-store-green no-underline hover:underline"
                        >
                            {tr('Xem tất cả', 'View all')} <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    }
                >
                    {products.isLoading ? (
                        <ExecutiveTableSkeleton
                            cells={['product', 'text', 'text', 'badge']}
                            count={8}
                            tableClass="w-full min-w-[540px] text-left text-sm"
                            cellClass="border-t border-[#edf1e9] px-5 py-3"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px] text-left text-sm">
                                <thead className="bg-[#f7faf5] text-xs text-[#5c7765]">
                                    <tr>
                                        <th className="px-5 py-3">{tr('Sản phẩm', 'Product')}</th>
                                        <th className="px-5 py-3">SKU</th>
                                        <th className="px-5 py-3">{tr('Giá', 'Price')}</th>
                                        <th className="px-5 py-3">{tr('Trạng thái', 'Status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data?.items.map((p) => (
                                        <tr key={p.id} className="border-t border-[#edf1e9]">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    {p.imageUrl ? (
                                                        <img
                                                            src={p.imageUrl}
                                                            loading="lazy"
                                                            alt=""
                                                            className="size-10 rounded-lg border object-contain"
                                                        />
                                                    ) : (
                                                        <span className="grid size-10 place-items-center rounded-lg bg-[#eef4eb]">
                                                            <Package size={16} />
                                                        </span>
                                                    )}
                                                    <span className="line-clamp-2 font-semibold">
                                                        {tr(p.nameVi, p.nameEn)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-mono text-xs">{p.sku}</td>
                                            <td className="px-5 py-3 font-bold">{formatVnd(p.listPrice)}</td>
                                            <td className="px-5 py-3">
                                                <ExecutiveBadge status={p.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!products.data?.items.length && (
                                <p className="p-6 text-sm text-[#6e8575]">
                                    {tr('Chưa có sản phẩm.', 'No products yet.')}
                                </p>
                            )}
                        </div>
                    )}
                </ExecutivePanel>
            </div>
        </div>
    );
}
