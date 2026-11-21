import axios from 'axios';
import { ArrowLeft, ArrowRight, Package, Tag, Trash2 } from 'lucide-react';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import QuoteSteps from '@/components/customer/checkout/QuoteSteps';
import QuoteReview from '@/components/customer/checkout/QuoteReview';
import CartItems from '@/components/customer/checkout/CartItems';
import PackageForm from '@/components/customer/checkout/PackageForm';
import { sameDeliveryAddress } from '@/components/customer/checkout/deliveryAddress';
import type { PackageDraft } from '@/components/customer/checkout/PackageForm';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { ROUTES } from '@/router/routes';
import { addressToCoordinates, placeToCoordinates } from '@/services/geocodingService';
import {
    addQuotePackage,
    applyQuoteCoupons,
    createQuoteFromCart,
    deleteQuotePackage,
    getQuote,
    getQuotePackages,
    getQuotePackageTotals,
    placeOrderFromQuote,
    saveQuoteContact,
    validateQuotePricing,
} from '@/services/customer/quoteService';
import type { Quote, QuotePackage, QuotePackageAmount } from '@/services/customer/quoteService';
import { useAuthStore } from '@/store/admin/authStore';
import { useCartStore } from '@/store/customer/cartStore';
import { emptyParcel, emptyQuoteForm, useQuoteDraftStore } from '@/store/customer/quoteDraftStore';

const field =
    'w-full rounded-lg border border-store-ink/25 bg-white px-3 py-2.5 text-sm text-store-ink focus:border-store-ink focus:outline-none';
const primary =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-0 bg-store-green px-5 py-3 font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';
const secondary =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-store-ink/25 bg-white px-4 py-2 font-bold text-store-ink hover:bg-store-cream';

const checkoutErrors: Record<string, string> = {
    QUOTE_PRODUCT_VAT_MISSING: 'errors.vatMissing',
    QUOTE_STOCK_UNAVAILABLE: 'errors.stockUnavailable',
    QUOTE_REVISION_CONFLICT: 'errors.revisionConflict',
    QUOTE_INCOMPLETE: 'errors.quoteIncomplete',
    QUOTE_DUPLICATE_DELIVERY_ADDRESS: 'validation.duplicatePackages',
};

function errorCode(error: unknown) {
    if (!axios.isAxiosError(error)) return undefined;
    return (error.response?.data as { code?: string } | undefined)?.code;
}

function errorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string; code?: string } | undefined;
        const message = data?.message || fallback;
        const code = data?.code || error.response?.status;
        if (code) {
            return `${message} (${code})`;
        }
        return message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}

