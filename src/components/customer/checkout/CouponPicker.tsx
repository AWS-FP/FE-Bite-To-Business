import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronRight, Ticket, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CouponScope } from '@/types/customer/quote';

interface CouponPickerProps {
    scope: CouponScope;
    appliedCode: string;
    applied: boolean;
    busy: boolean;
    reusableCodes: string[];
    /** Sends the exact code to BE; returns an error message or null on success. */
    onApply: (code: string) => Promise<string | null>;
}

const CODE_PATTERN = /^[A-Z0-9]{8}$/;

export default function CouponPicker({ scope, appliedCode, applied, busy, reusableCodes, onApply }: CouponPickerProps) {
    const { t } = useTranslation('quote');
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const title = t(scope === 'PRODUCT' ? 'couponPicker.productTitle' : 'couponPicker.shippingTitle');
    return (
        <>
            <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
                className="flex w-full items-center gap-3 rounded-2xl border border-store-ink/20 bg-white px-6 py-5 text-left transition-colors hover:border-store-green/60 hover:bg-store-cream/40">
                <Ticket className="shrink-0 text-[#e8742c]" size={24} aria-hidden="true" />
                <span className="min-w-0 flex-1 font-subheading text-lg font-bold">{title}</span>
                {applied ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3 py-1 text-sm font-bold text-store-green">
                        <Check size={15} aria-hidden="true" />
                        {appliedCode || t('couponPicker.appliedUnknown')}
                    </span>
                ) : <span className="text-sm text-store-muted">{t('couponPicker.selectOrEnter')}</span>}
                <ChevronRight className="shrink-0 text-store-muted" size={18} aria-hidden="true" />
            </button>
            {open && <CouponDialog title={title} appliedCode={appliedCode} applied={applied} busy={busy}
                reusableCodes={reusableCodes} onApply={onApply} onClose={close} />}
        </>
    );
}

function CouponDialog({ title, appliedCode, applied, busy, reusableCodes, onApply, onClose }: {
    title: string;
    appliedCode: string;
    applied: boolean;
    busy: boolean;
    reusableCodes: string[];
    onApply: (code: string) => Promise<string | null>;
    onClose: () => void;
}) {
    const { t } = useTranslation('quote');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        inputRef.current?.focus();
        const keydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !submitting && !busy) onClose();
        };
        window.addEventListener('keydown', keydown);
        return () => {
            window.removeEventListener('keydown', keydown);
            document.body.style.overflow = previousOverflow;
            previous?.focus?.();
        };
    }, [onClose, submitting, busy]);

    async function apply(value: string) {
        if (busy || submitting) return;
        setSubmitting(true);
        setError('');
        try {
            const failure = await onApply(value);
            if (failure) setError(failure);
            else onClose();
        } finally {
            setSubmitting(false);
        }
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const normalized = code.trim().toUpperCase();
        if (!CODE_PATTERN.test(normalized)) {
            setError(t('couponPicker.invalidCode'));
            return;
        }
        void apply(normalized);
    }

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
            onClick={() => { if (!busy && !submitting) onClose(); }}>
            <div role="dialog" aria-modal="true" aria-labelledby="coupon-dialog-title"
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-xl overflow-hidden rounded-2xl bg-white text-store-ink shadow-2xl">
                <div className="flex items-center justify-between gap-3 border-b border-store-ink/10 px-6 py-5">
                    <div>
                        <h2 id="coupon-dialog-title" className="m-0 font-subheading text-xl font-bold">{title}</h2>
                        <p className="mb-0 mt-1 text-sm text-store-muted">{t('couponPicker.privateNotice')}</p>
                    </div>
                    <button type="button" disabled={busy || submitting} onClick={onClose}
                        aria-label={t('couponPicker.close')}
                        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-store-muted hover:bg-store-cream disabled:opacity-40">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-3 px-6 py-5 sm:flex-row">
                    <input ref={inputRef} value={code} maxLength={8}
                        onChange={(event) => { setCode(event.target.value.toUpperCase()); setError(''); }}
                        aria-label={t('couponPicker.inputLabel')} placeholder={t('couponPicker.inputPlaceholder')}
                        autoComplete="off" spellCheck={false}
                        className="min-w-0 flex-1 rounded-xl border border-store-ink/25 bg-white px-4 py-3 font-mono text-sm uppercase tracking-wider text-store-ink focus:border-store-green focus:outline-none" />
                    <button type="submit" disabled={busy || submitting || !CODE_PATTERN.test(code.trim())}
                        className="shrink-0 cursor-pointer rounded-xl border-0 bg-store-green px-5 py-3 font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                        {submitting ? t('processing') : t('apply')}
                    </button>
                </form>
                {error && <p role="alert" className="m-0 px-6 pb-5 text-sm text-red-700">{error}</p>}
                {reusableCodes.filter((value) => value !== appliedCode).length > 0 && (
                    <div className="border-t border-store-ink/10 px-6 py-4">
                        <h3 className="m-0 text-sm font-bold">{t('couponPicker.savedCodes')}</h3>
                        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                            {reusableCodes.filter((value) => value !== appliedCode).map((value) => (
                                <button key={value} type="button" disabled={busy || submitting}
                                    onClick={() => void apply(value)}
                                    className="flex w-full items-center justify-between rounded-lg border border-store-ink/15 bg-white px-3 py-2 text-store-green hover:bg-store-cream disabled:opacity-50">
                                    <span className="font-mono font-bold">{value}</span>
                                    <span className="text-sm font-bold">{t('couponPicker.choose')}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {applied && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-store-ink/10 bg-store-cream px-6 py-4">
                    <span className="text-sm text-store-muted">{t('couponPicker.inUse')}: <strong className="text-store-green">{appliedCode || t('couponPicker.appliedUnknown')}</strong></span>
                    <button type="button" disabled={busy || submitting} onClick={() => void apply('')}
                        className="cursor-pointer border-0 bg-transparent p-2 text-sm font-bold text-red-700 underline underline-offset-4 disabled:opacity-50">
                        {t('couponPicker.remove')}
                    </button>
                </div>}
            </div>
        </div>, document.body,
    );
}
