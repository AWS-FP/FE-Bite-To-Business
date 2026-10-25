import type { OtpVerificationResponse } from '../types/auth.types'

interface ActivationSession {
  email: string
  accessToken: string
  expiresAt: number
}

const storageKey = 'bitetobusiness.activation'
let activationSession: ActivationSession | null = null

// Phien nay chi dung tao mat khau, khong ghi vao authStore cua tai khoan da dang nhap.
export function saveActivationSession(email: string, response: OtpVerificationResponse) {
  if (
    typeof response?.accessToken !== 'string' ||
    !response.accessToken.trim() ||
    typeof response.tokenType !== 'string' ||
    response.tokenType.toLowerCase() !== 'bearer' ||
    !Number.isFinite(response.expiresIn) ||
    response.expiresIn <= 0 ||
    response.passwordSetupRequired !== true
  ) {
    throw new Error('Invalid OTP verification response.')
  }

  activationSession = {
    email,
    accessToken: response.accessToken,
    expiresAt: Date.now() + response.expiresIn * 1000,
  }
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(activationSession))
  } catch {
    /* Van tiep tuc trong tab nay khi trinh duyet khong cho phep luu storage. */
  }
}

export function readActivationSession(): ActivationSession | null {
  let session = activationSession
  if (!session) {
    try {
      const saved = sessionStorage.getItem(storageKey)
      if (saved) session = JSON.parse(saved)
    } catch {
      /* Du lieu hong duoc xem nhu chua co phien xac minh. */
    }
  }

  if (
    session &&
    typeof session.email === 'string' &&
    typeof session.accessToken === 'string' &&
    session.accessToken.length > 0 &&
    Number.isFinite(session.expiresAt) &&
    session.expiresAt > Date.now()
  ) {
    activationSession = session
    return session
  }
  clearActivationSession()
  return null
}

export function clearActivationSession() {
  activationSession = null
  try {
    sessionStorage.removeItem(storageKey)
  } catch {
    /* Phien trong bo nho van duoc xoa. */
  }
}
