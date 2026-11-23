import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBrandDirectory } from '@/services/customer/brandService';
import { getHomeCategories } from '@/services/customer/homeService';
import type { CustomerBrand } from '@/types/customer/brand';
import type { HomeCategory } from '@/types/customer/home';

const BATCH_SIZE = 24;

/** Danh bạ thương hiệu: tải dữ liệu, lọc theo từ khóa/danh mục và hiển thị dần từng đợt 24. */
export function useBrandDirectory(english: boolean) {
    const [brands, setBrands] = useState<CustomerBrand[]>([]);
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        getBrandDirectory(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setBrands(data);
                setError(false);
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        getHomeCategories(controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) setCategories(data);
            })
            .catch(() => {
                // Vẫn tìm thương hiệu được khi không tải được danh mục.
            });
        return () => controller.abort();
    }, [reload]);

    const selectedCategory = categories.find((category) => category.id === categoryId);
    const matchingCategoryIds = useMemo(() => {
        if (!selectedCategory) return new Set<string>();
        const gather = (item: HomeCategory): string[] => [item.id, ...item.children.flatMap(gather)];
        return new Set(gather(selectedCategory));
    }, [selectedCategory]);

    const filteredBrands = useMemo(() => {
        const locale = english ? 'en' : 'vi';
        const query = search.trim().toLocaleLowerCase(locale);
        return brands.filter((brand) => {
            if (selectedCategory && !brand.categoryIds.some((id) => matchingCategoryIds.has(id))) return false;
            return (
                !query ||
                [brand.name, brand.descriptionVi, brand.descriptionEn].some((value) =>
                    value?.toLocaleLowerCase(locale).includes(query),
                )
            );
        });
    }, [brands, search, selectedCategory, matchingCategoryIds, english]);

    const visibleBrands = filteredBrands.slice(0, visibleCount);
    const hasMore = visibleCount < filteredBrands.length;
    const enriched = brands.some((brand) => brand.productCount !== null);
    const featuredLogos = brands.filter((brand) => Boolean(brand.logoUrl)).slice(0, 6);

    // Đổi bộ lọc thì hiển thị lại từ đợt đầu.
    function changeSearch(value: string) {
        setSearch(value);
        setVisibleCount(BATCH_SIZE);
    }
    function chooseCategory(id: string | null) {
        setCategoryId(id);
        setVisibleCount(BATCH_SIZE);
    }
    const total = filteredBrands.length;
    const showMore = useCallback(() => {
        setVisibleCount((count) => Math.min(count + BATCH_SIZE, total));
    }, [total]);
    function retry() {
        setLoading(true);
        setError(false);
        setReload((value) => value + 1);
    }

    return {
        brands, categories, search, categoryId, loading, error, filteredBrands, visibleBrands,
        visibleCount, hasMore, enriched, featuredLogos, changeSearch, chooseCategory, showMore, retry,
    };
}
