import axios from 'axios'
import type { ApiErrorResponse } from '../../../types/api'
import type { AuthUser } from '../../auth/types/auth.types'

// Chỉ nhận những bộ lọc hợp lệ từ URL trước khi gửi xuống API.
export function readRegistrationStatus(value: string | null) {
  if (value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') return value
  return 'ALL'
}

export function readCustomerType(value: string | null) {
  if (value === 'BUSINESS_COOPERATIVE' || value === 'HOUSEHOLD_INDIVIDUAL_BUSINESS') return value
  return undefined
}

export function readRegistrationPage(value: string | null) {
  const page = Number(value || 0)
  if (Number.isSafeInteger(page) && page >= 0) return page
  return 0
}

export function customerName(customer: AuthUser) {
  return `${customer.lastName} ${customer.firstName}`.trim() || customer.email
}

export function customerInitials(customer: AuthUser) {
  const givenName = customer.firstName.trim().split(/\s+/).at(-1) || ''
  return (
    `${customer.lastName.charAt(0)}${givenName.charAt(0)}`.toUpperCase() ||
    customer.email.charAt(0).toUpperCase()
  )
}

export function registrationCode(id: string) {
  // API hiện trả UUID, không có mã KH-1024 như dữ liệu minh họa trong Figma.
  return id.slice(0, 8).toUpperCase()
}

export function registrationDate(value: string | null, language: string, includeTime = false) {
  if (!value) return null
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime ? ({ hour: '2-digit', minute: '2-digit' } as const) : {}),
  }).format(new Date(value))
}

export function registrationErrorKey(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return 'errors.unknown'
  if (!error.response) return 'errors.network'
  const code = error.response.data?.code
  const codes: Record<string, string> = {
    REGISTRATION_ALREADY_REVIEWED: 'errors.alreadyReviewed',
    REGISTRATION_ALREADY_ACTIVATED: 'errors.alreadyActivated',
    REJECTION_NOTE_REQUIRED: 'errors.reasonRequired',
    TOO_MANY_REQUESTS: 'errors.cooldown',
    EMAIL_DELIVERY_FAILED: 'errors.mail',
    AUTH_NOT_CONFIGURED: 'errors.unavailable',
    EXTERNAL_SERVICE_UNAVAILABLE: 'errors.unavailable',
    RESOURCE_NOT_FOUND: 'errors.notFound',
    UNAUTHORIZED: 'errors.unauthorized',
    ACCESS_DENIED: 'errors.forbidden',
    VALIDATION_FAILED: 'errors.validation',
  }
  if (code && codes[code]) return codes[code]
  if (error.response.status === 401) return 'errors.unauthorized'
  if (error.response.status === 403) return 'errors.forbidden'
  if (error.response.status === 404) return 'errors.notFound'
  if (error.response.status >= 500) return 'errors.unavailable'
  return 'errors.unknown'
}
