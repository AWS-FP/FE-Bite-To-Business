import { useQuery } from '@tanstack/react-query';
import { getBackendHealth } from '@/services/admin/systemService';
import { useAuthStore } from '@/store/admin/authStore';

export function useSystemMetrics() {
    const session = useAuthStore((state) => state.session);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);

    return useQuery({
        queryKey: ['admin', session?.user.id, sessionVersion, 'system', 'health'],
        queryFn: ({ signal }) => getBackendHealth(signal),
        enabled: session?.user.role === 'ADMIN',
        retry: false,
        staleTime: 30_000,
    });
}
