import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AUTH_ROLES } from '@/constants/roles';
import LoginPage from '@/pages/admin/LoginPage';
import RegisterPage from '@/pages/admin/RegisterPage';
import ActivationPage from '@/pages/admin/ActivationPage';
import HomePage from '@/pages/HomePage';
import RegistrationsPage from '@/pages/admin/RegistrationsPage';
import RegistrationDetailPage from '@/pages/admin/RegistrationDetailPage';
import AdminLayout from '@/layouts/admin/AdminLayout';
import PendingPage from '@/components/PendingPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routes';
import LandingPage from '@/pages/LandingPage';
import WhyBTBPage from '@/pages/WhyBTBPage';
import BTBModelPage from '@/pages/BTBModelPage';

export const router = createBrowserRouter([
    { path: ROUTES.LOGIN, Component: LoginPage },
    { path: ROUTES.REGISTER, Component: RegisterPage },
    { path: ROUTES.VERIFY_OTP, Component: ActivationPage },
    { path: ROUTES.SET_PASSWORD, Component: ActivationPage },
    { path: ROUTES.FORGOT_PASSWORD, Component: PendingPage },
    { path: ROUTES.LANDING, Component: LandingPage },
    { path: ROUTES.WHY_BTB, Component: WhyBTBPage },
    { path: ROUTES.BTB_MODEL, Component: BTBModelPage },
    { path: ROUTES.HOME, Component: HomePage },
    { path: ROUTES.CATALOG, Component: PendingPage },
    { path: ROUTES.PRODUCT_DETAIL, Component: PendingPage },
    { path: ROUTES.QUOTES, Component: PendingPage },
    {
        // Chỉ kiểm tra quyền truy cập
        element: <ProtectedRoute allowedRoles={[AUTH_ROLES.CUSTOMER]} />,
        children: [
            { path: ROUTES.QUOTE_DETAIL, Component: PendingPage },
            { path: ROUTES.CHECKOUT, Component: PendingPage },
            { path: ROUTES.ORDERS, Component: PendingPage },
            { path: ROUTES.ORDER_DETAIL, Component: PendingPage },
            { path: ROUTES.FAVORITES, Component: PendingPage },
            { path: ROUTES.PROFILE, Component: PendingPage },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={[AUTH_ROLES.ADMIN]} />,
        children: [
            {
                path: ROUTES.ADMIN,
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to={ROUTES.ADMIN_REGISTRATIONS} replace />,
                    },
                    {
                        path: ROUTES.ADMIN_REGISTRATIONS,
                        Component: RegistrationsPage,
                        children: [{ path: ':requestId', Component: RegistrationDetailPage }],
                    },
                    { path: ROUTES.ADMIN_STAFF, Component: PendingPage },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={[AUTH_ROLES.ECOMMERCE_EXECUTIVE]} />,
        children: [
            {
                path: ROUTES.ECOMMERCE,
                children: [
                    {
                        index: true,
                        element: <Navigate to={ROUTES.ECOMMERCE_PRODUCTS} replace />,
                    },
                    { path: ROUTES.ECOMMERCE_PRODUCTS, Component: PendingPage },
                    { path: ROUTES.ECOMMERCE_PROMOTIONS, Component: PendingPage },
                    { path: ROUTES.ECOMMERCE_COUPONS, Component: PendingPage },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={[AUTH_ROLES.LOGISTICS_STAFF]} />,
        children: [
            {
                path: ROUTES.LOGISTICS,
                children: [
                    {
                        index: true,
                        element: <Navigate to={ROUTES.LOGISTICS_INVENTORY} replace />,
                    },
                    { path: ROUTES.LOGISTICS_INVENTORY, Component: PendingPage },
                    { path: ROUTES.LOGISTICS_PRODUCT_REQUESTS, Component: PendingPage },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={[AUTH_ROLES.DELIVERY_STAFF]} />,
        children: [
            {
                path: ROUTES.DELIVERY,
                children: [
                    {
                        index: true,
                        element: <Navigate to={ROUTES.DELIVERY_TRIPS} replace />,
                    },
                    { path: ROUTES.DELIVERY_TRIPS, Component: PendingPage },
                    { path: ROUTES.DELIVERY_TRIP_DETAIL, Component: PendingPage },
                ],
            },
        ],
    },
    // Route lạ về trang chủ
    { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
]);
