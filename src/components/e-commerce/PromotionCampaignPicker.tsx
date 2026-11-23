import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
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
    const [position, setPosition] = useState({ top: 0, left: 0, width: 320, maxHeight: 380 });
    const trigger = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);

    function showPicker() {
        if (open) {
            setOpen(false);
            return;
        }
        const rect = trigger.current?.getBoundingClientRect();
        if (rect) {
            const width = Math.min(Math.max(rect.width, 300), window.innerWidth - 16);
            const availableBelow = window.innerHeight - rect.bottom - 12;
            const maxHeight = Math.min(410, Math.max(220, window.innerHeight - 32));
            const top =
                availableBelow >= Math.min(340, maxHeight)
                    ? rect.bottom + 6
                    : Math.max(8, rect.top - maxHeight - 6);
            setPosition({
                top,
                left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
                width,
                maxHeight: Math.min(maxHeight, window.innerHeight - top - 8),
            });
        }
        setOpen(true);
    }

    useEffect(() => {
        if (!open) return;
        searchInput.current?.focus();
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
                className={`${executiveUi.input} flex !h-11 items-center justify-between gap-2 !rounded-xl !border-[#bdd5c4] !bg-[#f8fbf6] text-left !font-semibold shadow-sm hover:!border-[#4e9970] focus-visible:!ring-4 focus-visible:!ring-[#c5eacb]`}
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
            {open &&
                createPortal(
                    <div
                        ref={panel}
                        role="dialog"
                        aria-label={tr('Tìm chiến dịch', 'Find a campaign')}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            width: position.width,
                            maxHeight: position.maxHeight,
                            zIndex: 350,
                        }}
                        className="flex flex-col overflow-hidden rounded-2xl border border-[#d3e4d6] bg-white shadow-[0_20px_55px_rgba(16,55,35,.22)]"
                    >
                        <div className="shrink-0 border-b border-[#e0e8de] p-3">
                            <div className="flex items-center gap-2 rounded-xl border border-[#bad1bf] bg-[#f8fbf6] px-3 focus-within:ring-2 focus-within:ring-emerald-200">
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
                                    className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm text-[#153b2c] outline-none placeholder:text-[#7d9685]"
                                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
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
                                        className="text-[#5b7c68]"
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
                                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm outline-none transition hover:bg-[#edf7ec] focus-visible:ring-2 focus-visible:ring-[#29895d] ${item.id === value ? 'bg-[#fff0ac]' : ''}`}
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
