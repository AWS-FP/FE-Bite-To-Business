import { http, publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { ApiDiagnostics, SystemMonitoring } from '@/types/admin/system';
import { backendHealthSchema } from '@/validations/admin/systemSchema';
import type { BackendHealth } from '@/types/admin/system';

export async function getSystemMonitoring(hours: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<SystemMonitoring>>('/api/admin/system/monitoring', {
        params: { hours },
        signal,
        timeout: 20_000,
    });
    return response.data.data;
}

export async function getApiDiagnostics(hours: number, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<ApiDiagnostics>>(
        '/api/admin/system/monitoring/api-diagnostics',
        {
            params: { hours },
            signal,
            timeout: 20_000,
        },
    );
    return response.data.data;
}

export async function getBackendHealth(signal?: AbortSignal): Promise<BackendHealth> {
    const startedAt = performance.now();
    const response = await publicHttp.get('/api/health', { signal, timeout: 10_000 });
    const data = backendHealthSchema.parse(response.data);
    return {
        ...data,
        roundTripMs: Math.round(performance.now() - startedAt),
        checkedAt: new Date().toISOString(),
    };
}
