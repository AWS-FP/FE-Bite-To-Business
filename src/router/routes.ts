import type { UserRole } from '@/types/admin/auth';

// Chỉ khai báo đường dẫn ở đây
// mấy routes ở đây là demo th, khi code đặt sao thì sửa lại sau
export const ROUTES = {
    HOME: '/',
    LANDING: '/landing',
    WHY_BTB: '/why-btb',
    BTB_MODEL: '/btb-model',
    DISTRIBUTION_NETWORK: '/distributionNetwork',
    CATALOG: '/products',
    PRODUCT_DETAIL: '/products/:productId',

    BRANDS: '/brands',
    BRAND_DETAIL: '/brands/:brandSlug',

    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    SET_PASSWORD: '/set-password',
    FORGOT_PASSWORD: '/forgot-password',

    QUOTES: '/quotes',
    QUOTE_DETAIL: '/quotes/:quoteId',
    CHECKOUT: '/quotes',
    ORDERS: '/orders',
    ORDER_DETAIL: '/orders/:orderId',
    FAVORITES: '/favorites',
    PROFILE: '/profile',

    ADMIN: '/admin',
    ADMIN_REGISTRATIONS: '/admin/registration-requests',
    ADMIN_REGISTRATION_DETAIL: '/admin/registration-requests/:requestId',
    ADMIN_STAFF: '/admin/staff',
    ADMIN_SYSTEM: '/admin/system',

    ECOMMERCE: '/e-commerce',
    ECOMMERCE_DASHBOARD: '/e-commerce/dashboard',
    ECOMMERCE_QUOTES: '/e-commerce/quotes',
    ECOMMERCE_POSTER: '/e-commerce/poster',
    ECOMMERCE_PRODUCTS: '/e-commerce/products',
    ECOMMERCE_PROMOTIONS: '/e-commerce/promotions',
    ECOMMERCE_COUPONS: '/e-commerce/coupons',

    LOGISTICS: '/logistics',
    LOGISTICS_INVENTORY: '/logistics/inventory',
    LOGISTICS_RECEIVE: '/logistics/receive',
    LOGISTICS_PACKING: '/logistics/packing',
    LOGISTICS_PRODUCT_REQUESTS: '/logistics/product-requests',

    DELIVERY: '/delivery',
    DELIVERY_TRIPS: '/delivery/trips',
    DELIVERY_HISTORY: '/delivery/history',
    DELIVERY_TRIP_DETAIL: '/delivery/trips/:tripId',
} as const;

const roleHome: Record<UserRole, string> = {
    ADMIN: ROUTES.ADMIN_REGISTRATIONS,
    CUSTOMER: ROUTES.HOME,
    ECOMMERCE_EXECUTIVE: ROUTES.ECOMMERCE_DASHBOARD,
    LOGISTICS_STAFF: ROUTES.LOGISTICS_INVENTORY,
    DELIVERY_STAFF: ROUTES.DELIVERY_TRIPS,
};

export function getRoleHome(role: UserRole) {
    return roleHome[role] ?? ROUTES.HOME;
}

export function getWorkspaceHome(role: UserRole) {
    if (
        role === 'ADMIN' ||
        role === 'ECOMMERCE_EXECUTIVE' ||
        role === 'LOGISTICS_STAFF' ||
        role === 'DELIVERY_STAFF'
    ) {
        return getRoleHome(role);
    }
    return null;
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
