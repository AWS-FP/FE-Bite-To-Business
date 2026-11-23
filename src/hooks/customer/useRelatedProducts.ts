import { useEffect, useState } from 'react';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import type { CatalogProduct } from '@/types/customer/catalog';

/** Tối đa 4 sản phẩm liên quan: ưu tiên cùng danh mục và cùng thương hiệu, bỏ sản phẩm đang xem. */
export function useRelatedProducts(categoryId: string, brandId: string | null, productId: string) {
    const [products, setProducts] = useState<CatalogProduct[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        let alive = true;
        const sameCategory = getCatalogProducts({ page: 0, size: 24, categoryId, signal: controller.signal });
        // API hỗ trợ lọc giao categoryId + brandId; những sản phẩm này được xếp trước.
        const sameBrand = brandId
            ? getCatalogProducts({ page: 0, size: 16, categoryId, brandId, signal: controller.signal })
            : Promise.resolve(null);
        Promise.allSettled([sameBrand, sameCategory]).then(([brand, category]) => {
            if (!alive) return;
            const preferred = brand.status === 'fulfilled' ? (brand.value?.items ?? []) : [];
            const fallback = category.status === 'fulfilled' ? category.value.items : [];
            const seen = new Set<string>([productId]);
            const distinct = [...preferred, ...fallback].filter((item) => {
                if (seen.has(item.id)) return false;
                seen.add(item.id);
                return true;
            });
            setProducts(distinct.slice(0, 4));
        });
        return () => {
            alive = false;
            controller.abort();
        };
    }, [categoryId, brandId, productId]);

    return products;
}
