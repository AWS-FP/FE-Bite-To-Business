/**
 * Mảnh giao diện dùng lại trong các widget sản phẩm (ProductGrid, ProductTable, ProductCarousel, ProductCard…).
 * Tách riêng file để React Fast Refresh hoạt động (file chỉ export component).
 */
import type { ComponentContext } from '@a2ui/web_core/v0_9';
import { CheckCircle2, PackageX, Plus, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import {
    addToCart,
    inStock,
    unitLabel,
    unitPrice,
    viewProduct,
    type A2uiProduct,
} from './productTypes';

export function Rating({ product }: { product: A2uiProduct }) {
    const { i18n } = useTranslation();
    const en = i18n.resolvedLanguage?.startsWith('en');
    const count = product.reviewCount;
    const rating =
        count != null && count > 0 && product.averageRating != null
            ? Math.max(0, Math.min(5, product.averageRating))
            : null;
    const label =
        count == null
            ? en
                ? 'Review data unavailable'
                : 'Chưa có dữ liệu đánh giá'
            : count === 0
              ? en
                  ? 'No reviews yet'
                  : 'Chưa có đánh giá'
              : `${rating?.toFixed(1) ?? '—'}/5 · ${count.toLocaleString(en ? 'en-GB' : 'vi-VN')} ${en ? 'reviews' : 'đánh giá'}`;
    return (
        <div
            className="flex flex-wrap items-center gap-1.5 text-[11px] text-store-muted"
            aria-label={label}
        >
            <span className="inline-flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((index) => (
                    <span key={index} className="relative inline-block size-3">
                        <Star size={12} className="text-stone-300" />
                        <span
                            className="absolute inset-y-0 left-0 overflow-hidden"
                            style={{
                                width: `${Math.max(0, Math.min(1, (rating ?? 0) - index)) * 100}%`,
                            }}
                        >
                            <Star size={12} className="fill-amber-400 text-amber-500" />
                        </span>
                    </span>
                ))}
            </span>
            <span>{label}</span>
        </div>
    );
}

/** Giá theo đơn vị bán; có sale thì hiện giá gạch. Chưa có giá thì báo rõ, không hiện 0đ. */
export function Price({ product }: { product: A2uiProduct }) {
    const { i18n } = useTranslation();
    const en = i18n.resolvedLanguage?.startsWith('en');
    const price = unitPrice(product);
    if (!product.priceAvailable || price == null) {
        return (
            <span className="text-xs text-store-muted">
                {en ? 'Price unavailable' : 'Chưa cập nhật giá'}
            </span>
        );
    }
    return (
        <span className="flex flex-wrap items-baseline gap-1">
            <strong className="text-sm text-store-green">{formatCurrencyVnd(price)}</strong>
            <span className="text-xs text-store-muted">
                /{unitLabel(product.unitCode, en ? 'en' : 'vi')}
            </span>
            {product.saleActive && product.listPrice != null && product.listPrice > price && (
                <s className="text-xs text-store-muted">{formatCurrencyVnd(product.listPrice)}</s>
            )}
        </span>
    );
}

/** Nhãn còn hàng/hết hàng/chưa rõ tồn, tính từ availableQuantity backend gửi. */
export function Stock({ product }: { product: A2uiProduct }) {
    const { i18n } = useTranslation();
    const en = i18n.resolvedLanguage?.startsWith('en');
    if (product.availableQuantity == null) {
        return (
            <span className="text-xs text-store-muted">
                {en ? 'Stock unavailable' : 'Chưa rõ tồn kho'}
            </span>
        );
    }
    return inStock(product) ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
            <CheckCircle2 size={12} aria-hidden="true" /> {en ? 'In stock' : 'Còn hàng'}
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
            <PackageX size={12} aria-hidden="true" /> {en ? 'Out of stock' : 'Hết hàng'}
        </span>
    );
}

