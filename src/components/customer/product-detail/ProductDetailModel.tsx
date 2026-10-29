import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routePaths } from '../../../router/routes';
import {
    CATALOG_PRODUCT_DETAILS,
    STANDARD_B2B_PRODUCTS,
} from '../../../constants/customer/homeData';
import { useCartStore } from '../../../store/customer/cartStore';
type AccordionKey = 'specs' | 'storage' | 'safety' | 'origin';

function useProductDetailState() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const addItemToCart = useCartStore((state) => state.addItem);

    const resolvedRouteKey = id && CATALOG_PRODUCT_DETAILS[id] ? id : ('salmon' as string);
    const [selectedSampleKey, setSelectedSampleKey] = useState<string>(resolvedRouteKey);
    const [activeThumbIdx, setActiveThumbIdx] = useState(0);
    const [quantity, setQuantity] = useState(2);
    const [showNoteBox, setShowNoteBox] = useState(false);
    const [lineNote, setLineNote] = useState('');
    const [addedFeedback, setAddedFeedback] = useState(false);

    // State đóng/mở cho 4 Accordion Dropdowns bên cột trái
    const [openAccordions, setOpenAccordions] = useState<Record<AccordionKey, boolean>>({
        specs: false,
        storage: false,
        safety: false,
        origin: false,
    });

    // State lọc số sao & hiệu ứng bong bóng chat cho Reviews
    const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
    const [isReloadingReviews, setIsReloadingReviews] = useState(false);
    const [reviewsTriggered, setReviewsTriggered] = useState(false);
    const [isHoveringChat, setIsHoveringChat] = useState(false);
    const [userHoverStar, setUserHoverStar] = useState(0);
    const [userSelectedStar, setUserSelectedStar] = useState(0);

    // Ref gắn vào thanh Dropdown thứ 4 (Đáy hình số 4) để kích hoạt luồng Chat Review
    const fourthAccordionTriggerRef = useRef<HTMLDivElement>(null);
    const chatStreamRef = useRef<HTMLDivElement>(null);
    const reviewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [relatedPage, setRelatedPage] = useState(1);

    useEffect(() => {
        if (id && CATALOG_PRODUCT_DETAILS[id]) {
            setSelectedSampleKey(id);
            setActiveThumbIdx(0);
            setSelectedStarFilter('all');
            setReviewsTriggered(false);
            setQuantity(Number.parseInt(CATALOG_PRODUCT_DETAILS[id].moqLabel, 10) || 1);
        }
    }, [id]);

    // Kích hoạt một lần khi đáy accordion #4 đi vào vùng nhìn thấy.
    // Review không hiển thị trước vị trí này và không mất đi khi người dùng cuộn lên.
    useEffect(() => {
        if (reviewsTriggered) return;
        const checkBottomOfFourth = () => {
            const element = fourthAccordionTriggerRef.current;
            if (!element) return;
            const rect = element.getBoundingClientRect();
            if (rect.bottom <= window.innerHeight - 32 && window.scrollY > 100) {
                setReviewsTriggered(true);
            }
        };
        checkBottomOfFourth();
        window.addEventListener('scroll', checkBottomOfFourth, { passive: true });
        window.addEventListener('resize', checkBottomOfFourth);
        return () => {
            window.removeEventListener('scroll', checkBottomOfFourth);
            window.removeEventListener('resize', checkBottomOfFourth);
        };
    }, [reviewsTriggered, selectedSampleKey, openAccordions.origin]);

    useEffect(
        () => () => {
            if (reviewTimerRef.current) clearTimeout(reviewTimerRef.current);
        },
        [],
    );

    const currentProduct =
        CATALOG_PRODUCT_DETAILS[selectedSampleKey] ?? CATALOG_PRODUCT_DETAILS.salmon;

    const minimumQuantity = Number.parseInt(currentProduct.moqLabel, 10) || 1;
    const vatMultiplier =
        currentProduct.sellingPrice > 0
            ? currentProduct.priceWithVat / currentProduct.sellingPrice
            : 1;

    const volumeDiscountRate = quantity >= 25 ? 0.08 : quantity >= 10 ? 0.04 : 0;
    const effectiveUnitPrice = Math.round(currentProduct.sellingPrice * (1 - volumeDiscountRate));
    const totalLinePrice = effectiveUnitPrice * quantity;
    const savedAmount = (currentProduct.listPrice - effectiveUnitPrice) * quantity;

    const relatedPageSize = 3;
    const totalRelatedPages = Math.ceil(STANDARD_B2B_PRODUCTS.length / relatedPageSize);
    const visibleRelatedProducts = STANDARD_B2B_PRODUCTS.slice(
        (relatedPage - 1) * relatedPageSize,
        relatedPage * relatedPageSize,
    );

    const filteredReviews = useMemo(
        () =>
            selectedStarFilter === 'all'
                ? currentProduct.reviews
                : currentProduct.reviews.filter((r) => r.rating === selectedStarFilter),
        [currentProduct.reviews, selectedStarFilter],
    );

    // Lặp nội dung để chat chạy liên tục, kể cả lúc lọc chỉ còn một review.
    // Dừng khi hover để người dùng có thể cuộn tay hoặc đọc đánh giá.
    useEffect(() => {
        if (
            !reviewsTriggered ||
            isHoveringChat ||
            isReloadingReviews ||
            filteredReviews.length === 0
        )
            return;
        const container = chatStreamRef.current;
        if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frame = 0;
        let lastTime = 0;
        let remainder = 0;
        const tick = (timestamp: number) => {
            if (lastTime) {
                const delta = Math.min(timestamp - lastTime, 100);
                remainder += (delta / 1000) * 15; // 15px/giây: đủ chậm để đọc
                if (remainder >= 0.5) {
                    container.scrollTop += remainder;
                    remainder = 0;
                }
                // Các bản sao có nội dung và khoảng cách bằng nhau.
                // Chuyển về đầu sau một chu kỳ, không giật hình.
                const cycleHeight = container.scrollHeight / 5;
                if (cycleHeight > 0 && container.scrollTop >= cycleHeight) {
                    container.scrollTop -= cycleHeight;
                }
            }
            lastTime = timestamp;
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [reviewsTriggered, isHoveringChat, isReloadingReviews, filteredReviews]);

    function toggleAccordion(key: AccordionKey) {
        setOpenAccordions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    function handleSelectSample(key: string) {
        if (!CATALOG_PRODUCT_DETAILS[key]) return;
        setSelectedSampleKey(key);
        if (key !== id) navigate(routePaths.productDetail(key));
        setActiveThumbIdx(0);
        setQuantity(2);
        setSelectedStarFilter('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleFilterStarClick(starValue: number | 'all') {
        if (reviewTimerRef.current) clearTimeout(reviewTimerRef.current);
        setIsReloadingReviews(true);
        reviewTimerRef.current = setTimeout(() => {
            setSelectedStarFilter(starValue);
            setIsReloadingReviews(false);
            if (chatStreamRef.current) chatStreamRef.current.scrollTop = 0;
        }, 180);
    }

    function handleAddMainProductToCart() {
        addItemToCart(
            {
                id: currentProduct.id,
                name: currentProduct.name,
                spec: lineNote.trim()
                    ? `Note: ${lineNote.trim()}`
                    : currentProduct.technicalSpecs.netWeight,
                unitPrice: effectiveUnitPrice,
                imageUrl: currentProduct.galleryImages[0] ?? '',
            },
            quantity,
        );
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 1800);
    }

    return {
        id,
        setOpenAccordions,
        currentProduct,
        selectedSampleKey,
        activeThumbIdx,
        setActiveThumbIdx,
        quantity,
        setQuantity,
        showNoteBox,
        setShowNoteBox,
        lineNote,
        setLineNote,
        addedFeedback,
        openAccordions,
        selectedStarFilter,
        isReloadingReviews,
        reviewsTriggered,
        isHoveringChat,
        setIsHoveringChat,
        userHoverStar,
        setUserHoverStar,
        userSelectedStar,
        setUserSelectedStar,
        fourthAccordionTriggerRef,
        chatStreamRef,
        relatedPage,
        setRelatedPage,
        minimumQuantity,
        vatMultiplier,
        volumeDiscountRate,
        effectiveUnitPrice,
        totalLinePrice,
        savedAmount,
        totalRelatedPages,
        visibleRelatedProducts,
        filteredReviews,
        toggleAccordion,
        handleSelectSample,
        handleFilterStarClick,
        handleAddMainProductToCart,
    };
}

type ProductDetailModel = ReturnType<typeof useProductDetailState>;
const ProductDetailContext = createContext<ProductDetailModel | null>(null);
export function ProductDetailProvider({ children }: { children: ReactNode }) {
    const model = useProductDetailState();
    return <ProductDetailContext.Provider value={model}>{children}</ProductDetailContext.Provider>;
}
export function useProductDetailContext() {
    const value = useContext(ProductDetailContext);
    if (!value) throw new Error('Product components require ProductDetailProvider');
    return value;
}
