import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { BRAND_PRODUCTS, RELATED_PRODUCTS } from './brandData';
import type { BrandProduct } from './brandData';
import BrandImagePlaceholder from './BrandImagePlaceholder';

// Chỉ là lịch sử mua giả lập để thiết kế UI; chưa phải đơn hàng thật.
const DEMO_PURCHASES = [
  { productId: 'md-1', orderCount: 3 },
  { productId: 'cp-1', orderCount: 2 },
  { productId: 'cp-2', orderCount: 1 },
] as const;

type PurchasedProduct = {
  product: BrandProduct;
  orderCount: number;
};

type DragPosition = {
  pointerId: number;
  startX: number;
  startScrollLeft: number;
};

export default function BrandDiscovery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragPosition | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const purchased = useMemo<PurchasedProduct[]>(() => {
    const all = [...BRAND_PRODUCTS, ...RELATED_PRODUCTS];
    return DEMO_PURCHASES.flatMap(({ productId, orderCount }) => {
      const product = all.find((item) => item.id === productId);
      return product ? [{ product, orderCount }] : [];
    });
  }, []);

  const suggestions = useMemo(() => {
    const ownedCategories = new Set(purchased.map(({ product }) => product.category));
    const ownedIds = new Set(purchased.map(({ product }) => product.id));
    const all = [...BRAND_PRODUCTS, ...RELATED_PRODUCTS];
    return all.filter((item, index) =>
      ownedCategories.has(item.category) &&
      !ownedIds.has(item.id) &&
      all.findIndex((other) => other.id === item.id) === index,
    ).slice(0, 3);
  }, [purchased]);

  function scrollToProduct(index: number) {
    const track = trackRef.current;
    if (!track || purchased.length === 0) return;
    const target = Math.min(Math.max(index, 0), purchased.length - 1);
    track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
    setActiveIndex(target);
  }

  function syncIndex() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActiveIndex(Math.min(purchased.length - 1,
      Math.max(0, Math.round(track.scrollLeft / track.clientWidth))));
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    // Điện thoại/máy tính bảng: để trình duyệt tự vuốt ngang bằng scroll-snap.
    // Chuột desktop: cho phép nhấn giữ và kéo trái/phải.
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
    };
    track.style.scrollBehavior = 'auto';
    track.style.scrollSnapType = 'none';
    track.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;
    track.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    track.style.scrollSnapType = 'x mandatory';
    track.style.scrollBehavior = 'smooth';
    scrollToProduct(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToProduct(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToProduct(activeIndex + 1);
    }
  }

  if (!purchased.length) return null;

  return (
    <section className="btb-brand-purchased" aria-labelledby="btb-brand-purchased-title">
      <div className="btb-brand-purchased__heading">
        <div>
          <span className="btb-brand-pill btb-brand-pill--yellow">GỢI Ý MUA LẠI · DEMO</span>
          <h2 id="btb-brand-purchased-title">Những sản phẩm <em>đã mua</em></h2>
          <p>Mỗi lần xem một sản phẩm. Vuốt trên điện thoại hoặc kéo bằng chuột để chuyển sản phẩm.</p>
        </div>
        <div className="btb-brand-purchased__navigation" aria-label="Điều khiển danh sách sản phẩm đã mua">
          <button type="button" onClick={() => scrollToProduct(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Sản phẩm đã mua trước">
            <img src="/images/ui/brand/chevron-left.svg" alt="" />
          </button>
          <span aria-live="polite" aria-atomic="true">{activeIndex + 1} / {purchased.length}</span>
          <button type="button" onClick={() => scrollToProduct(activeIndex + 1)} disabled={activeIndex === purchased.length - 1} aria-label="Sản phẩm đã mua kế tiếp">
            <img src="/images/ui/brand/chevron-right.svg" alt="" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="btb-brand-purchased__track"
        role="region"
        aria-roledescription="carousel"
        aria-label="Các sản phẩm từng mua (dữ liệu minh họa)"
        tabIndex={0}
        onScroll={syncIndex}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onKeyDown={handleKeys}
      >
        {purchased.map(({ product, orderCount }) => (
          <article className="btb-brand-purchased__slide" key={product.id} aria-label={product.name}>
            <div className="btb-brand-purchased__visual">
              <BrandImagePlaceholder label={`Ảnh ${product.name}`} />
              <span className="btb-brand-purchased__visual-badge">KHUNG CHỜ ẢNH SẢN PHẨM</span>
            </div>
            <div className="btb-brand-purchased__info">
              <span className="btb-brand-purchased__tag">TỪ LỊCH SỬ ĐƠN HÀNG MẪU</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <dl>
                <div><dt>Nhóm thực phẩm</dt><dd>{product.category}</dd></div>
                <div><dt>Số lần mua (demo)</dt><dd>{orderCount} lần</dd></div>
                <div><dt>Quy cách</dt><dd>{product.pack}</dd></div>
              </dl>
              <span className="btb-brand-purchased__hint">Dữ liệu minh họa, chưa lấy từ Backend.</span>
            </div>
          </article>
        ))}
      </div>
      <div className="btb-brand-purchased__dots" aria-label="Chọn sản phẩm đã mua">
        {purchased.map(({ product }, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Xem ${product.name}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => scrollToProduct(index)}
          />
        ))}
      </div>

      <button className="btb-brand-purchased__suggest-toggle" type="button" aria-expanded={showSuggestions} onClick={() => setShowSuggestions((value) => !value)}>
        <img src="/images/ui/brand/sparkles.svg" alt="" />
        {showSuggestions ? 'Ẩn sản phẩm cùng nhóm' : 'Gợi ý thêm từ nhóm hàng đã mua'}
      </button>
      {showSuggestions && (
        <div className="btb-brand-purchased__suggestions" role="status">
          {suggestions.length ? suggestions.map((item) => <span key={item.id}>{item.name}</span>) : 'Chưa có gợi ý mẫu.'}
        </div>
      )}
    </section>
  );
}
