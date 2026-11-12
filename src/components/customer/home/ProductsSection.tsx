import { useHomeModelContext } from './HomeModel.tsx';
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
        flashProductCount,
        standardProductCount,
        loadingProducts,
        productError,
    } = useHomeModelContext();
    return (
        <section className="mx-auto max-w-[1320px] px-5 py-6">
            <div className="rounded-[28px] border-2 border-solid border-store-ink bg-store-cream p-10 text-store-ink shadow-[8px_8px_0_var(--color-store-ink)]">
                {/* 4A: EARLY MARKET FLASH DEALS */}
                <div id="early-market-deals">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-store-ink bg-danger px-3 py-1 text-[10px] font-extrabold uppercase text-white shadow-[2px_2px_0_var(--color-store-ink)]">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span>{t('homePage.clearanceBadge', 'WHOLESALE CLEARANCE')}</span>
                            </span>
                            <h2 className="m-0 mt-2 font-subheading lining-nums text-3xl font-bold text-store-ink">
                                {t(
                                    'homePage.flashDealsTitle',
                                    'Early Market Flash Deals — Daily Specials',
                                )}
                            </h2>
                        </div>

                    </div>

                    {loadingProducts && <p>{t('homePage.productsLoading')}</p>}
                    {productError && <p role="alert">{t('homePage.productsError')}</p>}
                    {!loadingProducts && !productError && flashProductCount === 0 && <p>{t('homePage.flashEmpty')}</p>}

                    <div className="mt-7 grid gap-6 grid-cols-3">
                        {visibleFlashProducts.map((product) => (
                            <ProductShowcaseCard
                                key={product.id}
                                product={product}
                                section="flash"
                            />
                        ))}
                    </div>

                    {/* Pagination Bar for Flash Deals */}
                    <SectionPaginationBar
                        currentPage={flashPage}
                        totalPages={totalFlashPages}
                        totalItems={flashProductCount}
                        pageSize={flashPageSize}
                        onPageChange={setFlashPage}
                    />
                </div>

                <hr className="my-12 border-0 border-t border-dashed border-store-ink/35" />

                {/* 4B: B2B STANDARD FOOD SUPPLY */}
                <div id="b2b-standard-supply">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-solid border-store-ink bg-success px-3 py-1 text-[10px] font-extrabold uppercase text-white shadow-[2px_2px_0_var(--color-store-ink)]">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span>{t('homePage.freshBatchBadge', 'FRESH BATCH ARRIVED')}</span>
                            </span>
                            <h2 className="m-0 mt-2 font-subheading lining-nums text-3xl font-bold text-store-ink">
                                {t('homePage.standardSupplyTitle', 'B2B Standard Food Supply')}
                            </h2>
                        </div>
                    </div>

                    {!loadingProducts && !productError && standardProductCount === 0 && <p>{t('homePage.productsEmpty')}</p>}

                    <div className="mt-7 grid gap-6 grid-cols-3">
                        {visibleStandardProducts.map((product) => (
                            <ProductShowcaseCard
                                key={product.id}
                                product={product}
                                section="standard"
                            />
                        ))}
                    </div>

                    {/* Pagination Bar for B2B Standard Supply */}
                    <SectionPaginationBar
                        currentPage={standardPage}
                        totalPages={totalStandardPages}
                        totalItems={standardProductCount}
                        pageSize={standardPageSize}
                        onPageChange={setStandardPage}
                    />
                </div>
            </div>
        </section>
    );
}
