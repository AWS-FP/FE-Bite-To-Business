import type { BrandProduct } from './brandData';
import BrandProductCard from './BrandProductCard';

interface Props {
  products: BrandProduct[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, count: number) => void;
  onAdd: (product: BrandProduct, count: number) => void;
}

export default function BrandRelatedProducts({ products, quantities, onQuantityChange, onAdd }: Props) {
  return (
    <section className="btb-brand-related" aria-labelledby="btb-brand-related-title">
      <div className="btb-brand-products__heading">
        <div>
          <span className="btb-brand-pill btb-brand-pill--lavender">GỢI Ý CHO BẾP CỦA BẠN</span>
          <h2 id="btb-brand-related-title">Sản phẩm liên quan</h2>
          <p>Bổ sung các nguyên liệu thường được đặt cùng cho thực đơn và vận hành bếp.</p>
        </div>
        <span className="btb-brand-related__hint">Gợi ý theo nhóm thực phẩm · demo</span>
      </div>
      <div className="btb-brand-product-grid">
        {products.map((product) => (
          <BrandProductCard key={product.id} product={product} quantity={quantities[product.id] ?? 1} onQuantityChange={onQuantityChange} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}