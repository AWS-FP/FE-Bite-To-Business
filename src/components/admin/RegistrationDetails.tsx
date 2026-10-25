import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { RegistrationResponse } from '@/types/admin/registration'
import { customerInitials, customerName, registrationDate } from '@/utils/admin/registration'
import AdminIcon from './AdminIcon'
import type { AdminIconName } from './AdminIcon'
import { ActivationBadge, ReviewBadge } from './RegistrationBadges'
import { fullDeliveryAddress } from '@/utils/deliveryAddress'

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: AdminIconName
  children: ReactNode
}) {
  return (
    <section className="pt-[25px]">
      <h3 className="flex items-center gap-[9px] border-b border-black pb-3 font-body text-[15px] leading-[23px] font-bold">
        <AdminIcon name={icon} />
        {title}
      </h3>
      <dl className="m-0 mt-[18px] grid grid-cols-2 gap-x-[22px] gap-y-[18px] max-[420px]:grid-cols-1">
        {children}
      </dl>
    </section>
  )
}

function DetailField({
  label,
  children,
  full = false,
}: {
  label: string
  children?: ReactNode
  full?: boolean
}) {
  const { t } = useTranslation('admin')
  const isEmpty = children === null || children === undefined || children === ''
  return (
    <div className={`min-w-0 ${full ? 'col-span-2 max-[420px]:col-span-1' : ''}`}>
      <dt className="text-[12px] leading-[18px]">{label}</dt>
      <dd
        className={`m-0 pt-[6px] text-[14px] leading-[21px] wrap-anywhere whitespace-pre-wrap ${isEmpty ? 'text-[13px] font-normal italic' : 'font-semibold'}`}
      >
        {isEmpty ? t('detail.notProvided') : children}
      </dd>
    </div>
  )
}

export default function RegistrationDetails({
  registration,
  children,
}: {
  registration: RegistrationResponse
  children?: ReactNode
}) {
  const { t, i18n } = useTranslation('admin')
  return (
    <>
      <div className="flex flex-wrap items-center gap-[13px] border-b border-black pb-6">
        <span
          className="grid size-[47px] shrink-0 place-items-center rounded-full border border-black bg-[#eaf0e8] text-[15px] font-bold"
          aria-hidden="true"
        >
          {customerInitials(registration.customer)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-body text-[18px] leading-[27px] font-bold">
            {customerName(registration.customer)}
          </h3>
          <p className="pt-[5px] text-[13px] leading-[19.5px] wrap-anywhere">
            {registration.customer.email}
          </p>
        </div>
        <ReviewBadge status={registration.status} />
      </div>
      {children}
      <DetailSection title={t('detail.contact')} icon="contact">
        <DetailField label={t('fields.firstName')}>{registration.customer.firstName}</DetailField>
        <DetailField label={t('fields.lastName')}>{registration.customer.lastName}</DetailField>
        <DetailField label="Gmail">{registration.customer.email}</DetailField>
        <DetailField label={t('fields.phone')}>{registration.customer.phone}</DetailField>
      </DetailSection>
      <DetailSection title={t('detail.customer')} icon="company">
        <DetailField label={t('fields.customerType')} full>
          {registration.customerType ? t(`customerType.${registration.customerType}`) : null}
        </DetailField>
        <DetailField label={t('fields.businessName')} full>
          {registration.businessName}
        </DetailField>
        <DetailField label={t('fields.province')}>{registration.province}</DetailField>
        <DetailField label={t('fields.district')}>{registration.district}</DetailField>
        <DetailField label={t('fields.ward')}>{registration.ward}</DetailField>
        <DetailField label={t('fields.deliveryAddress')}>
          {registration.deliveryAddress}
        </DetailField>
        <DetailField label={t('fields.fullDeliveryAddress')} full>
          {registration.fullDeliveryAddress ||
            fullDeliveryAddress(
              registration.deliveryAddress,
              registration.ward,
              registration.district,
              registration.province,
            )}
        </DetailField>
        <DetailField label={t('fields.deliveryNote')} full>
          {registration.deliveryNote}
        </DetailField>
      </DetailSection>
      <DetailSection title={t('detail.invoice')} icon="invoice">
        <DetailField label={t('fields.invoiceSameAsDelivery')} full>
          {registration.invoiceSameAsDelivery === null
            ? null
            : t(registration.invoiceSameAsDelivery ? 'detail.yes' : 'detail.no')}
        </DetailField>
        <DetailField label={t('fields.invoicePurchaser')}>
          {registration.invoicePurchaser}
        </DetailField>
        <DetailField label={t('fields.invoiceTaxCode')}>{registration.invoiceTaxCode}</DetailField>
        <DetailField label={t('fields.invoiceEmail')} full>
          {registration.invoiceEmail}
        </DetailField>
        <DetailField label={t('fields.invoiceAddress')} full>
          {registration.invoiceAddress}
        </DetailField>
      </DetailSection>
      <DetailSection title={t('detail.processing')} icon="history">
        <DetailField label={t('fields.reviewStatus')}>
          <ReviewBadge status={registration.status} />
        </DetailField>
        <DetailField label={t('fields.activation')}>
          <ActivationBadge registration={registration} />
        </DetailField>
        <DetailField label={t('fields.submittedAt')}>
          {registrationDate(registration.submittedAt, i18n.language, true)}
        </DetailField>
        <DetailField label={t('fields.reviewedAt')}>
          {registrationDate(registration.reviewedAt, i18n.language, true)}
        </DetailField>
        <DetailField label={t('fields.reviewNote')} full>
          {registration.reviewNote}
        </DetailField>
        <DetailField label={t('fields.otpSentAt')}>
          {registrationDate(registration.otpSentAt, i18n.language, true)}
        </DetailField>
        <DetailField label={t('fields.activatedAt')}>
          {registrationDate(registration.activatedAt, i18n.language, true)}
        </DetailField>
      </DetailSection>
    </>
  )
}
