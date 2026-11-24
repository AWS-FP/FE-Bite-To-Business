import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

export type ExecutiveSelectOption = { value: string; label: string };

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: ExecutiveSelectOption[];
    ariaLabel: string;
    className?: string;
    disabled?: boolean;
}

/** Custom accessible select; portal keeps popup out of clipped modal/footers and native Windows menus. */
export default function ExecutiveSelect({
    value,
    onChange,
    options,
    ariaLabel,
    className = '',
    disabled = false,
}: Props) {
    const id = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [geometry, setGeometry] = useState({ left: 0, top: 0, width: 200, maxHeight: 270 });
    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value),
    );
    const selectedOption = options[selectedIndex];

    useEffect(() => {
        if (!open) return;
        function reposition() {
            const rect = triggerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const availableBelow = window.innerHeight - rect.bottom - 14;
            const availableAbove = rect.top - 14;
            const upwards = availableBelow < 200 && availableAbove > availableBelow;
            const maxHeight = Math.max(
                100,
                Math.min(280, upwards ? availableAbove : availableBelow),
            );
            setGeometry({
                left: Math.min(rect.left, Math.max(8, window.innerWidth - rect.width - 8)),
                top: upwards
                    ? Math.max(8, rect.top - Math.min(280, maxHeight) - 6)
                    : rect.bottom + 6,
                width: rect.width,
                maxHeight,
            });
        }
        function closeOutside(event: PointerEvent) {
            if (
                event.target instanceof Node &&
                !triggerRef.current?.contains(event.target) &&
                !menuRef.current?.contains(event.target)
            )
                setOpen(false);
        }
        reposition();
        window.addEventListener('resize', reposition);
        window.addEventListener('scroll', reposition, true);
        document.addEventListener('pointerdown', closeOutside);
        return () => {
            window.removeEventListener('resize', reposition);
            window.removeEventListener('scroll', reposition, true);
            document.removeEventListener('pointerdown', closeOutside);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const raf = window.requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus());
        return () => window.cancelAnimationFrame(raf);
    }, [open, selectedIndex]);

    function select(index: number) {
        const option = options[index];
        if (!option) return;
        onChange(option.value);
        setOpen(false);
        triggerRef.current?.focus();
    }
    function keydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
                setActiveIndex(selectedIndex);
                setOpen(true);
                return;
            }
            const next =
                (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
                options.length;
            setActiveIndex(next);
            optionRefs.current[next]?.focus();
        } else if (open && event.key === 'Home') {
            event.preventDefault();
            setActiveIndex(0);
            optionRefs.current[0]?.focus();
        } else if (open && event.key === 'End') {
            event.preventDefault();
            const last = options.length - 1;
            setActiveIndex(last);
            optionRefs.current[last]?.focus();
        }
    }

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={id}
                aria-label={ariaLabel}
                disabled={disabled}
                onKeyDown={keydown}
                onClick={() => {
                    setActiveIndex(selectedIndex);
                    setOpen((previous) => !previous);
                }}
                className={`flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-[#c7d8ca] bg-white px-3.5 text-left text-sm font-medium text-[#173f30] shadow-sm transition hover:border-[#74a88a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#81c5a0] disabled:opacity-50 ${className}`}
            >
                <span className="min-w-0 truncate">{selectedOption?.label ?? ariaLabel}</span>
                <ChevronDown
                    size={17}
                    className={`shrink-0 text-[#527360] transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open &&
                createPortal(
                    <div
                        id={id}
                        ref={menuRef}
                        role="listbox"
                        aria-label={ariaLabel}
                        onKeyDown={keydown}
                        className="fixed z-[260] overflow-y-auto rounded-xl border border-[#b8cec0] bg-white p-1.5 shadow-[0_18px_40px_rgba(15,45,32,0.2)]"
                        style={{
                            left: geometry.left,
                            top: geometry.top,
                            width: geometry.width,
                            maxHeight: geometry.maxHeight,
                        }}
                    >
                        {options.map((option, index) => (
                            <button
                                key={option.value}
                                ref={(node) => {
                                    optionRefs.current[index] = node;
                                }}
                                type="button"
                                role="option"
                                aria-selected={option.value === value}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => select(index)}
                                className={`flex w-full items-start justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${option.value === value ? 'bg-[#e6f2e8] font-bold text-[#135438]' : 'text-[#264a37] hover:bg-[#f1f6ef]'} focus-visible:bg-[#e6f2e8] focus-visible:outline-none`}
                            >
                                <span className="min-w-0 break-words">{option.label}</span>
                                {option.value === value && (
                                    <Check size={15} className="mt-0.5 shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>,
                    document.body,
                )}
        </>
    );
}
