import type { BrandProduct } from './brandData';
import { formatBrandPrice } from './brandData';
import BrandImagePlaceholder from './BrandImagePlaceholder';

interface Props {
  product: BrandProduct;
  quantity: number;
  onQuantityChange: (productId: string, nextQuantity: number) => void;
  onAdd: (product: BrandProduct, quantity: number) => void;
}

export default function BrandProductCard({ product, quantity, onQuantityChange, onAdd }: Props) {
  return (
    <article className="btb-brand-product-card" id={`btb-brand-product-${product.id}`}>
      <div className="btb-brand-product-card__image">
        <BrandImagePlaceholder label="Ảnh sản phẩm" />
        <span className="btb-brand-product-card__badge">{product.badge}</span>
        <span className="btb-brand-product-card__pack">{product.pack}</span>
      </div>
      <div className="btb-brand-product-card__body">
        <div className="btb-brand-product-card__meta"><span>{product.category}</span><span>{product.brandSlug === 'meatdeli' ? 'MeatDeli' : 'Đối tác BTB'}</span></div>
        <h3>{product.name}</h3>
        <p className="btb-brand-product-card__description">{product.description}</p>
        <div className="btb-brand-product-card__purchase">
          <div className="btb-brand-product-card__price">{formatBrandPrice(product.price)}<small> / {product.unit}</small></div>
          <div className="btb-brand-product-card__controls">
            <div className="btb-brand-quantity" aria-label={`Số lượng cho ${product.name}`}>
              <button type="button" disabled={quantity <= 1} onClick={() => onQuantityChange(product.id, Math.max(1, quantity - 1))} aria-label={`Giảm số lượng ${product.name}`}><img src="/images/ui/brand/minus.svg" alt="" /></button>
              <output aria-live="polite">{quantity}</output>
              <button type="button" onClick={() => onQuantityChange(product.id, Math.min(99, quantity + 1))} aria-label={`Tăng số lượng ${product.name}`}><img src="/images/ui/brand/plus.svg" alt="" /></button>
            </div>
            <button className="btb-brand-product-card__add" type="button" onClick={() => onAdd(product, quantity)}>Thêm vào đơn</button>
          </div>
        </div>
      </div>
    </article>
  );
}
