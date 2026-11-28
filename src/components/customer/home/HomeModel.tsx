import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getHomeProducts, getHomeCategories } from '@/services/customer/homeService';
import type { HomeProduct, HomeBanner, HomeCategory, HomeCombo } from '@/types/customer/home';
import type { HomeProductCardItem } from '@/types/customer/homeData';
import { toCard } from '@/utils/customer/homeProductMapper';

function useHomePageState() {
    const { t } = useTranslation('storefront');
    const [flashProducts, setFlashProducts] = useState<HomeProductCardItem[]>([]);
    const [standardProducts, setStandardProducts] = useState<HomeProductCardItem[]>([]);
    const [bestSellingProducts, setBestSellingProducts] = useState<HomeProductCardItem[]>([]);
    const [deepDiscountProducts, setDeepDiscountProducts] = useState<HomeProductCardItem[]>([]);
    const [topRatedProducts, setTopRatedProducts] = useState<HomeProductCardItem[]>([]);
    const [banners, setBanners] = useState<HomeBanner[]>([]);
    const [combos, setCombos] = useState<HomeCombo[]>([]);
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState(false);
    const [productError, setProductError] = useState(false);
    const [flashPage, setFlashPage] = useState(1);
    const [standardPage, setStandardPage] = useState(1);
    const flashPageSize = 3;
    const standardPageSize = 6;
    const totalFlashPages = Math.ceil(flashProducts.length / flashPageSize);
    const totalStandardPages = Math.ceil(standardProducts.length / standardPageSize);
    const visibleFlashProducts = flashProducts.slice(
        (flashPage - 1) * flashPageSize,
        flashPage * flashPageSize,
    );
    const visibleStandardProducts = standardProducts.slice(
        (standardPage - 1) * standardPageSize,
        standardPage * standardPageSize,
    );

    useEffect(() => {
        const controller = new AbortController();
        // Categories are a separate Customer endpoint; failure should not hide products.
        getHomeCategories(controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setCategories(items);
            })
            .catch(() => {
                if (!controller.signal.aborted) setCategoryError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingCategories(false);
            });
        getHomeProducts(controller.signal)
            .then((data) => {
                const convert = (items: HomeProduct[]) =>
                    items.map(toCard).filter((item): item is HomeProductCardItem => item !== null);
                setFlashProducts(convert(data.flashSaleProducts));
                setStandardProducts(convert(data.featuredProducts));
                setBestSellingProducts(convert(data.bestSellingProducts));
                setDeepDiscountProducts(convert(data.deepDiscountProducts));
                setTopRatedProducts(convert(data.topRatedProducts));
                setBanners(data.banners);
                setCombos(data.combos);
                setProductError(false);
            })
            .catch(() => {
                if (!controller.signal.aborted) setProductError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingProducts(false);
            });
        return () => controller.abort();
    }, []);

    return {
        t,
        flashPage,
        setFlashPage,
        standardPage,
        setStandardPage,
        flashPageSize,
        standardPageSize,
        totalFlashPages,
        totalStandardPages,
        visibleFlashProducts,
        visibleStandardProducts,
        flashProducts,
        standardProducts,
        flashProductCount: flashProducts.length,
        standardProductCount: standardProducts.length,
        bestSellingProducts,
        deepDiscountProducts,
        topRatedProducts,
        categories,
        banners,
        combos,
        loadingProducts,
        loadingCategories,
        categoryError,
        productError,
    };
}

type HomeModel = ReturnType<typeof useHomePageState>;
const HomeContext = createContext<HomeModel | null>(null);
export function HomeModelProvider({ children }: { children: ReactNode }) {
    const model = useHomePageState();
    return <HomeContext.Provider value={model}>{children}</HomeContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useHomeModelContext() {
    const context = useContext(HomeContext);
    if (!context) throw new Error('Home components require HomeModelProvider');
    return context;
}
