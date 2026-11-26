import { z } from 'zod';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CalendarClock, ChevronRight, Layers, Users } from 'lucide-react';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { AddButton, ProductTile } from './productParts';
import {
    listOf,
    openCategory,
    productList,
    viewProduct,
    type A2uiBanner,
    type A2uiCategory,
    type A2uiCombo,
    type A2uiPromotion,
} from './productTypes';

/**
 * Widget cấp trang cho chế độ Page: AI ghép các widget này thành cả một trang thay trang mặc định.
 * Khớp các component tương ứng trong bite-to-business.catalog.json ở BE.
 */

const common = {
    weight: z.number().optional(),
    accessibility: CommonSchemas.AccessibilityAttributes.optional(),
};

export const PageHeaderApi = {
    name: 'PageHeader',
    schema: z.object({
        ...common,
        title: CommonSchemas.DynamicString,
        subtitle: CommonSchemas.DynamicString.optional(),
    }),
};
export const PageHeader = createComponentImplementation(PageHeaderApi, ({ props }) => (
    <header className="space-y-2 border-b border-store-line pb-5">
        <h1 className="font-heading text-3xl text-store-green sm:text-4xl">{props.title}</h1>
        {props.subtitle && (
            <p className="max-w-3xl text-sm text-store-muted sm:text-base">{props.subtitle}</p>
        )}
    </header>
));

const SECTION_STYLE = {
    plain: '',
    card: 'rounded-xl border border-store-line bg-white p-4 sm:p-5',
    highlight:
        'rounded-xl border-2 border-store-green bg-white p-4 shadow-[0_6px_0_-2px_rgba(9,51,36,0.2)] sm:p-5',
} as const;

export const SectionApi = {
    name: 'Section',
    schema: z.object({
        ...common,
        title: CommonSchemas.DynamicString,
        description: CommonSchemas.DynamicString.optional(),
        variant: z.enum(['plain', 'card', 'highlight']).optional(),
        child: CommonSchemas.ComponentId,
    }),
};
export const Section = createComponentImplementation(SectionApi, ({ props, buildChild }) => (
    <section className={`space-y-3 ${SECTION_STYLE[props.variant ?? 'plain']}`}>
        <div>
            <h2 className="font-subheading text-xl font-bold text-black">{props.title}</h2>
            {props.description && <p className="text-sm text-store-muted">{props.description}</p>}
        </div>
        {buildChild(props.child as string)}
    </section>
));

export const ProductCarouselApi = {
    name: 'ProductCarousel',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        maxItems: z.number().optional(),
        showAddToCart: z.boolean().optional(),
    }),
};
export const ProductCarousel = createComponentImplementation(
    ProductCarouselApi,
    ({ props, context }) => {
        const items = productList(props.items).slice(0, props.maxItems ?? 8);
        if (!items.length) return null;
        return (
            <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
                {items.map((product) => (
                    <div key={product.productId} className="w-44 shrink-0 snap-start sm:w-52">
                        <ProductTile
                            context={context}
                            product={product}
                            compact={false}
                            showTiers={false}
                            showAdd={props.showAddToCart ?? true}
                        />
                    </div>
                ))}
            </div>
        );
    },
);

export const BannerCarouselApi = {
    name: 'BannerCarousel',
    schema: z.object({ ...common, items: CommonSchemas.DynamicValue }),
};
export const BannerCarousel = createComponentImplementation(BannerCarouselApi, ({ props }) => {
    const banners = listOf<A2uiBanner>(props.items).slice(0, 6);
    if (!banners.length) return null;
    return (
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
            {banners.map((banner) => {
                const body = (
                    <div className="relative h-40 w-[min(520px,85vw)] shrink-0 snap-start overflow-hidden rounded-xl bg-store-green text-white">
                        {banner.imageUrl && (
                            <img
                                src={banner.imageUrl}
                                alt=""
                                className="absolute inset-0 size-full object-cover opacity-70"
                            />
                        )}
                        <div className="relative flex h-full flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="font-subheading text-lg font-bold">{banner.title}</p>
                            {banner.description && (
                                <p className="line-clamp-2 text-sm">{banner.description}</p>
                            )}
                        </div>
                    </div>
                );
                // Chỉ cho phép link nội bộ; link ngoài từ dữ liệu banner không được mở từ trang AI.
                return banner.targetUrl?.startsWith('/') ? (
                    <a key={banner.id} href={banner.targetUrl}>
                        {body}
                    </a>
                ) : (
                    <div key={banner.id}>{body}</div>
                );
            })}
        </div>
    );
});

