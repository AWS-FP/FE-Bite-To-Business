import type { ReactNode } from 'react';

// Một dòng dinh dưỡng: tên tiếng Việt, tên tiếng Anh, hàm lượng dùng chung.
export type NutritionRow = { vi: string; en: string; amount: string };

type Lang = 'vi' | 'en';

type Props = {
    rows: NutritionRow[];
    onChange: (rows: NutritionRow[]) => void;
    labels: {
        heading: Record<Lang, string>;
        nutrient: Record<Lang, string>;
        amount: Record<Lang, string>;
        addRow: string;
        remove: string;
        nutrientPlaceholder: Record<Lang, string>;
        amountPlaceholder: string;
    };
    // Nội dung thêm trên đầu mỗi bảng, ví dụ nút "Dịch từ tiếng Việt".
    headerExtra?: (lang: Lang) => ReactNode;
    maxRows?: number;
};

const cellInputClass =
    'w-full rounded border border-black/40 bg-white px-3 py-2 text-sm font-normal text-black outline-none focus:border-black focus:ring-0';

/**
 * Hai bảng VI/EN luôn đồng bộ số dòng: thêm/xóa dòng ở bảng nào thì bảng kia cũng thêm/xóa.
 * Chỉ tên thành phần khác ngôn ngữ; hàm lượng là một giá trị chung cho cả hai bảng.
 */
export default function BilingualNutritionEditor({ rows, onChange, labels, headerExtra, maxRows = 40 }: Props) {
    const update = (index: number, field: keyof NutritionRow, text: string) =>
        onChange(rows.map((row, i) => (i === index ? { ...row, [field]: text } : row)));

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
                {(['vi', 'en'] as const).map((lang) => (
                    <div key={lang} className="space-y-2">
                        <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                            <span>{labels.heading[lang]}</span>
                            {headerExtra?.(lang)}
                        </div>
                        <div className="overflow-hidden rounded border border-black/40">
                            <table className="w-full table-fixed border-collapse text-sm">
                                <thead className="bg-store-cream">
                                    <tr>
                                        <th scope="col" className="px-3 py-2 text-left font-semibold">
                                            {labels.nutrient[lang]}
                                        </th>
                                        <th scope="col" className="w-[34%] px-3 py-2 text-left font-semibold">
                                            {labels.amount[lang]}
                                        </th>
                                        <th scope="col" className="w-14">
                                            <span className="sr-only">{labels.remove}</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index} className="border-t border-black/10">
                                            <td className="px-2 py-2">
                                                <input
                                                    aria-label={`${labels.nutrient[lang]} ${index + 1}`}
                                                    value={row[lang]}
                                                    maxLength={100}
                                                    placeholder={labels.nutrientPlaceholder[lang]}
                                                    onChange={(e) => update(index, lang, e.target.value)}
                                                    className={cellInputClass}
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input
                                                    aria-label={`${labels.amount[lang]} ${index + 1}`}
                                                    value={row.amount}
                                                    maxLength={50}
                                                    placeholder={labels.amountPlaceholder}
                                                    onChange={(e) => update(index, 'amount', e.target.value)}
                                                    className={cellInputClass}
                                                />
                                            </td>
                                            <td className="px-1 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => onChange(rows.filter((_, i) => i !== index))}
                                                    className="text-sm text-red-700"
                                                >
                                                    {labels.remove}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
            <button
                type="button"
                disabled={rows.length >= maxRows}
                onClick={() => onChange([...rows, { vi: '', en: '', amount: '' }])}
                className="rounded border border-black px-3 py-2 text-sm font-semibold disabled:opacity-50"
            >
                {labels.addRow}
            </button>
        </div>
    );
}
