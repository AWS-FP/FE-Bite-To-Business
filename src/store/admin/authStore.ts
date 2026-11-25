import { create } from 'zustand';
import type { AuthResponse } from '@/types/admin/auth';

interface AuthState {
    session: AuthResponse | null;
    sessionVersion: number;
    /** True until the first cookie-based session restore finishes (route guards wait for it). */
    restoring: boolean;
    setSession: (session: AuthResponse) => void;
    updateSession: (version: number, session: AuthResponse) => boolean;
    clearSession: () => void;
    finishRestoring: () => void;
}

// Old builds kept the whole session (incl. refresh token) in sessionStorage; remove it.
try {
    sessionStorage.removeItem('bitetobusiness.auth');
} catch {
    /* Storage may be unavailable (private mode); nothing to clean. */
}

/**
 * Marker (no token, just "1") saying this browser signed in and may hold the refresh cookie. Without it
 * startup skips /api/auth/refresh, so guests and crawlers do not send a request that can only fail with 401.
 */
const SESSION_HINT_KEY = 'bitetobusiness.has-session';

function setSessionHint(present: boolean) {
    try {
        if (present) localStorage.setItem(SESSION_HINT_KEY, '1');
        else localStorage.removeItem(SESSION_HINT_KEY);
    } catch {
        /* Storage unavailable: hasSessionHint() then falls back to trying the refresh. */
    }
}

/** False only when storage works and this browser has no sign-in marker. */
export function hasSessionHint() {
    try {
        return localStorage.getItem(SESSION_HINT_KEY) === '1';
    } catch {
        return true;
    }
}

/** No token is ever kept in JS: the access token lives in the HttpOnly `btb_access` cookie and the
 * refresh token in `btb_refresh`, both set by BE. The store keeps only the user and expiry. A reload
 * or a new tab restores the session by calling /api/auth/refresh with the cookie (restoreSession). */
const withoutRefreshToken = (session: AuthResponse): AuthResponse => ({
    ...session,
    accessToken: '',
    refreshToken: '',
});

// Axios và route guard cùng đọc một nguồn trạng thái.
export const useAuthStore = create<AuthState>()((set, get) => ({
    session: null,
    sessionVersion: 0,
    restoring: true,

    // Tính năng login sẽ gọi hàm này sau khi nhận AuthResponse từ BE.
    setSession: (session) => {
        setSessionHint(true);
        set({
            session: withoutRefreshToken(session),
            sessionVersion: get().sessionVersion + 1,
            restoring: false,
        });
    },

    // Không cho kết quả refresh cũ khôi phục phiên sau logout hoặc ghi đè lần login mới.
    updateSession: (version, session) => {
        if (get().sessionVersion !== version || get().session === null) {
            return false;
        }

        set({ session: withoutRefreshToken(session) });
        return true;
    },

    clearSession: () => {
        setSessionHint(false);
        set({ session: null, sessionVersion: get().sessionVersion + 1 });
    },

    finishRestoring: () => set({ restoring: false }),
}));
