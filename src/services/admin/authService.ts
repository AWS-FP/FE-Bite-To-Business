import { http, publicHttp } from '../axiosClient';
import type { ApiResponse } from '@/types/api';
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    RegistrationReceipt,
    VerifyOtpRequest,
    OtpVerificationResponse,
    SetPasswordRequest,
} from '@/types/admin/auth';

// Các API công khai dùng publicHttp, không đính kèm token của phiên đăng nhập cũ.
export async function login(request: LoginRequest): Promise<AuthResponse> {
    // withCredentials so the browser accepts the HttpOnly refresh cookie BE sets on login.
    const response = await publicHttp.post<ApiResponse<AuthResponse>>('/api/auth/login', request, {
        withCredentials: true,
    });
    return response.data.data;
}

export async function register(request: RegisterRequest): Promise<RegistrationReceipt> {
    const response = await publicHttp.post<ApiResponse<RegistrationReceipt>>(
        '/api/auth/register',
        request,
    );
    return response.data.data;
}

export async function logout(): Promise<void> {
    // withCredentials so BE's response can delete the refresh cookie.
    await http.post('/api/auth/logout', undefined, { withCredentials: true });
}

export async function verifyOtp(request: VerifyOtpRequest): Promise<OtpVerificationResponse> {
    const response = await publicHttp.post<ApiResponse<OtpVerificationResponse>>(
        '/api/auth/verify-otp',
        request,
    );
    return response.data.data;
}

export async function requestPasswordReset(email: string): Promise<void> {
    await publicHttp.post('/api/auth/forgot-password', { email });
}

export async function verifyPasswordResetOtp(
    request: VerifyOtpRequest,
): Promise<OtpVerificationResponse> {
    const response = await publicHttp.post<ApiResponse<OtpVerificationResponse>>(
        '/api/auth/forgot-password/verify-otp',
        request,
    );
    return response.data.data;
}

export async function resetPassword(
    request: SetPasswordRequest,
    accessToken: string,
): Promise<void> {
    // Chỉ dùng token của bước OTP quên mật khẩu, không dùng phiên đăng nhập trong authStore.
    await publicHttp.post('/api/auth/reset-password', request, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
}

export async function activate(request: SetPasswordRequest, accessToken: string): Promise<void> {
    // Chi truyen token cua buoc OTP; khong dung token admin/customer dang luu trong authStore.
    await publicHttp.post('/api/auth/activate', request, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
}
