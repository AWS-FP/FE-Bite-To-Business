import { LoaderCircle } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../app/router/routes'
import { verifyOtp } from '../service/authApi'
import { saveActivationSession } from '../utils/activationSession'
import { getAuthError, type AuthError } from '../utils/authError'
import { GMAIL_PATTERN } from '../utils/authValidation'
import AuthField from './AuthField'
import './ActivationForm.css'

export default function VerifyOtpForm({
  initialEmail = '',
  showEmailField = true,
}: {
  initialEmail?: string
  showEmailField?: boolean
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState<{ email?: string; otp?: string }>({})
  const [serverError, setServerError] = useState<AuthError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const otpRef = useRef<HTMLInputElement>(null)
  const submittingRef = useRef(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return
    const nextErrors: { email?: string; otp?: string } = {}
    if (!email.trim()) nextErrors.email = 'errors.required'
    else if (!GMAIL_PATTERN.test(email.trim())) nextErrors.email = 'errors.gmail'
    if (!otp) nextErrors.otp = 'errors.required'
    else if (!/^[0-9]{6,10}$/.test(otp)) nextErrors.otp = 'errors.otpFormat'
    setErrors(nextErrors)
    setServerError(null)
    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.otp) {
      otpRef.current?.focus()
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)
    try {
      const response = await verifyOtp({ email: email.trim().toLowerCase(), otp })
      saveActivationSession(email.trim().toLowerCase(), response)
      navigate(ROUTES.SET_PASSWORD, { replace: true })
    } catch (error) {
      const authError = getAuthError(error)
      if (authError.code === 'ACCOUNT_NOT_ACTIVATED')
        authError.messageKey = 'verifyOtp.waitingApproval'
      setServerError(authError)
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <form className="activation-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      {location.state?.setupExpired && (
        <div className="activation-notice" role="alert">
          {t('verifyOtp.setupExpired')}
          <span className="activation-error-code">
            {t('errors.code', { code: location.state.setupErrorCode || 'SETUP_SESSION_EXPIRED' })}
            {location.state.setupErrorStatus && ` · HTTP ${location.state.setupErrorStatus}`}
          </span>
        </div>
      )}
      {serverError && (
        <div className="activation-error" role="alert">
          {t(serverError.messageKey)}
          <span className="activation-error-code">
            {t('errors.code', { code: serverError.code })}
            {serverError.status && ` · HTTP ${serverError.status}`}
          </span>
        </div>
      )}
      {showEmailField && (
        <AuthField
          name="otp-email"
          label={t('fields.registrationEmail')}
          required
          error={errors.email}
        >
          <input
            className="activation-input"
            id="otp-email"
            ref={emailRef}
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            required
            value={email}
            disabled={isSubmitting}
            placeholder={t('placeholders.email')}
            aria-invalid={!!errors.email}
            aria-describedby="otp-email-help"
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors({ ...errors, email: undefined })
              setServerError(null)
            }}
          />
        </AuthField>
      )}
      <AuthField
        name="otp-code"
        label={t('verifyOtp.codeLabel')}
        required
        hint={t('verifyOtp.codeHint')}
        error={errors.otp}
      >
        <input
          className="activation-input activation-otp"
          id="otp-code"
          ref={otpRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={10}
          value={otp}
          disabled={isSubmitting}
          placeholder="000000"
          aria-invalid={!!errors.otp}
          aria-describedby="otp-code-help"
          onChange={(event) => {
            setOtp(event.target.value.replace(/[^0-9]/g, ''))
            setErrors({ ...errors, otp: undefined })
            setServerError(null)
          }}
        />
      </AuthField>
      <button className="activation-button" type="submit" disabled={isSubmitting}>
        {isSubmitting && (
          <LoaderCircle
            size={18}
            className="animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {isSubmitting ? t('verifyOtp.submitting') : t('verifyOtp.submit')}
      </button>
      <p className="m-0 font-subtext text-[12px] leading-[1.6] text-auth-muted">
        {t('verifyOtp.resendHint')}
      </p>
      {showEmailField && (
        <Link className="activation-link text-center" to={ROUTES.LOGIN}>
          {t('register.backToLogin')}
        </Link>
      )}
    </form>
  )
}
