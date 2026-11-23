import type { RegisterRequest } from '@/types/admin/auth';

export const DEFAULT_REGISTRATION: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    customerType: 'BUSINESS_COOPERATIVE',
    businessName: '',
    province: '',
    district: null,
    ward: '',
    deliveryAddress: '',
    deliveryNote: '',
    invoicePurchaser: '',
    invoiceTaxCode: '',
};

// Mỗi bước chỉ kiểm tra các ô của chính bước đó, không bắt điền form chưa hiển thị.
// Bước 2 gồm địa chỉ giao hàng và thông tin hóa đơn; hóa đơn luôn dùng địa chỉ giao hàng.
export const REGISTRATION_STEP_FIELDS: (keyof RegisterRequest)[][] = [
    ['lastName', 'firstName', 'email', 'phone', 'customerType'],
    [
        'businessName',
        'province',
        'ward',
        'deliveryAddress',
        'deliveryNote',
        'invoicePurchaser',
        'invoiceTaxCode',
    ],
];

export const REGISTRATION_STEP_COUNT = REGISTRATION_STEP_FIELDS.length;
