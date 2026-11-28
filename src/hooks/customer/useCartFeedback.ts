import { useEffect, useState } from 'react';
import type { StockLimit } from '@/store/customer/cartStore';

export function useCartFeedback() {
    const [feedback, setFeedback] = useState<{ limit: StockLimit | null; sequence: number } | null>(null);

    useEffect(() => {
        if (!feedback || feedback.limit) return;
        const timer = window.setTimeout(() => setFeedback(current => current === feedback ? null : current), 2000);
        return () => window.clearTimeout(timer);
    }, [feedback]);

    return {
        feedback,
        showFeedback: (limit: StockLimit | null) =>
            setFeedback(previous => ({ limit, sequence: (previous?.sequence ?? 0) + 1 })),
        clearFeedback: () => setFeedback(null),
    };
}
