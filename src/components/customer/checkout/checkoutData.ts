/** Dữ liệu minh họa để dựng UI theo Figma; không phải sản phẩm/giá từ Backend. */
export type CheckoutItem = {
    id: string;
    name: string;
    sku: string;
    pack: string;
    quantity: number;
    price: number; // Giá của cả dòng sản phẩm, VND
    art: 'meat' | 'tomato' | 'sauce' | 'oil' | 'rice';
};

export type DeliveryPackage = {
    id: string;
    branchName: string;
    receiver: string;
    phone: string;
    address: string;
    date: string;
    timeSlot: string;
};

export type DeliveryDraft = Omit<DeliveryPackage, 'id'>;

export type PaymentMethod = 'momo' | 'card' | 'bank';

export const CHECKOUT_ITEMS: CheckoutItem[] = [
    { id: 'beef', name: 'Thăn ngoại bò Úc', sku: 'AUS-BEEF-STRIP-1KG', pack: '2 gói 1kg', quantity: 2, price: 916000, art: 'meat' },
    { id: 'tomato', name: 'Cà chua bi Đà Lạt', sku: 'DALAT-TOMATO-500G', pack: '4 hộp 500g', quantity: 4, price: 296000, art: 'tomato' },
    { id: 'sauce', name: 'Sốt tiêu đen Maison', sku: 'MDS-SAUCE-BLACKPEPPER', pack: '3 chai 250ml', quantity: 3, price: 387000, art: 'sauce' },
    { id: 'oil', name: 'Dầu olive Extra Virgin', sku: 'EVOO-ITALY-1L', pack: '2 chai 1L', quantity: 2, price: 638000, art: 'oil' },
    { id: 'rice', name: 'Gạo Basmati thượng hạng', sku: 'BASMATI-PREMIUM-5KG', pack: '1 bao 5kg', quantity: 1, price: 245000, art: 'rice' },
];

export const SHIPPING_PER_PACKAGE = 30000;
export const DEMO_COUPON = 'BITE50';
export const DEMO_DISCOUNT = 50000;

export function formatPrice(price: number) {
    return `${new Intl.NumberFormat('vi-VN').format(price)}đ`;
}

export function formatDate(date: string) {
    if (!date) return 'Chưa chọn ngày';
    const parts = date.split('-');
    if (parts.length !== 3) return date;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function validateDelivery(draft: DeliveryDraft): string | null {
    if (!draft.branchName.trim()) return 'Bạn cần nhập tên chi nhánh hoặc điểm giao.';
    if (!draft.receiver.trim()) return 'Bạn cần nhập tên người nhận.';
    if (!/^[0-9+().\s-]{9,18}$/.test(draft.phone.trim())) return 'Số điện thoại chưa hợp lệ.';
    if (draft.address.trim().length < 6) return 'Bạn cần nhập địa chỉ giao hàng đầy đủ hơn.';
    if (!draft.date) return 'Bạn cần chọn ngày giao.';
    if (!draft.timeSlot) return 'Bạn cần chọn khung giờ giao.';
    return null;
}

export const EMPTY_DELIVERY: DeliveryDraft = {
    branchName: '', receiver: '', phone: '', address: '', date: '', timeSlot: '08:00 - 11:00',
};
