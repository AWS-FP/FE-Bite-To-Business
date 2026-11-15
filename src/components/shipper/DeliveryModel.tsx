import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { DeliveryHistoryItem, DeliveryLanguage, DeliveryTrip } from '../../types/shipper/delivery';

type DeliveryDemoState = {
    trip: DeliveryTrip | null;
    history: DeliveryHistoryItem[];
};

type DeliveryContextValue = DeliveryDemoState & {
    language: DeliveryLanguage;
    setLanguage: (language: DeliveryLanguage) => void;
    confirmationOpen: boolean;
    setConfirmationOpen: (open: boolean) => void;
    completeTrip: () => void;
    resetDemo: () => void;
};

const initialState = (): DeliveryDemoState => ({
    trip: null,
    history: [],
});
const DeliveryContext = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<DeliveryDemoState>(initialState);
    const [language, setLanguage] = useState<DeliveryLanguage>('vi');
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const completeTrip = useCallback(() => {
        setState((current) => {
            if (!current.trip) return current;
            const now = new Date();
            const timestamp = new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false,
            }).format(now);
            const completed: DeliveryHistoryItem = {
                id: `completed-${current.trip.id}`,
                orderCode: current.trip.orderCode,
                customer: current.trip.customer,
                packageCount: current.trip.packageCount,
                stopCount: current.trip.stopCount,
                eta: '29/10/2026 18:00',
                completedAt: timestamp,
                differenceMinutes: 0, // Demo does not calculate real ETA variance.
                status: 'COMPLETED',
            };
            return { trip: null, history: [completed, ...current.history] };
        });
        setConfirmationOpen(false);
    }, []);

    const resetDemo = useCallback(() => {
        setState(initialState());
        setConfirmationOpen(false);
    }, []);

    const value = useMemo<DeliveryContextValue>(() => ({
        ...state, language, setLanguage, confirmationOpen, setConfirmationOpen,
        completeTrip, resetDemo,
    }), [state, language, confirmationOpen, completeTrip, resetDemo]);

    return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
}

// Context and hook are kept together for the existing delivery layout.
// eslint-disable-next-line react-refresh/only-export-components
export function useDelivery(): DeliveryContextValue {
    const context = useContext(DeliveryContext);
    if (!context) throw new Error('useDelivery must be used inside DeliveryProvider');
    return context;
}
