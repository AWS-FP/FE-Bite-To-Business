import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { orderDetailPath, type OrderRecord } from './orderData';

type Props = { order: OrderRecord; onClose: () => void };

/** Popup hành trình đơn đang giao: bản đồ / tài xế chỉ là minh họa. */
export default function TrackingModal({ order, onClose }: Props) {
    const closeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus();
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-store-ink/60 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
            onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}
        >
            <section role="dialog" aria-modal="true" aria-labelledby="tracking-title" className="relative my-6 w-full max-w-[850px] border-2 border-solid border-store-ink bg-store-cream shadow-[6px_6px_0_#14132b]">
                <button ref={closeRef} type="button" onClick={onClose} aria-label="Đóng theo dõi đơn" className="absolute right-3 top-3 z-10 grid size-9 cursor-pointer place-items-center rounded-full border-0 bg-store-ink sm:right-5 sm:top-5">
                    <img src="/images/ui/orders/x.svg" alt="" width={19} height={19} className="size-5 brightness-0 invert" />
                </button>
                <div className="grid sm:grid-cols-[35%_65%]">
                    <div className="bg-store-green px-5 py-7 text-white sm:px-7 sm:py-10">
                        <p className="m-0 flex items-center gap-2 text-[10px] font-bold tracking-wider">
                            <span className="grid size-6 place-items-center rounded-full bg-store-yellow text-[9px] text-store-ink">01</span>
                            THEO DÕI ĐƠN HÀNG
                        </p>
                        <h2 id="tracking-title" className="m-0 mt-7 font-heading text-[36px] leading-[1.1] sm:text-[44px]">
                            Đơn đang<br /><em className="text-store-pink">trên đường</em>
                        </h2>
                        <p className="m-0 mt-5 break-all text-[11px] leading-5 text-white/80">#{order.id}<br />Vị trí giao hàng sẽ hiển thị khi có kết nối vận chuyển.</p>
                    </div>
                    <div className="relative flex min-h-[225px] items-center justify-center overflow-hidden border-0 border-b-2 border-solid border-store-ink bg-[#d5e8d7] sm:min-h-[305px] sm:border-b-0">
                        <div aria-hidden="true" className="absolute -left-10 top-1/2 h-10 w-[120%] -rotate-[28deg] bg-[#f6e8d2]" />
                        <div aria-hidden="true" className="absolute -right-7 top-1/4 h-7 w-[110%] rotate-[26deg] bg-[#eaf4e5]" />
                        <div aria-hidden="true" className="absolute left-1/3 top-0 h-full w-6 rotate-[17deg] bg-[#f7e7c8]" />
                        <span className="absolute left-3 top-3 border border-solid border-store-ink bg-store-green px-3 py-1.5 text-[9px] font-black tracking-widest text-white">KHUNG BẢN ĐỒ · DEMO</span>
                        <div className="relative z-10 flex flex-col items-center gap-2 border border-dashed border-store-green/60 bg-[#f0f7ef]/90 p-5 text-center text-store-green">
                            <img src="/images/ui/orders/pin.svg" alt="" width={29} height={29} />
                            <strong className="text-sm">Chưa có bản đồ trực tiếp</strong>
                            <span className="text-[10px]">Vị trí tài xế và lộ trình sẽ kết nối sau</span>
                        </div>
                    </div>
                </div>
                <div className="p-5 sm:p-7">
                    <div className="flex flex-wrap items-center gap-3 border-0 border-b border-dashed border-[#d6c6b7] pb-5">
                        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-store-coral">
                            <img src="/images/ui/orders/truck.svg" alt="" width={23} height={23} className="brightness-0 invert" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="m-0 text-[9px] font-extrabold tracking-widest">TÀI XẾ ĐANG GIAO (DEMO)</p>
                            <p className="m-0 mt-1 text-xs font-bold">{order.courier?.name ?? 'Đang cập nhật'} · {order.courier?.phone ?? 'Chưa có liên hệ'}</p>
                        </div>
                        <span className="border border-solid border-store-ink bg-store-yellow px-3 py-2 text-[11px] font-extrabold text-store-ink shadow-[2px_2px_0_#14132b]" title="Số liên hệ chỉ là dữ liệu demo">
                            Liên hệ (demo)
                        </span>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-1 text-center text-[10px] font-bold">
                        {['Đã lấy hàng', 'Đang giao', 'Đã giao'].map((stage, index) => (
                            <div key={stage} className="flex flex-col items-center gap-3">
                                <span className={index < 2 ? 'text-store-coral' : 'text-store-ink'}>{stage}</span>
                                <span className={`size-3 rounded-full border border-solid border-store-coral ${index < 2 ? 'bg-store-coral' : 'bg-store-cream'}`} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 space-y-5">
                        <div className="flex gap-3">
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-store-green">
                                <img src="/images/ui/orders/check.svg" alt="" width={14} height={14} className="brightness-0 invert" />
                            </span>
                            <div><strong className="text-[12px]">Đơn đã được lấy hàng</strong><p className="m-0 mt-1 text-[11px] text-store-muted">Đơn hàng đang trong quá trình vận chuyển (minh họa).</p></div>
                        </div>
                        <div className="flex gap-3">
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-store-coral text-[10px] font-black text-white">2</span>
                            <div><strong className="text-[12px] text-store-coral">Đang trên đường đến bạn</strong><p className="m-0 mt-1 text-[11px] text-store-muted">Vui lòng chú ý điện thoại khi có tài xế liên hệ.</p></div>
                        </div>
                    </div>
                    <Link to={orderDetailPath(order.id)} onClick={onClose} className="mt-6 inline-flex items-center gap-2 border-0 border-b border-solid border-store-ink pb-1 text-xs font-extrabold text-store-ink no-underline">
                        Xem trang trạng thái đầy đủ <img src="/images/ui/orders/arrow.svg" alt="" width={16} height={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
