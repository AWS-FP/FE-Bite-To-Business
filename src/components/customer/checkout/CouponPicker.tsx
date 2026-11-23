import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronRight, Ticket, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { getAvailableCoupons } from '@/services/customer/quoteService';
import type { AvailableCoupon, CouponScope } from '@/types/customer/quote';

interface CouponPickerProps {
    quoteId: string;
    scope: CouponScope;
    /** Code currently applied for this scope, '' when none. */
    appliedCode: string;
    /** True when the quote carries a coupon for this scope even if its code is not known here. */
    applied: boolean;
    busy: boolean;
    /** Applies a code ('' removes it). Resolves to an error message, or null on success. */
    onApply: (code: string) => Promise<string | null>;
}

const CODE_PATTERN = /^[A-Z0-9]{8}$/;

export default function CouponPicker({
    quoteId,
    scope,
    appliedCode,
    applied,
    busy,
    onApply,
}: CouponPickerProps) {
    const { t, i18n } = useTranslation('quote');
    const [open, setOpen] = useState(false);
    const title = t(scope === 'PRODUCT' ? 'couponPicker.productTitle' : 'couponPicker.shippingTitle');

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="flex w-full items-center gap-3 rounded-2xl border border-store-ink/20 bg-white px-6 py-5 text-left transition-colors hover:border-store-green/60 hover:bg-store-cream/40"
            >
                <Ticket className="shrink-0 text-[#e8742c]" size={24} aria-hidden="true" />
                <span className="min-w-0 flex-1 font-subheading text-lg font-bold">{title}</span>
                {applied ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3 py-1 text-sm font-bold text-store-green">
                        <Check size={15} aria-hidden="true" />
                        {appliedCode || t('couponPicker.appliedUnknown')}
                    </span>
                ) : (
                    <span className="text-sm text-store-muted">{t('couponPicker.selectOrEnter')}</span>
                )}
                <ChevronRight className="shrink-0 text-store-muted" size={18} aria-hidden="true" />
            </button>
            {open && (
                <CouponDialog
                    quoteId={quoteId}
                    scope={scope}
                    title={title}
                    appliedCode={appliedCode}
                    applied={applied}
                    busy={busy}
                    english={i18n.resolvedLanguage === 'en'}
                    onApply={onApply}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

function CouponDialog({
    quoteId,
    scope,
    title,
    appliedCode,
    applied,
    busy,
    english,
    onApply,
    onClose,
}: CouponPickerProps & {
    title: string;
    english: boolean;
    onClose: () => void;
}) {
    const { t } = useTranslation('quote');
    const [code, setCode] = useState('');
    const [coupons, setCoupons] = useState<AvailableCoupon[] | null>(null);
    const [loadFailed, setLoadFailed] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        getAvailableCoupons(quoteId, controller.signal)
            .then((result) => setCoupons(result.filter((item) => item.appliesTo === scope)))
            .catch(() => {
                if (!controller.signal.aborted) setLoadFailed(true);
            });
        return () => controller.abort();
    }, [quoteId, scope]);

    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        inputRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, [onClose]);

    async function apply(next: string) {
        setError('');
        const failure = await onApply(next);
        if (failure) setError(failure);
        else onClose();
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

    const date = (value: string) =>
        new Date(value).toLocaleDateString(english ? 'en-US' : 'vi-VN');
    const describe = (coupon: AvailableCoupon) =>
        coupon.discountType === 'PERCENTAGE'
            ? coupon.maxDiscountAmount != null
                ? t('couponPicker.percentOffMax', {
                      value: Number(coupon.discountValue),
                      max: formatCurrencyVnd(Number(coupon.maxDiscountAmount)),
                  })
                : t('couponPicker.percentOff', { value: Number(coupon.discountValue) })
            : t('couponPicker.amountOff', {
                  value: formatCurrencyVnd(Number(coupon.discountValue)),
              });
    const usable = coupons?.filter((item) => item.applicable) ?? [];
    const blocked = coupons?.filter((item) => !item.applicable) ?? [];

    const card = (coupon: AvailableCoupon) => {
        const current = coupon.code === appliedCode;
        return (
            <li
                key={coupon.id}
                className={`flex items-stretch overflow-hidden rounded-xl border ${current ? 'border-store-green bg-surface-green/60' : 'border-store-ink/15 bg-white'} ${coupon.applicable ? '' : 'opacity-60'}`}
            >
                <div className="grid w-20 shrink-0 place-items-center border-r border-dashed border-store-ink/20 bg-[#fff3e6] text-[#e8742c]">
                    <Ticket size={26} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 px-4 py-3">
                    <p className="m-0 font-bold">{describe(coupon)}</p>
                    <p className="m-0 mt-1 text-xs text-store-muted">
                        {Number(coupon.minOrderAmount) > 0
                            ? t('couponPicker.minOrder', {
                                  value: formatCurrencyVnd(Number(coupon.minOrderAmount)),
                              })
                            : t('couponPicker.noMinOrder')}
                        {coupon.productScope === 'SELECTED' &&
                            ` · ${t('couponPicker.selectedProducts')}`}
                    </p>
                    <p className="m-0 mt-1 text-xs text-store-muted">
                        <span className="font-mono font-bold text-store-ink">{coupon.code}</span>
                        {' · '}
                        {t('couponPicker.expires', { date: date(coupon.endsAt) })}
                    </p>
                    {coupon.applicable ? (
                        Number(coupon.estimatedDiscount) > 0 && (
                            <p className="m-0 mt-1 text-xs font-bold text-store-green">
                                {t('couponPicker.estimated', {
                                    value: formatCurrencyVnd(Number(coupon.estimatedDiscount)),
                                })}
                            </p>
                        )
                    ) : (
                        <p className="m-0 mt-1 text-xs font-bold text-red-700">
                            {t(
                                coupon.reason === 'NO_ELIGIBLE_PRODUCT'
                                    ? 'couponPicker.reasonNoProduct'
                                    : 'couponPicker.reasonMinOrder',
                            )}
                        </p>
                    )}
                </div>
                <div className="flex shrink-0 items-center pr-4">
                    {current ? (
                        <span className="text-sm font-bold text-store-green">
                            {t('couponPicker.inUse')}
                        </span>
                    ) : (
                        <button
                            type="button"
                            disabled={busy || !coupon.applicable}
                            onClick={() => void apply(coupon.code)}
                            className="rounded-lg border border-store-green px-3 py-1.5 text-sm font-bold text-store-green hover:bg-store-green hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`${t('couponPicker.choose')} ${coupon.code}`}
                        >
                            {t('couponPicker.choose')}
                        </button>
                    )}
                </div>
            </li>
        );
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
            onClick={() => !busy && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="coupon-dialog-title"
                onClick={(event) => event.stopPropagation()}
                className="flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-store-cream text-store-ink shadow-2xl"
            >
                <div className="flex items-center justify-between gap-3 border-b border-store-ink/10 bg-white px-6 py-4">
                    <h2 id="coupon-dialog-title" className="m-0 font-subheading text-xl font-bold">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('couponPicker.close')}
                        className="grid size-9 place-items-center rounded-full border-0 bg-transparent text-store-muted hover:bg-store-cream"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={submit} className="flex gap-3 bg-white px-6 pb-5 pt-4">
                    <input
                        ref={inputRef}
                        value={code}
                        maxLength={8}
                        onChange={(event) => {
                            setCode(event.target.value.toUpperCase());
                            setError('');
                        }}
                        aria-label={t('couponPicker.inputLabel')}
                        placeholder={t('couponPicker.inputPlaceholder')}
                        className="min-w-0 flex-1 rounded-lg border border-store-ink/25 bg-white px-3 py-2.5 font-mono text-sm uppercase tracking-wider text-store-ink focus:border-store-ink focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={busy || !code.trim()}
                        className="shrink-0 whitespace-nowrap rounded-lg border-0 bg-store-green px-5 py-2.5 font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t('apply')}
                    </button>
                </form>
                {error && (
                    <p role="alert" className="m-0 bg-white px-6 pb-4 text-sm text-red-700">
                        {error}
                    </p>
                )}
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                    {coupons === null && !loadFailed && (
                        <p role="status" className="m-0 text-sm text-store-muted">
                            {t('couponPicker.loading')}
                        </p>
                    )}
                    {loadFailed && (
                        <p role="alert" className="m-0 text-sm text-red-700">
                            {t('couponPicker.loadFailed')}
                        </p>
                    )}
                    {coupons !== null && coupons.length === 0 && (
                        <p className="m-0 text-sm text-store-muted">{t('couponPicker.empty')}</p>
                    )}
                    {usable.length > 0 && (
                        <>
                            <h3 className="m-0 mb-3 text-sm font-bold uppercase tracking-wide text-store-muted">
                                {t('couponPicker.available')}
                            </h3>
                            <ul className="m-0 list-none space-y-3 p-0">{usable.map(card)}</ul>
                        </>
                    )}
                    {blocked.length > 0 && (
                        <>
                            <h3 className="m-0 mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-store-muted">
                                {t('couponPicker.notEligible')}
                            </h3>
                            <ul className="m-0 list-none space-y-3 p-0">{blocked.map(card)}</ul>
                        </>
                    )}
                </div>
                {applied && (
                    <div className="border-t border-store-ink/10 bg-white px-6 py-4">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => void apply('')}
                            className="text-sm font-bold text-red-700 underline underline-offset-4 disabled:opacity-50"
                        >
                            {t('couponPicker.remove')}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}
