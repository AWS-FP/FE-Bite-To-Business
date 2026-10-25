import axios from 'axios';
import type { ApiErrorResponse } from '@/types/api';

const errorKeys: Record<string, string> = {
    INVALID_CREDENTIALS: 'errors.credentials',
    ACCOUNT_BANNED: 'errors.banned',
    EMAIL_NOT_VERIFIED: 'errors.notActivated',
    ACCOUNT_NOT_ACTIVATED: 'errors.notActivated',
    EMAIL_ALREADY_EXISTS: 'errors.emailExists',
    PHONE_ALREADY_EXISTS: 'errors.phoneExists',
    AUTH_NOT_CONFIGURED: 'errors.notConfigured',
    EXTERNAL_SERVICE_UNAVAILABLE: 'errors.unavailable',
    EMAIL_DELIVERY_FAILED: 'errors.unavailable',
    TOO_MANY_REQUESTS: 'errors.rateLimit',
    VALIDATION_FAILED: 'errors.validation',
    INVALID_REQUEST: 'errors.validation',
    INVALID_OTP: 'errors.invalidOtp',
    OTP_EXPIRED: 'errors.otpExpired',
    SETUP_SESSION_EXPIRED: 'errors.setupExpired',
    REGISTRATION_ALREADY_ACTIVATED: 'errors.alreadyActivated',
    PASSWORD_CONFIRMATION_MISMATCH: 'errors.passwordMismatch',
    PASSWORD_POLICY_REJECTED: 'errors.passwordPolicy',
};

export interface AuthError {
    messageKey: string;
    code: string;
    status?: number;
}

export function getAuthError(error: unknown): AuthError {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) {
        return { messageKey: 'errors.unknown', code: 'UNKNOWN_ERROR' };
    }

    if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return { messageKey: 'errors.timeout', code: error.code };
        }
        return { messageKey: 'errors.network', code: error.code || 'NETWORK_ERROR' };
    }

    const status = error.response.status;
    // Chỉ hiển thị mã lỗi; không đưa body, stack trace hoặc thông tin đăng nhập ra giao diện.
    const responseCode = error.response.data?.code;
    let code = `HTTP_${status}`;
    if (typeof responseCode === 'string' && /^[A-Z][A-Z0-9_]{0,79}$/.test(responseCode)) {
        code = responseCode;
    }

    let messageKey = errorKeys[code] || 'errors.unknown';
    if (!errorKeys[code]) {
        if (status === 429) messageKey = 'errors.rateLimit';
        else if (status >= 500) messageKey = 'errors.unavailable';
    }

    return { messageKey, code, status };
}
