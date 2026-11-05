import { Link } from 'react-router-dom';
import BrandImagePlaceholder from './BrandImagePlaceholder';

export default function BrandHero() {
  return (
    <section className="btb-brand-hero" aria-labelledby="btb-brand-hero-title">
      <div className="btb-brand-container btb-brand-hero__layout">
        <div className="btb-brand-hero__copy">
          <span className="btb-brand-pill btb-brand-pill--yellow">NỀN TẢNG THỰC PHẨM B2B</span>
          <h1 id="btb-brand-hero-title">Hàng chuẩn thương hiệu,<br /><em>đặt đúng nhu cầu bếp.</em></h1>
          <p>Chọn đối tác tin cậy, xem sản phẩm theo thương hiệu và chủ động chuẩn bị nguồn hàng cho nhà hàng, quán cà phê và bếp chuyên nghiệp.</p>
          <div className="btb-brand-actions">
            <a className="btb-brand-btn btb-brand-btn--coral" href="#btb-brand-directory">Khám phá thương hiệu <img src="/images/ui/brand/arrow-right.svg" alt="" /></a>
            <a className="btb-brand-btn btb-brand-btn--cream" href="#btb-brand-quote">Nhận bảng giá</a>
          </div>
        </div>
        <Link className="btb-brand-hero__feature" to="/brands/meatdeli" aria-label="Xem gian hàng MeatDeli">
          <BrandImagePlaceholder label="Ảnh thương hiệu nổi bật — thêm sau" variant="hero" />
          <div className="btb-brand-hero__feature-info">
            <span className="btb-brand-pill btb-brand-pill--yellow">ĐỐI TÁC NỔI BẬT</span>
            <strong>MeatDeli</strong>
            <span>Tươi ngon mỗi ngày · Truy xuất rõ ràng</span>
            <span className="btb-brand-hero__feature-arrow" aria-hidden="true"><img src="/images/ui/brand/arrow-up-right.svg" alt="" /></span>
          </div>
        </Link>
      </div>
    </section>
  );
}