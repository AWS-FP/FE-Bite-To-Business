import { useEffect, useMemo, useState } from 'react';
import { getHomeProducts } from '@/services/customer/homeService';
import { toCard } from '@/utils/customer/homeProductMapper';
import type { HomeResponse } from '@/types/customer/home';

export type Collection = 'deals' | 'best-selling' | 'deep-discount' | 'top-rated' | 'combos';
export const COLLECTIONS: Collection[] = ['deals', 'best-selling', 'deep-discount', 'top-rated', 'combos'];

/** Sản phẩm của một nhóm trên trang chủ (khuyến mãi, bán chạy, giảm sâu, đánh giá cao, combo). */
export function useHomeCollection(group: Collection) {
    const [data, setData] = useState<HomeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        getHomeProducts(controller.signal)
            .then(setData)
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, []);

    const products = useMemo(() => {
        if (!data) return [];
        const source =
            group === 'deals'
                ? data.flashSaleProducts
                : group === 'best-selling'
                  ? data.bestSellingProducts
                  : group === 'deep-discount'
                    ? data.deepDiscountProducts
                    : data.topRatedProducts;
        return source.map(toCard).filter((item): item is NonNullable<typeof item> => item !== null);
    }, [data, group]);

    return { data, loading, error, products };
}
