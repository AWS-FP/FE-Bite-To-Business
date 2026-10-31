import { useTranslation } from 'react-i18next';
import { getAuthError } from '@/utils/admin/authError';
import AdminButton from './AdminButton';

export default function StaffError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
    const { t } = useTranslation('admin');
    const details = getAuthError(error);

    return (
        <div
            role="alert"
            className="rounded-[3px] border border-[#a52c2c] bg-[#fbeeed] p-4 text-[13px] leading-6"
        >
            <p>
                {details.status === 403
                    ? t('staff.forbidden')
                    : t(details.messageKey, { ns: 'translation' })}
            </p>
            <p className="break-all text-[12px]">
                {t('staff.errorCode')}: {details.code}
                {details.status ? ` · HTTP ${details.status}` : ''}
            </p>
            {onRetry && (
                <AdminButton onClick={onRetry} className="mt-3">
                    {t('actions.retry')}
                </AdminButton>
            )}
        </div>
    );
}
