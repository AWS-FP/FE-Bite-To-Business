import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types/admin/auth';
import { useAuthStore } from '@/store/admin/authStore';
import { getRoleHome, ROUTES } from './routes';

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
}

// Guard chỉ điều khiển giao diện. BE vẫn kiểm tra JWT và role cho mọi API đc bảo vệ
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const session = useAuthStore((state) => state.session);
    const restoring = useAuthStore((state) => state.restoring);

    // The session comes back from the refresh cookie after a reload; wait before sending to login.
    if (restoring) {
        return (
            <div role="status" className="grid min-h-[60vh] place-items-center text-sm text-store-muted">
                Đang khôi phục phiên đăng nhập…
            </div>
        );
    }

    if (!session) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    if (!allowedRoles.includes(session.user.role)) {
        return <Navigate to={getRoleHome(session.user.role)} replace />;
    }

    return <Outlet />;
}
