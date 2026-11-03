import { UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CustomerProfile } from '@/types/customer/profile';

export default function ProfileAccountCard({ profile }: { profile: CustomerProfile }) {
    const { t, i18n } = useTranslation('profile');
    const name = (
        i18n.language === 'vi'
            ? [profile.user.lastName, profile.user.firstName]
            : [profile.user.firstName, profile.user.lastName]
    )
        .filter(Boolean)
        .join(' ');
    const customerType =
        profile.customerType === 'BUSINESS_COOPERATIVE'
            ? t('business')
            : profile.customerType === 'HOUSEHOLD_INDIVIDUAL_BUSINESS'
              ? t('household')
              : t('customer');

    return (
        <div className="flex w-[380px] shrink-0 items-center gap-4 rounded-2xl bg-store-dark px-5 py-4 text-white">
            <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-store-yellow bg-store-cream text-store-green">
                {profile.user.avatarUrl ? (
                    <img src={profile.user.avatarUrl} alt="" className="size-full object-cover" />
                ) : (
                    <UserRound size={26} aria-hidden="true" />
                )}
            </div>
            <div className="min-w-0">
                <h2 className="m-0 mt-1 break-words font-subheading text-lg font-bold">{name}</h2>
                <p className="m-0 mt-1 break-all text-xs text-white/75">{profile.user.email}</p>
                <p className="mb-0 mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">
                    {customerType}
                </p>
            </div>
        </div>
    );
}
