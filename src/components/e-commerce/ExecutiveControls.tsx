import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';

type OptionProps = {
    value?: string;
    children?: ReactNode;
    disabled?: boolean;
    'data-search'?: string;
};
type SelectProps = {
    label?: string;
    ariaLabel?: string;
    value: string;
    onValueChange: (next: string) => void;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    /** When enabled, search appears inside the dropdown (not in every ExecutiveSelect). */
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
};

function normalizeSearch(value: string) {
    return value
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .trim();
}

/** Accessible, searchable-on-demand portal select. The list cannot be clipped by card overflow. */
export function ExecutiveSelect({
    label,
    ariaLabel,
    value,
    onValueChange,
    children,
    className = '',
    disabled = false,
    searchable = false,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No matches found',
}: SelectProps) {
    const options = Children.toArray(children)
        .filter(
            (node): node is ReactElement<OptionProps> =>
                isValidElement<OptionProps>(node) && node.type === 'option',
        )
        .map((node) => ({
            value: String(node.props.value ?? node.props.children ?? ''),
            label: String(node.props.children ?? ''),
            searchText: String(node.props['data-search'] ?? ''),
            disabled: Boolean(node.props.disabled),
        }));

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0, width: 220 });
    const trigger = useRef<HTMLButtonElement>(null);
    const menu = useRef<HTMLDivElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const selected = options.find((option) => option.value === value) ?? options[0];
    const term = normalizeSearch(search);
    const visibleOptions =
        searchable && term
            ? options.filter(
                  (option) =>
                      option.value &&
                      normalizeSearch(`${option.label} ${option.searchText}`).includes(term),
              )
            : options;
    const selectedIndex = Math.max(
        0,
        visibleOptions.findIndex((option) => option.value === value),
    );

    function closeMenu() {
        setOpen(false);
        setSearch('');
    }

    function openMenu() {
        if (disabled) return;
        if (open) {
            closeMenu();
            return;
        }
        const rect = trigger.current?.getBoundingClientRect();
        if (rect) {
            const width = Math.max(rect.width, 220);
            const maxTop = Math.max(12, window.innerHeight - 335);
            setPosition({
                top: Math.min(rect.bottom + 7, maxTop),
                left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
                width,
            });
        }
        setSearch('');
        setOpen(true);
    }

    function choose(next: string) {
        onValueChange(next);
        closeMenu();
        trigger.current?.focus();
    }

    useEffect(() => {
        if (!open) return;
        if (searchable) searchInput.current?.focus();
        else optionRefs.current[selectedIndex]?.focus();
        const outside = (event: globalThis.PointerEvent) => {
            const node = event.target as Node;
            if (!trigger.current?.contains(node) && !menu.current?.contains(node)) closeMenu();
        };
        const keyboard = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeMenu();
                trigger.current?.focus();
            }
        };
        const closeOnScroll = (event: Event) => {
            if (!menu.current?.contains(event.target as Node)) closeMenu();
        };
        document.addEventListener('pointerdown', outside);
        document.addEventListener('keydown', keyboard);
        window.addEventListener('scroll', closeOnScroll, true);
        return () => {
            document.removeEventListener('pointerdown', outside);
            document.removeEventListener('keydown', keyboard);
            window.removeEventListener('scroll', closeOnScroll, true);
        };
    }, [open, searchable, selectedIndex]);

    return (
        <div className={`relative min-w-0 ${className}`}>
            {label && (
                <span className="mb-1.5 block text-xs font-bold text-[#43634e]">{label}</span>
            )}
            <button
                type="button"
                ref={trigger}
                disabled={disabled}
                aria-label={ariaLabel ?? label}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={openMenu}
                onKeyDown={(event) => {
                    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                        event.preventDefault();
                        openMenu();
                    }
                }}
                className={`${executiveUi.input} flex !h-11 items-center justify-between gap-2 !rounded-xl !border-[#bdd5c4] !bg-[#f8fbf6] text-left !font-semibold shadow-sm transition hover:!border-[#4e9970] hover:!bg-white focus:!border focus-visible:!border-[#276747] focus-visible:!ring-2 focus-visible:!ring-inset focus-visible:!ring-[#c5eacb] disabled:opacity-40`}
            >
                <span className="min-w-0 truncate">{selected?.label || '—'}</span>
                <ChevronDown
                    size={17}
                    className={`shrink-0 text-[#276747] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open &&
                createPortal(
                    <div
                        ref={menu}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            width: position.width,
                            zIndex: 250,
                        }}
                        className="rounded-2xl border border-[#d3e4d6] bg-white p-1.5 shadow-[0_20px_55px_rgba(16,55,35,.22)]"
                    >
                        {searchable && (
                            <div className="relative mb-1.5 flex items-center gap-2 rounded-xl border border-[#cddfd1] bg-[#f8fbf6] px-2.5 focus-within:border-[#29895d]">
                                <Search size={16} className="shrink-0 text-[#47745b]" />
                                <input
                                    ref={searchInput}
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder={searchPlaceholder}
                                    aria-label={searchPlaceholder}
                                    onKeyDown={(event) => {
                                        if (event.key === 'ArrowDown' && visibleOptions.length) {
                                            event.preventDefault();
                                            optionRefs.current[0]?.focus();
                                        }
                                        if (
                                            event.key === 'Enter' &&
                                            visibleOptions.length === 1 &&
                                            !visibleOptions[0].disabled
                                        ) {
                                            event.preventDefault();
                                            choose(visibleOptions[0].value);
                                        }
                                    }}
                                    className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm text-[#14392b] outline-none placeholder:text-[#84978b]"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={() => {
                                            setSearch('');
                                            searchInput.current?.focus();
                                        }}
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                        )}
                        <div
                            role="listbox"
                            aria-label={ariaLabel ?? label ?? 'Options'}
                            className="max-h-64 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
                        >
                            {visibleOptions.map((option, index) => (
                                <button
                                    key={`${option.value}-${index}`}
                                    ref={(element) => {
                                        optionRefs.current[index] = element;
                                    }}
                                    type="button"
                                    role="option"
                                    aria-selected={option.value === value}
                                    disabled={option.disabled}
                                    onClick={() => choose(option.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                                            event.preventDefault();
                                            const direction = event.key === 'ArrowDown' ? 1 : -1;
                                            optionRefs.current[
                                                (index + direction + visibleOptions.length) %
                                                    visibleOptions.length
                                            ]?.focus();
                                        }
                                        if (event.key === 'Home') {
                                            event.preventDefault();
                                            optionRefs.current[0]?.focus();
                                        }
                                        if (event.key === 'End') {
                                            event.preventDefault();
                                            optionRefs.current[visibleOptions.length - 1]?.focus();
                                        }
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            choose(option.value);
                                        }
                                    }}
                                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#29895d] ${option.value === value ? 'bg-[#fff0ac] text-[#14392b]' : 'text-[#2c5340] hover:bg-[#edf7ec]'}`}
                                >
                                    <span className="min-w-0 break-words">{option.label}</span>
                                    {option.value === value && (
                                        <Check size={16} className="shrink-0 text-[#205b3b]" />
                                    )}
                                </button>
                            ))}
                            {visibleOptions.length === 0 && (
                                <p className="px-3 py-5 text-center text-sm text-[#687d70]">
                                    {emptyMessage}
                                </p>
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}

export function ExecutivePagination({
    page,
    totalPages,
    onChange,
    tr,
}: {
    page: number;
    totalPages: number;
    onChange: (next: number) => void;
    tr: (vi: string, en: string) => string;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7eee4] px-5 py-4 text-sm">
            <span className="font-semibold text-[#64806b]">
                {tr('Trang', 'Page')} {page + 1}/{Math.max(totalPages, 1)}
            </span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className={executiveUi.secondary}
                    disabled={page === 0}
                    onClick={() => onChange(page - 1)}
                >
                    {tr('Trước', 'Previous')}
                </button>
                <button
                    type="button"
                    className={executiveUi.secondary}
                    disabled={page + 1 >= totalPages}
                    onClick={() => onChange(page + 1)}
                >
                    {tr('Tiếp', 'Next')}
                </button>
            </div>
        </div>
    );
}
export function ExecutiveBadge({ status }: { status: string }) {
    const safe = (status ?? '').toUpperCase();
    const warm = ['PENDING_APPROVAL', 'PENDING', 'DRAFT', 'REVIEWING'].includes(safe);
    const good = ['PUBLISHED', 'APPROVED', 'VISIBLE', 'COMPLETED', 'ADDED'].includes(safe);
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${good ? 'bg-[#e4f3e5] text-[#216643]' : warm ? 'bg-[#fff2c5] text-[#8b6100]' : 'bg-[#f1eeee] text-[#6f6060]'}`}
        >
            {safe.replace(/_/g, ' ')}
        </span>
    );
}
export function ExecutiveFeedback({ message, error }: { message?: string; error?: boolean }) {
    if (!message) return null;
    return (
        <p
            role={error ? 'alert' : 'status'}
            className={`rounded-xl border px-4 py-3 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-[#c9e8cb] bg-[#eff9ef] text-[#246445]'}`}
        >
            {message}
        </p>
    );
}
