import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { UserRole } from '../../features/auth/types/auth.types'
import { useAuthStore } from '../../stores/authStore'
import { getRoleHome, ROUTES } from './routes'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

// Guard chỉ điều khiển giao diện. BE vẫn kiểm tra JWT và role cho mọi API được bảo vệ.
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const session = useAuthStore((state) => state.session)

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  if (!allowedRoles.includes(session.user.role)) {
    return <Navigate to={getRoleHome(session.user.role)} replace />
  }

  return <Outlet />
}
