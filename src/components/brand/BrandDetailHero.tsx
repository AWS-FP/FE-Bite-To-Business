import type { Brand } from './brandData';
import BrandImagePlaceholder from './BrandImagePlaceholder';

interface Props { brand: Brand }

export default function BrandDetailHero({ brand }: Props) {
  return (
    <section className={`btb-brand-detail-hero btb-brand-detail-hero--${brand.theme}`} aria-labelledby="btb-brand-detail-title">
      <div className="btb-brand-detail-hero__copy">
        <span className="btb-brand-pill btb-brand-pill--yellow">GIAN HÀNG THƯƠNG HIỆU · GIAO DIỆN DEMO</span>
        <h1 id="btb-brand-detail-title">{brand.name}</h1>
        <h2>{brand.tagline}</h2>
        <p className="btb-brand-detail-hero__lead">{brand.description}</p>
        <p>Tham khảo các nhóm sản phẩm, mức giá minh họa và quy cách đóng gói. Thông tin sẽ được cập nhật khi kết nối Backend.</p>
        <div className="btb-brand-detail-hero__chips">{brand.benefits.map((benefit) => <span key={benefit}>{benefit}</span>)}</div>
        <div className="btb-brand-detail-hero__facts">
          <span><i /> Tham khảo quy cách</span><span><i /> Giá demo</span><span><i /> Chưa kết nối tồn kho</span>
        </div>
      </div>
      <BrandImagePlaceholder label={`Banner ${brand.name} — bổ sung ảnh sau`} variant="hero" className="btb-brand-detail-hero__visual" />
    </section>
  );
}
