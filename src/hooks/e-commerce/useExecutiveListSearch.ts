import { useState } from 'react';
import { useDebouncedSearch } from '@/hooks/e-commerce/useDebouncedSearch';

/** Reset pagination on keyword changes and only fetch once the input settles. */
export function useExecutiveListSearch() {
    const [search, setSearchValue] = useState('');
    const [page, setPage] = useState(0);
    const keyword = useDebouncedSearch(search.trim());
    function setSearch(next: string) {
        setSearchValue(next);
        if (next.trim() !== search.trim()) setPage(0);
    }
    return { search, setSearch, keyword, page, setPage, pending: search.trim() !== keyword };
}
