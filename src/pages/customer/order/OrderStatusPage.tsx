import { Link, useParams } from 'react-router-dom';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { useAuthStore } from '@/store/admin/authStore';
import { ROUTES } from '@/router/routes';
import { formatDate } from '@/components/customer/checkout/checkoutData';
import { getOrders, STATUS_META, formatVnd, formatOrderTime, type OrderStatus } from '@/components/customer/order/orderData';

const STEPS = [
    { label: 'Đơn hàng đã được xác nhận', detail: 'Yêu cầu đặt hàng đã được xác nhận để chuẩn bị.' },
    { label: 'Đang chuẩn bị hàng', detail: 'Nhà cung cấp đang đóng gói nguyên liệu cho từng điểm giao.' },
    { label: 'Đang giao hàng', detail: 'Đơn hàng đang được vận chuyển đến địa điểm nhận.' },
    { label: 'Giao hàng thành công', detail: 'Người nhận đã kiểm tra và nhận hàng.' },
];

function activeStep(status: OrderStatus) {
    if (status === 'pending' || status === 'cancelled') return -1;
    if (status === 'preparing') return 1;
    if (status === 'shipping') return 2;
    return 3;
}

export default function OrderStatusPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const customerId = useAuthStore(state => state.session?.user.id ?? '');
    const order = getOrders(customerId).find(value => value.id === orderId);

    if (!order) {
        return (
            <StorefrontLayout rootClassName="flex min-h-screen flex-col bg-store-cream font-body text-store-ink" mainClassName="flex-1 px-5 py-20">
                <div className="mx-auto max-w-xl border border-solid border-store-ink bg-white p-10 text-center shadow-[4px_4px_0_#14132b]">
                    <h1 className="m-0 font-heading text-3xl">Không tìm thấy đơn hàng</h1>
                    <p className="my-5 text-sm text-store-muted">Đơn không tồn tại, hoặc phiên lưu đơn demo đã kết thúc.</p>
                    <Link to={ROUTES.ORDERS} className="inline-block bg-store-green px-5 py-3 text-xs font-bold text-white no-underline">Về lịch sử đơn hàng</Link>
                </div>
            </StorefrontLayout>
        );
    }

    const currentStep = activeStep(order.status);
    const meta = STATUS_META[order.status];
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const firstPackage = order.packages[0];

    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-store-cream font-body text-store-ink"
            mainClassName="w-full flex-1 px-4 pb-20 pt-8 sm:px-6 lg:pt-12"
        >
            <div className="mx-auto max-w-[1150px]">
                <Link to={ROUTES.ORDERS} className="mb-7 inline-flex items-center gap-2 text-[11px] font-bold text-store-green no-underline hover:underline">
                    <img src="/images/ui/orders/back.svg" width={16} height={16} alt="" /> Quay lại lịch sử đơn hàng
                </Link>
                <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="m-0 text-[10px] font-extrabold tracking-widest text-store-coral">ĐƠN HÀNG #{order.id}</p>
                        <h1 className="m-0 mt-1 font-heading text-[35px] leading-tight tracking-[-.04em] sm:text-[48px] lg:text-[59px]">
                            Theo dõi <em className="text-store-coral">đơn hàng</em>
                        </h1>
                        <p className="m-0 mt-2 text-xs text-store-muted">Cập nhật tiến trình chuẩn bị và giao nguyên liệu cho từng chi nhánh.</p>
                    </div>
                    <span className="rotate-2 border-2 border-solid border-store-ink bg-store-yellow px-4 py-2.5 text-[10px] font-black uppercase shadow-[4px_4px_0_#14132b]">{meta.label}</span>
                </header>
                <div className="mb-5 flex items-start gap-2 border border-solid border-amber-200 bg-[#fff9e8] p-3 text-[11px] leading-5 text-[#725927]">
                    <img src="/images/ui/orders/info.svg" alt="" width={16} height={16} className="mt-0.5 size-4 shrink-0" />
                    Thông tin đơn hàng và tiến trình vận chuyển dưới đây chỉ mô phỏng giao diện; không có xác nhận thanh toán hoặc giao nhận thực tế.
                </div>
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(290px,1fr)] lg:gap-8">
                    <div className="grid min-w-0 gap-6">
                        <section className="flex flex-wrap items-center gap-4 border-[1.5px] border-solid border-store-ink bg-store-green p-4 text-white shadow-[5px_5px_0_#14132b] sm:p-5">
                            <span className="grid size-11 shrink-0 -rotate-6 place-items-center rounded-lg border border-solid border-store-ink bg-store-yellow">
                                <img src="/images/ui/orders/truck.svg" alt="" width={23} height={23} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="m-0 text-[9px] font-extrabold tracking-widest text-white/80">THỜI GIAN GIAO HÀNG DỰ KIẾN</p>
                                <h2 className="m-0 mt-1 font-heading text-[18px] leading-tight sm:text-[22px]">
                                    {firstPackage ? `${formatDate(firstPackage.date)} · ${firstPackage.timeSlot}` : 'Đang cập nhật'}
                                </h2>
                                <p className="m-0 mt-1 text-[10px] leading-5 text-white/75">Theo khung giờ đã chọn ở từng điểm nhận hàng.</p>
                            </div>
                            <div className="border-0 border-l border-dashed border-white/30 pl-4 text-center">
                                <strong className="block font-heading text-2xl text-store-yellow">{order.packages.length}</strong>
                                <span className="text-[10px]">điểm giao</span>
                            </div>
                        </section>
                        <section className="border-[1.5px] border-solid border-store-ink bg-[#fffdfa] p-4 shadow-[5px_5px_0_#14132b] sm:p-6">
                            <div className="mb-7 flex items-center gap-3">
                                <span className="grid size-11 -rotate-6 place-items-center rounded-lg border border-solid border-store-ink bg-store-pink">
                                    <img src="/images/ui/orders/truck.svg" alt="" width={20} height={20} />
                                </span>
                                <div>
                                    <p className="m-0 text-[9px] font-black tracking-widest text-store-coral">TRẠNG THÁI VẬN CHUYỂN</p>
                                    <h2 className="m-0 mt-1 font-heading text-[23px] leading-tight">Hành trình đơn hàng</h2>
                                </div>
                            </div>
                            {order.status === 'cancelled' ? (
                                <p className="m-0 border border-solid border-rose-300 bg-rose-50 p-4 text-xs text-rose-700">Đơn hàng đã bị hủy trong dữ liệu mẫu.</p>
                            ) : (
                                <>
                                    {order.status === 'pending' && <p className="mb-5 mt-0 border border-solid border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Đã gửi bản xem trước, đang chờ xác nhận (demo).</p>}
                                    <div className="grid grid-cols-4 gap-1 border-0 border-b border-dashed border-store-ink/20 pb-6 text-center">
                                        {STEPS.map((step, i) => (
                                            <div key={step.label} className="flex min-w-0 flex-col items-center gap-2">
                                                <span className={`grid size-9 place-items-center rounded-full border border-solid text-[10px] font-black sm:size-10 ${i < currentStep
                                                        ? 'border-store-green bg-store-green text-white'
                                                        : i === currentStep
                                                            ? 'border-store-coral bg-store-coral text-white'
                                                            : 'border-store-ink/40 bg-[#e9e8f0] text-store-ink'
                                                    }`}>
                                                    {i < currentStep
                                                        ? <img src="/images/ui/orders/check.svg" width={17} height={17} alt="" className="brightness-0 invert" />
                                                        : String(i + 1).padStart(2, '0')}
                                                </span>
                                                <strong className={`text-[9px] leading-4 sm:text-[10px] ${i === currentStep ? 'text-store-coral' : ''}`}>{step.label}</strong>
                                                <small className="text-[9px] text-store-muted">{i < currentStep ? 'Hoàn tất' : i === currentStep ? 'Đang thực hiện' : 'Sắp tới'}</small>
                                            </div>
                                        ))}
                                    </div>
                                    <ol className="m-0 mt-6 list-none space-y-5 p-0">
                                        {STEPS.map((step, i) => (
                                            <li key={step.label} className="flex items-start gap-3">
                                                <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-solid ${i < currentStep ? 'border-store-green bg-store-green' : i === currentStep ? 'border-store-coral bg-store-coral' : 'border-store-ink bg-white'
                                                    }`}>
                                                    {i < currentStep && <img src="/images/ui/orders/check.svg" alt="" width={10} height={10} className="brightness-0 invert" />}
                                                </span>
                                                <div>
                                                    <p className={`m-0 text-[9px] font-bold ${i === currentStep ? 'text-store-coral' : 'text-store-muted'}`}>{i < currentStep ? 'Đã hoàn tất' : i === currentStep ? 'Đang cập nhật' : 'Sắp tới'}</p>
                                                    <h3 className="m-0 mt-0.5 font-body text-xs font-extrabold">{step.label}</h3>
                                                    <p className="m-0 mt-1 text-[10px] leading-5 text-store-muted">{step.detail}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </>
                            )}
                        </section>
                        <section className="border-[1.5px] border-solid border-store-ink bg-[#fffdfa] p-4 shadow-[5px_5px_0_#14132b] sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="grid size-11 -rotate-6 place-items-center rounded-lg border border-solid border-store-ink bg-store-yellow">
                                    <img src="/images/ui/orders/box.svg" alt="" width={20} height={20} />
                                </span>
                                <div>
                                    <p className="m-0 text-[9px] font-black tracking-widest text-store-coral">DELIVERY PACKAGES</p>
                                    <h2 className="m-0 mt-1 font-heading text-[23px] leading-tight">Chi tiết từng điểm giao</h2>
                                </div>
                            </div>
                            <div className="grid gap-3">
                                {order.packages.map((pack, index) => {
                                    const products = order.items.filter(item => order.assignments[item.id] === pack.id);
                                    return (
                                        <article key={pack.id} className="border border-solid border-store-ink/60 p-4">
                                            <div className="flex flex-wrap items-center gap-3 border-0 border-b border-dashed border-store-ink/20 pb-3">
                                                <span className="grid size-10 -rotate-6 place-items-center bg-store-green font-heading text-sm text-store-yellow">{String(index + 1).padStart(2, '0')}</span>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="m-0 font-heading text-[16px] font-bold">{pack.branchName}</h3>
                                                    <p className="m-0 mt-1 flex items-start gap-1 text-[10px] text-store-muted"><img src="/images/ui/orders/pin.svg" alt="" width={13} height={13} />{pack.address}</p>
                                                </div>
                                                <span className="bg-emerald-50 px-2 py-1 text-[10px] font-bold text-store-green">{products.reduce((sum, item) => sum + item.quantity, 0)} món</span>
                                            </div>
                                            <div className="mt-3 grid gap-2 text-[11px] sm:grid-cols-[80px_minmax(0,1fr)]">
                                                <strong className="text-[9px] font-black tracking-wide text-store-coral">NGƯỜI NHẬN</strong>
                                                <span>{pack.receiver} · {pack.phone}</span>
                                                <strong className="text-[9px] font-black tracking-wide text-store-coral">KHUNG GIỜ</strong>
                                                <span>{formatDate(pack.date)} · {pack.timeSlot}</span>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-1.5 border-0 border-t border-dashed border-store-ink/20 pt-3">
                                                {products.length ? products.map(item => (
                                                    <span key={item.id} className="bg-[#eeebfa] px-2 py-1 text-[10px]">{item.quantity} × {item.name}</span>
                                                )) : <span className="text-[10px] text-store-muted">Không có sản phẩm trong gói này</span>}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                    <aside className="grid min-w-0 gap-6">
                        <section className="relative border-[1.5px] border-solid border-store-ink bg-store-ink p-5 text-white shadow-[5px_5px_0_#ff5a4e] sm:p-6">
                            <span className="absolute -top-3 left-10 -rotate-3 bg-store-yellow px-3 py-1.5 text-[9px] font-black text-store-ink">MÃ THEO DÕI</span>
                            <p className="m-0 mt-1 text-[9px] font-extrabold tracking-wider text-store-pink">TRACKING CODE</p>
                            <h2 className="m-0 mt-2 break-all font-heading text-[24px] font-bold text-store-yellow">{order.id}</h2>
                            <p className="m-0 mt-2 text-[10px] text-[#c9c6d7]">Tạo lúc {formatOrderTime(order.createdAt)}</p>
                            <dl className="my-5 space-y-3 border-0 border-y border-solid border-white/20 py-4 text-[11px]">
                                <div className="flex items-center justify-between gap-3"><dt>Tổng mặt hàng</dt><dd className="m-0 font-extrabold">{totalItems}</dd></div>
                                <div className="flex items-center justify-between gap-3"><dt>Delivery packages</dt><dd className="m-0 font-extrabold">{order.packages.length}</dd></div>
                                <div className="flex items-center justify-between gap-3"><dt>Phí giao (demo)</dt><dd className="m-0 font-extrabold">{formatVnd(order.shipping)}</dd></div>
                                {order.discount > 0 && <div className="flex items-center justify-between gap-3"><dt>Giảm giá</dt><dd className="m-0 font-extrabold">−{formatVnd(order.discount)}</dd></div>}
                            </dl>
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <strong className="text-[10px]">Tổng thanh toán (demo)</strong>
                                <strong className="font-heading text-[24px] text-store-yellow">{formatVnd(order.total)}</strong>
                            </div>
                        </section>
                        <section className="border-[1.5px] border-solid border-store-ink bg-[#fffdfa] p-4 shadow-[5px_5px_0_#14132b]">
                            <div className="flex items-start gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-solid border-store-ink bg-store-pink">
                                    <img src="/images/ui/orders/help.svg" alt="" width={21} height={21} />
                                </span>
                                <div><h3 className="m-0 font-body text-xs font-extrabold">Cần hỗ trợ đơn hàng?</h3><p className="m-0 mt-2 text-[10px] leading-5 text-store-muted">Tính năng điều phối và hỗ trợ đang chờ tích hợp Backend.</p></div>
                            </div>
                            <Link to={ROUTES.ORDERS} className="mt-4 block bg-store-green px-3 py-3 text-center text-[11px] font-bold text-white no-underline">Quay về lịch sử đơn hàng</Link>
                        </section>
                    </aside>
                </div>
            </div>
        </StorefrontLayout>
    );
}
