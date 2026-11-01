/* Generated from the supplied HTML layout. Edit this section independently. */
import { useState } from 'react';

export default function LandingBusinessSolution({ showToast }: { showToast: (message: string) => void }) {
  const [openAccordion, setOpenAccordion] = useState(0);
  return (
    <section className="section"><div className="container"><div className="dark-solution-box">
      <div className="dark-solution-head">
        <h2>
          Giải pháp giúp
          <span className="highlight-word">mua sắm thuận tiện</span>
          cho tổ chức và cá nhân
        </h2>
        <p style={{ "fontSize": "15px", "color": "#D8D5E8", "marginBottom": "22px" }}>Minh họa luồng báo giá, kiểm tra thông tin mặt hàng và tùy chỉnh cách xem theo nhu cầu. Các chức năng nâng cao sẽ hoàn thiện ở giai đoạn tích hợp Backend.</p>
        <a href="#onboarding-cta" className="btn btn-coral">

          Khám phá giải pháp
          <span className="btn-arrow-circle"><img src="/images/ui/arrow-right.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></span>
        </a>
      </div>
      <div className="dark-split-grid">
        <div className="ui-preview-mockup">
          <div className="mockup-top-bar">
            <div>
              <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--forest)" }}>DỰ THẢO BÁO GIÁ • QUOTE #QT-2026-089</div>
              <strong style={{ "fontFamily": "var(--font-serif)", "fontSize": "18px" }}>Danh sách đặt hàng &amp; Chia điểm giao</strong>
            </div>
            <span style={{ "background": "var(--yellow-tint)", "color": "#7A5300", "fontSize": "11px", "fontWeight": "700", "padding": "4px 10px", "borderRadius": "99px" }}>Revision 1 • Đã duyệt</span>
          </div>
          <div className="mockup-item-row">
            <div>
              <strong>Cá Hồi Na Uy Phi Lê Tươi (Khay 1kg)</strong>
              <div style={{ "fontSize": "11.5px", "color": "var(--text-muted)" }}>Ghi chú món: Cắt sẵn phần bụng riêng • Giao Chi nhánh Quận 1</div>
            </div>
            <div style={{ "textAlign": "right" }}>
              <strong style={{ "color": "var(--forest)" }}>20 kg × 622.000đ</strong>
              <div style={{ "fontSize": "11px", "color": "var(--coral)" }}>Đã cộng dồn Volume + Sale</div>
            </div>
          </div>
          <div className="mockup-item-row">
            <div>
              <strong>Chả Giò Tôm Thịt Chế Biến Sẵn (Gói 1kg)</strong>
              <div style={{ "fontSize": "11.5px", "color": "var(--text-muted)" }}>Ghi chú món: Đóng thùng xốp giữ lạnh • Giao Chi nhánh Quận 7</div>
            </div>
            <div style={{ "textAlign": "right" }}>
              <strong style={{ "color": "var(--forest)" }}>15 gói × 112.000đ</strong>
              <div style={{ "fontSize": "11px", "color": "var(--green-ok)" }}>Kho khả dụng: Đủ 100%</div>
            </div>
          </div>
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginTop": "14px", "paddingTop": "12px", "borderTop": "var(--border-subtle)" }}>
            <span style={{ "fontSize": "12.5px", "fontWeight": "600" }}>
              Mã giảm giá áp dụng:
              <code>MDFOOD10</code>
              (-10%)
            </span>
            <button type="button" className="btn btn-primary" id="btnMockupConfirmOrder" style={{ "padding": "8px 18px", "fontSize": "13px" }} onClick={() => showToast("Đây là đơn hàng mẫu trên landing page, chưa có đơn nào được gửi.")}>Xác nhận Đặt mua</button>
          </div>
        </div>
        <div className="accordion-list" id="featureAccordionList">
          <div className={"acc-item" + (openAccordion === 0 ? " active" : "")} role="button" tabIndex={0} onClick={() => setOpenAccordion(0)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpenAccordion(0); } }}>
            <div className="acc-header">
              <span>1. Đặt hàng nhanh &amp; Đặt lại đơn cũ chỉ 1 chạm</span>
              <span><img src="/images/ui/chevron-up.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></span>
            </div>
            <div className="acc-body">Tìm kiếm bằng ngôn ngữ tự nhiên qua bong bóng AI, chuyển đổi linh hoạt giữa dạng thẻ và bảng so sánh, hoặc khởi tạo Quote mới từ lịch sử đơn hàng tuần trước với giá và tồn kho cập nhật tức thì.</div>
          </div>
          <div className={"acc-item" + (openAccordion === 1 ? " active" : "")} role="button" tabIndex={0} onClick={() => setOpenAccordion(1)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpenAccordion(1); } }}>
            <div className="acc-header">
              <span>2. Nguồn hàng ổn định, cam kết đủ 100% mới xác nhận</span>
              <span><img src="/images/ui/chevron-down.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></span>
            </div>
            <div className="acc-body">Khác với nơi nhận đơn rồi giao thiếu, Bite to Business đối chiếu trực tiếp tồn khả dụng (Available = On hand − Reserved) và chỉ xác nhận đơn khi đáp ứng trọn vẹn mọi mặt hàng bạn đặt.</div>
          </div>
          <div className={"acc-item" + (openAccordion === 2 ? " active" : "")} role="button" tabIndex={0} onClick={() => setOpenAccordion(2)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpenAccordion(2); } }}>
            <div className="acc-header">
              <span>3. Chia nhiều điểm giao &amp; Theo dõi tuyến Vietmap</span>
              <span><img src="/images/ui/chevron-down.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></span>
            </div>
            <div className="acc-body">Một đơn hàng có thể chia thành nhiều nhóm giao hàng (Packages) tới nhiều địa chỉ khác nhau, kèm bản đồ tuyến đường minh họa và thời gian dự kiến (ETA) rõ ràng.</div>
          </div>
          <div className={"acc-item" + (openAccordion === 3 ? " active" : "")} role="button" tabIndex={0} onClick={() => setOpenAccordion(3)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpenAccordion(3); } }}>
            <div className="acc-header">
              <span>4. Giá bậc thang Volume Pricing &amp; Chứng từ minh bạch</span>
              <span><img src="/images/ui/chevron-down.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></span>
            </div>
            <div className="acc-body">Công khai các bậc giá theo số lượng mua, cho phép cộng dồn cùng chương trình khuyến mãi và mã giảm giá 8 ký tự, lưu trữ Snapshot đơn hàng phục vụ đối soát và xuất hóa đơn VAT.</div>
          </div>
        </div>
      </div>
    </div></div></section>
  );
}