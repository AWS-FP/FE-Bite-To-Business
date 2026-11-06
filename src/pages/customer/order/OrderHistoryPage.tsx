import { useState } from 'react';
import { Link } from 'react-router-dom';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/admin/authStore';
import OrderCard from '@/components/customer/order/OrderCard';
import TrackingModal from '@/components/customer/order/TrackingModal';
import { getOrders, ORDER_FILTERS, type OrderRecord, type OrderStatus } from '@/components/customer/order/orderData';

type Filter = 'all' | OrderStatus;

export default function OrderHistoryPage() {
    const customerId = useAuthStore(state => state.session?.user.id ?? '');
    const orders = getOrders(customerId);
    const [filter, setFilter] = useState<Filter>('all');
    const [tracking, setTracking] = useState<OrderRecord | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const visible = filter === 'all' ? orders : orders.filter(order => order.status === filter);

    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-store-cream font-body text-store-ink"
            mainClassName="w-full flex-1 px-4 pb-20 pt-10 sm:px-6 lg:pt-14"
            afterMain={tracking ? <TrackingModal order={tracking} onClose={() => setTracking(null)} /> : null}
        >
            <div className="mx-auto w-full max-w-[1150px]">
                <div className="mb-5 flex items-center gap-2 text-[11px] text-store-muted">
                    <Link to={ROUTES.HOME} className="text-store-green no-underline hover:underline">Trang chủ</Link>
                    <span>/</span><span>Lịch sử đơn hàng</span>
                </div>
                <div className="mb-9 flex items-center justify-between gap-4 sm:mb-12">
                    <div>
                        <p className="m-0 flex items-center gap-2 text-[10px] font-black tracking-[.18em]">
                            <span className="grid size-5 place-items-center rounded-full bg-store-green text-[8px] text-white">01</span>
                            TÀI KHOẢN CỦA BẠN
                        </p>
                        <h1 className="m-0 mt-4 font-heading text-[48px] leading-[.98] tracking-[-.05em] text-store-ink sm:text-[66px] lg:text-[80px]">
                            Lịch sử<br /><em className="text-store-coral">đặt hàng</em>
                        </h1>
                        <p className="m-0 mt-4 max-w-[390px] text-[12px] leading-6 text-store-ink">
                            Quản lý những đơn ngon lành của bạn, từ lúc đặt đến khi giao tận tay.
                        </p>
                    </div>
                    <div className="relative hidden w-[205px] shrink-0 rotate-2 border border-solid border-store-ink bg-store-yellow px-6 py-7 shadow-[5px_5px_0_#14132b] sm:block">
                        <span aria-hidden="true" className="absolute -top-3 left-11 h-5 w-24 -rotate-3 bg-store-pink/80" />
                        <p className="m-0 text-[10px] font-black tracking-widest">BẠN CÓ</p>
                        <div className="mt-2 flex items-center gap-2">
                            <strong className="font-heading text-[49px] leading-none">{String(orders.length).padStart(2, '0')}</strong>
                            <span className="text-[11px] font-bold leading-4">đơn hàng<br />trong phiên này</span>
                        </div>
                    </div>
                </div>
                <div className="mb-5 flex items-start gap-2 border border-solid border-amber-200 bg-[#fff9e8] p-3 text-[11px] leading-5 text-[#725927]">
                    <img src="/images/ui/orders/info.svg" alt="" width={16} height={16} className="mt-0.5 size-4 shrink-0" />
                    Các đơn DEMO và đơn vừa xác nhận từ Checkout đều là dữ liệu mô phỏng, chưa phát sinh đơn hàng hay thanh toán thật.
                </div>
                <div className="grid gap-7 md:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
                    <aside className="self-start border-[1.5px] border-solid border-store-ink bg-[#fffaf2] p-3 shadow-[4px_4px_0_#14132b]">
                        <div className="flex items-center justify-between gap-2 border-0 border-b border-solid border-store-ink px-1 pb-3">
                            <h2 className="m-0 text-[10px] font-black tracking-wider">TRẠNG THÁI ĐƠN</h2>
                            <button type="button" onClick={() => setFilter('all')} className="cursor-pointer border-0 bg-transparent p-0 text-[10px] underline">Xóa lọc</button>
                        </div>
                        <div role="group" aria-label="Lọc trạng thái đơn hàng" className="mt-2 flex flex-wrap gap-1 md:flex-col">
                            {ORDER_FILTERS.map(item => {
                                const count = item.value === 'all' ? orders.length : orders.filter(order => order.status === item.value).length;
                                return (
                                    <button
                                        type="button" key={item.value} aria-pressed={filter === item.value}
                                        onClick={() => setFilter(item.value)}
                                        className={`flex cursor-pointer items-center justify-between gap-3 border border-solid px-2.5 py-2.5 text-left text-[11px] font-bold transition-colors ${filter === item.value
                                                ? 'border-store-ink bg-store-pink shadow-[2px_2px_0_#14132b]'
                                                : 'border-transparent bg-transparent hover:bg-store-coral/10'
                                            }`}
                                    >
                                        {item.label}
                                        <span className="grid min-w-5 place-items-center rounded-full bg-store-ink/10 px-1 text-[10px]">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-7 -rotate-2 border border-solid border-store-ink bg-[#e8e6ff] p-3 shadow-[3px_3px_0_#14132b]">
                            <p className="m-0 font-heading text-3xl text-store-coral">?</p>
                            <h3 className="m-0 font-heading text-[17px] leading-6">Cần hỗ trợ<br />về đơn hàng?</h3>
                            <button type="button" onClick={() => setShowHelp(prev => !prev)} className="mt-3 cursor-pointer border-0 bg-transparent p-0 text-[11px] font-extrabold underline">
                                {showHelp ? 'Ẩn thông tin' : 'Liên hệ tụi mình'}
                            </button>
                            {showHelp && <p className="m-0 mt-3 text-[11px] leading-5">Kênh hỗ trợ đơn hàng đang được nhóm kết nối với Backend.</p>}
                        </div>
                    </aside>
                    <section aria-label="Danh sách đơn hàng" className="min-w-0">
                        <div className="mb-4 flex items-center justify-between border-0 border-b border-solid border-store-ink pb-3 text-[10px] font-extrabold tracking-wider">
                            <span>HIỂN THỊ {visible.length} ĐƠN HÀNG</span>
                            <span>Mới nhất ↓</span>
                        </div>
                        <div className="grid gap-4">
                            {visible.length === 0 ? (
                                <div className="border border-dashed border-store-ink bg-white/70 p-8 text-center text-sm">Chưa có đơn hàng ở trạng thái này.</div>
                            ) : visible.map((order, index) => (
                                <OrderCard key={order.id} order={order} index={index} onTrack={setTracking} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </StorefrontLayout>
    );
}
