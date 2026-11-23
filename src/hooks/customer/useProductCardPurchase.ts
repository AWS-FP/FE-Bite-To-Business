import { useState } from 'react';
import type { HomeProductCardItem } from '@/types/customer/homeData';
import { useCartStore } from '@/store/customer/cartStore';

/**
 * Giá, giảm giá, số lượng và thêm vào giỏ cho một thẻ sản phẩm.
 * Chỉ dùng giá từ API; giá khuyến mãi chỉ hợp lệ khi thấp hơn giá niêm yết.
 */
export function useProductCardPurchase(product: HomeProductCardItem, name: string) {
    const addItemToCart = useCartStore((state) => state.addItem);
    const [requestedQuantity, setQuantity] = useState(product.minOrderQuantity ?? 1);

    const minQuantity = product.minOrderQuantity ?? 1;
    const quantity = Math.max(minQuantity, requestedQuantity);
    const step = product.quantityStep ?? 1;
    const available = product.availableQuantity;
    const inStock = available == null || available > 0;
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

    function handleAddToOrder() {
        if (!inStock || unitPrice == null || (available != null && quantity > available)) return;
        addItemToCart(
            {
                id: product.id,
                name,
                spec: product.spec,
                unitPrice,
                imageUrl: product.imageUrl,
                minOrderQuantity: minQuantity,
                quantityStep: step,
                maxQuantity: available ?? null,
            },
            quantity,
        );
    }

    return {
        quantity,
        setQuantity,
        minQuantity,
        step,
        available,
        inStock,
        validSale,
        unitPrice,
        discountPercent,
        totalPrice,
        handleAddToOrder,
    };
}
