import { useEffect, useRef, useState } from 'react';
import ProductShowcaseCard from '@/components/customer/home/ProductShowcaseCard';
import type { CatalogProduct } from '@/services/customer/catalogReadService';
import {
    getCachedProductPricing,
    loadProductPricing,
    type CustomerProductPricing,
} from '@/services/customer/productDetailService';
import { getProductReviews, type ProductReviewsPage } from '@/services/customer/reviewService';
import type { HomeProductCardItem } from '@/constants/customer/homeData';

/** Uses the same card as Homepage; missing pricing is never invented. */
export default function CatalogShowcaseCard({ product, categoryNameVi = '', categoryNameEn = '' }: {
    product: CatalogProduct;
    categoryNameVi?: string;
    categoryNameEn?: string;
}) {
    // Keyed by product so a reused card never shows another product's stock state.
    const [pricingState, setPricingState] = useState<{
        id: string;
        value: CustomerProductPricing | null;
        failed: boolean;
    }>(() => ({ id: product.id, value: getCachedProductPricing(product.id) ?? null, failed: false }));
    const current = pricingState.id === product.id ? pricingState : null;
    const pricing = current?.value ?? getCachedProductPricing(product.id) ?? null;
    const pricingFailed = current?.failed ?? false;
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
    // Price and stock decide the buy button, so they load as soon as the card exists
    // instead of waiting for it to scroll into view.
    useEffect(() => {
        let alive = true;
        loadProductPricing(product.id).then((value) => {
            if (alive) setPricingState({ id: product.id, value, failed: false });
        }).catch(() => {
            if (alive) setPricingState({ id: product.id, value: null, failed: true });
        });
        return () => { alive = false; };
    }, [product.id]);
    useEffect(() => {
        if (!visible) return;
        let alive = true;
        getProductReviews(product.id, 0, 1).then((data) => {
            if (alive) setReviews(data);
        }).catch(() => {});
        return () => { alive = false; };
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
        priceLoading: pricing == null && !pricingFailed,
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
