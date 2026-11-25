import { useTranslation } from 'react-i18next';
import { useRelatedProducts } from '@/hooks/customer/useRelatedProducts';
import CatalogShowcaseCard from '@/components/customer/CatalogShowcaseCard';

export default function CustomerRelatedProducts({
    categoryId,
    productId,
    categoryNameVi,
    categoryNameEn,
}: {
    categoryId: string;
    productId: string;
    categoryNameVi?: string;
    categoryNameEn?: string;
}) {
    const { t } = useTranslation('storefront');
    const products = useRelatedProducts(productId);
    if (!products.length) return null;
    return (
        <section
            className="border-t border-white/20 pt-8"
            aria-labelledby="related-products-heading"
        >
            <h2
                id="related-products-heading"
                className="mb-6 mt-0 border-l-4 border-store-yellow pl-3 font-subheading text-2xl font-bold text-store-yellow"
            >
                {t('productDetail.related')}
            </h2>
            <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((item) => (
                    <CatalogShowcaseCard
                        key={item.id}
                        product={item}
                        categoryNameVi={item.categoryId === categoryId ? categoryNameVi : undefined}
                        categoryNameEn={item.categoryId === categoryId ? categoryNameEn : undefined}
                    />
                ))}
            </div>
        </section>
    );
}
