import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/admin/authStore';
import {
    getCustomerInvoice,
    getCustomerOrder,
    getOrderVatPreview,
} from '@/services/customer/orderService';
import type {
    CustomerInvoice,
    CustomerOrderDetail,
    OrderVatPreview,
} from '@/services/customer/orderService';

const money = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
const statusLabel: Record<string, string> = {
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
};

export default function OrderStatusPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const session = useAuthStore((state) => state.session);
    const [detail, setDetail] = useState<CustomerOrderDetail | null>(null);
    const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
    const [vat, setVat] = useState<OrderVatPreview | null>(null);
    const [error, setError] = useState(false);
    const [extraError, setExtraError] = useState('');

    useEffect(() => {
        const abort = new AbortController();
        if (!orderId || !session || session.user.role !== 'CUSTOMER') return;
        getCustomerOrder(orderId, abort.signal)
            .then(setDetail)
            .catch(() => {
                if (!abort.signal.aborted) setError(true);
            });
        return () => abort.abort();
    }, [orderId, session]);

    const loading = !!orderId && detail?.order.orderId !== orderId && !error;
    const canShowDetail = detail?.order.orderId === orderId && !error;

    async function loadInvoice() {
        if (!orderId) return;
        setExtraError('');
        try {
            setInvoice(await getCustomerInvoice(orderId));
        } catch {
            setExtraError('Không lấy được hóa đơn.');
        }
    }
    async function loadVat() {
        if (!orderId) return;
        setExtraError('');
        try {
            setVat(await getOrderVatPreview(orderId));
        } catch {
            setExtraError('Không lấy được bản tính VAT.');
        }
    }

    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-store-cream font-body text-store-ink"
            mainClassName="w-full flex-1 px-5 py-12"
        >
            <div className="mx-auto max-w-[1150px]">
                <Link to={ROUTES.ORDERS} className="text-xs font-bold text-store-green">
                    ← Về lịch sử đơn hàng
                </Link>
                {loading && (
                    <p className="py-10" role="status">
                        Đang tải đơn hàng...
                    </p>
                )}
                {error && (
                    <p className="my-8 rounded-xl border bg-white p-6 text-sm" role="alert">
                        Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn này.
                    </p>
                )}
                {detail && canShowDetail && (
                    <>
                        <div className="my-6 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="m-0 font-heading text-4xl">
                                    Đơn hàng #{detail.order.orderNumber}
                                </h1>
                                <p className="text-xs text-store-muted">
                                    Tạo lúc{' '}
                                    {new Date(detail.order.createdAt).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <span className="rounded-lg bg-store-yellow px-4 py-2 text-xs font-extrabold">
                                {statusLabel[detail.order.status] ?? detail.order.status}
                            </span>
                        </div>
                        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                            <div className="space-y-5">
                                <section className="rounded-xl border-2 border-store-ink bg-white p-5">
                                    <h2 className="mt-0 text-xl font-bold">Sản phẩm đã đặt</h2>
                                    {detail.items.map((item) => (
                                        <div
                                            key={item.itemId}
                                            className="flex justify-between gap-3 border-t py-3 text-sm"
                                        >
                                            <div>
                                                <strong>{item.nameVi}</strong>
                                                <p className="m-0 text-xs text-store-muted">
                                                    {item.sku} · {item.quantity} {item.unitCode} ·
                                                    VAT {item.vatRate}%
                                                </p>
                                            </div>
                                            <strong className="whitespace-nowrap">
                                                {money(item.lineTotal)}
                                            </strong>
                                        </div>
                                    ))}
                                </section>
                                <section className="rounded-xl border-2 border-store-ink bg-white p-5">
                                    <h2 className="mt-0 text-xl font-bold">Các kiện giao hàng</h2>
                                    {detail.packages.length === 0 && (
                                        <p className="text-sm">Chưa có kiện giao hàng.</p>
                                    )}
                                    {detail.packages.map((pack) => (
                                        <div key={pack.packageId} className="border-t py-3 text-sm">
                                            <p className="m-0 font-bold">
                                                {pack.packageName} ({pack.packageNumber}){' '}
                                                {pack.cancelled ? '— Đã hủy' : ''}
                                            </p>
                                            <p className="my-1">{pack.deliveryAddress}</p>
                                            <p className="m-0 text-xs text-store-muted">
                                                Ngày: {pack.deliveryDate} ·{' '}
                                                {pack.deliveryTimeSlot ?? 'Chưa có khung giờ'} ·{' '}
                                                {pack.recipientName ?? ''}
                                            </p>
                                        </div>
                                    ))}
                                </section>
                            </div>
                            <aside className="space-y-5">
                                <section className="rounded-xl border-2 border-store-ink bg-white p-5 text-sm">
                                    <h2 className="mt-0 text-xl font-bold">Tổng kết đơn hàng</h2>
                                    <p>Tạm tính: {money(detail.order.itemsSubtotal)}</p>
                                    <p>VAT: {money(detail.order.vatAmount)}</p>
                                    <p>Vận chuyển: {money(detail.order.shippingFee)}</p>
                                    <strong className="block border-t pt-3 text-2xl text-store-coral">
                                        {money(detail.order.totalAmount)}
                                    </strong>
                                    <p className="text-xs text-store-muted">
                                        Thanh toán:{' '}
                                        {detail.order.paymentStatus ?? 'Chưa có thông tin'}
                                    </p>
                                </section>
                                <section className="rounded-xl border-2 border-store-ink bg-white p-5 text-sm">
                                    <h2 className="mt-0 text-lg font-bold">Hóa đơn và VAT</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={loadInvoice}
                                            type="button"
                                            className="rounded bg-store-green px-3 py-2 text-xs font-bold text-white"
                                        >
                                            Kiểm tra hóa đơn
                                        </button>
                                        <button
                                            onClick={loadVat}
                                            type="button"
                                            className="rounded bg-store-yellow px-3 py-2 text-xs font-bold"
                                        >
                                            Xem VAT
                                        </button>
                                    </div>
                                    {extraError && (
                                        <p role="alert" className="text-danger">
                                            {extraError}
                                        </p>
                                    )}
                                    {invoice && invoice.orderId === orderId && (
                                        <div className="mt-3">
                                            <p>
                                                Trạng thái hóa đơn:{' '}
                                                <strong>{invoice.invoiceStatus}</strong>
                                            </p>
                                            {invoice.downloadable && invoice.pdfUrl && (
                                                <a
                                                    href={invoice.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-store-green underline"
                                                >
                                                    Xem PDF chính thức
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {vat && vat.orderId === orderId && (
                                        <div className="mt-3">
                                            <p>
                                                Tổng VAT theo snapshot:{' '}
                                                <strong>{money(vat.vatAmount)}</strong>
                                            </p>
                                            <p className="text-xs text-store-muted">
                                                {vat.disclaimer}
                                            </p>
                                        </div>
                                    )}
                                </section>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
