import type { CatalogBrand } from '@/types/customer/catalog';
import type { CustomerBrand } from '@/types/customer/brand';

/** Keep human-readable URLs and avoid collisions if two brands have the same display name. */
export function brandSlug(name: string): string {
    return name
        .toLocaleLowerCase('vi-VN')
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'thuong-hieu';
}

export function brandPath(brand: CatalogBrand, brands: CatalogBrand[]): string {
    const base = brandSlug(brand.name);
    const duplicate = brands.some((item) => item.id !== brand.id && brandSlug(item.name) === base);
    return `/brand/${encodeURIComponent(duplicate ? `${base}-${brand.id}` : base)}`;
}

export function findBrandBySlug(brands: CustomerBrand[], slug?: string): CustomerBrand | null {
    if (!slug) return null;
    let value: string;
    try { value = decodeURIComponent(slug); } catch { return null; }
    return brands.find((brand) => brandPath(brand, brands).split('/').pop() === value) ?? null;
}
