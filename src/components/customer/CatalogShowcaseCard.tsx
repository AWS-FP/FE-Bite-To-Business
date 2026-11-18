import { useEffect, useRef, useState } from 'react';
import ProductShowcaseCard from '@/components/customer/home/ProductShowcaseCard';
import type { CatalogProduct } from '@/services/customer/catalogReadService';
import { getCustomerProductPricing, type CustomerProductPricing } from '@/services/customer/productDetailService';
import { getProductReviews, type ProductReviewsPage } from '@/services/customer/reviewService';
import type { HomeProductCardItem } from '@/constants/customer/homeData';

/** Uses the same card as Homepage; missing pricing is never invented. */
export default function CatalogShowcaseCard({ product, categoryNameVi = '', categoryNameEn = '' }: {
    product: CatalogProduct;
    categoryNameVi?: string;
    categoryNameEn?: string;
}) {
    const [pricing, setPricing] = useState<CustomerProductPricing | null>(null);
    const [reviews, setReviews] = useState<ProductReviewsPage | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(typeof IntersectionObserver === 'undefined');
    useEffect(() => {
        const element = elementRef.current;
        if (!element || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                setVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: '240px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        if (!visible) return;

        const controller = new AbortController();
        let current = true;
        getCustomerProductPricing(product.id, controller.signal).then((data) => {
            if (current) setPricing(data);
        }).catch(() => {});
        getProductReviews(product.id, 0, 1).then((data) => {
            if (current) setReviews(data);
        }).catch(() => {});
        return () => { current = false; controller.abort(); };
    }, [product.id, visible]);
    const card: HomeProductCardItem = {
        id: product.id,
        name: product.nameVi,
        nameVi: product.nameVi,
        nameEn: product.nameEn,
        categoryLabel: categoryNameVi,
        categoryLabelEn: categoryNameEn,
        sku: product.sku,
        spec: product.packageSpecVi || product.unitCode,
        unit: pricing?.unitCode || product.unitCode,
        listPrice: pricing?.priceAvailable ? pricing.listPrice : null,
        salePrice: pricing?.saleActive ? (pricing.salePrice ?? undefined) : undefined,
        availableQuantity: pricing ? (pricing.inventoryAvailable ? pricing.availableQuantity ?? 0 : 0) : undefined,
        minOrderQuantity: pricing?.minOrderQuantity,
        quantityStep: pricing?.quantityStep,
        rating: reviews?.averageRating ?? undefined,
        reviewCount: reviews?.totalElements,
        imageUrl: product.imageUrl ?? '',
        certBadge: '',
    };
    return <div ref={elementRef} className="h-full min-w-0"><ProductShowcaseCard product={card} /></div>;
}
