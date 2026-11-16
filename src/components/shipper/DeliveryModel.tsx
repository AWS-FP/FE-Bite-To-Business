import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { DeliveryLanguage } from '../../types/shipper/delivery';

interface DeliveryContextValue {
    language: DeliveryLanguage;
}

const DeliveryContext = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
    const { i18n } = useTranslation();
    const language: DeliveryLanguage = i18n.resolvedLanguage === 'vi' ? 'vi' : 'en';
    const value = useMemo(() => ({ language }), [language]);

    return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDelivery(): DeliveryContextValue {
    const context = useContext(DeliveryContext);
    if (!context) {
        throw new Error('useDelivery must be used inside DeliveryProvider');
    }
    return context;
}
