import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useSearchParams } from 'react-router-dom'
import AdminIcon from '@/components/admin/AdminIcon'
import { RegistrationError, RegistrationLoading } from '@/components/admin/RegistrationFeedback'
import RegistrationPagination from '@/components/admin/RegistrationPagination'
import RegistrationStats from '@/components/admin/RegistrationStats'
import RegistrationTable from '@/components/admin/RegistrationTable'
import { useRegistrations, useRegistrationStats } from '@/hooks/admin/useRegistrations'
import {
  readCustomerType,
  readRegistrationPage,
  readRegistrationStatus,
} from '@/utils/admin/registration'

export default function RegistrationsPage() {
  const { t } = useTranslation('admin')
  const [searchParams, setSearchParams] = useSearchParams()
  const status = readRegistrationStatus(searchParams.get('status'))
  const page = readRegistrationPage(searchParams.get('page'))
  const customerType = readCustomerType(searchParams.get('customerType'))
  const keyword = (searchParams.get('keyword') || '').slice(0, 254)
  const direction = searchParams.get('direction') === 'ASC' ? 'ASC' : 'DESC'
  const statsQuery = useRegistrationStats()
  const registrationQuery = useRegistrations({
    allStatuses: status === 'ALL',
    status: status === 'ALL' ? undefined : status,
    page,
    size: 6,
    keyword: keyword || undefined,
    customerType,
    direction,
  })

  useEffect(() => {
    document.title = `${t('navigation.registrations')} | Bite to Business`
  }, [t])

  // Đổi bộ lọc thì về trang đầu; đổi số trang thì giữ nguyên các bộ lọc.
  function handleFilterChange(name: string, value: string, replace = false) {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams)
        if (value) {
          nextParams.set(name, value)
        } else {
          nextParams.delete(name)
        }
        if (name !== 'page') nextParams.delete('page')
        return nextParams
      },
      { replace },
    )
  }

  function handleRefresh() {
    void registrationQuery.refetch()
    void statsQuery.refetch()
  }

  function handleSort() {
    handleFilterChange('direction', direction === 'ASC' ? 'DESC' : 'ASC')
  }

  // Sau khi duyệt hồ sơ cuối cùng của một trang, quay về trang còn dữ liệu.
  useEffect(() => {
    if (!registrationQuery.data || page === 0 || page < registrationQuery.data.totalPages) return

    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams)
        nextParams.set('page', String(Math.max(0, registrationQuery.data.totalPages - 1)))
        return nextParams
      },
      { replace: true },
    )
  }, [registrationQuery.data, page, setSearchParams])

  return (
    <>
      <div className="flex min-h-[55px] items-start justify-between gap-4">
        <h1 className="font-body text-[34px] leading-[44px] font-bold tracking-[-1px] max-[600px]:text-[27px]">
          {t('navigation.registrations')}
        </h1>
        <span className="mt-1 mr-2 rotate-5 border-2 border-black bg-[#fff8e8] px-[17px] py-[13px] text-[11px] leading-[16.5px] font-extrabold whitespace-nowrap max-[600px]:hidden">
          {t('list.stamp')}
        </span>
      </div>

      <RegistrationStats stats={statsQuery.data} />

      {statsQuery.isError && (
        <div className="mt-4">
          <RegistrationError
            error={statsQuery.error}
            onRetry={() => {
              void statsQuery.refetch()
            }}
          />
        </div>
      )}

      <section
        className="mt-[27px] min-w-0 rounded-[3px] border border-black bg-white"
        aria-labelledby="registration-list-title"
      >
        <div className="flex items-start justify-between gap-3 px-[22px] pt-[22px]">
          <div>
            <h2
              id="registration-list-title"
              className="flex flex-wrap items-center gap-[9px] font-body text-[18px] leading-[27px] font-bold"
            >
              {t('list.title')}
              <span className="rounded-[2px] border border-black bg-[#d9eea3] px-[7px] py-0.5 text-[11px] leading-[17px] font-semibold">
                {registrationQuery.data
                  ? t('list.count', { count: registrationQuery.data.totalElements })
                  : '—'}
              </span>
            </h2>
            <p className="pt-[7px] text-[12px] leading-5">{t('list.description')}</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={registrationQuery.isFetching || statsQuery.isFetching}
            aria-label={t('actions.refresh')}
            title={t('actions.refresh')}
            className="grid size-[38px] shrink-0 place-items-center rounded-[3px] border border-black bg-white p-[10px] hover:bg-[#fff8e8] disabled:opacity-60"
          >
            <AdminIcon
              name="refresh"
              className={
                registrationQuery.isFetching ? 'animate-spin motion-reduce:animate-none' : ''
              }
            />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-[22px] py-5">
          {/* Bốn nút lọc trạng thái: nhãn và số đếm được viết trực tiếp tại đây. */}
          <div
            className="flex max-w-full overflow-x-auto rounded-[3px] border border-black"
            role="group"
            aria-label={t('list.filterStatus')}
          >
            <button
              type="button"
              onClick={() => handleFilterChange('status', 'ALL')}
              aria-pressed={status === 'ALL'}
              className="flex min-h-[39px] shrink-0 items-center gap-[6px] border-0 border-r border-black bg-white px-[10px] py-[10px] text-[12px] leading-[18px] whitespace-nowrap aria-pressed:bg-[#ffe14d] aria-pressed:font-bold"
            >
              {t('status.ALL')}
              <span className="rounded-[2px] border border-black bg-[#fff8e8] px-1 text-[10px] leading-[15px]">
                {statsQuery.data?.total ?? '—'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('status', 'PENDING')}
              aria-pressed={status === 'PENDING'}
              className="flex min-h-[39px] shrink-0 items-center gap-[6px] border-0 border-r border-black bg-white px-[10px] py-[10px] text-[12px] leading-[18px] whitespace-nowrap aria-pressed:bg-[#ffe14d] aria-pressed:font-bold"
            >
              {t('status.PENDING')}
              <span className="rounded-[2px] border border-black bg-[#fff8e8] px-1 text-[10px] leading-[15px]">
                {statsQuery.data?.pending ?? '—'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('status', 'APPROVED')}
              aria-pressed={status === 'APPROVED'}
              className="flex min-h-[39px] shrink-0 items-center gap-[6px] border-0 border-r border-black bg-white px-[10px] py-[10px] text-[12px] leading-[18px] whitespace-nowrap aria-pressed:bg-[#ffe14d] aria-pressed:font-bold"
            >
              {t('status.APPROVED')}
              <span className="rounded-[2px] border border-black bg-[#fff8e8] px-1 text-[10px] leading-[15px]">
                {statsQuery.data?.approved ?? '—'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('status', 'REJECTED')}
              aria-pressed={status === 'REJECTED'}
              className="flex min-h-[39px] shrink-0 items-center gap-[6px] border-0 border-black bg-white px-[10px] py-[10px] text-[12px] leading-[18px] whitespace-nowrap aria-pressed:bg-[#ffe14d] aria-pressed:font-bold"
            >
              {t('status.REJECTED')}
              <span className="rounded-[2px] border border-black bg-[#fff8e8] px-1 text-[10px] leading-[15px]">
                {statsQuery.data?.rejected ?? '—'}
              </span>
            </button>
          </div>

          {/* Tìm kiếm và lọc loại Customer */}
          <div className="flex flex-wrap gap-[9px] max-[600px]:w-full">
            <label className="flex h-[41px] w-[240px] items-center gap-2 rounded-[3px] border border-black bg-white px-[10px] focus-within:outline-[3px_solid_#ffe14d] max-[600px]:w-full">
              <AdminIcon name="search" />
              <span className="sr-only">{t('list.search')}</span>
              <input
                type="search"
                value={keyword}
                maxLength={254}
                onChange={(event) => handleFilterChange('keyword', event.target.value, true)}
                placeholder={t('list.search')}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-[11px] outline-none placeholder:text-[#555]"
              />
            </label>
            <label className="relative flex h-[41px] w-[212px] items-center gap-[6px] rounded-[3px] border border-black bg-white pl-[9px] focus-within:outline-[3px_solid_#ffe14d] max-[600px]:w-full">
              <AdminIcon name="filter" />
              <span className="sr-only">{t('list.filterType')}</span>
              <select
                value={customerType || ''}
                onChange={(event) => handleFilterChange('customerType', event.target.value)}
                className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent py-1 pr-7 pl-1 font-body text-[12px] outline-none"
              >
                <option value="">{t('list.filterType')}</option>
                <option value="HOUSEHOLD_INDIVIDUAL_BUSINESS">
                  {t('customerType.HOUSEHOLD_INDIVIDUAL_BUSINESS')}
                </option>
                <option value="BUSINESS_COOPERATIVE">
                  {t('customerType.BUSINESS_COOPERATIVE')}
                </option>
              </select>
              <span className="pointer-events-none absolute right-2.5">
                <AdminIcon name="dropdown" />
              </span>
            </label>
          </div>
        </div>

        {/* Mỗi trạng thái hiển thị thành một khối riêng. */}
        {registrationQuery.isPending && <RegistrationLoading />}

        {registrationQuery.isError && (
          <div className="p-[22px]">
            <RegistrationError error={registrationQuery.error} onRetry={handleRefresh} />
          </div>
        )}

        {registrationQuery.isSuccess && registrationQuery.data.content.length > 0 && (
          <RegistrationTable
            rows={registrationQuery.data.content}
            ascending={direction === 'ASC'}
            onSort={handleSort}
          />
        )}

        {registrationQuery.isSuccess && registrationQuery.data.content.length === 0 && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 border-t border-black px-6 py-12 text-center">
            <span className="grid size-12 place-items-center rounded-full border border-black bg-[#fff8e8]">
              <AdminIcon name="total" />
            </span>
            <h3 className="font-body text-[16px] font-bold">{t('list.empty')}</h3>
            <p className="text-[13px] leading-6">
              {keyword || customerType || status !== 'ALL'
                ? t('list.emptyFiltered')
                : t('list.emptyDescription')}
            </p>
          </div>
        )}

        {registrationQuery.isSuccess && (
          <RegistrationPagination
            page={page}
            size={6}
            total={registrationQuery.data.totalElements}
            totalPages={registrationQuery.data.totalPages}
            onPage={(nextPage) => handleFilterChange('page', String(nextPage))}
          />
        )}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 pt-[25px] text-[11px] leading-[16.5px]">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <p className="flex items-center gap-[6px]">
          <AdminIcon name="lock" />
          {t('footer.adminOnly')}
        </p>
      </footer>

      <Outlet />
    </>
  )
}
