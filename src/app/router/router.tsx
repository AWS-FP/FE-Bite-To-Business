import { createBrowserRouter, Navigate } from "react-router-dom";
import { AUTH_ROLES } from "../../features/auth/constants/roles";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import ActivationPage from "../../features/auth/pages/ActivationPage";
import HomePage from "../../features/customer/pages/HomePage";
import RegistrationsPage from "../../features/admin/pages/RegistrationsPage";
import RegistrationDetailPage from "../../features/admin/pages/RegistrationDetailPage";
import AdminLayout from "../../layout/admin/AdminLayout";
import PendingPage from "../../components/feedback/PendingPage";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  // Mỗi trang auth tự ghép các component dùng chung, không có layout ở router.
  { path: ROUTES.LOGIN, Component: LoginPage },
  { path: ROUTES.REGISTER, Component: RegisterPage },
  { path: ROUTES.VERIFY_OTP, Component: ActivationPage },
  { path: ROUTES.SET_PASSWORD, Component: ActivationPage },
  { path: ROUTES.FORGOT_PASSWORD, Component: PendingPage },
  // Guest được xem sản phẩm và mở giỏ hàng; checkout vẫn yêu cầu đăng nhập.
  // Mỗi trang tự chọn bố cục và dùng Header/Footer chung khi cần.
  { path: ROUTES.HOME, Component: HomePage },
  { path: ROUTES.CATALOG, Component: PendingPage },
  { path: ROUTES.PRODUCT_DETAIL, Component: PendingPage },
  { path: ROUTES.QUOTES, Component: PendingPage },
  {
    // Chỉ kiểm tra quyền truy cập, không áp đặt layout cho các trang Customer.
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
  { path: "*", element: <Navigate to={ROUTES.HOME} replace /> },
]);
