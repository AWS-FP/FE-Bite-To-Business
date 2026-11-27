/**
 * Kiểu dữ liệu và helper dùng chung cho widget A2UI.
 * Hình dạng dữ liệu khớp data model backend ghi (ai/catalog.json → dataModel.productShape). Mọi số liệu
 * (giá, tồn, MOQ) đến từ data model; widget chỉ hiển thị, không tính lại giá cuối (BE tính khi tạo báo giá).
 */
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
    saleEndsAt?: string | null;
    averageRating?: number | null;
    reviewCount?: number;
    /** Thông tin mô tả từ DB (chỉ có khi tra cứu: tìm theo thuộc tính hoặc hỏi thông tin sản phẩm). */
    facts?: A2uiProductFacts;
    /** Nhóm điều kiện khớp khi tìm theo thuộc tính: origin | storage | contains | nutrient | compliance. */
    matchedOn?: string[];
};

export type A2uiProductFacts = {
    origin?: string | null;
    brand?: string | null;
    category?: string | null;
    distributor?: string | null;
    description?: string | null;
    netWeightKg?: number | null;
    storage?: string | null;
    technical?: string | null;
    originDetail?: string | null;
    compliance?: string | null;
    nutritionBasis?: string | null;
    nutrition?: { nutrient: string; amount: string }[];
    nutritionVerified?: boolean;
    notes?: string | null;
};

export type A2uiCategory = {
    id: string;
    code: string;
    name: string;
    productCount: number;
    children: { code: string; name: string; productCount: number }[];
};

export type A2uiCombo = A2uiProduct & {
    servingCount?: number | null;
    items: { name: string; quantity: number; unitCode: string }[];
};

export type A2uiPromotion = {
    id: string;
    name: string;
    content?: string | null;
    startsAt?: string;
    endsAt?: string;
};

export type A2uiBanner = {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
};

/** Lấy mảng object từ giá trị đã bind; dữ liệu lạ (không phải mảng) thành mảng rỗng để widget không vỡ. */
export const listOf = <T>(value: unknown): T[] =>
    Array.isArray(value) ? (value.filter((item) => item && typeof item === 'object') as T[]) : [];

/** Phát action open_category (FE mở trang danh mục theo code). */
export function openCategory(context: ComponentContext, code: string) {
    void context.dispatchAction({ event: { name: 'open_category', context: { code } } });
}

/** Danh sách sản phẩm từ giá trị bind (/products, /home/*, /favorites…). */
export const productList = (value: unknown): A2uiProduct[] =>
    Array.isArray(value)
        ? (value.filter((item) => item && typeof item === 'object') as A2uiProduct[])
        : [];
/** Một sản phẩm từ giá trị bind /list/N; không đúng hình dạng thì null. */
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
const UNIT_EN: Record<string, string> = {
    KG: 'kg',
    BOTTLE: 'bottle',
    PIECE: 'piece',
    PACK: 'pack',
    TRAY: 'tray',
    BOX: 'box',
    BAG: 'bag',
    CAN: 'can',
    TIN: 'tin',
    TUB: 'tub',
    CASE: 'case',
    COMBO: 'combo',
};
export const unitLabel = (code: string, locale = 'vi') =>
    (locale === 'en' ? UNIT_EN[code] : UNIT[code]) ?? code.toLowerCase();
/** Còn hàng để bán: tồn khả dụng > 0 (null = chưa rõ, coi như không thêm được). */
export const inStock = (product: A2uiProduct) =>
    product.availableQuantity != null && product.availableQuantity > 0;
/** Đơn giá hiển thị: giá sale nếu chương trình đang chạy, ngược lại giá niêm yết (chưa VAT). */
export const unitPrice = (product: A2uiProduct) =>
    product.saleActive && product.salePrice != null
        ? product.salePrice
        : (product.listPrice ?? null);

/** Phát action view_product; handler toàn cục mở trang chi tiết sản phẩm. */
export function viewProduct(context: ComponentContext, product: A2uiProduct) {
    void context.dispatchAction({
        event: { name: 'view_product', context: { productId: product.productId } },
    });
}
/** Phát action add_to_cart với số lượng = MOQ; handler tra lại sản phẩm thật trong data model rồi thêm giỏ. */
export function addToCart(context: ComponentContext, product: A2uiProduct) {
    void context.dispatchAction({
        event: {
            name: 'add_to_cart',
            context: { productId: product.productId, quantity: product.minOrderQuantity },
        },
    });
}
