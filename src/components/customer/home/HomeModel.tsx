import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getHomeProducts } from '@/services/customer/homeService';
import type { HomeProduct } from '@/services/customer/homeService';
import type { HomeProductCardItem } from '@/constants/customer/homeData';

function toCard(product: HomeProduct): HomeProductCardItem | null {
    if (product.listPrice == null || !Number.isFinite(product.listPrice)) return null;
    return {
        id: product.productId,
        sku: product.sku,
        name: product.nameVi,
        nameVi: product.nameVi,
        nameEn: product.nameEn,
        categoryLabel: '',
        spec: product.unitCode,
        unit: product.unitCode,
        listPrice: product.listPrice,
        salePrice: product.salePrice ?? undefined,
        certBadge: '',
        imageUrl: product.imageUrl ?? '',
    };
}

function useHomePageState() {
    const { t } = useTranslation('storefront');
    const [flashProducts, setFlashProducts] = useState<HomeProductCardItem[]>([]);
    const [standardProducts, setStandardProducts] = useState<HomeProductCardItem[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState(false);

    // State phân trang cho 2 khu vực sản phẩm
    const [flashPage, setFlashPage] = useState(1);
    const flashPageSize = 3;
    const totalFlashPages = Math.ceil(flashProducts.length / flashPageSize);
    const visibleFlashProducts = flashProducts.slice(
        (flashPage - 1) * flashPageSize,
        flashPage * flashPageSize,
    );

    const [standardPage, setStandardPage] = useState(1);
    const standardPageSize = 6;
    const totalStandardPages = Math.ceil(standardProducts.length / standardPageSize);
    const visibleStandardProducts = standardProducts.slice(
        (standardPage - 1) * standardPageSize,
        standardPage * standardPageSize,
    );

    useEffect(() => {
        const controller = new AbortController();
        getHomeProducts(controller.signal)
            .then((data) => {
                setFlashProducts(data.flashSaleProducts.map(toCard).filter((item): item is HomeProductCardItem => item !== null));
                setStandardProducts(data.featuredProducts.map(toCard).filter((item): item is HomeProductCardItem => item !== null));
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
        flashPageSize,
        standardPageSize,
        t,
        flashPage,
        setFlashPage,
        totalFlashPages,
        visibleFlashProducts,
        standardPage,
        setStandardPage,
        totalStandardPages,
        visibleStandardProducts,
        flashProductCount: flashProducts.length,
        standardProductCount: standardProducts.length,
        loadingProducts,
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
