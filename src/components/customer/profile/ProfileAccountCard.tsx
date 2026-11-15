import { Camera, CheckCircle2, ImagePlus, UploadCloud, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { CustomerProfile } from '@/types/customer/profile';
import { uploadCustomerAvatar } from '@/services/customer/profileService';
import { useAuthStore } from '@/store/admin/authStore';
import { getAuthError } from '@/utils/admin/authError';
import AvatarCropper from './AvatarCropper';

export default function ProfileAccountCard({ profile }: { profile: CustomerProfile }) {
    const { t, i18n } = useTranslation(['profile', 'storefront']);
    const ui = (key: string) => t(`storefront:customerUI.${key}`);
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<'choose' | 'crop' | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(
        () => () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        },
        [fileUrl],
    );
    useEffect(() => {
        if (!step) return;
        function onEscape(event: KeyboardEvent) {
            if (event.key === 'Escape' && !uploading) setStep(null);
        }
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, [step, uploading]);

    function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (
            !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
            file.size > 5 * 1024 * 1024 ||
            !file.size
        ) {
            setError(true);
            setMessage(t('avatarInvalid'));
            return;
        }
        setError(false);
        setMessage('');
        setFileUrl(URL.createObjectURL(file));
        setStep('crop');
    }

    async function applyCrop(dataUrl: string) {
        const sessionVersion = useAuthStore.getState().sessionVersion;
        setUploading(true);
        setError(false);
        setMessage('');
        try {
            // AvatarCropper outputs a JPEG; WEBP selections are normalized to JPEG for the BE API.
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'customer-avatar.jpg', {
                type: 'image/jpeg',
            });
            const updated = await uploadCustomerAvatar(file);
            const state = useAuthStore.getState();
            if (
                state.session &&
                state.sessionVersion === sessionVersion &&
                state.session.user.id === updated.user.id
            ) {
                state.updateSession(sessionVersion, {
                    ...state.session,
                    user: updated.user,
                });
                queryClient.setQueryData(['customer-profile', updated.user.id], updated);
                setMessage(t('avatarSaved'));
                setStep(null);
                setFileUrl(null);
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
                        setError(false);
                        setMessage('');
                        setStep('choose');
                    }}
                    aria-label={t('changeAvatar')}
                    disabled={uploading}
                    className="group relative grid size-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-store-yellow bg-store-cream text-store-green disabled:opacity-60"
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
                    <span className="absolute inset-0 grid place-items-center bg-black/35 text-white opacity-0 transition group-hover:opacity-100 group-focus:opacity-100">
                        <Camera size={23} />
                    </span>
                </button>
                <div className="min-w-0">
                    <h2 className="m-0 break-words font-subheading text-lg font-bold">{name}</h2>
                    <p className="m-0 mt-1 break-all text-xs text-white/75">{profile.user.email}</p>
                    <p className="mb-0 mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">
                        {customerType}
                    </p>
                    {uploading && (
                        <p role="status" className="mb-0 mt-2 text-xs">
                            {t('avatarUploading')}
                        </p>
                    )}
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
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={choosePhoto}
            />
            {step && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#061910]/80 p-3 backdrop-blur-sm sm:p-6"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !uploading) setStep(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={ui(step === 'choose' ? 'avatarChooseTitle' : 'avatarCropTitle')}
                        className="my-auto w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-b from-[#0e412d] to-[#08291e] text-white shadow-2xl"
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-store-yellow text-store-green">
                                    <Camera size={23} />
                                </span>
                                <h2 className="m-0 font-subheading text-xl font-extrabold sm:text-2xl">
                                    {ui(
                                        step === 'choose' ? 'avatarChooseTitle' : 'avatarCropTitle',
                                    )}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    if (!uploading) setStep(null);
                                }}
                                type="button"
                                aria-label={ui('avatarCancel')}
                                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/10 text-store-yellow hover:bg-white/20"
                            >
                                <X size={21} />
                            </button>
                        </div>
                        <div className="px-5 pb-6 pt-5 sm:px-7">
                            {step === 'choose' ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => inputRef.current?.click()}
                                        className="flex min-h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-store-yellow/60 bg-white/5 p-8 text-center transition hover:bg-white/10"
                                    >
                                        <span className="grid h-16 w-16 place-items-center rounded-full bg-store-yellow text-store-green">
                                            <ImagePlus size={31} />
                                        </span>
                                        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-store-yellow px-6 py-3 text-sm font-bold text-store-green">
                                            <UploadCloud size={18} />
                                            {ui('avatarUpload')}
                                        </span>
                                        <span className="mt-4 text-xs text-white/70">
                                            {ui('avatarHint')}
                                        </span>
                                    </button>
                                    {profile.user.avatarUrl && (
                                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                                            <h3 className="m-0 text-sm font-bold text-store-yellow">
                                                {ui('avatarRecent')}
                                            </h3>
                                            <img
                                                src={profile.user.avatarUrl}
                                                alt=""
                                                className="mt-4 h-16 w-16 rounded-full border-2 border-store-yellow object-cover"
                                            />
                                        </div>
                                    )}
                                    {error && (
                                        <p role="alert" className="mt-3 text-sm text-red-200">
                                            {message}
                                        </p>
                                    )}
                                </>
                            ) : fileUrl ? (
                                <>
                                    <p className="mt-0 text-center text-xs text-white/75">
                                        {ui('avatarCropHint')}
                                    </p>
                                    <AvatarCropper
                                        key={fileUrl}
                                        src={fileUrl}
                                        onApply={(dataUrl) => {
                                            void applyCrop(dataUrl);
                                        }}
                                        onBack={() => setStep('choose')}
                                    />
                                    {uploading && (
                                        <p
                                            role="status"
                                            className="mt-3 flex items-center gap-2 text-xs text-store-yellow"
                                        >
                                            <CheckCircle2 size={16} />
                                            {t('avatarUploading')}
                                        </p>
                                    )}
                                    {error && (
                                        <p role="alert" className="mt-3 text-xs text-red-200">
                                            {message}
                                        </p>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
