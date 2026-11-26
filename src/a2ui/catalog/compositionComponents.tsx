import { z } from 'zod';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { ProductPresentation } from './productParts';
import { productList, productOf } from './productTypes';

const common = {
    weight: z.number().optional(),
    accessibility: CommonSchemas.AccessibilityAttributes.optional(),
};

const GRID_LAYOUTS = {
    equal: '@3xl:grid-cols-2',
    thirds: '@3xl:grid-cols-3',
    'sidebar-left': '@3xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]',
    'sidebar-right': '@3xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]',
} as const;
const GAPS = { small: 'gap-3', medium: 'gap-5', large: 'gap-8' } as const;

export const LayoutGridApi = {
    name: 'LayoutGrid',
    schema: z.object({
        ...common,
        children: z.array(CommonSchemas.ComponentId).min(1).max(6),
        layout: z.enum(['equal', 'thirds', 'sidebar-left', 'sidebar-right']).optional(),
        gap: z.enum(['small', 'medium', 'large']).optional(),
        align: z.enum(['start', 'stretch']).optional(),
    }),
};
export const LayoutGrid = createComponentImplementation(LayoutGridApi, ({ props, buildChild }) => (
    <div className="@container min-w-0">
        <div
            className={`grid grid-cols-1 ${GRID_LAYOUTS[props.layout ?? 'equal']}
                ${GAPS[props.gap ?? 'medium']} ${props.align === 'stretch' ? 'items-stretch' : 'items-start'}`}
        >
            {props.children.map((child) => (
                <div className="min-w-0" key={typeof child === 'string' ? child : `${child.id}:${child.basePath}`}>
                    {typeof child === 'string' ? buildChild(child) : buildChild(child.id, child.basePath)}
                </div>
            ))}
        </div>
    </div>
));


export const ProductListApi = {
    name: 'ProductList',
    schema: z.object({
        ...common,
        items: CommonSchemas.DynamicValue,
        maxItems: z.number().int().min(1).max(20).optional(),
        showPriceTiers: z.boolean().optional(),
        showAddToCart: z.boolean().optional(),
    }),
};
export const ProductList = createComponentImplementation(ProductListApi, ({ props, context }) => (
    <div className="min-w-0 space-y-3">
        {productList(props.items).slice(0, props.maxItems ?? 8).map((product) => (
            <ProductPresentation
                key={product.productId}
                product={product}
                context={context}
                featured={false}
                showTiers={props.showPriceTiers ?? false}
                showAdd={props.showAddToCart ?? true}
            />
        ))}
    </div>
));

export const ProductSpotlightApi = {
    name: 'ProductSpotlight',
    schema: z.object({
        ...common,
        product: CommonSchemas.DynamicValue,
        showPriceTiers: z.boolean().optional(),
        showAddToCart: z.boolean().optional(),
    }),
};
export const ProductSpotlight = createComponentImplementation(ProductSpotlightApi, ({ props, context }) => {
    const product = productOf(props.product);
    if (!product) return null;
    return (
        <ProductPresentation
            product={product}
            context={context}
            featured
            showTiers={props.showPriceTiers ?? false}
            showAdd={props.showAddToCart ?? true}
        />
    );
});

