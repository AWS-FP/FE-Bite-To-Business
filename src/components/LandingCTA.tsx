
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useNavigate } from 'react-router-dom';

export default function LandingCTA() {
    const navigate = useNavigate();
    return (
        <section className="bottom-cta-banner" id="onboarding-cta"><div className="container cta-banner-grid">
            <div>
                <span className="showcase-badge">BẮT ĐẦU NGAY HÔM NAY</span>

                <h2
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '36px',
                        fontWeight: 400,
                        color: '#FFFFFF',
                        lineHeight: 1.3,
                        marginBottom: '14px',
                    }}
                >
                    Hãy cùng xây dựng
                    <br />
                    <span style={{ color: 'var(--color-store-yellow)' }}>
                        Chuỗi cung ứng tương lai
                    </span>
                    {' '}của bạn
                </h2>

                <p style={{ "fontSize": "15px", "color": "#DCE8E3", "marginBottom": "28px" }}>Đồng hành cùng các thương hiệu F&amp;B và bếp ăn gia đình Việt Nam, không còn nỗi lo thiếu hụt nguồn hàng hay biến động giá.</p>
                <div style={{ "display": "flex", "gap": "14px", "flexWrap": "wrap" }}>
                    <button type="button" className="btn btn-coral" id="btnCreateAccountCta" onClick={() => navigate("/register")}>

                        Tạo tài khoản
                        <span className="btn-arrow-circle">→</span>
                    </button>
                    <button type="button" className="btn btn-outline" id="btnSignInCta" style={{ "background": "transparent", "color": "#fff", "borderColor": "rgba(255,255,255,0.4)" }} onClick={() => navigate("/login")}>Đăng nhập</button>
                </div>
            </div>
            <div className="step-3-list">
                <div className="step-3-item">
                    <span className="step-big-num">1</span>
                    <div>
                        <strong style={{ "fontFamily": "var(--font-serif)", "fontSize": "19px", "color": "var(--color-auth-ink)", "display": "block", "marginBottom": "4px" }}>Gửi thông tin đăng ký</strong>
                        <span style={{ "fontSize": "13.5px", "color": "var(--color-auth-green)" }}>Điền biểu mẫu trực tuyến nhanh chóng cho Doanh nghiệp/HTX hoặc Cá nhân/Hộ gia đình.</span>
                    </div>
                </div>
                <div className="step-3-item">
                    <span className="step-big-num">2</span>
                    <div>
                        <strong style={{ "fontFamily": "var(--font-serif)", "fontSize": "19px", "color": "var(--color-auth-ink)", "display": "block", "marginBottom": "4px" }}>Xác minh doanh nghiệp &amp; Kích hoạt OTP</strong>
                        <span style={{ "fontSize": "13.5px", "color": "var(--color-auth-green)" }}>Admin kiểm tra thông tin và kích hoạt gửi mã OTP qua Gmail để bạn tự đặt mật khẩu.</span>
                    </div>
                </div>
                <div className="step-3-item">
                    <span className="step-big-num">3</span>
                    <div>
                        <strong style={{ "fontFamily": "var(--font-serif)", "fontSize": "19px", "color": "var(--color-auth-ink)", "display": "block", "marginBottom": "4px" }}>Lập Báo giá &amp; Mua hàng dễ dàng</strong>
                        <span style={{ "fontSize": "13.5px", "color": "var(--color-auth-green)" }}>Tận hưởng quy trình mua hàng tập trung, cộng dồn 3 tầng ưu đãi và theo dõi tuyến giao Vietmap.</span>
                    </div>
                </div>
            </div>
        </div></section>
    );
}

