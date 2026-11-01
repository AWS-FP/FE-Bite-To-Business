import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FLASH_SALE_PRODUCTS, STANDARD_B2B_PRODUCTS } from '../../../constants/customer/homeData';

function useHomePageState() {
    const { t } = useTranslation('storefront');
    const [secondsLeft, setSecondsLeft] = useState(4 * 3600 + 38 * 60 + 19);

    // State phân trang cho 2 khu vực sản phẩm
    const [flashPage, setFlashPage] = useState(1);
    const flashPageSize = 3;
    const totalFlashPages = Math.ceil(FLASH_SALE_PRODUCTS.length / flashPageSize);
    const visibleFlashProducts = FLASH_SALE_PRODUCTS.slice(
        (flashPage - 1) * flashPageSize,
        flashPage * flashPageSize,
    );

    const [standardPage, setStandardPage] = useState(1);
    const standardPageSize = 6;
    const totalStandardPages = Math.ceil(STANDARD_B2B_PRODUCTS.length / standardPageSize);
    const visibleStandardProducts = STANDARD_B2B_PRODUCTS.slice(
        (standardPage - 1) * standardPageSize,
        standardPage * standardPageSize,
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 4 * 3600 + 38 * 60 + 19));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

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
        hours,
        minutes,
        seconds,
    };
}

type HomeModel = ReturnType<typeof useHomePageState>;
const HomeContext = createContext<HomeModel | null>(null);
export function HomeModelProvider({ children }: { children: ReactNode }) {
    const model = useHomePageState();
    return <HomeContext.Provider value={model}>{children}</HomeContext.Provider>;
}
export function useHomeModelContext() {
    const context = useContext(HomeContext);
    if (!context) throw new Error('Home components require HomeModelProvider');
    return context;
}
