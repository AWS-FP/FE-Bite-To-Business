import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/admin/authStore';
import { getCustomerOrders } from '@/services/customer/orderService';
import type { CustomerOrdersPage, CustomerOrderSummary } from '@/services/customer/orderService';

const labels: Record<CustomerOrderSummary['status'], string> = {
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
};
const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

export default function OrderHistoryPage() {
    const session = useAuthStore((state) => state.session);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState<'ALL' | CustomerOrderSummary['status']>('ALL');
    const [orders, setOrders] = useState<CustomerOrdersPage | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const abort = new AbortController();
        if (!session || session.user.role !== 'CUSTOMER') return;
        getCustomerOrders(page, 10, abort.signal)
            .then(setOrders)
            .catch(() => {
                if (!abort.signal.aborted) setError(true);
            });
        return () => abort.abort();
    }, [page, session]);

    const loading =
        !!session && session.user.role === 'CUSTOMER' && orders?.page !== page && !error;
    const visible = (orders?.page === page ? orders.content : []).filter(
        (order) => filter === 'ALL' || order.status === filter,
    );
    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-store-cream font-body text-store-ink"
            mainClassName="w-full flex-1 px-5 py-12"
        >
            <div className="mx-auto max-w-[1150px]">
                <Link to={ROUTES.HOME} className="text-xs font-bold text-store-green">
                    Trang chủ
                </Link>
                <h1 className="mt-4 font-heading text-5xl">
                    Lịch sử <em className="text-store-coral">đặt hàng</em>
                </h1>
                <p className="text-sm text-store-muted">
                    Đơn hàng thật của tài khoản Customer, được lấy từ hệ thống.
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                    {(['ALL', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as const).map(
                        (status) => (
                            <button
                                type="button"
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`rounded-lg border px-3 py-2 text-xs font-bold ${filter === status ? 'bg-store-green text-white' : 'bg-white text-store-ink'}`}
                            >
                                {status === 'ALL' ? 'Tất cả' : labels[status]}
                            </button>
                        ),
                    )}
                </div>
                {loading && <p role="status">Đang tải lịch sử đơn...</p>}
                {error && (
                    <p role="alert" className="text-danger">
                        Không tải được đơn hàng. Vui lòng thử lại.
                    </p>
                )}
                {!loading && !error && visible.length === 0 && (
                    <div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm">
                        Chưa có đơn hàng phù hợp.
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
                                        <p className="mt-2 text-xs">
                                            Trạng thái:{' '}
                                            <strong>{labels[order.status] ?? order.status}</strong>
                                        </p>
                                        <p className="mt-1 text-xs">
                                            Thanh toán: {order.paymentStatus ?? 'Chưa có thông tin'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="m-0 text-xl font-black text-store-coral">
                                            {formatMoney(order.totalAmount)}
                                        </p>
                                        <Link
                                            to={`/orders/${encodeURIComponent(order.orderId)}`}
                                            className="mt-3 inline-block rounded-lg bg-store-green px-4 py-2 text-xs font-bold text-white no-underline"
                                        >
                                            Xem đơn hàng
                                        </Link>
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
                            onClick={() => {
                                setError(false);
                                setPage((p) => p - 1);
                            }}
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
                            onClick={() => {
                                setError(false);
                                setPage((p) => p + 1);
                            }}
                            className="rounded border px-4 py-2 disabled:opacity-40"
                        >
                            Trang sau
                        </button>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
