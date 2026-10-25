import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { routePaths } from '../../../app/router/routes'
import type { RegistrationResponse } from '../types/registration.types'
import {
  customerInitials,
  customerName,
  registrationCode,
  registrationDate,
} from '../utils/registration'
import AdminIcon from './AdminIcon'
import { ActivationBadge, ReviewBadge } from './RegistrationBadges'

import './RegistrationTable.css'

export default function RegistrationTable({
  rows,
  ascending,
  onSort,
}: {
  rows: RegistrationResponse[]
  ascending: boolean
  onSort: () => void
}) {
  const { t, i18n } = useTranslation('admin')
  const location = useLocation()
  return (
    <div
      className="overflow-x-auto focus-visible:outline-[3px_solid_#ffe14d]"
      role="region"
      aria-label={t('list.tableLabel')}
      tabIndex={0}
    >
      <table className="w-full min-w-[1366px] border-collapse text-left text-[12px] leading-[18px]">
        {/* Độ rộng các cột: họ tên, Gmail, điện thoại, loại khách, doanh nghiệp, ngày gửi, xét duyệt, kích hoạt, thao tác. */}
        <colgroup>
          <col style={{ width: '14.7145%' }} />
          <col style={{ width: '15.0805%' }} />
          <col style={{ width: '7.9063%' }} />
          <col style={{ width: '12.8843%' }} />
          <col style={{ width: '12.9575%' }} />
          <col style={{ width: '7.3206%' }} />
          <col style={{ width: '8.1259%' }} />
          <col style={{ width: '10.8346%' }} />
          <col style={{ width: '10.1757%' }} />
        </colgroup>
        <thead className="border-y border-black bg-[#fff8e8] font-semibold">
          <tr className="h-[47px] [&_th]:px-3 [&_th]:py-[14px] [&_th]:font-semibold">
            <th scope="col" className="pl-[22px]!">
              {t('fields.name')}
            </th>
            <th scope="col">Gmail</th>
            <th scope="col">{t('fields.phone')}</th>
            <th scope="col">{t('fields.customerType')}</th>
            <th scope="col">{t('fields.businessShort')}</th>
            <th scope="col" aria-sort={ascending ? 'ascending' : 'descending'}>
              <button
                type="button"
                onClick={onSort}
                className="flex items-center gap-1 border-0 bg-transparent p-0 text-left font-semibold"
                aria-label={t(ascending ? 'actions.sortNewest' : 'actions.sortOldest')}
              >
                {t('fields.submittedShort')}
                <AdminIcon name="sort" className={ascending ? 'rotate-180' : ''} />
              </button>
            </th>
            <th scope="col">{t('fields.reviewStatus')}</th>
            <th scope="col">{t('fields.activation')}</th>
            <th scope="col" className="sticky right-0 border-l border-black bg-[#fff8e8]">
              {t('fields.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((registration) => (
            <tr
              key={registration.id}
              className="group h-[78px] border-b border-black last:border-b-0 hover:bg-[#fffdf5] [&_td]:px-3 [&_td]:py-[18px]"
            >
              <td className="pl-[22px]!">
                <div className="flex items-center gap-[9px]">
                  <span
                    className="admin-customer-avatar grid size-[34px] shrink-0 place-items-center rounded-full border border-black text-[11px] font-bold"
                    aria-hidden="true"
                  >
                    {customerInitials(registration.customer)}
                  </span>
                  <div className="min-w-0">
                    <strong
                      className="block max-w-[130px] truncate text-[13px] leading-[19.5px] font-semibold"
                      title={customerName(registration.customer)}
                    >
                      {customerName(registration.customer)}
                    </strong>
                    <small
                      className="block pt-[3px] font-body text-[11px]"
                      title={registration.customer.id}
                    >
                      {registrationCode(registration.customer.id)}
                    </small>
                  </div>
                </div>
              </td>
              <td>
                <span className="block max-w-[182px] truncate" title={registration.customer.email}>
                  {registration.customer.email}
                </span>
              </td>
              <td className="whitespace-nowrap">{registration.customer.phone}</td>
              <td>
                <span className="inline-flex items-center gap-[5px] whitespace-nowrap">
                  <AdminIcon
                    name={
                      registration.customerType === 'BUSINESS_COOPERATIVE'
                        ? 'business'
                        : 'household'
                    }
                  />
                  {registration.customerType === 'BUSINESS_COOPERATIVE' &&
                    t('customerType.BUSINESS_COOPERATIVE')}
                  {registration.customerType === 'HOUSEHOLD_INDIVIDUAL_BUSINESS' &&
                    t('customerType.HOUSEHOLD_INDIVIDUAL_BUSINESS')}
                  {!registration.customerType && '—'}
                </span>
              </td>
              <td>
                <span
                  className="block max-w-[180px] truncate"
                  title={registration.businessName || undefined}
                >
                  {registration.businessName || '—'}
                </span>
              </td>
              <td className="whitespace-nowrap">
                {registrationDate(registration.submittedAt, i18n.language)}
              </td>
              <td>
                <ReviewBadge status={registration.status} />
              </td>
              <td>
                <ActivationBadge registration={registration} />
              </td>
              <td className="sticky right-0 border-l border-black bg-white group-hover:bg-[#fffdf5]">
                <Link
                  to={{
                    pathname: routePaths.adminRegistrationDetail(registration.id),
                    search: location.search,
                  }}
                  state={{ fromRegistrations: true }}
                  aria-label={t('actions.viewNamed', { name: customerName(registration.customer) })}
                  className="inline-flex min-h-9 items-center justify-center gap-[6px] rounded-[3px] border border-black bg-white px-[10px] py-2 text-[12px] whitespace-nowrap no-underline hover:bg-[#fff3b1]"
                >
                  <AdminIcon name="eye" />
                  {t('actions.view')}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
