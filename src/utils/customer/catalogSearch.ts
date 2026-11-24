import type { CatalogSuggestion } from '@/types/customer/catalog';
import { getCatalogSearchPath, getCategoryPagePath } from '@/constants/catalogNavigation';

export function cleanSearchText(value: string) {
    return value.replace(/\s+/gu, ' ').trim();
}

export function suggestionPath(item: CatalogSuggestion, label: string) {
    switch (item.kind) {
        case 'product':
            return `/products/${encodeURIComponent(item.id)}`;
        case 'category':
            return getCategoryPagePath(item.id);
        case 'brand':
            return `/products?brand=${encodeURIComponent(item.id)}`;
        case 'query':
            return getCatalogSearchPath(label);
    }
}
