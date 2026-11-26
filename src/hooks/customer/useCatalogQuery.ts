import { QueryClient, useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { CATALOG_STALE_MS } from '@/constants/catalogSearch';

// Shared by the header and storefront routes, including routes with their own QueryClient.
const publicCatalog = new QueryClient({
    defaultOptions: { queries: { staleTime: CATALOG_STALE_MS } },
});

export function invalidatePublicCatalog() {
    return publicCatalog.invalidateQueries();
}

export function useCatalogQuery<T>(options: UseQueryOptions<T>) {
    return useQuery(options, publicCatalog);
}
