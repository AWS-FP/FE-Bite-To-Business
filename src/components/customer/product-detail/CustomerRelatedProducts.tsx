import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCatalogProducts, type CatalogProduct } from '@/services/customer/catalogReadService';
import { routePaths } from '@/router/routes';

export default function CustomerRelatedProducts({
    categoryId,
    productId,
}: {
    categoryId: string;
    productId: string;
}) {
    const { t, i18n } = useTranslation('storefront');
    const tr = (key: string) => t(`productDetail.${key}`);
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const [products, setProducts] = useState<CatalogProduct[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        getCatalogProducts({ page: 0, size: 12, categoryId, signal: controller.signal })
            .then((data) => {
                if (!controller.signal.aborted)
                    setProducts(
                        (data.items ?? []).filter((item) => item.id !== productId).slice(0, 3),
                    );
            })
            .catch(() => {
                if (!controller.signal.aborted) setProducts([]);
            });
        return () => controller.abort();
    }, [categoryId, productId]);

    if (products.length === 0) return null;
    return (
        <section className="mt-14 border-t border-white/20 pt-9 text-[#ffdc62]">
            <div className="mb-6 flex items-center gap-3">
                <span className="h-6 w-1 rounded-full bg-[#ffd84a]" />
                <h2 className="m-0 text-2xl font-bold">{tr('related')}</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                    const name =
                        (english
                            ? product.nameEn || product.nameVi
                            : product.nameVi || product.nameEn) || product.sku;
                    return (
                        <Link
                            key={product.id}
                            to={routePaths.productDetail(product.id)}
                            className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#dce9dc] bg-[#fffdf7] text-[#14382c] no-underline shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-[box-shadow,border-color] duration-300 hover:border-[#ffd84a] hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                        >
                            <div className="flex h-44 items-center justify-center overflow-hidden bg-white p-4">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={name}
                                        loading="lazy"
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
                                    />
                                ) : (
                                    <ImageOff size={36} className="text-[#93ab9c]" />
                                )}
                            </div>
                            <div className="flex min-h-28 flex-1 flex-col justify-between gap-4 border-t border-[#e8eee6] p-4">
                                <p className="m-0 line-clamp-2 text-sm font-bold leading-6">
                                    {name}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d7952]">
                                    {tr('seeProduct')}{' '}
                                    <ArrowRight
                                        size={15}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
