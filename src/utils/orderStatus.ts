// Order status (fulfilment) and payment status are separate in the BE: an order stays CONFIRMED
// after SePay marks the payment SUCCESS, until delivery completes it. Customers see one combined state.

export type OrderStatusTone = 'pending' | 'paid' | 'processing' | 'done' | 'cancelled';

export function orderDisplayStatus(
    status: string,
    paymentStatus: string | null | undefined,
): { label: string; tone: OrderStatusTone } {
    if (status === 'CANCELLED') return { label: 'Đã hủy', tone: 'cancelled' };
    if (status === 'COMPLETED') return { label: 'Hoàn thành', tone: 'done' };
    if (paymentStatus === 'SUCCESS') {
        return status === 'PROCESSING'
            ? { label: 'Đang xử lý', tone: 'processing' }
            : { label: 'Đã thanh toán · Chờ giao', tone: 'paid' };
    }
    if (paymentStatus === 'EXPIRED') return { label: 'Hết hạn thanh toán', tone: 'cancelled' };
    return { label: 'Chờ thanh toán', tone: 'pending' };
}

const paymentLabels: Record<string, string> = {
    PENDING: 'Chờ thanh toán',
    SUCCESS: 'Đã thanh toán',
    EXPIRED: 'Hết hạn',
    FAILED: 'Thất bại',
    REFUNDED: 'Đã hoàn tiền',
};

export function paymentStatusLabel(paymentStatus: string | null | undefined) {
    if (!paymentStatus) return 'Chưa tạo thanh toán';
    return paymentLabels[paymentStatus] ?? paymentStatus;
}
