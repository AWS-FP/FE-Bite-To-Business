import type { Brand, BrandProduct } from './brandData';
import BrandProductCard from './BrandProductCard';

interface Props {
  brand: Brand;
  products: BrandProduct[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, count: number) => void;
  onAdd: (product: BrandProduct, count: number) => void;
}

export default function BrandProducts({ brand, products, quantities, onQuantityChange, onAdd }: Props) {
  return (
    <section className="btb-brand-products" aria-labelledby="btb-brand-products-title">
      <div className="btb-brand-products__heading">
        <div>
          <span className="btb-brand-pill btb-brand-pill--pink">SẢN PHẨM CỦA {brand.name.toUpperCase()}</span>
          <h2 id="btb-brand-products-title">Mua hàng từ gian hàng <em>{brand.name}</em></h2>
        </div>
        <span className="btb-brand-products__count">Có {products.length} sản phẩm mẫu</span>
      </div>
      <div className="btb-brand-product-grid">
        {products.map((product) => (
          <BrandProductCard key={product.id} product={product} quantity={quantities[product.id] ?? 1} onQuantityChange={onQuantityChange} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}