import type { ComponentContext } from '@a2ui/web_core/v0_9';

export type A2uiProduct = {
    productId: string;
    sku: string;
    name: string;
    spec?: string | null;
    origin?: string | null;
    unitCode: string;
    imageUrl?: string | null;
    priceAvailable: boolean;
    listPrice?: number | null;
    salePrice?: number | null;
    saleActive: boolean;
    minOrderQuantity: number;
    quantityStep: number;
    priceTiers: { minQuantity: number; maxQuantity: number | null; unitPrice: number }[];
    inventoryAvailable: boolean;
    availableQuantity?: number | null;
};

export const productList = (value: unknown): A2uiProduct[] =>
    Array.isArray(value)
        ? (value.filter((item) => item && typeof item === 'object') as A2uiProduct[])
        : [];
export const productOf = (value: unknown): A2uiProduct | null =>
    value && typeof value === 'object' && 'productId' in value ? (value as A2uiProduct) : null;

const UNIT: Record<string, string> = {
    KG: 'kg',
    BOTTLE: 'chai',
    PIECE: 'cái',
    PACK: 'gói',
    TRAY: 'khay',
    BOX: 'hộp',
    BAG: 'túi',
    CAN: 'lon',
    TIN: 'hộp thiếc',
    TUB: 'hũ',
    CASE: 'thùng',
};
export const unitLabel = (code: string) => UNIT[code] ?? code.toLowerCase();
export const inStock = (product: A2uiProduct) =>
    product.availableQuantity != null && product.availableQuantity > 0;
export const unitPrice = (product: A2uiProduct) =>
    product.saleActive && product.salePrice != null
        ? product.salePrice
        : (product.listPrice ?? null);

export function viewProduct(context: ComponentContext, product: A2uiProduct) {
    void context.dispatchAction({
        event: { name: 'view_product', context: { productId: product.productId } },
    });
}
export function addToCart(context: ComponentContext, product: A2uiProduct) {
    void context.dispatchAction({
        event: {
            name: 'add_to_cart',
            context: { productId: product.productId, quantity: product.minOrderQuantity },
        },
    });
}
