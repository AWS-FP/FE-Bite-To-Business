import { useProductDetailContext } from './ProductDetailModel.tsx';
import { FileText, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { formatCurrencyVnd } from '../../../constants/customer/homeData';

export default function ProductPurchase() {
    const {
        currentProduct,
        quantity,
        setQuantity,
        showNoteBox,
        setShowNoteBox,
        lineNote,
        setLineNote,
        addedFeedback,
        minimumQuantity,
        vatMultiplier,
        effectiveUnitPrice,
        totalLinePrice,
        savedAmount,
        handleAddMainProductToCart,
    } = useProductDetailContext();
    return (
        <div className="overflow-hidden rounded-[26px] border-2 border-solid border-[#14132b] bg-[#14132b] text-[#14132b] shadow-[7px_7px_0_#14132b]">
            {/* Dark Slate Header — Matches wrapper bg-[#14132b] so ZERO white pixels bleed! */}
            <div className="flex items-center justify-between bg-[#14132b] px-6 py-4 text-white">
                <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#FACC15]">
                        B2B WHOLESALE ORDER BOX
                    </span>
                    <span className="font-serif text-base font-bold text-white">
                        Instant Stock Lock &amp; Tier Pricing
                    </span>
                </div>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-extrabold text-[#4ADE80]">
                    In Stock
                </span>
            </div>

            {/* White Body */}
            <div className="space-y-5 bg-white p-6">
                <div className="flex items-baseline justify-between border-0 border-b border-solid border-slate-200 pb-4">
                    <div>
                        <span className="block text-xs font-semibold text-slate-400 line-through">
                            List Price: {formatCurrencyVnd(currentProduct.listPrice)} /{' '}
                            {currentProduct.unit}
                        </span>
                        <div className="mt-0.5 flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-[#133425]">
                                {formatCurrencyVnd(effectiveUnitPrice)}
                            </span>
                            <span className="text-sm font-extrabold text-slate-600">
                                / {currentProduct.unit}
                            </span>
                        </div>
                        <span className="mt-1 block text-[11px] text-slate-500">
                            Incl. {currentProduct.vatRateLabel} VAT:{' '}
                            <strong className="text-[#14132b]">
                                {formatCurrencyVnd(Math.round(effectiveUnitPrice * vatMultiplier))}{' '}
                                / {currentProduct.unit}
                            </strong>
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="inline-block rounded-lg border border-solid border-[#14132b] bg-[#FACC15] px-2.5 py-1 text-[11px] font-extrabold text-[#14132b]">
                            MOQ: {currentProduct.moqLabel}
                        </span>
                        <span className="mt-1.5 block text-[11px] font-bold text-[#DC2626]">
                            Save {formatCurrencyVnd(savedAmount)}
                        </span>
                    </div>
                </div>

                {/* Volume Discount Tiers */}
                <div>
                    <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                        Volume Discount Tiers (Click to apply):
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        {[
                            {
                                minQty: minimumQuantity,
                                label: minimumQuantity + ' – 9 ' + currentProduct.unit,
                                price: currentProduct.sellingPrice,
                                badge: 'Standard',
                            },
                            {
                                minQty: 10,
                                label: '10 – 24 ' + currentProduct.unit,
                                price: Math.round(currentProduct.sellingPrice * 0.96),
                                badge: '-4% Tier',
                            },
                            {
                                minQty: 25,
                                label: '25+ ' + currentProduct.unit,
                                price: Math.round(currentProduct.sellingPrice * 0.92),
                                badge: '-8% VIP',
                            },
                        ].map((tier) => {
                            const isCurrentTier =
                                (tier.minQty === minimumQuantity && quantity < 10) ||
                                (tier.minQty === 10 && quantity >= 10 && quantity < 25) ||
                                (tier.minQty === 25 && quantity >= 25);
                            return (
                                <button
                                    key={tier.label}
                                    type="button"
                                    onClick={() => setQuantity(tier.minQty)}
                                    className={`cursor-pointer rounded-xl p-2.5 transition-all ${
                                        isCurrentTier
                                            ? 'border-2 border-solid border-[#133425] bg-[#ECFDF5] text-[#133425] shadow-sm'
                                            : 'border border-solid border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="block text-[10px] font-extrabold uppercase text-emerald-700">
                                        {tier.badge}
                                    </span>
                                    <span className="mt-0.5 block font-bold text-[#14132b]">
                                        {tier.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs font-black text-[#133425]">
                                        {formatCurrencyVnd(tier.price)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Quantity + Live Total Money */}
                <div className="rounded-2xl border-2 border-solid border-[#14132b] bg-[#F8FAFC] p-4">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-extrabold text-[#14132b]">
                            Order Quantity ({currentProduct.unit}):
                        </span>

                        <div className="flex h-10 items-center rounded-xl border-2 border-solid border-[#14132b] bg-white px-2.5">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(minimumQuantity, q - 1))}
                                aria-label="Decrease quantity"
                                className="flex h-7 w-7 cursor-pointer items-center justify-center border-0 bg-transparent text-[#14132b] hover:text-[#DC2626]"
                            >
                                <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="min-w-[38px] text-center text-sm font-black text-[#14132b]">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                aria-label="Increase quantity"
                                className="flex h-7 w-7 cursor-pointer items-center justify-center border-0 bg-transparent text-[#14132b] hover:text-[#15803D]"
                            >
                                <Plus size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between border-0 border-t border-solid border-slate-200 pt-3">
                        <span className="text-xs font-bold text-slate-600">
                            Total Money (Excl. VAT):
                        </span>
                        <span className="text-2xl font-black text-[#DC2626]">
                            {formatCurrencyVnd(totalLinePrice)}
                        </span>
                    </div>
                </div>

                {/* Add to Cart + Note */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleAddMainProductToCart}
                        className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-solid border-[#14132b] bg-[#133425] px-5 text-xs sm:text-sm font-extrabold text-white shadow-[3px_3px_0_#14132b] transition-transform hover:-translate-y-0.5 hover:bg-[#1a4733]"
                    >
                        <span>
                            {addedFeedback
                                ? '✓ Added to Cart!'
                                : `+ Add to Cart • ${formatCurrencyVnd(totalLinePrice)}`}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowNoteBox((prev) => !prev)}
                        className="flex h-12 cursor-pointer items-center gap-1.5 rounded-xl border-2 border-solid border-[#14132b] bg-[#FACC15] px-4 text-xs font-extrabold text-[#14132b] shadow-[3px_3px_0_#14132b] hover:bg-yellow-300"
                    >
                        <FileText size={15} />
                        <span>note</span>
                    </button>
                </div>

                {showNoteBox && (
                    <div className="rounded-xl border border-solid border-[#133425] bg-[#ECFDF5] p-3">
                        <label className="mb-1 block text-[11px] font-extrabold text-[#133425]">
                            Kitchen Portioning / Cutting Note:
                        </label>
                        <input
                            type="text"
                            value={lineNote}
                            onChange={(e) => setLineNote(e.target.value)}
                            placeholder="E.g. Cut into 0.5kg trays, vacuum seal separately..."
                            className="w-full rounded-lg border border-solid border-slate-300 bg-white px-3 py-2 text-xs text-[#14132b] outline-none focus:border-[#133425]"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1 text-[#133425]">
                        <ShieldCheck size={14} /> Payment upon delivery
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#133425]">
                        <Truck size={14} /> Cold Truck 0–2°C
                    </span>
                </div>
            </div>
        </div>
    );
}
