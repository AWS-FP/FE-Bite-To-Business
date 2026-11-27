import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHomeModelContext } from './HomeModel';
import ComboCard from './ComboCard';

export default function CombosSection() {
    const { combos, loadingProducts, productError } = useHomeModelContext();
    const { t } = useTranslation('storefront');
    return (
        <section
            id="fb-combo-packages"
            className="mx-auto w-full min-w-0 max-w-[1320px] px-4 pt-12 pb-8 sm:px-6"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="m-0 font-subheading text-3xl font-bold text-store-cream sm:text-4xl">
                    {t('customerUI.comboTitle')}
                </h2>
                <Link
                    to="/collections/combos"
                    className="inline-flex items-center gap-1 rounded-full bg-store-cream px-4 py-2 text-sm font-bold text-store-green no-underline"
                >
                    {t('customerUI.viewAll')}
                    <ArrowRight size={16} />
                </Link>
            </div>
            <div
                aria-busy={loadingProducts}
                className="mt-7 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                {loadingProducts
                    ? Array.from({ length: 4 }, (_, i) => <ComboCard key={i} />)
                    : combos
                          .slice(0, 4)
                          .map((combo) => <ComboCard key={combo.productId} combo={combo} />)}
            </div>
            {!loadingProducts && (productError || combos.length === 0) && (
                <p className="text-sm text-white/80" role={productError ? 'alert' : undefined}>
                    {t(productError ? 'homePage.productsError' : 'customerUI.comboEmpty')}
                </p>
            )}
        </section>
    );
}
