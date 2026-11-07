export type CheckoutItem = {
    id: string;
    name: string;
    pack: string;
    quantity: number;
    price: number; // Giá của cả dòng sản phẩm, VND
    imageUrl?: string;
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
