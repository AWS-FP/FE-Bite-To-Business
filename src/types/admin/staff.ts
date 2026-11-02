export type StaffRole = 'ECOMMERCE_EXECUTIVE' | 'LOGISTICS_STAFF' | 'DELIVERY_STAFF';

export interface StaffAccount {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: StaffRole;
    emailVerified: boolean;
    banned: boolean;
    createdAt: string;
}

export interface CreateStaffRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: StaffRole;
    password: string;
    confirmPassword: string;
}

export interface StaffListParams {
    page: number;
    size: number;
    keyword?: string;
    role?: StaffRole;
}
