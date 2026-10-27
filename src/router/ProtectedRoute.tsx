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

    if (!session) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    if (!allowedRoles.includes(session.user.role)) {
        return <Navigate to={getRoleHome(session.user.role)} replace />;
    }

    return <Outlet />;
}
