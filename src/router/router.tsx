import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import { NotFoundPage, RouteErrorPage } from '@/pages/ErrorPages';
import MyProductRequestsPage from '@/pages/customer/MyProductRequestsPage';

import { AUTH_ROLES } from '@/constants/roles';

// Authentication
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ActivationPage from '@/pages/auth/ActivationPage';
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Public Customer Pages
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import WhyBTBPage from '@/pages/WhyBTBPage';
import BTBModelPage from '@/pages/BTBModelPage';
import DistributionNetworkPage from '@/pages/DistributionNetworkPage';
import BrandsPage from '@/pages/BrandsPage';
import BrandDetailPage from '@/pages/BrandDetailPage';

// Customer Pages
import ProfilePage from '@/pages/customer/ProfilePage';
import CustomerCatalogPage from '@/pages/customer/CustomerCatalogPage';
import CustomerCollectionPage from '@/pages/customer/CustomerCollectionPage';
import CustomerProductDetailPage from '@/pages/customer/CustomerProductDetailPage';
import CustomerFavoritesPage from '@/pages/customer/CustomerFavoritesPage';
import CartPage from '@/pages/CartPage';
import AiGeneratedPage from '@/pages/customer/AiGeneratedPage';

// Orders Pages - NEW
import OrderHistoryPage from '@/pages/customer/order/OrderHistoryPage';
import OrderStatusPage from '@/pages/customer/order/OrderStatusPage';

// Delivery Pages
import DeliveryLayout from '@/layouts/shipper/DeliveryLayout';
import CurrentTripPage from '@/pages/shipper/CurrentTripPage';
import DeliveryHistoryPage from '@/pages/shipper/DeliveryHistoryPage';
import DeliveryPackagePage from '@/pages/shipper/DeliveryPackagePage';

// Logistics Pages
import LogisticsLayout from '@/layouts/logistic/LogisticsLayout';
import InventoryPage from '@/pages/logistic/InventoryPage';
import ReceivePage from '@/pages/logistic/ReceivePage';
import PackageReturnsPage from '@/pages/admin/PackageReturnsPage';
import PaymentReviewsPage from '@/pages/admin/PaymentReviewsPage';
import ProductRequestsPage from '@/pages/logistic/ProductRequestsPage';

// Admin Pages
import RegistrationsPage from '@/pages/admin/RegistrationsPage';
import RegistrationDetailPage from '@/pages/admin/RegistrationDetailPage';
import StaffPage from '@/pages/admin/StaffPage';
import SystemMetricsPage from '@/pages/admin/SystemMetricsPage';

// Layouts & Shared Components
import AdminLayout from '@/layouts/admin/AdminLayout';
import EcommerceLayout from '@/layouts/e-commerce/EcommerceLayout';
import PendingPage from '@/components/common/PendingPage';

// Router
import ProtectedRoute from './ProtectedRoute';
import StorefrontRoleGuard from './StorefrontRoleGuard';
import { ROUTES } from './routes';
import EcommerceDashboardPage from '@/pages/e-commerce/EcommerceDashboardPage';
import EcommerceQuotesPage from '@/pages/e-commerce/EcommerceQuotesPage';
import EcommerceProductsPage from '@/pages/e-commerce/EcommerceProductsPage';
import EcommerceCombosPage from '@/pages/e-commerce/EcommerceCombosPage';
import EcommercePromotionsPage from '@/pages/e-commerce/EcommercePromotionsPage';
import EcommerceCouponsPage from '@/pages/e-commerce/EcommerceCouponsPage';
import EcommerceReviewsPage from '@/pages/e-commerce/EcommerceReviewsPage';
import EcommerceRefundsPage from '@/pages/e-commerce/EcommerceRefundsPage';