export const CategoryGridApi = {
    name: 'CategoryGrid',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        maxItems: z.number().optional(),
        showChildren: z.boolean().optional(),
    }),
};
export const CategoryGrid = createComponentImplementation(CategoryGridApi, ({ props, context }) => {
    const categories = listOf<A2uiCategory>(props.items).slice(0, props.maxItems ?? 8);
    if (!categories.length) return null;
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
                <div key={category.id} className="rounded-lg border border-store-line bg-white p-3">
                    <button
                        type="button"
                        onClick={() => openCategory(context, category.code)}
                        className="flex w-full items-center justify-between gap-2 border-0 bg-transparent p-0 text-left text-store-ink"
                    >
                        <span>
                            <span className="block text-sm font-bold">{category.name}</span>
                            <span className="text-xs text-store-muted">
                                {category.productCount} sản phẩm
                            </span>
                        </span>
                        <ChevronRight size={16} aria-hidden="true" />
                    </button>
                    {props.showChildren && category.children.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {category.children.slice(0, 6).map((child) => (
                                <button
                                    key={child.code}
                                    type="button"
                                    onClick={() => openCategory(context, child.code)}
                                    className="rounded-full bg-store-cream px-2 py-0.5 text-[11px] font-semibold text-store-green hover:bg-store-mint"
                                >
                                    {child.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
});

export const ComboListApi = {
    name: 'ComboList',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        maxItems: z.number().optional(),
    }),
};
export const ComboList = createComponentImplementation(ComboListApi, ({ props, context }) => {
    const combos = listOf<A2uiCombo>(props.items).slice(0, props.maxItems ?? 4);
    if (!combos.length) return null;
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {combos.map((combo) => {
                const price =
                    combo.saleActive && combo.salePrice != null ? combo.salePrice : combo.listPrice;
                return (
                    <article
                        key={combo.productId}
                        className="flex gap-3 rounded-lg border border-store-line bg-white p-3"
                    >
                        <button
                            type="button"
                            onClick={() => viewProduct(context, combo)}
                            className="size-20 shrink-0 overflow-hidden rounded bg-store-cream"
                            aria-label={combo.name}
                        >
                            {combo.imageUrl && (
                                <img
                                    src={combo.imageUrl}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            )}
                        </button>
                        <div className="min-w-0 flex-1 space-y-1">
                            <p className="flex items-center gap-1 text-sm font-bold">
                                <Layers size={14} aria-hidden="true" /> {combo.name}
                            </p>
                            {combo.servingCount != null && (
                                <p className="flex items-center gap-1 text-xs text-store-muted">
                                    <Users size={12} aria-hidden="true" /> {combo.servingCount} suất
                                </p>
                            )}
                            <p className="line-clamp-2 text-xs text-store-muted">
                                {combo.items
                                    .map((item) => `${item.name} ×${item.quantity}`)
                                    .join(' · ')}
                            </p>
                            {price != null && (
                                <p className="text-sm font-bold text-store-green">
                                    {formatCurrencyVnd(price)}
                                </p>
                            )}
                            <AddButton
                                context={context}
                                product={{ ...combo, priceAvailable: price != null }}
                            />
                        </div>
                    </article>
                );
            })}
        </div>
    );
});

export const PromotionListApi = {
    name: 'PromotionList',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        maxItems: z.number().optional(),
    }),
};
export const PromotionList = createComponentImplementation(PromotionListApi, ({ props }) => {
    const promotions = listOf<A2uiPromotion>(props.items).slice(0, props.maxItems ?? 3);
    if (!promotions.length) return null;
    const date = (value?: string) => (value ? new Date(value).toLocaleDateString('vi-VN') : null);
    return (
        <ul className="space-y-2">
            {promotions.map((promotion) => (
                <li
                    key={promotion.id}
                    className="rounded-lg border border-store-line bg-store-cream/50 p-3"
                >
                    <p className="text-sm font-bold">{promotion.name}</p>
                    {promotion.content && (
                        <p className="line-clamp-2 text-xs text-store-muted">{promotion.content}</p>
                    )}
                    {promotion.endsAt && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-store-muted">
                            <CalendarClock size={12} aria-hidden="true" /> Đến hết{' '}
                            {date(promotion.endsAt)}
                        </p>
                    )}
                </li>
            ))}
        </ul>
    );
});
