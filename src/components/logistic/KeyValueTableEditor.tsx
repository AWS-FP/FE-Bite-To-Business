export type KeyValueRow = { key: string; value: string };

type Props = {
    rows: KeyValueRow[];
    onChange: (rows: KeyValueRow[]) => void;
    // Tiêu đề 2 cột, ví dụ ["Thông số", "Giá trị"] hoặc ["Thành phần dinh dưỡng", "Hàm lượng"].
    columns: [string, string];
    placeholders?: [string, string];
    maxLengths?: [number, number];
    maxRows?: number;
    addLabel: string;
    removeLabel: string;
    caption?: string;
};

const cellInputClass =
    'w-full rounded border border-black/40 bg-white px-3 py-2 text-sm font-normal text-black outline-none focus:border-black focus:ring-0';

/** Bảng nhập 2 cột, mỗi thông tin là một dòng; thêm/xóa dòng tùy số thông tin cần nhập. */
export default function KeyValueTableEditor({
    rows,
    onChange,
    columns,
    placeholders,
    maxLengths = [100, 200],
    maxRows = 40,
    addLabel,
    removeLabel,
    caption,
}: Props) {
    const update = (index: number, field: keyof KeyValueRow, text: string) =>
        onChange(rows.map((row, i) => (i === index ? { ...row, [field]: text } : row)));

    return (
        <div className="space-y-3">
            <div className="overflow-hidden rounded border border-black/40">
                <table className="w-full table-fixed border-collapse text-sm">
                    {caption && <caption className="bg-store-cream px-3 pt-2 text-left text-xs font-bold">{caption}</caption>}
                    <thead className="bg-store-cream">
                        <tr>
                            <th scope="col" className="px-3 py-2 text-left font-semibold">
                                {columns[0]}
                            </th>
                            <th scope="col" className="px-3 py-2 text-left font-semibold">
                                {columns[1]}
                            </th>
                            <th scope="col" className="w-14">
                                <span className="sr-only">{removeLabel}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-t border-black/10">
                                {(['key', 'value'] as const).map((field, column) => (
                                    <td key={field} className="px-2 py-2">
                                        <input
                                            aria-label={`${columns[column]} ${index + 1}`}
                                            value={row[field]}
                                            maxLength={maxLengths[column]}
                                            placeholder={placeholders?.[column]}
                                            onChange={(e) => update(index, field, e.target.value)}
                                            className={cellInputClass}
                                        />
                                    </td>
                                ))}
                                <td className="px-1 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onChange(rows.filter((_, i) => i !== index))}
                                        className="text-sm text-red-700"
                                    >
                                        {removeLabel}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                type="button"
                disabled={rows.length >= maxRows}
                onClick={() => onChange([...rows, { key: '', value: '' }])}
                className="rounded border border-black px-3 py-2 text-sm font-semibold disabled:opacity-50"
            >
                {addLabel}
            </button>
        </div>
    );
}
