import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useCartStore } from '@/store/customer/cartStore';
import { trackEvent } from './interactionTracker';

/** Mở trang chi tiết rồi Back trong khoảng này coi là "không đúng ý" (pogo-sticking). */
const QUICK_BACK_MS = 8_000;
const PRODUCT_DETAIL = /^\/products\/[^/]+$/;

/**
 * Ghi page_view/page_leave (kèm thời gian ở lại), quick_back và add_to_cart cho toàn site.
 * Gắn một lần ở RootLayout; không đọc nội dung trang, chỉ route và ID sản phẩm.
 */
export function useInteractionTracking() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const current = useRef<{ route: string; since: number } | null>(null);

    useEffect(() => {
        const now = Date.now();
        const previous = current.current;
        if (previous) {
            const dwellMs = now - previous.since;
            trackEvent('page_leave', {
                route: previous.route,
                value: { dwellMs, next: location.pathname },
            });
            if (
                navigationType === 'POP' &&
                dwellMs < QUICK_BACK_MS &&
                PRODUCT_DETAIL.test(previous.route)
            ) {
                trackEvent('quick_back', {
                    route: previous.route,
                    target: previous.route.split('/')[2],
                    value: { dwellMs, backTo: location.pathname },
                });
            }
        }
        current.current = { route: location.pathname, since: now };
        trackEvent('page_view', {
            route: location.pathname,
            value: {
                from: previous?.route ?? null,
                navigation: navigationType,
                query: location.search.slice(0, 200),
            },
        });
    }, [location.pathname, location.search, navigationType]);

    useEffect(
        () =>
            useCartStore.subscribe((state, before) => {
                for (const item of state.items) {
                    const old = before.items.find((line) => line.id === item.id);
                    if (!old || item.quantity > old.quantity) {
                        trackEvent('add_to_cart', {
                            target: item.id,
                            value: { quantity: item.quantity - (old?.quantity ?? 0) },
                        });
                    }
                }
            }),
        [],
    );
}
