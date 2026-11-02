import BtbImagePlaceholder from './BtbImagePlaceholder';
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useEffect, useRef, useState } from 'react';
export default function LandingCarousel() {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const progressRef = useRef(0);
  const changeSlide = (next: number) => { setSlide((next + 5) % 5); progressRef.current = 0; setProgress(0); };
  useEffect(() => {
    if (!playing) return;
    const tick = window.setInterval(() => {
      progressRef.current += 100 / 90;
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setSlide((current) => (current + 1) % 5);
      }
      setProgress(progressRef.current);
    }, 50);
    return () => window.clearInterval(tick);
  }, [playing]);
  return (
    <div className="video-carousel-wrapper">
      <div className="video-carousel-viewport" id="heroCarouselViewport">
        <div className="carousel-progress-strip">
          <div className="progress-segment" data-slide="0" onClick={() => changeSlide(0)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); changeSlide(0); } }}>
            <div className="progress-fill" id="progFill0" style={{ width: slide > 0 ? "100%" : slide < 0 ? "0%" : `${progress}%` }}></div>
          </div>
          <div className="progress-segment" data-slide="1" onClick={() => changeSlide(1)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); changeSlide(1); } }}>
            <div className="progress-fill" id="progFill1" style={{ width: slide > 1 ? "100%" : slide < 1 ? "0%" : `${progress}%` }}></div>
          </div>
          <div className="progress-segment" data-slide="2" onClick={() => changeSlide(2)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); changeSlide(2); } }}>
            <div className="progress-fill" id="progFill2" style={{ width: slide > 2 ? "100%" : slide < 2 ? "0%" : `${progress}%` }}></div>
          </div>
          <div className="progress-segment" data-slide="3" onClick={() => changeSlide(3)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); changeSlide(3); } }}>
            <div className="progress-fill" id="progFill3" style={{ width: slide > 3 ? "100%" : slide < 3 ? "0%" : `${progress}%` }}></div>
          </div>
          <div className="progress-segment" data-slide="4" onClick={() => changeSlide(4)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); changeSlide(4); } }}>
            <div className="progress-fill" id="progFill4" style={{ width: slide > 4 ? "100%" : slide < 4 ? "0%" : `${progress}%` }}></div>
          </div>
        </div>
        <div className="carousel-top-status"><div className="live-video-pill">
          <span className="pulse-dot"></span>
          <span id="carouselStatusText">{`VIDEO GIỚI THIỆU DOANH NGHIỆP • SLIDE 0${slide + 1} / 05`}</span>
        </div></div>
        <button type="button" className="carousel-nav-btn carousel-nav-prev" id="btnPrevSlide" aria-label="Slide trước" onClick={() => changeSlide(slide - 1)}><img src="/images/ui/chevron-left.svg" alt="" aria-hidden="true" className="btb-ui-icon" /></button>
        <button type="button" className="carousel-nav-btn carousel-nav-next" id="btnNextSlide" aria-label="Slide kế tiếp" onClick={() => changeSlide(slide + 1)}><img src="/images/ui/chevron-right.svg" alt="" aria-hidden="true" className="btb-ui-icon" /></button>
        <div className="carousel-track" id="heroCarouselTrack" style={{ transform: `translateX(-${slide * 20}%)` }}>
          <div className={"carousel-slide" + (slide === 0 ? " active" : "")}>
            <BtbImagePlaceholder className="slide-bg-img" label="Ảnh kho vận" />
            <div className="slide-gradient-overlay"></div>
            <div className="slide-content-box">
              <div className="slide-text-col">
                <span className="slide-scene-tag">CẢNH 01 • HỆ THỐNG KHO VẬN TRUNG TÂM</span>
                <h2 className="slide-headline">Kho lưu trữ chuẩn quốc tế — Quản lý tồn kho thực tế theo thời gian thực</h2>
                <p className="slide-caption">Mọi mặt hàng từ gạo, dầu ăn, gia vị đến nguyên liệu đóng kiện đều được Logistics Staff ghi nhận trực tiếp. Chỉ xác nhận đơn khi kho đáp ứng đủ 100% toàn bộ dòng hàng đặt mua.</p>
              </div>
              <div className="slide-floating-card">
                <span className="soft-pink-tape">Real-time Stock</span>
                <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--forest)", "marginBottom": "4px" }}>CAM KẾT KHÔNG OVERSELL</div>
                <div style={{ "fontFamily": "var(--font-serif)", "fontWeight": "800", "fontSize": "17px", "marginBottom": "6px" }}>Available = On Hand − Reserved</div>
                <div style={{ "fontSize": "12.5px", "color": "var(--text-body)" }}>Tự động khóa và giữ đủ 100% hàng ngay khi xác nhận Order.</div>
              </div>
            </div>
          </div>
          <div className={"carousel-slide" + (slide === 1 ? " active" : "")}>
            <BtbImagePlaceholder className="slide-bg-img" label="Ảnh kho lạnh" />
            <div className="slide-gradient-overlay"></div>
            <div className="slide-content-box">
              <div className="slide-text-col">
                <span className="slide-scene-tag">CẢNH 02 • KIỂM ĐỊNH KHO MÁT &amp; ĐÓNG KIỆN</span>
                <h2 className="slide-headline">Kiểm soát nghiêm ngặt rau củ VietGAP, thịt mát &amp; hải sản cấp đông</h2>
                <p className="slide-caption">Đội ngũ vận hành kiểm tra từng khay thịt, rau củ tươi và phân chia chính xác vào từng Nhóm giao hàng (Order Packages) kèm ghi chú riêng của từng bếp.</p>
              </div>
              <div className="slide-floating-card">
                <span className="soft-pink-tape" style={{ "background": "var(--yellow-soft)" }}>Chuẩn HACCP</span>
                <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--coral)", "marginBottom": "4px" }}>ĐỒNG ĐỀU CHẤT LƯỢNG</div>
                <div style={{ "fontFamily": "var(--font-serif)", "fontWeight": "800", "fontSize": "17px", "marginBottom": "6px" }}>Phân bổ đa điểm nhận hàng</div>
                <div style={{ "fontSize": "12.5px", "color": "var(--text-body)" }}>Một đơn hàng có thể chia linh hoạt thành nhiều kiện cho nhiều chi nhánh.</div>
              </div>
            </div>
          </div>
          <div className={"carousel-slide" + (slide === 2 ? " active" : "")}>
            <BtbImagePlaceholder className="slide-bg-img" label="Ảnh nguyên liệu" />
            <div className="slide-gradient-overlay"></div>
            <div className="slide-content-box">
              <div className="slide-text-col">
                <span className="slide-scene-tag">CẢNH 03 • NGUYÊN LIỆU TƯƠI &amp; ĐỒ CHẾ BIẾN SẴN</span>
                <h2 className="slide-headline">Lựa chọn thực phẩm thuận tiện cho công việc và gia đình</h2>
                <p className="slide-caption">Cung ứng đầy đủ 14 danh mục: từ cá hồi phi lê, ba chỉ heo mát đến các món chế biến sẵn tiện lợi như chả giò, bò viên, xúc xích và bánh croissant cấp đông.</p>
              </div>
              <div className="slide-floating-card">
                <span className="soft-pink-tape">Poster AI • -15%</span>
                <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--coral)", "marginBottom": "4px" }}>ƯU ĐÃI CỘNG DỒN 3 TẦNG</div>
                <div style={{ "fontFamily": "var(--font-serif)", "fontWeight": "800", "fontSize": "17px", "marginBottom": "6px" }}>Volume Pricing + Sale + Coupon</div>
                <div style={{ "fontSize": "12.5px", "color": "var(--text-body)" }}>

                  Mua số lượng càng lớn đơn giá càng giảm, cộng dồn thêm mã
                  <code>MDFOOD10</code>
                  .

                </div>
              </div>
            </div>
          </div>
          <div className={"carousel-slide" + (slide === 3 ? " active" : "")}>
            <BtbImagePlaceholder className="slide-bg-img" label="Ảnh giao nhận" />
            <div className="slide-gradient-overlay"></div>
            <div className="slide-content-box">
              <div className="slide-text-col">
                <span className="slide-scene-tag">CẢNH 04 • GIAO HÀNG ĐÚNG HẸN TOÀN TP.HCM</span>
                <h2 className="slide-headline">Theo dõi lộ trình giao hàng đa điểm &amp; thời gian dự kiến (ETA) trên Vietmap</h2>
                <p className="slide-caption">Xuất phát từ kho trung tâm, hiển thị trực quan tuyến đường qua các điểm dừng. Miễn phí giao hàng cho đơn trong bán kính 10 km và khối lượng trên 10 kg.</p>
              </div>
              <div className="slide-floating-card">
                <span className="soft-pink-tape" style={{ "background": "var(--green-soft-bg)", "color": "var(--forest)" }}>99% Đúng giờ</span>
                <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--forest)", "marginBottom": "4px" }}>VIETMAP ROUTE &amp; ETA</div>
                <div style={{ "fontFamily": "var(--font-serif)", "fontWeight": "800", "fontSize": "17px", "marginBottom": "6px" }}>Minh bạch trạng thái chuyến</div>
                <div style={{ "fontSize": "12.5px", "color": "var(--text-body)" }}>Delivery Staff xác nhận hoàn tất thực tế ngay khi giao xong toàn tuyến.</div>
              </div>
            </div>
          </div>
          <div className={"carousel-slide" + (slide === 4 ? " active" : "")}><div className="slide-haccp-center">
            <span className="hero-eyebrow" style={{ "background": "var(--green-soft-bg)", "color": "var(--forest)", "marginBottom": "14px" }}>TIÊU CHUẨN AN TOÀN &amp; MINH BẠCH CHUỖI CUNG ỨNG</span>
            <div className="haccp-logo-emblem">
              <img src="/images/storefront/brand-logo.png" alt="Logo BTB Bite to Business" className="haccp-logo-img" />
              <div className="haccp-brand-huge">BITE TO BUSINESS</div>
            </div>
            <div className="haccp-codex-sub">HACCP CODEX &amp; AI A2UI PLATFORM 2026</div>
            <p style={{ "maxWidth": "620px", "fontSize": "15px", "color": "var(--text-body)", "marginBottom": "22px" }}>Nền tảng hướng tới tập trung danh mục, hiển thị giá theo số lượng từng sản phẩm và hỗ trợ quy trình mua sắm cho doanh nghiệp lẫn người dùng cá nhân.</p>
            <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap", "justifyContent": "center" }}>
              <a href="#onboarding-cta" className="btn btn-primary">Mở tài khoản Doanh nghiệp / Hộ gia đình <img className="btb-ui-icon" src="/images/ui/arrow-right.svg" alt="" aria-hidden="true" /></a>
              <button type="button" className="btn btn-outline" id="btnReplayCarousel" onClick={() => { setPlaying(true); changeSlide(0); }}><img className="btb-ui-icon" src="/images/ui/rotate-ccw.svg" alt="" aria-hidden="true" /> Xem lại từ đầu</button>
            </div>
          </div></div>
        </div>
        <div className="carousel-bottom-controls">
          <button type="button" className="video-ctrl-circle" id="btnPlayPauseCarousel" title="Tạm dừng / Phát tiếp slider" onClick={() => setPlaying((v) => !v)}><img className="btb-ui-icon" src={playing ? "/images/ui/pause.svg" : "/images/ui/play.svg"} alt="" aria-hidden="true" /></button>
          <button type="button" className="video-ctrl-circle" id="btnMuteCarousel" disabled title="Không có âm thanh trong bản demo"><img src="/images/ui/volume-off.svg" alt="" aria-hidden="true" className="btb-ui-icon" /></button>
        </div>
      </div>
      <div className="carousel-chapter-bar">
        <button type="button" className={"chapter-pill" + (slide === 0 ? " active" : "")} data-chapter="0" onClick={() => changeSlide(0)}>
          <span className="chapter-pill-num">01</span>
          <span>Kho vận chuẩn quốc tế</span>
        </button>
        <button type="button" className={"chapter-pill" + (slide === 1 ? " active" : "")} data-chapter="1" onClick={() => changeSlide(1)}>
          <span className="chapter-pill-num">02</span>
          <span>Kiểm định lạnh &amp; Đóng kiện</span>
        </button>
        <button type="button" className={"chapter-pill" + (slide === 2 ? " active" : "")} data-chapter="2" onClick={() => changeSlide(2)}>
          <span className="chapter-pill-num">03</span>
          <span>Thực phẩm &amp; Đồ chế biến sẵn</span>
        </button>
        <button type="button" className={"chapter-pill" + (slide === 3 ? " active" : "")} data-chapter="3" onClick={() => changeSlide(3)}>
          <span className="chapter-pill-num">04</span>
          <span>Mạng lưới giao TP.HCM</span>
        </button>
        <button type="button" className={"chapter-pill" + (slide === 4 ? " active" : "")} data-chapter="4" onClick={() => changeSlide(4)}>
          <span className="chapter-pill-num">05</span>
          <span>Chuẩn HACCP &amp; A2UI</span>
        </button>
      </div>
    </div>
  );
}