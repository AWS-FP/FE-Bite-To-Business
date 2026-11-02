import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/admin/authStore';
import { getRoleHome } from '@/router/routes';
import { useLandingAudience } from '@/hooks/useLandingAudience';
import type { LandingAudience } from '@/hooks/useLandingAudience';

const options: { id: LandingAudience; label: string; sub: string }[] = [
  { id: 'business', label: 'Doanh nghiệp / HTX', sub: 'Đặt số lượng lớn, báo giá, chứng từ' },
  { id: 'personal', label: 'Cá nhân / Hộ gia đình', sub: 'Tìm thực phẩm, quản lý nhu cầu thường ngày' },
];

export default function LandingPersonalization() {
  const { audience, setAudience } = useLandingAudience();
  const session = useAuthStore((s) => s.session);
  const customer = session?.user.role === 'CUSTOMER';
  return (
    <section className="btb-personal" aria-labelledby="btb-personal-title">
      <div className="container btb-personal__inner">
        <div className="btb-personal__intro">
          <span className="btb-info-eyebrow">TRẢI NGHIỆM DÀNH CHO BẠN</span>
          <h2 id="btb-personal-title">Một nền tảng, <em>nhiều cách sử dụng.</em></h2>
          <p>Chọn nhu cầu để nội dung giới thiệu phù hợp hơn. Đây là tùy chọn giao diện, không thay đổi loại tài khoản đã đăng ký.</p>
        </div>
        <div className="btb-personal__controls">
          <div className="btb-personal__options" role="group" aria-label="Nhu cầu sử dụng">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`btb-personal__option ${audience === option.id ? 'is-active' : ''}`}
                onClick={() => setAudience(option.id)}
                aria-pressed={audience === option.id}
              >
                <span>{option.label}</span>
                <small>{option.sub}</small>
              </button>
            ))}
          </div>
          <div className="btb-personal__entry">
            <span>{customer ? 'Bạn đã đăng nhập. Xem thông tin cá nhân và đơn hàng trong tài khoản.' : 'Bạn có thể xem các trang giới thiệu mà không cần đăng nhập.'}</span>
            <Link to={customer ? '/profile' : session ? getRoleHome(session.user.role) : '/register'}>
              {customer ? 'Mở trang cá nhân' : session ? 'Về trang làm việc' : 'Tạo tài khoản'}
              <img src="/images/ui/arrow-up-right.svg" alt="" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}