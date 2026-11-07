import { Camera, UserRound } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { CustomerProfile } from '@/types/customer/profile';
import { uploadCustomerAvatar } from '@/services/customer/profileService';
import { useAuthStore } from '@/store/admin/authStore';
import { getAuthError } from '@/utils/admin/authError';

export default function ProfileAccountCard({ profile }: { profile: CustomerProfile }) {
    const { t, i18n } = useTranslation('profile');
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    async function changeAvatar(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        setError(false);
        setMessage('');
        if (
            !['image/jpeg', 'image/png'].includes(file.type) ||
            file.size > 5 * 1024 * 1024 ||
            !file.size
        ) {
            setError(true);
            setMessage(t('avatarInvalid'));
            return;
        }
        const sessionVersion = useAuthStore.getState().sessionVersion;
        setUploading(true);
        try {
            const updated = await uploadCustomerAvatar(file);
            const state = useAuthStore.getState();
            if (
                state.session &&
                state.sessionVersion === sessionVersion &&
                state.session.user.id === updated.user.id
            ) {
                state.updateSession(sessionVersion, { ...state.session, user: updated.user });
                queryClient.setQueryData(['customer-profile', updated.user.id], updated);
                setMessage(t('avatarSaved'));
            }
        } catch (uploadError) {
            setError(true);
            setMessage(
                `${t('avatarError')} ${t('errorCode', { code: getAuthError(uploadError).code })}`,
            );
        } finally {
            setUploading(false);
        }
    }
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
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                aria-label={t('changeAvatar')}
                className="relative grid size-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-store-yellow bg-store-cream text-store-green disabled:opacity-60"
            >
                {profile.user.avatarUrl ? (
                    <img src={profile.user.avatarUrl} alt="" className="size-full object-cover" />
                ) : (
                    <UserRound size={26} aria-hidden="true" />
                )}
                <span className="absolute inset-0 grid place-items-center bg-black/25 text-gray-200">
                    <Camera size={20} aria-hidden="true" />
                </span>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={changeAvatar}
            />
            <div className="min-w-0">
                <h2 className="m-0 mt-1 break-words font-subheading text-lg font-bold">{name}</h2>
                <p className="m-0 mt-1 break-all text-xs text-white/75">{profile.user.email}</p>
                <p className="mb-0 mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">
                    {customerType}
                </p>
                {uploading && <p role="status" className="mb-0 mt-2 text-xs">{t('avatarUploading')}</p>}
                {message && (
                    <p
                        role={error ? 'alert' : 'status'}
                        className={`mb-0 mt-2 text-xs ${error ? 'text-red-200' : 'text-green-200'}`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
