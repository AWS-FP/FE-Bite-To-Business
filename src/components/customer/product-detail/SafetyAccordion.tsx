import { useProductDetailContext } from './ProductDetailModel.tsx';
import { ChevronDown, FileCheck2 } from 'lucide-react';

export default function SafetyAccordion() {
    const { currentProduct, openAccordions, toggleAccordion } = useProductDetailContext();
    return (
        <div
            className={`overflow-hidden rounded-[22px] border-2 border-solid border-[#14132b] text-[#14132b] shadow-[5px_5px_0_#14132b] ${
                openAccordions.safety ? 'bg-[#133425]' : 'bg-white'
            }`}
        >
            <button
                type="button"
                onClick={() => toggleAccordion('safety')}
                aria-expanded={openAccordions.safety}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 px-6 py-4 text-left transition-colors ${
                    openAccordions.safety
                        ? 'bg-[#133425] text-white'
                        : 'bg-white text-[#14132b] hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-solid ${
                            openAccordions.safety
                                ? 'border-[#FACC15] bg-[#0F291E] text-[#FACC15]'
                                : 'border-[#14132b] bg-[#FEF3C7] text-amber-900'
                        }`}
                    >
                        <FileCheck2 size={18} />
                    </span>
                    <div>
                        <span className="block font-serif text-base sm:text-lg font-bold">
                            3. Food Safety and Hygiene Dossier
                        </span>
                        <span
                            className={`block text-[11px] ${
                                openAccordions.safety ? 'text-emerald-200' : 'text-slate-500'
                            }`}
                        >
                            VietGAP / GlobalGAP / HACCP certificates &amp; batch microbial lab tests
                        </span>
                    </div>
                </div>

                <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                        openAccordions.safety ? 'rotate-180 text-[#FACC15]' : 'text-[#14132b]'
                    }`}
                />
            </button>

            {openAccordions.safety && (
                <div className="space-y-4 border-0 border-t-2 border-solid border-[#14132b] bg-[#FFFDF5] p-5 sm:p-6 text-xs">
                    <div className="space-y-2.5">
                        {currentProduct.foodSafetyDossier.certifications.map((cert) => (
                            <div
                                key={cert.code}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-solid border-slate-200 bg-white p-3.5"
                            >
                                <div>
                                    <strong className="block text-[#14132b]">{cert.code}</strong>
                                    <span className="text-[11px] text-slate-500">
                                        Issued by: {cert.issuer}
                                    </span>
                                </div>
                                <span className="rounded-md bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#133425]">
                                    Valid: {cert.validUntil}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl border border-solid border-[#14132b] bg-[#14132b]">
                        <div className="grid grid-cols-12 rounded-t-[10px] bg-[#14132b] px-4 py-2.5 font-bold text-white">
                            <span className="col-span-5">Lab Parameter</span>
                            <span className="col-span-3">Standard Limit</span>
                            <span className="col-span-4 text-right text-[#FACC15]">
                                Batch Result
                            </span>
                        </div>
                        <div className="divide-y divide-slate-200 rounded-b-[10px] bg-white overflow-hidden">
                            {currentProduct.foodSafetyDossier.microbialStandards.map((row) => (
                                <div key={row.parameter} className="grid grid-cols-12 px-4 py-2.5">
                                    <span className="col-span-5 font-semibold text-[#14132b]">
                                        {row.parameter}
                                    </span>
                                    <span className="col-span-3 text-slate-500">{row.limit}</span>
                                    <span className="col-span-4 text-right font-extrabold text-emerald-700">
                                        {row.result}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
