import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
} from '@/services/customer/productDetailService';
import type {
    CustomerProductDetail,
    CustomerProductPricing,
} from '@/services/customer/productDetailService';
import { ROUTES } from '@/router/routes';

/** Product showcase backed by catalog and pricing endpoints. */
export default function CustomerProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    return <CustomerProductDetailContent key={productId ?? 'missing'} productId={productId} />;
}

function CustomerProductDetailContent({ productId }: { productId?: string }) {
    const { t, i18n } = useTranslation('storefront');
    const reducedMotion = useReducedMotion();
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const tr = (key: string) => t(`productDetail.${key}`);
    const [product, setProduct] = useState<CustomerProductDetail | null>(null);
    const [pricing, setPricing] = useState<CustomerProductPricing | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(176);

    // Header is fixed and responsive. Avoid positioning the sticky order panel behind it.
    useEffect(() => {
        const header = document.querySelector('body > #root header, header');
        if (!header) return;
        const measure = () => setHeaderHeight(Math.ceil(header.getBoundingClientRect().height));
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(header);
        return () => observer.disconnect();
    }, []);

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
            <div className="mx-auto max-w-[1360px] px-4 pb-6 pt-6 sm:px-6">
                <nav
                    aria-label={tr('breadcrumb')}
                    className="flex flex-wrap items-center gap-2 text-xs text-[#d1dfd2]"
                >
                    <Link
                        to={ROUTES.HOME}
                        className="text-[#d1dfd2] no-underline hover:text-[#ffdd63]"
                    >
                        {tr('home')}
                    </Link>
                    <ChevronRight size={14} />
                    <Link
                        to={ROUTES.CATALOG}
                        className="text-[#d1dfd2] no-underline hover:text-[#ffdd63]"
                    >
                        {tr('catalog')}
                    </Link>
                    {category && (
                        <>
                            <ChevronRight size={14} />
                            <span>{category}</span>
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
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#f5db7a] no-underline hover:text-white"
                >
                    <ArrowLeft size={16} />
                    {tr('back')}
                </Link>
            </div>
            <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
                {loading && productId && (
                    <p role="status" className="py-24 text-center text-sm text-[#6b7c70]">
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
                            className="mt-5 inline-block bg-[#facc15] px-5 py-3 text-sm font-bold text-[#17182d] no-underline"
                        >
                            {tr('back')}
                        </Link>
                    </div>
                )}
                {!loading && product && (
                    <>
                        <motion.div
                            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reducedMotion ? 0 : 0.65, ease: 'easeOut' }}
                            className="grid items-start gap-7 lg:grid-cols-12"
                        >
                            <div className="lg:col-span-7">
                                <CustomerProductInfo
                                    product={product}
                                    name={name}
                                    description={description}
                                    category={category}
                                    packageSpec={spec}
                                    english={english}
                                />
                            </div>
                            <aside className="min-w-0 lg:col-span-5 lg:self-stretch">
                                <div
                                    className="lg:sticky lg:max-h-[var(--purchase-viewport-height)] lg:overflow-y-auto lg:overscroll-contain"
                                    style={{
                                        top: headerHeight + 16,
                                        ['--purchase-viewport-height' as string]: `calc(100dvh - ${headerHeight + 32}px)`,
                                    }}
                                >
                                    <CustomerProductPurchase
                                        product={product}
                                        pricing={pricing}
                                        name={name}
                                        spec={spec}
                                    />
                                </div>
                            </aside>
                        </motion.div>
                        {/* Keep reviews outside the sticky purchasing region so panels never overlap. */}
                        <div className="mt-7 grid gap-7 lg:grid-cols-12">
                            <div className="min-w-0 lg:col-span-5 lg:col-start-8">
                                <CustomerProductReviews productId={product.id} />
                            </div>
                        </div>
                        {product.categoryId && (
                            <CustomerRelatedProducts
                                productId={product.id}
                                categoryId={product.categoryId}
                            />
                        )}
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
