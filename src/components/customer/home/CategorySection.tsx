import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/router/routes';
import { useHomeModelContext } from './HomeModel';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryArtwork from '../CategoryArtwork';

export default function CategorySection() {
    const { t, categories } = useHomeModelContext();
    const { i18n } = useTranslation('storefront');
    return (
        <section
            id="catalog-categories"
            className="mx-auto max-w-[1320px] scroll-mt-32 px-4 pb-10 pt-12 sm:px-6"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-store-yellow">
                        {t('customerUI.categoriesTag')}
                    </span>
                    <h2 className="m-0 mt-1 font-subheading text-4xl font-bold text-store-cream">
                        {t('homePage.ecosystemTitle', 'Comprehensive Ingredient Catalog')}
                    </h2>
                </div>
                <Link
                    to={ROUTES.CATALOG}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-store-ink bg-store-cream px-5 py-3 text-xs font-extrabold text-store-ink no-underline"
                >
                    {t('customerUI.showAllProducts')} <ArrowRight size={15} />
                </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`${ROUTES.CATALOG}?category=${encodeURIComponent(cat.id)}`}
                        className="group relative flex min-h-[206px] flex-col overflow-hidden rounded-2xl border border-store-line bg-white p-4 text-store-ink no-underline shadow-sm transition hover:-translate-y-1 hover:bg-surface-yellow hover:shadow-lg"
                    >
                        <div className="pointer-events-none absolute bottom-2 right-1 group-hover:scale-110">
                            <CategoryArtwork
                                categoryKey={`${cat.code} ${cat.nameEn} ${cat.nameVi}`}
                                iconUrl={cat.imageSvg ?? ''}
                            />
                        </div>
                        <span className="relative z-10 self-start rounded-full border border-store-ink bg-surface-green px-2 py-0.5 text-[10px] font-extrabold">
                            {cat.productCount} SKU
                        </span>
                        <div className="relative z-10 mt-auto min-w-0">
                            <h3 className="m-0 font-subheading text-[19px] font-bold leading-tight">
                                {i18n.resolvedLanguage?.startsWith('en') ? cat.nameEn : cat.nameVi}
                            </h3>
                            <p className="m-0 mt-1 line-clamp-2 text-[11px] text-store-muted">
                                {(i18n.resolvedLanguage?.startsWith('en')
                                    ? cat.descriptionEn
                                    : cat.descriptionVi) ?? ''}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            {categories.length === 0 && (
                <p className="text-sm text-white/80">{t('customerUI.emptyCategories')}</p>
            )}
        </section>
    );
}
