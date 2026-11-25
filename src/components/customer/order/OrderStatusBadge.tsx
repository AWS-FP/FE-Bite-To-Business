import { orderDisplayStatus, type OrderStatusTone } from '@/utils/orderStatus';

const tones: Record<OrderStatusTone, string> = {
    pending: 'border-[#f0c75e] bg-[#fff6dc] text-[#8a5a00]',
    paid: 'border-[#9fd3b0] bg-[#e7f5ec] text-store-green',
    processing: 'border-[#a9c4f5] bg-[#eaf1fe] text-[#1d4ed8]',
    done: 'border-store-green bg-store-green text-white',
    cancelled: 'border-[#f2b8b0] bg-[#fdecea] text-[#b42318]',
};

const dots: Record<OrderStatusTone, string> = {
    pending: 'bg-[#e0a100]',
    paid: 'bg-store-green',
    processing: 'bg-[#1d4ed8]',
    done: 'bg-white',
    cancelled: 'bg-[#b42318]',
};

/** One pill for the customer: order status combined with payment status. */
export default function OrderStatusBadge({
    status,
    paymentStatus,
    size = 'md',
}: {
    status: string;
    paymentStatus: string | null | undefined;
    size?: 'sm' | 'md';
}) {
    const { label, tone } = orderDisplayStatus(status, paymentStatus);
    return (
        <span
            className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border font-bold ${tones[tone]} ${size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'}`}
        >
            <span aria-hidden="true" className={`size-2 rounded-full ${dots[tone]}`} />
            {label}
        </span>
    );
}
