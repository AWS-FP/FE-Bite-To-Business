import type { AuthUser, CustomerType, RegistrationStatus } from '@/types/admin/auth';

// POST /api/admin/registration-requests/:id/review.
// decision là APPROVE/REJECT, khác status APPROVED/REJECTED trả về từ BE.
export interface ReviewRegistrationRequest {
    decision: 'APPROVE' | 'REJECT';
    // Bắt buộc có nội dung khi REJECT; BE kiểm tra quy tắc này trong service.
    note?: string | null;
}

// Hồ sơ đầy đủ để Admin xem; các trường profile có thể null theo schema dùng chung.
export interface RegistrationResponse {
    id: string;
    customer: AuthUser;
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
    status: RegistrationStatus;
    reviewNote: string | null;
    submittedAt: string;
    reviewedAt: string | null;
    otpSentAt: string | null;
    otpDeliveryState: 'QUEUED' | 'SENT' | 'FAILED' | 'UNCONFIRMED' | 'VERIFIED' | null;
    otpResendAvailableAt: string | null;
    activatedAt: string | null;
}

export interface RegistrationReviewResponse {
    registration: RegistrationResponse;
    // OTP được gửi nền; đọc otpDeliveryState để biết trạng thái thực tế.
    otpSent: boolean;
    rejectionEmailSent: boolean;
}

// GET danh sách: page bắt đầu từ 0; size từ 1 đến 100.
export interface RegistrationListParams {
    status?: RegistrationStatus;
    page?: number;
    size?: number;
    allStatuses?: boolean;
    keyword?: string;
    customerType?: CustomerType;
    direction?: 'ASC' | 'DESC';
}

export interface RegistrationStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}
