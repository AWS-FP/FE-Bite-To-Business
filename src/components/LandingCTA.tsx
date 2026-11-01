/* Generated from the supplied HTML layout. Edit this section independently. */
import { useNavigate } from 'react-router-dom';

export default function LandingCTA() {
    const navigate = useNavigate();
    return (
        <section className="bottom-cta-banner" id="onboarding-cta"><div className="container cta-banner-grid">
            <div>
                <span className="showcase-badge">BẮT ĐẦU NGAY HÔM NAY</span>
                <h2 style={{ "fontFamily": "var(--font-heading)", "fontSize": "36px", "fontWeight": "800", "color": "#fff", "lineHeight": "1.2", "marginBottom": "14px" }}>

                    Hãy cùng xây dựng
                    <br />
                    <span style={{ "color": "var(--yellow-soft)" }}>Chuỗi cung ứng tương lai</span>{" "}của bạn

                </h2>
                <p style={{ "fontSize": "15px", "color": "#DCE8E3", "marginBottom": "28px" }}>Đồng hành cùng doanh nghiệp, hợp tác xã, hộ kinh doanh và gia đình trong hành trình tìm kiếm, lựa chọn và quản lý nhu cầu thực phẩm.</p>
                <div style={{ "display": "flex", "gap": "14px", "flexWrap": "wrap" }}>
                    <button type="button" className="btn btn-coral" id="btnCreateAccountCta" onClick={() => navigate("/register")}>

                        Tạo tài khoản
                        <span className="btn-arrow-circle"><img src="/images/ui/arrow-right.svg" className="btb-ui-icon" alt="" aria-hidden="true" /></span>
                    </button>
                    <button type="button" className="btn btn-outline" id="btnSignInCta" style={{ "background": "transparent", "color": "#fff", "borderColor": "rgba(255,255,255,0.4)" }} onClick={() => navigate("/login")}>Đăng nhập</button>
                </div>
            </div>
            <div className="step-3-list">
                <div className="step-3-item">
                    <span className="step-big-num">1</span>
                    <div>
                        <strong style={{ "fontFamily": "var(--font-heading)", "fontSize": "19px", "color": "#17133A", "display": "block", "marginBottom": "4px" }}>Gửi thông tin đăng ký</strong>
                        <span style={{ "fontSize": "13.5px", "color": "#123B2E" }}>Điền biểu mẫu trực tuyến nhanh chóng cho Doanh nghiệp/HTX hoặc Cá nhân/Hộ gia đình.</span>
                    </div>
                </div>
                <div className="step-3-item">
                    <span className="step-big-num">2</span>
                    <div>
                        <strong style={{ "fontFamily": "var(--font-heading)", "fontSize": "19px", "color": "#17133A", "display": "block", "marginBottom": "4px" }}>Xác minh thông tin &amp; Kích hoạt tài khoản</strong>
                        <span style={{ "fontSize": "13.5px", "color": "#123B2E" }}>Thông tin đăng ký được kiểm tra theo quy trình của hệ thống trước khi kích hoạt tài khoản.</span>
                    </div>
                </div>
                <div className="step-3-item">
                    <span className="step-big-num">3</span>
                    <div>
                        <strong style={{ "fontFamily": "var(--font-heading)", "fontSize": "19px", "color": "#17133A", "display": "block", "marginBottom": "4px" }}>Lập Báo giá &amp; Mua hàng dễ dàng</strong>
                        <span style={{ "fontSize": "13.5px", "color": "#123B2E" }}>Khám phá sản phẩm, chọn số lượng, chuẩn bị báo giá và xem thông tin mua sắm từ tài khoản.</span>
                    </div>
                </div>
            </div>
        </div></section>
    );
}