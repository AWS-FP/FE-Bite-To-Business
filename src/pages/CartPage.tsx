import axios from 'axios';
import { ArrowLeft, ArrowRight, Package, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import QuoteSteps from '@/components/customer/checkout/QuoteSteps';
import QuoteReview from '@/components/customer/checkout/QuoteReview';
import CartItems from '@/components/customer/checkout/CartItems';
import PackageForm from '@/components/customer/checkout/PackageForm';
import type { PackageDraft } from '@/components/customer/checkout/PackageForm';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { ROUTES } from '@/router/routes';
import { addressToCoordinates } from '@/services/geocodingService';
import {
    addQuoteItem,
    addQuotePackage,
    applyQuoteCoupons,
    createQuoteDraft,
    deleteQuotePackage,
    getQuote,
    getQuotePackages,
    refreshQuotePrices,
    saveQuoteContact,
} from '@/services/customer/quoteService';
import type { Quote, QuotePackage } from '@/services/customer/quoteService';
import { useAuthStore } from '@/store/admin/authStore';
import { useCartStore } from '@/store/customer/cartStore';

const field =
    'w-full rounded-lg border border-store-ink/25 bg-white px-3 py-2.5 text-sm text-store-ink focus:border-store-ink focus:outline-none';
const primary =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-0 bg-store-green px-5 py-3 font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';
const secondary =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-store-ink/25 bg-white px-4 py-2 font-bold text-store-ink hover:bg-store-cream';

function errorMessage(error: unknown) {
    const fallback = 'Không thể xử lý yêu cầu. Vui lòng thử lại.';
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
    const navigate = useNavigate();
    const session = useAuthStore((state) => state.session);
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const [step, setStep] = useState(0);
    const [quote, setQuote] = useState<Quote | null>(null);
    const [packages, setPackages] = useState<QuotePackage[]>([]);
    const [productCode, setProductCode] = useState('');
    const [shippingCode, setShippingCode] = useState('');
    const [quantities, setQuantities] = useState<Record<string, string>>({});
    const [parcel, setParcel] = useState<PackageDraft>({
        name: '',
        recipientName: '',
        recipientPhone: '',
        deliveryDate: '',
        deliveryTimeSlot: '',
        address: '',
        note: '',
        city: 'HCM',
    });
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [notice, setNotice] = useState('');
    const [savedDraft, setSavedDraft] = useState<Quote | null>(null);
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    function go(next: number) {
        setMessage('');
        setNotice('');
        setStep(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            setMessage('Vui lòng đăng nhập bằng tài khoản customer để tiếp tục.');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            let draft = await createQuoteDraft();
            let different = false;
            for (const line of draft.items) {
                const cartItem = items.find((item) => item.id === line.productId);
                if (!cartItem || cartItem.quantity !== Number(line.quantity)) {
                    different = true;
                    break;
                }
            }
            if (different) {
                setSavedDraft(draft);
                throw new Error(
                    'Báo giá đã lưu khác với giỏ hàng hiện tại. Bạn có thể mở báo giá đã lưu để kiểm tra.',
                );
            }
            for (const item of items) {
                if (!draft.items.some((line) => line.productId === item.id)) {
                    draft = await addQuoteItem(draft.id, item.id, item.quantity);
                }
            }
            if (!draft.contactName) {
                draft = await saveQuoteContact(draft.id, {
                    name: `${session.user.firstName} ${session.user.lastName}`.trim(),
                    phone: session.user.phone,
                    email: session.user.email,
                });
            }
            const savedPackages = await getQuotePackages(draft.id);
            setSavedDraft(null);
            setQuote(draft);
            setPackages(savedPackages);
            setStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setMessage(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }

    async function openSavedDraft() {
        if (!savedDraft) return;
        setBusy(true);
        setMessage('');
        try {
            setPackages(await getQuotePackages(savedDraft.id));
            setQuote(savedDraft);
            setNotice('Bạn đang xem báo giá đã lưu, có thể khác với giỏ hàng hiện tại.');
            setStep(1);
            setSavedDraft(null);
        } catch (error) {
            setMessage(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }

    async function refreshPrices() {
        if (!quote) return;
        setBusy(true);
        setMessage('');
        try {
            setQuote(await refreshQuotePrices(quote.id));
            setNotice('Đã cập nhật giá và ưu đãi hiện tại. Vui lòng kiểm tra lại báo giá.');
        } catch (error) {
            setMessage(errorMessage(error));
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
            setMessage('Báo giá đang có mã đã lưu. Nhập lại mã đang dùng để giữ mã khi cập nhật.');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            setQuote(await applyQuoteCoupons(quote.id, productCode, shippingCode));
            setNotice('Đã cập nhật ưu đãi.');
        } catch (error) {
            setMessage(errorMessage(error));
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
            setNotice('Đã bỏ các coupon khỏi báo giá.');
        } catch (error) {
            setMessage(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }

    async function createPackage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!quote) return;
        const selected: { quoteItemId: string; quantity: number }[] = [];
        for (const item of quote.items) {
            const quantity = Number(quantities[item.id] || 0);
            const remaining = Number(item.quantity) - allocated(item.id);
            if (quantity > remaining) {
                setMessage(
                    'Chọn số lượng hợp lệ, không vượt quá số lượng còn lại của từng sản phẩm.',
                );
                return;
            }
            if (quantity > 0) {
                selected.push({ quoteItemId: item.id, quantity });
            }
        }
        if (selected.length === 0) {
            setMessage('Chọn số lượng hợp lệ, không vượt quá số lượng còn lại của từng sản phẩm.');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            const location = await addressToCoordinates(
                parcel.address,
                parcel.city === 'HCM' ? 'hcm' : 'hanoi',
            );
            await addQuotePackage(quote.id, {
                ...parcel,
                note: parcel.note || null,
                latitude: location.lat,
                longitude: location.lng,
                items: selected,
            });
            setPackages(await getQuotePackages(quote.id));
            setQuote(await getQuote(quote.id));
            setQuantities({});
            setParcel({
                name: '',
                recipientName: '',
                recipientPhone: '',
                deliveryDate: '',
                deliveryTimeSlot: '',
                address: '',
                note: '',
                city: 'HCM',
            });
            setNotice('Đã thêm gói giao hàng.');
        } catch (error) {
            setMessage(errorMessage(error));
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
            setMessage(errorMessage(error));
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
    const rows = quote
        ? ([
              ['Tiền hàng', quote.itemsSubtotal],
              ['Chiết khấu số lượng', -quote.volumeDiscountAmount],
              ['Ưu đãi sản phẩm', -quote.saleDiscountAmount],
              ['Coupon sản phẩm', -quote.couponDiscountAmount],
          ] as const)
        : [];

    return (
        <div className="min-h-screen bg-store-cream text-store-ink">
            <Header />
            <main id="main-content" className="mx-auto min-h-[60vh] max-w-[1440px] px-8 py-10">
                <p className="m-0 font-subheading text-sm font-bold uppercase tracking-widest text-store-green">
                    Bite to Business
                </p>
                <div className="mt-2 flex items-end justify-between gap-5">
                    <div>
                        <h1 className="m-0 font-display text-4xl font-bold">Giỏ hàng & báo giá</h1>
                        <p className="mb-0 mt-3 text-store-muted">
                            Chọn sản phẩm, chia gói giao và kiểm tra tổng tiền.
                        </p>
                    </div>
                    <Link
                        to={ROUTES.HOME}
                        className="font-bold text-store-green underline underline-offset-4"
                    >
                        Tiếp tục mua hàng
                    </Link>
                </div>
                <QuoteSteps step={step} busy={busy} onSelectStep={go} />
                {message && (
                    <p
                        role="alert"
                        className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        {message}
                    </p>
                )}
                {step === 0 && savedDraft && (
                    <button
                        type="button"
                        className={`${secondary} mb-4`}
                        disabled={busy}
                        onClick={openSavedDraft}
                    >
                        Mở báo giá đã lưu
                    </button>
                )}
                {notice && (
                    <p
                        role="status"
                        className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-store-green"
                    >
                        {notice}
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
                                                Giá sản phẩm & ưu đãi
                                            </h2>
                                            <p className="mb-0 mt-1 text-sm text-store-muted">
                                                Giá hiện tại từ hệ thống, trước phí giao và VAT.
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
                                                    <strong>{item.nameVi}</strong>
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
                                        Coupon sản phẩm
                                    </h2>
                                    <p className="my-3 text-sm text-store-muted">
                                        Nhập tối đa một mã giảm giá sản phẩm.
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            aria-label="Mã giảm giá sản phẩm"
                                            className={field}
                                            value={productCode}
                                            maxLength={8}
                                            onChange={(event) =>
                                                setProductCode(event.target.value.toUpperCase())
                                            }
                                            placeholder="Nhập mã coupon"
                                        />
                                        <button
                                            type="button"
                                            className={secondary}
                                            disabled={busy}
                                            onClick={applyCoupons}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </section>
                            </>
                        )}
                        {step === 1 && quote && (
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className={secondary}
                                    disabled={busy}
                                    onClick={refreshPrices}
                                >
                                    Cập nhật giá hiện tại
                                </button>
                                {(quote.productCouponId || quote.shippingCouponId) && (
                                    <button
                                        type="button"
                                        className={secondary}
                                        disabled={busy}
                                        onClick={removeCoupons}
                                    >
                                        Bỏ tất cả coupon
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
                                                Gói giao hàng
                                            </h2>
                                            <p className="mb-0 mt-1 text-sm text-store-muted">
                                                Chia số lượng sản phẩm cho từng địa chỉ nhận.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        {quote.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-xl bg-store-cream p-4"
                                            >
                                                <strong>{item.nameVi}</strong>
                                                <p className="mb-0 mt-1 text-sm text-store-muted">
                                                    Đã chia {allocated(item.id)} /{' '}
                                                    {Number(item.quantity)} {item.unitCode}
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
                                                    Gói {String(index + 1).padStart(2, '0')}
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
                                                aria-label={`Xóa ${item.name}`}
                                            >
                                                <Trash2 size={19} />
                                            </button>
                                        </div>
                                        <div className="mt-4 border-t border-store-ink/10 pt-3 text-sm">
                                            {item.items.map((line) => (
                                                <p className="my-1" key={line.quoteItemId}>
                                                    {
                                                        quote.items.find(
                                                            (product) =>
                                                                product.id === line.quoteItemId,
                                                        )?.nameVi
                                                    }{' '}
                                                    × {Number(line.quantity)}
                                                </p>
                                            ))}
                                            <p className="mb-0 mt-3 font-bold text-store-green">
                                                Phí giao dự kiến:{' '}
                                                {formatCurrencyVnd(Number(item.shippingFee))}
                                            </p>
                                        </div>
                                    </section>
                                ))}
                                <PackageForm
                                    quote={quote}
                                    parcel={parcel}
                                    setParcel={setParcel}
                                    quantities={quantities}
                                    setQuantities={setQuantities}
                                    allocated={allocated}
                                    busy={busy}
                                    createPackage={createPackage}
                                />
                                <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
                                    <h2 className="m-0 font-subheading text-xl font-bold">
                                        Coupon phí giao
                                    </h2>
                                    <p className="my-3 text-sm text-store-muted">
                                        Nhập tối đa một mã giảm phí giao.
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            aria-label="Mã giảm phí giao"
                                            className={field}
                                            value={shippingCode}
                                            maxLength={8}
                                            onChange={(e) =>
                                                setShippingCode(e.target.value.toUpperCase())
                                            }
                                            placeholder="Nhập mã coupon"
                                        />
                                        <button
                                            type="button"
                                            className={secondary}
                                            disabled={busy}
                                            onClick={applyCoupons}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </section>
                            </>
                        )}
                        {step === 3 && quote && <QuoteReview quote={quote} packages={packages} />}
                    </div>
                    <aside className="sticky top-36 rounded-2xl border border-store-ink/20 bg-white p-6">
                        <h2 className="mb-5 mt-0 font-subheading text-xl font-bold">
                            Tóm tắt báo giá
                        </h2>
                        <div className="space-y-3 text-sm">
                            {step === 0 ? (
                                <div className="flex justify-between">
                                    <span>Tiền hàng dự kiến</span>
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
                                <span className="text-store-muted">Phí giao</span>
                                <strong>
                                    {step >= 2 && quote && packages.length
                                        ? formatCurrencyVnd(Number(quote.shippingFee))
                                        : 'Tính sau'}
                                </strong>
                            </div>
                            {step >= 2 &&
                                quote &&
                                Number(quote.shippingCouponDiscountAmount) > 0 && (
                                    <div className="flex justify-between gap-3">
                                        <span className="text-store-muted">Coupon phí giao</span>
                                        <strong>
                                            -{' '}
                                            {formatCurrencyVnd(
                                                Number(quote.shippingCouponDiscountAmount),
                                            )}
                                        </strong>
                                    </div>
                                )}
                            <div className="flex justify-between gap-3">
                                <span className="text-store-muted">VAT sản phẩm</span>
                                <strong>
                                    {step === 3 && quote?.vatAmount != null
                                        ? formatCurrencyVnd(Number(quote.vatAmount))
                                        : 'Tính sau'}
                                </strong>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-between gap-3 border-t border-store-ink/15 pt-5">
                            <strong>{step === 3 ? 'Tổng dự kiến' : 'Tổng tiền'}</strong>
                            <strong className="text-lg text-store-green">
                                {step === 3 && quote?.vatAmount != null
                                    ? formatCurrencyVnd(Number(quote.estimatedTotalAmount))
                                    : 'Tính sau'}
                            </strong>
                        </div>
                        <p className="my-4 text-xs leading-relaxed text-store-muted">
                            Giá và ưu đãi sẽ được hệ thống kiểm tra lại trước khi thanh toán.
                        </p>
                        {step === 0 && (
                            <button
                                type="button"
                                className={`${primary} w-full`}
                                disabled={!items.length || busy}
                                onClick={startQuote}
                            >
                                {busy
                                    ? 'Đang xử lý...'
                                    : session
                                      ? 'Tiếp tục'
                                      : 'Đăng nhập để tiếp tục'}
                                <ArrowRight size={17} />
                            </button>
                        )}
                        {step === 1 && (
                            <button
                                type="button"
                                className={`${primary} w-full`}
                                onClick={() => go(2)}
                                disabled={busy}
                            >
                                Tạo gói giao hàng <ArrowRight size={17} />
                            </button>
                        )}
                        {step === 2 && (
                            <>
                                <button
                                    type="button"
                                    className={`${primary} w-full`}
                                    onClick={() => go(3)}
                                    disabled={!allAllocated || busy}
                                >
                                    Xem tổng báo giá <ArrowRight size={17} />
                                </button>
                                {!allAllocated && (
                                    <p className="mb-0 mt-3 text-xs text-store-muted">
                                        Hãy chia đủ số lượng sản phẩm vào các gói.
                                    </p>
                                )}
                            </>
                        )}
                        {step === 3 && (
                            <button type="button" className={`${primary} w-full`} disabled>
                                Thanh toán chưa sẵn sàng
                            </button>
                        )}
                        {step > 0 && (
                            <button
                                type="button"
                                className={`${secondary} mt-3 w-full`}
                                disabled={busy}
                                onClick={() => go(step - 1)}
                            >
                                <ArrowLeft size={17} /> Quay lại
                            </button>
                        )}
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
