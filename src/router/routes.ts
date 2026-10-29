import type { UserRole } from '@/types/admin/auth';

// Chỉ khai báo đường dẫn ở đây
// mấy routes ở đây là demo th, khi code đặt sao thì sửa lại sau
export const ROUTES = {
    HOME: '/',
    CATALOG: '/products',
    PRODUCT_DETAIL: '/products/:id',

    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    SET_PASSWORD: '/set-password',
    FORGOT_PASSWORD: '/forgot-password',

    QUOTES: '/quotes',
    QUOTE_DETAIL: '/quotes/:quoteId',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    ORDER_DETAIL: '/orders/:orderId',
    FAVORITES: '/favorites',
    PROFILE: '/profile',

    ADMIN: '/admin',
    ADMIN_REGISTRATIONS: '/admin/registration-requests',
    ADMIN_REGISTRATION_DETAIL: '/admin/registration-requests/:requestId',
    ADMIN_STAFF: '/admin/staff',

    ECOMMERCE: '/e-commerce',
    ECOMMERCE_PRODUCTS: '/e-commerce/products',
    ECOMMERCE_PROMOTIONS: '/e-commerce/promotions',
    ECOMMERCE_COUPONS: '/e-commerce/coupons',

    LOGISTICS: '/logistics',
    LOGISTICS_INVENTORY: '/logistics/inventory',
    LOGISTICS_PRODUCT_REQUESTS: '/logistics/product-requests',

    DELIVERY: '/delivery',
    DELIVERY_TRIPS: '/delivery/trips',
    DELIVERY_TRIP_DETAIL: '/delivery/trips/:tripId',
} as const;

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

// Encode từng ID để ký tự /, ?, # không làm sai URL khi điều hướng.
export const routePaths = {
    productDetail: (productId: string) => `/products/${encodeURIComponent(productId)}`,
    quoteDetail: (quoteId: string) => `/quotes/${encodeURIComponent(quoteId)}`,
    orderDetail: (orderId: string) => `/orders/${encodeURIComponent(orderId)}`,
    adminRegistrationDetail: (requestId: string) =>
        `/admin/registration-requests/${encodeURIComponent(requestId)}`,
    deliveryTripDetail: (tripId: string) => `/delivery/trips/${encodeURIComponent(tripId)}`,
};
