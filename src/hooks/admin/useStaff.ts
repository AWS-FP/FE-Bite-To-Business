import { useQuery } from '@tanstack/react-query';
import { getStaff } from '@/services/admin/staffService';
import { useAuthStore } from '@/store/admin/authStore';
import type { StaffListParams } from '@/types/admin/staff';

export function useStaff(params: StaffListParams) {
    const session = useAuthStore((state) => state.session);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);

    return useQuery({
        queryKey: ['admin', session?.user.id, sessionVersion, 'staff', params],
        queryFn: ({ signal }) => getStaff(params, signal),
        enabled: session?.user.role === 'ADMIN',
    });
}
