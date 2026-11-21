import { useQuery } from '@tanstack/react-query';
import {
    BarChart3,
    CalendarDays,
    ClipboardCheck,
    Package,
    ShoppingBag,
    TrendingUp,
} from 'lucide-react';
import { useExecutiveText } from '@/components/e-commerce/executiveTokens';
import { ExecutiveBadge, ExecutiveFeedback } from '@/components/e-commerce/ExecutiveControls';
import {
    ExecutiveHeading,
    ExecutivePanel,
    ExecutiveStat,
    LoadingRows,
} from '@/components/e-commerce/ExecutiveUI';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { formatVnd } from '@/services/e-commerce/executiveReadService';

function dateParam(value: Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}
export default function EcommerceDashboardPage() {
    const tr = useExecutiveText();
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const metrics = useQuery({
        queryKey: ['ecom', 'metrics', dateParam(from), dateParam(today)],
        queryFn: () => executiveApi.metrics(dateParam(from), dateParam(today)),
    });
    const products = useQuery({
        queryKey: ['ecom', 'dashboard-products'],
        queryFn: () => executiveApi.products({ page: 0, size: 8 }),
    });
    const quotes = useQuery({
        queryKey: ['ecom', 'dashboard-quotes'],
        queryFn: () => executiveApi.quotes('PENDING_APPROVAL', 0, 6),
    });
    const m = metrics.data;
    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="01"
                eyebrow={tr('TỔNG QUAN VẬN HÀNH', 'COMMERCE OVERVIEW')}
                title={tr('Tổng quan E-commerce', 'E-commerce overview')}
                description={tr(
                    'Chỉ số sản phẩm, báo giá và doanh thu hoàn tất trong tháng hiện tại.',
                    'Product, quotation and completed-order performance for the current month.',
                )}
            />
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-[#133e2d] p-7 text-white sm:p-8">
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#f9dc70]">
                        BITE TO BUSINESS · EXECUTIVE
                    </span>
                    <h2 className="mt-3 max-w-xl text-2xl font-black sm:text-[31px]">
                        {tr(
                            'Tổng quan kinh doanh trong một màn hình',
                            'Your commerce performance at a glance',
                        )}
                    </h2>
                    <p className="mt-2 text-sm text-[#d9e7db]">
                        {tr(
                            'Được cập nhật từ hệ thống quản trị',
                            'Live from the executive management APIs',
                        )}
                    </p>
                </div>
                <span className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
                    <CalendarDays size={18} />
                    {dateParam(from)} — {dateParam(today)}
                </span>
            </section>
            {(metrics.isError || products.isError || quotes.isError) && (
                <ExecutiveFeedback
                    error
                    message={tr(
                        'Một số dữ liệu chưa tải được. Vui lòng thử lại.',
                        'Some data could not load. Please try again.',
                    )}
                />
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ExecutiveStat
                    title={tr('Sản phẩm đã đăng', 'Published products')}
                    value={m?.publishedProducts ?? (metrics.isLoading ? '…' : '—')}
                    icon={<Package size={20} />}
                    detail={tr('Đang bán trên gian hàng', 'Visible to customers')}
                />
                <ExecutiveStat
                    title={tr('Báo giá chờ duyệt', 'Pending quotes')}
                    value={m?.pendingQuotes ?? (metrics.isLoading ? '…' : '—')}
                    icon={<ClipboardCheck size={20} />}
                    tone="yellow"
                    detail={tr('Cần xử lý', 'Awaiting review')}
                />
                <ExecutiveStat
                    title={tr('Đơn hoàn thành trong tháng', 'Completed orders this month')}
                    value={m?.completedOrders ?? (metrics.isLoading ? '…' : '—')}
                    icon={<ShoppingBag size={20} />}
                    tone="blue"
                    detail={tr('Chỉ tính đơn COMPLETED', 'Completed orders only')}
                />
                <ExecutiveStat
                    title={tr('Doanh thu hoàn thành', 'Completed order revenue')}
                    value={m ? formatVnd(m.revenue) : '—'}
                    icon={<TrendingUp size={20} />}
                    tone="coral"
                    detail={tr('Tháng hiện tại', 'Current month')}
                />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#dce9dc] bg-white p-5">
                    <span className="text-xs font-semibold text-[#63796a]">
                        {tr('Sản phẩm nháp', 'Draft products')}
                    </span>
                    <strong className="mt-3 block text-2xl font-black">
                        {m?.draftProducts ?? '—'}
                    </strong>
                </div>
                <div className="rounded-2xl border border-[#dce9dc] bg-white p-5">
                    <span className="text-xs font-semibold text-[#63796a]">
                        {tr('Khuyến mãi đang chạy', 'Active promotions')}
                    </span>
                    <strong className="mt-3 block text-2xl font-black">
                        {m?.activePromotions ?? '—'}
                    </strong>
                </div>
                <div className="rounded-2xl border border-[#dce9dc] bg-white p-5">
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#63796a]">
                        <BarChart3 size={15} />
                        {tr('Đơn có sử dụng coupon', 'Coupon orders')}
                    </span>
                    <strong className="mt-3 block text-2xl font-black">
                        {m?.couponOrders ?? '—'}
                    </strong>
                </div>
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                <ExecutivePanel
                    title={tr('Sản phẩm cập nhật gần đây', 'Recently updated products')}
                    caption={tr(
                        'Bao gồm sản phẩm nháp và đã lưu trữ',
                        'Includes draft and archived records',
                    )}
                >
                    {products.isLoading ? (
                        <LoadingRows />
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
                                            <td className="px-5 py-3 font-bold">
                                                {formatVnd(p.listPrice)}
                                            </td>
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
                <ExecutivePanel
                    title={tr('Báo giá cần xử lý', 'Quotes awaiting review')}
                    caption={tr('Phiên bản và tổng giá trị thực tế', 'Live revision and value')}
                >
                    {quotes.isLoading ? (
                        <LoadingRows />
                    ) : (
                        <div className="divide-y divide-[#edf1e9]">
                            {quotes.data?.items.map((q) => (
                                <div
                                    key={q.id}
                                    className="flex items-center justify-between gap-3 px-5 py-4"
                                >
                                    <div>
                                        <strong className="text-sm">{q.quoteNumber}</strong>
                                        <p className="mt-1 text-xs text-[#6b8173]">
                                            {q.companyName || q.contactName || q.customerId} · Rev{' '}
                                            {q.revision}
                                        </p>
                                    </div>
                                    <strong className="text-sm text-[#1e5e42]">
                                        {formatVnd(q.totalAmount)}
                                    </strong>
                                </div>
                            ))}
                            {!quotes.data?.items.length && (
                                <p className="p-6 text-sm text-[#6b8173]">
                                    {tr('Không có báo giá chờ duyệt.', 'No pending quotes.')}
                                </p>
                            )}
                        </div>
                    )}
                </ExecutivePanel>
            </div>
        </div>
    );
}
