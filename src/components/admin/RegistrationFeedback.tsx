import TableSkeleton from '@/components/common/TableSkeleton';
import Skeleton from '@/components/common/Skeleton';
import { useTranslation } from 'react-i18next';
import { registrationErrorKey } from '@/utils/admin/registration';
import AdminIcon from './AdminIcon';

export function RegistrationError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
    const { t } = useTranslation('admin');
    return (
        <div
            role="alert"
            className="flex flex-wrap items-center gap-3 rounded-[3px] border border-black bg-surface-pink p-4 text-[13px] leading-6"
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
    );
}

export function RegistrationLoading({ detail = false }: { detail?: boolean }) {
    if (detail) return <div aria-busy="true" className="space-y-4 p-6"><Skeleton className="h-8 w-1/2"/><div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 8 }, (_, i) => <div key={i} className="space-y-2"><Skeleton className="h-3 w-24"/><Skeleton className="h-10 w-full"/></div>)}</div></div>;
    return <TableSkeleton columns={9} image tableClass="w-full min-w-[1366px] border-collapse text-left text-[13px]" headerClass="h-[47px] border-y border-black bg-store-cream px-3" cellClass="px-3 py-[18px]" rowClass="h-[78px] border-b border-store-line" />;
}
