import axios from 'axios';
import { ArrowLeft, ArrowRight, Package, Tag, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCustomerProfile } from '@/services/customer/profileService';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import QuoteSteps from '@/components/customer/checkout/QuoteSteps';
import QuoteReview from '@/components/customer/checkout/QuoteReview';
import CartItems from '@/components/customer/checkout/CartItems';
import PackageForm from '@/components/customer/checkout/PackageForm';
import { sameDeliveryAddress } from '@/utils/customer/sameDeliveryAddress';
import type { PackageDraft } from '@/components/customer/checkout/PackageForm';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { ROUTES } from '@/router/routes';
import { addressToCoordinates, placeToCoordinates } from '@/services/geocodingService';
import {
    addQuotePackage,
    applyQuoteCoupons,
    createQuoteFromCart,
    deleteQuotePackage,
    getAvailableCoupons,
    getQuote,
    getQuotePackages,
    getQuotePackageTotals,
    placeOrderFromQuote,
    saveQuoteContact,
    validateQuotePricing,
} from '@/services/customer/quoteService';
import type { CouponScope, Quote, QuotePackage, QuotePackageAmount } from '@/types/customer/quote';
import CouponPicker from '@/components/customer/checkout/CouponPicker';
import { useAuthStore } from '@/store/admin/authStore';
import { useCartStore } from '@/store/customer/cartStore';
import { emptyParcel, emptyQuoteForm, useQuoteDraftStore } from '@/store/customer/quoteDraftStore';

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
    const [searchParams, setSearchParams] = useSearchParams();
    // Counts presses of "Review quote total" while the delivery step is incomplete.
    const [reviewAttempt, setReviewAttempt] = useState(0);

    // Back from the distribution map (?step=delivery): reopen the quote at the delivery step.
    const resumeDelivery = searchParams.get('step') === 'delivery';
    const resumed = useRef(false);
    useEffect(() => {
        if (!resumeDelivery || resumed.current) return;
        resumed.current = true;
        setSearchParams({}, { replace: true });
        if (session?.user.role === 'CUSTOMER' && items.length > 0) {
            void Promise.resolve().then(() => startQuote(2));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when arriving with ?step=delivery
    }, [resumeDelivery]);

    // First package: prefill it with the delivery details given at registration, so the
    // customer only enters quantities. Skipped once they clear it or after any package exists.
    const parcelIsEmpty =
        !parcel.address.trim() && !parcel.name.trim() && !parcel.recipientName.trim();
    const shouldPrefill =
        step === 2 &&
        !!quote &&
        packages.length === 0 &&
        parcelIsEmpty &&
        !form.profileDefaultDismissed &&
        session?.user.role === 'CUSTOMER';
    useEffect(() => {
        if (!shouldPrefill) return;
        const controller = new AbortController();
        getCustomerProfile(controller.signal)
            .then((profile) => {
                const province = (profile.province ?? '').toLowerCase();
                const city = province.includes('hà nội') || province.includes('ha noi')
                    ? 'HANOI'
                    : province.includes('hồ chí minh') || province.includes('ho chi minh')
                      ? 'HCM'
                      : null;
                const recipient = `${profile.user.lastName ?? ''} ${profile.user.firstName ?? ''}`.trim();
                updateForm(owner, (current) => {
                    const empty =
                        !current.parcel.address.trim() &&
                        !current.parcel.name.trim() &&
                        !current.parcel.recipientName.trim();
                    if (!empty || current.profileDefaultDismissed) return current;
                    return {
                        ...current,
                        parcel: {
                            ...current.parcel,
                            name: profile.businessName?.trim() || t('form.defaultPackageName'),
                            recipientName: recipient,
                            recipientPhone: profile.user.phone ?? '',
                            // Only HCM and Hà Nội are served; elsewhere the address is left for the customer.
                            address: city ? (profile.fullDeliveryAddress ?? profile.deliveryAddress ?? '') : '',
                            city: city ?? current.parcel.city,
                            note: profile.deliveryNote ?? '',
                            addressRefId: undefined,
                            latitude: undefined,
                            longitude: undefined,
                            fromProfile: true,
                        },
                    };
                });
            })
            .catch(() => undefined);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- updateForm/owner are stable for the session
    }, [shouldPrefill]);
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

    async function startQuote(targetStep = 1) {
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
            setStep(targetStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setMessage(errorMessage(error, t('errors.fallback')));
        } finally {
            setBusy(false);
        }
    }

    // The PUT sends both scopes, so the code of the other scope must be known before changing one.
    async function applyCoupon(scope: CouponScope, code: string): Promise<string | null> {
        if (!quote) return t('errors.fallback');
        const otherMissing =
            scope === 'PRODUCT'
                ? quote.shippingCouponId && !shippingCode.trim()
                : quote.productCouponId && !productCode.trim();
        if (otherMissing) return t('errors.savedCoupon');
        setBusy(true);
        setMessage('');
        try {
            setQuote(
                await applyQuoteCoupons(
                    quote.id,
                    scope === 'PRODUCT' ? code : productCode,
                    scope === 'SHIPPING' ? code : shippingCode,
                ),
            );
            if (scope === 'PRODUCT') setProductCode(code);
            else setShippingCode(code);
            setNotice(code ? 'notices.couponsUpdated' : 'notices.couponsRemoved');
            return null;
        } catch (error) {
            return axios.isAxiosError(error) && error.response?.status === 400
                ? t('couponPicker.notApplicable')
                : errorMessage(error, t('errors.fallback'));
        } finally {
            setBusy(false);
        }
    }

    // A coupon saved on the quote from another device has no code in local storage; recover it so
    // changing the other scope does not drop it.
    const quoteIdForCoupons = quote?.id;
    const missingProductCode = !!quote?.productCouponId && !productCode;
    const missingShippingCode = !!quote?.shippingCouponId && !shippingCode;
    const productCouponId = quote?.productCouponId;
    const shippingCouponId = quote?.shippingCouponId;
    useEffect(() => {
        if (!quoteIdForCoupons || (!missingProductCode && !missingShippingCode)) return;
        const controller = new AbortController();
        getAvailableCoupons(quoteIdForCoupons, controller.signal)
            .then((list) => {
                const byId = new Map(list.map((item) => [item.id, item.code]));
                if (missingProductCode && productCouponId && byId.has(productCouponId))
                    setProductCode(byId.get(productCouponId)!);
                if (missingShippingCode && shippingCouponId && byId.has(shippingCouponId))
                    setShippingCode(byId.get(shippingCouponId)!);
            })
            .catch(() => {});
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- setters come from the draft store
    }, [quoteIdForCoupons, missingProductCode, missingShippingCode, productCouponId, shippingCouponId]);

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
            location =
                parcel.latitude != null && parcel.longitude != null
                    ? { address: parcel.address, lat: parcel.latitude, lng: parcel.longitude }
                    : parcel.addressRefId
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
    const unallocatedCount = quote
        ? quote.items.filter((item) => Number(item.quantity) - allocated(item.id) > 1e-8).length
        : 0;
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
    const shippingKnown = step >= 2 && !!quote && packages.length > 0;
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
                        {step < 2 && parcel.address.trim() && parcel.latitude != null && (
                            <p
                                role="status"
                                className="rounded-xl border border-store-green/30 bg-white px-4 py-3 text-sm text-store-ink"
                            >
                                {t('savedDeliveryAddress', { address: parcel.address })}
                            </p>
                        )}
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
                                        {quote.items.map((item) => {
                                            const list = Number(item.listUnitPrice);
                                            const sale = Number(item.saleUnitPrice);
                                            const discounted = list > 0 && sale < list;
                                            const percent = discounted
                                                ? Math.round(((list - sale) / list) * 100)
                                                : 0;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start justify-between gap-4 py-4"
                                                >
                                                    <div className="min-w-0">
                                                        <strong>{productName(item)}</strong>
                                                        <p className="mb-0 mt-1 flex flex-wrap items-center gap-x-2 text-sm text-store-muted">
                                                            <span>
                                                                {Number(item.quantity)}{' '}
                                                                {item.unitCode} ×{' '}
                                                                <strong className="text-store-ink">
                                                                    {formatCurrencyVnd(sale)}
                                                                </strong>
                                                            </span>
                                                            {discounted && (
                                                                <>
                                                                    <span className="line-through">
                                                                        {formatCurrencyVnd(list)}
                                                                    </span>
                                                                    <span className="rounded bg-[#fde3df] px-1.5 py-0.5 text-xs font-bold text-[#c0392b]">
                                                                        -{percent}%
                                                                    </span>
                                                                </>
                                                            )}
                                                        </p>
                                                        <p className="mb-0 mt-1 text-xs text-store-muted">
                                                            {item.vatRate != null &&
                                                            item.productVatAmount != null ? (
                                                                t('lineVat', {
                                                                    rate: Number(item.vatRate),
                                                                    amount: formatCurrencyVnd(
                                                                        Number(
                                                                            item.productVatAmount,
                                                                        ),
                                                                    ),
                                                                })
                                                            ) : (
                                                                <span className="font-bold text-red-700">
                                                                    {t('lineVatMissing')}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0 text-right">
                                                        <strong>
                                                            {formatCurrencyVnd(
                                                                Number(item.quantity) * sale,
                                                            )}
                                                        </strong>
                                                        {discounted && (
                                                            <p className="mb-0 mt-1 text-xs text-store-muted line-through">
                                                                {formatCurrencyVnd(
                                                                    Number(item.quantity) * list,
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                                <CouponPicker
                                    quoteId={quote.id}
                                    scope="PRODUCT"
                                    appliedCode={quote.productCouponId ? productCode : ''}
                                    applied={!!quote.productCouponId}
                                    busy={busy}
                                    onApply={(code) => applyCoupon('PRODUCT', code)}
                                />
                            </>
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
                                    onPickOnMap={() =>
                                        navigate(`${ROUTES.DISTRIBUTION_NETWORK}?returnTo=quote-delivery`)
                                    }
                                    revealErrors={reviewAttempt}
                                    onClearProfileDefault={() =>
                                        updateForm(owner, (current) => ({
                                            ...current,
                                            parcel: emptyParcel,
                                            profileDefaultDismissed: true,
                                        }))
                                    }
                                />
                                <CouponPicker
                                    quoteId={quote.id}
                                    scope="SHIPPING"
                                    appliedCode={quote.shippingCouponId ? shippingCode : ''}
                                    applied={!!quote.shippingCouponId}
                                    busy={busy}
                                    onApply={(code) => applyCoupon('SHIPPING', code)}
                                />
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
                                <span className="text-store-muted">{t('vat')}</span>
                                {step >= 1 && quote ? (
                                    quote.vatAmount != null ? (
                                        <strong>{formatCurrencyVnd(Number(quote.vatAmount))}</strong>
                                    ) : (
                                        <strong className="text-right text-red-700">
                                            {t('vatIncomplete')}
                                        </strong>
                                    )
                                ) : (
                                    <strong>{t('calculatedLater')}</strong>
                                )}
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-store-muted">{t('shipping')}</span>
                                <strong>
                                    {shippingKnown
                                        ? formatCurrencyVnd(Number(quote.shippingFee))
                                        : t('calculatedLater')}
                                </strong>
                            </div>
                            {shippingKnown && Number(quote.shippingCouponDiscountAmount) > 0 && (
                                <div className="flex justify-between gap-3">
                                    <span className="text-store-muted">{t('shippingCoupon')}</span>
                                    <strong>
                                        -{' '}
                                        {formatCurrencyVnd(
                                            Number(quote.shippingCouponDiscountAmount),
                                        )}
                                    </strong>
                                </div>
                            )}
                        </div>
                        <div className="mt-5 flex justify-between gap-3 border-t border-store-ink/15 pt-5">
                            <strong>
                                {step === 0 || !quote
                                    ? t('total')
                                    : shippingKnown
                                      ? t('estimatedTotal')
                                      : t('totalBeforeShipping')}
                            </strong>
                            <strong className="whitespace-nowrap text-right text-lg text-store-green">
                                {step === 0 || !quote || quote.vatAmount == null
                                    ? t('calculatedLater')
                                    : formatCurrencyVnd(
                                          shippingKnown
                                              ? Number(quote.estimatedTotalAmount)
                                              : Number(quote.itemsSubtotal) -
                                                    Number(quote.volumeDiscountAmount) -
                                                    Number(quote.saleDiscountAmount) -
                                                    Number(quote.couponDiscountAmount) +
                                                    Number(quote.vatAmount),
                                      )}
                            </strong>
                        </div>
                        {step === 0 && (
                            <button
                                type="button"
                                className={`${primary} mt-5 w-full`}
                                disabled={!items.length || busy}
                                onClick={() => void startQuote()}
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
                                    onClick={() => {
                                        if (!allAllocated || duplicatePackages) {
                                            // Stay here and point at what is missing instead of a disabled button.
                                            setReviewAttempt((count) => count + 1);
                                            document
                                                .getElementById('package-form')
                                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            return;
                                        }
                                        setReviewAttempt(0);
                                        void reviewQuote();
                                    }}
                                    disabled={busy}
                                >
                                    {busy ? t('processing') : t('viewTotal')} <ArrowRight size={17} />
                                </button>
                                {reviewAttempt > 0 && (!allAllocated || duplicatePackages) ? (
                                    <ul
                                        role="alert"
                                        className="mb-0 mt-3 list-disc space-y-1 pl-5 text-xs font-semibold text-red-700"
                                    >
                                        {packages.length === 0 && <li>{t('validation.noPackage')}</li>}
                                        {unallocatedCount > 0 && (
                                            <li>{t('validation.unallocatedProducts', { count: unallocatedCount })}</li>
                                        )}
                                        {duplicatePackages && <li>{t('validation.duplicatePackages')}</li>}
                                    </ul>
                                ) : (
                                    !allAllocated && (
                                        <p className="mb-0 mt-3 text-xs text-store-muted">
                                            {t('allocateAll')}
                                        </p>
                                    )
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
