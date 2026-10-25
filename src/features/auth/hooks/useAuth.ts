import { useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import type { LoginRequest } from '../types/auth.types'
import { login } from '../service/authApi'

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