export default function CartPage() {
    const { t, i18n } = useTranslation('quote');
    const productName = (item: Quote['items'][number]) =>
        i18n.resolvedLanguage === 'en' ? item.nameEn || item.nameVi : item.nameVi;
    const displayMessage = (value: string) =>
        value.startsWith('errors.') ||
        value.startsWith('notices.') ||
        value.startsWith('validation.')
            ? t(value)
            : value;
    const navigate = useNavigate();
    const session = useAuthStore((state) => state.session);
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const clearCart = useCartStore((state) => state.clear);
    const resetForm = useQuoteDraftStore((state) => state.resetForm);
    const [step, setStep] = useState(0);
    const [quote, setQuote] = useState<Quote | null>(null);
    const [packages, setPackages] = useState<QuotePackage[]>([]);
    const owner = session?.user.id ?? 'guest';
    const form = useQuoteDraftStore((state) => state.forms[owner] ?? emptyQuoteForm);
    const updateForm = useQuoteDraftStore((state) => state.updateForm);
    const { productCode, shippingCode, quantities, parcel } = form;
    const setProductCode = (value: string) =>
        updateForm(owner, (current) => ({ ...current, productCode: value }));
    const setShippingCode = (value: string) =>
        updateForm(owner, (current) => ({ ...current, shippingCode: value }));
    const setQuantities: Dispatch<SetStateAction<Record<string, string>>> = (value) =>
        updateForm(owner, (current) => ({
            ...current,
            quantities: typeof value === 'function' ? value(current.quantities) : value,
        }));
    const setParcel: Dispatch<SetStateAction<PackageDraft>> = (value) =>
        updateForm(owner, (current) => ({
            ...current,
            parcel: typeof value === 'function' ? value(current.parcel) : value,
        }));
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [packageError, setPackageError] = useState('');
    const [notice, setNotice] = useState('');
    const [packageTotals, setPackageTotals] = useState<{
        quoteId: string;
        revision: number;
        values: Record<string, QuotePackageAmount>;
    } | null>(null);
    const [packageTotalsError, setPackageTotalsError] = useState(false);
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    function go(next: number) {
        setMessage('');
        setNotice('');
        setStep(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function selectStep(next: number) {
        if (next === 3) {
            void reviewQuote();
            return;
        }
        go(next);
    }

    async function checkoutFailed(error: unknown) {
        const code = errorCode(error);
        if (code === 'QUOTE_REVISION_CONFLICT' && quote) {
            try {
                setQuote(await getQuote(quote.id));
                setPackages(await getQuotePackages(quote.id));
            } catch {
                // Giữ thông báo xung đột; khách có thể tải lại trang.
            }
        }
        setMessage(code && checkoutErrors[code] ? checkoutErrors[code] : errorMessage(error, t('errors.fallback')));
    }

    async function reviewQuote() {
        if (!quote) return;
        setBusy(true);
        setMessage('');
        setNotice('');
        try {
            setQuote(await validateQuotePricing(quote.id, quote.revision));
            setStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            await checkoutFailed(error);
        } finally {
            setBusy(false);
        }
    }

    async function placeOrder() {
        if (!quote) return;
        setBusy(true);
        setMessage('');
        try {
            const order = await placeOrderFromQuote(quote.id, quote.revision);
            clearCart();
            resetForm(owner);
            navigate(ROUTES.ORDER_DETAIL.replace(':orderId', order.orderId), {
                state: { showPayment: true },
            });
        } catch (error) {
            await checkoutFailed(error);
            setBusy(false);
        }
    }

    function allocated(itemId: string) {
        let total = 0;
        for (const parcel of packages) {
            for (const item of parcel.items) {
                if (item.quoteItemId === itemId) {
                    total += item.quantity;
                }
            }
        }
        return total;
    }

    async function startQuote() {
        if (!session) {
            navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.QUOTES } } });
            return;
        }
        if (session.user.role !== 'CUSTOMER') {
            setMessage('errors.customer');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            let draft = await createQuoteFromCart(
                items.map((item) => ({ productId: item.id, quantity: item.quantity })),
            );
            if (!draft.contactName) {
                draft = await saveQuoteContact(draft.id, {
                    name: `${session.user.firstName} ${session.user.lastName}`.trim(),
                    phone: session.user.phone,
                    email: session.user.email,
                });
            }
            const savedPackages = await getQuotePackages(draft.id);
            setQuote(draft);
            setPackages(savedPackages);
            setStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setMessage(errorMessage(error, t('errors.fallback')));
        } finally {
            setBusy(false);
        }
    }

    async function applyCoupons() {
        if (!quote) return;
        if (
            (quote.productCouponId && !productCode.trim()) ||
            (quote.shippingCouponId && !shippingCode.trim())
        ) {
            setMessage('errors.savedCoupon');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            setQuote(await applyQuoteCoupons(quote.id, productCode, shippingCode));
            setNotice('notices.couponsUpdated');
        } catch (error) {
            setMessage(errorMessage(error, t('errors.fallback')));
        } finally {
            setBusy(false);
        }
    }

    async function removeCoupons() {
        if (!quote) return;
        setBusy(true);
        setMessage('');
        try {
            setQuote(await applyQuoteCoupons(quote.id, '', ''));
            setProductCode('');
            setShippingCode('');
            setNotice('notices.couponsRemoved');
        } catch (error) {
            setMessage(errorMessage(error, t('errors.fallback')));
        } finally {
            setBusy(false);
        }
    }

    async function createPackage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!quote) return;
        setPackageError('');
        const [startTime, endTime] = parcel.deliveryTimeSlot.split(' - ');
        if (!startTime || !endTime || endTime <= startTime) {
            setPackageError('errors.invalidTime');
            return;
        }
        const selected: { quoteItemId: string; quantity: number }[] = [];
        for (const item of quote.items) {
            const quantity = Number(quantities[item.productId] || 0);
            const remaining = Number(item.quantity) - allocated(item.id);
            if (quantity > remaining) {
                setPackageError('errors.invalidQuantity');
                return;
            }
            if (quantity > 0) {
                selected.push({ quoteItemId: item.id, quantity });
            }
        }
        if (selected.length === 0) {
            setPackageError('errors.invalidQuantity');
            return;
        }
        setBusy(true);
        setMessage('');
        let location: Awaited<ReturnType<typeof addressToCoordinates>>;
        try {
            location = parcel.addressRefId
                ? await placeToCoordinates(parcel.addressRefId)
                : await addressToCoordinates(
                      parcel.address,
                      parcel.city === 'HCM' ? 'hcm' : 'hanoi',
                  );
        } catch (error) {
            setPackageError(
                axios.isAxiosError(error) && error.response?.status === 400
                    ? 'errors.invalidAddress'
                    : 'errors.geocode',
            );
            setBusy(false);
            return;
        }
        try {
            await addQuotePackage(quote.id, {
                name: parcel.name,
                recipientName: parcel.recipientName,
                recipientPhone: parcel.recipientPhone,
                deliveryDate: parcel.deliveryDate,
                deliveryTimeSlot: parcel.deliveryTimeSlot,
                address: parcel.address,
                city: parcel.city,
                note: parcel.note || null,
                latitude: location.lat,
                longitude: location.lng,
                items: selected,
            });
            setPackages(await getQuotePackages(quote.id));
            setQuote(await getQuote(quote.id));
            setQuantities({});
            setParcel(emptyParcel);
            setNotice('notices.packageAdded');
        } catch (error) {
            setPackageError(
                axios.isAxiosError(error) &&
                    error.response?.data?.code === 'QUOTE_DUPLICATE_DELIVERY_ADDRESS'
                    ? 'errors.duplicateAddress'
                    : axios.isAxiosError(error) && error.response?.status === 503
                      ? 'errors.shippingUnavailable'
                      : errorMessage(error, t('errors.fallback')),
            );
        } finally {
            setBusy(false);
        }
    }

    async function removePackage(packageId: string) {
        if (!quote) return;
        setBusy(true);
        setMessage('');
        try {
            await deleteQuotePackage(quote.id, packageId);
            setPackages(await getQuotePackages(quote.id));
            setQuote(await getQuote(quote.id));
        } catch (error) {
            setMessage(errorMessage(error, t('errors.fallback')));
        } finally {
            setBusy(false);
        }
    }

    const allAllocated =
        !!quote &&
        packages.length > 0 &&
        quote.items.every(
            (item) => Math.abs(Number(item.quantity) - allocated(item.id)) < 0.000001,
        );
    const duplicatePackages = packages.some((item, index) =>
        packages
            .slice(0, index)
            .some((other) => sameDeliveryAddress(item.city, item.address, other)),
    );
    const quoteId = quote?.id;
    const revision = quote?.revision;
    useEffect(() => {
        if (!allAllocated || !quoteId || revision == null || quote?.vatAmount == null) return;
        const controller = new AbortController();
        void getQuotePackageTotals(quoteId, controller.signal)
            .then((values) => {
                if (!controller.signal.aborted) {
                    setPackageTotals({ quoteId, revision, values });
                    setPackageTotalsError(false);
                }
            })
            .catch(() => {
                if (!controller.signal.aborted) setPackageTotalsError(true);
            });
        return () => controller.abort();
    }, [allAllocated, quoteId, revision, quote?.vatAmount]);
    const visibleTotals =
        allAllocated &&
        packageTotals &&
        packageTotals.quoteId === quoteId &&
        packageTotals.revision === revision
            ? packageTotals.values
            : {};
    const rows = quote
        ? ([
              [t('merchandise'), quote.itemsSubtotal],
              [t('volumeDiscount'), -quote.volumeDiscountAmount],
              [t('productDiscount'), -quote.saleDiscountAmount],
              [t('productCoupon'), -quote.couponDiscountAmount],
          ] as const)
        : [];

    return (
        <div className="min-h-screen bg-store-cream text-store-ink">
            <Header />
            <main id="main-content" className="mx-auto min-h-[60vh] max-w-[1440px] px-8 py-10">
                <div>
                    <h1 className="m-0 font-subheading text-3xl font-bold sm:text-4xl">{t('title')}</h1>
                    <p className="mb-0 mt-3 text-store-muted">{t('subtitle')}</p>
                </div>
                <QuoteSteps step={step} busy={busy} onSelectStep={selectStep} />
                {message && (
                    <p
                        role="alert"
                        className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        {displayMessage(message)}
                    </p>
                )}
                {notice && (
                    <p
                        role="status"
                        className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-store-green"
                    >
                        {displayMessage(notice)}
                    </p>
                )}
                <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
                    <div className="min-w-0 space-y-5">
                        {step === 0 && <CartItems items={items} updateQuantity={updateQuantity} />}
                        {step === 1 && quote && (
                            <>
                                <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-11 place-items-center rounded-xl bg-store-cream text-store-green">
                                            <Tag size={21} />
                                        </span>
                                        <div>
                                            <h2 className="m-0 font-subheading text-xl font-bold">
                                                {t('pricingTitle')}
                                            </h2>
                                            <p className="mb-0 mt-1 text-sm text-store-muted">
                                                {t('pricingDescription')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-5 divide-y divide-store-ink/10">
                                        {quote.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-4 py-4"
                                            >
                                                <div>
                                                    <strong>{productName(item)}</strong>
                                                    <p className="mb-0 mt-1 text-sm text-store-muted">
                                                        {Number(item.quantity)} {item.unitCode} ×{' '}
                                                        {formatCurrencyVnd(
                                                            Number(item.saleUnitPrice),
                                                        )}
                                                    </p>
                                                </div>
                                                <strong>
                                                    {formatCurrencyVnd(
                                                        Number(item.quantity) *
                                                            Number(item.saleUnitPrice),
                                                    )}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
                                    <h2 className="m-0 font-subheading text-xl font-bold">
                                        {t('productCoupon')}
                                    </h2>
                                    <p className="my-3 text-sm text-store-muted">
                                        {t('productCouponDescription')}
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            aria-label={t('productCouponLabel')}
                                            className={field}
                                            value={productCode}
                                            maxLength={8}
                                            onChange={(event) =>
                                                setProductCode(event.target.value.toUpperCase())
                                            }
                                            placeholder={t('couponPlaceholder')}
                                        />
                                        <button
                                            type="button"
                                            className={secondary}
                                            disabled={busy}
                                            onClick={applyCoupons}
                                        >
                                            {t('apply')}
                                        </button>
                                    </div>
                                </section>
                            </>
                        )}
                        {step === 1 && quote && (
                            <div className="flex gap-3">
                                {(quote.productCouponId || quote.shippingCouponId) && (
                                    <button
                                        type="button"
                                        className={secondary}
                                        disabled={busy}
                                        onClick={removeCoupons}
                                    >
                                        {t('removeCoupons')}
                                    </button>
                                )}
                            </div>
                        )}
                        {step === 2 && quote && (
                            <>
                                <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-11 place-items-center rounded-xl bg-store-cream text-store-green">
                                            <Package size={21} />
                                        </span>
                                        <div>
                                            <h2 className="m-0 font-subheading text-xl font-bold">
                                                {t('packages')}
                                            </h2>
                                            <p className="mb-0 mt-1 text-sm text-store-muted">
                                                {t('packagesDescription')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        {quote.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-xl bg-store-cream p-4"
                                            >
                                                <strong>{productName(item)}</strong>
                                                <p className="mb-0 mt-1 text-sm text-store-muted">
                                                    {t('allocated', {
                                                        allocated: allocated(item.id),
                                                        total: Number(item.quantity),
                                                        unit: item.unitCode,
                                                    })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                {packages.map((item, index) => (
                                    <section
                                        key={item.id}
                                        className="rounded-2xl border border-store-ink/20 bg-white p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="m-0 text-xs font-bold uppercase tracking-widest text-store-green">
                                                    {t('packageNumber', {
                                                        number: String(index + 1).padStart(2, '0'),
                                                    })}
                                                </p>
                                                <h3 className="mb-1 mt-2 font-subheading text-xl font-bold">
                                                    {item.name}
                                                </h3>
                                                <p className="my-1 text-sm">
                                                    {item.recipientName} · {item.recipientPhone}
                                                </p>
                                                <p className="my-1 text-sm text-store-muted">
                                                    {item.address}
                                                </p>
                                                <p className="my-1 text-sm text-store-muted">
                                                    {item.deliveryDate} · {item.deliveryTimeSlot}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                disabled={busy}
                                                className="border-0 bg-transparent p-2 text-store-muted hover:text-danger"
                                                onClick={() => removePackage(item.id)}
                                                aria-label={t('remove', { name: item.name })}
                                            >
                                                <Trash2 size={19} />
                                            </button>
                                        </div>
                                        <div className="mt-4 border-t border-store-ink/10 pt-3 text-sm">
                                            {item.items.map((line) => (
                                                <p className="my-1" key={line.quoteItemId}>
                                                    {(() => {
                                                        const product = quote.items.find(
                                                            (product) =>
                                                                product.id === line.quoteItemId,
                                                        );
                                                        return product ? productName(product) : '';
                                                    })()}{' '}
                                                    × {Number(line.quantity)}
                                                </p>
                                            ))}
                                            <p className="mb-0 mt-3 font-bold text-store-green">
                                                {t('estimatedShipping')}{' '}
                                                {formatCurrencyVnd(Number(item.shippingFee))}
                                            </p>
                                            {visibleTotals[item.id] && (
                                                <p className="mb-0 mt-2 text-base font-bold text-store-green">
                                                    {t('packageTotal')}{' '}
                                                    {formatCurrencyVnd(
                                                        Number(visibleTotals[item.id].total),
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </section>
                                ))}
                                {duplicatePackages && (
                                    <p role="alert" className="text-sm text-red-700">
                                        {t('validation.duplicatePackages')}
                                    </p>
                                )}
                                {allAllocated && quote.vatAmount == null && (
                                    <p className="text-sm text-store-muted">
                                        {t('packageVatUnavailable')}
                                    </p>
                                )}
                                {allAllocated && quote.vatAmount != null && packageTotalsError && (
                                    <p role="alert" className="text-sm text-red-700">
                                        {t('packageTotalsError')}
                                    </p>
                                )}
                                <PackageForm
                                    quote={quote}
                                    packages={packages}
                                    parcel={parcel}
                                    setParcel={setParcel}
                                    quantities={quantities}
                                    setQuantities={setQuantities}
                                    allocated={allocated}
                                    busy={busy}
                                    error={
                                        packageError === 'errors.duplicateAddress'
                                            ? ''
                                            : displayMessage(packageError)
                                    }
                                    duplicateAddressError={
                                        packageError === 'errors.duplicateAddress'
                                    }
                                    clearAddressError={() => {
                                        if (packageError === 'errors.duplicateAddress')
                                            setPackageError('');
                                    }}
                                    createPackage={createPackage}
                                />
                                <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
                                    <h2 className="m-0 font-subheading text-xl font-bold">
                                        {t('shippingCoupon')}
                                    </h2>
                                    <p className="my-3 text-sm text-store-muted">
                                        {t('shippingCouponDescription')}
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            aria-label={t('shippingCouponLabel')}
                                            className={field}
                                            value={shippingCode}
                                            maxLength={8}
                                            onChange={(e) =>
                                                setShippingCode(e.target.value.toUpperCase())
                                            }
                                            placeholder={t('couponPlaceholder')}
                                        />
                                        <button
                                            type="button"
                                            className={secondary}
                                            disabled={busy}
                                            onClick={applyCoupons}
                                        >
                                            {t('apply')}
                                        </button>
                                    </div>
                                </section>
                            </>
                        )}
                        {step === 3 && quote && (
                            <QuoteReview quote={quote} packages={packages} totals={visibleTotals} />
                        )}
                    </div>
                    <aside className="sticky top-36 rounded-2xl border border-store-ink/20 bg-white p-6">
                        <h2 className="mb-5 mt-0 font-subheading text-xl font-bold">
                            {t('summary')}
                        </h2>
                        <div className="space-y-3 text-sm">
                            {step === 0 ? (
                                <div className="flex justify-between">
                                    <span>{t('estimatedMerchandise')}</span>
                                    <strong>{formatCurrencyVnd(subtotal)}</strong>
                                </div>
                            ) : (
                                rows.map(([name, amount]) => (
                                    <div key={name} className="flex justify-between gap-3">
                                        <span className="text-store-muted">{name}</span>
                                        <strong>
                                            {amount < 0 ? '- ' : ''}
                                            {formatCurrencyVnd(Math.abs(Number(amount)))}
                                        </strong>
                                    </div>
                                ))
                            )}
                            <div className="flex justify-between gap-3">
                                <span className="text-store-muted">{t('shipping')}</span>
                                <strong>
                                    {step >= 2 && quote && packages.length
                                        ? formatCurrencyVnd(Number(quote.shippingFee))
                                        : t('calculatedLater')}
                                </strong>
                            </div>
                            {step >= 2 &&
                                quote &&
                                Number(quote.shippingCouponDiscountAmount) > 0 && (
                                    <div className="flex justify-between gap-3">
                                        <span className="text-store-muted">
                                            {t('shippingCoupon')}
                                        </span>
                                        <strong>
                                            -{' '}
                                            {formatCurrencyVnd(
                                                Number(quote.shippingCouponDiscountAmount),
                                            )}
                                        </strong>
                                    </div>
                                )}
                            <div className="flex justify-between gap-3">
                                <span className="text-store-muted">{t('vat')}</span>
                                <strong>
                                    {step === 3 && quote?.vatAmount != null
                                        ? formatCurrencyVnd(Number(quote.vatAmount))
                                        : t('calculatedLater')}
                                </strong>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-between gap-3 border-t border-store-ink/15 pt-5">
                            <strong>{step === 3 ? t('estimatedTotal') : t('total')}</strong>
                            <strong className="text-lg text-store-green">
                                {step === 3 && quote?.vatAmount != null
                                    ? formatCurrencyVnd(Number(quote.estimatedTotalAmount))
                                    : t('calculatedLater')}
                            </strong>
                        </div>
                        {step === 0 && (
                            <button
                                type="button"
                                className={`${primary} mt-5 w-full`}
                                disabled={!items.length || busy}
                                onClick={startQuote}
                            >
                                {busy
                                    ? t('processing')
                                    : session
                                      ? t('continue')
                                      : t('loginContinue')}
                                <ArrowRight size={17} />
                            </button>
                        )}
                        {step === 1 && (
                            <button
                                type="button"
                                className={`${primary} mt-5 w-full`}
                                onClick={() => go(2)}
                                disabled={busy}
                            >
                                {t('createPackage')} <ArrowRight size={17} />
                            </button>
                        )}
                        {step === 2 && (
                            <>
                                <button
                                    type="button"
                                    className={`${primary} mt-5 w-full`}
                                    onClick={() => void reviewQuote()}
                                    disabled={!allAllocated || duplicatePackages || busy}
                                >
                                    {busy ? t('processing') : t('viewTotal')} <ArrowRight size={17} />
                                </button>
                                {!allAllocated && (
                                    <p className="mb-0 mt-3 text-xs text-store-muted">
                                        {t('allocateAll')}
                                    </p>
                                )}
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <button
                                    type="button"
                                    className={`${primary} mt-5 w-full`}
                                    disabled={busy || quote?.vatAmount == null}
                                    onClick={() => void placeOrder()}
                                >
                                    {busy ? t('placingOrder') : t('placeOrder')}
                                    <ArrowRight size={17} />
                                </button>
                                <p className="mb-0 mt-3 text-xs leading-relaxed text-store-muted">
                                    {quote?.vatAmount == null ? t('errors.vatMissing') : t('placeOrderHint')}
                                </p>
                            </>
                        )}
                        {step > 0 && (
                            <button
                                type="button"
                                className={`${secondary} mt-3 w-full`}
                                disabled={busy}
                                onClick={() => go(step - 1)}
                            >
                                <ArrowLeft size={17} /> {t('back')}
                            </button>
                        )}
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
