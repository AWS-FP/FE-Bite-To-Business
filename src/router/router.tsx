import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AUTH_ROLES } from '@/constants/roles';
import LoginPage from '@/pages/admin/LoginPage';
import RegisterPage from '@/pages/admin/RegisterPage';
import ActivationPage from '@/pages/admin/ActivationPage';
import HomePage from '@/pages/HomePage';
import LogisticsLayout from '@/layouts/logistic/LogisticsLayout';
import InventoryPage from '@/pages/logistic/InventoryPage';
import ReceivePage from '@/pages/logistic/ReceivePage';
import PackingPage from '@/pages/logistic/PackingPage';
import ProductRequestsPage from '@/pages/logistic/ProductRequestsPage';
import RegistrationsPage from '@/pages/admin/RegistrationsPage';
import RegistrationDetailPage from '@/pages/admin/RegistrationDetailPage';
import AdminLayout from '@/layouts/admin/AdminLayout';
import PendingPage from '@/components/PendingPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routes';

// Local-only preview. Add VITE_LOGISTICS_PREVIEW=true to .env.local
// to make / open the Logistics dashboard during npm run dev.
// .env.local is not committed, so this won't change the site's Home after merge.
const logisticsPreview = import.meta.env.DEV;

const logisticsWorkspaceRoute: RouteObject = {
    path: ROUTES.LOGISTICS,
    element: <LogisticsLayout />,
    children: [
        { index: true, element: <Navigate to={ROUTES.LOGISTICS_INVENTORY} replace /> },
        { path: ROUTES.LOGISTICS_INVENTORY, Component: InventoryPage },
        { path: ROUTES.LOGISTICS_RECEIVE, Component: ReceivePage },
        { path: ROUTES.LOGISTICS_PACKING, Component: PackingPage },
        { path: ROUTES.LOGISTICS_PRODUCT_REQUESTS, Component: ProductRequestsPage },
    ],
};

export const router = createBrowserRouter([
    { path: ROUTES.LOGIN, Component: LoginPage },
    { path: ROUTES.REGISTER, Component: RegisterPage },
    { path: ROUTES.VERIFY_OTP, Component: ActivationPage },
    { path: ROUTES.SET_PASSWORD, Component: ActivationPage },
    { path: ROUTES.FORGOT_PASSWORD, Component: PendingPage },
    {
        path: ROUTES.HOME,
        element: logisticsPreview
            ? <Navigate to={ROUTES.LOGISTICS_INVENTORY} replace />
            : <HomePage />,
    },
    { path: ROUTES.CATALOG, Component: PendingPage },
    { path: ROUTES.PRODUCT_DETAIL, Component: PendingPage },
    { path: ROUTES.QUOTES, Component: PendingPage },
    // Logistics is accessible without login only in an explicitly enabled local preview.
    ...(logisticsPreview ? [logisticsWorkspaceRoute] : []),
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
    // In production (or normal dev mode), keep the Logistics role guard.
    ...(!logisticsPreview
        ? [{
            element: <ProtectedRoute allowedRoles={[AUTH_ROLES.LOGISTICS_STAFF]} />,
            children: [logisticsWorkspaceRoute],
        }]
        : []),
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
