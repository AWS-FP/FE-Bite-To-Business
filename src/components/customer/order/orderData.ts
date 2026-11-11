/** Dữ liệu demo hiển thị Orders; không phải lịch sử giao dịch của Backend. */
import type { DeliveryPackage } from '@/components/customer/checkout/checkoutData';

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
export const formatOrderTime = (iso: string) => new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
}).format(new Date(iso));
export const orderDetailPath = (id: string) => `/orders/${encodeURIComponent(id)}`;

const branch: DeliveryPackage = {
    id: 'demo-branch',
    branchName: 'Chi nhánh trung tâm',
    receiver: 'Nguyễn Văn A',
    phone: '0900 000 000',
    address: 'Địa chỉ giao hàng minh họa, TP. Hồ Chí Minh',
    date: '2026-11-06',
    timeSlot: '08:00 - 11:00',
};

function demoOrder(
    id: string,
    createdAt: string,
    status: OrderStatus,
    product: OrderLine[],
): OrderRecord {
    const subtotal = product.reduce((sum, item) => sum + item.price, 0);
    return {
        id, createdAt, status, items: product, packages: [branch],
        assignments: Object.fromEntries(product.map(item => [item.id, branch.id])),
        paymentMethod: 'bank', subtotal, shipping: 0, discount: 0, total: subtotal,
        ...(status === 'shipping' ? { courier: { name: 'Minh (demo)', phone: '0900 000 000' } } : {}),
    };
}

export const SAMPLE_ORDERS: OrderRecord[] = [
    demoOrder('DEMO-20265-008', '2026-11-02T10:32:00+07:00', 'shipping', [
        { id: 's1', name: 'Bộ 4 Bánh Mì Kẹp', description: 'Gà xé · Phô mai · Rau củ', quantity: 1, price: 156000 },
        { id: 's2', name: 'Cold Brew Cam', description: '1 chai gói · 500ml', quantity: 2, price: 92000 },
    ]),
    demoOrder('DEMO-20262-004', '2026-10-30T14:18:00+07:00', 'preparing', [
        { id: 's3', name: 'Set Trưa Văn Phòng', description: '12:00 - 13:00 · 2 phần', quantity: 1, price: 179000 },
    ]),
    demoOrder('DEMO-20618-021', '2026-10-26T09:04:00+07:00', 'delivered', [
        { id: 's4', name: 'Combo Năng Lượng', description: 'Bánh sáng bò · Cà phê sữa', quantity: 1, price: 89000 },
        { id: 's5', name: 'Nước ép Cam Cà Rốt', description: 'Không thêm đường', quantity: 1, price: 57000 },
    ]),
    demoOrder('DEMO-20615-012', '2026-10-20T16:45:00+07:00', 'pending', [
        { id: 's6', name: 'Bánh Kem Sinh Nhật Mini', description: 'Vani dâu · Size S', quantity: 1, price: 320000 },
    ]),
    demoOrder('DEMO-20612-009', '2026-10-12T11:10:00+07:00', 'cancelled', [
        { id: 's7', name: 'Bộ Salad Tươi', description: 'Sốt mè rang · 2 phần', quantity: 1, price: 138000 },
    ]),
];

const storageKey = (customerId: string) => `btb.order-previews.${customerId}`;

export function readPreviewOrders(customerId: string): OrderRecord[] {
    try {
        const parsed: unknown = JSON.parse(sessionStorage.getItem(storageKey(customerId)) ?? '[]');
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item): item is OrderRecord =>
            item !== null && typeof item === 'object' &&
            typeof item.id === 'string' && Array.isArray(item.items) &&
            Array.isArray(item.packages) && typeof item.total === 'number'
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

