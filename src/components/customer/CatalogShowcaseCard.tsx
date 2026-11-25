import ProductShowcaseCard from '@/components/customer/home/ProductShowcaseCard';
import { useCatalogCardItem } from '@/hooks/customer/useCatalogCardItem';
import type { CatalogProduct } from '@/types/customer/catalog';

/** Uses the same card as Homepage; missing pricing is never invented. */
export default function CatalogShowcaseCard({ product, categoryNameVi = '', categoryNameEn = '' }: {
    product: CatalogProduct;
    categoryNameVi?: string;
    categoryNameEn?: string;
}) {
    const card = useCatalogCardItem(product, categoryNameVi, categoryNameEn);
    return <div className="h-full min-w-0"><ProductShowcaseCard product={card} /></div>;
}
