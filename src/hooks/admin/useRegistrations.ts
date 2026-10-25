import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import {
  getRegistration,
  getRegistrations,
  getRegistrationStats,
  resendRegistrationOtp,
  reviewRegistration,
} from '@/services/admin/registrationService'
import type {
  RegistrationListParams,
  RegistrationResponse,
  ReviewRegistrationRequest,
} from '@/types/admin/registration'

export function useRegistrationStats() {
  const session = useAuthStore((state) => state.session)
  const sessionVersion = useAuthStore((state) => state.sessionVersion)

  return useQuery({
    queryKey: ['admin', session?.user.id, sessionVersion, 'stats'],
    queryFn: ({ signal }) => getRegistrationStats(signal),
    enabled: session !== null,
    staleTime: 30_000,
  })
}

export function useRegistrations(params: RegistrationListParams) {
  const session = useAuthStore((state) => state.session)
  const sessionVersion = useAuthStore((state) => state.sessionVersion)

  return useQuery({
    queryKey: ['admin', session?.user.id, sessionVersion, 'list', params],
    queryFn: ({ signal }) => getRegistrations(params, signal),
    enabled: session !== null,
  })
}

export function useRegistration(id: string) {
  const session = useAuthStore((state) => state.session)
  const sessionVersion = useAuthStore((state) => state.sessionVersion)

  return useQuery({
    queryKey: ['admin', session?.user.id, sessionVersion, 'detail', id],
    queryFn: ({ signal }) => getRegistration(id, signal),
    enabled: session !== null && id !== '',
  })
}

export function useRegistrationActions(id: string) {
  const session = useAuthStore((state) => state.session)
  const sessionVersion = useAuthStore((state) => state.sessionVersion)
  const queryClient = useQueryClient()
  const adminQueryKey = ['admin', session?.user.id, sessionVersion]

  function updateRegistration(registration: RegistrationResponse) {
    queryClient.setQueryData([...adminQueryKey, 'detail', id], registration)
    void queryClient.invalidateQueries({ queryKey: [...adminQueryKey, 'list'] })
    void queryClient.invalidateQueries({ queryKey: [...adminQueryKey, 'stats'] })
  }

  function refreshAfterError() {
    // Admin khác có thể vừa xử lý hồ sơ, hoặc request đã lưu thành công trước khi mất mạng.
    void queryClient.invalidateQueries({ queryKey: adminQueryKey })
  }

  const reviewMutation = useMutation({
    mutationFn: (request: ReviewRegistrationRequest) => reviewRegistration(id, request),
    onSuccess: (result) => updateRegistration(result.registration),
    onError: refreshAfterError,
  })

  const resendMutation = useMutation({
    mutationFn: () => resendRegistrationOtp(id),
    onSuccess: updateRegistration,
    onError: refreshAfterError,
  })

  return { reviewMutation, resendMutation }
}
