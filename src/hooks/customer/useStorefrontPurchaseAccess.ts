import { useAuthStore } from '@/store/admin/authStore';

/** Guests and customers can build carts; staff use the storefront for inspection only. */
export function useStorefrontPurchaseAccess() {
    return useAuthStore(
        (state) => !state.restoring && (!state.session || state.session.user.role === 'CUSTOMER'),
    );
}
