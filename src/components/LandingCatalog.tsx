
/* Generated from the supplied HTML layout. Edit this section independently. */
type CatalogProps = {
 category: string; view: 'grid' | 'table'; setCategory: (category: string) => void;
 setView: (view: 'grid' | 'table') => void;
 onAddToQuote: (item: string) => void;
 showToast: (message: string) => void;
};

export default function LandingCatalog({ category, view, setCategory, setView, onAddToQuote, showToast }: CatalogProps) {

  return (
    <section className="section" id="categories" style={{ "background": "var(--bg-cream)", "borderTop": "var(--border-subtle)", "borderBottom": "var(--border-subtle)" }}><div className="container">
        <div className="cat-split-head">
          <div>
            <span className="section-num-tag">02 • DANH MỤC ĐA DẠNG</span>
            <h2 className="section-h2" style={{ "marginBottom": "0" }}>Bite to Business — Đáp ứng nhu cầu mua hàng trên một nền tảng</h2>
          </div>
          <p style={{ "fontSize": "15px", "color": "var(--text-body)" }}>
            
          Từ rau củ, thịt cá tươi sống đến 
            <strong>thực phẩm chế biến sẵn</strong>
             (chả giò, bò viên, xúc xích, croissant cấp đông), gia vị và nguyên liệu pha chế — giúp doanh nghiệp hợp nhất mọi nhu cầu thu mua trên một hệ thống duy nhất.
        
          </p>
        </div>
        <div className="cat-pill-cloud" id="categoryPillCloud">
          <button className={"cat-pill-item" + (category === "all" ? " active" : "")} data-cat="all" type="button" onClick={() => setCategory("all")}>
            <span style={{ "position": "relative", "zIndex": "2" }}>Tất cả nổi bật</span>
            <span className="cat-bg-svg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.5L14.4 8.6L20.5 11L14.4 13.4L12 19.5L9.6 13.4L3.5 11L9.6 8.6L12 2.5Z" />
                <path d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z" />
                <path d="M5 16L5.6 17.6L7.2 18.2L5.6 18.8L5 20.4L4.4 18.8L2.8 18.2L4.4 17.6L5 16Z" />
              </svg>
            </span>
          </button>
          <button className={"cat-pill-item" + (category === "meat" ? " active" : "")} data-cat="meat" type="button" onClick={() => setCategory("meat")}>
            <span style={{ "position": "relative", "zIndex": "2" }}>Thịt &amp; Gia cầm</span>
            <span className="cat-bg-svg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.5 4.5C18.5 4.5 21 7 21 10C21 15 14 20 8.5 20C5 20 3 17.8 3 14.5C3 9 8.5 4.5 15.5 4.5Z" />
                <path d="M15 8.5C16.3807 8.5 17.5 9.61929 17.5 11C17.5 12.3807 16.3807 13.5 15 13.5C13.6193 13.5 12.5 12.3807 12.5 11C12.5 9.61929 13.6193 8.5 15 8.5Z" />
                <path d="M7.5 15.5C9.5 15.5 11.5 14 12.5 12" />
              </svg>
            </span>
          </button>
          <button className={"cat-pill-item" + (category === "seafood" ? " active" : "")} data-cat="seafood" type="button" onClick={() => setCategory("seafood")}>
            <span style={{ "position": "relative", "zIndex": "2" }}>Cá &amp; Hải sản</span>
            <span className="cat-bg-svg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12C5.5 7.5 11 6.5 16.5 9.5C18.8 10.8 20.5 12 22 12C20.5 12 18.8 13.2 16.5 14.5C11 17.5 5.5 16.5 2 12Z" />
                <path d="M17 12L21.5 8V16L17 12Z" />
                <circle cx="7.5" cy="11.5" r="1" />
                <path d="M11 9.5C10.2 11 10.2 13 11 14.5" />
              </svg>
            </span>
          </button>
          <button className={"cat-pill-item" + (category === "prepared" ? " active" : "")} data-cat="prepared" type="button" onClick={() => setCategory("prepared")}>
            <span style={{ "position": "relative", "zIndex": "2" }}>Đồ ăn chế biến sẵn</span>
            <span className="cat-bg-svg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 15.5C3 10.3 7 6 12 6C17 6 21 10.3 21 15.5C21 17.5 19.4 19 17.5 19H6.5C4.6 19 3 17.5 3 15.5Z" />
                <path d="M6.5 8.5C8 10 9.5 10 12 8.5C14.5 10 16 10 17.5 8.5" />
                <path d="M7.5 14.5C9.5 15.8 14.5 15.8 16.5 14.5" />
              </svg>
            </span>
          </button>
          <button className={"cat-pill-item" + (category === "veg" ? " active" : "")} data-cat="veg" type="button" onClick={() => setCategory("veg")}>
            <span style={{ "position": "relative", "zIndex": "2" }}>Rau, Củ &amp; Nấm</span>
            <span className="cat-bg-svg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3C11 3 5 7.5 5 14.5C5 17.8 7.2 20 10.5 20C17.5 20 21 14 21 8C21 5 19.5 3 17 3Z" />
                <path d="M5 19L15 9" />
                <path d="M11 13L11.5 8.5" />
                <path d="M14 12L17.5 11.5" />
              </svg>
            </span>
          </button>
          <button className={"cat-pill-item" + (category === "dairy" ? " active" : "")} data-cat="dairy" type="button" onClick={() => setCategory("dairy")}>
            <span style={{ "position": "relative", "zIndex": "2" }}>Sữa, Bơ &amp; Phô mai</span>
            <span className="cat-bg-svg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11L13.5 4.5C17.5 6 20.5 9 21 13.5V18.5C21 19.3 20.3 20 19.5 20H4.5C3.7 20 3 19.3 3 18.5V11Z" />
                <path d="M3 11H21" />
                <circle cx="8.5" cy="15.5" r="1.5" />
                <circle cx="14.5" cy="16.5" r="1" />
                <circle cx="15" cy="13.2" r="1" />
              </svg>
            </span>
          </button>
          <button className={"cat-pill-item" + (category === "bakery" ? " active" : "")} data-cat="bakery" type="button" onClick={() => setCategory("bakery")}>
            <span style={{ "position": "relative", "zIndex": "2" }}>Bánh &amp; Tráng miệng</span>
            <span className="cat-bg-svg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5C2.8 14.5 3 10.5 6 8C9 5.5 15 5.5 18 8C21 10.5 21.2 14.5 19.5 16.5C18.2 18 16 17.5 15 15.5C13.5 13 10.5 13 9 15.5C8 17.5 5.8 18 4.5 16.5Z" />
                <path d="M8.5 7C9.5 9.5 9.5 12 8.8 14.5" />
                <path d="M15.5 7C14.5 9.5 14.5 12 15.2 14.5" />
              </svg>
            </span>
          </button>
        </div>
        <div id="catalog-preview">
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "18px", "flexWrap": "wrap", "gap": "10px" }}>
            <span style={{ "fontWeight": "700", "fontSize": "15px" }}>Mặt hàng tiêu biểu (Công khai bảng giá Volume Pricing cho cả Guest):</span>
            <div style={{ "display": "flex", "gap": "8px" }}>
              <button type="button" className={view === "grid" ? "btn btn-primary" : "btn btn-outline"} id="btnModeGrid" style={{ "padding": "7px 16px", "fontSize": "12.5px" }} onClick={() => setView("grid")}>Dạng Thẻ (Base UI)</button>
              <button type="button" className={view === "table" ? "btn btn-primary" : "btn btn-outline"} id="btnModeTable" style={{ "padding": "7px 16px", "fontSize": "12.5px" }} onClick={() => setView("table")}>Dạng Bảng So Sánh (A2UI)</button>
            </div>
          </div>
          <div className="product-4-grid" id="productGridContainer" style={{ display: view === "grid" ? "grid" : "none" }}>
            <div className="soft-p-card" data-category="meat" style={{ display: category === "all" || category === "meat" ? "flex" : "none" }}>
              <div className="soft-p-img has-svg-bg">
                <div className="soft-badge-top" style={{ "zIndex": "3" }}><span className="tag-soft tag-hot">Bán chạy</span></div>
                <div className="svg-bg-watermark watermark-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.5 4.5C18.5 4.5 21 7 21 10C21 15 14 20 8.5 20C5 20 3 17.8 3 14.5C3 9 8.5 4.5 15.5 4.5Z" />
                    <path d="M15 8.5C16.3807 8.5 17.5 9.61929 17.5 11C17.5 12.3807 16.3807 13.5 15 13.5C13.6193 13.5 12.5 12.3807 12.5 11C12.5 9.61929 13.6193 8.5 15 8.5Z" />
                    <path d="M7.5 15.5C9.5 15.5 11.5 14 12.5 12" />
                  </svg>
                </div>
              </div>
              <div className="soft-p-body">
                <div style={{ "fontSize": "11px", "color": "var(--text-muted)", "fontWeight": "600" }}>MDL-PORK-BELLY-500G</div>
                <div className="soft-p-title">Ba Chỉ Heo Mát Chuẩn Khay 500g</div>
                <div style={{ "fontSize": "12px", "color": "var(--text-body)" }}>Đơn vị: Khay 500g • MOQ: 3 khay</div>
                <div className="soft-p-price-row">
                  <span className="soft-price-now">80.000đ/khay</span>
                  <span className="soft-price-old">90.000đ</span>
                </div>
                <div className="soft-tier-note">
                  Mua từ 10 khay: 
                  <strong>76.000đ</strong>
                   • 30+: 
                  <strong>72.000đ</strong>
                </div>
                <button type="button" className="btn btn-primary add-quote-btn" data-item="Ba Chỉ Heo Mát 500g" style={{ "width": "100%", "padding": "9px", "fontSize": "13px", "marginTop": "auto" }} onClick={() => onAddToQuote("Ba Chỉ Heo Mát 500g")}>+ Thêm vào Báo giá</button>
              </div>
            </div>
            <div className="soft-p-card" data-category="prepared" style={{ display: category === "all" || category === "prepared" ? "flex" : "none" }}>
              <div className="soft-p-img has-svg-bg">
                <div className="soft-badge-top" style={{ "zIndex": "3" }}>
                  <span className="tag-soft tag-new">Mới</span>
                  <span className="tag-soft tag-prep">Chế biến sẵn</span>
                </div>
                <div className="svg-bg-watermark watermark-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 15.5C3 10.3 7 6 12 6C17 6 21 10.3 21 15.5C21 17.5 19.4 19 17.5 19H6.5C4.6 19 3 17.5 3 15.5Z" />
                    <path d="M6.5 8.5C8 10 9.5 10 12 8.5C14.5 10 16 10 17.5 8.5" />
                    <path d="M7.5 14.5C9.5 15.8 14.5 15.8 16.5 14.5" />
                  </svg>
                </div>
              </div>
              <div className="soft-p-body">
                <div style={{ "fontSize": "11px", "color": "var(--text-muted)", "fontWeight": "600" }}>MD-PREP-003</div>
                <div className="soft-p-title">Chả Giò Tôm Thịt Cấp Đông Gói 1kg</div>
                <div style={{ "fontSize": "12px", "color": "var(--text-body)" }}>Đơn vị: Gói 1kg • MOQ: 3 gói</div>
                <div className="soft-p-price-row">
                  <span className="soft-price-now">119.000đ/gói</span>
                  <span className="soft-price-old">140.000đ</span>
                </div>
                <div className="soft-tier-note">
                  Mua từ 15 gói: 
                  <strong>112.000đ</strong>
                   • 40+: 
                  <strong>105.000đ</strong>
                </div>
                <button type="button" className="btn btn-primary add-quote-btn" data-item="Chả Giò Tôm Thịt 1kg" style={{ "width": "100%", "padding": "9px", "fontSize": "13px", "marginTop": "auto" }} onClick={() => onAddToQuote("Chả Giò Tôm Thịt 1kg")}>+ Thêm vào Báo giá</button>
              </div>
            </div>
            <div className="soft-p-card" data-category="prepared" style={{ display: category === "all" || category === "prepared" ? "flex" : "none" }}>
              <div className="soft-p-img has-svg-bg">
                <div className="soft-badge-top" style={{ "zIndex": "3" }}><span className="tag-soft tag-prep">Chế biến sẵn</span></div>
                <div className="svg-bg-watermark watermark-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="21" x2="21" y2="3" />
                    <circle cx="8.5" cy="15.5" r="2.8" />
                    <circle cx="12.5" cy="11.5" r="2.8" />
                    <circle cx="16.5" cy="7.5" r="2.8" />
                  </svg>
                </div>
              </div>
              <div className="soft-p-body">
                <div style={{ "fontSize": "11px", "color": "var(--text-muted)", "fontWeight": "600" }}>MD-PREP-002</div>
                <div className="soft-p-title">Bò Viên Gân Đặc Biệt Gói 1kg</div>
                <div style={{ "fontSize": "12px", "color": "var(--text-body)" }}>Đơn vị: Gói 1kg • MOQ: 3 gói</div>
                <div className="soft-p-price-row"><span className="soft-price-now">165.000đ/gói</span></div>
                <div className="soft-tier-note">
                  Mua từ 10 gói: 
                  <strong>155.000đ</strong>
                   • 25+: 
                  <strong>148.000đ</strong>
                </div>
                <button type="button" className="btn btn-primary add-quote-btn" data-item="Bò Viên Gân 1kg" style={{ "width": "100%", "padding": "9px", "fontSize": "13px", "marginTop": "auto" }} onClick={() => onAddToQuote("Bò Viên Gân 1kg")}>+ Thêm vào Báo giá</button>
              </div>
            </div>
            <div className="soft-p-card" data-category="bakery" style={{ display: category === "all" || category === "bakery" ? "flex" : "none" }}>
              <div className="soft-p-img sold-out has-svg-bg"><div className="svg-bg-watermark watermark-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5C2.8 14.5 3 10.5 6 8C9 5.5 15 5.5 18 8C21 10.5 21.2 14.5 19.5 16.5C18.2 18 16 17.5 15 15.5C13.5 13 10.5 13 9 15.5C8 17.5 5.8 18 4.5 16.5Z" />
                    <path d="M8.5 7C9.5 9.5 9.5 12 8.8 14.5" />
                    <path d="M15.5 7C14.5 9.5 14.5 12 15.2 14.5" />
                  </svg>
                </div></div>
              <div className="soft-p-body">
                <div style={{ "fontSize": "11px", "color": "var(--text-muted)", "fontWeight": "600" }}>MD-BAKE-001</div>
                <div className="soft-p-title">Croissant Bơ Pháp Cấp Đông (10 chiếc)</div>
                <div style={{ "fontSize": "12px", "color": "var(--text-body)" }}>Đơn vị: Gói 10c • MOQ: 2 gói</div>
                <div className="soft-p-price-row"><span className="soft-price-now" style={{ "color": "var(--text-muted)" }}>135.000đ/gói</span></div>
                <div className="soft-tier-note" style={{ "background": "var(--coral-soft-bg)", "color": "var(--coral)" }}>Tạm hết khả dụng (On hand = Reserved)</div>
                <button type="button" className="btn" disabled style={{ "width": "100%", "padding": "9px", "fontSize": "13px", "marginTop": "auto", "background": "#E6E4DD", "color": "#888" }}>Tạm hết hàng</button>
              </div>
            </div>
          </div>
          <div style={{ "background": "var(--surface-white)", "border": "var(--border-card)", "borderRadius": "var(--radius-md)", "padding": "18px 22px", "marginTop": "20px", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "flexWrap": "wrap", "gap": "14px", "boxShadow": "var(--shadow-soft)" }}>
            <div>
              <div style={{ "fontFamily": "var(--font-serif)", "fontWeight": "800", "fontSize": "17px", "color": "var(--navy)" }}>Bạn cần nguồn hàng chưa có trên kệ?</div>
              <div style={{ "fontSize": "13.5px", "color": "var(--text-body)" }}>
                Gửi yêu cầu trực tiếp cho bộ phận 
                <strong>Logistics Staff</strong>
                 để bổ sung vào Catalog và nhận báo giá qua Gmail.
              </div>
            </div>
            <button type="button" className="btn btn-outline" id="btnRequestNewProduct" style={{ "padding": "9px 18px", "fontSize": "13px" }} onClick={() => showToast("Tính năng gửi yêu cầu sản phẩm mới chưa được kết nối Backend.")}>+ Gửi yêu cầu thêm sản phẩm mới</button>
          </div>
          <div className="a2ui-table-box" id="productTableContainer" style={{ display: view === "table" ? "block" : "none" }}><table className="a2ui-table">
              <thead><tr>
                  <th>Mã SKU &amp; Sản phẩm</th>
                  <th>Quy cách / MOQ</th>
                  <th>Giá lẻ / Sale</th>
                  <th>Giá sỉ Volume (10+)</th>
                  <th>Trạng thái Kho</th>
                  <th>Thao tác</th>
                </tr></thead>
              <tbody>
                <tr>
                  <td>
                    <strong>MDL-PORK-BELLY-500G</strong>
                     — Ba Chỉ Heo Mát Khay 500g
                  </td>
                  <td>Khay • MOQ 3</td>
                  <td>80.000đ</td>
                  <td>
                    <strong style={{ "color": "var(--forest)" }}>76.000đ / khay</strong>
                  </td>
                  <td>
                    <span style={{ "color": "var(--green-ok)", "fontWeight": "700" }}>Còn 120 khay</span>
                  </td>
                  <td>
                    <button type="button" className="btn btn-primary add-quote-btn" data-item="Ba Chỉ Heo Mát 500g (10 khay)" style={{ "padding": "6px 14px", "fontSize": "12px" }} onClick={() => onAddToQuote("Ba Chỉ Heo Mát 500g (10 khay)")}>+ Thêm 10 khay</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>MD-PREP-003</strong>
                     — Chả Giò Tôm Thịt Cấp Đông 1kg
                  </td>
                  <td>Gói • MOQ 3</td>
                  <td>119.000đ</td>
                  <td>
                    <strong style={{ "color": "var(--forest)" }}>112.000đ / gói</strong>
                  </td>
                  <td>
                    <span style={{ "color": "var(--green-ok)", "fontWeight": "700" }}>Còn 85 gói</span>
                  </td>
                  <td>
                    <button type="button" className="btn btn-primary add-quote-btn" data-item="Chả Giò Tôm Thịt 1kg (15 gói)" style={{ "padding": "6px 14px", "fontSize": "12px" }} onClick={() => onAddToQuote("Chả Giò Tôm Thịt 1kg (15 gói)")}>+ Thêm 15 gói</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>MD-PREP-002</strong>
                     — Bò Viên Gân Đặc Biệt 1kg
                  </td>
                  <td>Gói • MOQ 3</td>
                  <td>165.000đ</td>
                  <td>
                    <strong style={{ "color": "var(--forest)" }}>155.000đ / gói</strong>
                  </td>
                  <td>
                    <span style={{ "color": "var(--green-ok)", "fontWeight": "700" }}>Còn 64 gói</span>
                  </td>
                  <td>
                    <button type="button" className="btn btn-primary add-quote-btn" data-item="Bò Viên Gân 1kg (10 gói)" style={{ "padding": "6px 14px", "fontSize": "12px" }} onClick={() => onAddToQuote("Bò Viên Gân 1kg (10 gói)")}>+ Thêm 10 gói</button>
                  </td>
                </tr>
              </tbody>
            </table></div>
        </div>
      </div></section>
  );
}

