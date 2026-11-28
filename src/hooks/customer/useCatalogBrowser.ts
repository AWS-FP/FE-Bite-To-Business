import { useSearchParams } from 'react-router-dom';
import { getHomeCategories } from '@/services/customer/homeService';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import { useCatalogQuery } from './useCatalogQuery';
import { CATALOG_PAGE_SIZE as PAGE_SIZE } from '@/constants/catalogSearch';
import { catalogPage } from '@/validations/catalogSearch';

/**
 * Danh mục + trang sản phẩm của trang Catalog. Bộ lọc (category, page, q) nằm trên URL
 * để chia sẻ link và nút Back hoạt động đúng.
 */
export function useCatalogBrowser() {
    const [params, setParams] = useSearchParams();
    const categoryId = params.get('category');
    // Header truyền ?q= để tìm kiếm, không cần ô tìm kiếm riêng ở trang này.
    const query = params.get('q') ?? '';
    const brandId = params.get('brand') || undefined;
    const page = catalogPage(params.get('page'));
    const { data: categories = [], isError: categoryError, isPending: categoryLoading } = useCatalogQuery({
        queryKey: ['catalogCategories'],
        queryFn: ({ signal }) => getHomeCategories(signal),
    });
    const {
        data: pageData,
        isPending: loading,
        isError: error,
    } = useCatalogQuery({
        queryKey: ['catalogProducts', page, query.trim(), categoryId, brandId],
        queryFn: ({ signal }) =>
            getCatalogProducts({
                page: page - 1,
                size: PAGE_SIZE,
                q: query.trim() || undefined,
                categoryId: categoryId ?? undefined,
                brandId,
                signal,
            }),
    });

    const categoryLookup = new Map(
        categories
            .flatMap((parent) => [parent, ...parent.children])
            .map((category) => [category.id, category]),
    );
    const selected = categoryId ? categoryLookup.get(categoryId) : undefined;

    function setFilter(key: 'category' | 'page', value?: string) {
        setParams((previous) => {
            const next = new URLSearchParams(previous);
            if (value) next.set(key, value);
            else next.delete(key);
            if (key !== 'page') next.delete('page');
            return next;
        });
    }

    return {
        categories,
        categoryError,
        categoryLoading,
        pageData,
        loading,
        error,
        categoryId,
        query,
        page,
        size: PAGE_SIZE,
        selected,
        categoryLookup,
        setFilter,
    };
}
