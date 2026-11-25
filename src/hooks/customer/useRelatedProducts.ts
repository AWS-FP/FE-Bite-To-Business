import { getRelatedProducts } from '@/services/customer/catalogReadService';
import { useCatalogQuery } from './useCatalogQuery';

export function useRelatedProducts(productId: string) {
    return (
        useCatalogQuery({
            queryKey: ['related', productId],
            queryFn: ({ signal }) => getRelatedProducts(productId, signal),
        }).data ?? []
    );
}
