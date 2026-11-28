import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { dropdownPosition } from '@/utils/e-commerce/dropdownPosition';

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
    const [geometry, setGeometry] = useState<ReturnType<typeof dropdownPosition> | null>(null);
    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value),
    );
    const selectedOption = options[selectedIndex];

    useLayoutEffect(() => {
        if (!open) return;
        function reposition() {
            const rect = triggerRef.current?.getBoundingClientRect();
            if (!rect) return;
            setGeometry(dropdownPosition(rect, 0, Math.min(280, Math.max(64, options.length * 48 + 14))));
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
    }, [open, options.length]);

    useEffect(() => {
        if (!open) return;
        const raf = window.requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus({ preventScroll: true }));
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
                className={`${executiveUi.selectTrigger} ${className}`}
            >
                <span className="min-w-0 truncate">{selectedOption?.label ?? ariaLabel}</span>
                <ChevronDown
                    size={17}
                    className={`shrink-0 text-[#527360] transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && geometry &&
                createPortal(
                    <div
                        id={id}
                        ref={menuRef}
                        role="listbox"
                        aria-label={ariaLabel}
                        onKeyDown={keydown}
                        className={`${executiveUi.selectPanel} fixed z-[260] overflow-y-auto`}
                        style={geometry}
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
                                className={executiveUi.selectOption}
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
