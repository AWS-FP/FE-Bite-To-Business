import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { HomeProductCardItem } from '@/types/customer/homeData';
import ProductShowcaseCard from './ProductShowcaseCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import Skeleton from '@/components/common/Skeleton';

/** Horizontal product row with buttons only: no slider track or page-number navigation. */
export default function ProductCarousel({
    products,
    label,
    loading = false,
}: {
    products: HomeProductCardItem[];
    label: string;
    loading?: boolean;
}) {
    const track = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('storefront');
    const move = (direction: number) => {
        if (!track.current) return;
        const first = track.current.querySelector<HTMLElement>('[data-product-tile]');
        const step = first ? first.offsetWidth + 12 : 240;
        track.current.scrollBy({ left: direction * step, behavior: 'smooth' });
    };
    return (
        <div className="relative">
            <div className="mb-3 flex min-h-9 justify-end gap-2">
                {loading ? (
                    <>
                        <Skeleton className="size-9 rounded-full" />
                        <Skeleton className="size-9 rounded-full" />
                    </>
                ) : (
                    products.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => move(-1)}
                                aria-label={t('customerUI.previousProducts', { group: label })}
                                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-store-line bg-white text-store-green shadow-sm hover:bg-store-yellow"
                            >
                                <ChevronLeft size={19} />
                            </button>
                            <button
                                type="button"
                                onClick={() => move(1)}
                                aria-label={t('customerUI.nextProducts', { group: label })}
                                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-store-line bg-white text-store-green shadow-sm hover:bg-store-yellow"
                            >
                                <ChevronRight size={19} />
                            </button>
                        </>
                    )
                )}
            </div>
            <div
                ref={track}
                aria-busy={loading}
                aria-label={label}
                role="region"
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-2 pb-6 pt-2 scroll-px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {loading
                    ? Array.from({ length: 6 }, (_, i) => (
                          <div
                              key={i}
                              className="w-[min(76vw,230px)] shrink-0 sm:w-[222px] lg:w-[236px]"
                          >
                              <ProductCardSkeleton />
                          </div>
                      ))
                    : products.map((product) => (
                          <div
                              key={product.id}
                              data-product-tile
                              className="w-[min(76vw,230px)] shrink-0 snap-start sm:w-[222px] lg:w-[236px]"
                          >
                              <ProductShowcaseCard product={product} section="standard" />
                          </div>
                      ))}
            </div>
        </div>
    );
}
