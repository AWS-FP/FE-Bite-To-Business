import type { RefundStatus } from '@/types/customer/refund';

export const REFUND_STATUS_LABELS: Record<RefundStatus, string> = {
    REQUESTED: 'Chờ duyệt hủy',
    APPROVED: 'Đã duyệt, chờ hoàn tiền',
    REJECTED: 'Bị từ chối',
    PROCESSING: 'Đang hoàn tiền',
    REFUNDED: 'Đã hoàn tiền',
};

// Yêu cầu còn hiệu lực thì không gửi lại được cho cùng package.
export const ACTIVE_REFUND_STATUSES: RefundStatus[] = ['REQUESTED', 'APPROVED', 'PROCESSING', 'REFUNDED'];

export const REFUND_REASON_MAX = 1000;