/** Bảng giá theo bậc số lượng (priceTiers); không có bậc thì không hiện gì. */
export function Tiers({ product }: { product: A2uiProduct }) {
    const { i18n } = useTranslation();
    const en = i18n.resolvedLanguage?.startsWith('en');
    if (!product.priceTiers?.length) return null;
    const unit = unitLabel(product.unitCode, en ? 'en' : 'vi');
    return (
        <table className="mt-1 w-full text-xs">
            <tbody>
                {product.priceTiers.map((tier) => (
                    <tr key={tier.minQuantity} className="border-t border-store-line/70">
                        <td className="py-1 text-store-muted">
                            {tier.maxQuantity == null
                                ? `${en ? 'From' : 'Từ'} ${tier.minQuantity} ${unit}`
                                : `${tier.minQuantity}–${tier.maxQuantity} ${unit}`}
                        </td>
                        <td className="py-1 text-right font-semibold">
                            {formatCurrencyVnd(tier.unitPrice)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/** Nút thêm vào giỏ; tắt khi hết hàng hoặc chưa có giá. */
export function AddButton({
    context,
    product,
}: {
    context: ComponentContext;
    product: A2uiProduct;
}) {
    const disabled = !inStock(product) || !product.priceAvailable;
    const { i18n } = useTranslation();
    const en = i18n.resolvedLanguage?.startsWith('en');
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => addToCart(context, product)}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border-0 bg-store-green px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-store-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-green disabled:cursor-not-allowed disabled:opacity-40"
        >
            <Plus size={14} aria-hidden="true" /> {en ? 'Add to cart' : 'Thêm vào giỏ'}
        </button>
    );
}

/** Thẻ sản phẩm gọn cho lưới/dải: ảnh, tên (mở chi tiết), giá, tồn, bậc giá tùy chọn, nút thêm giỏ. */
export function ProductTile({
    context,
    product,
    compact,
    showTiers,
    showAdd,
}: {
    context: ComponentContext;
    product: A2uiProduct;
    compact: boolean;
    showTiers: boolean;
    showAdd: boolean;
}) {
    return (
        <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-store-line bg-white shadow-sm transition-shadow hover:shadow-md">
            <button
                type="button"
                onClick={() => viewProduct(context, product)}
                className={`block w-full border-0 bg-[#fafaf6] p-3 ${compact ? 'h-24' : 'h-44'}`}
                aria-label={product.name}
            >
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt=""
                        className="size-full object-contain"
                        loading="lazy"
                    />
                ) : null}
            </button>
            <div className="flex flex-1 flex-col gap-2.5 p-4">
                <button
                    type="button"
                    onClick={() => viewProduct(context, product)}
                    className="line-clamp-2 min-h-10 border-0 bg-transparent p-0 text-left text-sm font-semibold leading-5 text-store-ink hover:underline"
                >
                    {product.name}
                </button>
                {!compact && product.spec && (
                    <span className="text-[11px] text-store-muted">{product.spec}</span>
                )}
                <Price product={product} />
                <Rating product={product} />
                <Stock product={product} />
                {showTiers && <Tiers product={product} />}
                {showAdd && (
                    <div className="mt-auto pt-3">
                        <AddButton context={context} product={product} />
                    </div>
                )}
            </div>
        </article>
    );
}

export function ProductPresentation({
    product,
    context,
    featured,
    showTiers,
    showAdd,
}: {
    product: A2uiProduct;
    context: ComponentContext;
    featured: boolean;
    showTiers: boolean;
    showAdd: boolean;
}) {
    return (
        <article className="@container min-w-0 overflow-hidden rounded-xl border border-store-line bg-white text-black">
            <div className={featured ? 'grid @xl:grid-cols-2' : 'flex items-start gap-3 p-3'}>
                <button
                    type="button"
                    onClick={() => viewProduct(context, product)}
                    aria-label={product.name}
                    className={
                        featured
                            ? 'aspect-[4/3] w-full overflow-hidden bg-store-cream'
                            : 'size-20 shrink-0 overflow-hidden rounded-lg bg-store-cream'
                    }
                >
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt=""
                            loading="lazy"
                            className="size-full object-contain"
                        />
                    )}
                </button>
                <div className={`min-w-0 flex-1 space-y-2 ${featured ? 'p-5' : ''}`}>
                    <button
                        type="button"
                        onClick={() => viewProduct(context, product)}
                        className={`block border-0 bg-transparent p-0 text-left font-bold text-black hover:underline ${featured ? 'text-xl' : 'text-sm'}`}
                    >
                        {product.name}
                    </button>
                    {product.spec && <p className="text-sm text-store-muted">{product.spec}</p>}
                    <Price product={product} />
                    <Rating product={product} />
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex min-h-7 items-center rounded-full px-2.5 py-1 ${
                            product.availableQuantity == null
                                ? 'bg-slate-100'
                                : inStock(product)
                                  ? 'bg-[#eaf4eb]'
                                  : 'bg-red-50'
                        }`}>
                            <Stock product={product} />
                        </span>
                        <span className="text-xs text-store-muted">
                            MOQ: {product.minOrderQuantity} {unitLabel(product.unitCode)}
                        </span>
                    </div>
                    {showTiers && <Tiers product={product} />}
                    {showAdd && (
                        <div className="mt-3 border-t border-store-line/70 pt-3">
                            <AddButton context={context} product={product} />
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
