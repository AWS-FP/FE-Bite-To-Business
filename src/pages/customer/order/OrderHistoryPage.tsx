import { Link, useSearchParams } from 'react-router-dom';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import OrderStatusBadge from '@/components/customer/order/OrderStatusBadge';
import { ROUTES } from '@/router/routes';
import { useCustomerOrders } from '@/hooks/customer/useCustomerOrders';
import type { CustomerOrderGroup } from '@/types/customer/order';
import PageNav from '@/components/common/PageNav';
import { RotateCcw } from 'lucide-react';
import { useReorderOrder } from '@/hooks/customer/useReorderOrder';

const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

/** `/orders` = orders still in progress; `/orders?view=history` = completed or cancelled ones. */
const views = {
    active: {
        group: 'ACTIVE' as CustomerOrderGroup,
        tab: 'Đơn hàng của bạn',
        title: 'Đơn hàng của bạn',
        description: 'Các đơn đang chờ thanh toán hoặc chờ giao hàng.',
        empty: 'Bạn không có đơn hàng nào đang xử lý.',
        to: ROUTES.ORDERS,
    },
    history: {
        group: 'FINISHED' as CustomerOrderGroup,
        tab: 'Lịch sử nhập hàng',
        title: 'Lịch sử nhập hàng',
        description: 'Các đơn đã giao hoàn tất hoặc đã hủy.',
        empty: 'Chưa có đơn hàng nào hoàn tất.',
        to: `${ROUTES.ORDERS}?view=history`,
    },
};

export default function OrderHistoryPage() {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') === 'history' ? 'history' : 'active';
    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-store-cream font-body text-store-ink"
            mainClassName="w-full flex-1 px-5 py-12"
        >
            <div className="mx-auto max-w-[1150px]">
                <PageNav back={{ label: 'Trang chủ', to: ROUTES.HOME }} />
                <h1 className="mt-4 font-heading text-5xl">{views[view].title}</h1>
                <p className="mt-2 text-sm text-store-muted">{views[view].description}</p>
                <div role="tablist" className="mb-6 mt-5 flex flex-wrap gap-2">
                    {(['active', 'history'] as const).map((key) => (
                        <Link
                            key={key}
                            role="tab"
                            aria-selected={view === key}
                            to={views[key].to}
                            className={`rounded-lg border px-4 py-2 text-sm font-bold no-underline ${view === key ? 'border-store-green bg-store-green text-white' : 'border-store-line bg-white text-store-ink hover:bg-store-cream'}`}
                        >
                            {views[key].tab}
                        </Link>
                    ))}
                </div>
                {/* Keyed so switching tabs starts again from the first page. */}
                <OrderList key={view} group={views[view].group} empty={views[view].empty} />
            </div>
        </StorefrontLayout>
    );
}

function OrderList({ group, empty }: { group: CustomerOrderGroup; empty: string }) {
    const { page, goToPage, orders, error, loading, visible } = useCustomerOrders(group);
    const reordering = useReorderOrder();
    return (
        <>
            {reordering.error && <p role="alert" className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{reordering.error}</p>}
            {loading && <p role="status">Đang tải đơn hàng...</p>}
            {error && (
                <p role="alert" className="text-danger">
                    Không tải được đơn hàng. Vui lòng thử lại.
                </p>
            )}
            {!loading && !error && visible.length === 0 && (
                <div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm">
                    {empty}
                </div>
            )}
            <div className="grid gap-4">
                {!loading &&
                    !error &&
                    visible.map((order) => (
                        <article
                            key={order.orderId}
                            className="rounded-xl border-2 border-store-ink bg-white p-5 shadow-[4px_4px_0_#14132b]"
                        >
                            <div className="flex flex-wrap justify-between gap-4">
                                <div>
                                    <h2 className="m-0 text-lg font-extrabold">
                                        #{order.orderNumber}
                                    </h2>
                                    <p className="mt-1 text-xs text-store-muted">
                                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                                    </p>
                                    <div className="mt-2">
                                        <OrderStatusBadge
                                            status={order.status}
                                            paymentStatus={order.paymentStatus}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="m-0 text-xl font-black text-store-coral">
                                        {formatMoney(order.totalAmount)}
                                    </p>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                                        <button type="button" disabled={reordering.pendingOrderId !== null}
                                            onClick={() => void reordering.reorder(order.orderId)}
                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-store-green bg-white px-4 py-2 text-xs font-bold text-store-green hover:bg-surface-green disabled:cursor-not-allowed disabled:opacity-50">
                                            <RotateCcw size={15} aria-hidden="true" />
                                            {reordering.pendingOrderId === order.orderId ? 'Đang chuẩn bị...' : 'Đặt lại đơn hàng'}
                                        </button>
                                        <Link to={`/orders/${encodeURIComponent(order.orderId)}`}
                                            className="inline-block rounded-lg bg-store-green px-4 py-2 text-xs font-bold text-white no-underline">
                                            Xem đơn hàng
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
            </div>
            {orders && orders.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between text-xs">
                    <button
                        type="button"
                        disabled={page === 0}
                        onClick={() => goToPage(page - 1)}
                        className="rounded border px-4 py-2 disabled:opacity-40"
                    >
                        Trang trước
                    </button>
                    <span>
                        Trang {page + 1} / {orders.totalPages} · {orders.totalElements} đơn
                    </span>
                    <button
                        type="button"
                        disabled={page + 1 >= orders.totalPages}
                        onClick={() => goToPage(page + 1)}
                        className="rounded border px-4 py-2 disabled:opacity-40"
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </>
    );
}
