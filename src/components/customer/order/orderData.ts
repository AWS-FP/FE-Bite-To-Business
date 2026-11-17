/** Dữ liệu demo hiển thị Orders; không phải lịch sử giao dịch của Backend. */

import { type DeliveryPackage } from '@/components/customer/checkout/checkoutData';
import { useCartStore } from '@/store/customer/cartStore';

// Checkout hiện tại chỉ mô phỏng chuyển khoản ngân hàng
type PaymentMethod = 'bank';

export type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';

export type OrderLine = {
    id: string;
    name: string;
    description: string;
    quantity: number;
    price: number; // Tổng thành tiền của dòng hàng, không phải đơn giá.
};

export type OrderRecord = {
    id: string;
    createdAt: string;
    status: OrderStatus;
    items: OrderLine[];
    packages: DeliveryPackage[];
    assignments: Record<string, string>;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    courier?: { name: string; phone: string };
    preview?: boolean;
};

export const STATUS_META: Record<OrderStatus, { label: string; tag: string; accent: string }> = {
    pending: {
        label: 'Chờ xác nhận',
        tag: 'bg-amber-100 text-amber-800',
        accent: 'border-l-orange-400',
    },
    preparing: {
        label: 'Chờ lấy hàng',
        tag: 'bg-yellow-100 text-amber-800',
        accent: 'border-l-amber-400',
    },
    shipping: {
        label: 'Đang giao',
        tag: 'bg-indigo-100 text-indigo-800',
        accent: 'border-l-store-green',
    },
    delivered: {
        label: 'Đã giao',
        tag: 'bg-emerald-100 text-emerald-800',
        accent: 'border-l-emerald-400',
    },
    cancelled: {
        label: 'Đã hủy',
        tag: 'bg-rose-100 text-rose-700',
        accent: 'border-l-store-coral',
    },
};

export const ORDER_FILTERS: { value: 'all' | OrderStatus; label: string }[] = [
    { value: 'all', label: 'Tất cả đơn hàng' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'preparing', label: 'Chờ lấy hàng' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
];

export const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')}đ`;
export const formatOrderTime = (iso: string) =>
    new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
export const orderDetailPath = (id: string) => `/orders/${encodeURIComponent(id)}`;

// Customer orders come from the real API; this legacy helper retains only session previews.
export const SAMPLE_ORDERS: OrderRecord[] = [];

const storageKey = (customerId: string) => `btb.order-previews.${customerId}`;

export function readPreviewOrders(customerId: string): OrderRecord[] {
    try {
        const parsed: unknown = JSON.parse(sessionStorage.getItem(storageKey(customerId)) ?? '[]');
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (item): item is OrderRecord =>
                item !== null &&
                typeof item === 'object' &&
                typeof item.id === 'string' &&
                Array.isArray(item.items) &&
                Array.isArray(item.packages) &&
                typeof item.total === 'number',
        );
    } catch {
        return [];
    }
}

export function getOrders(customerId: string): OrderRecord[] {
    return [...readPreviewOrders(customerId), ...SAMPLE_ORDERS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

/** Chỉ lưu bản xem trước UI trong sessionStorage, KHÔNG đặt hàng/thu tiền. */
export function saveCheckoutPreview(
    customerId: string,
    input: {
        packages: DeliveryPackage[];
        assignments: Record<string, string>;
        paymentMethod: PaymentMethod;
        couponApplied: boolean;
    },
): OrderRecord {
    const items: OrderLine[] = useCartStore.getState().items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.spec,
        quantity: item.quantity,
        price: item.quantity * item.unitPrice,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const shipping = 0; // Phí giao hàng chưa được tính trong checkout demo
    const discount = 0; // Preview cannot calculate unverified coupon discounts.
    const order: OrderRecord = {
        id: `UI-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        items,
        packages: input.packages.map((p) => ({ ...p })),
        assignments: { ...input.assignments },
        paymentMethod: input.paymentMethod,
        subtotal,
        shipping,
        discount,
        total: subtotal + shipping - discount,
        preview: true,
    };
    // Ném lỗi cho caller để không báo 'đã lưu' khi storage bị chặn.
    sessionStorage.setItem(
        storageKey(customerId),
        JSON.stringify([order, ...readPreviewOrders(customerId)].slice(0, 25)),
    );
    return order;
}
