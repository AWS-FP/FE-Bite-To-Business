import { ChevronRight, MapPin, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DistributionHero() {
    return (
        <header className="mb-[34px]">
            <nav
                className="mb-[30px] flex flex-wrap items-center gap-2 font-subtext text-[13px] font-medium leading-[1.6] text-store-muted [&_a]:text-store-ink [&_a]:no-underline [&_a:hover]:text-store-green [&_a:hover]:underline"
                aria-label="Đường dẫn trang"
            >
                <Link to="/">Trang chủ</Link>

                <ChevronRight size={15} aria-hidden="true" />

                <Link to="/landing">Về BTB</Link>

                <ChevronRight size={15} aria-hidden="true" />

                <span
                    className="inline-block rounded-full bg-store-pink px-3 py-[5px] font-extrabold text-store-ink"
                    aria-current="page"
                >
                    Hệ thống phân phối
                </span>
            </nav>

            <div className="flex items-end justify-between gap-8">
                <div className="max-w-[810px]">
                    <p className="mb-3 flex items-center gap-2 font-label text-xs font-bold leading-[1.4] tracking-[0.11em] text-store-green">
                        <Network size={15} aria-hidden="true" />
                        MẠNG LƯỚI PHÂN PHỐI · BITE TO BUSINESS
                    </p>

                    <h1 className="mb-3.5 font-heading text-[clamp(36px,4.2vw,62px)] font-normal leading-[1.14] tracking-[-0.035em] text-store-ink">
                        Hệ thống phân phối <em className="font-normal text-store-coral">BTB.</em>
                    </h1>

                    <p className="m-0 max-w-[710px] text-sm leading-[1.85] text-store-muted">
                        Khám phá khu vực phân phối tại TP. Hồ Chí Minh và Hà Nội. Chọn thành phố để
                        xem khung bản đồ tương ứng; địa điểm thực tế sẽ được cập nhật khi có dữ
                        liệu.
                    </p>
                </div>

                <div
                    className="mb-1.5 flex shrink-0 rotate-2 items-center gap-4 rounded-[14px] border-2 border-solid border-store-ink bg-store-yellow px-5 py-3.5 text-store-ink shadow-[5px_5px_0_var(--color-store-ink)]"
                    aria-label="Hai thành phố"
                >
                    <span className="font-display text-[52px] font-normal leading-none">02</span>

                    <div className="flex flex-col gap-[5px]">
                        <strong className="font-label text-sm font-bold leading-[1.3]">
                            THÀNH PHỐ
                        </strong>

                        <span className="flex items-center gap-1 text-[11px] font-semibold">
                            <MapPin size={15} aria-hidden="true" />
                            TP.HCM · Hà Nội
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
