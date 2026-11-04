import { Check, ChevronDown, Search, Sparkles } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchModeDropdownProps {
    value: 'products' | 'ai';
    onChange: (value: 'products' | 'ai') => void;
}

export default function SearchModeDropdown({ value, onChange }: SearchModeDropdownProps) {
    const { t } = useTranslation('storefront');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuId = useId();

    useEffect(() => {
        if (!isOpen) return;

        menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();

        function handleOutsideClick(event: PointerEvent) {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick);
        return () => document.removeEventListener('pointerdown', handleOutsideClick);
    }, [isOpen]);

    function selectMode(mode: 'products' | 'ai') {
        onChange(mode);
        setIsOpen(false);
        triggerRef.current?.focus();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Escape' && isOpen) {
            event.preventDefault();
            event.stopPropagation();
            setIsOpen(false);
            triggerRef.current?.focus();
            return;
        }

        if (event.key === 'Tab' && isOpen) {
            setIsOpen(false);
            triggerRef.current?.focus();
            return;
        }

        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        if (!isOpen && (event.key === 'Home' || event.key === 'End')) return;
        event.preventDefault();

        if (!isOpen) {
            setIsOpen(true);
            return;
        }

        const options = Array.from(
            menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
        );
        const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement);
        let nextIndex = 0;

        if (event.key === 'End') nextIndex = options.length - 1;
        if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length;
        if (event.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + options.length) % options.length;
        }
        options[nextIndex]?.focus();
    }

    return (
        <div
            ref={wrapperRef}
            className="relative ml-2 w-[136px] shrink-0 border-0 border-r border-solid border-store-ink/20 pr-2 font-body"
            onKeyDown={handleKeyDown}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
            }}
        >
            <button
                ref={triggerRef}
                type="button"
                aria-label={t('search.mode')}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={isOpen ? menuId : undefined}
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-8 w-full cursor-pointer items-center justify-between gap-1.5 rounded-full border-2 border-solid border-transparent bg-store-cream px-2 text-[11px] leading-4 font-bold text-store-green transition-colors hover:bg-surface-yellow aria-expanded:bg-store-yellow"
            >
                <span className="truncate">
                    {t(value === 'ai' ? 'search.askAI' : 'search.products')}
                </span>
                <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    id={menuId}
                    role="menu"
                    aria-label={t('search.mode')}
                    className="absolute top-[calc(100%+12px)] left-0 z-[80] w-[224px] overflow-hidden rounded-2xl border-2 border-solid border-store-ink bg-store-cream p-1.5 text-store-green"
                >
                    <p className="m-0 border-0 border-b border-solid border-store-green/15 px-3 pt-1.5 pb-2.5 font-label text-[10px] leading-4 font-semibold tracking-[1px] uppercase">
                        {t('search.mode')}
                    </p>
                    <button
                        type="button"
                        role="menuitemradio"
                        tabIndex={-1}
                        aria-checked={value === 'products'}
                        onClick={() => selectMode('products')}
                        className="mt-1 flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl border-2 border-solid border-transparent bg-transparent px-3 text-left text-[12px] leading-5 font-semibold text-store-green hover:bg-surface-green focus:bg-surface-green aria-checked:bg-store-yellow"
                    >
                        <Search size={16} className="shrink-0" aria-hidden="true" />
                        <span className="flex-1">{t('search.products')}</span>
                        {value === 'products' && <Check size={15} aria-hidden="true" />}
                    </button>
                    <button
                        type="button"
                        role="menuitemradio"
                        tabIndex={-1}
                        aria-checked={value === 'ai'}
                        onClick={() => selectMode('ai')}
                        className="mt-1 flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl border-2 border-solid border-transparent bg-transparent px-3 text-left text-[12px] leading-5 font-semibold text-store-green hover:bg-surface-green focus:bg-surface-green aria-checked:bg-store-yellow"
                    >
                        <Sparkles size={16} className="shrink-0" aria-hidden="true" />
                        <span className="flex-1">{t('search.askAI')}</span>
                        {value === 'ai' && <Check size={15} aria-hidden="true" />}
                    </button>
                </div>
            )}
        </div>
    );
}
