import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLogisticsText() {
    const { t, i18n } = useTranslation('logistics');
    const tr = useCallback((text: string) => t(text, { keySeparator: false, nsSeparator: false, defaultValue: text }), [t]);
    return {
        tr,
        english: i18n.resolvedLanguage?.startsWith('en') ?? false,
    };
}
