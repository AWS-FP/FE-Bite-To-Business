import { ROUTES } from '../../../router/routes';
import { useHomeModelContext } from './HomeModel.tsx';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOME_CATEGORIES } from '../../../constants/customer/homeData';
import { getCatalogSearchPath } from '../../../constants/catalogNavigation';
import CategoryArtwork from '../CategoryArtwork.tsx';

export default function CategorySection() {
    const { t } = useHomeModelContext();
    return (
        <section className="mx-auto max-w-[1320px] px-5 pt-14 pb-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-[#FACC15]">
                        {t('homePage.ecosystemTag', '14-CATEGORY B2B FOOD ECOSYSTEM')}
                    </span>
                    <h2 className="m-0 mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#FAF3E3]">
                        {t('homePage.ecosystemTitle', 'Comprehensive Ingredient Catalog')}
                    </h2>
                </div>

                <Link
                    to={ROUTES.CATALOG}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-solid border-[#14132b] bg-[#FAF3E3] px-5 py-3 text-xs font-extrabold text-[#14132b] no-underline shadow-[4px_4px_0_#14132b] transition-transform hover:-translate-y-0.5 hover:bg-white"
                >
                    <span>
                        {t('homePage.downloadCatalogBtn', 'Download 850+ SKU Catalog (Excel)')}
                    </span>
                    <ArrowRight size={15} />
                </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {HOME_CATEGORIES.map((cat) => (
                    <Link
                        key={cat.key}
                        to={getCatalogSearchPath(cat.searchKeyword)}
                        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border-2 border-solid border-[#14132b] bg-white p-4 text-[#14132b] no-underline shadow-[4px_4px_0_#14132b] transition-all duration-200 hover:-translate-y-1 hover:bg-[#FFF5C0]"
                    >
                        <div className="pointer-events-none absolute right-1 bottom-2 transition-transform duration-300 group-hover:scale-110">
                            <CategoryArtwork categoryKey={cat.key} iconUrl={cat.iconUrl} />
                        </div>

                        <div className="relative z-10">
                            <span className="inline-block rounded-full border border-solid border-[#14132b] bg-[#E8F3EE] px-2.5 py-0.5 text-[10px] font-extrabold text-[#133425]">
                                {cat.skuCount} SKU
                            </span>
                        </div>

                        <div className="relative z-10 mt-6">
                            <h3 className="m-0 font-serif text-base font-bold leading-tight text-[#14132b]">
                                {t(`categories.${cat.key}`, cat.title)}
                            </h3>
                            <p className="m-0 mt-1 text-[11px] leading-snug text-[#4B5563]">
                                {cat.subtitle}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
