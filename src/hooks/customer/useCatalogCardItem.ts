import { useEffect, useState } from 'react';
import { getCachedProductPricing, loadProductPricing } from '@/services/customer/productDetailService';
import { reviewSummaries } from '@/services/customer/reviewService';
import type { CatalogProduct } from '@/types/customer/catalog';
import type { CustomerProductPricing } from '@/types/customer/productDetail';
import type { ReviewSummary } from '@/types/customer/review';
import type { HomeProductCardItem } from '@/types/customer/homeData';

/**
 * Dữ liệu cho thẻ sản phẩm ở trang danh mục: giá/tồn kho và tóm tắt đánh giá.
 * Không tự đặt giá khi chưa có dữ liệu; đánh giá của mọi thẻ đi chung một request (batch).
 */
export function useCatalogCardItem(
    product: CatalogProduct,
    categoryNameVi: string,
    categoryNameEn: string,
): HomeProductCardItem {
    // Gắn theo product.id để thẻ được tái sử dụng không hiển thị tồn kho của sản phẩm khác.
    const [pricingState, setPricingState] = useState<{
        id: string;
        value: CustomerProductPricing | null;
        failed: boolean;
    }>(() => ({ id: product.id, value: getCachedProductPricing(product.id) ?? null, failed: false }));
    const current = pricingState.id === product.id ? pricingState : null;
    const pricing = current?.value ?? getCachedProductPricing(product.id) ?? null;
    const pricingFailed = current?.failed ?? false;
    const [reviewState, setReviewState] = useState<{ id: string; value: ReviewSummary } | null>(null);
    const reviews =
        (reviewState?.id === product.id ? reviewState.value : null) ??
        reviewSummaries.peek(product.id) ??
        null;

    // Giá và tồn kho quyết định nút mua nên tải ngay khi thẻ xuất hiện.
    useEffect(() => {
        let alive = true;
        loadProductPricing(product.id)
            .then((value) => {
                if (alive) setPricingState({ id: product.id, value, failed: false });
            })
            .catch(() => {
                if (alive) setPricingState({ id: product.id, value: null, failed: true });
            });
        return () => {
            alive = false;
        };
    }, [product.id]);

    useEffect(() => {
        let alive = true;
        reviewSummaries
            .get(product.id)
            .then((value) => {
                if (alive) setReviewState({ id: product.id, value });
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, [product.id]);

    return {
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
        reviewCount: reviews?.reviewCount,
        imageUrl: product.imageUrl ?? '',
        certBadge: '',
    };
}
