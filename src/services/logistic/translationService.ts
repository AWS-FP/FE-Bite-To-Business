import { http } from '@/services/axiosClient';

export type TranslationField =
    | 'NAME'
    | 'DESCRIPTION'
    | 'SPEC'
    | 'TECHNICAL'
    | 'STORAGE'
    | 'COMPLIANCE'
    | 'ORIGIN_DETAIL';

export type TranslationLanguage = 'vi' | 'en';

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
