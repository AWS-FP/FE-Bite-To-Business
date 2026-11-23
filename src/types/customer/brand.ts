import type { CatalogBrand } from '@/types/customer/catalog';

/** Enriched public brand listing supplied by Customer Brand Discovery in BE. */
export interface CustomerBrand extends CatalogBrand {
    productCount: number | null;
    categoryIds: string[];
}
