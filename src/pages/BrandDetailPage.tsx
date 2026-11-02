import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import BrandDetailHero from '@/components/BrandDetailHero';
import BrandBreadcrumb from '@/components/BrandBreadcrumb';
import BrandDiscovery from '@/components/BrandDiscovery';
import BrandRecentSearch from '@/components/BrandRecentSearch';
import BrandProducts from '@/components/BrandProducts';
import BrandRelatedProducts from '@/components/BrandRelatedProducts';
import { getBrandBySlug, getBrandProducts, RELATED_PRODUCTS } from '@/components/brandData';
import type { BrandProduct } from '@/components/brandData';
import '@/components/brand.css';

/** UI public, dữ liệu giả lập, không gọi API từ các section Brand. */
export default function BrandDetailPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brand = getBrandBySlug(brandSlug);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [toast, setToast] = useState('');
  const [demoCount, setDemoCount] = useState(0);

  function onQuantityChange(productId: string, count: number) {
    setQuantities((previous) => ({ ...previous, [productId]: count }));
  }

  function addDemoProduct(product: BrandProduct, count: number) {
    setDemoCount((previous) => previous + count);
    setToast(`Đã chọn ${count} × ${product.name} (demo UI, chưa tạo đơn hàng).`);
  }

  return (
    <div className="btb-brand-page-shell">
      <Header />
      <main className="btb-brand btb-brand-detail-page" id="main-content">
        {!brand ? (
          <div className="btb-brand-container btb-brand-not-found">
            <h1>Chưa có gian hàng này</h1>
            <p>Hiện chưa có dữ liệu minh họa cho thương hiệu bạn chọn.</p>
            <Link className="btb-brand-btn btb-brand-btn--coral" to="/brands">Xem danh sách thương hiệu</Link>
          </div>
        ) : (
          <div className="btb-brand-container">
            <BrandBreadcrumb brand={brand} />
            <BrandDetailHero brand={brand} />
            <div className="btb-brand-showcase">
              <BrandProducts brand={brand} products={getBrandProducts(brand.slug)} quantities={quantities} onQuantityChange={onQuantityChange} onAdd={addDemoProduct} />
              <BrandRelatedProducts products={RELATED_PRODUCTS} quantities={quantities} onQuantityChange={onQuantityChange} onAdd={addDemoProduct} />
              <p className="btb-brand-showcase__disclaimer">Giá, số lượng và tồn kho là dữ liệu minh họa để hoàn thiện giao diện. Chưa có thanh toán hay API Backend.</p>

              {/* Cùng 1 khu vực ngay trên Footer: tìm gần đây + mua lại */}
              <section className="btb-brand-history-hub" aria-labelledby="btb-brand-history-hub-title">
                <div className="btb-brand-history-hub__intro">
                  <span className="btb-brand-pill btb-brand-pill--yellow">GÓC KHÁM PHÁ CỦA BẾP</span>
                  <h2 id="btb-brand-history-hub-title">Tìm lại nhanh, <em>mua lại dễ dàng.</em></h2>
                  <p>Hai lịch sử riêng biệt: từ khóa bạn đã tìm và sản phẩm từ những đơn hàng đã mua.</p>
                </div>
                <div className="btb-brand-history-hub__grid">
                  <BrandRecentSearch />
                  <BrandDiscovery />
                </div>
              </section>
            </div>
          </div>
        )}
        {demoCount > 0 && (
          <div className="btb-brand-demo-cart" aria-label="Số lượng sản phẩm demo đã chọn">
            <img src="/images/ui/brand/check.svg" alt="" /> Đã chọn {demoCount} sản phẩm mẫu
          </div>
        )}
        {toast && (
          <div className="btb-brand-toast" role="status" aria-live="polite">
            <span>{toast}</span>
            <button type="button" aria-label="Đóng thông báo" onClick={() => setToast('')}>×</button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
