import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { PageResponse } from '@/types/pagination';
import type {
    RegistrationListParams,
    RegistrationResponse,
    RegistrationReviewResponse,
    RegistrationStats,
    ReviewRegistrationRequest,
} from '@/types/admin/registration';

const endpoint = '/api/admin/registration-requests';

export async function getRegistrations(params: RegistrationListParams, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<PageResponse<RegistrationResponse>>>(endpoint, {
        params,
        signal,
    });
    return response.data.data;
}

export async function getRegistrationStats(signal?: AbortSignal) {
    const response = await http.get<ApiResponse<RegistrationStats>>(`${endpoint}/stats`, {
        signal,
    });
    return response.data.data;
}

export async function getRegistration(id: string, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<RegistrationResponse>>(
        `${endpoint}/${encodeURIComponent(id)}`,
        { signal },
    );
    return response.data.data;
}

export async function reviewRegistration(id: string, request: ReviewRegistrationRequest) {
    const response = await http.post<ApiResponse<RegistrationReviewResponse>>(
        `${endpoint}/${encodeURIComponent(id)}/review`,
        request,
    );
    return response.data.data;
}

export async function resendRegistrationOtp(id: string) {
    const response = await http.post<ApiResponse<RegistrationResponse>>(
        `${endpoint}/${encodeURIComponent(id)}/resend-otp`,
    );
    return response.data.data;
}
