import { z } from 'zod';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import type { ComponentContext } from '@a2ui/web_core/v0_9';
import { AlertCircle, CheckCircle2, Info, Search, Sparkles } from 'lucide-react';
import { AddButton, Price, ProductTile, Stock, Tiers } from './productParts';
import {
    inStock,
    productList,
    productOf,
    unitLabel,
    unitPrice,
    viewProduct,
    type A2uiProduct,
} from './productTypes';

/**
 * Component nghiệp vụ của catalog Bite to Business (khớp Generate-UI-BE/.../bite-to-business.catalog.json).
 * Giá, tồn và MOQ chỉ đọc từ data model backend ghi (/products); model AI không được viết số vào props.
 */

const common = {
    weight: z.number().optional(),
    accessibility: CommonSchemas.AccessibilityAttributes.optional(),
};

export const ProductGridApi = {
    name: 'ProductGrid',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        columns: z.number().optional(),
        density: z.enum(['compact', 'comfortable']).optional(),
        maxItems: z.number().optional(),
        showPriceTiers: z.boolean().optional(),
        showAddToCart: z.boolean().optional(),
        emptyText: CommonSchemas.DynamicString.optional(),
    }),
};
export const ProductGrid = createComponentImplementation(ProductGridApi, ({ props, context }) => {
    const items = productList(props.items).slice(0, props.maxItems ?? 12);
    if (!items.length)
        return (
            <p className="text-sm text-store-muted">{props.emptyText ?? 'Không có sản phẩm.'}</p>
        );
    const compact = props.density === 'compact';
    // Cột do model chọn chỉ là độ rộng thẻ mong muốn; lưới tự co theo chỗ đặt
    // (khung chat hẹp ~2 cột, trang rộng 4–5 cột) để không vỡ bố cục.
    const minWidth = compact ? 140 : props.columns === 2 ? 260 : props.columns === 4 ? 170 : 200;
    return (
        <div
            className="grid gap-3"
            style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}px, 100%), 1fr))`,
            }}
        >
            {items.map((product) => (
                <ProductTile
                    key={product.productId}
                    context={context}
                    product={product}
                    compact={compact}
                    showTiers={props.showPriceTiers ?? false}
                    showAdd={props.showAddToCart ?? true}
                />
            ))}
        </div>
    );
});

type Column = 'image' | 'name' | 'spec' | 'origin' | 'price' | 'priceTiers' | 'moq' | 'stock';
const COLUMN_LABEL: Record<Column, string> = {
    image: '',
    name: 'Sản phẩm',
    spec: 'Quy cách',
    origin: 'Xuất xứ',
    price: 'Giá',
    priceTiers: 'Bậc giá',
    moq: 'Tối thiểu',
    stock: 'Tồn',
};

export const ProductTableApi = {
    name: 'ProductTable',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        columns: z.array(
            z.enum(['image', 'name', 'spec', 'origin', 'price', 'priceTiers', 'moq', 'stock']),
        ),
        highlight: z.enum(['none', 'lowestPrice', 'inStock']).optional(),
        maxItems: z.number().optional(),
        showAddToCart: z.boolean().optional(),
        emptyText: CommonSchemas.DynamicString.optional(),
    }),
};
export const ProductTable = createComponentImplementation(ProductTableApi, ({ props, context }) => {
    const items = productList(props.items).slice(0, props.maxItems ?? 12);
    if (!items.length)
        return (
            <p className="text-sm text-store-muted">{props.emptyText ?? 'Không có sản phẩm.'}</p>
        );
    const columns = props.columns as Column[];
    // Renderer tự tính dòng nổi bật từ dữ liệu thật; model chỉ chọn tiêu chí.
    const prices = items
        .map((product) => unitPrice(product))
        .filter((price): price is number => price != null);
    const lowest = prices.length ? Math.min(...prices) : null;
    const comparablePrices = new Set(items.map((product) => product.unitCode + ':' + (product.spec ?? ''))).size === 1;
    const highlighted = (product: A2uiProduct) =>
        props.highlight === 'lowestPrice'
            ? comparablePrices && lowest != null && unitPrice(product) === lowest
            : props.highlight === 'inStock' && inStock(product);
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-xs">
                <thead>
                    <tr className="border-b border-store-line text-store-muted">
                        {columns.map((column) => (
                            <th key={column} className="px-1 py-1 font-semibold">
                                {COLUMN_LABEL[column]}
                            </th>
                        ))}
                        {(props.showAddToCart ?? true) && <th className="px-1 py-1" />}
                    </tr>
                </thead>
                <tbody>
                    {items.map((product) => (
                        <tr
                            key={product.productId}
                            className={`border-b border-store-line/70 align-top ${highlighted(product) ? 'bg-store-mint/40' : ''}`}
                        >
                            {columns.map((column) => (
                                <td key={column} className="px-1 py-1.5">
                                    {column === 'image' &&
                                        (product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt=""
                                                className="size-10 rounded object-cover"
                                            />
                                        ) : (
                                            <span className="block size-10 rounded bg-store-cream" />
                                        ))}
                                    {column === 'name' && (
                                        <button
                                            type="button"
                                            onClick={() => viewProduct(context, product)}
                                            className="border-0 bg-transparent p-0 text-left font-semibold text-store-ink hover:underline"
                                        >
                                            {product.name}
                                        </button>
                                    )}
                                    {column === 'spec' && (product.spec ?? '—')}
                                    {column === 'origin' &&
                                        (product.facts?.origin ?? product.origin ?? '—')}
                                    {column === 'price' && <Price product={product} />}
                                    {column === 'priceTiers' && <Tiers product={product} />}
                                    {column === 'moq' &&
                                        `${product.minOrderQuantity} ${unitLabel(product.unitCode)}`}
                                    {column === 'stock' && <Stock product={product} />}
                                </td>
                            ))}
                            {(props.showAddToCart ?? true) && (
                                <td className="px-1 py-1.5">
                                    <AddButton context={context} product={product} />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {items.some((product) => product.facts) && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {items.map((product) => (
                        <section key={product.productId} className="rounded-xl border border-store-line bg-store-cream/40 p-4 text-sm text-store-ink">
                            <h4 className="font-bold">{product.name}</h4>
                            <dl className="mt-3 space-y-2">
                                <div><dt className="font-semibold">Xuất xứ</dt><dd>{product.facts?.origin || product.origin || 'Chưa có thông tin'}</dd></div>
                                <div><dt className="font-semibold">Thương hiệu</dt><dd>{product.facts?.brand || 'Chưa có thông tin'}</dd></div>
                                <div><dt className="font-semibold">Bảo quản</dt><dd className="whitespace-pre-line">{product.facts?.storage || 'Chưa có thông tin'}</dd></div>
                                <div><dt className="font-semibold">Thông tin sản phẩm</dt><dd className="whitespace-pre-line">{product.facts?.description || product.facts?.technical || 'Chưa có thông tin'}</dd></div>
                                <div><dt className="font-semibold">Dinh dưỡng {product.facts?.nutritionBasis ? '(' + product.facts.nutritionBasis + ')' : ''}</dt><dd>{product.facts?.nutrition?.length ? <ul className="mt-1 space-y-1">{product.facts.nutrition.map((item, index) => <li key={index} className="flex justify-between gap-4"><span>{item.nutrient}</span><span>{item.amount}</span></li>)}</ul> : 'Chưa có thông tin dinh dưỡng'}</dd></div>
                            </dl>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
});

export const ProductCardApi = {
    name: 'ProductCard',
    schema: z.object({
        ...common,
        product: CommonSchemas.DynamicValue,
        variant: z.enum(['compact', 'detailed']).optional(),
        showPriceTiers: z.boolean().optional(),
        showAddToCart: z.boolean().optional(),
    }),
};
export const ProductCard = createComponentImplementation(ProductCardApi, ({ props, context }) => {
    const product = productOf(props.product);
    if (!product) return null;
    return (
        <ProductTile
            context={context}
            product={product}
            compact={props.variant === 'compact'}
            showTiers={props.showPriceTiers ?? true}
            showAdd={props.showAddToCart ?? true}
        />
    );
});

export const PriceTiersApi = {
    name: 'PriceTiers',
    schema: z.object({
        ...common,
        product: CommonSchemas.DynamicValue,
        title: CommonSchemas.DynamicString.optional(),
    }),
};
export const PriceTiers = createComponentImplementation(PriceTiersApi, ({ props }) => {
    const product = productOf(props.product);
    if (!product) return null;
    return (
        <section className="rounded border border-store-line bg-white p-2">
            {props.title && <p className="text-xs font-bold">{props.title}</p>}
            <Tiers product={product} />
            <p className="mt-1 text-[11px] text-store-muted">Giá chưa gồm VAT.</p>
        </section>
    );
});

export const InventoryBadgeApi = {
    name: 'InventoryBadge',
    schema: z.object({ ...common, product: CommonSchemas.DynamicValue }),
};
export const InventoryBadge = createComponentImplementation(InventoryBadgeApi, ({ props }) => {
    const product = productOf(props.product);
    return product ? <Stock product={product} /> : null;
});

const TONE = {
    info: { icon: Info, className: 'border-store-line bg-store-cream' },
    success: { icon: CheckCircle2, className: 'border-green-300 bg-green-50' },
    warning: { icon: AlertCircle, className: 'border-amber-300 bg-amber-50' },
    empty: { icon: Search, className: 'border-store-line bg-white' },
} as const;

export const NoticeApi = {
    name: 'Notice',
    schema: z.object({
        ...common,
        tone: z.enum(['info', 'success', 'warning', 'empty']).optional(),
        title: CommonSchemas.DynamicString.optional(),
        text: CommonSchemas.DynamicString,
    }),
};
export const Notice = createComponentImplementation(NoticeApi, ({ props }) => {
    const tone = TONE[props.tone ?? 'info'];
    const Icon = tone.icon;
    return (
        <div
            className={`flex gap-2 rounded border px-3 py-2 text-xs ${tone.className}`}
            role="status"
        >
            <Icon size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
                {props.title && <p className="font-bold">{props.title}</p>}
                <p>{props.text}</p>
            </div>
        </div>
    );
});

function sendPrompt(context: ComponentContext, text: string) {
    void context.dispatchAction({ event: { name: 'send_prompt', context: { text } } });
}

export const ClarifyQuestionApi = {
    name: 'ClarifyQuestion',
    schema: z.object({
        ...common,
        question: CommonSchemas.DynamicString,
        options: CommonSchemas.DynamicStringList.optional(),
        allowFreeText: z.boolean().optional(),
    }),
};
export const ClarifyQuestion = createComponentImplementation(
    ClarifyQuestionApi,
    ({ props, context }) => (
        <div className="space-y-2">
            <p className="text-sm font-semibold">{props.question}</p>
            {!!props.options?.length && (
                <div className="flex flex-wrap gap-2">
                    {props.options.slice(0, 6).map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => sendPrompt(context, option)}
                            className="rounded-full border border-store-green px-3 py-1 text-xs font-semibold text-store-green hover:bg-store-green hover:text-white"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    ),
);

export const SuggestedPromptsApi = {
    name: 'SuggestedPrompts',
    schema: z.object({ ...common, prompts: CommonSchemas.DynamicStringList }),
};
export const SuggestedPrompts = createComponentImplementation(
    SuggestedPromptsApi,
    ({ props, context }) => (
        <div className="flex flex-wrap gap-2">
            {props.prompts.slice(0, 4).map((prompt) => (
                <button
                    key={prompt}
                    type="button"
                    onClick={() => sendPrompt(context, prompt)}
                    className="inline-flex items-center gap-1 rounded-full bg-store-cream px-3 py-1 text-xs font-semibold text-store-green hover:bg-store-mint"
                >
                    <Sparkles size={11} aria-hidden="true" /> {prompt}
                </button>
            ))}
        </div>
    ),
);
