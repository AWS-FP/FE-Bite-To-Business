import { useParams } from 'react-router-dom';
import { CATALOG_PRODUCT_DETAILS } from '../constants/customer/homeData';
import StorefrontLayout from '../layouts/StorefrontLayout';
import { ProductDetailProvider } from '../components/customer/product-detail/ProductDetailModel';
import ProductAnimations from '../components/customer/product-detail/ProductAnimations';
import ProductBreadcrumb from '../components/customer/product-detail/ProductBreadcrumb';
import ProductSummary from '../components/customer/product-detail/ProductSummary';
import TechnicalAccordion from '../components/customer/product-detail/TechnicalAccordion';
import StorageAccordion from '../components/customer/product-detail/StorageAccordion';
import SafetyAccordion from '../components/customer/product-detail/SafetyAccordion';
import OriginAccordion from '../components/customer/product-detail/OriginAccordion';
import ProductPurchase from '../components/customer/product-detail/ProductPurchase';
import ProductReviews from '../components/customer/product-detail/ProductReviews';
import RelatedProducts from '../components/customer/product-detail/RelatedProducts';
import ProductFallback from '../components/customer/product-detail/ProductFallback';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    if (id && !CATALOG_PRODUCT_DETAILS[id]) return <ProductFallback id={id} />;
    return (
        <ProductDetailProvider key={id ?? 'salmon'}>
            <StorefrontLayout
                rootClassName="flex min-h-screen flex-col bg-[#0F291E] font-sans text-white"
                mainClassName="flex-1 pb-16"
                afterMain={<ProductAnimations />}
            >
                <ProductBreadcrumb />
                <section className="mx-auto max-w-[1360px] px-4 sm:px-6">
                    <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-7">
                            <ProductSummary />
                            <div className="space-y-4">
                                <TechnicalAccordion />
                                <StorageAccordion />
                                <SafetyAccordion />
                                <OriginAccordion />
                            </div>
                        </div>
                        <aside className="lg:col-span-5 lg:sticky lg:top-6">
                            <ProductPurchase />
                            <ProductReviews />
                        </aside>
                    </div>
                </section>
                <RelatedProducts />
            </StorefrontLayout>
        </ProductDetailProvider>
    );
}
