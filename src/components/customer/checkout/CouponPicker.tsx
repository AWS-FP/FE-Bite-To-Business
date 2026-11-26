import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, ChevronRight, Ticket, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getReusableCoupons, inspectQuoteCoupon } from '@/services/customer/quoteService';
import type { CouponScope, SavedCoupon } from '@/types/customer/quote';

interface CouponPickerProps {
    scope: CouponScope;
    appliedCode: string;
    applied: boolean;
    busy: boolean;
    quoteId: string;
    /** Sends the exact code to BE; returns an error message or null on success. */
    onApply: (code: string) => Promise<string | null>;
}

const CODE_PATTERN = /^[A-Z0-9]{8}$/;

export default function CouponPicker({
    scope,
    appliedCode,
    applied,
    busy,
    quoteId,
    onApply,
}: CouponPickerProps) {
    const { t } = useTranslation('quote');
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const title = t(
        scope === 'PRODUCT' ? 'couponPicker.productTitle' : 'couponPicker.shippingTitle',
    );
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
                    <span className="text-sm text-store-muted">
                        {t('couponPicker.selectOrEnter')}
                    </span>
                )}
                <ChevronRight className="shrink-0 text-store-muted" size={18} aria-hidden="true" />
            </button>
            {open && (
                <CouponDialog
                    title={title}
                    appliedCode={appliedCode}
                    applied={applied}
                    busy={busy}
                    scope={scope}
                    quoteId={quoteId}
                    onApply={onApply}
                    onClose={close}
                />
            )}
        </>
    );
}

