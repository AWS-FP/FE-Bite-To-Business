import BtbImagePlaceholder from './BtbImagePlaceholder';
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useState } from 'react';
import { landingSegments } from './landingSegmentsData';

export default function LandingSegments() {
  const [activeSegment, setActiveSegment] = useState(0);
  const segment = landingSegments[activeSegment];
  return (
    <section className="section" id="segments" style={{ "background": "var(--bg-cream)", "borderTop": "var(--border-subtle)", "borderBottom": "var(--border-subtle)" }}><div className="container">
      <div className="section-center-head">
        <span className="section-num-tag">04 • ĐỐI TƯỢNG PHỤC VỤ</span>
        <h2 className="section-h2">Phục vụ đa dạng nhu cầu mua thực phẩm</h2>
      </div>
      <div className="segment-slider-header">
        <button type="button" className="seg-arrow-btn" id="btnSegPrev" aria-label="Mô hình trước" onClick={() => setActiveSegment((v) => (v + landingSegments.length - 1) % landingSegments.length)}><img src="/images/ui/arrow-left.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></button>
        <button type="button" className={"seg-tab" + (activeSegment === 0 ? " active" : "")} data-seg-idx="0" onClick={() => setActiveSegment(0)}>Doanh nghiệp / HTX</button>
        <button type="button" className={"seg-tab" + (activeSegment === 1 ? " active" : "")} data-seg-idx="1" onClick={() => setActiveSegment(1)}>Cửa hàng / Hộ kinh doanh</button>
        <button type="button" className={"seg-tab" + (activeSegment === 2 ? " active" : "")} data-seg-idx="2" onClick={() => setActiveSegment(2)}>Nhà hàng / Bếp ăn</button>
        <button type="button" className={"seg-tab" + (activeSegment === 3 ? " active" : "")} data-seg-idx="3" onClick={() => setActiveSegment(3)}>Phân phối / Bán lẻ</button>
        <button type="button" className={"seg-tab" + (activeSegment === 4 ? " active" : "")} data-seg-idx="4" onClick={() => setActiveSegment(4)}>Cá nhân / Gia đình</button>
        <button type="button" className="seg-arrow-btn" id="btnSegNext" aria-label="Mô hình kế tiếp" onClick={() => setActiveSegment((v) => (v + 1) % landingSegments.length)}><img src="/images/ui/arrow-right.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></button>
      </div>
      <div className="segment-showcase-card">
        <div>
          <h3 style={{ "fontFamily": "var(--font-serif)", "fontSize": "28px", "marginBottom": "10px" }} id="segTitle">{segment.title}</h3>
          <p style={{ "fontSize": "14.5px", "color": "var(--text-body)" }} id="segDesc">{segment.desc}</p>
          <ul className="seg-check-list">
            <li>
              <span className="icon-check"><img className="btb-ui-icon" src="/images/ui/check.svg" alt="" aria-hidden="true" /></span>
              <span id="segBullet1">{segment.b1}</span>
            </li>
            <li>
              <span className="icon-check"><img className="btb-ui-icon" src="/images/ui/check.svg" alt="" aria-hidden="true" /></span>
              <span id="segBullet2">{segment.b2}</span>
            </li>
            <li>
              <span className="icon-check"><img className="btb-ui-icon" src="/images/ui/check.svg" alt="" aria-hidden="true" /></span>
              <span id="segBullet3">{segment.b3}</span>
            </li>
          </ul>
          <div style={{ "fontSize": "12.5px", "color": "var(--text-muted)", "fontWeight": "600" }}>{segment.audience}</div>
        </div>
        <div style={{ "position": "relative", "borderRadius": "var(--radius-md)", "overflow": "hidden", "height": "300px", "boxShadow": "var(--shadow-soft)" }}><BtbImagePlaceholder label={`Ảnh mô hình: ${segment.title}`} /></div>
      </div>
    </div></section>
  );
}