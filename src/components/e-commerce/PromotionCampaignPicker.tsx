import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { dropdownPosition } from '@/utils/e-commerce/dropdownPosition';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import type { Promotion } from '@/types/e-commerce/executiveAdmin';

type Props = {
    value: string;
    selected: Promotion | null;
    items: Promotion[];
    total: number;
    page: number;
    pageSize: number;
    loading: boolean;
    search: string;
    onSearch: (value: string) => void;
    onPageChange: (page: number) => void;
    onChange: (id: string) => void;
};

/** Searchable, paginated campaign picker. Results are searched server-side, not just in the first 100 items. */
export default function PromotionCampaignPicker({
    value,
    selected,
    items,
    total,
    page,
    pageSize,
    loading,
    search,
    onSearch,
    onPageChange,
    onChange,
}: Props) {
    const tr = useExecutiveText();
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<ReturnType<typeof dropdownPosition> | null>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);

    function showPicker() {
        if (open) {
            setOpen(false);
            return;
        }
        const rect = trigger.current?.getBoundingClientRect();
        if (!rect) return;
        setPosition(dropdownPosition(rect, 300, 410));
        setOpen(true);
    }

    useEffect(() => {
        if (!open) return;
        searchInput.current?.focus({ preventScroll: true });
        const onOutside = (event: PointerEvent) => {
            const node = event.target as Node;
            if (!trigger.current?.contains(node) && !panel.current?.contains(node)) setOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setOpen(false);
                trigger.current?.focus();
            }
        };
        const closeOnScroll = (event: Event) => {
            if (!panel.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('pointerdown', onOutside);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', closeOnScroll, true);
        const closeOnResize = () => setOpen(false);
        window.addEventListener('resize', closeOnResize);
        return () => {
            document.removeEventListener('pointerdown', onOutside);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', closeOnScroll, true);
            window.removeEventListener('resize', closeOnResize);
        };
    }, [open]);

    const pages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="min-w-0">
            <span className="mb-1.5 block text-xs font-bold text-[#43634e]">
                {tr('Chọn chiến dịch', 'Select a campaign')}
            </span>
            <button
                type="button"
                ref={trigger}
                onClick={showPicker}
                aria-haspopup="dialog"
                aria-expanded={open}
                className={executiveUi.selectTrigger}
            >
                <span className="min-w-0 truncate">
                    {selected
                        ? `${tr(selected.nameVi, selected.nameEn)} · ${selected.status}`
                        : tr('Chọn chiến dịch...', 'Choose campaign...')}
                </span>
                <ChevronDown
                    size={17}
                    className={`shrink-0 text-[#276747] ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && position &&
                createPortal(
                    <div
                        ref={panel}
                        role="dialog"
                        aria-label={tr('Tìm chiến dịch', 'Find a campaign')}
                        style={{
                            position: 'fixed',
                            ...position,
                            zIndex: 350,
                        }}
                        className={`${executiveUi.selectPanel} flex flex-col overflow-y-auto overscroll-contain !p-0`}
                    >
                        <div className="shrink-0 border-b border-[#e0e8de] p-3">
                            <div className={executiveUi.selectSearch}>
                                <Search size={16} className="shrink-0 text-[#4d7b61]" />
                                <input
                                    ref={searchInput}
                                    value={search}
                                    maxLength={100}
                                    onChange={(e) => {
                                        onSearch(e.target.value);
                                        onPageChange(0);
                                    }}
                                    placeholder={tr(
                                        'Tìm theo tên chiến dịch...',
                                        'Search campaign names...',
                                    )}
                                    aria-label={tr(
                                        'Tìm theo tên chiến dịch',
                                        'Search campaign names',
                                    )}
                                    className={executiveUi.selectSearchInput}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSearch('');
                                            onPageChange(0);
                                            searchInput.current?.focus();
                                        }}
                                        aria-label={tr('Xóa tìm kiếm', 'Clear search')}
                                        className="grid size-7 shrink-0 place-items-center rounded-md !border-0 bg-transparent text-store-muted !outline-none !shadow-none hover:bg-surface-green focus-visible:!bg-surface-green"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <p className="mb-0 mt-2 text-xs text-[#64806b]">
                                {loading
                                    ? tr('Đang tìm...', 'Searching...')
                                    : tr(`${total} chiến dịch`, `${total} campaigns`)}
                            </p>
                        </div>
                        <div
                            role="listbox"
                            aria-label={tr('Danh sách chiến dịch', 'Campaign results')}
                            className="min-h-0 flex-1 overflow-y-auto p-1.5"
                        >
                            {loading && (
                                <p
                                    role="status"
                                    className="px-3 py-7 text-center text-sm text-[#688271]"
                                >
                                    {tr('Đang tìm kiếm...', 'Searching...')}
                                </p>
                            )}
                            {!loading && items.length === 0 && (
                                <p className="px-3 py-8 text-center text-sm text-[#688271]">
                                    {tr(
                                        'Không tìm thấy chiến dịch phù hợp.',
                                        'No matching campaigns.',
                                    )}
                                </p>
                            )}
                            {!loading &&
                                items.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="option"
                                        aria-selected={value === item.id}
                                        onClick={() => {
                                            onChange(item.id);
                                            setOpen(false);
                                            trigger.current?.focus();
                                        }}
                                        className={executiveUi.selectOption}
                                    >
                                        <span className="min-w-0">
                                            <span className="block break-words font-semibold text-[#234b36]">
                                                {tr(item.nameVi, item.nameEn)}
                                            </span>
                                            <span className="text-[11px] text-[#667d6b]">
                                                {item.status}
                                            </span>
                                        </span>
                                        {item.id === value && (
                                            <Check size={16} className="shrink-0 text-[#205b3b]" />
                                        )}
                                    </button>
                                ))}
                        </div>
                        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e0e8de] bg-[#fafcf8] px-3 py-2">
                            <span className="text-xs font-medium text-[#64806b]">
                                {tr('Trang', 'Page')} {page + 1}/{pages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={loading || page === 0}
                                    onClick={() => onPageChange(page - 1)}
                                    aria-label={tr('Trang trước', 'Previous page')}
                                    className="rounded-lg border border-[#c7d8ca] bg-white p-2 text-[#214b36] disabled:opacity-35"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    disabled={loading || page + 1 >= pages}
                                    onClick={() => onPageChange(page + 1)}
                                    aria-label={tr('Trang tiếp', 'Next page')}
                                    className="rounded-lg border border-[#c7d8ca] bg-white p-2 text-[#214b36] disabled:opacity-35"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
