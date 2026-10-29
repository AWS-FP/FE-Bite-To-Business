
import type { UserRole } from '@/types/admin/auth';

// Tập trung quản lý đường dẫn của các trang.
export const ROUTES = {
    HOME: '/',
    CATALOG: '/products',
    PRODUCT_DETAIL: '/products/:productId',

    // Authentication
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    SET_PASSWORD: '/set-password',
    FORGOT_PASSWORD: '/forgot-password',

    // Customer
    QUOTES: '/quotes',
    QUOTE_DETAIL: '/quotes/:quoteId',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    ORDER_DETAIL: '/orders/:orderId',
    FAVORITES: '/favorites',
    PROFILE: '/profile',

    // Admin
    ADMIN: '/admin',
    ADMIN_REGISTRATIONS: '/admin/registration-requests',
    ADMIN_REGISTRATION_DETAIL: '/admin/registration-requests/:requestId',
    ADMIN_STAFF: '/admin/staff',

    // E-commerce
    ECOMMERCE: '/e-commerce',
    ECOMMERCE_PRODUCTS: '/e-commerce/products',
    ECOMMERCE_PROMOTIONS: '/e-commerce/promotions',
    ECOMMERCE_COUPONS: '/e-commerce/coupons',

    // Logistics
    LOGISTICS: '/logistics',
    LOGISTICS_INVENTORY: '/logistics/inventory',
    LOGISTICS_RECEIVE: '/logistics/receive',
    LOGISTICS_PACKING: '/logistics/packing',
    LOGISTICS_PRODUCT_REQUESTS: '/logistics/product-requests',

    // Delivery Staff
    DELIVERY: '/delivery',
    DELIVERY_TRIPS: '/delivery/trips',
    DELIVERY_HISTORY: '/delivery/history',
    DELIVERY_TRIP_DETAIL: '/delivery/trips/:tripId',
} as const;

// Điều hướng mặc định theo vai trò.
const roleHome: Record<UserRole, string> = {
    ADMIN: ROUTES.ADMIN_REGISTRATIONS,
    CUSTOMER: ROUTES.HOME,
    ECOMMERCE_EXECUTIVE: ROUTES.ECOMMERCE_PRODUCTS,
    LOGISTICS_STAFF: ROUTES.LOGISTICS_INVENTORY,
    DELIVERY_STAFF: ROUTES.DELIVERY_TRIPS,
};

export function getRoleHome(role: UserRole) {
    return roleHome[role] ?? ROUTES.HOME;
}

// Helpers tạo URL có ID.
export const routePaths = {
    productDetail: (productId: string) =>
        `/products/${encodeURIComponent(productId)}`,

    quoteDetail: (quoteId: string) =>
        `/quotes/${encodeURIComponent(quoteId)}`,

    orderDetail: (orderId: string) =>
        `/orders/${encodeURIComponent(orderId)}`,

    adminRegistrationDetail: (requestId: string) =>
        `/admin/registration-requests/${encodeURIComponent(requestId)}`,

    deliveryTripDetail: (tripId: string) =>
        `/delivery/trips/${encodeURIComponent(tripId)}`,
};
