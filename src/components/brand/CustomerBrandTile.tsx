import { ArrowUpRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CatalogBrand } from '@/types/customer/catalog';
import { brandPath } from '@/utils/customer/brandPath';
import type { CustomerBrand } from '@/types/customer/brand';

export default function CustomerBrandTile({
    brand, brands,
}: { brand: CatalogBrand | CustomerBrand; brands: CatalogBrand[] }) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const description = (english ? brand.descriptionEn : brand.descriptionVi)?.trim();
    const count = 'productCount' in brand ? brand.productCount : null;
    return (
        <Link
            to={brandPath(brand, brands)}
            className="group flex min-w-0 items-center gap-3 rounded-2xl border border-[#dce7df] bg-white p-3.5 text-store-ink no-underline shadow-[0_5px_14px_rgba(9,51,36,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#8ebc9c] hover:shadow-[0_14px_30px_rgba(9,51,36,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-green"
        >
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e8e9e3] bg-[#fbfaf5] p-2 sm:h-[84px] sm:w-[84px]">
                {brand.logoUrl ? (
                    <img
                        src={brand.logoUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <span className="font-subheading text-3xl font-black text-store-green" aria-hidden="true">
                        {brand.name.slice(0, 1).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="m-0 line-clamp-1 text-[15px] font-extrabold leading-5 text-store-ink group-hover:text-store-green" title={brand.name}>
                    {brand.name}
                </h3>
                <p className="mt-1 line-clamp-2 min-h-[33px] text-xs leading-[17px] text-store-muted">
                    {description || t('brandPage.noDescription')}
                </p>
                {count !== null && count !== undefined && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-store-green">
                        <Package size={12} /> {t('brandPage.productCount', { count })}
                    </span>
                )}
            </div>
            <ArrowUpRight size={17} className="shrink-0 self-start text-store-green/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-store-green" />
        </Link>
    );
}
