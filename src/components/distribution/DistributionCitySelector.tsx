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
        <section className="mb-7 block w-full" aria-labelledby="btb-dist-region-title">
            <div className="mb-[18px] flex items-center justify-between gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-[5px] [&_p]:m-0 [&_p]:font-body [&_p]:text-[13px] [&_p]:text-store-muted">
                <div>
                    <span
                        className="font-label text-sm font-bold tracking-[0.06em] text-store-green"
                        id="btb-dist-region-title"
                    >
                        CHỌN KHU VỰC
                    </span>

                    <p>Khám phá hệ thống phân phối theo thành phố</p>
                </div>

                <span className="shrink-0 rounded-full border border-solid border-store-ink px-3 py-2 font-label text-xs font-semibold text-store-ink">
                    02 KHU VỰC
                </span>
            </div>

            <div
                className="grid w-full grid-cols-2 gap-[18px]"
                role="group"
                aria-label="Chọn khu vực phân phối"
            >
                {DISTRIBUTION_CITIES.map((city) => {
                    const active = city.id === selectedId;

                    return (
                        <button
                            key={city.id}
                            type="button"
                            className={`flex min-h-[148px] w-full min-w-0 cursor-pointer flex-col items-stretch justify-between rounded-2xl border-2 border-solid border-store-ink px-[22px] py-[18px] text-left text-store-ink shadow-[5px_5px_0_var(--color-store-ink)] transition-transform hover:-translate-y-[3px] focus-visible:outline-[3px] focus-visible:outline-offset-[5px] focus-visible:outline-store-coral ${
                                active ? 'bg-store-yellow' : 'bg-[#fffcf7]'
                            }`}
                            onClick={() => onSelect(city.id)}
                            aria-pressed={active}
                        >
                            <div className="flex w-full items-center justify-between gap-3">
                                <span className="font-label text-xs font-bold tracking-[0.07em] text-store-green">
                                    {city.index} / {city.areaLabel.toUpperCase()}
                                </span>

                                {active ? (
                                    <Check size={19} aria-hidden="true" />
                                ) : (
                                    <ArrowUpRight size={19} aria-hidden="true" />
                                )}
                            </div>

                            <div className="my-3.5 mb-2.5 flex w-full items-center gap-3.5 [&_strong]:font-subheading [&_strong]:text-[clamp(16px,1.7vw,21px)] [&_strong]:font-bold [&_strong]:leading-[1.3] [&_strong]:text-store-ink">
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-solid border-store-ink bg-store-cream text-store-ink">
                                    <MapPin size={21} strokeWidth={2} aria-hidden="true" />
                                </span>

                                <strong>{city.name}</strong>
                            </div>

                            <span
                                className={`block font-body text-xs ${active ? 'font-semibold text-store-green' : 'text-store-muted'}`}
                            >
                                {active ? 'Đang xem khu vực này' : 'Chọn để xem bản đồ'}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
