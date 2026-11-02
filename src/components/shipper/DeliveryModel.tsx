import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEMO_HISTORY, DEMO_TRIP } from '../../constants/shipper/deliveryDemo';
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

const STORAGE_KEY = 'btb.delivery-demo.v1';
const initialState = (): DeliveryDemoState => ({
    trip: { ...DEMO_TRIP, packages: DEMO_TRIP.packages.map((pack) => ({ ...pack })) },
    history: DEMO_HISTORY.map((item) => ({ ...item })),
});
const DeliveryContext = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<DeliveryDemoState>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed: unknown = JSON.parse(stored);
                if (
                    parsed && typeof parsed === 'object' &&
                    'history' in parsed && Array.isArray(parsed.history) &&
                    'trip' in parsed && (parsed.trip === null || typeof parsed.trip === 'object')
                ) return parsed as DeliveryDemoState;
            }
        } catch { /* Storage might be disabled. Demo still works in memory. */ }
        return initialState();
    });
    const [language, setLanguage] = useState<DeliveryLanguage>('vi');
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
        catch { /* No persistent demo data when storage is unavailable. */ }
    }, [state]);

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

export function useDelivery(): DeliveryContextValue {
    const context = useContext(DeliveryContext);
    if (!context) throw new Error('useDelivery must be used inside DeliveryProvider');
    return context;
}
