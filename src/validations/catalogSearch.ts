import { SEARCH_MAX_LENGTH } from '@/constants/catalogSearch';

export function canSuggest(term: string) {
    return term.length >= 2 && term.length <= SEARCH_MAX_LENGTH && /[\p{L}\p{N}]/u.test(term);
}

export function catalogPage(raw: string | null) {
    const page = Number(raw);
    return Number.isSafeInteger(page) && page >= 1 && page <= 2_147_483_647 ? page : 1;
}
