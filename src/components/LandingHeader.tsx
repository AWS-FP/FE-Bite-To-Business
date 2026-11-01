

import LanguageSwitcher from './LanguageSwitcher';

interface LandingHeaderProps {
    quoteCount: number;
    showToast: (message: string) => void;
}

export default function LandingHeader({
                                          quoteCount,
                                          showToast,
                                      }: LandingHeaderProps) {
    return (
        <header className="navbar">
            <div className="container navbar-inner">

                {/* Logo */}
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

                {/* Navigation */}
                <ul className="nav-links">
                    <li>
                        <a href="#categories">
                            Mua hàng ngay
                        </a>
                    </li>

                    <li>
                        <a href="#why-b2b">
                            Tại sao chọn Bite to Business?
                        </a>
                    </li>

                    <li>
                        <a href="#segments">
                            Mô hình F&amp;B
                        </a>
                    </li>
                </ul>

                {/* Actions */}
                <div className="nav-right">

                    <LanguageSwitcher />

                    <button
                        type="button"
                        className="quote-pill-btn"
                        id="btnOpenQuoteToast"
                        onClick={() =>
                            showToast(
                                `Bạn có ${quoteCount} mặt hàng trong báo giá nháp (minh họa).`
                            )
                        }
                    >
                        Báo giá (
                        <span id="quoteBadgeCount">
                            {quoteCount}
                        </span>
                        )
                    </button>

                    <a
                        href="#onboarding-cta"
                        className="btn btn-primary px-5 py-[9px] text-sm"
                    >
                        Đăng ký
                    </a>

                </div>
            </div>
        </header>
    );
}
