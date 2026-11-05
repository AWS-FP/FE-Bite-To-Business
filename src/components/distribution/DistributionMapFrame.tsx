
import {
    Layers3,
    Map,
    MapPin,
    Maximize2,
} from 'lucide-react';

import type { DistributionCity } from './distributionData';

type DistributionMapFrameProps = {
    city: DistributionCity;
};

export default function DistributionMapFrame({
    city,
}: DistributionMapFrameProps) {
    return (
        <section
            className="btb-dist__map-card"
            id="btb-distribution-map"
            aria-labelledby="btb-distribution-map-title"
        >
            <div className="btb-dist__map-top">
                <div className="btb-dist__map-top-title">
                    <span className="btb-dist__map-icon">
                        <MapPin size={19} aria-hidden="true" />
                    </span>

                    <div>
                        <span className="btb-dist__map-overline">
                            BẢN ĐỒ PHÂN PHỐI · {city.index}/02
                        </span>

                        <h2 id="btb-distribution-map-title">
                            {city.name}
                        </h2>
                    </div>
                </div>

                <span className="btb-dist__map-state">
                    <span className="btb-dist__state-dot" />
                    KHUNG BẢN ĐỒ DEMO
                </span>
            </div>

            <div
                key={city.id}
                className="btb-dist__map-surface"
                role="img"
                aria-label={`Vùng chờ tích hợp bản đồ tại ${city.name}; chưa hiển thị dữ liệu phân phối thực tế.`}
            >
                <div
                    className="btb-dist__map-corner btb-dist__map-corner--tl"
                    aria-hidden="true"
                />
                <div
                    className="btb-dist__map-corner btb-dist__map-corner--tr"
                    aria-hidden="true"
                />
                <div
                    className="btb-dist__map-corner btb-dist__map-corner--bl"
                    aria-hidden="true"
                />
                <div
                    className="btb-dist__map-corner btb-dist__map-corner--br"
                    aria-hidden="true"
                />

                <div className="btb-dist__map-placeholder">
                    <span className="btb-dist__map-placeholder-icon">
                        <Map
                            size={45}
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                    </span>

                    <span className="btb-dist__placeholder-tag">
                        KHÔNG GIAN BẢN ĐỒ
                    </span>

                    <h3>{city.name}</h3>

                    <p>
                        Khung hiển thị bản đồ và các điểm phân phối
                        của BTB khi được tích hợp.
                    </p>
                </div>

                <div
                    className="btb-dist__map-watermark"
                    aria-hidden="true"
                >
                    BTB <span>/</span> MAP
                </div>

                <Maximize2
                    className="btb-dist__map-decoration"
                    size={19}
                    aria-hidden="true"
                />
            </div>

            <div className="btb-dist__map-bottom">
                <div>
                    <Layers3 size={17} aria-hidden="true" />
                    Chưa có dữ liệu kho, địa điểm hoặc ranh giới
                    phục vụ thực tế.
                </div>

                <strong>
                    {city.areaLabel.toUpperCase()} · {city.index}/02
                </strong>
            </div>
        </section>
    );
}
