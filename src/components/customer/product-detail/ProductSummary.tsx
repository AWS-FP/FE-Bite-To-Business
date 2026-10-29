import { useProductDetailContext } from './ProductDetailModel.tsx';
import { Check, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export default function ProductSummary() {
    const { setOpenAccordions, currentProduct, activeThumbIdx, setActiveThumbIdx } =
        useProductDetailContext();
    return (
        <div className="overflow-hidden rounded-[26px] border-2 border-solid border-[#14132b] bg-[#F8FAFC] p-6 sm:p-8 text-[#14132b] shadow-[7px_7px_0_#14132b]">
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-[#133425] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#FACC15]">
                    {currentProduct.categoryUpper}
                </span>
                <span className="rounded-full border border-solid border-[#14132b] bg-[#FACC15] px-3 py-0.5 text-[10px] font-extrabold uppercase text-[#14132b]">
                    {currentProduct.enterpriseName}
                </span>
                <span className="rounded-full border border-solid border-emerald-700/30 bg-emerald-50 px-3 py-0.5 text-[10px] font-bold text-emerald-900">
                    ● {currentProduct.warehouseBadge}
                </span>
            </div>

            <h1 className="m-0 mt-3 font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#14132b]">
                {currentProduct.name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span>
                    SKU:{' '}
                    <strong className="font-mono font-extrabold text-[#14132b]">
                        {currentProduct.skuCode}
                    </strong>
                </span>
                <span>•</span>
                <span>
                    Origin:{' '}
                    <strong className="text-[#133425]">{currentProduct.originCountry}</strong>
                </span>
                <span>•</span>
                <span>
                    MOQ: <strong className="text-[#DC2626]">{currentProduct.moqLabel}</strong>
                </span>
            </div>

            {/* Main Image Frame */}
            <div className="relative mt-5 h-[320px] sm:h-[380px] w-full overflow-hidden rounded-2xl border-2 border-solid border-[#14132b] bg-[#E2E8F0]">
                {currentProduct.galleryImages[activeThumbIdx] ? (
                    <img
                        src={currentProduct.galleryImages[activeThumbIdx]}
                        alt={currentProduct.name}
                        className="block h-full w-full object-cover"
                    />
                ) : (
                    /* TODO: NHÉT HÌNH SẢN PHẨM VÀO galleryImages TRONG homeData.ts */
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                        <span className="text-sm font-extrabold uppercase tracking-wider text-[#133425]">
                            [ Main Product Image #{activeThumbIdx + 1} —{' '}
                            {currentProduct.sampleButtonLabel} ]
                        </span>
                        <span className="mt-1 text-xs text-slate-600">
                            Add image URL to{' '}
                            <code>
                                CATALOG_PRODUCT_DETAILS.{currentProduct.id}
                                .galleryImages
                            </code>
                        </span>
                    </div>
                )}

                <span className="absolute top-3.5 left-3.5 rounded-full border border-solid border-[#14132b] bg-[#FACC15] px-3.5 py-1 text-xs font-extrabold text-[#14132b] shadow-[2px_2px_0_#14132b]">
                    {currentProduct.topLeftBadge}
                </span>

                <span className="absolute right-3.5 bottom-3.5 rounded-md bg-[#133425] px-3 py-1 text-[11px] font-bold text-white">
                    {currentProduct.certBadge}
                </span>
            </div>

            {/* 4 Thumbnails Row */}
            <div className="mt-3.5 grid grid-cols-4 gap-3">
                {[0, 1, 2].map((idx) => {
                    const thumbUrl = currentProduct.galleryImages[idx];
                    const isSelected = activeThumbIdx === idx;
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveThumbIdx(idx)}
                            className={`h-[80px] cursor-pointer overflow-hidden rounded-xl bg-[#E2E8F0] p-0 transition-all ${
                                isSelected
                                    ? 'border-2 border-solid border-[#133425] ring-2 ring-[#133425]/30'
                                    : 'border border-solid border-slate-300 opacity-80 hover:opacity-100'
                            }`}
                        >
                            {thumbUrl ? (
                                <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <span className="block text-[11px] font-bold text-[#133425]">
                                    Photo #{idx + 1}
                                </span>
                            )}
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={() => setOpenAccordions((prev) => ({ ...prev, safety: true }))}
                    className="flex h-[80px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-solid border-[#133425] bg-[#ECFDF5] p-2 text-center text-[#133425] transition-colors hover:bg-[#D1FAE5]"
                >
                    <ShieldCheck size={18} className="mb-1 text-[#133425]" />
                    <span className="text-[10px] font-extrabold leading-tight">
                        Veterinary Health Certificate
                    </span>
                </button>
            </div>

            {/* 3 Service Guarantees */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-xl border border-solid border-emerald-300 bg-[#ECFDF5] p-3.5 text-center">
                    <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#133425] text-[#FACC15]">
                        <Check size={14} strokeWidth={2.5} />
                    </div>
                    <span className="block font-extrabold text-[#133425]">
                        {currentProduct.highlights[0]?.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-emerald-800">
                        {currentProduct.highlights[0]?.subtitle}
                    </span>
                </div>

                <div className="rounded-xl border border-solid border-sky-300 bg-[#F0F9FF] p-3.5 text-center">
                    <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-900 text-sky-200">
                        <Zap size={14} />
                    </div>
                    <span className="block font-extrabold text-sky-950">
                        {currentProduct.highlights[1]?.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-sky-800">
                        {currentProduct.highlights[1]?.subtitle}
                    </span>
                </div>

                <div className="rounded-xl border border-solid border-amber-300 bg-[#FFFBEB] p-3.5 text-center">
                    <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-900 text-[#FACC15]">
                        <RefreshCw size={14} />
                    </div>
                    <span className="block font-extrabold text-amber-950">
                        {currentProduct.highlights[2]?.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-amber-800">
                        {currentProduct.highlights[2]?.subtitle}
                    </span>
                </div>
            </div>
        </div>
    );
}
