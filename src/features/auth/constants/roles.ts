import type { UserRole } from '../types/auth.types'

// Giá trị phải trùng UserRole trong Spring Boot.
export const AUTH_ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  ECOMMERCE_EXECUTIVE: 'ECOMMERCE_EXECUTIVE',
  LOGISTICS_STAFF: 'LOGISTICS_STAFF',
  DELIVERY_STAFF: 'DELIVERY_STAFF',
} as const satisfies Record<UserRole, UserRole>
