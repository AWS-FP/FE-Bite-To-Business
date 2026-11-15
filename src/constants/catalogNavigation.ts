export const freshCategoryKeys = [
    'meatPoultry',
    'fishSeafood',
    'eggs',
    'vegetablesMushrooms',
    'fruits',
    'tofuVegetarian',
] as const;

export const dryCategoryKeys = [
    'riceGrainsFlour',
    'noodlesPasta',
    'beansNuts',
    'dairyProducts',
    'oilSpicesSauces',
    'processedCanned',
    'bakeryDesserts',
    'beveragesBarista',
] as const;

export function getCatalogSearchPath(searchText: string): string {
    const encoded = encodeURIComponent(searchText.trim());
    return `/products?q=${encoded}`;
}

export function getCategoryPagePath(categorySlug: string): string {
    return `/products?category=${encodeURIComponent(categorySlug)}`;
}
