
/* Generated from the supplied HTML layout. Edit this section independently. */
import LanguageSwitcher from './LanguageSwitcher';

export default function LandingHeader({ quoteCount, showToast }: { quoteCount: number; showToast: (message: string) => void }) {
    return (
        <header className="navbar"><div className="container navbar-inner">

            <a
                href="#top-hero"
                className="brand-logo"
                aria-label="Bite to Business"
            >
                <img
                    src="/images/storefront/brand-logo.png"
                    alt="BTB"
                    className="brand-logo-img"
                />

                <div className="brand-text-wrap">
                    <span className="brand-name">
                        <span>Bite to </span>
                        <span>Business</span>
                    </span>
                </div>
            </a>

            <ul className="nav-links">
                <li>
                    <a href="#categories">Mua hàng ngay</a>
                </li>
                <li>
                    <a href="#why-b2b">Tại sao chọn Bite to Business?</a>
                </li>
                <li>
                    <a href="#segments">Mô hình F&amp;B</a>
                </li>
            </ul>
            <div className="nav-right">
                <LanguageSwitcher/>
                <button type="button" className="quote-pill-btn" id="btnOpenQuoteToast" onClick={() => showToast(`Bạn có ${quoteCount} mặt hàng trong báo giá nháp (minh họa).`)}>

                    Báo giá (
                    <span id="quoteBadgeCount">{quoteCount}</span>
                    )

                </button>
                <a href="#onboarding-cta" className="btn btn-primary" style={{ "padding": "9px 20px", "fontSize": "14px" }}>Đăng ký</a>
            </div>
        </div></header>
    );
}
