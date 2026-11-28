import { z } from 'zod';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { FileCheck2, Globe2, Info, Leaf, Ruler, Snowflake } from 'lucide-react';
import { Price, Stock, AddButton } from './productParts';
import { productOf, viewProduct, type A2uiProduct } from './productTypes';
import { useTranslation } from 'react-i18next';

/**
 * ProductFacts: hiện thông tin mô tả của một sản phẩm (bảo quản/sơ chế, xuất xứ, dinh dưỡng, thông số,
 * VSATTP, mô tả) khi khách hỏi "bảo quản thế nào", "xuất xứ đâu", "làm từ gì"…
 * Nội dung lấy nguyên văn từ DB qua data model (facts); AI chỉ chọn mục nào hiện, không viết lại nội dung.
 * Khớp component ProductFacts trong bite-to-business.catalog.json ở BE.
 */

type Section = 'storage' | 'origin' | 'nutrition' | 'technical' | 'compliance' | 'description';

const SECTION_LABEL: Record<Section, { label: string; icon: typeof Info }> = {
    storage: { label: 'Bảo quản & sơ chế', icon: Snowflake },
    origin: { label: 'Xuất xứ & nguồn gốc', icon: Globe2 },
    nutrition: { label: 'Thông tin dinh dưỡng', icon: Leaf },
    technical: { label: 'Cách nhận diện sản phẩm', icon: Ruler },
    compliance: { label: 'An toàn thực phẩm & hóa đơn', icon: FileCheck2 },
    description: { label: 'Mô tả', icon: Info },
};

/** Nội dung của một mục; trả null khi DB chưa có dữ liệu để widget bỏ mục đó thay vì hiện ô trống. */
function sectionBody(product: A2uiProduct, section: Section, en: boolean) {
    const facts = product.facts ?? {};
    switch (section) {
        case 'storage':
            return facts.storage ? <p className="whitespace-pre-line">{facts.storage}</p> : null;
        case 'origin':
            if (!facts.origin && !facts.originDetail) return null;
            return (
                <div className="space-y-1">
                    {facts.origin && (
                        <p>
                            <strong>{en ? 'Origin:' : 'Xuất xứ:'}</strong> {facts.origin}
                            {facts.brand && ` · ${en ? 'Brand' : 'Thương hiệu'}: ${facts.brand}`}
                        </p>
                    )}
                    {facts.originDetail && (
                        <p className="whitespace-pre-line">{facts.originDetail}</p>
                    )}
                </div>
            );
        case 'nutrition':
            if (facts.nutritionVerified !== true || !facts.nutrition?.length) return null;
            return (
                <div>
                    {facts.nutritionBasis && (
                        <p className="mb-1 text-store-muted">
                            {en ? 'Reference values per' : 'Giá trị tham khảo trên'}{' '}
                            {facts.nutritionBasis}
                        </p>
                    )}
                    <table className="w-full">
                        <tbody>
                            {facts.nutrition.map((row) => (
                                <tr key={row.nutrient} className="border-t border-store-line/70">
                                    <td className="py-1">{row.nutrient}</td>
                                    <td className="py-1 text-right font-semibold">{row.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case 'technical':
            if (!facts.technical && facts.netWeightKg == null) return null;
            return (
                <div className="space-y-1">
                    {facts.netWeightKg != null && (
                        <p>
                            {en ? 'Net weight:' : 'Khối lượng tịnh:'} {facts.netWeightKg} kg
                        </p>
                    )}
                    {facts.technical && <p className="whitespace-pre-line">{facts.technical}</p>}
                </div>
            );
        case 'compliance':
            return facts.compliance ? (
                <p className="whitespace-pre-line">{facts.compliance}</p>
            ) : null;
        case 'description':
            return facts.description ? (
                <p className="whitespace-pre-line">{facts.description}</p>
            ) : null;
    }
}

export const ProductFactsApi = {
    name: 'ProductFacts',
    schema: z.object({
        weight: z.number().optional(),
        accessibility: CommonSchemas.AccessibilityAttributes.optional(),
        product: CommonSchemas.DynamicValue,
        sections: z.array(
            z.enum(['storage', 'origin', 'nutrition', 'technical', 'compliance', 'description']),
        ),
        showProduct: z.boolean().optional(),
    }),
};

export const ProductFacts = createComponentImplementation(
    ProductFactsApi,
    function ProductFactsView({ props, context }) {
        const { i18n } = useTranslation();
        const en = i18n.resolvedLanguage?.startsWith('en');
        const product = productOf(props.product);
        if (!product) return null;
        const sections = (props.sections as Section[])
            .map((section) => ({ section, body: sectionBody(product, section, !!en) }))
            .filter((item) => item.body != null);
        return (
            <article className="space-y-3 rounded-lg border border-store-line bg-white p-4 text-sm">
                {product.facts?.notes && (
                    <details className="rounded-xl bg-store-cream p-3 text-xs leading-6 text-store-muted">
                        <summary className="cursor-pointer font-semibold">
                            {en ? 'Sources and data limitations' : 'Nguồn và giới hạn dữ liệu'}
                        </summary>
                        <p className="mt-2">{product.facts.notes}</p>
                    </details>
                )}
                {(props.showProduct ?? true) && (
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => viewProduct(context, product)}
                            className="size-20 shrink-0 overflow-hidden rounded bg-store-cream"
                            aria-label={product.name}
                        >
                            {product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            )}
                        </button>
                        <div className="min-w-0 flex-1 space-y-1">
                            <button
                                type="button"
                                onClick={() => viewProduct(context, product)}
                                className="border-0 bg-transparent p-0 text-left font-bold text-store-ink hover:underline"
                            >
                                {product.name}
                            </button>
                            {product.spec && (
                                <p className="text-xs text-store-muted">{product.spec}</p>
                            )}
                            <Price product={product} />
                            <Stock product={product} />
                            <AddButton context={context} product={product} />
                        </div>
                    </div>
                )}
                {sections.length === 0 ? (
                    <p className="text-store-muted">
                        {en
                            ? 'This product does not have verified details for the requested section.'
                            : 'Sản phẩm này chưa có thông tin đã xác minh cho mục bạn hỏi.'}
                    </p>
                ) : (
                    sections.map(({ section, body }) => {
                        const { label, icon: Icon } = SECTION_LABEL[section];
                        return (
                            <section key={section} className="border-t border-store-line pt-3">
                                <h3 className="mb-1 flex items-center gap-1 text-sm font-bold text-store-green">
                                    <Icon size={14} aria-hidden="true" />{' '}
                                    {en
                                        ? {
                                              storage: 'Storage and preparation',
                                              origin: 'Origin',
                                              nutrition: 'Nutrition',
                                              technical: 'Specifications',
                                              compliance: 'Documentation',
                                              description: 'Description',
                                          }[section]
                                        : label}
                                </h3>
                                <div className="text-[13px] leading-relaxed text-store-ink">
                                    {body}
                                </div>
                            </section>
                        );
                    })
                )}
            </article>
        );
    },
);
