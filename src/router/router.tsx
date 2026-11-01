
import {
    createBrowserRouter,
    Navigate,
} from 'react-router-dom';

import { AUTH_ROLES } from '@/constants/roles';

// Authentication
import LoginPage from '@/pages/admin/LoginPage';
import RegisterPage from '@/pages/admin/RegisterPage';
import ActivationPage from '@/pages/admin/ActivationPage';

// Public Customer Pages
import HomePage from '@/pages/HomePage';
import LandingPlaceholderPage from '@/pages/LandingPlaceholderPage';

// Admin Pages
import RegistrationsPage from '@/pages/admin/RegistrationsPage';
import RegistrationDetailPage from '@/pages/admin/RegistrationDetailPage';

// Layouts & Shared Components
import AdminLayout from '@/layouts/admin/AdminLayout';
import PendingPage from '@/components/PendingPage';

// Router
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routes';
import LandingPage from '@/pages/LandingPage';

import BrandsPage from '@/pages/BrandsPage';
import BrandDetailPage from '@/pages/BrandDetailPage';


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
    // 2. PUBLIC CUSTOMER PAGES
    // Không cần đăng nhập
    // ==========================================

    // Homepage
    {
        path: ROUTES.HOME,
        Component: HomePage,
    },

    // Landing Page của thành viên khác
    // Đang sử dụng placeholder tạm
    {
        path: ROUTES.LANDING,
        Component: LandingPlaceholderPage,
    },

    // Catalog chưa triển khai ở nhánh này
    {
        path: ROUTES.CATALOG,
        Component: PendingPage,
    },

    // Product Details thuộc nhánh riêng
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

            // Profile thuộc nhánh feat/profile-ui
            // Chưa triển khai trong Home UI
            {
                path: ROUTES.PROFILE,
                Component: PendingPage,
            },
        ],
    },

    // ==========================================
    // 4. ADMIN
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
    // 7. DELIVERY STAFF
    // ==========================================

    {
        element: (
            <ProtectedRoute
                allowedRoles={[AUTH_ROLES.DELIVERY_STAFF]}
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
