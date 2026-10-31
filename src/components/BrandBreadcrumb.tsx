import { Link } from 'react-router-dom';
import type { Brand } from './brandData';

interface Props {
    brand: Brand;
}

/** Breadcrumb công khai. Không yêu cầu đăng nhập hoặc API. */
export default function BrandBreadcrumb({ brand }: Props) {
    return (
        <nav className="btb-brand-breadcrumb" aria-label="Đường dẫn điều hướng">
            <span className="btb-brand-breadcrumb__label">BẢN ĐỒ GIAN HÀNG</span>
            <ol className="btb-brand-breadcrumb__trail">
                <li>
                    <Link to="/" aria-label="Trang chủ">
                        <img src="/images/ui/brand/home.svg" alt="" aria-hidden="true" />
                        <span>Trang chủ</span>
                    </Link>
                </li>
                <li className="btb-brand-breadcrumb__connector" aria-hidden="true">
                    <img src="/images/ui/brand/chevron-right.svg" alt="" />
                </li>
                <li><Link to="/brands">Gian hàng thương hiệu</Link></li>
                <li className="btb-brand-breadcrumb__connector" aria-hidden="true">
                    <img src="/images/ui/brand/chevron-right.svg" alt="" />
                </li>
                <li>
                    <span className="btb-brand-breadcrumb__current" aria-current="page">
                        <span className="btb-brand-breadcrumb__dot" aria-hidden="true" />
                        {brand.name}
                    </span>
                </li>
            </ol>
        </nav>
    );
}
