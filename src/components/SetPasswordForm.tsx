import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { activate } from '@/services/authService'
import { clearActivationSession, readActivationSession } from '@/utils/activationSession'
import { getAuthError, type AuthError } from '@/utils/authError'
import AuthField from './AuthField'
import './ActivationForm.css'

export default function SetPasswordForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [setupSession] = useState(readActivationSession)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [serverError, setServerError] = useState<AuthError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    if (!setupSession) return
    const timer = window.setTimeout(
      () => {
        if (submittingRef.current) return
        clearActivationSession()
        navigate(ROUTES.VERIFY_OTP, {
          replace: true,
          state: { email: setupSession.email, setupExpired: true },
        })
      },
      Math.max(0, setupSession.expiresAt - Date.now()),
    )
    return () => window.clearTimeout(timer)
  }, [setupSession, navigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return
    const currentSession = readActivationSession()
    if (!currentSession || currentSession.accessToken !== setupSession?.accessToken) {
      navigate(ROUTES.VERIFY_OTP, {
        replace: true,
        state: { email: setupSession?.email, setupExpired: true },
      })
      return
    }
    const nextErrors: { password?: string; confirmPassword?: string } = {}
    if (!password.trim()) nextErrors.password = 'errors.required'
    else if (password.length < 8 || password.length > 72)
      nextErrors.password = 'errors.passwordLength'
    if (!confirmPassword.trim()) nextErrors.confirmPassword = 'errors.required'
    else if (password !== confirmPassword) nextErrors.confirmPassword = 'errors.passwordMismatch'
    setErrors(nextErrors)
    setServerError(null)
    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }
    if (nextErrors.confirmPassword) {
      confirmPasswordRef.current?.focus()
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)
    try {
      // Giu nguyen mat khau, ke ca khoang trang; khong tu dong dang nhap sau kich hoat.
      await activate({ password, confirmPassword }, currentSession.accessToken)
      clearActivationSession()
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { email: currentSession.email, activationComplete: true },
      })
    } catch (error) {
      const authError = getAuthError(error)
      if (authError.code === 'SETUP_SESSION_EXPIRED' || authError.code === 'UNAUTHORIZED') {
        clearActivationSession()
        navigate(ROUTES.VERIFY_OTP, {
          replace: true,
          state: {
            email: currentSession.email,
            setupExpired: true,
            setupErrorCode: authError.code,
            setupErrorStatus: authError.status,
          },
        })
      } else {
        setServerError(authError)
      }
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  if (!setupSession)
    return <Navigate to={ROUTES.VERIFY_OTP} replace state={{ setupExpired: true }} />

  return (
    <>
      <h1 id="auth-title" tabIndex={-1}>
        {t('setPassword.title')}
      </h1>
      <p className="mt-3 mb-0 break-words font-subtext text-[14px] leading-[1.6] text-auth-muted">
        {t('setPassword.description')}{' '}
        <strong className="text-auth-ink">{setupSession.email}</strong>
      </p>
      <form className="activation-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        {serverError && (
          <div className="activation-error" role="alert">
            {t(serverError.messageKey)}
            <span className="activation-error-code">
              {t('errors.code', { code: serverError.code })}
              {serverError.status && ` · HTTP ${serverError.status}`}
            </span>
          </div>
        )}
        <AuthField
          name="new-password"
          label={t('setPassword.passwordLabel')}
          required
          hint={t('setPassword.passwordHint')}
          error={errors.password}
        >
          <div className="activation-password">
            <input
              className="activation-input"
              id="new-password"
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              maxLength={72}
              value={password}
              disabled={isSubmitting}
              placeholder={t('placeholders.password')}
              aria-invalid={!!errors.password}
              aria-describedby="new-password-help"
              onChange={(event) => {
                setPassword(event.target.value)
                setErrors({ ...errors, password: undefined, confirmPassword: undefined })
                setServerError(null)
              }}
            />
            <button
              type="button"
              aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword && <EyeOff size={17} aria-hidden="true" />}
              {!showPassword && <Eye size={17} aria-hidden="true" />}
            </button>
          </div>
        </AuthField>
        <AuthField
          name="confirm-password"
          label={t('setPassword.confirmLabel')}
          required
          error={errors.confirmPassword}
        >
          <div className="activation-password">
            <input
              className="activation-input"
              id="confirm-password"
              ref={confirmPasswordRef}
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              maxLength={72}
              value={confirmPassword}
              disabled={isSubmitting}
              placeholder={t('setPassword.confirmPlaceholder')}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby="confirm-password-help"
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setErrors({ ...errors, confirmPassword: undefined })
                setServerError(null)
              }}
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword ? t('setPassword.hideConfirm') : t('setPassword.showConfirm')
              }
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword && <EyeOff size={17} aria-hidden="true" />}
              {!showConfirmPassword && <Eye size={17} aria-hidden="true" />}
            </button>
          </div>
        </AuthField>
        <button className="activation-button" type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <LoaderCircle
              size={18}
              className="animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
          {isSubmitting ? t('setPassword.submitting') : t('setPassword.submit')}
        </button>
        <Link className="activation-link text-center" to={ROUTES.LOGIN}>
          {t('register.backToLogin')}
        </Link>
      </form>
    </>
  )
}
