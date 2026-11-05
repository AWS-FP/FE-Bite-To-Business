/* Generated from the supplied HTML layout. Edit this section independently. */
import { useState } from 'react';

export default function LandingBusinessSolution({
    showToast,
}: {
    showToast: (message: string) => void;
}) {
    const [openAccordion, setOpenAccordion] = useState(0);
    return (
        <section className="py-[72px]">
            <div className="mx-auto max-w-[1240px] px-6">
                <div className="rounded-[var(--radius-lg)] border-[3px] border-solid border-store-yellow bg-store-ink px-12 py-14 text-store-cream shadow-[10px_10px_0_var(--color-store-dark)]">
                    <div className="mx-auto mb-10 max-w-[680px] text-center [&_h2]:mb-4 [&_h2]:font-subheading [&_h2]:text-[clamp(28px,3.2vw,40px)] [&_h2]:font-bold [&_h2]:text-store-cream">
                        <h2>
                            Giải pháp giúp
                            <span className="rounded-lg bg-store-yellow px-2.5 font-medium italic text-store-ink">mua sắm thuận tiện</span>
                            cho tổ chức và cá nhân
                        </h2>
                        <p
                            style={{
                                fontSize: '15px',
                                color: 'var(--color-surface-blue)',
                                marginBottom: '22px',
                            }}
                        >
                            Minh họa luồng báo giá, kiểm tra thông tin mặt hàng và tùy chỉnh cách
                            xem theo nhu cầu. Các chức năng nâng cao sẽ hoàn thiện ở giai đoạn tích
                            hợp Backend.
                        </p>
                        <a href="#onboarding-cta" className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-coral text-white">
                            Khám phá giải pháp
                            <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-store-ink text-xs text-store-yellow">
                                <img
                                    src="/images/ui/arrow-right.svg"
                                    className="btb-ui-icon"
                                    alt=""
                                    aria-hidden="true"
                                />
                            </span>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-9">
                        <div className="rounded-[var(--radius-md)] border-[3px] border-solid border-store-ink bg-store-cream p-[22px] text-store-ink shadow-[6px_6px_0_var(--color-store-coral)]">
                            <div className="mb-3.5 flex items-center justify-between border-b-2 border-solid border-store-ink pb-3">
                                <div>
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: 'var(--forest)',
                                        }}
                                    >
                                        DỰ THẢO BÁO GIÁ • QUOTE #QT-2026-089
                                    </div>
                                    <strong
                                        style={{
                                            fontFamily: 'var(--font-subheading)',
                                            fontSize: '18px',
                                        }}
                                    >
                                        Danh sách đặt hàng &amp; Chia điểm giao
                                    </strong>
                                </div>
                                <span
                                    style={{
                                        background: 'var(--yellow-tint)',
                                        color: 'var(--color-warning)',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        padding: '4px 10px',
                                        borderRadius: '99px',
                                    }}
                                >
                                    Revision 1 • Đã duyệt
                                </span>
                            </div>
                            <div className="mb-2.5 flex items-center justify-between rounded-[var(--radius-sm)] border-2 border-solid border-store-ink bg-store-cream px-3.5 py-2.5 text-[13px] shadow-[3px_3px_0_var(--color-store-ink)]">
                                <div>
                                    <strong>Cá Hồi Na Uy Phi Lê Tươi (Khay 1kg)</strong>
                                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                        Ghi chú món: Cắt sẵn phần bụng riêng • Giao Chi nhánh Quận 1
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <strong style={{ color: 'var(--forest)' }}>
                                        20 kg × 622.000đ
                                    </strong>
                                    <div style={{ fontSize: '11px', color: 'var(--coral)' }}>
                                        Đã cộng dồn Volume + Sale
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2.5 flex items-center justify-between rounded-[var(--radius-sm)] border-2 border-solid border-store-ink bg-store-cream px-3.5 py-2.5 text-[13px] shadow-[3px_3px_0_var(--color-store-ink)]">
                                <div>
                                    <strong>Chả Giò Tôm Thịt Chế Biến Sẵn (Gói 1kg)</strong>
                                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                        Ghi chú món: Đóng thùng xốp giữ lạnh • Giao Chi nhánh Quận 7
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <strong style={{ color: 'var(--forest)' }}>
                                        15 gói × 112.000đ
                                    </strong>
                                    <div style={{ fontSize: '11px', color: 'var(--green-ok)' }}>
                                        Kho khả dụng: Đủ 100%
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '14px',
                                    paddingTop: '12px',
                                    borderTop: 'var(--border-subtle)',
                                }}
                            >
                                <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
                                    Mã giảm giá áp dụng:
                                    <code>MDFOOD10</code>
                                    (-10%)
                                </span>
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[2.5px] border-solid border-store-ink px-6 py-3 font-body text-[15px] font-bold no-underline shadow-[4px_4px_0_var(--color-store-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-store-ink)] bg-store-coral text-white"
                                    id="btnMockupConfirmOrder"
                                    style={{ padding: '8px 18px', fontSize: '13px' }}
                                    onClick={() =>
                                        showToast(
                                            'Đây là đơn hàng mẫu trên landing page, chưa có đơn nào được gửi.',
                                        )
                                    }
                                >
                                    Xác nhận Đặt mua
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3" id="featureAccordionList">
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 0 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(0)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(0);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
                                    <span>1. Đặt hàng nhanh &amp; Đặt lại đơn cũ chỉ 1 chạm</span>
                                    <span>
                                        <img
                                            src="/images/ui/chevron-up.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    Tìm kiếm bằng ngôn ngữ tự nhiên qua bong bóng AI, chuyển đổi
                                    linh hoạt giữa dạng thẻ và bảng so sánh, hoặc khởi tạo Quote mới
                                    từ lịch sử đơn hàng tuần trước với giá và tồn kho cập nhật tức
                                    thì.
                                </div>
                            </div>
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 1 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(1)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(1);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
                                    <span>2. Nguồn hàng ổn định, cam kết đủ 100% mới xác nhận</span>
                                    <span>
                                        <img
                                            src="/images/ui/chevron-down.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    Khác với nơi nhận đơn rồi giao thiếu, Bite to Business đối chiếu
                                    trực tiếp tồn khả dụng (Available = On hand − Reserved) và chỉ
                                    xác nhận đơn khi đáp ứng trọn vẹn mọi mặt hàng bạn đặt.
                                </div>
                            </div>
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 2 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(2)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(2);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
                                    <span>
                                        3. Chia nhiều điểm giao &amp; Theo dõi tuyến Vietmap
                                    </span>
                                    <span>
                                        <img
                                            src="/images/ui/chevron-down.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    Một đơn hàng có thể chia thành nhiều nhóm giao hàng (Packages)
                                    tới nhiều địa chỉ khác nhau, kèm bản đồ tuyến đường minh họa và
                                    thời gian dự kiến (ETA) rõ ràng.
                                </div>
                            </div>
                            <div
                                className={'group cursor-pointer rounded-[var(--radius-md)] border-2 border-solid border-store-yellow/45 bg-store-cream/8 px-[22px] py-[18px] transition-colors [&.active]:border-[2.5px] [&.active]:border-store-yellow [&.active]:bg-store-green [&.active]:shadow-[4px_4px_0_var(--color-store-yellow)]' + (openAccordion === 3 ? ' active' : '')}
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenAccordion(3)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setOpenAccordion(3);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between font-heading text-[19px] font-normal text-store-cream">
                                    <span>
                                        4. Giá bậc thang Volume Pricing &amp; Chứng từ minh bạch
                                    </span>
                                    <span>
                                        <img
                                            src="/images/ui/chevron-down.svg"
                                            className="btb-ui-icon"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="mt-2.5 hidden text-sm text-store-cream group-[.active]:block">
                                    Công khai các bậc giá theo số lượng mua, cho phép cộng dồn cùng
                                    chương trình khuyến mãi và mã giảm giá 8 ký tự, lưu trữ Snapshot
                                    đơn hàng phục vụ đối soát và xuất hóa đơn VAT.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
