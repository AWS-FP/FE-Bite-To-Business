import { publicHttp } from '@/services/axiosClient';
import { backendHealthSchema } from '@/validations/admin/systemSchema';
import type { BackendHealth } from '@/types/admin/system';

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
