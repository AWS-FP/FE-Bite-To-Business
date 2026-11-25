import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

/** Search bar only submits explicit queries; typing never calls the API. */
export function useEcommerceWorkspaceSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const routeKey = `${location.pathname}${location.search}`;
    const routeSearch = location.pathname === ROUTES.ECOMMERCE_PRODUCTS
        ? new URLSearchParams(location.search).get('q') ?? ''
        : '';
    const [draftState, setDraftState] = useState({ source: routeKey, value: routeSearch });
    const keyword = draftState.source === routeKey ? draftState.value : routeSearch;

    function setKeyword(next: string) {
        setDraftState({ source: routeKey, value: next });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const term = keyword.trim().replace(/\s+/g, ' ');
        navigate(term
            ? `${ROUTES.ECOMMERCE_PRODUCTS}?q=${encodeURIComponent(term)}`
            : ROUTES.ECOMMERCE_PRODUCTS);
    }

    return { keyword, setKeyword, submit };
}
