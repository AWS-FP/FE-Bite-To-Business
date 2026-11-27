import { matchPath, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AUTH_ROLES } from '@/constants/roles';
import { useAuthStore } from '@/store/admin/authStore';
import QuietLoader from '@/components/common/QuietLoader';
import { getRoleHome, ROUTES } from './routes';

/** Staff may browse public catalog pages, but checkout remains guest/customer-only. */
export default function StorefrontRoleGuard() {
    const session = useAuthStore((state) => state.session);
    const restoring = useAuthStore((state) => state.restoring);
    const { pathname } = useLocation();
    if (matchPath(ROUTES.QUOTES, pathname)) {
        if (restoring) return <QuietLoader />;
        if (session && session.user.role !== AUTH_ROLES.CUSTOMER) {
            return <Navigate to={getRoleHome(session.user.role)} replace />;
        }
    }
    return <Outlet />;
}
