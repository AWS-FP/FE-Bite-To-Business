import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export type LoginValues = { email: string; password: string }
type LoginFormProps = { onSubmit?: (values: LoginValues) => Promise<void> }

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitError, setSubmitError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const normalizedEmail = email.trim().toLowerCase()
    const nextErrors: typeof errors = {}
    if (!normalizedEmail) nextErrors.email = 'emailRequired'
    else if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/i.test(normalizedEmail)) nextErrors.email = 'emailInvalid'
    if (!password) nextErrors.password = 'passwordRequired'
    setErrors(nextErrors)
    setSubmitError(false)
    if (Object.keys(nextErrors).length) {
      event.currentTarget.querySelector<HTMLInputElement>(nextErrors.email ? '#login-email' : '#login-password')?.focus()
      return
    }
    // UI preview: a real auth handler must be supplied before login can succeed.
    if (!onSubmit) { setSubmitError(true); return }
    setSubmitting(true)
    try { await onSubmit({ email: normalizedEmail, password }) }
    catch { setSubmitError(true) }
    finally { setSubmitting(false) }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate aria-label={t('login.title')}>
      <Input id="login-email" label={t('login.emailLabel')} type="email" autoComplete="username" inputMode="email"
        placeholder={t('login.emailPlaceholder')} value={email} maxLength={254} required disabled={submitting}
        leadingIcon={<Mail size={19} />} error={errors.email ? t(`errors.${errors.email}`) : undefined}
        onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })); setSubmitError(false) }} />
      <Input id="login-password" label={t('login.passwordLabel')} type={visible ? 'text' : 'password'} autoComplete="current-password"
        placeholder={t('login.passwordPlaceholder')} value={password} required disabled={submitting}
        leadingIcon={<LockKeyhole size={19} />} error={errors.password ? t(`errors.${errors.password}`) : undefined}
        onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); setSubmitError(false) }}
        trailingAction={<button type="button" className="password-toggle" aria-label={t(visible ? 'login.hidePassword' : 'login.showPassword')}
          aria-pressed={visible} aria-controls="login-password" onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>} />
      <div className="forgot-row"><Link to="/forgot-password">{t('login.forgot')}</Link></div>
      {submitError && <p className="submit-error" role="alert">{t('errors.unavailable')}</p>}
      <Button type="submit" className="login-submit" disabled={submitting}>
        <span>{t(submitting ? 'login.submitting' : 'login.submit')}</span>
        {submitting ? <LoaderCircle className="spin" size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}
      </Button>
      <p className="secure-note"><ShieldCheck size={15} aria-hidden="true" />{t('login.security')}</p>
    </form>
  )
}
