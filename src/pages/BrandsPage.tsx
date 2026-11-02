import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import BrandHero from '@/components/BrandHero';
import BrandDirectory from '@/components/BrandDirectory';
import BrandQuoteCTA from '@/components/BrandQuoteCTA';
import '@/components/brand.css';

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