import { useEffect, useState } from 'react';

/** Debounce the request, not the input. No HTTP request is made by this hook. */
export function useDebouncedSearch(value: string, delayMs = 300): string {
    const [settled, setSettled] = useState(value);
    useEffect(() => {
        const id = window.setTimeout(() => setSettled(value), delayMs);
        return () => window.clearTimeout(id);
    }, [value, delayMs]);
    return settled;
}
