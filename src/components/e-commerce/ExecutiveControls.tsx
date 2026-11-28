import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { dropdownPosition } from '@/utils/e-commerce/dropdownPosition';

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
    const tr = useExecutiveText();
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
    const [position, setPosition] = useState<ReturnType<typeof dropdownPosition> | null>(null);
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
        if (!rect) return;
        const preferredHeight = Math.min(256, Math.max(64, options.length * 48)) + (searchable ? 64 : 14);
        setPosition(dropdownPosition(rect, 220, preferredHeight));
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
        if (searchable) searchInput.current?.focus({ preventScroll: true });
        else optionRefs.current[selectedIndex]?.focus({ preventScroll: true });
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
        const closeOnResize = () => closeMenu();
        window.addEventListener('resize', closeOnResize);
        return () => {
            document.removeEventListener('pointerdown', outside);
            document.removeEventListener('keydown', keyboard);
            window.removeEventListener('scroll', closeOnScroll, true);
            window.removeEventListener('resize', closeOnResize);
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
                className={executiveUi.selectTrigger}
            >
                <span className="min-w-0 truncate">{selected?.label || '—'}</span>
                <ChevronDown
                    size={17}
                    className={`shrink-0 text-[#276747] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && position &&
                createPortal(
                    <div
                        ref={menu}
                        style={{
                            position: 'fixed',
                            ...position,
                            zIndex: 250,
                        }}
                        className={`${executiveUi.selectPanel} flex flex-col overflow-hidden`}
                    >
                        {searchable && (
                            <div className={`${executiveUi.selectSearch} mb-1.5 shrink-0`}>
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
                                    className={executiveUi.selectSearchInput}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        aria-label={tr('Xóa tìm kiếm', 'Clear search')}
                                        className="grid size-7 shrink-0 place-items-center rounded-md !border-0 bg-transparent text-store-muted !outline-none !shadow-none hover:bg-surface-green focus-visible:!bg-surface-green"
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
                            className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
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
                                    className={executiveUi.selectOption}
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
