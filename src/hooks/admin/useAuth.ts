import { useState } from 'react';
import { useAuthStore } from '@/store/admin/authStore';
import type { LoginRequest } from '@/types/admin/auth';
import { login } from '@/services/admin/authService';

// Hook gọi API; Zustand giữ phiên dùng chung cho Axios, layout và route guard.
export default function useAuth() {
    const setSession = useAuthStore((state) => state.setSession);
    const [isLoading, setIsLoading] = useState(false);

    async function signIn(request: LoginRequest) {
        setIsLoading(true);

        try {
            const session = await login(request);
            setSession(session);
            return session;
        } finally {
            setIsLoading(false);
        }
    }

    return { signIn, isLoading };
}