export const router = createBrowserRouter([
    {
        // Bọc mọi route để ScrollRestoration cuộn lên đầu khi chuyển trang.
        Component: RootLayout,
        // Lỗi khi hiển thị bất kỳ trang nào → màn hình lỗi thân thiện thay cho màn hình mặc định.
        errorElement: <RouteErrorPage />,
        children: [
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
                Component: VerifyOtpPage,
            },
            {
                path: ROUTES.SET_PASSWORD,
                Component: ActivationPage,
            },
            {
                path: ROUTES.FORGOT_PASSWORD,
                Component: ForgotPasswordPage,
            },

            // ==========================================
            // 2. PUBLIC CUSTOMER PAGES
            // Guests, customers and staff may browse; checkout is guest/customer-only.
            // ==========================================
            {
                element: <StorefrontRoleGuard />,
                children: [
                    {
                        path: ROUTES.HOME,
                        Component: HomePage,
                    },
                    {
                        path: ROUTES.LANDING,
                        Component: LandingPage,
                    },
                    {
                        path: ROUTES.WHY_BTB,
                        Component: WhyBTBPage,
                    },
                    {
                        path: ROUTES.BTB_MODEL,
                        Component: BTBModelPage,
                    },
                    {
                        path: ROUTES.BRANDS,
                        Component: BrandsPage,
                    },
                    {
                        path: ROUTES.BRAND_DETAIL,
                        Component: BrandDetailPage,
                    },
                    {
                        path: ROUTES.BRAND_DETAIL_LEGACY,
                        Component: BrandDetailPage,
                    },
                    {
                        path: ROUTES.CATALOG,
                        Component: CustomerCatalogPage,
                    },
                    {
                        path: ROUTES.CUSTOMER_COLLECTION,
                        Component: CustomerCollectionPage,
                    },
                    {
                        path: ROUTES.PRODUCT_DETAIL,
                        Component: CustomerProductDetailPage,
                    },
                    {
                        path: ROUTES.QUOTES,
                        Component: CartPage,
                    },
                    {
                        element: <ProtectedRoute allowedRoles={Object.values(AUTH_ROLES)} />,
                        children: [
                            {
                                path: ROUTES.DISTRIBUTION_NETWORK,
                                Component: DistributionNetworkPage,
                            },
                        ],
                    },
                ],
            },

            // ==========================================
            // 3. CUSTOMER PROTECTED ROUTES
            // Cần đăng nhập với role CUSTOMER
            // ==========================================
            {
                element: <ProtectedRoute allowedRoles={[AUTH_ROLES.CUSTOMER]} />,

                children: [
                    {
                        // Trang do AI dựng thay trang mặc định (Generative UI, chế độ Page).
                        // Chỉ Customer: Guest được ProtectedRoute đưa tới đăng nhập rồi quay lại đúng /ai?q=...
                        path: ROUTES.AI_PAGE,
                        Component: AiGeneratedPage,
                    },
                    {
                        path: ROUTES.QUOTE_DETAIL,
                        Component: PendingPage,
                    },

                    // Lịch sử đơn hàng
                    {
                        path: ROUTES.ORDERS,
                        Component: OrderHistoryPage,
                    },

                    // Trạng thái / Chi tiết đơn hàng
                    {
                        path: ROUTES.ORDER_DETAIL,
                        Component: OrderStatusPage,
                    },

                    {
                        path: ROUTES.FAVORITES,
                        Component: CustomerFavoritesPage,
                    },
                    {
                        path: ROUTES.MY_PRODUCT_REQUESTS,
                        Component: MyProductRequestsPage,
                    },
                    {
                        path: ROUTES.PROFILE,
                        Component: ProfilePage,
                    },
                ],
            },

            // ==========================================
            // 4. ADMIN
            // ==========================================
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

                                children: [
                                    {
                                        path: ':requestId',
                                        Component: RegistrationDetailPage,
                                    },
                                ],
                            },
                            {
                                path: ROUTES.ADMIN_STAFF,
                                Component: StaffPage,
                            },
                            {
                                path: ROUTES.ADMIN_PACKAGE_RETURNS,
                                Component: PackageReturnsPage,
                            },
                            {
                                path: ROUTES.ADMIN_PAYMENT_REVIEWS,
                                Component: PaymentReviewsPage,
                            },
                            {
                                path: ROUTES.ADMIN_SYSTEM,
                                Component: SystemMetricsPage,
                            },
                        ],
                    },
                ],
            },

            // ==========================================
            // 5. E-COMMERCE EXECUTIVE
            // ==========================================
            {
                element: <ProtectedRoute allowedRoles={[AUTH_ROLES.ECOMMERCE_EXECUTIVE]} />,

                children: [
                    {
                        path: ROUTES.ECOMMERCE,
                        element: <EcommerceLayout />,

                        children: [
                            {
                                index: true,
                                element: <Navigate to={ROUTES.ECOMMERCE_DASHBOARD} replace />,
                            },
                            {
                                path: ROUTES.ECOMMERCE_DASHBOARD,
                                Component: EcommerceDashboardPage,
                            },
                            { path: ROUTES.ECOMMERCE_QUOTES, Component: EcommerceQuotesPage },
                            { path: ROUTES.ECOMMERCE_PRODUCTS, Component: EcommerceProductsPage },
                            { path: ROUTES.ECOMMERCE_COMBOS, Component: EcommerceCombosPage },
                            {
                                path: ROUTES.ECOMMERCE_PROMOTIONS,
                                Component: EcommercePromotionsPage,
                            },
                            { path: ROUTES.ECOMMERCE_COUPONS, Component: EcommerceCouponsPage },
                            {
                                path: ROUTES.ECOMMERCE_POSTER,
                                element: <Navigate to={ROUTES.ECOMMERCE_PROMOTIONS} replace />,
                            },
                            {
                                path: ROUTES.ECOMMERCE_REQUESTS,
                                element: <Navigate to={ROUTES.ECOMMERCE_DASHBOARD} replace />,
                            },
                            { path: ROUTES.ECOMMERCE_REVIEWS, Component: EcommerceReviewsPage },
                            { path: ROUTES.ECOMMERCE_REFUNDS, Component: EcommerceRefundsPage },
                        ],
                    },
                ],
            },

            // ==========================================
            // 6. LOGISTICS STAFF
            // ==========================================
            {
                element: <ProtectedRoute allowedRoles={[AUTH_ROLES.LOGISTICS_STAFF]} />,

                children: [
                    {
                        path: ROUTES.LOGISTICS,
                        element: <LogisticsLayout />,

                        children: [
                            {
                                index: true,
                                element: <Navigate to={ROUTES.LOGISTICS_INVENTORY} replace />,
                            },
                            {
                                path: ROUTES.LOGISTICS_INVENTORY,
                                Component: InventoryPage,
                            },
                            {
                                path: ROUTES.LOGISTICS_RECEIVE,
                                Component: ReceivePage,
                            },
                            {
                                path: ROUTES.LOGISTICS_PRODUCT_REQUESTS,
                                Component: ProductRequestsPage,
                            },
                        ],
                    },
                ],
            },

            // ==========================================
            // 7. DELIVERY STAFF
            // ==========================================
            {
                element: <ProtectedRoute allowedRoles={[AUTH_ROLES.DELIVERY_STAFF]} />,

                children: [
                    {
                        path: ROUTES.DELIVERY,
                        element: <DeliveryLayout />,

                        children: [
                            {
                                index: true,
                                element: <Navigate to={ROUTES.DELIVERY_TRIPS} replace />,
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
                                Component: DeliveryPackagePage,
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
                Component: NotFoundPage,
            },
        ],
    },
]);
