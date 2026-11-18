import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, PackageX } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import CustomerProductInfo from '@/components/customer/product-detail/CustomerProductInfo';
import CustomerProductPurchase from '@/components/customer/product-detail/CustomerProductPurchase';
import CustomerProductReviews from '@/components/customer/product-detail/CustomerProductReviews';
import CustomerRelatedProducts from '@/components/customer/product-detail/CustomerRelatedProducts';
import {
    getCustomerProductDetail,
    getCustomerProductPricing,
    type CustomerProductDetail,
    type CustomerProductPricing,
} from '@/services/customer/productDetailService';
import { ROUTES } from '@/router/routes';

export default function CustomerProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    return <CustomerProductDetailContent key={productId ?? 'missing'} productId={productId} />;
}

function CustomerProductDetailContent({ productId }: { productId?: string }) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const tr = (key: string) => t(`productDetail.${key}`);
    const [product, setProduct] = useState<CustomerProductDetail | null>(null);
    const [pricing, setPricing] = useState<CustomerProductPricing | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(180);
    const [stickyFits, setStickyFits] = useState(false);
    const purchaseRef = useRef<HTMLDivElement>(null);

    // Match sticky position to the real fixed header height, including responsive navigation.
    useEffect(() => {
        const header = document.querySelector('header');
        if (!header) return;
        const measure = () => setHeaderHeight(Math.ceil(header.getBoundingClientRect().height));
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(header);
        return () => observer.disconnect();
    }, []);

    // Stick only when the entire order card fits below the fixed header.
    // On short viewports, normal scrolling prevents the order button from being cut off.
    useEffect(() => {
        const card = purchaseRef.current;
        if (!card) return;
        const measure = () => {
            const cardHeight = card.getBoundingClientRect().height;
            setStickyFits(
                window.innerWidth >= 1280 && window.innerHeight >= headerHeight + cardHeight + 24,
            );
        };
        const observer = new ResizeObserver(measure);
        observer.observe(card);
        window.addEventListener('resize', measure);
        measure();
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [product, pricing, headerHeight]);

    useEffect(() => {
        if (!productId) return;
        const controller = new AbortController();
        let active = true;
        Promise.allSettled([
            getCustomerProductDetail(productId, controller.signal),
            getCustomerProductPricing(productId, controller.signal),
        ]).then(([detailResult, pricingResult]) => {
            if (!active) return;
            if (detailResult.status === 'fulfilled') setProduct(detailResult.value);
            else setFailed(true);
            if (pricingResult.status === 'fulfilled') setPricing(pricingResult.value);
            setLoading(false);
        });
        return () => {
            active = false;
            controller.abort();
        };
    }, [productId]);

    const name = product
        ? (english ? product.nameEn || product.nameVi : product.nameVi || product.nameEn) ||
          product.sku
        : '';
    const description = product
        ? ((english
              ? product.descriptionEn || product.descriptionVi
              : product.descriptionVi || product.descriptionEn) ?? '')
        : '';
    const category = product
        ? ((english
              ? product.categoryNameEn || product.categoryNameVi
              : product.categoryNameVi || product.categoryNameEn) ?? '')
        : '';
    const spec = product
        ? ((english
              ? product.packageSpecEn || product.packageSpecVi
              : product.packageSpecVi || product.packageSpecEn) ?? '')
        : '';

    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-[#103829] font-sans text-[#f8f3e7]"
            mainClassName="box-border flex-1 pb-20 [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-[#b08b22]"
        >
            <div className="mx-auto w-full max-w-[1440px] px-5 pb-5 pt-6">
                <nav
                    aria-label={tr('breadcrumb')}
                    className="flex flex-wrap items-center gap-2 text-xs text-[#d1dfd2]"
                >
                    <Link
                        to={ROUTES.HOME}
                        className="text-[#d1dfd2] no-underline hover:text-store-yellow"
                    >
                        {tr('home')}
                    </Link>
                    <ChevronRight size={14} />
                    <Link
                        to={ROUTES.CATALOG}
                        className="text-[#d1dfd2] no-underline hover:text-store-yellow"
                    >
                        {tr('catalog')}
                    </Link>
                    {category && product?.categoryId && (
                        <>
                            <ChevronRight size={14} aria-hidden="true" />
                            <Link
                                to={`${ROUTES.CATALOG}?category=${encodeURIComponent(product.categoryId)}`}
                                className="text-[#d1dfd2] underline-offset-4 hover:text-store-yellow hover:underline"
                            >
                                {category}
                            </Link>
                        </>
                    )}
                    {name && (
                        <>
                            <ChevronRight size={14} />
                            <span className="font-bold text-[#ffdd63]">{name}</span>
                        </>
                    )}
                </nav>
                <Link
                    to={ROUTES.CATALOG}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#f5db7a] no-underline hover:text-white"
                >
                    <ArrowLeft size={16} /> {tr('back')}
                </Link>
            </div>

            <div className="mx-auto w-full max-w-[1440px] px-5">
                {loading && productId && (
                    <p role="status" className="py-24 text-center text-sm text-[#d1dfd2]">
                        {tr('loading')}
                    </p>
                )}
                {(!productId || (!loading && (!product || failed))) && (
                    <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center text-[#17182d]">
                        <PackageX size={46} className="mx-auto text-slate-400" />
                        <h1 className="mt-4 text-xl font-bold">{tr('unavailable')}</h1>
                        <p className="mt-2 text-sm text-slate-600">{tr('tryAgain')}</p>
                        <Link
                            to={ROUTES.CATALOG}
                            className="mt-5 inline-block bg-store-yellow px-5 py-3 text-sm font-bold text-[#17182d] no-underline"
                        >
                            {tr('back')}
                        </Link>
                    </div>
                )}
                {!loading && product && (
                    <>
                        {/* Sticky purchase card belongs to details + reviews ONLY. It cannot
                            continue into Related Products because that section is outside this grid. */}
                        <div className="grid items-start gap-x-6 gap-y-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                            <div className="min-w-0 xl:col-start-1 xl:row-start-1">
                                <CustomerProductInfo
                                    product={product}
                                    name={name}
                                    description={description}
                                    category={category}
                                    packageSpec={spec}
                                    english={english}
                                />
                            </div>

                            <aside className="min-w-0 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:self-stretch">
                                <div
                                    ref={purchaseRef}
                                    className={stickyFits ? 'xl:sticky' : ''}
                                    style={stickyFits ? { top: headerHeight + 12 } : undefined}
                                >
                                    <CustomerProductPurchase
                                        product={product}
                                        pricing={pricing}
                                        name={name}
                                        spec={spec}
                                    />
                                </div>
                            </aside>

                            <div className="min-w-0 xl:col-start-1 xl:row-start-2">
                                <CustomerProductReviews productId={product.id} />
                            </div>
                        </div>

                        {product.categoryId && (
                            <div className="mt-9 border-t border-white/15 pt-8">
                                <CustomerRelatedProducts
                                    productId={product.id}
                                    categoryId={product.categoryId}
                                    brandId={product.brandId}
                                    categoryNameVi={product.categoryNameVi ?? undefined}
                                    categoryNameEn={product.categoryNameEn ?? undefined}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
