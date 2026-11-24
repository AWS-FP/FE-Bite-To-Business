import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownAZ, ArrowDownZA, Check, ChevronDown, SlidersHorizontal } from 'lucide-react';

export type BrandSortValue = 'name_asc' | 'name_desc';

type BrandSortDropdownProps = {
    value: BrandSortValue;
    onChange: (value: BrandSortValue) => void;
};

const OPTIONS = [
    {
        value: 'name_asc',
        labelKey: 'brandPage.nameAsc',
        Icon: ArrowDownAZ,
    },
    {
        value: 'name_desc',
        labelKey: 'brandPage.nameDesc',
        Icon: ArrowDownZA,
    },
] as const;

export default function BrandSortDropdown({ value, onChange }: BrandSortDropdownProps) {
    const { t } = useTranslation('storefront');
    const [open, setOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const selectedIndex = OPTIONS.findIndex((option) => option.value === value);

    const selected = OPTIONS[selectedIndex] ?? OPTIONS[0];

    useEffect(() => {
        if (!open) return;

        // Avoid the browser scrolling the entire brand page to reveal the menu option.
        optionRefs.current[selectedIndex]?.focus({ preventScroll: true });

        const handleOutsideClick = (event: PointerEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        // The header is fixed; keeping the menu open while scrolling makes it overlap
        // the navigation even after its trigger has left the visible section.
        const handleScroll = () => setOpen(false);

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus({ preventScroll: true });
            }
        };

        document.addEventListener('pointerdown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [open, selectedIndex]);

    const handleSelect = (nextValue: BrandSortValue) => {
        onChange(nextValue);
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-store-muted">{t('brandPage.sortLabel')}</span>

            <div ref={containerRef} className="relative z-10">
                <button
                    ref={triggerRef}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen((previous) => !previous)}
                    onKeyDown={(event) => {
                        if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                            event.preventDefault();
                            setOpen(true);
                        }
                    }}
                    className={`
                        group flex h-11 min-w-[190px]
                        items-center justify-between gap-3
                        rounded-2xl border px-3
                        text-sm font-bold
                        transition-all duration-200
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#e5c72e]
                        focus-visible:ring-offset-2
                        ${
                            open
                                ? 'border-store-green bg-[#e6f1e5] shadow-[0_5px_16px_rgba(16,65,46,0.12)]'
                                : 'border-[#c8dccb] bg-[#f6faf4] hover:border-store-green hover:bg-[#ecf5e9]'
                        }
                    `}
                >
                    <span className="flex items-center gap-2.5">
                        <span
                            className="
                                flex h-7 w-7 items-center justify-center
                                rounded-lg bg-[#dcebdd]
                                text-store-green
                            "
                        >
                            <SlidersHorizontal size={15} />
                        </span>

                        <span className="whitespace-nowrap text-store-green">
                            {t(selected.labelKey)}
                        </span>
                    </span>

                    <ChevronDown
                        size={16}
                        className={`
                            shrink-0 text-store-green
                            transition-transform duration-200
                            ${open ? 'rotate-180' : ''}
                        `}
                    />
                </button>

                {open && (
                    <div
                        role="menu"
                        aria-label={t('brandPage.sortLabel')}
                        className="
                            absolute right-0 top-full z-50 mt-2
                            w-[220px] overflow-hidden
                            rounded-2xl
                            border border-[#d8e6d9]
                            bg-white p-1.5
                            shadow-[0_12px_35px_rgba(12,48,35,0.17)]
                        "
                    >
                        {OPTIONS.map((option, index) => {
                            const isSelected = value === option.value;
                            const OptionIcon = option.Icon;

                            return (
                                <button
                                    key={option.value}
                                    ref={(element) => {
                                        optionRefs.current[index] = element;
                                    }}
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={isSelected}
                                    onClick={() => handleSelect(option.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                                            event.preventDefault();

                                            const direction = event.key === 'ArrowDown' ? 1 : -1;

                                            const nextIndex =
                                                (index + direction + OPTIONS.length) %
                                                OPTIONS.length;

                                            optionRefs.current[nextIndex]?.focus({
                                                preventScroll: true,
                                            });
                                        }

                                        if (event.key === 'Home') {
                                            event.preventDefault();
                                            optionRefs.current[0]?.focus({ preventScroll: true });
                                        }

                                        if (event.key === 'End') {
                                            event.preventDefault();
                                            optionRefs.current[OPTIONS.length - 1]?.focus({
                                                preventScroll: true,
                                            });
                                        }
                                    }}
                                    className={`
                                        flex w-full items-center
                                        gap-3 rounded-xl px-3 py-3
                                        text-left text-sm font-semibold
                                        transition-colors
                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-store-green
                                        ${
                                            isSelected
                                                ? 'bg-[#fff0a3] text-store-ink'
                                                : 'text-store-ink hover:bg-[#edf5eb]'
                                        }
                                    `}
                                >
                                    <OptionIcon size={18} className="shrink-0 text-store-green" />

                                    <span className="flex-1">{t(option.labelKey)}</span>

                                    {isSelected && (
                                        <Check
                                            size={17}
                                            strokeWidth={3}
                                            className="text-store-green"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
