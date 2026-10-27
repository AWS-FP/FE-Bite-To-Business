export type UserRole =
    'ADMIN' | 'CUSTOMER' | 'ECOMMERCE_EXECUTIVE' | 'LOGISTICS_STAFF' | 'DELIVERY_STAFF';

// Giá trị enum giữ nguyên tên như BE; nhãn hiển thị VI/EN sẽ lấy từ i18n.
export type CustomerType = 'HOUSEHOLD_INDIVIDUAL_BUSINESS' | 'BUSINESS_COOPERATIVE';

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// POST /api/auth/register: chưa nhận password, confirmPassword hoặc role.
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    customerType: CustomerType;
    businessName: string;
    province: string;
    // Dia chi moi khong co quan/huyen; giu truong nay de doc du lieu cu.
    district: string | null;
    ward: string;
    deliveryAddress: string;
    deliveryNote?: string | null;
    invoiceSameAsDelivery: boolean;
    invoicePurchaser?: string | null;
    // MST là chuỗi để giữ đủ 10 chữ số, kể cả khi bắt đầu bằng 0.
    invoiceTaxCode?: string | null;
    invoiceEmail?: string | null;
    invoiceAddress?: string | null;
}

// UUID và Instant trong JSON được đọc thành string ở FE.
export interface RegistrationReceipt {
    id: string;
    status: RegistrationStatus;
    submittedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerifyOtpRequest {
    email: string;
    // Không dùng number: OTP có thể bắt đầu bằng 0.
    otp: string;
}

// Token này chỉ dùng POST /api/auth/activate, không lưu vào authStore như phiên login.
export interface OtpVerificationResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    passwordSetupRequired: boolean;
}

export interface SetPasswordRequest {
    password: string;
    confirmPassword: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// Khớp với UserResponse của BE; Guest là trạng thái chưa đăng nhập.
export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    emailVerified: boolean;
    avatarUrl: string | null;
}

// Chỉ lưu phiên sau khi đăng nhập bằng mật khẩu; token xác minh OTP được xử lý riêng.
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: AuthUser;
}
