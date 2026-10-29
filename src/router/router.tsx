
import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { AUTH_ROLES } from '@/constants/roles';

import LoginPage from '@/pages/admin/LoginPage';
import RegisterPage from '@/pages/admin/RegisterPage';
import ActivationPage from '@/pages/admin/ActivationPage';
import HomePage from '@/pages/HomePage';

import RegistrationsPage from '@/pages/admin/RegistrationsPage';
import RegistrationDetailPage from '@/pages/admin/RegistrationDetailPage';
import AdminLayout from '@/layouts/admin/AdminLayout';
import PendingPage from '@/components/PendingPage';

// Delivery Staff
import DeliveryLayout from '@/layouts/shipper/DeliveryLayout';
import CurrentTripPage from '@/pages/shipper/CurrentTripPage';
import DeliveryHistoryPage from '@/pages/shipper/DeliveryHistoryPage';

import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routes';

// Khi chạy Vite ở chế độ development, vào thẳng Delivery để test UI.
// Không cần .env.local. Production vẫn bảo vệ bằng DELIVERY_STAFF.
// Khi tích hợp lên main, nên bỏ redirect / ở development.
const allowDeliveryPreview = import.meta.env.DEV;

// Layout và các trang Delivery.
const deliveryWorkspaceRoute: RouteObject = {
    path: ROUTES.DELIVERY,
    element: <DeliveryLayout />,
    children: [
        {
            index: true,
            element: (
                <Navigate
                    to={ROUTES.DELIVERY_TRIPS}
                    replace
                />
            ),
        },
        {
            path: ROUTES.DELIVERY_TRIPS,
            Component: CurrentTripPage,
        },
        {
            path: ROUTES.DELIVERY_HISTORY,
            Component: DeliveryHistoryPage,
        },
        {
            path: ROUTES.DELIVERY_TRIP_DETAIL,
            Component: CurrentTripPage,
        },
    ],
};

export const router = createBrowserRouter([
    // ==========================================
    // 1. AUTHENTICATION
    // ==========================================

    {
        path: ROUTES.LOGIN,
        Component: LoginPage,
    },
    {
        path: ROUTES.REGISTER,
        Component: RegisterPage,
    },
    {
        path: ROUTES.VERIFY_OTP,
        Component: ActivationPage,
    },
    {
        path: ROUTES.SET_PASSWORD,
        Component: ActivationPage,
    },
    {
        path: ROUTES.FORGOT_PASSWORD,
        Component: PendingPage,
    },

    // ==========================================
    // 2. PUBLIC CUSTOMER ROUTES
    // ==========================================

    {
        path: ROUTES.HOME,
        element: allowDeliveryPreview
            ? (
                <Navigate
                    to={ROUTES.DELIVERY_TRIPS}
                    replace
                />
            )
            : <HomePage />,
    },
    {
        path: ROUTES.CATALOG,
        Component: PendingPage,
    },
    {
        path: ROUTES.PRODUCT_DETAIL,
        Component: PendingPage,
    },
    {
        path: ROUTES.QUOTES,
        Component: PendingPage,
    },

    // ==========================================
    // 3. CUSTOMER PROTECTED ROUTES
    // ==========================================

    {
        element: (
            <ProtectedRoute
                allowedRoles={[AUTH_ROLES.CUSTOMER]}
            />
        ),
        children: [
            {
                path: ROUTES.QUOTE_DETAIL,
                Component: PendingPage,
            },
            {
                path: ROUTES.CHECKOUT,
                Component: PendingPage,
            },
            {
                path: ROUTES.ORDERS,
                Component: PendingPage,
            },
            {
                path: ROUTES.ORDER_DETAIL,
                Component: PendingPage,
            },
            {
                path: ROUTES.FAVORITES,
                Component: PendingPage,
            },
            {
                path: ROUTES.PROFILE,
                Component: PendingPage,
            },
        ],
    },

    // ==========================================
    // 4. ADMIN PROTECTED ROUTES
    // ==========================================

    {
        element: (
            <ProtectedRoute
                allowedRoles={[AUTH_ROLES.ADMIN]}
            />
        ),
        children: [
            {
                path: ROUTES.ADMIN,
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: (
                            <Navigate
                                to={ROUTES.ADMIN_REGISTRATIONS}
                                replace
                            />
                        ),
                    },
                    {
                        path: ROUTES.ADMIN_REGISTRATIONS,
                        Component: RegistrationsPage,
                        children: [
                            {
                                path: ':requestId',
                                Component: RegistrationDetailPage,
                            },
                        ],
                    },
                    {
                        path: ROUTES.ADMIN_STAFF,
                        Component: PendingPage,
                    },
                ],
            },
        ],
    },

    // ==========================================
    // 5. E-COMMERCE EXECUTIVE
    // ==========================================

    {
        element: (
            <ProtectedRoute
                allowedRoles={[
                    AUTH_ROLES.ECOMMERCE_EXECUTIVE,
                ]}
            />
        ),
        children: [
            {
                path: ROUTES.ECOMMERCE,
                children: [
                    {
                        index: true,
                        element: (
                            <Navigate
                                to={ROUTES.ECOMMERCE_PRODUCTS}
                                replace
                            />
                        ),
                    },
                    {
                        path: ROUTES.ECOMMERCE_PRODUCTS,
                        Component: PendingPage,
                    },
                    {
                        path: ROUTES.ECOMMERCE_PROMOTIONS,
                        Component: PendingPage,
                    },
                    {
                        path: ROUTES.ECOMMERCE_COUPONS,
                        Component: PendingPage,
                    },
                ],
            },
        ],
    },

    // ==========================================
    // 6. LOGISTICS STAFF
    // Giữ nguyên code nền
    // ==========================================

    {
        element: (
            <ProtectedRoute
                allowedRoles={[AUTH_ROLES.LOGISTICS_STAFF]}
            />
        ),
        children: [
            {
                path: ROUTES.LOGISTICS,
                children: [
                    {
                        index: true,
                        element: (
                            <Navigate
                                to={ROUTES.LOGISTICS_INVENTORY}
                                replace
                            />
                        ),
                    },
                    {
                        path: ROUTES.LOGISTICS_INVENTORY,
                        Component: PendingPage,
                    },
                    {
                        path: ROUTES.LOGISTICS_PRODUCT_REQUESTS,
                        Component: PendingPage,
                    },
                ],
            },
        ],
    },

    // ==========================================
    // 7. DELIVERY STAFF
    // ==========================================

    // Local preview: không yêu cầu backend login.
    // Production: chỉ DELIVERY_STAFF được truy cập.
    ...(allowDeliveryPreview
        ? [deliveryWorkspaceRoute]
        : [
            {
                element: (
                    <ProtectedRoute
                        allowedRoles={[
                            AUTH_ROLES.DELIVERY_STAFF,
                        ]}
                    />
                ),
                children: [deliveryWorkspaceRoute],
            },
        ]),

    // ==========================================
    // 8. FALLBACK
    // ==========================================

    {
        path: '*',
        element: (
            <Navigate
                to={ROUTES.HOME}
                replace
            />
        ),
    },
]);
