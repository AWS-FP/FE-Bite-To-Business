import { Camera, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { CustomerProfile } from '@/types/customer/profile';
import {
    getCustomerAvatarHistory,
    restoreCustomerAvatar,
    uploadCustomerAvatar,
} from '@/services/customer/profileService';
import AvatarPhotoDialog from '@/components/common/profile/AvatarPhotoDialog';
import { useAuthStore } from '@/store/admin/authStore';

/** Migrate earlier browser-only thumbnail history without trusting client URLs in the restore API. */
function readLegacyHistory(userId: string): string[] {
    try {
        const parsed: unknown = JSON.parse(
            localStorage.getItem(`btb:customer-avatar-history:${userId}`) || '[]',
        );
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((url): url is string => {
                if (typeof url !== 'string') return false;
                try {
                    const parsedUrl = new URL(url);
                    return (
                        parsedUrl.protocol === 'https:' &&
                        parsedUrl.hostname === 'res.cloudinary.com' &&
                        parsedUrl.pathname.includes('/image/upload/') &&
                        parsedUrl.pathname.includes('/avatars/')
                    );
                } catch {
                    return false;
                }
            })
            .slice(0, 6);
    } catch {
        return [];
    }
}

/** Legacy photos are re-uploaded like any other user-supplied photo, not assigned by URL. */
async function reuploadLegacyPhoto(url: string): Promise<CustomerProfile> {
    const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!response.ok) throw new Error('Unable to retrieve older photo');
    const original = await response.blob();
    if (!original.size || original.size > 5 * 1024 * 1024 || !original.type.startsWith('image/')) {
        throw new Error('Invalid previous photo');
    }
    const bitmap = await createImageBitmap(original);
    try {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
        canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
        canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to restore photo');
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (result) =>
                    result ? resolve(result) : reject(new Error('Unable to convert photo')),
                'image/jpeg',
                0.9,
            );
        });
        return uploadCustomerAvatar(
            new File([blob], 'previous-avatar.jpg', { type: 'image/jpeg' }),
        );
    } finally {
        bitmap.close();
    }
}

export default function ProfileAccountCard({ profile }: { profile: CustomerProfile }) {
    const { t, i18n } = useTranslation('profile');
    const queryClient = useQueryClient();
    const [photoOpen, setPhotoOpen] = useState(false);
    const [recent, setRecent] = useState<string[]>([]);
    const [legacyRecent] = useState<string[]>(() => readLegacyHistory(profile.user.id));
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!photoOpen) return;
        let active = true;
        getCustomerAvatarHistory()
            .then((urls) => {
                if (active) setRecent(urls);
            })
            .catch(() => {
                if (active) {
                    setRecent([]);
                    setHistoryError(true);
                }
            })
            .finally(() => {
                if (active) setLoadingHistory(false);
            });
        return () => {
            active = false;
        };
    }, [photoOpen, profile.user.id]);

    function applyUpdatedProfile(updated: CustomerProfile, sessionVersion: number) {
        const state = useAuthStore.getState();
        // A stale upload response must not overwrite a different login session.
        if (
            !state.session ||
            state.sessionVersion !== sessionVersion ||
            state.session.user.id !== updated.user.id
        )
            return;
        state.updateSession(sessionVersion, { ...state.session, user: updated.user });
        queryClient.setQueryData(['customer-profile', updated.user.id], updated);
        setMessage(t('avatarSaved'));
    }

    async function upload(file: File) {
        const sessionVersion = useAuthStore.getState().sessionVersion;
        const updated = await uploadCustomerAvatar(file);
        applyUpdatedProfile(updated, sessionVersion);
    }

    async function restore(url: string) {
        const sessionVersion = useAuthStore.getState().sessionVersion;
        const updated = recent.includes(url)
            ? await restoreCustomerAvatar(url)
            : await reuploadLegacyPhoto(url);
        applyUpdatedProfile(updated, sessionVersion);
    }

    const name = (
        i18n.resolvedLanguage?.startsWith('vi')
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
        <>
            <div className="flex w-full max-w-[380px] shrink-0 items-center gap-4 rounded-2xl bg-store-dark px-5 py-4 text-white">
                <button
                    type="button"
                    onClick={() => {
                        setMessage('');
                        setLoadingHistory(true);
                        setHistoryError(false);
                        setPhotoOpen(true);
                    }}
                    aria-label={t('changeAvatar')}
                    className="group relative grid size-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-store-yellow bg-store-cream text-store-green"
                >
                    {profile.user.avatarUrl ? (
                        <img
                            src={profile.user.avatarUrl}
                            alt=""
                            className="size-full object-cover"
                        />
                    ) : (
                        <UserRound size={27} />
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-black/35 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Camera size={23} />
                    </span>
                </button>
                <div className="min-w-0">
                    <h2 className="m-0 break-words font-subheading text-lg font-bold">{name}</h2>
                    <p className="m-0 mt-1 break-all text-xs text-white/75">{profile.user.email}</p>
                    <p className="mb-0 mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">
                        {customerType}
                    </p>
                    {message && (
                        <p role="status" className="mb-0 mt-2 text-xs text-green-200">
                            {message}
                        </p>
                    )}
                </div>
            </div>
            {photoOpen && (
                <AvatarPhotoDialog
                    currentUrl={profile.user.avatarUrl}
                    recentUrls={[...recent, ...legacyRecent]}
                    loadingHistory={loadingHistory}
                    historyError={historyError}
                    onClose={() => setPhotoOpen(false)}
                    onUpload={upload}
                    onRestore={restore}
                />
            )}
        </>
    );
}
