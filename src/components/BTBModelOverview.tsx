import { useLandingAudience } from '@/hooks/useLandingAudience';

const steps = [
    { number: '01', title: 'Khám phá danh mục', text: 'Người mua duyệt mặt hàng, thương hiệu, đơn vị tính và quy cách phù hợp.' },
    { number: '02', title: 'Chọn số lượng và mức giá', text: 'Áp dụng bậc giá theo số lượng cho từng sản phẩm, không tính theo tổng số lượng toàn đơn.' },
    { number: '03', title: 'Lập yêu cầu / báo giá', text: 'Danh sách hàng và yêu cầu mua được tập hợp để có thể kiểm tra và xử lý.' },
    { number: '04', title: 'Kiểm tra và xác nhận', text: 'Theo thiết kế nghiệp vụ B2B: kiểm tra thông tin, giá, tồn kho và điều kiện trước khi xác nhận.' },
    { number: '05', title: 'Đặt hàng và giao nhận', text: 'Trạng thái đơn và giao hàng là phần dự kiến kết nối khi tích hợp Backend.' },
    { number: '06', title: 'Quản lý tại tài khoản', text: 'Một nơi để xem lại thông tin tài khoản, địa chỉ và lịch sử mua khi Backend hỗ trợ.' },
];

export default function BTBModelOverview() {
    const { audience } = useLandingAudience();
    return (
        <>
            <section className="btb-info__section" aria-labelledby="btb-model-title">
                <div className="container">
                    <span className="btb-info-eyebrow">HỆ SINH THÁI BTB</span>
                    <h2 id="btb-model-title">Mô hình BTB <em>hoạt động như thế nào?</em></h2>
                    <p className="btb-info__lede">Đây là mô hình vận hành của nền tảng Bite to Business: kết nối nguồn cung, danh mục sản phẩm, quy trình đặt mua và trải nghiệm người dùng. <strong>Không phải “mô hình F&B”.</strong></p>
                    <div className="btb-info__actor-grid">
                        <article><span className="btb-info__actor-mark">A</span><h3>Đơn vị cung ứng</h3><p>Thông tin sản phẩm, quy cách, giá và dữ liệu tồn kho theo phạm vi hệ thống.</p></article>
                        <article><span className="btb-info__actor-mark">B</span><h3>Nền tảng BTB</h3><p>Tổ chức catalog, lựa chọn hàng, báo giá và quy trình xử lý đơn.</p></article>
                        <article><span className="btb-info__actor-mark">C</span><h3>Người mua</h3><p>Doanh nghiệp/HTX, hộ kinh doanh và cá nhân/hộ gia đình.</p></article>
                    </div>
                    <div className="btb-info__flow">
                        {steps.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}
                    </div>
                </div>
            </section>
            <section className="btb-info__section btb-info__section--mint">
                <div className="container btb-info__split">
                    <div>
                        <span className="btb-info-eyebrow">CÁCH SỬ DỤNG THEO NHU CẦU</span>
                        <h2>{audience === 'business' ? 'Quy trình dành cho doanh nghiệp.' : 'Trải nghiệm dành cho cá nhân.'}</h2>
                        <p>{audience === 'business'
                            ? 'Luồng giới thiệu nhấn mạnh báo giá, giá theo số lượng từng mặt hàng, địa chỉ giao và hồ sơ mua sắm của tổ chức.'
                            : 'Luồng giới thiệu nhấn mạnh tìm kiếm sản phẩm, lựa chọn quy cách, ghi nhớ nhu cầu và truy cập hồ sơ cá nhân.'}</p>
                        <p className="btb-info__micro">Lựa chọn giao diện không tự thay đổi quyền tài khoản, chính sách giá hoặc điều kiện đăng ký.</p>
                    </div>
                    <div className="btb-info__placeholder" role="img" aria-label="Khung chờ sơ đồ nguồn cung và người mua">
                        <img src="/images/ui/image-placeholder.svg" alt="" /><span>Khung sơ đồ mô hình BTB</span>
                    </div>
                </div>
            </section>
        </>
    );
}