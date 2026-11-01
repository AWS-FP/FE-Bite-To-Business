/* Generated from the supplied HTML layout. Edit this section independently. */
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/admin/authStore';

export default function LandingHeader({ quoteCount, showToast }: { quoteCount: number; showToast: (message: string) => void }) {
    const { i18n: currentI18n } = useTranslation();
    const language = currentI18n.resolvedLanguage ?? currentI18n.language;
    const customer = useAuthStore((s) => s.session?.user.role === 'CUSTOMER');
    return (
        <header className="navbar"><div className="container navbar-inner">
            <Link to="/landing" className="brand-logo" title="Bite to Business — Landing Page">
                <img src="/images/storefront/brand-logo.png" alt="Logo BTB Bite to Business" className="brand-logo-img" />
                <div className="brand-text-wrap">
                    <span className="brand-name">Bite to Business</span>
                    <span className="brand-tagline">THỰC PHẨM &amp; ĐỒ CHẾ BIẾN SẴN</span>
                </div>
            </Link>
            <ul className="nav-links">
                <li>
                    <Link to="/landing">Trang giới thiệu</Link>
                </li>
                <li>
                    <Link to="/landing/why-btb">Vì sao chọn BTB?</Link>
                </li>
                <li>
                    <Link to="/landing/model">Mô hình BTB</Link>
                </li>
            </ul>
            <div className="nav-right">
                <div className="lang-pill">
                    <button type="button" className={language === "vi" ? "active" : ""} id="langVi" onClick={() => void i18n.changeLanguage("vi")}>VN</button>
                    <button type="button" id="langEn" className={language === "en" ? "active" : ""} onClick={() => void i18n.changeLanguage("en")}>EN</button>
                </div>
                {quoteCount > 0 ? (
                    <button type="button" className="quote-pill-btn" id="btnOpenQuoteToast" onClick={() => showToast(`Bạn có ${quoteCount} mặt hàng trong báo giá nháp (minh họa).`)}>
                        Báo giá (<span id="quoteBadgeCount">{quoteCount}</span>)
                    </button>
                ) : (
                    <Link to="/landing" className="quote-pill-btn">Khám phá sản phẩm</Link>
                )}
                <Link to={customer ? "/profile" : "/register"} className="btn btn-primary" style={{ padding: "9px 20px", fontSize: "14px" }}>{customer ? "Trang cá nhân" : "Đăng ký"}</Link>
            </div>
        </div></header>
    );
}