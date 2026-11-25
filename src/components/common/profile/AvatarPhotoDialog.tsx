import { Camera, Check, ImagePlus, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarCropper from '@/components/customer/profile/AvatarCropper';
import { getAuthError } from '@/utils/admin/authError';

interface AvatarPhotoDialogProps {
    currentUrl: string | null;
    recentUrls: string[];
    loadingHistory?: boolean;
    historyError?: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
    onRestore: (url: string) => Promise<void>;
}

/** Shared photo picker for Customer, Admin, E-commerce, Logistics and Delivery staff. */
export default function AvatarPhotoDialog({
    currentUrl,
    recentUrls,
    loadingHistory = false,
    historyError = false,
    onClose,
    onUpload,
    onRestore,
}: AvatarPhotoDialogProps) {
    const { t } = useTranslation(['profile', 'storefront']);
    const ui = (key: string) => t(`storefront:customerUI.${key}`);
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [step, setStep] = useState<'choose' | 'crop'>('choose');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    useEffect(
        () => () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        },
        [fileUrl],
    );

    useEffect(() => {
        function onEscape(event: KeyboardEvent) {
            if (event.key === 'Escape' && !busy) onClose();
        }
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, [busy, onClose]);

    function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (
            !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
            file.size <= 0 ||
            file.size > 5 * 1024 * 1024
        ) {
            setError(t('profile:avatarInvalid'));
            return;
        }
        setError('');
        setFileUrl(URL.createObjectURL(file));
        setStep('crop');
    }

    async function applyCrop(dataUrl: string) {
        if (busy) return;
        setBusy(true);
        setError('');
        try {
            const blob = await (await fetch(dataUrl)).blob();
            await onUpload(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
            onClose();
        } catch (cause) {
            setError(
                `${t('profile:avatarError')} ${t('profile:errorCode', { code: getAuthError(cause).code })}`,
            );
        } finally {
            setBusy(false);
        }
    }

    async function restore(url: string) {
        if (busy || url === currentUrl) return;
        setBusy(true);
        setError('');
        try {
            await onRestore(url);
            onClose();
        } catch (cause) {
            setError(
                `${ui('avatarRestoreError')} ${t('profile:errorCode', { code: getAuthError(cause).code })}`,
            );
        } finally {
            setBusy(false);
        }
    }

    const photos = [currentUrl, ...recentUrls]
        .filter((url): url is string => !!url && url.startsWith('https://'))
        .filter((url, i, all) => all.indexOf(url) === i);

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#061910]/80 p-3 backdrop-blur-sm sm:p-6"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !busy) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={ui(step === 'choose' ? 'avatarChooseTitle' : 'avatarCropTitle')}
                className="my-auto w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-b from-[#0e412d] to-[#08291e] text-white shadow-2xl"
            >
                <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-store-yellow text-store-green">
                            <Camera size={22} />
                        </span>
                        <h2 className="m-0 font-subheading text-lg font-extrabold sm:text-2xl">
                            {ui(step === 'choose' ? 'avatarChooseTitle' : 'avatarCropTitle')}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        aria-label={ui('avatarCancel')}
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-store-yellow transition hover:bg-white/20 disabled:opacity-50"
                    >
                        <X size={21} />
                    </button>
                </header>
                <div className="px-5 pb-6 pt-5 sm:px-7">
                    {step === 'choose' ? (
                        <>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={choosePhoto}
                                disabled={busy}
                                className="sr-only"
                            />
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                disabled={busy}
                                className="flex min-h-[224px] w-full cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-store-yellow/60 bg-white/5 p-7 text-center transition hover:bg-white/10 disabled:opacity-50"
                            >
                                <span className="grid size-16 place-items-center rounded-full bg-store-yellow text-store-green">
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
                            {(photos.length > 0 || loadingHistory) && (
                                <section className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <h3 className="m-0 text-sm font-bold text-store-yellow">
                                        {ui('avatarRecent')}
                                    </h3>
                                    {loadingHistory && (
                                        <p role="status" className="mt-3 text-xs text-white/70">
                                            {ui('avatarLoading')}
                                        </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        {photos.map((url) => {
                                            const current = url === currentUrl;
                                            return (
                                                <button
                                                    type="button"
                                                    key={url}
                                                    onClick={() => void restore(url)}
                                                    disabled={busy || current}
                                                    aria-label={
                                                        current
                                                            ? ui('avatarCurrent')
                                                            : ui('avatarRestore')
                                                    }
                                                    title={
                                                        current
                                                            ? ui('avatarCurrent')
                                                            : ui('avatarRestore')
                                                    }
                                                    className={`group relative size-16 shrink-0 overflow-hidden rounded-full border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-yellow ${current ? 'border-store-yellow' : 'cursor-pointer border-white/40 hover:scale-105 hover:border-store-yellow'} disabled:cursor-default`}
                                                >
                                                    <img
                                                        src={url}
                                                        alt=""
                                                        className="size-full object-cover"
                                                        loading="lazy"
                                                    />
                                                    {current ? (
                                                        <span className="absolute inset-0 grid place-items-center bg-black/10">
                                                            <Check
                                                                className="text-white drop-shadow"
                                                                size={22}
                                                            />
                                                        </span>
                                                    ) : (
                                                        <span className="absolute inset-0 grid place-items-center bg-black/50 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                                                            {ui('avatarUse')}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}
                            {historyError && (
                                <p role="alert" className="mt-3 text-xs text-amber-200">
                                    {ui('avatarHistoryError')}
                                </p>
                            )}
                        </>
                    ) : fileUrl ? (
                        <>
                            <p className="mb-3 text-center text-xs text-white/75">
                                {ui('avatarCropHint')}
                            </p>
                            <AvatarCropper
                                key={fileUrl}
                                src={fileUrl}
                                onApply={(dataUrl) => void applyCrop(dataUrl)}
                                onBack={() => {
                                    if (!busy) setStep('choose');
                                }}
                            />
                        </>
                    ) : null}
                    {busy && (
                        <p role="status" className="mt-3 text-center text-xs text-store-yellow">
                            {ui('avatarSaving')}
                        </p>
                    )}
                    {error && (
                        <p role="alert" className="mt-3 text-sm text-red-200">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
