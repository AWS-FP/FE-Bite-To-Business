/**
 * Mảnh giao diện dùng lại trong các widget sản phẩm (ProductGrid, ProductTable, ProductCarousel, ProductCard…).
 * Tách riêng file để React Fast Refresh hoạt động (file chỉ export component).
 */
import type { ComponentContext } from '@a2ui/web_core/v0_9';
import { CheckCircle2, PackageX, Plus } from 'lucide-react';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import {
    addToCart,
    inStock,
    unitLabel,
    unitPrice,
    viewProduct,
    type A2uiProduct,
} from './productTypes';

/** Giá theo đơn vị bán; có sale thì hiện giá gạch. Chưa có giá thì báo rõ, không hiện 0đ. */
export function Price({ product }: { product: A2uiProduct }) {
    const price = unitPrice(product);
    if (!product.priceAvailable || price == null) {
        return <span className="text-xs text-store-muted">Chưa cập nhật giá</span>;
    }
    return (
        <span className="flex flex-wrap items-baseline gap-1">
            <strong className="text-sm text-store-green">{formatCurrencyVnd(price)}</strong>
            <span className="text-xs text-store-muted">/{unitLabel(product.unitCode)}</span>
            {product.saleActive && product.listPrice != null && product.listPrice > price && (
                <s className="text-xs text-store-muted">{formatCurrencyVnd(product.listPrice)}</s>
            )}
        </span>
    );
}

/** Nhãn còn hàng/hết hàng/chưa rõ tồn, tính từ availableQuantity backend gửi. */
export function Stock({ product }: { product: A2uiProduct }) {
    if (product.availableQuantity == null) {
        return <span className="text-xs text-store-muted">Chưa rõ tồn kho</span>;
    }
    return inStock(product) ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
            <CheckCircle2 size={12} aria-hidden="true" /> Còn hàng
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
            <PackageX size={12} aria-hidden="true" /> Hết hàng
        </span>
    );
}

/** Bảng giá theo bậc số lượng (priceTiers); không có bậc thì không hiện gì. */
export function Tiers({ product }: { product: A2uiProduct }) {
    if (!product.priceTiers?.length) return null;
    const unit = unitLabel(product.unitCode);
    return (
        <table className="mt-1 w-full text-xs">
            <tbody>
                {product.priceTiers.map((tier) => (
                    <tr key={tier.minQuantity} className="border-t border-store-line/70">
                        <td className="py-1 text-store-muted">
                            {tier.maxQuantity == null
                                ? `Từ ${tier.minQuantity} ${unit}`
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
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => addToCart(context, product)}
            className="inline-flex items-center gap-1 rounded bg-store-green px-2 py-1 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
            <Plus size={12} aria-hidden="true" /> Thêm vào giỏ
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
        <article className="flex min-w-0 flex-col overflow-hidden rounded border border-store-line bg-white">
            <button
                type="button"
                onClick={() => viewProduct(context, product)}
                className={`block w-full bg-store-cream ${compact ? 'h-16' : 'h-28'}`}
                aria-label={product.name}
            >
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt=""
                        className="size-full object-cover"
                        loading="lazy"
                    />
                ) : null}
            </button>
            <div className="flex flex-1 flex-col gap-1 p-2">
                <button
                    type="button"
                    onClick={() => viewProduct(context, product)}
                    className="line-clamp-2 border-0 bg-transparent p-0 text-left text-xs font-semibold text-black hover:underline"
                >
                    {product.name}
                </button>
                {!compact && product.spec && (
                    <span className="text-[11px] text-store-muted">{product.spec}</span>
                )}
                <Price product={product} />
                <Stock product={product} />
                {showTiers && <Tiers product={product} />}
                {showAdd && (
                    <div className="mt-auto pt-1">
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
                    className={featured
                        ? 'aspect-[4/3] w-full overflow-hidden bg-store-cream'
                        : 'size-20 shrink-0 overflow-hidden rounded-lg bg-store-cream'}
                >
                    {product.imageUrl && <img src={product.imageUrl} alt="" loading="lazy" className="size-full object-contain" />}
                </button>
                <div className={`min-w-0 flex-1 space-y-2 ${featured ? 'p-5' : ''}`}>
                    <button type="button" onClick={() => viewProduct(context, product)} className={`block border-0 bg-transparent p-0 text-left font-bold text-black hover:underline ${featured ? 'text-xl' : 'text-sm'}`}>
                        {product.name}
                    </button>
                    {product.spec && <p className="text-sm text-store-muted">{product.spec}</p>}
                    <Price product={product} />
                    <div className="flex flex-wrap items-center gap-3">
                        <Stock product={product} />
                        <span className="text-xs text-store-muted">MOQ: {product.minOrderQuantity} {unitLabel(product.unitCode)}</span>
                    </div>
                    {showTiers && <Tiers product={product} />}
                    {showAdd && <AddButton context={context} product={product} />}
                </div>
            </div>
        </article>
    );
}
