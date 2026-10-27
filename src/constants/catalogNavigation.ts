import { ROUTES } from '@/router/routes';
//khi code nhớ đổi

export const freshCategoryKeys = ['meat', 'seafood', 'eggs', 'vegetables', 'fruit', 'vegetarian'];
export const dryCategoryKeys = [
    'grains',
    'noodles',
    'nuts',
    'dairy',
    'seasoning',
    'prepared',
    'bakery',
];

export function getCatalogSearchPath(keyword: string) {
    const searchParams = new URLSearchParams();
    searchParams.set('q', keyword);
    return `${ROUTES.CATALOG}?${searchParams.toString()}`;
}
