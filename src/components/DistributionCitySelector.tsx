
import { ArrowUpRight, Check, MapPin } from 'lucide-react';

import { DISTRIBUTION_CITIES } from './distributionData';
import type { DistributionCityId } from './distributionData';

type DistributionCitySelectorProps = {
    selectedId: DistributionCityId;
    onSelect: (id: DistributionCityId) => void;
};

export default function DistributionCitySelector({
    selectedId,
    onSelect,
}: DistributionCitySelectorProps) {
    return (
        <section
            className="btb-dist__selector btb-dist__selector--balanced"
            aria-labelledby="btb-dist-region-title"
        >
            <div className="btb-dist__selector-heading">
                <div>
                    <span
                        className="btb-dist__selector-kicker"
                        id="btb-dist-region-title"
                    >
                        CHỌN KHU VỰC
                    </span>

                    <p>
                        Khám phá hệ thống phân phối theo thành phố
                    </p>
                </div>

                <span className="btb-dist__region-count">
                    02 KHU VỰC
                </span>
            </div>

            <div
                className="btb-dist__selector-buttons"
                role="group"
                aria-label="Chọn khu vực phân phối"
            >
                {DISTRIBUTION_CITIES.map((city) => {
                    const active = city.id === selectedId;

                    return (
                        <button
                            key={city.id}
                            type="button"
                            className={`btb-dist__city ${active ? 'is-active' : ''
                                }`}
                            onClick={() => onSelect(city.id)}
                            aria-pressed={active}
                        >
                            <div className="btb-dist__city-top">
                                <span className="btb-dist__city-region">
                                    {city.index} / {city.areaLabel.toUpperCase()}
                                </span>

                                {active ? (
                                    <Check size={19} aria-hidden="true" />
                                ) : (
                                    <ArrowUpRight
                                        size={19}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            <div className="btb-dist__city-middle">
                                <span className="btb-dist__city-icon">
                                    <MapPin
                                        size={21}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </span>

                                <strong>{city.name}</strong>
                            </div>

                            <span className="btb-dist__city-caption">
                                {active
                                    ? 'Đang xem khu vực này'
                                    : 'Chọn để xem bản đồ'}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
