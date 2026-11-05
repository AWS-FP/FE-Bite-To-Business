import { useEffect, useRef, useState } from 'react';

import { CATEGORIES } from './categoryData';
import type { CategoryId } from './categoryData';

interface CategoryMegaMenuProps {
    open: boolean;
    onClose: () => void;
    top: number;
}

const ICON_ROOT = '/images/ui/category';

export default function CategoryMegaMenu({ open, onClose, top }: CategoryMegaMenuProps) {
    const [selectedId, setSelectedId] = useState<CategoryId>('meat');

    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const selected = CATEGORIES.find((item) => item.id === selectedId) ?? CATEGORIES[0];

    function selectCategory(id: CategoryId) {
        if (id !== selectedId) {
            setSelectedId(id);
            setSelectedSubcategory(null);
        }
    }

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        closeButtonRef.current?.focus();

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-x-0 bottom-0 z-[100] flex box-border font-body text-store-ink [&_*]:box-border"
            id="btb-category-mega-menu"
            style={{ top: `${Math.max(0, top)}px` }}
        >
            {/* Nền tối bên ngoài menu */}
            <div
                className="absolute inset-0 bg-store-dark/66 backdrop-blur-[2px]"
                aria-hidden="true"
                onClick={onClose}
            />

            <section
                className="relative flex h-full w-[min(1120px,96vw)] flex-col overflow-hidden border-r-[3px] border-solid border-store-ink bg-store-cream shadow-[9px_0_0_var(--color-store-ink)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="btb-cmega-title"
            >
                {/* Thanh tiêu đề */}
                <div className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-solid border-store-ink bg-store-green px-[26px] py-[17px]">
                    <div className="min-w-0">
                        <span className="block font-label text-[11px] font-semibold tracking-[1.3px] uppercase text-store-coral">
                            KHÁM PHÁ SẢN PHẨM
                        </span>

                        <h2
                            className="mt-1 font-subheading text-[clamp(20px,2vw,27px)] font-normal leading-[1.15] text-store-cream"
                            id="btb-cmega-title"
                        >
                            Danh mục ngành hàng
                        </h2>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center rounded-[7px] border-2 border-solid border-store-ink bg-store-yellow px-3 py-[9px] text-xs font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]">
                            Tất cả {CATEGORIES.length} nhóm
                        </span>

                        <button
                            ref={closeButtonRef}
                            type="button"
                            className="grid h-[38px] w-[38px] shrink-0 cursor-pointer place-items-center rounded-[7px] border-2 border-solid border-store-ink bg-store-cream shadow-[3px_3px_0_var(--color-store-ink)] hover:bg-store-yellow focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-store-coral"
                            aria-label="Đóng danh mục"
                            onClick={onClose}
                        >
                            <img src={`${ICON_ROOT}/close.svg`} width={19} height={19} alt="" />
                        </button>
                    </div>
                </div>

                {/* Nội dung 2 cột */}
                <div className="grid min-h-0 flex-1 grid-cols-[265px_minmax(0,1fr)]">
                    {/* Cột trái: 14 nhóm ngành hàng */}
                    <aside
                        className="overflow-y-auto border-r-2 border-solid border-store-ink bg-store-cream px-2 py-3 [scrollbar-width:thin]"
                        aria-label="Danh sách nhóm ngành hàng"
                    >
                        {CATEGORIES.map((category, index) => (
                            <button
                                key={category.id}
                                type="button"
                                className={`my-px flex min-h-11 w-full cursor-pointer items-center gap-[9px] rounded-[7px] border border-solid border-transparent bg-transparent px-2.5 py-[9px] text-left font-body text-xs font-semibold text-store-ink transition-colors hover:border-store-ink hover:bg-store-yellow focus-visible:border-store-ink focus-visible:bg-store-yellow focus-visible:outline-none${
                                    selectedId === category.id
                                        ? ' !border-store-ink !bg-store-yellow shadow-[2px_2px_0_var(--color-store-ink)]'
                                        : ''
                                }`}
                                aria-pressed={selectedId === category.id}
                                onMouseEnter={() => selectCategory(category.id)}
                                onFocus={() => selectCategory(category.id)}
                                onClick={() => selectCategory(category.id)}
                            >
                                <img
                                    className="block shrink-0 object-contain"
                                    src={`${ICON_ROOT}/${category.id}.svg`}
                                    width={23}
                                    height={23}
                                    alt=""
                                />

                                <span className="min-w-0 flex-1 leading-[1.3]">
                                    {category.name}
                                </span>

                                <span className="font-price text-[10px] font-semibold text-store-muted">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <img
                                    className="h-3 w-3 shrink-0"
                                    src={`${ICON_ROOT}/chevron-right.svg`}
                                    width={12}
                                    height={12}
                                    alt=""
                                />
                            </button>
                        ))}
                    </aside>

                    {/* Cột phải: Nội dung nhóm đang chọn */}
                    <div className="min-w-0 overflow-y-auto px-7 pt-[25px] pb-[30px] [scrollbar-width:thin]">
                        <div className="flex items-end justify-between gap-[18px] border-b border-dashed border-store-ink/25 pb-[17px] [&_h3]:mt-1 [&_h3]:mb-[5px] [&_h3]:font-subheading [&_h3]:text-[clamp(25px,3vw,35px)] [&_h3]:font-normal [&_h3]:leading-[1.15] [&_p]:m-0 [&_p]:font-subtext [&_p]:text-xs [&_p]:font-medium [&_p]:leading-[1.6] [&_p]:text-store-muted">
                            <div>
                                <span className="block font-label text-[11px] font-semibold tracking-[1.3px] uppercase text-store-coral">
                                    ĐANG XEM NHÓM HÀNG
                                </span>

                                <h3>{selected.name}</h3>

                                <p>{selected.caption}</p>
                            </div>

                            <span className="shrink-0 rounded-md border-2 border-solid border-store-ink bg-store-coral px-[13px] py-2.5 font-price text-xs font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]">
                                {selected.count} sản phẩm mẫu
                            </span>
                        </div>

                        <h4 className="mt-[23px] mb-[13px] font-subheading text-base font-bold leading-[1.4]">
                            Nhóm sản phẩm
                        </h4>

                        {/* Danh mục con */}
                        <div className="grid grid-cols-4 gap-[13px]">
                            {selected.subcategories.map((subcategory, index) => (
                                <button
                                    type="button"
                                    key={`${selected.id}-${subcategory}`}
                                    className={`relative flex min-w-0 cursor-pointer flex-col items-center gap-2 rounded-[9px] border-2 border-solid border-store-ink bg-store-cream px-[7px] pt-3 pb-[11px] font-body text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-store-coral${
                                        selectedSubcategory === subcategory
                                            ? ' !bg-store-yellow'
                                            : ''
                                    }`}
                                    aria-pressed={selectedSubcategory === subcategory}
                                    onClick={() => setSelectedSubcategory(subcategory)}
                                >
                                    <span
                                        className="flex aspect-square w-[min(100%,90px)] flex-col items-center justify-center gap-1 rounded-[7px] border-[1.5px] border-dashed border-store-line bg-store-cream font-label text-[10px] text-store-muted"
                                        aria-hidden="true"
                                    >
                                        <img
                                            src={`${ICON_ROOT}/image-placeholder.svg`}
                                            width={27}
                                            height={27}
                                            alt=""
                                        />
                                        <span>Ảnh</span>
                                    </span>

                                    <span className="text-center font-subheading text-xs font-semibold leading-[1.35]">
                                        {subcategory}
                                    </span>

                                    <span className="absolute top-[5px] left-1.5 font-price text-[10px] text-store-muted">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Trạng thái chọn danh mục con */}
                        {selectedSubcategory && (
                            <p
                                className="mt-4 rounded border-l-[3px] border-solid border-store-coral bg-store-cream px-3 py-2.5 font-body text-xs leading-[1.6] text-store-green"
                                role="status"
                            >
                                Đang chọn: <strong>{selectedSubcategory}</strong> — giao diện demo,
                                chưa lọc bằng API.
                            </p>
                        )}

                        {/* Khung chờ thương hiệu */}
                        <div className="flex items-end gap-[15px] [&_p]:mt-[-8px] [&_p]:mb-[13px] [&_p]:text-[11px] [&_p]:text-store-muted">
                            <div>
                                <h4 className="mt-[23px] mb-[13px] font-subheading text-base font-bold leading-[1.4]">
                                    Thương hiệu nổi bật
                                </h4>

                                <p>Vị trí dành cho logo thương hiệu khi hoàn thiện website.</p>
                            </div>
                        </div>

                        <div
                            className="grid grid-cols-4 gap-[13px]"
                            aria-label="Khung chờ logo thương hiệu"
                        >
                            {[1, 2, 3, 4].map((number) => (
                                <div
                                    className="flex min-h-[75px] flex-col items-center justify-center gap-[5px] rounded-lg border border-dashed border-store-line bg-store-cream text-[10px] text-store-muted"
                                    key={number}
                                >
                                    <img
                                        src={`${ICON_ROOT}/image-placeholder.svg`}
                                        width={22}
                                        height={22}
                                        alt=""
                                    />

                                    <span>Logo {String(number).padStart(2, '0')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chân Mega Menu */}
                <div className="flex shrink-0 items-center justify-between gap-4 border-t-2 border-solid border-store-ink bg-surface-green px-[26px] py-[13px] text-[11px] font-semibold text-store-green [&_strong]:font-subheading [&_strong]:text-store-ink">
                    <span>14 nhóm nguyên liệu — mua hàng theo nhu cầu bếp</span>

                    <strong>Đang xem: {selected.name}</strong>
                </div>
            </section>
        </div>
    );
}
