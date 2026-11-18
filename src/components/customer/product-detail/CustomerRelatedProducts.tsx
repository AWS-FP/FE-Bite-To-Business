import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCatalogProducts, type CatalogProduct } from '@/services/customer/catalogReadService';
import CatalogShowcaseCard from '@/components/customer/CatalogShowcaseCard';

export default function CustomerRelatedProducts({
    categoryId,
    brandId,
    productId,
    categoryNameVi,
    categoryNameEn,
}: {
    categoryId: string;
    brandId: string | null;
    productId: string;
    categoryNameVi?: string;
    categoryNameEn?: string;
}) {
    const { t } = useTranslation('storefront');
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    useEffect(() => {
        const controller = new AbortController();
        let alive = true;
        const sameCategory = getCatalogProducts({
            page: 0,
            size: 24,
            categoryId,
            signal: controller.signal,
        });
        // API supports intersection of categoryId + brandId; order these first.
        const sameBrand = brandId
            ? getCatalogProducts({
                  page: 0,
                  size: 16,
                  categoryId,
                  brandId,
                  signal: controller.signal,
              })
            : Promise.resolve(null);
        Promise.allSettled([sameBrand, sameCategory]).then(([brand, category]) => {
            if (!alive) return;
            const preferred = brand.status === 'fulfilled' ? (brand.value?.items ?? []) : [];
            const fallback = category.status === 'fulfilled' ? category.value.items : [];
            const seen = new Set<string>([productId]);
            const distinct = [...preferred, ...fallback].filter((item) => {
                if (seen.has(item.id)) return false;
                seen.add(item.id);
                return true;
            });
            setProducts(distinct.slice(0, 4));
        });
        return () => {
            alive = false;
            controller.abort();
        };
    }, [categoryId, brandId, productId]);
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
                        categoryNameVi={categoryNameVi}
                        categoryNameEn={categoryNameEn}
                    />
                ))}
            </div>
        </section>
    );
}
