import { useEffect, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '@/store/customer/cartStore';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import OrderStatusBadge from '@/components/customer/order/OrderStatusBadge';
import { paymentStatusLabel } from '@/utils/orderStatus';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/admin/authStore';
import {
    cancelCustomerOrder,
    getCustomerInvoice,
    getCustomerOrder,
    getOrderVatPreview,
} from '@/services/customer/orderService';
import ConfirmModal from '@/components/common/ConfirmModal';
import type {
    CustomerInvoice,
    CustomerOrderDetail,
    OrderVatPreview,
} from '@/services/customer/orderService';
import { createBankPayment, getBankPayment, type BankPayment } from '@/services/customer/paymentService';
import PageNav from '@/components/common/PageNav';

const money = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
const QR_LIFETIME_MS = 5 * 60 * 1000;

export default function OrderStatusPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const location = useLocation();
    const openPaymentOnLoad = (location.state as { showPayment?: boolean } | null)?.showPayment === true;
    const session = useAuthStore((state) => state.session);
    // Only the owning customer can open this page, so the signed-in user is who placed the order.
    const customerName = session
        ? `${session.user.lastName ?? ''} ${session.user.firstName ?? ''}`.trim() ||
          session.user.email
        : '';
    const [detail, setDetail] = useState<CustomerOrderDetail | null>(null);
    const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
    const [vat, setVat] = useState<OrderVatPreview | null>(null);
    const [error, setError] = useState(false);
    const [extraError, setExtraError] = useState('');
    const [payment, setPayment] = useState<BankPayment | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [qrError, setQrError] = useState(false);
    // 'edit' cancels the unpaid order too, then puts its products back in the cart for re-ordering.
    const [cancelMode, setCancelMode] = useState<'cancel' | 'edit' | null>(null);
    const navigate = useNavigate();
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState('');
    // The QR is shown for QR_LIFETIME_MS, then blurred until the customer asks for a fresh one.
    // A fresh one re-checks with BE that the order can still be paid before showing it again.
    const [qrIssuedAt, setQrIssuedAt] = useState<number | null>(null);
    const [now, setNow] = useState(0);

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

    const awaitingPayment =
        !!detail &&
        detail.order.orderId === orderId &&
        ['CONFIRMED', 'PROCESSING'].includes(detail.order.status) &&
        detail.order.paymentStatus !== 'SUCCESS';
    const paymentId = payment?.status === 'PENDING' && payment.qrUrl ? payment.id : null;

    // Vừa đặt hàng từ giỏ: mở QR ngay, không bắt khách bấm thêm.
    useEffect(() => {
        if (!openPaymentOnLoad || !awaitingPayment || !orderId) return;
        let cancelled = false;
        createBankPayment(orderId)
            .then((result) => {
                if (cancelled) return;
                setPayment(result);
                const issued = Date.now();
                setQrIssuedAt(issued);
                setNow(issued);
            })
            .catch(() => {
                if (!cancelled) {
                    setPaymentError('Không thể tạo mã thanh toán. Đơn có thể đã hết hạn hoặc thanh toán không khả dụng.');
                }
            });
        return () => {
            cancelled = true;
        };
    }, [openPaymentOnLoad, awaitingPayment, orderId]);

    // Webhook SePay cập nhật thanh toán ở BE; FE hỏi lại mỗi 5 giây khi đang chờ.
    useEffect(() => {
        if (!paymentId || !orderId) return;
        const timer = window.setInterval(() => {
            getBankPayment(paymentId)
                .then(async (result) => {
                    setPayment(result);
                    if (result.status === 'SUCCESS') setDetail(await getCustomerOrder(orderId));
                })
                .catch(() => undefined);
        }, 5000);
        return () => window.clearInterval(timer);
    }, [paymentId, orderId]);

    // Ticks once a second while a QR is on screen, to drive the countdown and the expiry.
    const qrVisible = payment?.status === 'PENDING' && !!payment.qrUrl && qrIssuedAt != null;
    useEffect(() => {
        if (!qrVisible) return;
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [qrVisible]);
    const qrRemainingMs = qrIssuedAt == null ? 0 : Math.max(0, qrIssuedAt + QR_LIFETIME_MS - now);
    const qrExpired = qrVisible && qrRemainingMs === 0;
    const qrCountdown = `${String(Math.floor(qrRemainingMs / 60000)).padStart(2, '0')}:${String(
        Math.floor((qrRemainingMs % 60000) / 1000),
    ).padStart(2, '0')}`;

    const openingPayment = openPaymentOnLoad && awaitingPayment && !payment && !paymentError;
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

    async function showPayment() {
        if (!orderId || paymentLoading) return;
        setPaymentLoading(true);
        setPaymentError('');
        setQrError(false);
        try {
            setPayment(await createBankPayment(orderId));
            const issued = Date.now();
            setQrIssuedAt(issued);
            setNow(issued);
        } catch {
            setPaymentError('Không thể tạo mã thanh toán. Đơn có thể đã hết hạn hoặc thanh toán không khả dụng.');
        } finally {
            setPaymentLoading(false);
        }
    }

    // Only unpaid orders can be cancelled here; BE re-checks and returns reserved stock.
    async function confirmCancel() {
        if (!orderId || cancelling) return;
        setCancelling(true);
        setCancelError('');
        try {
            const cancelled = await cancelCustomerOrder(orderId);
            setDetail(cancelled);
            setPayment(null);
            setQrIssuedAt(null);
            if (cancelMode === 'edit') {
                // Put the order's quantities back in the cart (not added on top of what is there).
                const cart = useCartStore.getState();
                for (const item of cancelled.items) {
                    const quantity = Number(item.quantity);
                    const existing = cart.items.find((entry) => entry.id === item.productId);
                    if (existing) {
                        cart.setQuantity(item.productId, quantity);
                    } else {
                        cart.addItem(
                            {
                                id: item.productId,
                                name: item.nameVi,
                                nameVi: item.nameVi,
                                nameEn: item.nameEn,
                                spec: item.unitCode,
                                unitPrice: Number(item.saleUnitPrice),
                            },
                            quantity,
                        );
                    }
                }
                navigate(ROUTES.QUOTES);
                return;
            }
            setCancelMode(null);
        } catch (error) {
            const status = isAxiosError(error) ? error.response?.status : undefined;
            setCancelError(
                status === 409
                    ? 'Không thể hủy: đơn đã được thanh toán hoặc không còn ở trạng thái chờ thanh toán. Vui lòng tải lại trang.'
                    : 'Không hủy được đơn hàng. Vui lòng thử lại.',
            );
            if (status === 409) void getCustomerOrder(orderId).then(setDetail).catch(() => undefined);
        } finally {
            setCancelling(false);
        }
    }

    async function refreshPayment() {
        if (!payment || paymentLoading) return;
        setPaymentLoading(true);
        setPaymentError('');
        try {
            const result = await getBankPayment(payment.id);
            setPayment(result);
            if (result.status === 'SUCCESS' && orderId) setDetail(await getCustomerOrder(orderId));
        } catch {
            setPaymentError('Không kiểm tra được trạng thái thanh toán. Vui lòng thử lại.');
        } finally {
            setPaymentLoading(false);
        }
    }

    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-store-cream font-body text-store-ink"
            mainClassName="w-full flex-1 px-5 py-12"
        >
            <div className="mx-auto max-w-[1150px]">
                <PageNav back={{ label: 'Về lịch sử đơn hàng', to: ROUTES.ORDERS }} />
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
                                    Đơn hàng của {customerName}
                                </h1>
                                <p className="text-xs text-store-muted">
                                    Tạo lúc{' '}
                                    {new Date(detail.order.createdAt).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <OrderStatusBadge
                                status={detail.order.status}
                                paymentStatus={detail.order.paymentStatus}
                            />
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
                                                    {item.sku} · {item.quantity} {item.unitCode} · VAT {item.vatRate ?? '—'}%
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
                                        {paymentStatusLabel(detail.order.paymentStatus)}
                                    </p>
                                </section>
                                {['CONFIRMED', 'PROCESSING'].includes(detail.order.status) && detail.order.paymentStatus !== 'SUCCESS' && (
                                    <section className="rounded-xl border-2 border-store-ink bg-white p-5 text-sm">
                                        <h2 className="mt-0 text-lg font-bold">Thanh toán chuyển khoản</h2>
                                        {!payment && <button type="button" disabled={paymentLoading || openingPayment} onClick={() => void showPayment()} className="rounded bg-store-green px-4 py-2 font-bold text-white disabled:opacity-50">{paymentLoading || openingPayment ? 'Đang tải...' : 'Hiển thị mã QR'}</button>}
                                        {payment?.status === 'PENDING' && !payment.qrUrl && <p>Đơn không còn trong thời hạn thanh toán. Vui lòng kiểm tra lại đơn hàng.</p>}
                                        {payment?.status === 'PENDING' && payment.qrUrl && <div className="space-y-2">
                                            <div className="relative mx-auto w-full max-w-64">
                                                {!qrError ? <img src={payment.qrUrl} alt="Mã QR chuyển khoản" aria-hidden={qrExpired} className={`w-full transition-[filter,opacity] duration-300 ${qrExpired ? 'pointer-events-none select-none opacity-40 blur-sm' : ''}`} onError={() => setQrError(true)} /> : <p>Không tải được ảnh QR. Bạn có thể chuyển khoản bằng thông tin bên dưới.</p>}
                                                {qrExpired && (
                                                    <button type="button" disabled={paymentLoading} onClick={() => void showPayment()} className="absolute inset-0 m-auto flex size-28 flex-col items-center justify-center gap-1.5 rounded-full border-2 border-store-ink bg-white text-xs font-bold text-store-ink shadow-lg transition-transform hover:scale-105 disabled:opacity-60" aria-label="Mã QR đã hết hạn. Tạo mã mới">
                                                        <RotateCw size={26} aria-hidden="true" className={paymentLoading ? 'animate-spin' : ''} />
                                                        {paymentLoading ? 'Đang tạo...' : 'Tạo mã mới'}
                                                    </button>
                                                )}
                                            </div>
                                            <p role="timer" aria-live="off" className={`text-center text-xs font-bold ${qrExpired ? 'text-red-700' : 'text-store-muted'}`}>
                                                {qrExpired ? 'Mã QR đã hết hạn. Bấm vào biểu tượng để tạo mã mới.' : `Mã QR hết hạn sau ${qrCountdown}`}
                                            </p>
                                            <div className={qrExpired ? 'pointer-events-none select-none opacity-40 blur-[2px]' : ''} aria-hidden={qrExpired}>
                                                <p>Ngân hàng: <strong>{payment.bank}</strong></p>
                                                <p>Số tài khoản: <strong>{payment.virtualAccount}</strong></p>
                                                <p>Số tiền: <strong>{money(payment.amount)}</strong></p>
                                                <p>Nội dung: <strong>{payment.paymentCode}</strong></p>
                                                <p className="text-store-muted">Giữ nguyên số tiền và nội dung chuyển khoản để hệ thống đối chiếu.</p>
                                            </div>
                                            <button type="button" disabled={paymentLoading} onClick={() => void refreshPayment()} className="w-full cursor-pointer rounded border border-store-ink bg-white px-4 py-2 font-semibold transition-colors hover:bg-store-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-store-ink">{paymentLoading ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}</button>
                                        </div>}
                                        {payment && payment.status !== 'PENDING' && <p>Trạng thái: {payment.status === 'SUCCESS' ? 'Thanh toán thành công' : payment.status}</p>}
                                        {paymentError && <p role="alert" className="mt-3 text-red-700">{paymentError}</p>}
                                        {detail.order.status === 'CONFIRMED' && (
                                            <div className="mt-4 space-y-2 border-t border-store-line pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCancelError('');
                                                        setCancelMode('edit');
                                                    }}
                                                    className="w-full rounded border border-store-ink bg-white px-4 py-2 font-semibold text-store-ink hover:bg-store-cream"
                                                >
                                                    Chỉnh sửa đơn hàng
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCancelError('');
                                                        setCancelMode('cancel');
                                                    }}
                                                    className="w-full rounded border border-red-300 bg-white px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
                                                >
                                                    Hủy đơn hàng
                                                </button>
                                                <p className="mb-0 text-xs text-store-muted">
                                                    Chỉ thực hiện được khi đơn chưa thanh toán. Hàng đang giữ sẽ được trả lại kho.
                                                </p>
                                            </div>
                                        )}
                                    </section>
                                )}
                                {detail.order.paymentStatus === 'SUCCESS' && (
                                    <section role="status" className="rounded-xl border-2 border-store-green bg-green-50 p-5 text-sm">
                                        <h2 className="mt-0 text-lg font-bold text-store-green">Đã thanh toán</h2>
                                        <p className="mb-0">SePay đã xác nhận giao dịch. Đơn hàng sẽ được chuyển cho bộ phận giao hàng.</p>
                                    </section>
                                )}
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
            <ConfirmModal
                open={cancelMode !== null}
                danger={cancelMode === 'cancel'}
                title={cancelMode === 'edit' ? 'Chỉnh sửa đơn hàng?' : 'Hủy đơn hàng?'}
                message={
                    cancelMode === 'edit'
                        ? 'Để thêm bớt sản phẩm, đơn hiện tại sẽ được hủy (mã QR này không còn dùng được, hàng đang giữ trả lại kho) và các sản phẩm được đưa lại vào giỏ hàng. Bạn sẽ tạo lại gói giao hàng và đặt đơn mới; giá và ưu đãi được tính lại theo thời điểm đặt.'
                        : 'Đơn sẽ chuyển sang Đã hủy, mã QR thanh toán không còn dùng được và hàng đang giữ được trả lại kho. Thao tác này không hoàn tác được.'
                }
                confirmLabel={
                    cancelling
                        ? 'Đang xử lý...'
                        : cancelMode === 'edit'
                          ? 'Đưa về giỏ hàng'
                          : 'Hủy đơn hàng'
                }
                cancelLabel="Giữ đơn"
                busy={cancelling}
                error={cancelError}
                onConfirm={() => void confirmCancel()}
                onCancel={() => !cancelling && setCancelMode(null)}
            />
        </StorefrontLayout>
    );
}
