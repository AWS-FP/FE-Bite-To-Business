
const painPoints = [
    {
        icon: '/icons/landingpainpoints-icon-1.svg',
        label: 'Quá nhiều đầu mối lẻ tẻ',
        title: 'Quá nhiều nhà cung cấp',
        problems: [
            'Đặt thịt cá, rau củ, đồ chế biến sẵn qua nhiều kênh chat rời rạc.',
            'Đơn hàng phân tán làm mất thời gian kiểm soát chênh lệch giá sỉ.',
        ],
    },
    {
        icon: '/icons/landingpainpoints-icon-2.svg',
        label: 'Trễ giờ & giao thiếu món',
        title: 'Khó theo dõi giao nhận',
        problems: [
            'Phải gọi điện xác nhận thủ công từng chuyến hàng mỗi sáng.',
            'Thiếu nguyên liệu hoặc thực phẩm thiết yếu dễ làm gián đoạn kế hoạch sử dụng.',
        ],
    },
    {
        icon: '/icons/landingpainpoints-icon-3.svg',
        label: 'Hóa đơn & báo giá thất lạc',
        title: 'Chứng từ phân tán',
        problems: [
            'Lưu trữ hóa đơn lẻ tẻ dễ thất lạc khi đối soát cuối tháng.',
            'Giá lịch sử bị thay đổi, tốn nhiều công sức đối chiếu kế toán.',
        ],
    },
];

export default function LandingPainPoints() {
    return (
        <section
            id="why-b2b"
            className="py-12 md:py-[72px]"
        >
            <div className="mx-auto max-w-[1240px] px-6">
                {/* Section heading */}
                <div className="mx-auto mb-11 max-w-[720px] text-center">
                    <span className="mb-2.5 inline-block rounded-full border-2 border-store-ink bg-store-yellow px-3.5 py-1 font-label text-[15px] text-store-ink shadow-[3px_3px_0_var(--color-store-ink)]">
                        01 • NHỮNG BẤT TIỆN KHI TÌM VÀ MUA THỰC PHẨM
                    </span>

                    <h2 className="mb-2.5 font-subheading text-[clamp(28px,3.2vw,40px)] leading-[1.22] text-store-cream">
                        Bớt mất công tìm hàng, dễ chọn đúng nhu cầu
                    </h2>

                    <p className="font-heading text-lg text-store-pink">
                        Từ tổ chức thu mua đến gia đình: vì sao việc tập trung
                        sản phẩm và thông tin mua sắm lại hữu ích?
                    </p>
                </div>

                {/* Pain point cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {painPoints.map((item) => (
                        <article
                            key={item.title}
                            className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border-[2.5px] border-store-ink bg-store-cream shadow-[5px_5px_0_var(--color-store-ink)] transition-transform duration-200 hover:-translate-y-[3px]"
                        >
                            {/* Illustration */}
                            <div className="relative flex h-[180px] flex-col items-center justify-center gap-3 border-b-[2.5px] border-store-ink bg-[var(--color-danger-soft)] p-5">
                                <img
                                    src={item.icon}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
                                    loading="lazy"
                                />

                                <span className="relative z-10 rounded-full border-2 border-store-ink bg-store-coral px-3 py-1 text-center text-xs font-bold text-white shadow-[2px_2px_0_var(--color-store-ink)]">
                                    {item.label}
                                </span>
                            </div>

                            {/* Card content */}
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="mb-3.5 font-subheading text-[22px] text-store-ink">
                                    {item.title}
                                </h3>

                                <ul className="flex list-none flex-col gap-3 p-0 text-sm text-store-ink">
                                    {item.problems.map((problem) => (
                                        <li
                                            key={problem}
                                            className="flex items-start gap-2.5"
                                        >
                                            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--color-danger)] bg-[var(--color-danger-soft)]">
                                                <img
                                                    src="/icons/x.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                    className="h-3 w-3 object-contain"
                                                />
                                            </span>

                                            <span className="leading-relaxed">
                                                {problem}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Call to action */}
                <div className="text-center">
                    <a
                        href="#catalog-preview"
                        className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-store-ink bg-store-coral px-6 py-3 font-body text-[15px] font-bold text-white no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)]"
                    >
                        Nhập hàng ngay

                        <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-store-ink">
                            <img
                                src="/icons/arrow-right.svg"
                                alt=""
                                aria-hidden="true"
                                className="h-3.5 w-3.5 object-contain brightness-0 invert"
                            />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
