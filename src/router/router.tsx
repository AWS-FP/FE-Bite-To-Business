
import {
    createBrowserRouter,
    Navigate,
} from 'react-router-dom';

import { AUTH_ROLES } from '@/constants/roles';

import LoginPage from '@/pages/admin/LoginPage';
import RegisterPage from '@/pages/admin/RegisterPage';
import ActivationPage from '@/pages/admin/ActivationPage';

import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/customer/ProfilePage';

import RegistrationsPage from '@/pages/admin/RegistrationsPage';
import RegistrationDetailPage from '@/pages/admin/RegistrationDetailPage';

import AdminLayout from '@/layouts/admin/AdminLayout';
import PendingPage from '@/components/PendingPage';

import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
    // ==========================================
    // 1. AUTHENTICATION ROUTES
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
    // Không cần đăng nhập
    // ==========================================

    {
        path: ROUTES.HOME,
        Component: HomePage,
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
    // 3. PROFILE - DEVELOPMENT ONLY
    // Cho phép test Profile khi chưa có BE
    // ==========================================

    ...(import.meta.env.DEV
        ? [
            {
                path: ROUTES.PROFILE,
                Component: ProfilePage,
            },
        ]
        : []),

    // ==========================================
    // 4. CUSTOMER PROTECTED ROUTES
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

            // Production mới yêu cầu login
            ...(!import.meta.env.DEV
                ? [
                    {
                        path: ROUTES.PROFILE,
                        Component: ProfilePage,
                    },
                ]
                : []),
        ],
    },

    // ==========================================
    // 5. ADMIN ROUTES
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
    // 6. E-COMMERCE EXECUTIVE ROUTES
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
    // 7. LOGISTICS STAFF ROUTES
    // ==========================================

    {
        element: (
            <ProtectedRoute
                allowedRoles={[
                    AUTH_ROLES.LOGISTICS_STAFF,
                ]}
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
    // 8. DELIVERY STAFF ROUTES
    // ==========================================

    {
        element: (
            <ProtectedRoute
                allowedRoles={[
                    AUTH_ROLES.DELIVERY_STAFF,
                ]}
            />
        ),

        children: [
            {
                path: ROUTES.DELIVERY,

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
                        Component: PendingPage,
                    },
                    {
                        path: ROUTES.DELIVERY_TRIP_DETAIL,
                        Component: PendingPage,
                    },
                ],
            },
        ],
    },

    // ==========================================
    // 9. FALLBACK
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
