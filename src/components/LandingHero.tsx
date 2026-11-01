/* Generated from the supplied HTML layout. Edit this section independently. */
import { useTranslation } from 'react-i18next';
import LandingCarousel from './LandingCarousel';
import LandingPartners from './LandingPartners';
import { useLandingAudience } from '@/hooks/useLandingAudience';

export default function LandingHero() {
  const { i18n } = useTranslation();
  const { audience } = useLandingAudience();
  const language = i18n.resolvedLanguage ?? i18n.language;
  return (
    <section className="hero-section" id="top-hero"><div className="container">
      <div className="hero-eyebrow"><span>Nền tảng tìm kiếm và mua sắm thực phẩm cho tổ chức &amp; cá nhân</span></div>
      <h1 className="hero-title" id="heroMainTitle">{language === "en" ? <>Food sourcing for <em>businesses and individuals</em></> : audience === "business" ? <>Giải pháp mua thực phẩm cho <em>doanh nghiệp và đơn vị thu mua.</em></> : <>Thực phẩm thiết yếu cho <em>cá nhân và gia đình.</em></>}</h1>
      <p className="hero-subtitle" id="heroSubText">{language === "en" ? "Discover products, compare package sizes and quantity-based pricing for each item, and explore a more organized shopping experience." : audience === "business" ? "Khám phá nguồn thực phẩm, so sánh quy cách và giá theo số lượng từng sản phẩm, tập hợp nhu cầu vào một quy trình báo giá rõ ràng." : "Khám phá thực phẩm theo nhu cầu gia đình, xem thông tin sản phẩm và quy cách, lưu trải nghiệm để tìm lại dễ hơn khi cần."}</p>
      <div className="hero-ctas">
        <a href="#categories" className="btn btn-primary">

          Bắt đầu nhập hàng
          <span className="btn-arrow-circle"><img src="/images/ui/arrow-right.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></span>
        </a>
        <a href="#catalog-preview" className="btn btn-outline">Danh mục sản phẩm</a>
      </div>
      <LandingCarousel />
      <div className="stats-4-grid">
        <div className="stat-box">
          <div className="stat-num">Theo SL</div>
          <div className="stat-label">Giá bậc thang từng sản phẩm</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">Danh mục</div>
          <div className="stat-label">Nhiều nhóm thực phẩm <img className="btb-ui-icon" src="/images/ui/arrow-up-right.svg" alt="" aria-hidden="true" /></div>
        </div>
        <div className="stat-box">
          <div className="stat-num">Rõ ràng</div>
          <div className="stat-label">Thông tin và báo giá minh bạch</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">2 nhóm</div>
          <div className="stat-label">Doanh nghiệp và cá nhân</div>
        </div>
      </div>
      <LandingPartners />
    </div></section>
  );
}