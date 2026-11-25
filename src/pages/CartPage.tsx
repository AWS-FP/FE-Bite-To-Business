import axios from 'axios';
import { ArrowLeft, ArrowRight, Package, Pencil, Tag, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCustomerProfile } from '@/services/customer/profileService';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import QuoteSteps from '@/components/customer/checkout/QuoteSteps';
import QuoteReview from '@/components/customer/checkout/QuoteReview';
import CartItems from '@/components/customer/checkout/CartItems';
import DistributionExplorer from '@/components/distribution/DistributionExplorer';
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
    getQuote,
    getQuotePackages,
    getQuotePackageTotals,
    getReusableCoupons,
    replaceQuoteCart,
    updateQuotePackage,
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
    const removePurchased = useCartStore((state) => state.removePurchased);
    const selectedItems = items.filter((item) => item.selected);
    const resetForm = useQuoteDraftStore((state) => state.resetForm);
    const [step, setStep] = useState(0);
    const [quote, setQuote] = useState<Quote | null>(null);
    const [packages, setPackages] = useState<QuotePackage[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const reorderQuoteId = searchParams.get('reorderQuote');
    const owner = `${session?.user.id ?? 'guest'}${reorderQuoteId ? `:reorder:${reorderQuoteId}` : ''}`;
    const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
    const [reorderQuantities, setReorderQuantities] = useState<Record<string, string>>({});
    const form = useQuoteDraftStore((state) => state.forms[owner] ?? emptyQuoteForm);
    const updateForm = useQuoteDraftStore((state) => state.updateForm);
    const { quantities, parcel } = form;
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
    const [mapOpen, setMapOpen] = useState(false);
    const [reorderLoading, setReorderLoading] = useState(!!reorderQuoteId);
    // Reorder quote was created atomically by BE from a previous order. Recheck it before
    // opening the payment-confirmation screen; do not rebuild from the current cart.
    useEffect(() => {
        if (!reorderQuoteId) return;
        setReorderLoading(true);
        let active = true;
        Promise.all([getQuote(reorderQuoteId), getQuotePackages(reorderQuoteId)])
            .then(async ([draft, savedPackages]) => {
                if (!active) return;
                setQuote(draft);
                setPackages(savedPackages);
                // Already ordered (e.g. Back from the order page): show the notice, never re-validate it.
                if (draft.status !== 'DRAFT') return;
                const complete = savedPackages.length > 0 && draft.items.every(item =>
                    Math.abs(Number(item.quantity) - savedPackages.reduce((sum, pkg) =>
                        sum + pkg.items.filter(line => line.quoteItemId === item.id)
                            .reduce((total, line) => total + Number(line.quantity), 0), 0)) < 1e-6);
                if (!complete) { setStep(2); return; }
                setStep(1);
                const verified = await validateQuotePricing(draft.id, draft.revision);
                if (!active) return;
                setQuote(verified);
                setStep(3);
            })
            .catch((error: unknown) => {
                if (active) setMessage(errorMessage(error, 'errors.fallback'));
            })
            .finally(() => { if (active) setReorderLoading(false); });
        return () => { active = false; };
    }, [reorderQuoteId]);

    // Counts presses of "Review quote total" while the delivery step is incomplete.
    const [reviewAttempt, setReviewAttempt] = useState(0);

    // Back from the distribution map (?step=delivery): reopen the quote at the delivery step.
    const resumeDelivery = searchParams.get('step') === 'delivery';
    const resumed = useRef(false);
    useEffect(() => {
        if (!resumeDelivery || resumed.current || reorderQuoteId) return;
        resumed.current = true;
        setSearchParams({}, { replace: true });
        if (session?.user.role === 'CUSTOMER' && selectedItems.length > 0) {
            void Promise.resolve().then(() => startQuote(2));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when arriving with ?step=delivery
    }, [resumeDelivery]);

    // First package: prefill it with the delivery details given at registration, so the
    // customer only enters quantities. Skipped once they clear it or after any package exists.
    const shouldPrefill =
        step === 2 &&
        !!quote &&
        packages.length === 0 &&
        !editingPackageId &&
        !form.profileDefaultDismissed &&
        !form.profilePrefillApplied &&
        session?.user.role === 'CUSTOMER';
    useEffect(() => {
        if (!shouldPrefill) return;
        const controller = new AbortController();
        getCustomerProfile(controller.signal)
            .then((profile) => {
                const province = (profile.province ?? '').toLowerCase();
                const city = province.includes('hồ chí minh') || province.includes('ho chi minh') ? 'HCM' : null;
                const recipient = `${profile.user.lastName ?? ''} ${profile.user.firstName ?? ''}`.trim();
                updateForm(owner, (current) => {
                    if (current.profileDefaultDismissed || current.profilePrefillApplied) return current;
                    const profileAddress = city ? (profile.fullDeliveryAddress ?? profile.deliveryAddress ?? '').trim() : '';
                    const useProfileAddress = !current.parcel.address.trim() && !!profileAddress;
                    return {
                        ...current,
                        profilePrefillApplied: true,
                        parcel: {
                            ...current.parcel,
                            name: current.parcel.name || profile.businessName?.trim() || t('form.defaultPackageName'),
                            recipientName: current.parcel.recipientName || recipient,
                            recipientPhone: current.parcel.recipientPhone || profile.user.phone || '',
                            // Chỉ phục vụ TP. Hồ Chí Minh; địa chỉ nơi khác để khách tự nhập.
                            address: useProfileAddress ? profileAddress : current.parcel.address,
                            city: useProfileAddress ? city! : current.parcel.city,
                            note: current.parcel.note || profile.deliveryNote || '',
                            addressRefId: useProfileAddress ? undefined : current.parcel.addressRefId,
                            latitude: useProfileAddress ? undefined : current.parcel.latitude,
                            longitude: useProfileAddress ? undefined : current.parcel.longitude,
                            fromProfile: useProfileAddress ? true : current.parcel.fromProfile,
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
    const subtotal = reorderQuoteId && quote
        ? quote.items.reduce((sum, item) => sum + Number(item.listUnitPrice) * (Number(reorderQuantities[item.productId]) || 0), 0)
        : selectedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const reorderLines = quote?.items.map(item => ({
        productId: item.productId, quantity: Number(reorderQuantities[item.productId] ?? item.quantity),
    })) ?? [];
    // Same rule as BE: 0 removes the line, otherwise at least the MOQ and MOQ + whole steps (step is 1).
    const reorderValid = !!quote && quote.items.every(item => {
        const raw = reorderQuantities[item.productId] ?? String(item.quantity);
        const quantity = Number(raw);
        const min = Number(item.minOrderQuantity) || 0;
        const increment = Number(item.quantityStep) || 1;
        const steps = (quantity - min) / increment;
        return raw.trim() !== '' && Number.isFinite(quantity) && quantity >= 0 &&
            quantity < 1e9 && Math.abs(quantity * 1000 - Math.round(quantity * 1000)) < 1e-5 &&
            (quantity === 0 || (quantity >= min - 1e-9 && Math.abs(steps - Math.round(steps)) < 1e-6));
    }) && reorderLines.some(item => item.quantity > 0);
    const quoteClosed = !!reorderQuoteId && !!quote && quote.status !== 'DRAFT';
    const reorderChanged = !!quote && reorderLines.some((line, index) =>
        line.quantity !== Number(quote.items[index].quantity));

    function cancelPackageEdit() {
        setEditingPackageId(null);
        setQuantities({});
        setParcel(emptyParcel);
        setPackageError('');
        setReviewAttempt(0);
    }

    function editPackage(item: QuotePackage) {
        if (!quote) return;
        setEditingPackageId(item.id);
        setParcel({
            name: item.name, recipientName: item.recipientName, recipientPhone: item.recipientPhone,
            address: item.address, city: item.city, deliveryDate: item.deliveryDate, note: item.note ?? '',
            latitude: item.latitude == null ? undefined : Number(item.latitude),
            longitude: item.longitude == null ? undefined : Number(item.longitude),
        });
        setQuantities(Object.fromEntries(item.items.flatMap(line => {
            const product = quote.items.find(row => row.id === line.quoteItemId);
            return product ? [[product.productId, String(line.quantity)]] : [];
        })));
        setPackageError('');
        setReviewAttempt(0);
        requestAnimationFrame(() => document.getElementById('package-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }

    async function saveReorderCart() {
        if (!quote || !reorderValid) return;
        if (!reorderChanged) { go(1); return; }
        setBusy(true);
        setMessage('');
        try {
            const updated = await replaceQuoteCart(quote.id, quote.revision, reorderLines.filter(line => line.quantity > 0));
            setQuote(updated);
            setPackages(await getQuotePackages(quote.id));
            cancelPackageEdit();
            go(1);
        } catch (error) {
            await checkoutFailed(error);
        } finally { setBusy(false); }
    }

    function go(next: number) {
        setMessage('');
        setNotice('');
        if (next !== 2 && editingPackageId) cancelPackageEdit();
        if (next === 0 && reorderQuoteId && quote)
            setReorderQuantities(Object.fromEntries(quote.items.map(item => [item.productId, String(item.quantity)])));
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
        // CONFLICT on a quote = it is no longer a DRAFT (already ordered, e.g. in another tab).
        // Reload it so the page switches to the "already ordered" notice instead of a generic error.
        if (code === 'CONFLICT' && quote) {
            try {
                const latest = await getQuote(quote.id);
                if (latest.status !== 'DRAFT') {
                    setQuote(latest);
                    setMessage('');
                    return;
                }
            } catch {
                // Fall through to the generic message.
            }
        }
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
            // A reorder does not consume the customer's current shopping cart or its saved form.
            if (!reorderQuoteId) {
                removePurchased(quote.items.map((item) => item.productId));
            }
            resetForm(owner);
            // replace: Back from the order page must not reopen this quote, which is no longer editable.
            navigate(ROUTES.ORDER_DETAIL.replace(':orderId', order.orderId), {
                replace: true,
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
                    total += Number(item.quantity);
                }
            }
        }
        return total;
    }

    function allocatedOutsideEdit(itemId: string) {
        const current = packages.find(item => item.id === editingPackageId);
        const own = current?.items.find(line => line.quoteItemId === itemId)?.quantity ?? 0;
        return Math.max(0, allocated(itemId) - Number(own));
    }

    async function startQuote(targetStep = 1) {
        if (selectedItems.length === 0) return;
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
                selectedItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
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

    // Coupon codes come only from the current customer's own quote. Never enumerate all coupons.
    async function applyCoupon(scope: CouponScope, code: string): Promise<string | null> {
        if (!quote) return t('errors.fallback');
        setBusy(true);
        setMessage('');
        try {
            setQuote(await applyQuoteCoupons(
                quote.id,
                scope === 'PRODUCT' ? code : (quote.productCouponCode ?? ''),
                scope === 'SHIPPING' ? code : (quote.shippingCouponCode ?? ''),
            ));
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

    async function createPackage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!quote) return;
        setPackageError('');
        const selected: { quoteItemId: string; quantity: number }[] = [];
        for (const item of quote.items) {
            const quantity = Number(quantities[item.productId] || 0);
            const remaining = Number(item.quantity) - allocatedOutsideEdit(item.id);
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
                            'hcm',
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
            const payload = {
                name: parcel.name,
                recipientName: parcel.recipientName,
                recipientPhone: parcel.recipientPhone,
                deliveryDate: parcel.deliveryDate,
                address: parcel.address,
                city: parcel.city,
                note: parcel.note || null,
                latitude: location.lat,
                longitude: location.lng,
                items: selected,
            };
            if (editingPackageId) await updateQuotePackage(quote.id, editingPackageId, payload);
            else await addQuotePackage(quote.id, payload);
            setPackages(await getQuotePackages(quote.id));
            setQuote(await getQuote(quote.id));
            setQuantities({});
            setParcel(emptyParcel);
            setNotice(editingPackageId ? 'notices.packageUpdated' : 'notices.packageAdded');
            setEditingPackageId(null);
            setReviewAttempt(0);
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
            if (editingPackageId === packageId) cancelPackageEdit();
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
    const [reusableCoupons, setReusableCoupons] = useState<{ quoteId: string; revision: number; codes: { code: string; scope: CouponScope }[] } | null>(null);
    useEffect(() => {
        if (!quoteId || revision == null) return;
        const controller = new AbortController();
        void getReusableCoupons(quoteId, controller.signal)
            .then(codes => { if (!controller.signal.aborted) setReusableCoupons({ quoteId, revision, codes }); })
            .catch(() => { if (!controller.signal.aborted) setReusableCoupons(null); });
        return () => controller.abort();
    }, [quoteId, revision]);
    const savedCodes = (scope: CouponScope) =>
        reusableCoupons?.quoteId === quoteId && reusableCoupons?.revision === revision
            ? reusableCoupons?.codes.filter(item => item.scope === scope).map(item => item.code) ?? [] : [];
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
                {reorderQuoteId && <div className="mb-5 mt-5 rounded-xl border border-store-green/25 bg-surface-green p-4 text-sm text-store-green" role="status">
                    <strong>{t('reorder.title')}</strong> — {t('reorder.summary')}
                </div>}
                {reorderLoading && <p role="status" className="my-5 text-store-muted">{t('reorder.loading')}</p>}
                {quoteClosed && (
                    <div role="status" className="my-5 rounded-xl border border-black bg-white p-5">
                        <p className="m-0 font-semibold">{t('reorder.closedTitle')}</p>
                        <p className="mb-4 mt-2 text-sm text-store-muted">{t('reorder.closedHint')}</p>
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => navigate(ROUTES.ORDERS)}
                                className="rounded-lg bg-store-green px-4 py-2 text-sm font-bold text-white">
                                {t('reorder.viewOrders')}
                            </button>
                            <button type="button" onClick={() => { setQuote(null); setStep(0); setSearchParams({}); }}
                                className="rounded-lg border border-black px-4 py-2 text-sm font-bold">
                                {t('reorder.backToCart')}
                            </button>
                        </div>
                    </div>
                )}
                {!reorderLoading && !quoteClosed && <QuoteSteps step={step} busy={busy} onSelectStep={selectStep} />}
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
                {!reorderLoading && !quoteClosed && (!reorderQuoteId || quote) && <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
                    <div className="min-w-0 space-y-5">
                        {step === 0 && (reorderQuoteId && quote ? (
                            <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
                                <h2 className="m-0 font-subheading text-xl font-bold">{t('reorder.cartTitle')}</h2>
                                <p className="mt-2 text-sm text-store-muted">{t('reorder.cartHint')}</p>
                                {quote.items.map(item => (
                                    <label key={item.id} className="flex items-center justify-between gap-4 border-b border-store-ink/10 py-4 last:border-0">
                                        <span><strong>{productName(item)}</strong><span className="block text-sm text-store-muted">{formatCurrencyVnd(Number(item.listUnitPrice))} / {item.unitCode}</span></span>
                                        <input type="number" min={0} step={Number(item.quantityStep) || 'any'}
                                            value={reorderQuantities[item.productId] ?? String(item.quantity)}
                                            disabled={busy}
                                            onChange={event => setReorderQuantities(current => ({ ...current, [item.productId]: event.target.value }))}
                                            aria-label={t('form.quantityLabel', { name: productName(item) })}
                                            className="w-28 rounded-lg border border-store-ink/25 px-3 py-2 text-store-ink" />
                                    </label>
                                ))}
                                {reorderChanged && <p role="status" className="text-sm text-store-muted">{t('reorder.allocationReset')}</p>}
                                {!reorderValid && <p role="alert" className="text-sm text-red-700">{t('reorder.invalidCart')}</p>}
                            </section>
                        ) : <CartItems items={items} updateQuantity={updateQuantity} />)}
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
                                    scope="PRODUCT"
                                    reusableCodes={savedCodes('PRODUCT')}
                                    appliedCode={quote.productCouponCode ?? ''}
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
                                                    {item.deliveryDate}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                            <button type="button" disabled={busy}
                                                onClick={() => editPackage(item)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-store-ink/20 px-3 py-2 text-sm font-bold text-store-green hover:bg-store-cream">
                                                <Pencil size={16} /> {t('form.editTitle')}
                                            </button>
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
                                {(!allAllocated || editingPackageId) && <PackageForm
                                    key={editingPackageId ?? 'new'}
                                    quote={quote}
                                    editing={!!editingPackageId}
                                    onCancelEdit={cancelPackageEdit}
                                    packages={packages.filter(item => item.id !== editingPackageId)}
                                    parcel={parcel}
                                    setParcel={setParcel}
                                    quantities={quantities}
                                    setQuantities={setQuantities}
                                    allocated={allocatedOutsideEdit}
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
                                    onPickOnMap={() => setMapOpen(true)}
                                    revealErrors={reviewAttempt}
                                />}
                                <CouponPicker
                                    scope="SHIPPING"
                                    reusableCodes={savedCodes('SHIPPING')}
                                    appliedCode={quote.shippingCouponCode ?? ''}
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
                                disabled={busy || (reorderQuoteId ? !reorderValid : !selectedItems.length)}
                                onClick={() => void (reorderQuoteId ? saveReorderCart() : startQuote())}
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
                                        if (editingPackageId || !allAllocated || duplicatePackages) {
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
                                    disabled={busy || !!editingPackageId}
                                >
                                    {busy ? t('processing') : t('viewTotal')} <ArrowRight size={17} />
                                </button>
                                {editingPackageId && <p className="mb-0 mt-3 text-xs text-store-muted">{t('form.finishEditing')}</p>}
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
                </div>}
            </main>
            <Footer />
            {mapOpen && (
                <div role="dialog" aria-modal="true" aria-labelledby="delivery-map-title" className="fixed inset-0 z-[100] overflow-y-auto bg-store-cream text-store-ink">
                    <div className="mx-auto max-w-[1440px] px-8 py-8">
                        <button type="button" className={secondary} onClick={() => setMapOpen(false)}>
                            <ArrowLeft size={17} /> {t('back')}
                        </button>
                        <h2 id="delivery-map-title" className="mb-0 mt-5 font-subheading text-3xl font-bold">{t('mapTitle')}</h2>
                        <DistributionExplorer formOwner={owner} onAddressSelected={() => setMapOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
