import { useTranslation } from 'react-i18next';
import type { RegistrationStatus } from '@/types/admin/auth';
import type { RegistrationResponse } from '@/types/admin/registration';
import AdminIcon from './AdminIcon';

export function ReviewBadge({ status }: { status: RegistrationStatus }) {
    const { t } = useTranslation('admin');

    if (status === 'PENDING') {
        return (
            <span className="inline-flex items-center gap-[5px] rounded-[3px] border border-black bg-[#fff6df] px-[7px] py-[5px] text-[11px] leading-[15px] font-semibold whitespace-nowrap">
                <span className="size-[4px] rounded-full bg-black" aria-hidden="true" />
                {t('status.PENDING')}
            </span>
        );
    }

    if (status === 'APPROVED') {
        return (
            <span className="inline-flex items-center gap-[5px] rounded-[3px] border border-black bg-[#eaf4ed] px-[7px] py-[5px] text-[11px] leading-[15px] font-semibold whitespace-nowrap">
                <span className="size-[4px] rounded-full bg-black" aria-hidden="true" />
                {t('status.APPROVED')}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-[5px] rounded-[3px] border border-black bg-[#fbeeed] px-[7px] py-[5px] text-[11px] leading-[15px] font-semibold whitespace-nowrap">
            <span className="size-[4px] rounded-full bg-black" aria-hidden="true" />
            {t('status.REJECTED')}
        </span>
    );
}

export function ActivationBadge({ registration }: { registration: RegistrationResponse }) {
    const { t } = useTranslation('admin');

    if (registration.activatedAt) {
        return (
            <span className="inline-flex items-center gap-1 rounded-[3px] border border-black bg-[#eaf4ed] px-[7px] py-[5px] text-[11px] leading-[16.5px] whitespace-nowrap">
                <AdminIcon name="activated" />
                {t('activation.active')}
            </span>
        );
    }

    if (registration.status !== 'APPROVED') {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] leading-[16.5px] whitespace-nowrap">
                {t('activation.inactive')}
            </span>
        );
    }

    if (registration.otpSentAt) {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] leading-[16.5px] whitespace-nowrap">
                <AdminIcon name="waiting" />
                {t('activation.waiting')}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-[3px] border border-black bg-[#fbeeed] px-[7px] py-[5px] text-[11px] leading-[16.5px] whitespace-nowrap">
            <AdminIcon name="otp-failed" />
            {t('activation.otpFailed')}
        </span>
    );
}
