import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import BrandHero from '@/components/brand/BrandHero';
import BrandDirectory from '@/components/brand/BrandDirectory';
import BrandQuoteCTA from '@/components/brand/BrandQuoteCTA';
import '@/components/brand/brand.css';

/** Trang thương hiệu public, hoàn toàn là UI demo. */
export default function BrandsPage() {
  return (
    <div className="btb-brand-page-shell">
      <Header />
      <main className="btb-brand btb-brand-overview" id="main-content">
        <BrandHero />
        <BrandDirectory />
        <BrandQuoteCTA />
      </main>
      <Footer />
    </div>
  );
}