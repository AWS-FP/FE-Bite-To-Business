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
    invoiceSameAsDelivery: true,
    invoicePurchaser: '',
    invoiceTaxCode: '',
    invoiceEmail: '',
    invoiceAddress: '',
};

// Mỗi bước chỉ kiểm tra các ô của chính bước đó, không bắt điền form chưa hiển thị.
export const REGISTRATION_STEP_FIELDS: (keyof RegisterRequest)[][] = [
    ['lastName', 'firstName', 'email', 'phone', 'customerType'],
    ['businessName', 'province', 'ward', 'deliveryAddress', 'deliveryNote'],
    [
        'invoicePurchaser',
        'invoiceTaxCode',
        'invoiceEmail',
        'invoiceSameAsDelivery',
        'invoiceAddress',
    ],
];
