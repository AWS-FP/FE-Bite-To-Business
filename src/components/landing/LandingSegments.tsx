import BtbImagePlaceholder from './BtbImagePlaceholder';
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useState } from 'react';
import { landingSegments } from './landingSegmentsData';

export default function LandingSegments() {
    const [activeSegment, setActiveSegment] = useState(0);
    const segment = landingSegments[activeSegment];
    const photoBySegment = ['market', 'vegetables', 'kitchen', 'warehouse', 'produce'] as const;
    return (
        <section
            className="py-[72px] border-y-2 border-solid border-store-ink bg-store-cream"
            id="segments"
        >
            <div className="mx-auto max-w-[1240px] px-6">
                <div className="mx-auto mb-11 max-w-[720px] text-center">
                    <span className="mb-2.5 inline-block rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3.5 py-1 font-label text-[15px] font-normal text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]">04 • ĐỐI TƯỢNG PHỤC VỤ</span>
                    <h2 className="mb-2.5 font-subheading text-[clamp(28px,3.2vw,40px)] font-normal leading-[1.22] text-store-ink">
                        Phục vụ đa dạng nhu cầu mua thực phẩm
                    </h2>
                </div>
                <div className="mb-7 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                        type="button"
                        className="inline-flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-[2.5px] border-solid border-store-ink bg-store-yellow text-base font-extrabold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] hover:bg-store-coral hover:text-white"
                        id="btnSegPrev"
                        aria-label="Mô hình trước"
                        onClick={() =>
                            setActiveSegment(
                                (v) => (v + landingSegments.length - 1) % landingSegments.length,
                            )
                        }
                    >
                        <img
                            src="/images/ui/arrow-left.svg"
                            className="btb-ui-icon"
                            alt=""
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        type="button"
                        className={
                            'cursor-pointer rounded-full border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-2.5 font-subheading text-sm font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-colors [&.active]:bg-store-coral [&.active]:font-extrabold [&.active]:text-white [&.active]:shadow-[4px_4px_0_var(--color-store-ink)]' +
                            (activeSegment === 0 ? ' active' : '')
                        }
                        data-seg-idx="0"
                        onClick={() => setActiveSegment(0)}
                    >
                        Doanh nghiệp / HTX
                    </button>
                    <button
                        type="button"
                        className={
                            'cursor-pointer rounded-full border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-2.5 font-subheading text-sm font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-colors [&.active]:bg-store-coral [&.active]:font-extrabold [&.active]:text-white [&.active]:shadow-[4px_4px_0_var(--color-store-ink)]' +
                            (activeSegment === 1 ? ' active' : '')
                        }
                        data-seg-idx="1"
                        onClick={() => setActiveSegment(1)}
                    >
                        Cửa hàng / Hộ kinh doanh
                    </button>
                    <button
                        type="button"
                        className={
                            'cursor-pointer rounded-full border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-2.5 font-subheading text-sm font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-colors [&.active]:bg-store-coral [&.active]:font-extrabold [&.active]:text-white [&.active]:shadow-[4px_4px_0_var(--color-store-ink)]' +
                            (activeSegment === 2 ? ' active' : '')
                        }
                        data-seg-idx="2"
                        onClick={() => setActiveSegment(2)}
                    >
                        Nhà hàng / Bếp ăn
                    </button>
                    <button
                        type="button"
                        className={
                            'cursor-pointer rounded-full border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-2.5 font-subheading text-sm font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-colors [&.active]:bg-store-coral [&.active]:font-extrabold [&.active]:text-white [&.active]:shadow-[4px_4px_0_var(--color-store-ink)]' +
                            (activeSegment === 3 ? ' active' : '')
                        }
                        data-seg-idx="3"
                        onClick={() => setActiveSegment(3)}
                    >
                        Phân phối / Bán lẻ
                    </button>
                    <button
                        type="button"
                        className={
                            'cursor-pointer rounded-full border-[2.5px] border-solid border-store-ink bg-store-cream px-5 py-2.5 font-subheading text-sm font-bold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] transition-colors [&.active]:bg-store-coral [&.active]:font-extrabold [&.active]:text-white [&.active]:shadow-[4px_4px_0_var(--color-store-ink)]' +
                            (activeSegment === 4 ? ' active' : '')
                        }
                        data-seg-idx="4"
                        onClick={() => setActiveSegment(4)}
                    >
                        Cá nhân / Gia đình
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-[2.5px] border-solid border-store-ink bg-store-yellow text-base font-extrabold text-store-ink shadow-[3px_3px_0_var(--color-store-ink)] hover:bg-store-coral hover:text-white"
                        id="btnSegNext"
                        aria-label="Mô hình kế tiếp"
                        onClick={() => setActiveSegment((v) => (v + 1) % landingSegments.length)}
                    >
                        <img
                            src="/images/ui/arrow-right.svg"
                            className="btb-ui-icon"
                            alt=""
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <div className="grid grid-cols-2 items-center gap-8 rounded-[var(--radius-lg)] border-[2.5px] border-solid border-store-ink bg-store-cream p-9 shadow-[5px_5px_0_var(--color-store-ink)]">
                    <div>
                        <h3
                            style={{
                                fontFamily: 'var(--font-subheading)',
                                fontSize: '28px',
                                marginBottom: '10px',
                            }}
                            id="segTitle"
                        >
                            {segment.title}
                        </h3>
                        <p style={{ fontSize: '14.5px', color: 'var(--text-body)' }} id="segDesc">
                            {segment.desc}
                        </p>
                        <ul className="my-[18px] mb-6 flex list-none flex-col gap-3 text-[15px] text-store-ink [&_li]:flex [&_li]:items-center [&_li]:gap-2.5">
                            <li>
                                <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-store-ink bg-[var(--green-soft-bg)] text-xs font-extrabold text-[var(--green-ok)]">
                                    <img
                                        className="btb-ui-icon"
                                        src="/images/ui/check.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </span>
                                <span id="segBullet1">{segment.b1}</span>
                            </li>
                            <li>
                                <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-store-ink bg-[var(--green-soft-bg)] text-xs font-extrabold text-[var(--green-ok)]">
                                    <img
                                        className="btb-ui-icon"
                                        src="/images/ui/check.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </span>
                                <span id="segBullet2">{segment.b2}</span>
                            </li>
                            <li>
                                <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-store-ink bg-[var(--green-soft-bg)] text-xs font-extrabold text-[var(--green-ok)]">
                                    <img
                                        className="btb-ui-icon"
                                        src="/images/ui/check.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </span>
                                <span id="segBullet3">{segment.b3}</span>
                            </li>
                        </ul>
                        <div
                            style={{
                                fontSize: '12.5px',
                                color: 'var(--text-muted)',
                                fontWeight: '600',
                            }}
                        >
                            {segment.audience}
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'relative',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            height: '300px',
                            boxShadow: 'var(--shadow-soft)',
                        }}
                    >
                        <BtbImagePlaceholder label={`Ảnh minh họa: ${segment.title}`} photo={photoBySegment[activeSegment]} />
                    </div>
                </div>
            </div>
        </section>
    );
}
