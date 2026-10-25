import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import type { LoginRequest } from '@/types/auth'
import { login } from '@/services/authService'

// Hook gọi API; Zustand giữ phiên dùng chung cho Axios, layout và route guard.
export default function useAuth() {
  const setSession = useAuthStore((state) => state.setSession)
  const [isLoading, setIsLoading] = useState(false)

  async function signIn(request: LoginRequest) {
    setIsLoading(true)

    try {
      const session = await login(request)
      setSession(session)
      return session
    } finally {
      setIsLoading(false)
    }
  }

  return { signIn, isLoading }
}
