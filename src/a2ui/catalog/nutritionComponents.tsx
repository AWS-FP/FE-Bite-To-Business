import { z } from 'zod';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { useTranslation } from 'react-i18next';
import { productList, viewProduct } from './productTypes';

export const NutritionTableApi = {
    name: 'NutritionTable',
    schema: z.object({
        weight: z.number().optional(),
        accessibility: CommonSchemas.AccessibilityAttributes.optional(),
        items: CommonSchemas.DynamicValue,
        maxItems: z.number().int().min(1).max(6).optional(),
    }),
};

/** Values retain the recorded unit and basis. Missing nutrition remains explicitly unknown. */
export const NutritionTable = createComponentImplementation(
    NutritionTableApi,
    function NutritionTableView({ props, context }) {
        const { i18n } = useTranslation();
        const en = i18n.resolvedLanguage?.startsWith('en');
        const products = productList(props.items).slice(0, props.maxItems ?? 6);
        const notes = products.find((product) => product.facts?.notes)?.facts?.notes;
        const evidence = notes ? (
            <details className="rounded-xl bg-store-cream p-4 text-xs leading-6 text-store-muted">
                <summary className="cursor-pointer font-semibold">
                    {en
                        ? 'Reference values — sources and limitations'
                        : 'Số liệu tham khảo — nguồn và giới hạn'}
                </summary>
                <p className="mt-2">{notes}</p>
            </details>
        ) : null;
        const nutrients = [
            ...new Set(
                products.flatMap((product) =>
                    product.facts?.nutritionVerified === true
                        ? (product.facts.nutrition?.map((row) => row.nutrient) ?? [])
                        : [],
                ),
            ),
        ];
        if (!nutrients.length)
            return (
                <>
                    <p className="rounded-lg bg-store-cream p-4 text-sm text-store-muted">
                        {en
                            ? 'Verified nutrition is not available for these products. Existing unverified values cannot confirm nutritional requirements.'
                            : 'Các sản phẩm này chưa có số liệu dinh dưỡng đã đối chiếu nguồn. Dữ liệu chưa xác minh chưa đủ để xác nhận điều kiện dinh dưỡng.'}
                    </p>
                    {evidence}
                </>
            );
        return (
            <div className="space-y-3">
                {evidence}
                <p className="text-xs leading-relaxed text-store-muted">
                    {en
                        ? 'Values use each product’s recorded basis. Compare quantities only when units and serving sizes match.'
                        : 'Số liệu theo cơ sở ghi trên từng sản phẩm. Khi so sánh, cần dùng cùng đơn vị và khối lượng khẩu phần.'}
                </p>
                <div className="overflow-x-auto rounded-xl border border-store-line">
                    <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                        <caption className="sr-only">
                            {en ? 'Recorded product nutrition' : 'Dinh dưỡng từ hồ sơ sản phẩm'}
                        </caption>
                        <thead className="bg-store-mint/50">
                            <tr>
                                <th scope="col" className="p-3">
                                    {en ? 'Nutrient' : 'Thành phần'}
                                </th>
                                {products.map((product) => (
                                    <th
                                        key={product.productId}
                                        scope="col"
                                        className="min-w-40 p-3 align-top"
                                    >
                                        <button
                                            type="button"
                                            className="text-left font-semibold text-store-green hover:underline"
                                            onClick={() => viewProduct(context, product)}
                                        >
                                            {product.name}
                                        </button>
                                        <span className="mt-1 block text-xs font-normal text-store-muted">
                                            {product.facts?.nutritionBasis ??
                                                (en
                                                    ? 'Basis not specified'
                                                    : 'Chưa ghi cơ sở tính')}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {nutrients.map((nutrient) => (
                                <tr key={nutrient} className="border-t border-store-line">
                                    <th scope="row" className="p-3 font-medium">
                                        {nutrient}
                                    </th>
                                    {products.map((product) => (
                                        <td key={product.productId} className="p-3">
                                            {(product.facts?.nutritionVerified === true
                                                ? product.facts.nutrition
                                                : []
                                            )?.find((row) => row.nutrient === nutrient)?.amount ??
                                                (en ? 'Not provided' : 'Chưa có dữ liệu')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },
);
