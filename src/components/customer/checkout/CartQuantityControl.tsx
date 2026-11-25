import { Minus, Plus } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cartRules, useCartStore, type CartItem } from '@/store/customer/cartStore';

interface Props {
    item: CartItem;
    /** Accessible product name for the buttons and the input. */
    label: string;
    /** Compact control for the header cart preview. */
    compact?: boolean;
    /** Header preview: "-" at the MOQ removes the line. Cart page: "-" stops at the MOQ (trash removes). */
    minusRemoves?: boolean;
}

/**
 * Cart quantity: "-" / "+" plus a number the customer can type (no need to press "+" 20 times).
 * A typed value is applied on Enter or when leaving the field. Above the stock it is capped to the
 * stock with an error, below the MOQ it is raised to the MOQ with a message; the store snaps the rest.
 */
export default function CartQuantityControl({ item, label, compact = false, minusRemoves = false }: Props) {
    const { t } = useTranslation('quote');
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const setQuantity = useCartStore((state) => state.setQuantity);
    const [draft, setDraft] = useState<string | null>(null);
    const [error, setError] = useState('');
    const { min, step, max, cap } = cartRules(item);
    const atCap = cap != null && cap >= min && item.quantity + step > cap + 1e-9;
    const atMin = item.quantity <= min + 1e-9;

    function commit() {
        if (draft == null) return;
        const typed = Number(draft.replace(',', '.'));
        setDraft(null);
        if (!draft.trim() || !Number.isFinite(typed) || typed <= 0) {
            setError(t('validation.quantityInvalid'));
            return;
        }
        if (cap != null && cap >= min && typed > cap + 1e-9) {
            setQuantity(item.id, cap);
            setError(t('quantityOverStock', { quantity: typed, stock: max }));
            return;
        }
        if (typed < min - 1e-9) {
            setQuantity(item.id, min);
            setError(t('quantityBelowMinimum', { min }));
            return;
        }
        setQuantity(item.id, typed);
        setError('');
    }

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
            setDraft(null);
            event.currentTarget.blur();
        }
    }

    function increase() {
        if (atCap) {
            setError(t('atStockLimit', { stock: max }));
            return;
        }
        setError('');
        updateQuantity(item.id, 1);
    }

    function decrease() {
        setError('');
        updateQuantity(item.id, -1);
    }

    const button = compact
        ? 'flex size-7 cursor-pointer items-center justify-center border-0 bg-transparent hover:bg-store-cream disabled:cursor-not-allowed disabled:opacity-35'
        : 'grid size-9 place-items-center border-0 bg-transparent hover:bg-store-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent';
    const iconSize = compact ? 12 : 16;

    return (
        <div className="flex flex-col items-end">
            <div className={`flex shrink-0 items-center rounded-lg border ${error ? 'border-red-500' : compact ? 'border-store-ink/15' : 'border-store-ink/25'}`}>
                <button
                    type="button"
                    onClick={decrease}
                    disabled={!minusRemoves && atMin}
                    title={!minusRemoves && atMin ? t('atMinimum', { min }) : undefined}
                    aria-label={t('decrease', { name: label })}
                    className={button}
                >
                    <Minus size={iconSize} />
                </button>
                <input
                    type="text"
                    inputMode="decimal"
                    value={draft ?? String(item.quantity)}
                    onFocus={(event) => {
                        setDraft(String(item.quantity));
                        event.currentTarget.select();
                    }}
                    onChange={(event) => setDraft(event.target.value.replace(/[^\d.,]/g, ''))}
                    onBlur={commit}
                    onKeyDown={onKeyDown}
                    aria-label={t('quantityInput', { name: label })}
                    aria-invalid={!!error}
                    className={`border-0 bg-transparent p-0 text-center font-bold tabular-nums outline-none focus:bg-store-cream ${compact ? 'h-7 w-9 text-[11px]' : 'h-9 w-12'}`}
                />
                <button
                    type="button"
                    onClick={increase}
                    aria-label={t('increase', { name: label })}
                    className={`${button} ${atCap ? 'opacity-35' : ''}`}
                >
                    <Plus size={iconSize} />
                </button>
            </div>
            {error && (
                <p role="alert" className={`m-0 mt-1 max-w-[220px] text-right font-semibold text-red-700 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                    {error}
                </p>
            )}
        </div>
    );
}
