import { useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import {
    COLLECTIONS,
    useHomeCollection,
    type Collection,
} from '@/hooks/customer/useHomeCollection';
import ProductShowcaseCard from '@/components/customer/home/ProductShowcaseCard';
import SectionPaginationBar from '@/components/customer/home/SectionPaginationBar';
import ComboCollection from '@/components/customer/home/ComboCollection';
import ProductCardSkeleton from '@/components/customer/home/ProductCardSkeleton';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

export default function CustomerCollectionPage() {
    const { kind } = useParams();
    const { t } = useTranslation('storefront');
    const group: Collection = COLLECTIONS.includes(kind as Collection)
        ? (kind as Collection)
        : 'deals';
    const heading = t(`customerUI.collection.${group}`);
    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            <div className={group === 'combos' ? 'mx-auto w-full max-w-[1440px] px-5 pb-16 pt-7 sm:pt-9' : 'mx-auto max-w-[1320px] px-4 py-9 sm:px-6'}>
                <PageNav back={{ label: t('home'), to: ROUTES.HOME }} />
                <div className="mt-4 rounded-[18px] bg-store-green px-5 py-4 text-white sm:px-7 sm:py-5">
                    <h1 className="m-0 font-subheading text-2xl font-bold sm:text-3xl">
                        {heading}
                    </h1>
                </div>
                {group === 'combos' ? (
                    <ComboCollection />
                ) : (
                    <ProductCollection key={group} group={group} />
                )}
            </div>
        </StorefrontLayout>
    );
}

function ProductCollection({ group }: { group: Collection }) {
    const { t } = useTranslation('storefront');
    const { loading, error, products } = useHomeCollection(group);
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const total = products.length;
    return (
        <>
            {loading && (
                <div
                    aria-busy="true"
                    className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                >
                    {Array.from({ length: 8 }, (_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            )}
            {error && (
                <p role="alert" className="mt-6">
                    {t('homePage.productsError')}
                </p>
            )}
            {!loading && !error && total === 0 && (
                <div className="mt-6 flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-8 text-center">
                    <PackageOpen size={30} className="text-store-sage" />
                    <p className="m-0 text-sm text-store-muted">{t('customerUI.groupEmpty')}</p>
                </div>
            )}
            {!loading && !error && total > 0 && (
                <>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {products.slice((page - 1) * pageSize, page * pageSize).map((product) => (
                            <ProductShowcaseCard
                                key={product.id}
                                product={product}
                                section="standard"
                            />
                        ))}
                    </div>
                    <SectionPaginationBar
                        currentPage={page}
                        totalPages={Math.ceil(total / pageSize)}
                        totalItems={total}
                        pageSize={pageSize}
                        onPageChange={setPage}
                    />
                </>
            )}
        </>
    );
}
