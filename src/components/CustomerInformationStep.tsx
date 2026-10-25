import type { FocusEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RegisterRequest } from '@/types/auth'
import { normalizePhone, registrationRules } from '@/validations/authValidation'
import AuthField from './AuthField'

interface CustomerInformationStepProps {
  form: UseFormReturn<RegisterRequest>
}

export default function CustomerInformationStep({ form }: CustomerInformationStepProps) {
  const { t } = useTranslation()
  const {
    register,
    setValue,
    formState: { errors },
  } = form

  function handlePhoneBlur(event: FocusEvent<HTMLInputElement>) {
    // Định dạng khi rời ô, để không làm nhảy con trỏ trong lúc đang gõ.
    setValue('phone', normalizePhone(event.target.value), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <div className="auth-fields flex flex-col gap-5">
      <div className="auth-field-row grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
        <AuthField
          name="lastName"
          label={t('fields.lastName')}
          required
          error={errors.lastName?.message}
        >
          <input
            className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
            outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
            placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
            aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
            disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-12 py-0"
            id="lastName"
            autoComplete="family-name"
            required
            maxLength={100}
            placeholder={t('placeholders.lastName')}
            {...register('lastName', registrationRules.name)}
            aria-invalid={!!errors.lastName}
            aria-describedby="lastName-help"
          />
        </AuthField>
        <AuthField
          name="firstName"
          label={t('fields.firstName')}
          required
          error={errors.firstName?.message}
        >
          <input
            className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
            outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
            placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
            aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
            disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-12 py-0"
            id="firstName"
            autoComplete="given-name"
            required
            maxLength={100}
            placeholder={t('placeholders.firstName')}
            {...register('firstName', registrationRules.name)}
            aria-invalid={!!errors.firstName}
            aria-describedby="firstName-help"
          />
        </AuthField>
      </div>

      <AuthField
        name="email"
        label={t('fields.registrationEmail')}
        required
        hint={t('register.emailHint')}
        error={errors.email?.message}
      >
        <input
          className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
          outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
          placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
          aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
          disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-12 py-0"
          id="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          inputMode="email"
          spellCheck={false}
          required
          maxLength={254}
          placeholder={t('placeholders.email')}
          {...register('email', registrationRules.email)}
          aria-invalid={!!errors.email}
          aria-describedby="email-help"
        />
      </AuthField>

      <AuthField name="phone" label={t('fields.phone')} required error={errors.phone?.message}>
        <input
          className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
          outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
          placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
          aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
          disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-12 py-0"
          id="phone"
          type="tel"
          autoComplete="tel"
          required
          maxLength={20}
          placeholder="+84912345678"
          {...register('phone', { ...registrationRules.phone, onBlur: handlePhoneBlur })}
          aria-invalid={!!errors.phone}
          aria-describedby="phone-help"
        />
      </AuthField>

      <fieldset className="auth-customer-types m-0 min-w-0 border-0 p-0">
        <legend className="mb-[7px] block p-0 text-[14px] leading-5 font-semibold max-[600px]:text-[13px]">
          {t('fields.customerType')}
          <span className="auth-required text-[#e83d33]"> *</span>
        </legend>
        <div className="auth-type-options grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
          <label
            className="auth-type-card flex cursor-pointer flex-col items-start rounded-xl border-2 border-solid
            border-[#17133a1a] p-[14px] transition-[background,border-color] duration-150 hover:border-[#123b2e80]
            has-[input:checked]:border-auth-green has-[input:checked]:bg-[#eaf3ec] max-[600px]:px-2.5
            max-[600px]:py-3 [&_input]:mt-0 [&_input]:mr-0 [&_input]:mb-[9px] [&_input]:ml-0 [&_input]:size-[19px]
            [&_input]:cursor-pointer [&_input]:accent-auth-green [&_strong]:font-label [&_strong]:text-[12px]
            [&_strong]:leading-[1.5] [&>span]:mt-[3px] [&>span]:font-subtext [&>span]:text-[11px]
            [&>span]:leading-[1.5] [&>span]:text-auth-muted"
          >
            <input
              type="radio"
              value="HOUSEHOLD_INDIVIDUAL_BUSINESS"
              {...register('customerType', { required: 'errors.required' })}
            />
            <strong>{t('customerTypes.household')}</strong>
            <span>{t('customerTypes.householdHint')}</span>
          </label>
          <label
            className="auth-type-card flex cursor-pointer flex-col items-start rounded-xl border-2 border-solid
            border-[#17133a1a] p-[14px] transition-[background,border-color] duration-150 hover:border-[#123b2e80]
            has-[input:checked]:border-auth-green has-[input:checked]:bg-[#eaf3ec] max-[600px]:px-2.5
            max-[600px]:py-3 [&_input]:mt-0 [&_input]:mr-0 [&_input]:mb-[9px] [&_input]:ml-0 [&_input]:size-[19px]
            [&_input]:cursor-pointer [&_input]:accent-auth-green [&_strong]:font-label [&_strong]:text-[12px]
            [&_strong]:leading-[1.5] [&>span]:mt-[3px] [&>span]:font-subtext [&>span]:text-[11px]
            [&>span]:leading-[1.5] [&>span]:text-auth-muted"
          >
            <input
              type="radio"
              value="BUSINESS_COOPERATIVE"
              {...register('customerType', { required: 'errors.required' })}
            />
            <strong>{t('customerTypes.business')}</strong>
            <span>{t('customerTypes.businessHint')}</span>
          </label>
        </div>
      </fieldset>
    </div>
  )
}
