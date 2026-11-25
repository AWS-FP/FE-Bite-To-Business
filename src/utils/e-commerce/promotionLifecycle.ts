import type { Promotion } from '@/types/e-commerce/executiveAdmin';

/** Server-computed expiry is independent of browser timezone and clock drift. */
export function promotionDisplayStatus(
    promotion: Pick<Promotion, 'status' | 'expired' | 'publishedAt'>,
): string {
    if (
        promotion.expired &&
        promotion.publishedAt &&
        (promotion.status === 'PUBLISHED' || promotion.status === 'DISABLED')
    ) {
        return 'EXPIRED';
    }
    return promotion.status;
}
