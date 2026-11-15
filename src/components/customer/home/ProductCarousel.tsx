import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { HomeProductCardItem } from '@/constants/customer/homeData';
import ProductShowcaseCard from './ProductShowcaseCard';

/** Horizontal product row with buttons only: no slider track or page-number navigation. */
export default function ProductCarousel({
    products,
    label,
}: {
    products: HomeProductCardItem[];
    label: string;
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
            {products.length > 1 && (
                <div className="mb-3 flex justify-end gap-2">
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
                </div>
            )}
            <div
                ref={track}
                aria-label={label}
                tabIndex={0}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {products.map((product) => (
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
