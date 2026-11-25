import axios from 'axios';
import i18n from 'i18next';
import type { ApiErrorResponse } from '@/types/api';

const messages: Record<string, readonly [string, string]> = {
    QUOTE_REVISION_CONFLICT: [
        'Báo giá đã thay đổi. Mở lại chi tiết để xem phiên bản mới.',
        'The quote has changed. Reopen it to review the latest version.',
    ],
    QUOTE_PRICING_STALE: [
        'Giá đã thay đổi. Hãy yêu cầu khách cập nhật báo giá.',
        'Prices have changed. Ask the customer to update the quote.',
    ],
    QUOTE_INCOMPLETE: [
        'Kiểm tra lại thông tin liên hệ, kiện giao hàng, hiệu lực và giá trị báo giá.',
        'Check the contact details, packages, expiry and quote total.',
    ],
    QUOTE_STOCK_UNAVAILABLE: [
        'Số lượng tồn kho hiện tại không đủ.',
        'There is insufficient stock.',
    ],
    PAYLOAD_TOO_LARGE: ['Vui lòng chọn ảnh tối đa 5 MB.', 'Choose an image up to 5 MB.'],
    UNSUPPORTED_MEDIA_TYPE: [
        'Không đọc được định dạng ảnh. Hãy xuất lại ảnh thành JPG, PNG hoặc WebP.',
        'The image format could not be read. Export it as JPG, PNG or WebP.',
    ],
};

export function executiveErrorMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) return fallback;
    const code = error.response?.data?.code;
    const message = code && messages[code];
    return message ? message[i18n.resolvedLanguage?.startsWith('en') ? 1 : 0] : fallback;
}
