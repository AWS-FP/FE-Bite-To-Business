import { useEffect, useState } from 'react';
import { getCustomerProductDetail, getCustomerProductPricing } from '@/services/customer/productDetailService';
import type { CustomerProductDetail, CustomerProductPricing } from '@/types/customer/productDetail';

/** Chi tiết và giá của một sản phẩm; giá lỗi không chặn hiển thị chi tiết. */
export function useProductDetail(productId?: string) {
    const [product, setProduct] = useState<CustomerProductDetail | null>(null);
    const [pricing, setPricing] = useState<CustomerProductPricing | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!productId) return;
        const controller = new AbortController();
        let active = true;
        Promise.allSettled([
            getCustomerProductDetail(productId, controller.signal),
            getCustomerProductPricing(productId, controller.signal),
        ]).then(([detailResult, pricingResult]) => {
            if (!active) return;
            if (detailResult.status === 'fulfilled') setProduct(detailResult.value);
            else setFailed(true);
            if (pricingResult.status === 'fulfilled') setPricing(pricingResult.value);
            setLoading(false);
        });
        return () => {
            active = false;
            controller.abort();
        };
    }, [productId]);

    return { product, pricing, loading, failed };
}
