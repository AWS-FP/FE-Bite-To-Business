import { Navigate, Outlet } from 'react-router-dom';
import { AUTH_ROLES } from '@/constants/roles';
import { useAuthStore } from '@/store/admin/authStore';
import { ROUTES } from './routes';

/**
 * Keep E-commerce staff inside their workspace, including on direct URL access.
 * Customer and unauthenticated visitors can still use the storefront normally.
 */
export default function StorefrontRoleGuard() {
    const session = useAuthStore((state) => state.session);
    const restoring = useAuthStore((state) => state.restoring);

    // Khách và guest thấy storefront ngay, không phải chờ khôi phục phiên.
    // Nhân viên E-commerce được chuyển về workspace ngay sau khi phiên khôi phục xong.
    if (!restoring && session?.user.role === AUTH_ROLES.ECOMMERCE_EXECUTIVE) {
        return <Navigate to={ROUTES.ECOMMERCE_DASHBOARD} replace />;
    }

    return <Outlet />;
}
