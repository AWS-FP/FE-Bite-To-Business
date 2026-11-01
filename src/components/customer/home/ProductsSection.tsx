import { useHomeModelContext } from './HomeModel.tsx';
import { FLASH_SALE_PRODUCTS, STANDARD_B2B_PRODUCTS } from '../../../constants/customer/homeData';
import ProductShowcaseCard from './ProductShowcaseCard.tsx';
import SectionPaginationBar from './SectionPaginationBar.tsx';

export default function ProductsSection() {
    const {
        flashPageSize,
        standardPageSize,
        t,
        flashPage,
        setFlashPage,
        totalFlashPages,
        visibleFlashProducts,
        standardPage,
        setStandardPage,
        totalStandardPages,
        visibleStandardProducts,
        hours,
        minutes,
        seconds,
    } = useHomeModelContext();
    return (
        <section className="mx-auto max-w-[1320px] px-5 py-6">
            <div className="rounded-[28px] border-2 border-solid border-[#14132b] bg-[#FAF3E3] p-6 sm:p-10 text-[#14132b] shadow-[8px_8px_0_#14132b]">
                {/* 4A: EARLY MARKET FLASH DEALS */}
                <div id="early-market-deals">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-[#14132b] bg-[#EF4444] px-3 py-1 text-[10px] font-extrabold uppercase text-white shadow-[2px_2px_0_#14132b]">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span>{t('homePage.clearanceBadge', 'WHOLESALE CLEARANCE')}</span>
                            </span>
                            <h2 className="m-0 mt-2 font-['Times_New_Roman',Georgia,serif] lining-nums text-2xl sm:text-3xl font-bold text-[#14132b]">
                                {t(
                                    'homePage.flashDealsTitle',
                                    'Early Market Flash Deals — Daily Specials',
                                )}
                            </h2>
                        </div>

                        {/* Countdown + Quick Prev/Next Arrows */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#14132b]">
                                <span>{t('homePage.batchClosesIn', 'Batch closes in:')}</span>
                                <span className="rounded-lg bg-[#14132b] px-2.5 py-1.5 font-mono text-xs font-extrabold text-[#FACC15]">
                                    {hours} {t('homePage.hrs', 'hrs')}
                                </span>
                                <span className="rounded-lg bg-[#14132b] px-2.5 py-1.5 font-mono text-xs font-extrabold text-[#FACC15]">
                                    {minutes} {t('homePage.min', 'min')}
                                </span>
                                <span className="rounded-lg bg-[#14132b] px-2.5 py-1.5 font-mono text-xs font-extrabold text-[#FACC15]">
                                    {seconds} {t('homePage.sec', 'sec')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {visibleFlashProducts.map((product) => (
                            <ProductShowcaseCard key={product.id} product={product} section="flash" />
                        ))}
                    </div>

                    {/* Pagination Bar for Flash Deals */}
                    <SectionPaginationBar
                        currentPage={flashPage}
                        totalPages={totalFlashPages}
                        totalItems={FLASH_SALE_PRODUCTS.length}
                        pageSize={flashPageSize}
                        onPageChange={setFlashPage}
                    />
                </div>

                <hr className="my-12 border-0 border-t border-dashed border-[#14132b]/35" />

                {/* 4B: B2B STANDARD FOOD SUPPLY */}
                <div id="b2b-standard-supply">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-[#14132b] bg-[#15803D] px-3 py-1 text-[10px] font-extrabold uppercase text-white shadow-[2px_2px_0_#14132b]">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span>{t('homePage.freshBatchBadge', 'FRESH BATCH ARRIVED')}</span>
                            </span>
                            <h2 className="m-0 mt-2 font-['Times_New_Roman',Georgia,serif] lining-nums text-2xl sm:text-3xl font-bold text-[#14132b]">
                                {t('homePage.standardSupplyTitle', 'B2B Standard Food Supply')}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {visibleStandardProducts.map((product) => (
                            <ProductShowcaseCard key={product.id} product={product} section="standard" />
                        ))}
                    </div>

                    {/* Pagination Bar for B2B Standard Supply */}
                    <SectionPaginationBar
                        currentPage={standardPage}
                        totalPages={totalStandardPages}
                        totalItems={STANDARD_B2B_PRODUCTS.length}
                        pageSize={standardPageSize}
                        onPageChange={setStandardPage}
                    />
                </div>
            </div>
        </section>
    );
}
