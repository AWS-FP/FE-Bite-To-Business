import { useTranslation } from 'react-i18next'
import { registrationErrorKey } from '@/utils/admin/registration'
import AdminIcon from './AdminIcon'

export function RegistrationError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useTranslation('admin')
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-[3px] border border-black bg-[#fbeeed] p-4 text-[13px] leading-6"
    >
      <AdminIcon name="warning" />
      <span className="min-w-0 flex-1">{t(registrationErrorKey(error))}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-[3px] border border-black bg-white px-3 py-1.5 text-[12px]"
        >
          {t('actions.retry')}
        </button>
      )}
    </div>
  )
}

export function RegistrationLoading() {
  const { t } = useTranslation('admin')
  return (
    <div className="flex min-h-60 items-center justify-center gap-3 p-8 text-[13px]" role="status">
      <AdminIcon name="refresh" className="animate-spin motion-reduce:animate-none" />
      {t('list.loading')}
    </div>
  )
}
