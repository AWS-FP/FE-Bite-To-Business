
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useTranslation } from 'react-i18next';
import LandingCarousel from './LandingCarousel';
import LandingPartners from './LandingPartners';

export default function LandingHero() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  return (
    <section className="hero-section" id="top-hero"><div className="container">
        <div className="hero-eyebrow"><span>Nền tảng cung ứng thực phẩm B2B &amp; Hộ gia đình tích hợp AI</span></div>
        <h1 className="hero-title" id="heroMainTitle">{language === "en" ? <>Comprehensive supply solutions for <em>F&amp;B businesses</em></> : <>Giải pháp cung ứng toàn diện cho doanh nghiệp <em>F&amp;B và Bếp Việt</em></>}</h1>
        <p className="hero-subtitle" id="heroSubText">{language === "en" ? "Providing transparent raw materials and ready-to-cook foods, timely delivery, and Volume Pricing optimization on a single platform." : "Mang đến nguồn nguyên liệu tươi sống và đồ ăn chế biến sẵn minh bạch, giao hàng đúng hẹn chuẩn xác và tối ưu chi phí với Volume Pricing trên một nền tảng duy nhất."}</p>
        <div className="hero-ctas">
          <a href="#categories" className="btn btn-primary">
            
          Bắt đầu nhập hàng 
            <span className="btn-arrow-circle">→</span>
          </a>
          <a href="#catalog-preview" className="btn btn-outline">Danh mục sản phẩm</a>
        </div>
        <LandingCarousel />
        <div className="stats-4-grid">
          <div className="stat-box">
            <div className="stat-num">3,766+</div>
            <div className="stat-label">Doanh nghiệp F&amp;B &amp; Bếp ăn</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">HACCP</div>
            <div className="stat-label">Kho đạt chuẩn quốc tế ↗</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">100%</div>
            <div className="stat-label">Đủ toàn bộ hàng mới xác nhận đơn</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">99%</div>
            <div className="stat-label">Giao hàng đúng giờ &amp; đúng lộ trình</div>
          </div>
        </div>
        <LandingPartners />
      </div></section>
  );
}

