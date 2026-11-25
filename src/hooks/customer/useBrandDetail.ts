import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getHomeCategories } from '@/services/customer/homeService';
import { getBrandDirectory, getBrandsInSameCategories, getProductsOfBrand } from '@/services/customer/brandService';
import { brandPath, findBrandBySlug } from '@/utils/customer/brandPath';
import type { HomeCategory } from '@/types/customer/home';
import type { CatalogBrand, CatalogProduct } from '@/types/customer/catalog';
import type { CustomerBrand } from '@/types/customer/brand';

const PRODUCT_BATCH = 12;

/**
 * Trang một thương hiệu: thương hiệu theo slug, sản phẩm (sắp xếp, hiển thị dần 12), thương hiệu liên quan.
 * Link cũ /brands/... được chuyển sang URL chuẩn /brand/:slug.
 */
export function useBrandDetail(slug: string | undefined, english: boolean) {
    const location = useLocation();
    const navigate = useNavigate();
    const [directory, setDirectory] = useState<CustomerBrand[]>([]);
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [brandsError, setBrandsError] = useState(false);
    const [productResult, setProductResult] = useState<{
        brandId: string;
        items: CatalogProduct[];
        error: boolean;
    } | null>(null);
    const [relatedResult, setRelatedResult] = useState<{
        brandId: string;
        items: CatalogBrand[];
        error: boolean;
    } | null>(null);
    const [productLimit, setProductLimit] = useState<{ brandId: string; count: number } | null>(
        null,
    );
    const [sort, setSort] = useState<'name_asc' | 'name_desc'>('name_asc');
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        getBrandDirectory(controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setDirectory(items);
            })
            .catch(() => {
                if (!controller.signal.aborted) setBrandsError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setBrandsLoading(false);
            });
        getHomeCategories(controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setCategories(items);
            })
            .catch(() => {
                /* Product cards can still show without category labels. */
            });
        return () => controller.abort();
    }, [reload]);

    const brand = useMemo(() => findBrandBySlug(directory, slug), [directory, slug]);
    const brandId = brand?.id;
    const products = useMemo(
        () => (productResult && productResult.brandId === brandId ? productResult.items : []),
        [productResult, brandId],
    );
    const productsLoaded = Boolean(brandId && productResult?.brandId === brandId);
    const productsLoading = Boolean(brandId && !productsLoaded);
    const productsError = Boolean(productsLoaded && productResult?.error);
    const related = useMemo(
        () => (relatedResult && relatedResult.brandId === brandId ? relatedResult.items : []),
        [relatedResult, brandId],
    );
    const relatedLoading = Boolean(brandId && relatedResult?.brandId !== brandId);
    const relatedError = Boolean(
        brandId && relatedResult && relatedResult.brandId === brandId && relatedResult.error,
    );
    const productCount =
        productLimit && productLimit.brandId === brandId ? productLimit.count : PRODUCT_BATCH;

    useEffect(() => {
        if (!brand || !location.pathname.startsWith('/brands/')) return;
        // Old share links remain functional, while canonical URLs use /brand/:slug.
        navigate(brandPath(brand, directory), { replace: true });
    }, [brand, directory, location.pathname, navigate]);

    useEffect(() => {
        if (!brandId) return;
        const controller = new AbortController();
        getProductsOfBrand(brandId, controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setProductResult({ brandId, items, error: false });
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setProductResult({ brandId, items: [], error: true });
            });
        getBrandsInSameCategories(brandId, controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setRelatedResult({ brandId, items, error: false });
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setRelatedResult({ brandId, items: [], error: true });
            });
        return () => controller.abort();
    }, [brandId]);

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            const left = (english ? a.nameEn : a.nameVi) || a.nameVi;
            const right = (english ? b.nameEn : b.nameVi) || b.nameVi;
            return (
                (sort === 'name_asc' ? 1 : -1) * left.localeCompare(right, english ? 'en' : 'vi')
            );
        });
    }, [products, sort, english]);
    const shownProducts = sortedProducts.slice(0, productCount);
    const hasMoreProducts = productCount < sortedProducts.length;


    const categoryNames = useMemo(() => {
        const map = new Map<string, HomeCategory>();
        const visit = (category: HomeCategory) => {
            map.set(category.id, category);
            category.children.forEach(visit);
        };
        categories.forEach(visit);
        return map;
    }, [categories]);

    // If the optional related endpoint is not installed yet, derive exact matches
    // from the directory's published-product category IDs, never from brand names.
    const matchedBrands = useMemo(() => {
        if (!brand) return [];
        if (!relatedError) return related;
        const active = new Set(brand.categoryIds);
        return directory
            .filter((item) => item.id !== brand.id && item.categoryIds.some((id) => active.has(id)))
            .sort((a, b) => {
                const aCount = a.categoryIds.filter((id) => active.has(id)).length;
                const bCount = b.categoryIds.filter((id) => active.has(id)).length;
                return bCount - aCount || a.name.localeCompare(b.name);
            })
            .slice(0, 12);
    }, [brand, relatedError, related, directory]);

    const description = brand
        ? (english ? brand.descriptionEn : brand.descriptionVi)?.trim() ||
          (english ? brand.descriptionVi : brand.descriptionEn)?.trim()
        : '';
    const showRelated = productsLoaded && !productsLoading && !productsError && !hasMoreProducts;

    function retry() {
        setBrandsLoading(true);
        setBrandsError(false);
        setReload((value) => value + 1);
    }
    function changeSort(nextSort: 'name_asc' | 'name_desc') {
        setSort(nextSort);
        if (brandId) setProductLimit({ brandId, count: PRODUCT_BATCH });
    }
    const showMoreProducts = useCallback(() => {
        if (!brandId) return;
        setProductLimit((previous) => ({
            brandId,
            count: Math.min(
                (previous?.brandId === brandId ? previous.count : PRODUCT_BATCH) + PRODUCT_BATCH,
                sortedProducts.length,
            ),
        }));
    }, [brandId, sortedProducts.length]);

    return {
        directory, brandsLoading, brandsError, brand, products, productsLoading, productsError,
        relatedLoading, sort, shownProducts, hasMoreProducts,
        categoryNames, matchedBrands, description, showRelated, retry, changeSort, showMoreProducts,
    };
}
