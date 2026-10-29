import { useProductDetailContext } from './ProductDetailModel.tsx';
import { Check, ChevronDown, Layers } from 'lucide-react';

export default function TechnicalAccordion() {
    const { currentProduct, openAccordions, toggleAccordion } = useProductDetailContext();
    return (
        <div
            className={`overflow-hidden rounded-[22px] border-2 border-solid border-[#14132b] text-[#14132b] shadow-[5px_5px_0_#14132b] ${
                openAccordions.specs ? 'bg-[#133425]' : 'bg-white'
            }`}
        >
            <button
                type="button"
                onClick={() => toggleAccordion('specs')}
                aria-expanded={openAccordions.specs}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 px-6 py-4 text-left transition-colors ${
                    openAccordions.specs
                        ? 'bg-[#133425] text-white'
                        : 'bg-white text-[#14132b] hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-solid ${
                            openAccordions.specs
                                ? 'border-[#FACC15] bg-[#0F291E] text-[#FACC15]'
                                : 'border-[#14132b] bg-[#ECFDF5] text-[#133425]'
                        }`}
                    >
                        <Layers size={18} />
                    </span>
                    <div>
                        <span className="block font-serif text-base sm:text-lg font-bold">
                            1. Technical Specifications &amp; Logistics (From Catalog)
                        </span>
                        <span
                            className={`block text-[11px] ${
                                openAccordions.specs ? 'text-emerald-200' : 'text-slate-500'
                            }`}
                        >
                            Supplying enterprise, net/tare weight, dimensions, MOQ &amp; VAT
                        </span>
                    </div>
                </div>

                <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                        openAccordions.specs ? 'rotate-180 text-[#FACC15]' : 'text-[#14132b]'
                    }`}
                />
            </button>

            {openAccordions.specs && (
                <div className="space-y-5 border-0 border-t-2 border-solid border-[#14132b] bg-[#F8FAFC] p-5 sm:p-6">
                    <div className="rounded-xl border-2 border-solid border-[#14132b] bg-[#14132b]">
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-[10px] bg-[#14132b] px-4 py-2.5 text-xs">
                            <span className="font-extrabold uppercase tracking-wider text-white">
                                B2B MASTER CATALOG STANDARDIZED DATA
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[#FACC15]">
                                {currentProduct.masterCatalogCode}
                            </span>
                        </div>

                        <div className="divide-y divide-slate-200 rounded-b-[10px] bg-white text-xs overflow-hidden">
                            <div className="grid grid-cols-12 bg-[#FEFCE8] px-4 py-3.5">
                                <span className="col-span-5 font-extrabold text-[#133425]">
                                    Supplying Enterprise
                                </span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.enterpriseName}
                                    <span className="mt-0.5 block text-[11px] font-semibold text-emerald-700">
                                        Tax ID (MST):{' '}
                                        {currentProduct.technicalSpecs.enterpriseTaxId}
                                    </span>
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    Industry Group / Subgroup
                                </span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.industryGroup}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    Trade name
                                </span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.tradeName}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    NetWeight
                                </span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.netWeight}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    TareWeight
                                </span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.tareWeight}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    Volume
                                </span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.volume}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    Dimensions (Wi × He × De)
                                </span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.dimensions}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    Minimum quantity
                                </span>
                                <span className="col-span-7 font-extrabold text-[#DC2626]">
                                    {currentProduct.technicalSpecs.minimumQuantity}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">VAT</span>
                                <span className="col-span-7 font-extrabold text-[#14132b]">
                                    {currentProduct.technicalSpecs.vatInfo}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 px-4 py-2.5">
                                <span className="col-span-5 font-medium text-slate-500">
                                    Attribute filter
                                </span>
                                <span className="col-span-7 font-extrabold text-[#133425]">
                                    {currentProduct.technicalSpecs.attributeFilter}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-solid border-[#14132b] bg-[#133425] p-5 text-white">
                        <span className="inline-block rounded-full border border-solid border-[#14132b] bg-[#FACC15] px-3 py-0.5 text-[10px] font-extrabold uppercase text-[#14132b]">
                            {currentProduct.kitchenCommitment.badge}
                        </span>
                        <h3 className="m-0 mt-3 font-serif text-lg font-bold text-[#FACC15]">
                            {currentProduct.kitchenCommitment.title}
                        </h3>
                        <p className="m-0 mt-2 text-xs leading-relaxed text-emerald-100">
                            {currentProduct.kitchenCommitment.description}
                        </p>
                        <ul className="mt-4 list-none space-y-2 border-0 border-t border-solid border-white/15 pt-3 p-0 text-xs">
                            {currentProduct.kitchenCommitment.bullets.map((b) => (
                                <li key={b} className="flex items-start gap-2">
                                    <Check size={14} className="mt-0.5 shrink-0 text-[#4ADE80]" />
                                    <span className="text-white">{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
