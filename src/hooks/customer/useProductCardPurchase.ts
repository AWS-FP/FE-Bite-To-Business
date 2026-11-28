import { useState } from 'react';
import type { HomeProductCardItem } from '@/types/customer/homeData';
import { checkCartStock, useCartStore } from '@/store/customer/cartStore';
import { useCartFeedback } from './useCartFeedback';
import { useStorefrontPurchaseAccess } from './useStorefrontPurchaseAccess';

/**
 * Giá, giảm giá, số lượng và thêm vào giỏ cho một thẻ sản phẩm.
 * Chỉ dùng giá từ API; giá khuyến mãi chỉ hợp lệ khi thấp hơn giá niêm yết.
 */
export function useProductCardPurchase(product: HomeProductCardItem, name: string) {
    const purchaseAllowed = useStorefrontPurchaseAccess();
    const addItemToCart = useCartStore((state) => state.addItem);
    const [requestedQuantity, setRequestedQuantity] = useState(product.minOrderQuantity ?? 1);
    const { feedback, showFeedback, clearFeedback } = useCartFeedback();

    const minQuantity = product.minOrderQuantity ?? 1;
    const quantity = Math.max(minQuantity, requestedQuantity);
    const step = product.quantityStep ?? 1;
    const available = product.availableQuantity;
    const inStock =
        product.unit === 'COMBO'
            ? available != null && available >= minQuantity
            : available == null || available > 0;
    const validSale =
        product.salePrice != null &&
        product.salePrice >= 0 &&
        product.listPrice != null &&
        product.listPrice > 0 &&
        product.salePrice < product.listPrice;
    const unitPrice = validSale ? product.salePrice! : product.listPrice;
    const discountPercent = validSale
        ? Math.round(((product.listPrice! - unitPrice!) / product.listPrice!) * 100)
        : 0;
    const totalPrice = unitPrice == null ? null : unitPrice * quantity;

    const rules = { id: product.id, minOrderQuantity: minQuantity, quantityStep: step, maxQuantity: available };
    function setQuantity(requested: number) {
        const next = Number(requested.toFixed(3));
        if (next > quantity) {
            const limit = checkCartStock(rules, next);
            if (limit) { showFeedback(limit); return; }
        }
        clearFeedback();
        setRequestedQuantity(next);
    }

    function handleAddToOrder() {
        if (!purchaseAllowed || !inStock || unitPrice == null) return;
        const limit = addItemToCart(
            {
                ...rules,
                name,
                spec: product.spec,
                unitPrice,
                imageUrl: product.imageUrl,
            },
            quantity,
        );
        showFeedback(limit);
    }

    return {
        purchaseAllowed,
        quantity,
        setQuantity,
        minQuantity,
        step,
        feedback,
        inStock,
        validSale,
        unitPrice,
        discountPercent,
        totalPrice,
        handleAddToOrder,
    };
}
