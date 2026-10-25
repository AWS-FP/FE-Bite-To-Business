import { useTranslation } from 'react-i18next'
import type { RegistrationStats as RegistrationStatsData } from '../types/registration.types'
import AdminIcon from './AdminIcon'

export default function RegistrationStats({ stats }: { stats?: RegistrationStatsData }) {
  const { t } = useTranslation('admin')

  return (
    <div className="mt-[26px] grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[420px]:gap-2.5">
      {/* Tổng hồ sơ đăng ký */}
      <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white px-[19px] pt-[18px] pb-4 max-[600px]:px-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-body text-[13px] leading-5 font-semibold">
            {t('stats.total.title')}
          </h2>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-[#fff8e8]">
            <AdminIcon name="total" />
          </span>
        </div>
        <strong className="mt-2 font-display text-[40px] leading-[48px] font-bold tracking-[-1px]">
          {stats ? String(stats.total).padStart(2, '0') : '—'}
        </strong>
        <p className="mt-auto flex items-center gap-1 pt-[9px] text-[11px] leading-[18px]">
          <AdminIcon name="trend" />
          {t('stats.total.description')}
        </p>
      </section>

      {/* Hồ sơ chờ duyệt */}
      <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white px-[19px] pt-[18px] pb-4 max-[600px]:px-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-body text-[13px] leading-5 font-semibold">
            {t('stats.pending.title')}
          </h2>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-[#ffe14d]">
            <AdminIcon name="pending" />
          </span>
        </div>
        <strong className="mt-2 font-display text-[40px] leading-[48px] font-bold tracking-[-1px]">
          {stats ? String(stats.pending).padStart(2, '0') : '—'}
        </strong>
        <p className="mt-auto flex items-center gap-1 pt-[9px] text-[11px] leading-[18px]">
          {t('stats.pending.description')}
        </p>
      </section>

      {/* Hồ sơ đã duyệt */}
      <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white px-[19px] pt-[18px] pb-4 max-[600px]:px-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-body text-[13px] leading-5 font-semibold">
            {t('stats.approved.title')}
          </h2>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-[#d9eea3]">
            <AdminIcon name="approved" />
          </span>
        </div>
        <strong className="mt-2 font-display text-[40px] leading-[48px] font-bold tracking-[-1px]">
          {stats ? String(stats.approved).padStart(2, '0') : '—'}
        </strong>
        <p className="mt-auto flex items-center gap-1 pt-[9px] text-[11px] leading-[18px]">
          {t('stats.approved.description')}
        </p>
      </section>

      {/* Hồ sơ bị từ chối */}
      <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white px-[19px] pt-[18px] pb-4 max-[600px]:px-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-body text-[13px] leading-5 font-semibold">
            {t('stats.rejected.title')}
          </h2>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-[#ffb4ba]">
            <AdminIcon name="rejected" />
          </span>
        </div>
        <strong className="mt-2 font-display text-[40px] leading-[48px] font-bold tracking-[-1px]">
          {stats ? String(stats.rejected).padStart(2, '0') : '—'}
        </strong>
        <p className="mt-auto flex items-center gap-1 pt-[9px] text-[11px] leading-[18px]">
          {t('stats.rejected.description')}
        </p>
      </section>
    </div>
  )
}
