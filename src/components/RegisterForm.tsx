import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import useRegisterForm from '@/hooks/useRegisterForm'
import CustomerInformationStep from './CustomerInformationStep'
import DeliveryAddressStep from './DeliveryAddressStep'
import InvoiceInformationStep from './InvoiceInformationStep'

export default function RegisterForm() {
  const { t } = useTranslation()
  const { form, step, goBack, editStep, handleSubmit, isSubmitting, serverError } =
    useRegisterForm()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const previousStepRef = useRef(step)

  useEffect(() => {
    // Sau khi chuyển bước, đưa bàn phím và trình đọc màn hình về đầu form.
    titleRef.current?.focus({ preventScroll: true })
    if (previousStepRef.current !== step) {
      titleRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    previousStepRef.current = step
  }, [step])

  return (
    <>
      <Link
        className="auth-back-home mb-[18px] inline-flex items-center gap-[5px] text-[12px] font-bold text-[#17133a99]
        no-underline hover:text-auth-green"
        to={ROUTES.HOME}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t('auth.home')}
      </Link>
      <h1 id="auth-title" ref={titleRef} tabIndex={-1}>
        {t('register.title')}
      </h1>
      <p
        className="auth-introduction mt-2.5 mb-0 font-subtext text-[16px] leading-[1.6] text-auth-muted
        max-[600px]:text-[15px]"
      >
        {t('register.description')}
      </p>

      <ol
        className="auth-progress mt-6 mb-0 flex list-none gap-2 p-0"
        aria-label={t('register.progress')}
      >
        <li
          className="group/step is-reached min-w-0 flex-1 font-label text-[11px] leading-[1.5] font-bold text-auth-ink max-[600px]:text-[10px]"
          aria-current={step === 1 ? 'step' : undefined}
        >
          <span className="auth-progress-bar mb-[9px] block h-1.5 rounded bg-auth-green group-aria-[current=step]/step:bg-auth-ink" />
          <span>1. {t('register.customerStep')}</span>
        </li>
        <li
          className={`group/step min-w-0 flex-1 font-label text-[11px] leading-[1.5] font-bold max-[600px]:text-[10px] ${step >= 2 ? 'is-reached text-auth-ink' : 'text-[#a59baa]'}`}
          aria-current={step === 2 ? 'step' : undefined}
        >
          <span
            className={`auth-progress-bar mb-[9px] block h-1.5 rounded group-aria-[current=step]/step:bg-auth-ink ${step >= 2 ? 'bg-auth-green' : 'bg-[#17133a1a]'}`}
          />
          <span>2. {t('register.deliveryStep')}</span>
        </li>
        <li
          className={`group/step min-w-0 flex-1 font-label text-[11px] leading-[1.5] font-bold max-[600px]:text-[10px] ${step === 3 ? 'is-reached text-auth-ink' : 'text-[#a59baa]'}`}
          aria-current={step === 3 ? 'step' : undefined}
        >
          <span
            className={`auth-progress-bar mb-[9px] block h-1.5 rounded group-aria-[current=step]/step:bg-auth-ink ${step === 3 ? 'bg-auth-green' : 'bg-[#17133a1a]'}`}
          />
          <span>3. {t('register.invoiceStep')}</span>
        </li>
      </ol>
      <p className="auth-sr-only sr-only" aria-live="polite">
        {step === 1 && t('register.currentStep', { step: 1, label: t('register.customerStep') })}
        {step === 2 && t('register.currentStep', { step: 2, label: t('register.deliveryStep') })}
        {step === 3 && t('register.currentStep', { step: 3, label: t('register.invoiceStep') })}
      </p>

      <form className="auth-form mt-6" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        {serverError && (
          <div
            className="auth-error-banner mb-5 rounded-xl border border-solid border-[#f5c2bc] bg-[#ffedeb] px-4 py-[14px]
          text-[13px] leading-[1.6] text-[#9b2018]"
            role="alert"
          >
            {t(serverError.messageKey)}
            <span className="mt-1 block break-words font-mono text-[12px]">
              {t('errors.code', { code: serverError.code })}
              {serverError.status && ` · HTTP ${serverError.status}`}
            </span>
          </div>
        )}
        <fieldset className="auth-step-fieldset m-0 min-w-0 border-0 p-0" disabled={isSubmitting}>
          <legend className="auth-sr-only sr-only">
            {step === 1 && t('register.customerStep')}
            {step === 2 && t('register.deliveryStep')}
            {step === 3 && t('register.invoiceStep')}
          </legend>
          {step === 1 && <CustomerInformationStep form={form} />}
          {step === 2 && <DeliveryAddressStep form={form} />}
          {step === 3 && <InvoiceInformationStep form={form} onEdit={editStep} />}
        </fieldset>

        <div className="auth-form-actions mt-6 flex gap-3 max-[600px]:gap-2">
          {step > 1 && (
            <button
              className="auth-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-solid
            px-[18px] py-3 text-center text-[14px] leading-[1.4] font-bold no-underline
            transition-[background,transform] duration-150 active:translate-y-px disabled:active:translate-y-0 disabled:opacity-[0.65]
            max-[600px]:px-3 max-[600px]:text-[13px] auth-button-secondary w-auto shrink-0 border-[#17133a26]
            bg-white text-auth-ink hover:bg-[#f4f2ff] disabled:hover:bg-white"
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {t('register.back')}
            </button>
          )}
          <button
            className="auth-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-solid
            px-[18px] py-3 text-center text-[14px] leading-[1.4] font-bold no-underline
            transition-[background,transform] duration-150 active:translate-y-px disabled:active:translate-y-0 disabled:opacity-[0.65]
            max-[600px]:px-3 max-[600px]:text-[13px] auth-button-primary w-full border-transparent bg-auth-ink
            text-white hover:bg-auth-green disabled:hover:bg-auth-ink"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <LoaderCircle
                size={18}
                className="auth-spinner animate-[spin_0.8s_linear_infinite] motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            {isSubmitting && t('register.submitting')}
            {!isSubmitting && step < 3 && t('register.continue')}
            {!isSubmitting && step === 3 && t('register.submit')}
          </button>
        </div>
      </form>
      <p
        className="auth-switch-page mt-6 mb-0 text-center font-subtext text-[14px] leading-[1.6] text-[#797183]
        max-[600px]:text-[12px] [&_a]:font-bold [&_a]:text-auth-ink [&_a]:decoration-[#ff9bd2]
        [&_a]:decoration-[3px] [&_a]:underline-offset-4 [&_a:hover]:text-auth-green"
      >
        {t('register.hasAccount')} <Link to={ROUTES.LOGIN}>{t('login.submit')}</Link>
      </p>
    </>
  )
}
