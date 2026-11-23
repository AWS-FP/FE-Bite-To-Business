import { useTranslation } from 'react-i18next';

/** Chọn câu tiếng Việt hoặc tiếng Anh theo ngôn ngữ đang chọn của staff E-commerce. */
export function useExecutiveText() {
    const { i18n } = useTranslation();
    const en = i18n.resolvedLanguage?.startsWith('en') ?? false;
    return (vi: string, english: string) => (en ? english : vi);
}