function CouponDialog({
    scope,
    title,
    appliedCode,
    applied,
    busy,
    quoteId,
    onApply,
    onClose,
}: {
    scope: CouponScope;
    title: string;
    appliedCode: string;
    applied: boolean;
    busy: boolean;
    quoteId: string;
    onApply: (code: string) => Promise<string | null>;
    onClose: () => void;
}) {
    const { t, i18n } = useTranslation('quote');
    const [savedCoupons, setSavedCoupons] = useState<SavedCoupon[]>([]);
    const [historyError, setHistoryError] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        void getReusableCoupons(quoteId, controller.signal)
            .then((rows) => {
                if (!controller.signal.aborted)
                    setSavedCoupons((current) => [
                        ...current,
                        ...rows.filter(
                            (row) =>
                                row.scope === scope &&
                                !current.some((item) => item.code === row.code),
                        ),
                    ]);
            })
            .catch(() => {
                if (!controller.signal.aborted) setHistoryError(true);
            });
        return () => controller.abort();
    }, [quoteId, scope]);
    const [expandedCode, setExpandedCode] = useState<string | null>(null);
    const coupons = savedCoupons;
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi';
    const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' });
    const dates = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' });
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

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const normalized = code.trim().toUpperCase();
        if (!CODE_PATTERN.test(normalized)) {
            setError(t('couponPicker.invalidCode'));
            return;
        }
        if (submitting || busy) return;
        setSubmitting(true);
        setError('');
        try {
            const inspected = await inspectQuoteCoupon(quoteId, normalized);
            setSavedCoupons((items) => [
                inspected,
                ...items.filter((item) => item.code !== inspected.code),
            ]);
            setExpandedCode(null);
        } catch {
            setError(t('couponPicker.lookupError'));
        } finally {
            setSubmitting(false);
        }
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
                if (!busy && !submitting) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="coupon-dialog-title"
                onClick={(event) => event.stopPropagation()}
                className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white text-store-ink shadow-2xl"
            >
                <div className="flex items-start justify-between gap-3 border-b border-store-ink/10 bg-[#edf3ef] px-5 py-5 sm:px-6">
                    <div>
                        <h2
                            id="coupon-dialog-title"
                            className="m-0 font-subheading text-xl font-bold"
                        >
                            {title}
                        </h2>
                        <p className="mb-0 mt-1 text-sm text-store-muted">
                            {t('couponPicker.privateNotice')}
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={busy || submitting}
                        onClick={onClose}
                        aria-label={t('couponPicker.close')}
                        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full !border-0 bg-transparent text-store-muted hover:bg-store-cream focus-visible:!ring-2 focus-visible:!ring-store-green disabled:opacity-40"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-3 px-6 py-5 sm:flex-row">
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
                        autoComplete="off"
                        spellCheck={false}
                        className="min-w-0 flex-1 rounded-xl border border-store-ink/25 bg-white px-4 py-3 font-mono text-sm uppercase tracking-wider text-store-ink focus:border-store-green focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={busy || submitting || !CODE_PATTERN.test(code.trim())}
                        className="shrink-0 cursor-pointer rounded-xl !border-0 bg-store-green px-5 py-3 font-bold text-white hover:bg-store-dark focus-visible:!ring-2 focus-visible:!ring-store-green focus-visible:!ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? t('processing') : t('couponPicker.inspect')}
                    </button>
                </form>
                {error && (
                    <p role="alert" className="m-0 px-6 pb-5 text-sm text-red-700">
                        {error}
                    </p>
                )}
                {historyError && (
                    <p role="status" className="px-6 text-sm text-red-700">
                        {t('couponPicker.historyError')}
                    </p>
                )}
                {coupons.length > 0 && (
                    <div className="space-y-3 border-t border-store-ink/10 bg-[#f1f5f2] px-5 py-4 sm:px-6">
                        <p className="m-0 text-sm font-bold text-store-muted">
                            {t('couponPicker.listTitle')}
                        </p>
                        {coupons.map((item) => {
                            const reason = item.scope !== scope ? 'WRONG_SCOPE' : item.reason;
                            const name = (locale === 'en'
                                ? item.nameEn || item.nameVi
                                : item.nameVi || item.nameEn)?.trim();
                            const genericNames = ['vi', 'en'].flatMap((lng) => [
                                t('couponPicker.productTitle', { lng }).toLowerCase(),
                                t('couponPicker.shippingTitle', { lng }).toLowerCase(),
                            ]);
                            const showName = name && ![
                                ...genericNames,
                                'coupon vận chuyển',
                                item.code.toLowerCase(),
                            ].includes(name.toLowerCase());
                            const expanded = expandedCode === item.code;
                            const discount =
                                item.discountType === 'PERCENTAGE'
                                    ? `${item.discountValue}%`
                                    : money.format(item.discountValue);
                            const unlimited = t('couponPicker.unlimited');
                            const eligible = item.valid && !reason;
                            const inUse = applied && item.code === appliedCode;
                            const details = [
                                ['discount', discount],
                                [
                                    'cap',
                                    item.maxDiscountAmount == null
                                        ? unlimited
                                        : money.format(item.maxDiscountAmount),
                                ],
                                ['minimum', money.format(item.minOrderAmount)],
                                ['campaignLimit', item.usageLimit ?? unlimited],
                                ['userLimit', item.usageLimitPerUser ?? unlimited],
                                ['used', item.used],
                                ['reserved', item.reserved],
                                ['remaining', item.remaining ?? unlimited],
                            ];
                            return (
                                <article
                                    key={item.code}
                                    className={`overflow-hidden rounded-2xl border bg-white text-sm transition-colors ${expanded ? 'border-store-green/50 shadow-md' : 'border-store-green/15'}`}
                                >
                                    <h3 className="m-0 text-base font-bold">
                                        <button
                                            type="button"
                                            aria-expanded={expanded}
                                            aria-controls={`coupon-details-${item.code}`}
                                            onClick={() =>
                                                setExpandedCode(expanded ? null : item.code)
                                            }
                                            className="flex w-full items-center gap-3 !rounded-none !border-0 !bg-store-green p-4 text-left !text-white transition-colors hover:!bg-store-dark focus:!border-0 focus-visible:!ring-2 focus-visible:!ring-inset focus-visible:!ring-white/70"
                                        >
                                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                                                <Ticket size={23} aria-hidden="true" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <code className="block break-all font-mono text-lg font-extrabold tracking-widest text-white sm:text-xl">
                                                    {item.code}
                                                </code>
                                                {showName && (
                                                    <span className="mt-1 block break-words text-xs font-medium leading-snug text-white/80">
                                                        {name}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="shrink-0 rounded-lg bg-[#dcebe0] px-3 py-1.5 text-right text-base font-extrabold text-store-dark sm:text-lg">
                                                {discount}
                                            </span>
                                            <ChevronDown
                                                size={18}
                                                aria-hidden="true"
                                                className={`shrink-0 text-white/80 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    </h3>
                                    <div id={`coupon-details-${item.code}`} hidden={!expanded}>
                                        <div className="space-y-4 border-t border-store-ink/10 px-4 pb-4 pt-4">
                                            <dl className="m-0 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                {details.map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className={`min-w-0 rounded-xl px-3 py-2.5 ${key === 'remaining' ? 'bg-[#dcebe0]' : 'bg-[#f0f4f1]'}`}
                                                    >
                                                        <dt className="text-xs leading-snug text-store-muted">
                                                            {t(`couponPicker.details.${key}`)}
                                                        </dt>
                                                        <dd className="m-0 mt-1 break-words font-bold text-store-green">
                                                            {value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                            <div className="space-y-2 text-sm leading-relaxed">
                                                <div>
                                                    <span className="block text-xs font-bold text-store-muted">
                                                        {t('couponPicker.details.validity')}
                                                    </span>
                                                    {dates.format(new Date(item.startsAt))} –{' '}
                                                    {dates.format(new Date(item.endsAt))}
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold text-store-muted">
                                                        {t('couponPicker.details.scope')}
                                                    </span>
                                                    {item.productScope === 'ALL'
                                                        ? t('couponPicker.all')
                                                        : t('couponPicker.products', {
                                                              names: item.products
                                                                  .map((p) =>
                                                                      locale === 'en'
                                                                          ? p.nameEn || p.nameVi
                                                                          : p.nameVi || p.nameEn,
                                                                  )
                                                                  .join(', '),
                                                          })}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-store-ink/10 pt-3">
                                                <p
                                                    role="status"
                                                    className={`m-0 flex min-w-0 items-center gap-1.5 text-xs font-semibold ${eligible ? 'text-store-green' : 'text-red-700'}`}
                                                >
                                                    {eligible && (
                                                        <Check size={15} aria-hidden="true" />
                                                    )}
                                                    {t(`couponPicker.reasons.${reason ?? 'VALID'}`)}
                                                </p>
                                                <button
                                                    type="button"
                                                    disabled={
                                                        busy || submitting || !eligible || inUse
                                                    }
                                                    className="rounded-xl !border-0 bg-store-dark px-5 py-2.5 font-bold text-white hover:bg-store-green focus-visible:!ring-2 focus-visible:!ring-store-green focus-visible:!ring-offset-2 disabled:opacity-50"
                                                    onClick={() => void apply(item.code)}
                                                >
                                                    {inUse
                                                        ? t('couponPicker.inUse')
                                                        : t('couponPicker.choose')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
                {applied && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-store-ink/10 bg-store-cream px-6 py-4">
                        <span className="text-sm text-store-muted">
                            {t('couponPicker.inUse')}:{' '}
                            <strong className="text-store-green">
                                {appliedCode || t('couponPicker.appliedUnknown')}
                            </strong>
                        </span>
                        <button
                            type="button"
                            disabled={busy || submitting}
                            onClick={() => void apply('')}
                            className="cursor-pointer border-0 bg-transparent p-2 text-sm font-bold text-red-700 underline underline-offset-4 disabled:opacity-50"
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
