import { useTranslation } from 'react-i18next';
import type { RegistrationStats as RegistrationStatsData } from '@/types/admin/registration';
import AdminIcon from './AdminIcon';

export default function RegistrationStats({ stats }: { stats?: RegistrationStatsData }) {
    const { t } = useTranslation('admin');

    return (
        <div className="mt-6 grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2">
            {/* Tổng hồ sơ đăng ký */}
            <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="font-subheading text-[13px] leading-5 font-semibold">
                        {t('stats.total.title')}
                    </h2>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-store-cream">
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
            <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="font-subheading text-[13px] leading-5 font-semibold">
                        {t('stats.pending.title')}
                    </h2>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-store-yellow">
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
            <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="font-subheading text-[13px] leading-5 font-semibold">
                        {t('stats.approved.title')}
                    </h2>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-store-mint">
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
            <section className="flex min-h-[154px] min-w-0 flex-col rounded-[3px] border border-black bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="font-subheading text-[13px] leading-5 font-semibold">
                        {t('stats.rejected.title')}
                    </h2>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black bg-surface-pink">
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
    );
}
