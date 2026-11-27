import type { HomeProduct } from '@/types/customer/home';
import type { HomeProductCardItem } from '@/types/customer/homeData';

export function toCard(product: HomeProduct): HomeProductCardItem | null {
    if (product.listPrice == null || !Number.isFinite(product.listPrice)) return null;
    return toCardIncludingUnpriced(product);
}

/** Campaign membership is visible even when an assigned product has no price. */
export function toCardIncludingUnpriced(product: HomeProduct): HomeProductCardItem {
    return {
        id: product.productId,
        sku: product.sku,
        name: product.nameVi,
        nameVi: product.nameVi,
        nameEn: product.nameEn,
        categoryLabel: product.categoryNameVi ?? '',
        categoryLabelEn: product.categoryNameEn ?? undefined,
        spec: product.packageSpecVi ?? product.unitCode,
        unit: product.unitCode,
        listPrice: product.listPrice,
        salePrice: product.salePrice ?? undefined,
        availableQuantity: product.availableQuantity ?? 0,
        minOrderQuantity: product.minOrderQuantity,
        quantityStep: product.quantityStep,
        rating: product.averageRating ?? undefined,
        reviewCount: product.reviewCount,
        imageUrl: product.imageUrl ?? '',
        certBadge: '',
    };
}
