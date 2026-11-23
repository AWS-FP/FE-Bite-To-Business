import axios from 'axios';
import { http } from '@/services/axiosClient';
import type { ApiErrorResponse } from '@/types/api';
import type { TranslationField, TranslationLanguage } from '@/types/logistic/translation';

type TranslateResponse = { translation: string; source: TranslationLanguage; target: TranslationLanguage };

/** Gợi ý bản dịch vi ↔ en cho ô song ngữ của sản phẩm (chỉ Logistics/E-commerce gọi được). */
export async function suggestTranslation(
    text: string,
    source: TranslationLanguage,
    field: TranslationField,
    signal?: AbortSignal,
): Promise<string> {
    const response = await http.post<{ data: TranslateResponse }>(
        '/api/ai/translate',
        { text, source, field },
        { signal },
    );
    return response.data.data.translation;
}

// Thông điệp BE trả về bằng tiếng Anh; FE ánh xạ theo ErrorCode của BE sang câu hiển thị (như authError/executiveError).
const translationErrorMessages: Record<string, string> = {
    AI_TRANSLATION_LIMIT_EXCEEDED: 'Bạn đã dùng hết lượt gợi ý dịch trong giờ này. Vui lòng thử lại sau.',
    AI_RATE_LIMIT_EXCEEDED: 'Bạn đã dùng hết lượt gợi ý dịch trong giờ này. Vui lòng thử lại sau.',
    TOO_MANY_REQUESTS: 'Bạn đã dùng hết lượt gợi ý dịch trong giờ này. Vui lòng thử lại sau.',
    ACCESS_DENIED: 'Tài khoản không có quyền dùng gợi ý dịch.',
};
const TRANSLATION_FALLBACK = 'Chưa lấy được gợi ý dịch. Bạn có thể tự nhập hoặc thử lại.';

/** Câu báo lỗi (tiếng Việt, làm key cho `tr`) theo ErrorCode BE trả về khi gọi /api/ai/translate. */
export function translationErrorKey(error: unknown): string {
    const code = axios.isAxiosError<ApiErrorResponse>(error) ? error.response?.data?.code : undefined;
    return (code && translationErrorMessages[code]) || TRANSLATION_FALLBACK;
}
