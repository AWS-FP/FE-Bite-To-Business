import { env } from '@/lib/env';
import { useAuthStore } from '@/store/admin/authStore';

/**
 * Ghi tín hiệu tương tác để BE tổng hợp hồ sơ giao diện (ui_profiles) và AI sinh UI hợp thói quen hơn.
 * Gom sự kiện, gửi mỗi 10 giây hoặc khi rời trang. Người dùng tắt cá nhân hóa thì không ghi gì.
 */
export type InteractionType =
    | 'page_view'
    | 'page_leave'
    | 'quick_back'
    | 'search'
    | 'add_to_cart'
    | 'assistant_prompt'
    | 'a2ui_render'
    | 'a2ui_action'
    | 'a2ui_rejected';

type InteractionEvent = {
    eventId: string;
    type: InteractionType;
    route: string;
    surfaceId?: string;
    component?: string;
    target?: string;
    value?: Record<string, unknown>;
    occurredAt: string;
};

const OPT_OUT_KEY = 'btb.personalization';
const FLUSH_MS = 10_000;
const MAX_BATCH = 50;
const STAFF_ROUTE =
    /^\/(admin|e-commerce|logistics|delivery|login|register|verify-otp|set-password|forgot-password)(\/|$)/;

let queue: InteractionEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function storage(): Storage | null {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export function personalizationEnabled() {
    return storage()?.getItem(OPT_OUT_KEY) !== 'off';
}

export function setPersonalizationEnabled(enabled: boolean) {
    try {
        if (enabled) storage()?.removeItem(OPT_OUT_KEY);
        else storage()?.setItem(OPT_OUT_KEY, 'off');
    } catch {
        /* storage bị chặn: coi như vẫn bật, BE vẫn có quyền xóa dữ liệu */
    }
    if (!enabled) queue = [];
}

export function trackEvent(
    type: InteractionType,
    detail: Partial<Omit<InteractionEvent, 'eventId' | 'type' | 'occurredAt'>> = {},
) {
    if (typeof window === 'undefined' || !personalizationEnabled()) return;
    // AI chỉ dành cho Customer nên chỉ ghi hành vi của Customer đã đăng nhập (Guest/nhân viên: bỏ qua).
    if (useAuthStore.getState().session?.user.role !== 'CUSTOMER') return;
    const route = detail.route ?? window.location.pathname;
    // Chỉ cá nhân hóa trải nghiệm mua hàng; bỏ qua khu vực nhân viên và trang đăng nhập.
    if (STAFF_ROUTE.test(route)) return;
    queue.push({
        eventId: crypto.randomUUID(),
        type,
        route,
        surfaceId: detail.surfaceId,
        component: detail.component,
        target: detail.target,
        value: detail.value,
        occurredAt: new Date().toISOString(),
    });
    if (queue.length >= MAX_BATCH) void flush();
    else if (!timer) timer = setTimeout(() => void flush(), FLUSH_MS);
}

export async function flush(onUnload = false) {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    if (!queue.length) return;
    const batch = queue.splice(0, MAX_BATCH);
    try {
        await fetch(`${env.apiBaseUrl}/api/ui-events`, {
            method: 'POST',
            credentials: 'include',
            keepalive: onUnload,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: batch }),
        });
    } catch {
        // Mất mạng: bỏ lô này, không ảnh hưởng thao tác mua hàng.
    }
    if (queue.length) timer = setTimeout(() => void flush(), FLUSH_MS);
}

if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', () => void flush(true));
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') void flush(true);
    });
}
