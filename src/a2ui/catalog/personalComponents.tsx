import { z } from 'zod';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { History, RotateCcw, ShoppingCart } from 'lucide-react';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { useCartStore } from '@/store/customer/cartStore';
import {
    inStock,
    listOf,
    unitLabel,
    unitPrice,
    viewProduct,
    type A2uiProduct,
} from './productTypes';

/**
 * Widget nghiệp vụ gắn với thói quen/ngữ cảnh mua của chính khách (chế độ Page):
 * - ReorderList: mua lại từ đơn đã hoàn tất (dữ liệu /reorder do BE lấy qua CustomerOrderQueryService).
 * - CartSummary: tóm tắt giỏ hàng đang có trên trình duyệt (đọc cartStore, không nhận số từ AI).
 * Khớp component cùng tên trong bite-to-business.catalog.json ở BE.
 */

const common = {
    weight: z.number().optional(),
    accessibility: CommonSchemas.AccessibilityAttributes.optional(),
};

type ReorderItem = A2uiProduct & {
    lastQuantity?: number;
    timesOrdered?: number;
    lastOrderedAt?: string;
};

export const ReorderListApi = {
    name: 'ReorderList',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        maxItems: z.number().optional(),
    }),
};
export const ReorderList = createComponentImplementation(ReorderListApi, ({ props, context }) => {
    const items = listOf<ReorderItem>(props.items).slice(0, props.maxItems ?? 6);
    if (!items.length) return null;
    return (
        <ul className="divide-y divide-store-line rounded-lg border border-store-line bg-white">
            {items.map((item) => {
                const price = unitPrice(item);
                const unit = unitLabel(item.unitCode);
                const canAdd = inStock(item) && item.priceAvailable;
                return (
                    <li key={item.productId} className="flex items-center gap-3 p-3">
                        <button
                            type="button"
                            onClick={() => viewProduct(context, item)}
                            className="size-14 shrink-0 overflow-hidden rounded bg-store-cream"
                            aria-label={item.name}
                        >
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            )}
                        </button>
                        <div className="min-w-0 flex-1">
                            <button
                                type="button"
                                onClick={() => viewProduct(context, item)}
                                className="line-clamp-1 border-0 bg-transparent p-0 text-left text-sm font-bold text-store-ink hover:underline"
                            >
                                {item.name}
                            </button>
                            <p className="flex items-center gap-1 text-xs text-store-muted">
                                <History size={12} aria-hidden="true" />
                                {item.lastQuantity != null &&
                                    `Lần trước ${item.lastQuantity} ${unit}`}
                                {item.timesOrdered != null && ` · đã đặt ${item.timesOrdered} lần`}
                            </p>
                            {price != null && (
                                <p className="text-xs font-semibold text-store-green">
                                    {formatCurrencyVnd(price)}/{unit} (giá hiện tại)
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            disabled={!canAdd}
                            onClick={() =>
                                void context.dispatchAction({
                                    event: {
                                        name: 'add_to_cart',
                                        // Số lượng lần trước chỉ là gợi ý; giỏ hàng tự làm tròn theo MOQ/bước và tồn.
                                        context: {
                                            productId: item.productId,
                                            quantity: item.lastQuantity ?? item.minOrderQuantity,
                                        },
                                    },
                                })
                            }
                            className="inline-flex shrink-0 items-center gap-1 rounded bg-store-green px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                        >
                            <RotateCcw size={12} aria-hidden="true" /> Mua lại
                        </button>
                    </li>
                );
            })}
        </ul>
    );
});

export const CartSummaryApi = {
    name: 'CartSummary',
    schema: z.object({ ...common, title: CommonSchemas.DynamicString.optional() }),
};
export const CartSummary = createComponentImplementation(CartSummaryApi, ({ props, context }) => {
    // Đọc giỏ thật trên trình duyệt; tổng tạm tính chưa gồm VAT/phí giao, báo giá cuối do BE tính.
    const items = useCartStore((state) => state.items);
    if (!items.length) return null;
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-store-line bg-white p-4">
            <div>
                <p className="flex items-center gap-2 text-sm font-bold">
                    <ShoppingCart size={16} aria-hidden="true" />{' '}
                    {props.title ?? 'Giỏ hàng đang chờ'}
                </p>
                <p className="text-xs text-store-muted">
                    {items.length} sản phẩm · tạm tính {formatCurrencyVnd(subtotal)} (chưa gồm VAT
                    và phí giao)
                </p>
            </div>
            <button
                type="button"
                onClick={() =>
                    void context.dispatchAction({
                        event: { name: 'open_page', context: { page: 'cart' } },
                    })
                }
                className="rounded bg-store-green px-4 py-2 text-xs font-bold text-white"
            >
                Mở giỏ hàng
            </button>
        </div>
    );
});
