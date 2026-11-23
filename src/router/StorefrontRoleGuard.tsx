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

    // Wait for cookie session restoration to avoid briefly showing the storefront.
    if (restoring) {
        return (
            <div role="status" className="grid min-h-[60vh] place-items-center text-sm text-store-muted">
                Đang khôi phục phiên đăng nhập…
            </div>
        );
    }

    if (session?.user.role === AUTH_ROLES.ECOMMERCE_EXECUTIVE) {
        return <Navigate to={ROUTES.ECOMMERCE_DASHBOARD} replace />;
    }

    return <Outlet />;
}
