import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getHomeCategories } from '@/services/customer/homeService';
import { getCatalogProducts } from '@/services/customer/catalogReadService';
import type { HomeCategory } from '@/types/customer/home';
import type { CatalogProductPage } from '@/types/customer/catalog';

const PAGE_SIZE = 12;

/**
 * Danh mục + trang sản phẩm của trang Catalog. Bộ lọc (category, page, q) nằm trên URL
 * để chia sẻ link và nút Back hoạt động đúng.
 */
export function useCatalogBrowser() {
    const [params, setParams] = useSearchParams();
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [categoryError, setCategoryError] = useState(false);
    const [pageData, setPageData] = useState<CatalogProductPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const categoryId = params.get('category');
    // Header truyền ?q= để tìm kiếm, không cần ô tìm kiếm riêng ở trang này.
    const query = params.get('q') ?? '';
    const page = Math.max(1, Number(params.get('page') || 1) || 1);

    useEffect(() => {
        const controller = new AbortController();
        getHomeCategories(controller.signal)
            .then((data) => {
                setCategories(data);
                setCategoryError(false);
            })
            .catch(() => {
                if (!controller.signal.aborted) setCategoryError(true);
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        getCatalogProducts({
            page: page - 1,
            size: PAGE_SIZE,
            q: query.trim() || undefined,
            categoryId: categoryId ?? undefined,
            signal: controller.signal,
        })
            .then((result) => {
                if (controller.signal.aborted) return;
                setPageData(result);
                setError(false);
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [page, query, categoryId]);

    const categoryLookup = new Map(
        categories.flatMap((parent) => [parent, ...parent.children]).map((category) => [category.id, category]),
    );
    const selected = categoryId ? categoryLookup.get(categoryId) : undefined;

    function setFilter(key: 'category' | 'page', value?: string) {
        setLoading(true);
        setParams((previous) => {
            const next = new URLSearchParams(previous);
            if (value) next.set(key, value);
            else next.delete(key);
            if (key !== 'page') next.delete('page');
            return next;
        });
    }

    return {
        categories, categoryError, pageData, loading, error, categoryId, query, page,
        size: PAGE_SIZE, selected, categoryLookup, setFilter,
    };
}
