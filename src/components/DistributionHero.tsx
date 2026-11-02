
import { ChevronRight, MapPin, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DistributionHero() {
    return (
        <header className="btb-dist__intro">
            <nav
                className="btb-dist__breadcrumb"
                aria-label="Đường dẫn trang"
            >
                <Link to="/">Trang chủ</Link>

                <ChevronRight size={15} aria-hidden="true" />

                <Link to="/landing">Về BTB</Link>

                <ChevronRight size={15} aria-hidden="true" />

                <span aria-current="page">
                    Hệ thống phân phối
                </span>
            </nav>

            <div className="btb-dist__intro-row">
                <div className="btb-dist__intro-copy">
                    <p className="btb-dist__eyebrow">
                        <Network size={15} aria-hidden="true" />
                        MẠNG LƯỚI PHÂN PHỐI · BITE TO BUSINESS
                    </p>

                    <h1>
                        Hệ thống phân phối <em>BTB.</em>
                    </h1>

                    <p className="btb-dist__description">
                        Khám phá khu vực phân phối tại TP. Hồ Chí Minh
                        và Hà Nội. Chọn thành phố để xem khung bản đồ
                        tương ứng; địa điểm thực tế sẽ được cập nhật
                        khi có dữ liệu.
                    </p>
                </div>

                <div
                    className="btb-dist__count"
                    aria-label="Hai thành phố"
                >
                    <span className="btb-dist__count-num">
                        02
                    </span>

                    <div>
                        <strong>THÀNH PHỐ</strong>

                        <span>
                            <MapPin size={15} aria-hidden="true" />
                            TP.HCM · Hà Nội
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
