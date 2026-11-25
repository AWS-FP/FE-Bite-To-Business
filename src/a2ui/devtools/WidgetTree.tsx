import { useState } from 'react';
import { Boxes, Network, X } from 'lucide-react';
import { btbCatalog } from '../catalog/btbCatalog';

type Node = {
    id: string;
    component: string;
    children?: unknown;
    child?: unknown;
    [key: string]: unknown;
};

/** Mô tả ngắn từng widget trong thư viện (khớp ai/catalog.json ở BE). */
const LIBRARY: Record<string, string> = {
    Text: 'Văn bản',
    Row: 'Xếp ngang',
    Column: 'Xếp dọc',
    Card: 'Khung',
    Divider: 'Đường kẻ',
    Button: 'Nút (action cho phép)',
    PageHeader: 'Đầu trang',
    Section: 'Khối có tiêu đề',
    ProductGrid: 'Lưới sản phẩm',
    ProductTable: 'Bảng so sánh',
    ProductCarousel: 'Dải sản phẩm',
    ProductCard: 'Một sản phẩm',
    PriceTiers: 'Bậc giá sỉ',
    ProductFacts: 'Bảo quản, xuất xứ, dinh dưỡng',
    InventoryBadge: 'Tồn kho',
    BannerCarousel: 'Banner',
    CategoryGrid: 'Danh mục',
    ComboList: 'Combo',
    PromotionList: 'Khuyến mãi',
    ReorderList: 'Mua lại',
    CartSummary: 'Giỏ hàng',
    Notice: 'Thông báo',
    ClarifyQuestion: 'Câu hỏi làm rõ',
    SuggestedPrompts: 'Gợi ý tiếp theo',
};

function bindings(node: Node): string[] {
    return Object.entries(node)
        .filter(
            ([key, value]) =>
                key !== 'children' && value && typeof value === 'object' && 'path' in value,
        )
        .map(([key, value]) => `${key} → ${(value as { path: string }).path}`);
}

function childIds(node: Node): string[] {
    if (Array.isArray(node.children))
        return node.children.filter((id): id is string => typeof id === 'string');
    return typeof node.child === 'string' ? [node.child] : [];
}

function TreeNode({ id, nodes, depth }: { id: string; nodes: Map<string, Node>; depth: number }) {
    const node = nodes.get(id);
    if (!node || depth > 12) return <li className="text-red-700">⚠ {id} (không tồn tại)</li>;
    const kids = childIds(node);
    return (
        <li>
            <div className="flex flex-wrap items-center gap-1 py-0.5">
                <span className="rounded bg-store-green px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {node.component}
                </span>
                <span className="font-mono text-[11px] text-store-muted">#{node.id}</span>
                {bindings(node).map((binding) => (
                    <span
                        key={binding}
                        className="rounded bg-store-mint/60 px-1 font-mono text-[10px]"
                    >
                        {binding}
                    </span>
                ))}
            </div>
            {kids.length > 0 && (
                <ul className="ml-3 border-l border-store-line pl-2">
                    {kids.map((kid) => (
                        <TreeNode key={kid} id={kid} nodes={nodes} depth={depth + 1} />
                    ))}
                </ul>
            )}
        </li>
    );
}

/**
 * Bảng kiểm tra cho nghiên cứu/demo: cây widget AI vừa ghép (component, id, path dữ liệu) và thư viện widget
 * mà AI được phép dùng. Chỉ đọc message updateComponents, không đọc giá hay dữ liệu khách.
 */
export default function WidgetTree({
    message,
    onClose,
}: {
    message: unknown;
    onClose: () => void;
}) {
    const [tab, setTab] = useState<'tree' | 'library'>('tree');
    const components =
        (message as { updateComponents?: { components?: Node[] } } | undefined)?.updateComponents
            ?.components ?? [];
    const nodes = new Map(components.map((node) => [node.id, node]));
    const used = new Set(components.map((node) => node.component));
    return (
        <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-store-line bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-store-line px-4 py-3">
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setTab('tree')}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold ${tab === 'tree' ? 'bg-store-green text-white' : ''}`}
                    >
                        <Network size={14} aria-hidden="true" /> Cây widget ({components.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('library')}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold ${tab === 'library' ? 'bg-store-green text-white' : ''}`}
                    >
                        <Boxes size={14} aria-hidden="true" /> Thư viện
                    </button>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded p-1 hover:bg-store-cream"
                >
                    <X size={16} aria-hidden="true" />
                    <span className="sr-only">Đóng</span>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 text-xs">
                {tab === 'tree' ? (
                    nodes.has('root') ? (
                        <ul>
                            <TreeNode id="root" nodes={nodes} depth={0} />
                        </ul>
                    ) : (
                        <p className="text-store-muted">Chưa có cây widget.</p>
                    )
                ) : (
                    <ul className="space-y-1">
                        {[...btbCatalog.components.keys()].map((name) => (
                            <li
                                key={name}
                                className="flex items-center justify-between gap-2 rounded border border-store-line px-2 py-1"
                            >
                                <span>
                                    <span className="font-bold">{name}</span>{' '}
                                    <span className="text-store-muted">{LIBRARY[name] ?? ''}</span>
                                </span>
                                {used.has(name) && (
                                    <span className="rounded bg-store-mint px-1 text-[10px] font-bold">
                                        đang dùng
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
}
