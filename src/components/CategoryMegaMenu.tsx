
import { useEffect, useRef, useState } from 'react';

import { CATEGORIES } from './categoryData';
import type { CategoryId } from './categoryData';

import './categoryMegaMenu.css';

interface CategoryMegaMenuProps {
    open: boolean;
    onClose: () => void;
    top: number;
}

const ICON_ROOT = '/images/ui/category';

export default function CategoryMegaMenu({
    open,
    onClose,
    top,
}: CategoryMegaMenuProps) {
    const [selectedId, setSelectedId] =
        useState<CategoryId>('meat');

    const [selectedSubcategory, setSelectedSubcategory] =
        useState<string | null>(null);

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const selected =
        CATEGORIES.find((item) => item.id === selectedId) ??
        CATEGORIES[0];

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
            className="btb-cmega"
            id="btb-category-mega-menu"
            style={{ top: `${Math.max(0, top)}px` }}
        >
            {/* Nền tối bên ngoài menu */}
            <div
                className="btb-cmega-backdrop"
                aria-hidden="true"
                onClick={onClose}
            />

            <section
                className="btb-cmega-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="btb-cmega-title"
            >
                {/* Thanh tiêu đề */}
                <div className="btb-cmega-toolbar">
                    <div className="btb-cmega-toolbar-title">
                        <span className="btb-cmega-kicker">
                            KHÁM PHÁ SẢN PHẨM
                        </span>

                        <h2 id="btb-cmega-title">
                            Danh mục ngành hàng
                        </h2>
                    </div>

                    <div className="btb-cmega-toolbar-actions">
                        <span className="btb-cmega-all-count">
                            Tất cả {CATEGORIES.length} nhóm
                        </span>

                        <button
                            ref={closeButtonRef}
                            type="button"
                            className="btb-cmega-close"
                            aria-label="Đóng danh mục"
                            onClick={onClose}
                        >
                            <img
                                src={`${ICON_ROOT}/close.svg`}
                                width={19}
                                height={19}
                                alt=""
                            />
                        </button>
                    </div>
                </div>

                {/* Nội dung 2 cột */}
                <div className="btb-cmega-content">
                    {/* Cột trái: 14 nhóm ngành hàng */}
                    <aside
                        className="btb-cmega-sidebar"
                        aria-label="Danh sách nhóm ngành hàng"
                    >
                        {CATEGORIES.map((category, index) => (
                            <button
                                key={category.id}
                                type="button"
                                className={`btb-cmega-nav-item${selectedId === category.id ? ' is-active' : ''
                                    }`}
                                aria-pressed={selectedId === category.id}
                                onMouseEnter={() =>
                                    selectCategory(category.id)
                                }
                                onFocus={() => selectCategory(category.id)}
                                onClick={() => selectCategory(category.id)}
                            >
                                <img
                                    className="btb-cmega-nav-icon"
                                    src={`${ICON_ROOT}/${category.id}.svg`}
                                    width={23}
                                    height={23}
                                    alt=""
                                />

                                <span className="btb-cmega-nav-label">
                                    {category.name}
                                </span>

                                <span className="btb-cmega-nav-index">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <img
                                    className="btb-cmega-chevron"
                                    src={`${ICON_ROOT}/chevron-right.svg`}
                                    width={12}
                                    height={12}
                                    alt=""
                                />
                            </button>
                        ))}
                    </aside>

                    {/* Cột phải: Nội dung nhóm đang chọn */}
                    <div className="btb-cmega-detail">
                        <div className="btb-cmega-detail-head">
                            <div>
                                <span className="btb-cmega-kicker">
                                    ĐANG XEM NHÓM HÀNG
                                </span>

                                <h3>{selected.name}</h3>

                                <p>{selected.caption}</p>
                            </div>

                            <span className="btb-cmega-product-count">
                                {selected.count} sản phẩm mẫu
                            </span>
                        </div>

                        <h4 className="btb-cmega-subheading">
                            Nhóm sản phẩm
                        </h4>

                        {/* Danh mục con */}
                        <div className="btb-cmega-subgrid">
                            {selected.subcategories.map(
                                (subcategory, index) => (
                                    <button
                                        type="button"
                                        key={`${selected.id}-${subcategory}`}
                                        className={`btb-cmega-subcard${selectedSubcategory === subcategory
                                                ? ' is-selected'
                                                : ''
                                            }`}
                                        aria-pressed={
                                            selectedSubcategory === subcategory
                                        }
                                        onClick={() =>
                                            setSelectedSubcategory(subcategory)
                                        }
                                    >
                                        <span
                                            className="btb-cmega-sub-image"
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

                                        <span className="btb-cmega-sub-name">
                                            {subcategory}
                                        </span>

                                        <span className="btb-cmega-sub-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>

                        {/* Trạng thái chọn danh mục con */}
                        {selectedSubcategory && (
                            <p
                                className="btb-cmega-selection"
                                role="status"
                            >
                                Đang chọn: <strong>{selectedSubcategory}</strong>
                                {' '}— giao diện demo, chưa lọc bằng API.
                            </p>
                        )}

                        {/* Khung chờ thương hiệu */}
                        <div className="btb-cmega-brands-head">
                            <div>
                                <h4 className="btb-cmega-subheading">
                                    Thương hiệu nổi bật
                                </h4>

                                <p>
                                    Vị trí dành cho logo thương hiệu khi
                                    hoàn thiện website.
                                </p>
                            </div>
                        </div>

                        <div
                            className="btb-cmega-brands"
                            aria-label="Khung chờ logo thương hiệu"
                        >
                            {[1, 2, 3, 4].map((number) => (
                                <div
                                    className="btb-cmega-brand-placeholder"
                                    key={number}
                                >
                                    <img
                                        src={`${ICON_ROOT}/image-placeholder.svg`}
                                        width={22}
                                        height={22}
                                        alt=""
                                    />

                                    <span>
                                        Logo {String(number).padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chân Mega Menu */}
                <div className="btb-cmega-bottom">
                    <span>
                        14 nhóm nguyên liệu — mua hàng theo nhu cầu bếp
                    </span>

                    <strong>
                        Đang xem: {selected.name}
                    </strong>
                </div>
            </section>
        </div>
    );
}
