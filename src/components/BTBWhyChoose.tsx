import { Link } from 'react-router-dom';
import { useLandingAudience } from '@/hooks/useLandingAudience';

const advantages = [
    { number: '01', title: 'Nhiều nhóm thực phẩm, một điểm tìm kiếm', description: 'Danh mục tập trung cho nguyên liệu tươi, thực phẩm khô, đồ chế biến và mặt hàng thiết yếu. Dễ tìm, dễ so sánh hơn.' },
    { number: '02', title: 'Giá theo lượng mua của từng sản phẩm', description: 'Mỗi sản phẩm có thể có bậc giá theo số lượng. Không gộp toàn đơn để tính bậc chiết khấu của một mặt hàng.' },
    { number: '03', title: 'Báo giá và thông tin đơn rõ ràng', description: 'Quy trình hướng tới kiểm tra mặt hàng, số lượng, giá, tồn kho và lưu lại thông tin đã xác nhận trước khi đặt hàng.' },
    { number: '04', title: 'Phù hợp các quy mô mua sắm', description: 'Doanh nghiệp, hợp tác xã, cửa hàng, hộ kinh doanh và gia đình có cách tìm kiếm, quy cách và tần suất mua khác nhau.' },
    { number: '05', title: 'Hành trình sử dụng dễ theo dõi', description: 'Giao diện tổ chức theo từng bước: khám phá, lựa chọn, lập yêu cầu, theo dõi và xem lại lịch sử.' },
    { number: '06', title: 'Hồ sơ cá nhân là trung tâm', description: 'Mục tiêu là quản lý thông tin, địa chỉ, báo giá và đơn hàng trong một tài khoản thay vì tìm lại nhiều nơi.' },
];

export default function BTBWhyChoose() {
    const { audience } = useLandingAudience();
    return (
        <>
            <section className="btb-info__section" aria-labelledby="btb-why-title">
                <div className="container">
                    <span className="btb-info-eyebrow">LÝ DO CHỌN BITE TO BUSINESS</span>
                    <h2 id="btb-why-title">Không chỉ mua thực phẩm. <em>Mà còn quản lý việc mua sắm tốt hơn.</em></h2>
                    <p className="btb-info__lede">BTB được định hướng là nền tảng cung ứng và mua sắm tập trung, hỗ trợ từ người mua cá nhân đến tổ chức có nhu cầu mua hàng thường xuyên.</p>
                    <div className="btb-info__benefits">
                        {advantages.map((advantage) => (
                            <article key={advantage.number} className="btb-info__benefit">
                                <span className="btb-info__benefit-number">{advantage.number}</span>
                                <h3>{advantage.title}</h3><p>{advantage.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            <section className="btb-info__section btb-info__section--mint">
                <div className="container btb-info__split">
                    <div>
                        <span className="btb-info-eyebrow">ĐƯỢC THIẾT KẾ CHO NHU CẦU CỦA BẠN</span>
                        <h2>{audience === 'business' ? 'Mua hàng theo quy trình của đơn vị.' : 'Tìm thực phẩm theo nhịp sống gia đình.'}</h2>
                        <p>{audience === 'business'
                            ? 'Ưu tiên quy cách, số lượng, báo giá, địa chỉ nhận hàng và khả năng đối soát thông tin mua sắm.'
                            : 'Ưu tiên tìm lại mặt hàng quen thuộc, xem thông tin rõ ràng và quản lý nhu cầu mua thường ngày.'}</p>
                        <Link className="btb-info__text-link" to="/landing/model">Xem mô hình BTB <img src="/images/ui/arrow-right.svg" alt="" /></Link>
                    </div>
                    <div className="btb-info__placeholder" role="img" aria-label="Khung chờ hình minh họa cách sử dụng BTB">
                        <img src="/images/ui/image-placeholder.svg" alt="" /><span>Vị trí hình minh họa</span>
                    </div>
                </div>
            </section>
            <section className="btb-info__section btb-info__notice">
                <div className="container"><strong>Lưu ý giai đoạn phát triển UI:</strong> Các bước giao vận, xét duyệt, cá nhân hóa theo lịch sử và dữ liệu tồn kho được mô tả theo định hướng sản phẩm; chưa được xác nhận là tính năng Backend đang hoạt động.</div>
            </section>
        </>
    );
}