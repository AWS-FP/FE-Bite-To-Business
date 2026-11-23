import type { AuthUser, CustomerType } from '@/types/admin/auth';

export interface CustomerProfile {
    user: AuthUser;
    customerType: CustomerType | null;
    businessName: string | null;
    province: string | null;
    district: string | null;
    ward: string | null;
    deliveryAddress: string | null;
    fullDeliveryAddress: string | null;
    deliveryNote: string | null;
    invoicePurchaser: string | null;
    invoiceTaxCode: string | null;
    invoiceEmail: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateCustomerProfile {
    firstName: string;
    lastName: string;
    phone: string;
    avatarUrl: string | null;
    businessName: string;
    province: string;
    ward: string;
    deliveryAddress: string;
    deliveryNote: string | null;
    invoicePurchaser: string | null;
    invoiceTaxCode: string | null;
    invoiceEmail: string | null;
}
