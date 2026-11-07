import { Link } from 'react-router-dom';
import {
    STATUS_META, formatOrderTime, formatVnd, orderDetailPath,
    type OrderRecord,
} from './orderData';

type Props = { order: OrderRecord; index: number; onTrack: (order: OrderRecord) => void };

export default function OrderCard({ order, index, onTrack }: Props) {
    const meta = STATUS_META[order.status];
    return (
        <article className={`grid grid-cols-[38px_minmax(0,1fr)] gap-3 border-[1.5px] border-l-[5px] border-solid border-store-ink bg-[#fffcf7] p-3 shadow-[4px_4px_0_#14132b] sm:grid-cols-[45px_minmax(0,1fr)_120px] sm:gap-4 sm:p-4 lg:grid-cols-[52px_minmax(0,1fr)_144px] ${meta.accent}`}>
            <span className="font-heading text-[27px] font-bold leading-none text-store-green lg:text-[32px]">
                {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 border-0 border-b border-dashed border-[#ead3bc] pb-2">
                    <div>
                        <h2 className="m-0 font-heading text-sm font-bold text-store-ink">#{order.id}</h2>
                        <p className="m-0 mt-1 font-body text-[10px] text-[#666174]">{formatOrderTime(order.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-bold ${meta.tag}`}>
                        <img
                            src={order.status === 'delivered' ? '/images/ui/orders/check.svg' : '/images/ui/orders/clock.svg'}
                            alt="" width={12} height={12} className="h-3 w-3"
                        />
                        {meta.label}
                    </span>
                </div>
                <div className="flex flex-wrap gap-3 pt-3">
                    {order.items.slice(0, 2).map(item => (
                        <div key={item.id} className="flex min-w-0 items-center gap-2">
                            <div aria-hidden="true" className="h-10 w-10 shrink-0 border border-solid border-[#bcb4b2] bg-[#f1e8d9]" />
                            <div className="max-w-[160px] min-w-0">
                                <p className="m-0 text-[11px] font-extrabold leading-snug text-store-ink">
                                    {item.name} <span className="text-store-coral">×{item.quantity}</span>
                                </p>
                                <p className="m-0 mt-0.5 text-[10px] leading-snug text-[#757080]">{item.description}</p>
                            </div>
                        </div>
                    ))}
                    {order.items.length > 2 && (
                        <span className="text-[10px] text-store-muted">+{order.items.length - 2} món</span>
                    )}
                </div>
            </div>
            <div className="col-start-2 flex min-w-0 flex-wrap items-center justify-between gap-2 border-0 border-t border-dashed border-[#ead3bc] pt-3 sm:col-start-auto sm:flex-col sm:items-start sm:justify-between sm:border-t-0 sm:border-l sm:pl-3 sm:pt-0">
                <div>
                    <p className="m-0 text-[9px] font-extrabold tracking-widest">TỔNG CỘNG</p>
                    <strong className="mt-1 block font-heading text-[18px] font-bold text-store-coral lg:text-xl">{formatVnd(order.total)}</strong>
                </div>
                {order.status === 'shipping' ? (
                    <button
                        type="button" onClick={() => onTrack(order)}
                        className="inline-flex cursor-pointer items-center gap-2 border-0 border-b border-solid border-store-ink bg-transparent p-0 pb-1 text-[11px] font-extrabold text-store-ink hover:text-store-coral"
                    >
                        Theo dõi đơn <img src="/images/ui/orders/arrow.svg" width={14} height={14} alt="" />
                    </button>
                ) : (
                    <Link
                        to={orderDetailPath(order.id)}
                        className="inline-flex items-center gap-2 border-0 border-b border-solid border-store-ink pb-1 text-[11px] font-extrabold text-store-ink no-underline hover:text-store-coral"
                    >
                        Xem chi tiết <img src="/images/ui/orders/arrow.svg" width={14} height={14} alt="" />
                    </Link>
                )}
            </div>
        </article>
    );
}
