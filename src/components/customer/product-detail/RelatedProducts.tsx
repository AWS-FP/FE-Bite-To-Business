import { useProductDetailContext } from './ProductDetailModel.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RelatedProductCard from './RelatedProductCard.tsx';

export default function RelatedProducts() {
    const {
        relatedPage,
        setRelatedPage,
        totalRelatedPages,
        visibleRelatedProducts,
        handleSelectSample,
    } = useProductDetailContext();
    return (
        <section className="mx-auto max-w-[1360px] px-4 sm:px-6 mt-14">
            <div className="rounded-[28px] border-2 border-solid border-[#14132b] bg-[#FAF3E3] p-6 sm:p-10 text-[#14132b] shadow-[8px_8px_0_#14132b]">
                <div className="flex flex-wrap items-end justify-between gap-4 border-0 border-b border-solid border-[#14132b]/15 pb-5">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-solid border-[#14132b] bg-[#133425] px-3.5 py-1 text-[10px] font-extrabold uppercase text-white">
                            <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
                            <span>RECOMMENDED PRODUCTS IN THE SAME CATEGORY</span>
                        </span>
                        <h2 className="m-0 mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#14132b]">
                            Related Products &amp; Frequently Bought Together Ingredients
                        </h2>
                        <p className="m-0 mt-1 text-xs text-slate-600">
                            Click on any product card below to view detailed information right on
                            the page
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={relatedPage <= 1}
                            onClick={() => setRelatedPage((p) => Math.max(1, p - 1))}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-[#14132b] bg-white text-[#14132b] shadow-[2px_2px_0_#14132b] disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalRelatedPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setRelatedPage(page)}
                                className={`flex h-9 min-w-[36px] cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-[#14132b] px-2.5 text-xs font-extrabold ${
                                    relatedPage === page
                                        ? 'bg-[#FACC15] text-[#14132b] shadow-[2px_2px_0_#14132b]'
                                        : 'bg-white text-[#14132b]'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={relatedPage >= totalRelatedPages}
                            onClick={() =>
                                setRelatedPage((p) => Math.min(totalRelatedPages, p + 1))
                            }
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-[#14132b] bg-white text-[#14132b] shadow-[2px_2px_0_#14132b] disabled:opacity-40"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {visibleRelatedProducts.map((product) => (
                        <RelatedProductCard
                            key={product.id}
                            product={product}
                            onSelectProduct={handleSelectSample}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
