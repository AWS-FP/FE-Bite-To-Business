import { useProductDetailContext } from './ProductDetailModel.tsx';
import { ChevronDown, MapPin, Package } from 'lucide-react';

export default function OriginAccordion() {
    const { currentProduct, openAccordions, fourthAccordionTriggerRef, toggleAccordion } =
        useProductDetailContext();
    return (
        <div
            ref={fourthAccordionTriggerRef}
            className={`overflow-hidden rounded-[22px] border-2 border-solid border-[#14132b] text-[#14132b] shadow-[5px_5px_0_#14132b] ${
                openAccordions.origin ? 'bg-[#133425]' : 'bg-white'
            }`}
        >
            <button
                type="button"
                onClick={() => toggleAccordion('origin')}
                aria-expanded={openAccordions.origin}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 px-6 py-4 text-left transition-colors ${
                    openAccordions.origin
                        ? 'bg-[#133425] text-white'
                        : 'bg-white text-[#14132b] hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-solid ${
                            openAccordions.origin
                                ? 'border-[#FACC15] bg-[#0F291E] text-[#FACC15]'
                                : 'border-[#14132b] bg-[#F3E8FF] text-purple-900'
                        }`}
                    >
                        <MapPin size={18} />
                    </span>
                    <div>
                        <span className="block font-serif text-base sm:text-lg font-bold">
                            4. Origin &amp; Cold-Chain Traceability
                        </span>
                        <span
                            className={`block text-[11px] ${
                                openAccordions.origin ? 'text-emerald-200' : 'text-slate-500'
                            }`}
                        >
                            Harvest region, port of entry &amp; cold-hub dispatch timeline
                        </span>
                    </div>
                </div>

                <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                        openAccordions.origin ? 'rotate-180 text-[#FACC15]' : 'text-[#14132b]'
                    }`}
                />
            </button>

            {openAccordions.origin && (
                <div className="space-y-4 border-0 border-t-2 border-solid border-[#14132b] bg-[#F8FAFC] p-5 sm:p-6 text-xs">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-solid border-slate-200 bg-white p-3.5">
                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Harvest / Farm Region
                            </span>
                            <strong className="mt-0.5 block text-sm text-[#14132b]">
                                {currentProduct.originTraceability.harvestRegion}
                            </strong>
                        </div>
                        <div className="rounded-xl border border-solid border-slate-200 bg-white p-3.5">
                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Processing Facility
                            </span>
                            <strong className="mt-0.5 block text-sm text-[#14132b]">
                                {currentProduct.originTraceability.processingFacility}
                            </strong>
                        </div>
                        <div className="rounded-xl border border-solid border-slate-200 bg-white p-3.5">
                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Port of Entry / Linehaul
                            </span>
                            <strong className="mt-0.5 block text-sm text-[#14132b]">
                                {currentProduct.originTraceability.importPort}
                            </strong>
                        </div>
                        <div className="rounded-xl border border-solid border-slate-200 bg-white p-3.5">
                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Dispatch Cold Hub
                            </span>
                            <strong className="mt-0.5 block text-sm text-[#133425]">
                                {currentProduct.originTraceability.coldChainHub}
                            </strong>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {currentProduct.originTraceability.lotTimeline.map((item) => (
                            <div
                                key={item.step}
                                className="flex items-start gap-3 rounded-xl border border-solid border-slate-200 bg-white p-3.5"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#133425] text-[#FACC15]">
                                    <Package size={15} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <strong className="text-[#14132b]">{item.step}</strong>
                                        <span className="rounded bg-[#ECFDF5] px-2 py-0.5 font-mono text-[10px] font-bold text-[#133425]">
                                            {item.timestamp}
                                        </span>
                                    </div>
                                    <p className="m-0 mt-1 text-slate-600">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
