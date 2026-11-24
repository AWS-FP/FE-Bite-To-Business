import { useEffect } from 'react';
import { loadProductPricing } from '@/services/customer/productDetailService';
import { useCartStore } from '@/store/customer/cartStore';

/**
 * Keeps every cart line's MOQ, step and available stock up to date (stock changes all the time),
 * so +/- follow the rules and never go above what can be sold. Pricing requests are batched and
 * cached for 60 s, so this runs cheaply whenever the set of cart products changes.
 */
export function useCartRuleBackfill() {
    const ids = useCartStore((state) =>
        state.items
            .map((item) => item.id)
            .sort()
            .join(','),
    );
    const setItemRules = useCartStore((state) => state.setItemRules);

    useEffect(() => {
        if (!ids) return;
        let alive = true;
        for (const id of ids.split(',')) {
            loadProductPricing(id)
                .then((pricing) => {
                    if (!alive) return;
                    const stock = pricing.inventoryAvailable
                        ? Number(pricing.availableQuantity ?? 0)
                        : 0;
                    setItemRules(
                        id,
                        Number(pricing.minOrderQuantity) || 1,
                        Number(pricing.quantityStep) || 1,
                        stock,
                    );
                })
                .catch(() => undefined);
        }
        return () => {
            alive = false;
        };
    }, [ids, setItemRules]);
}
