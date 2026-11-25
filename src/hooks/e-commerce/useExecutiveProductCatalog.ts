import { useMemo, useState } from 'react';
import type { SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { getCatalogBrands } from '@/services/customer/catalogReadService';
import { getHomeCategories } from '@/services/customer/homeService';
import type { HomeCategory } from '@/types/customer/home';

/** The search submit/URL, status and pagination have one consistent source of truth. */
export function useExecutiveProductCatalog() {
    const [params, setParams] = useSearchParams();
    const q = params.get('q') ?? '';
    // Derive draft and page from the current URL query. Browser Back/Forward
    // cannot leave a stale search input or stale page when q changes.
    const [draftState, setDraftState] = useState({ source: q, value: q });
    const draft = draftState.source === q ? draftState.value : q;
    const setDraft = (value: string) => setDraftState({ source: q, value });
    const [status, setStatus] = useState('');
    const [pageState, setPageState] = useState({ source: q, value: 0 });
    const page = pageState.source === q ? pageState.value : 0;
    const setPage = (value: SetStateAction<number>) => setPageState((previous) => {
        const current = previous.source === q ? previous.value : 0;
        return { source: q, value: typeof value === 'function' ? value(current) : value };
    });

    const products = useQuery({
        queryKey: ['ecom', 'products', q, status, page],
        queryFn: ({ signal }) => executiveApi.products({
            q: q || undefined,
            status: status || undefined,
            page,
            size: 20,
        }, signal),
        staleTime: 20_000,
    });
    const brands = useQuery({ queryKey: ['ecom', 'brands'], queryFn: () => getCatalogBrands() });
    const categories = useQuery({
        queryKey: ['ecom', 'categories'],
        queryFn: () => getHomeCategories(),
    });
    const brandMap = useMemo(() => new Map(brands.data?.map((b) => [b.id, b.name])), [brands.data]);
    const categoryMap = useMemo(() => {
        const output = new Map<string, HomeCategory>();
        const collect = (items: HomeCategory[]) => {
            for (const item of items) {
                output.set(item.id, item);
                collect(item.children ?? []);
            }
        };
        collect(categories.data ?? []);
        return output;
    }, [categories.data]);

    function submitSearch() {
        const next = draft.trim().replace(/\s+/g, ' ');
        setPage(0);
        setParams(next ? { q: next } : {});
    }

    function changeStatus(next: string) {
        setStatus(next);
        setPage(0);
    }

    return {
        q, draft, setDraft, status, changeStatus, page, setPage,
        submitSearch, products, brandMap, categoryMap,
    };
}
