import { useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RegisterRequest } from '../../types/auth.types'
import { registrationRules } from '../../utils/authValidation'
import { fullDeliveryAddress } from '../../utils/deliveryAddress'
import AuthField from '../AuthField'

interface InvoiceInformationStepProps {
  form: UseFormReturn<RegisterRequest>
  onEdit: (step: number) => void
}

export default function InvoiceInformationStep({ form, onEdit }: InvoiceInformationStepProps) {
  const { t } = useTranslation()
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = form
  const invoiceSameAsDelivery = useWatch({ control, name: 'invoiceSameAsDelivery' })
  const registration = getValues()
  const fullAddress = fullDeliveryAddress(
    registration.deliveryAddress,
    registration.ward,
    registration.district,
    registration.province,
  )

  return (
    <div className="auth-fields flex flex-col gap-5">
      <p className="auth-invoice-hint m-0 font-subtext text-[14px] leading-[1.6] text-auth-muted">
        {t('register.invoiceHint')}
      </p>

      <AuthField
        name="invoicePurchaser"
        label={t('fields.invoicePurchaser')}
        optional
        error={errors.invoicePurchaser?.message}
      >
        <input
          className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
          outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
          placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
          aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
          disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-12 py-0"
          id="invoicePurchaser"
          maxLength={200}
          {...register('invoicePurchaser', {
            maxLength: { value: 200, message: 'errors.tooLong' },
          })}
          aria-invalid={!!errors.invoicePurchaser}
          aria-describedby="invoicePurchaser-help"
        />
      </AuthField>

      <div
        className="auth-field-row grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 auth-invoice-row
        max-[360px]:grid-cols-[minmax(0,1fr)] [&_.auth-field>label]:min-h-10
        max-[360px]:[&_.auth-field>label]:min-h-0"
      >
        <AuthField
          name="invoiceTaxCode"
          label={t('fields.invoiceTaxCode')}
          optional
          error={errors.invoiceTaxCode?.message}
        >
          <input
            className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
            outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
            placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
            aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
            disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-12 py-0"
            id="invoiceTaxCode"
            inputMode="numeric"
            maxLength={10}
            placeholder={t('placeholders.taxCode')}
            {...register('invoiceTaxCode', registrationRules.taxCode)}
            aria-invalid={!!errors.invoiceTaxCode}
            aria-describedby="invoiceTaxCode-help"
          />
        </AuthField>
        <AuthField
          name="invoiceEmail"
          label={t('fields.invoiceEmail')}
          optional
          error={errors.invoiceEmail?.message}
        >
          <input
            className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
            outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
            placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
            aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
            disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-12 py-0"
            id="invoiceEmail"
            type="email"
            autoCapitalize="none"
            inputMode="email"
            maxLength={254}
            placeholder={t('placeholders.invoiceEmail')}
            {...register('invoiceEmail', registrationRules.invoiceEmail)}
            aria-invalid={!!errors.invoiceEmail}
            aria-describedby="invoiceEmail-help"
          />
        </AuthField>
      </div>

      <label
        className="auth-checkbox-card flex cursor-pointer items-start gap-2.5 rounded-xl border border-solid
        border-[#17133a20] bg-white p-4 [&>input]:mt-0.5 [&>input]:mr-0 [&>input]:mb-0 [&>input]:ml-0
        [&>input]:size-[17px] [&>input]:shrink-0 [&>input]:accent-auth-green [&_strong]:block
        [&_strong]:text-[12px] [&_strong]:leading-[1.5] [&_strong]:font-semibold [&_span_span]:mt-1
        [&_span_span]:block [&_span_span]:font-subtext [&_span_span]:text-[11px] [&_span_span]:leading-[1.5]
        [&_span_span]:text-auth-muted"
      >
        <input type="checkbox" {...register('invoiceSameAsDelivery')} />
        <span>
          <strong>{t('register.sameInvoiceAddress')}</strong>
          <span>{fullAddress}</span>
        </span>
      </label>
      {!invoiceSameAsDelivery && (
        <AuthField
          name="invoiceAddress"
          label={t('fields.invoiceAddress')}
          optional
          error={errors.invoiceAddress?.message}
        >
          <textarea
            className="w-full rounded-xl border border-solid border-[#17133a20] bg-white px-[15px] text-[14px] text-auth-ink
            outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#a8a3b4]
            placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_#123b2e18]
            aria-invalid:border-[#e8453c] aria-invalid:focus:shadow-[0_0_0_3px_#e8453c18] disabled:cursor-not-allowed
            disabled:bg-[#f1eff8] disabled:text-[#868191] max-[600px]:pl-3 h-auto min-h-24 resize-y py-3
            leading-[1.5]"
            id="invoiceAddress"
            rows={3}
            maxLength={1000}
            placeholder={t('placeholders.invoiceAddress')}
            {...register('invoiceAddress', {
              maxLength: { value: 1000, message: 'errors.tooLong' },
            })}
            aria-invalid={!!errors.invoiceAddress}
            aria-describedby="invoiceAddress-help"
          />
        </AuthField>
      )}

      <section
        className="auth-review mt-[14px] flex flex-col gap-3 [&>h2]:m-0 [&>h2]:font-subheading [&>h2]:text-[22px]
        [&>h2]:leading-[1.4] [&>h2]:font-semibold"
        aria-labelledby="registration-review-title"
      >
        <h2 id="registration-review-title">{t('register.reviewTitle')}</h2>
        <div
          className="auth-summary rounded-xl bg-white p-4 [&_dl]:mt-2.5 [&_dl]:mb-0 [&_dl]:flex [&_dl]:flex-col [&_dl]:gap-2
          [&_dl]:text-[12px] [&_dl]:leading-[1.5] [&_dl>div]:grid [&_dl>div]:grid-cols-[38%_minmax(0,1fr)]
          [&_dl>div]:gap-2.5 max-[600px]:[&_dl>div]:grid-cols-[34%_minmax(0,1fr)] [&_dt]:font-subtext
          [&_dt]:text-auth-muted [&_dd]:m-0 [&_dd]:font-semibold [&_dd]:[overflow-wrap:anywhere]"
        >
          <div
            className="auth-summary-heading flex items-center justify-between gap-2 [&_h3]:m-0 [&_h3]:font-subheading
            [&_h3]:text-[11px] [&_h3]:font-bold [&_h3]:text-[#878091] [&_h3]:uppercase"
          >
            <h3>{t('register.customerStep')}</h3>
            <button
              type="button"
              className="auth-text-button border-0 bg-transparent px-0 py-[3px] text-[12px] leading-[1.5] font-bold
            text-auth-green underline-offset-4 hover:underline"
              onClick={() => onEdit(1)}
              aria-label={t('register.editCustomer')}
            >
              {t('auth.edit')}
            </button>
          </div>
          <dl>
            <div>
              <dt>{t('fields.fullName')}</dt>
              <dd>
                {registration.lastName} {registration.firstName}
              </dd>
            </div>
            <div>
              <dt>{t('fields.email')}</dt>
              <dd>{registration.email}</dd>
            </div>
            <div>
              <dt>{t('fields.phone')}</dt>
              <dd>{registration.phone}</dd>
            </div>
            <div>
              <dt>{t('fields.customerType')}</dt>
              <dd>
                {registration.customerType === 'HOUSEHOLD_INDIVIDUAL_BUSINESS'
                  ? t('customerTypes.household')
                  : t('customerTypes.business')}
              </dd>
            </div>
          </dl>
        </div>
        <div
          className="auth-summary rounded-xl bg-white p-4 [&_dl]:mt-2.5 [&_dl]:mb-0 [&_dl]:flex [&_dl]:flex-col [&_dl]:gap-2
          [&_dl]:text-[12px] [&_dl]:leading-[1.5] [&_dl>div]:grid [&_dl>div]:grid-cols-[38%_minmax(0,1fr)]
          [&_dl>div]:gap-2.5 max-[600px]:[&_dl>div]:grid-cols-[34%_minmax(0,1fr)] [&_dt]:font-subtext
          [&_dt]:text-auth-muted [&_dd]:m-0 [&_dd]:font-semibold [&_dd]:[overflow-wrap:anywhere]"
        >
          <div
            className="auth-summary-heading flex items-center justify-between gap-2 [&_h3]:m-0 [&_h3]:font-subheading
            [&_h3]:text-[11px] [&_h3]:font-bold [&_h3]:text-[#878091] [&_h3]:uppercase"
          >
            <h3>{t('register.deliveryStep')}</h3>
            <button
              type="button"
              className="auth-text-button border-0 bg-transparent px-0 py-[3px] text-[12px] leading-[1.5] font-bold
            text-auth-green underline-offset-4 hover:underline"
              onClick={() => onEdit(2)}
              aria-label={t('register.editDelivery')}
            >
              {t('auth.edit')}
            </button>
          </div>
          <dl>
            <div>
              <dt>{t('fields.businessName')}</dt>
              <dd>{registration.businessName}</dd>
            </div>
            <div>
              <dt>{t('fields.address')}</dt>
              <dd>{fullAddress}</dd>
            </div>
            {registration.deliveryNote?.trim() && (
              <div>
                <dt>{t('fields.deliveryNote')}</dt>
                <dd className="whitespace-pre-wrap">{registration.deliveryNote}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>
      <p className="auth-submit-note m-0 font-subtext text-[12px] leading-[1.6] text-auth-muted">
        {t('register.submitNote')}
      </p>
    </div>
  )
}
