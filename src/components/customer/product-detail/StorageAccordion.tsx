import { useProductDetailContext } from './ProductDetailModel.tsx';
import { Check, ChevronDown, Snowflake } from 'lucide-react';

export default function StorageAccordion() {
    const { currentProduct, openAccordions, toggleAccordion } = useProductDetailContext();
    return (
        <div
            className={`overflow-hidden rounded-[22px] border-2 border-solid border-[#14132b] text-[#14132b] shadow-[5px_5px_0_#14132b] ${
                openAccordions.storage ? 'bg-[#133425]' : 'bg-white'
            }`}
        >
            <button
                type="button"
                onClick={() => toggleAccordion('storage')}
                aria-expanded={openAccordions.storage}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 px-6 py-4 text-left transition-colors ${
                    openAccordions.storage
                        ? 'bg-[#133425] text-white'
                        : 'bg-white text-[#14132b] hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-solid ${
                            openAccordions.storage
                                ? 'border-[#FACC15] bg-[#0F291E] text-[#FACC15]'
                                : 'border-[#14132b] bg-[#E0F2FE] text-sky-900'
                        }`}
                    >
                        <Snowflake size={18} />
                    </span>
                    <div>
                        <span className="block font-serif text-base sm:text-lg font-bold">
                            2. Head Chef Standards &amp; Storage Guidelines
                        </span>
                        <span
                            className={`block text-[11px] ${
                                openAccordions.storage ? 'text-emerald-200' : 'text-slate-500'
                            }`}
                        >
                            Chiller temperature zone, shelf-life matrix &amp; culinary SOP
                        </span>
                    </div>
                </div>

                <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                        openAccordions.storage ? 'rotate-180 text-[#FACC15]' : 'text-[#14132b]'
                    }`}
                />
            </button>

            {openAccordions.storage && (
                <div className="space-y-4 border-0 border-t-2 border-solid border-[#14132b] bg-[#F0F9FF] p-5 sm:p-6 text-xs">
                    <div className="rounded-xl border border-solid border-sky-200 bg-white p-4 divide-y divide-slate-100">
                        <div className="flex justify-between py-2.5">
                            <span className="text-slate-500">Target Temperature Zone:</span>
                            <strong className="text-[#133425]">
                                {currentProduct.chefStorageGuidelines.tempZone}
                            </strong>
                        </div>
                        <div className="flex justify-between py-2.5">
                            <span className="text-slate-500">Shelf Life (Unopened Vacuum):</span>
                            <strong className="text-[#14132b]">
                                {currentProduct.chefStorageGuidelines.shelfLifeUnopened}
                            </strong>
                        </div>
                        <div className="flex justify-between py-2.5">
                            <span className="text-slate-500">Shelf Life (After Opening):</span>
                            <strong className="text-[#DC2626]">
                                {currentProduct.chefStorageGuidelines.shelfLifeOpened}
                            </strong>
                        </div>
                    </div>

                    <div className="rounded-xl border border-solid border-amber-300 bg-[#FFFBEB] p-4">
                        <strong className="block text-amber-950">
                            Recommended Thawing &amp; Handling Protocol:
                        </strong>
                        <p className="m-0 mt-1 text-amber-900 leading-relaxed">
                            {currentProduct.chefStorageGuidelines.thawingMethod}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <strong className="block text-[#14132b]">
                            Executive Chef Preparation Notes:
                        </strong>
                        {currentProduct.chefStorageGuidelines.chefNotes.map((note) => (
                            <div
                                key={note}
                                className="flex items-start gap-2.5 rounded-xl border border-solid border-slate-200 bg-white p-3"
                            >
                                <Check size={15} className="mt-0.5 shrink-0 text-[#15803D]" />
                                <span className="font-medium text-[#14132b]">{note}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
