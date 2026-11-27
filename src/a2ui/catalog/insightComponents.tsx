import { z } from 'zod';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PackageCheck, ShoppingBasket, Star } from 'lucide-react';
import { productList, unitLabel, unitPrice } from './productTypes';
import { ProductTile } from './productParts';

const common = {
    weight: z.number().optional(),
    accessibility: CommonSchemas.AccessibilityAttributes.optional(),
    items: CommonSchemas.DynamicValue,
};
export const ProductStatsApi = { name: 'ProductStats', schema: z.object(common) };
export const ProductStats = createComponentImplementation(
    ProductStatsApi,
    function ProductStatsView({ props }) {
        const { i18n } = useTranslation();
        const en = i18n.resolvedLanguage?.startsWith('en');
        const products = productList(props.items);
        const stats = [
            {
                icon: ShoppingBasket,
                label: en ? 'Matching products' : 'Sản phẩm phù hợp',
                value: products.length,
            },
            {
                icon: PackageCheck,
                label: en ? 'Available to order' : 'Đang còn hàng',
                value: products.filter(
                    (p) => p.availableQuantity != null && p.availableQuantity > 0,
                ).length,
            },
            {
                icon: Star,
                label: en ? 'Customer reviews' : 'Lượt đánh giá',
                value: products.reduce((sum, p) => sum + (p.reviewCount ?? 0), 0),
            },
        ];
        return (
            <div className="grid gap-4 sm:grid-cols-3">
                {stats.map(({ icon: Icon, label, value }) => (
                    <div
                        key={label}
                        className="flex items-center gap-4 rounded-2xl border border-store-line bg-white p-5"
                    >
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-store-green/8 text-store-green">
                            <Icon size={21} />
                        </span>
                        <div>
                            <p className="m-0 text-xs font-medium text-store-muted">{label}</p>
                            <p className="m-0 mt-1 text-2xl font-bold tabular-nums text-store-green">
                                {value.toLocaleString(en ? 'en-GB' : 'vi-VN')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    },
);

export const ProductPriceChartApi = {
    name: 'ProductPriceChart',
    schema: z.object({
        ...common,
        metric: z.enum(['price', 'reviews']).optional(),
        maxItems: z.number().int().min(2).max(8).optional(),
    }),
};
export const ProductPriceChart = createComponentImplementation(
    ProductPriceChartApi,
    function ProductPriceChartView({ props }) {
        const { i18n } = useTranslation();
        const en = i18n.resolvedLanguage?.startsWith('en');
        const metric = props.metric ?? 'price';
        const products = productList(props.items)
            .filter((p) =>
                metric === 'reviews'
                    ? p.reviewCount != null
                    : p.priceAvailable && unitPrice(p) != null,
            )
            .slice(0, props.maxItems ?? 6);
        if (!products.length)
            return (
                <p className="rounded-xl bg-store-cream p-4 text-sm text-store-muted">
                    {en
                        ? 'Not enough recorded data for a chart.'
                        : 'Chưa đủ dữ liệu ghi nhận để vẽ biểu đồ.'}
                </p>
            );
        const data = products.map((p, i) => ({
            name: `${i + 1}`,
            fullName: p.name,
            unit: unitLabel(p.unitCode, en ? 'en' : 'vi'),
            value: metric === 'reviews' ? (p.reviewCount ?? 0) : (unitPrice(p) ?? 0),
        }));
        return (
            <figure className="m-0 space-y-5 rounded-2xl border border-store-line bg-white p-5 sm:p-6">
                <figcaption className="text-base font-bold text-store-green">
                    {metric === 'reviews'
                        ? en
                            ? 'Recorded customer reviews'
                            : 'Số lượt đánh giá thực tế'
                        : en
                          ? 'Price by selling unit'
                          : 'Giá theo đơn vị bán'}
                </figcaption>
                <div
                    className="h-64 w-full"
                    role="img"
                    aria-label={en ? 'Product comparison chart' : 'Biểu đồ đối chiếu sản phẩm'}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 8, left: 4 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#dce5df"
                            />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis
                                width={64}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    Number(value).toLocaleString(en ? 'en-GB' : 'vi-VN')
                                }
                            />
                            <Tooltip
                                labelFormatter={(label) =>
                                    data.find((row) => row.name === String(label))?.fullName ??
                                    label
                                }
                                formatter={(value, _name, item) => [
                                    metric === 'price'
                                        ? `${Number(value).toLocaleString(en ? 'en-GB' : 'vi-VN')} ₫ / ${item.payload.unit}`
                                        : value,
                                    metric === 'price'
                                        ? en
                                            ? 'Price'
                                            : 'Giá'
                                        : en
                                          ? 'Reviews'
                                          : 'Đánh giá',
                                ]}
                            />
                            <Bar
                                dataKey="value"
                                fill="#12372a"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <ol className="m-0 grid gap-2 pl-5 text-xs leading-5 text-store-muted sm:grid-cols-2">
                    {data.map((row) => (
                        <li key={row.name}>
                            {row.fullName}
                            {metric === 'price' ? ` · ${row.unit}` : ''}
                        </li>
                    ))}
                </ol>
                {metric === 'price' && (
                    <p className="m-0 rounded-xl bg-store-cream p-3 text-xs leading-5 text-store-muted">
                        {en
                            ? 'Prices use each product’s selling unit. Different pack sizes are not a per-weight comparison.'
                            : 'Giá theo đơn vị bán của từng sản phẩm. Quy cách khác nhau chưa được quy đổi để so giá theo khối lượng.'}
                    </p>
                )}
            </figure>
        );
    },
);

export const ProductCompareCardsApi = {
    name: 'ProductCompareCards',
    schema: z.object({
        ...common,
        maxItems: z.number().int().min(1).max(4).optional(),
        showPriceTiers: z.boolean().optional(),
    }),
};
export const ProductCompareCards = createComponentImplementation(
    ProductCompareCardsApi,
    ({ props, context }) => (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {productList(props.items)
                .slice(0, props.maxItems ?? 3)
                .map((product) => (
                    <ProductTile
                        key={product.productId}
                        context={context}
                        product={product}
                        compact={false}
                        showTiers={props.showPriceTiers ?? true}
                        showAdd
                    />
                ))}
        </div>
    ),
);
