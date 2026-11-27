import ProductDetailSkeleton from '@/components/customer/product-detail/ProductDetailSkeleton';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { PackageX } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ComboIngredients from '@/components/customer/product-detail/ComboIngredients';
import CustomerProductInfo from '@/components/customer/product-detail/CustomerProductInfo';
import CustomerProductPurchase from '@/components/customer/product-detail/CustomerProductPurchase';
import CustomerProductReviews from '@/components/customer/product-detail/CustomerProductReviews';
import CustomerRelatedProducts from '@/components/customer/product-detail/CustomerRelatedProducts';
import { useProductDetail } from '@/hooks/customer/useProductDetail';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

export default function CustomerProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    return <CustomerProductDetailContent key={productId ?? 'missing'} productId={productId} />;
}

function CustomerProductDetailContent({ productId }: { productId?: string }) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const tr = (key: string) => t(`productDetail.${key}`);
    const { product, pricing, loading, failed } = useProductDetail(productId);
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
                <PageNav
                    tone="dark"
                    ariaLabel={tr('breadcrumb')}
                    items={[
                        { label: tr('home'), to: ROUTES.HOME },
                        { label: tr('catalog'), to: ROUTES.CATALOG },
                        ...(category && product?.categoryId
                            ? [
                                  {
                                      label: category,
                                      to: `${ROUTES.CATALOG}?category=${encodeURIComponent(product.categoryId)}`,
                                  },
                              ]
                            : []),
                        ...(name ? [{ label: name }] : []),
                    ]}
                />
            </div>

            <div className="mx-auto w-full max-w-[1440px] px-5">
                {loading && productId && <ProductDetailSkeleton />}
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
                                {product.unitCode === 'COMBO' && (
                                    <ComboIngredients productId={product.id} />
                                )}
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
