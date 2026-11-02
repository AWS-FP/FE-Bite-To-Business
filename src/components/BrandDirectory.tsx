import { Link } from 'react-router-dom';
import { BRANDS } from './brandData';

export default function BrandDirectory() {
  return (
    <section id="btb-brand-directory" className="btb-brand-directory" aria-labelledby="btb-brand-directory-title">
      <div className="btb-brand-container">
        <div className="btb-brand-section-heading">
          <div>
            <p className="btb-brand-eyebrow">CHỌN NHÀ CUNG CẤP BẠN TIN DÙNG</p>
            <h2 id="btb-brand-directory-title">Gian hàng thương hiệu</h2>
          </div>
          <p>Bấm vào mỗi thương hiệu để tới gian hàng riêng, xem danh sách sản phẩm và đặt hàng demo.</p>
        </div>
        <div className="btb-brand-directory__grid">
          {BRANDS.map((brand) => (
            <Link to={`/brands/${brand.slug}`} className={`btb-brand-tile btb-brand-tile--${brand.theme}`} key={brand.slug}>
              <span className="btb-brand-tile__monogram">{brand.shortName}</span>
              <span className="btb-brand-tile__text"><strong>{brand.name}</strong><small>{brand.tagline}</small></span>
              <span className="btb-brand-tile__bottom">Mở gian hàng <img src="/images/ui/brand/arrow-up-right.svg" alt="" /></span>
            </Link>
          ))}
        </div>
        <p className="btb-brand-directory__note">* Tên thương hiệu và sản phẩm trong trang này chỉ dùng minh họa UI; chưa kết nối hệ thống hàng hóa.</p>
      </div>
    </section>
  );
}