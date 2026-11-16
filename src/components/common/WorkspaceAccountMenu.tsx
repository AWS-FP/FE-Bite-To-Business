import { Camera, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { AuthUser } from '@/types/admin/auth';
import { uploadWorkspaceAvatar } from '@/services/workspaceProfileService';
import { useAuthStore } from '@/store/admin/authStore';
import { getAuthError } from '@/utils/admin/authError';

interface WorkspaceAccountMenuProps {
    user: AuthUser | null;
    roleLabel: string;
}

export default function WorkspaceAccountMenu({ user, roleLabel }: WorkspaceAccountMenuProps) {
    const { t } = useTranslation('admin');
    const { t: profileText } = useTranslation('profile');
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(location.state?.openAccountSettings === true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const detailsId = useId();

    useEffect(() => {
        if (!isOpen) return;

        function handleOutsideClick(event: PointerEvent) {
            if (event.target instanceof Node && !accountRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    async function changeAvatar(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || !user) return;

        setMessage('');
        setError(false);
        if (!['image/jpeg', 'image/png'].includes(file.type) || !file.size || file.size > 5 * 1024 * 1024) {
            setError(true);
            setMessage(profileText('avatarInvalid'));
            return;
        }

        const sessionVersion = useAuthStore.getState().sessionVersion;
        setUploading(true);
        try {
            const updated = await uploadWorkspaceAvatar(file);
            const state = useAuthStore.getState();
            if (state.session && state.sessionVersion === sessionVersion && state.session.user.id === updated.id) {
                state.updateSession(sessionVersion, { ...state.session, user: updated });
                setMessage(profileText('avatarSaved'));
            }
        } catch (uploadError) {
            setError(true);
            setMessage(`${profileText('avatarError')} ${profileText('errorCode', { code: getAuthError(uploadError).code })}`);
        } finally {
            setUploading(false);
        }
    }

    if (!user) return null;

    const displayName = `${user.lastName} ${user.firstName}`.trim() || user.email;
    const initials =
        `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`.toUpperCase() ||
        user.email.charAt(0).toUpperCase();

    return (
        <div className="admin-account relative" ref={accountRef}>
            <button
                className="admin-account-button group/account flex min-h-[51px] items-center gap-[9px] rounded-[2px] border border-black bg-white p-[7px] text-left text-black"
                ref={buttonRef}
                type="button"
                aria-label={t('header.accountMenu', { name: displayName })}
                aria-expanded={isOpen}
                aria-controls={detailsId}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span
                    className="admin-avatar grid size-[35px] shrink-0 place-items-center overflow-hidden rounded-full border border-black bg-store-mint text-[11px] leading-[16.5px] font-bold"
                    aria-hidden="true"
                >
                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-full object-cover" /> : initials}
                </span>
                <span className="admin-account-label flex flex-col gap-[2px]">
                    <strong className="max-w-40 overflow-hidden text-[13px] leading-[19.5px] font-bold text-ellipsis whitespace-nowrap">
                        {displayName}
                    </strong>
                    <span className="font-subtext text-[10px] leading-[15px] font-medium whitespace-nowrap">
                        {roleLabel}
                    </span>
                </span>
                <img
                    className="admin-account-chevron ml-[3px] block shrink-0 group-aria-expanded/account:rotate-180"
                    src="/images/admin/chevron-down.svg"
                    alt=""
                    width={14}
                    height={19}
                />
            </button>

            {isOpen && (
                <div
                    className="admin-account-popover absolute top-[calc(100%+12px)] right-0 z-50 w-[270px] border border-black bg-white p-4 text-[13px] leading-[1.6] wrap-anywhere shadow-[4px_4px_0_var(--color-black)]"
                    id={detailsId}
                >
                    <div className="admin-account-popover-heading mb-[10px] flex items-center justify-between gap-2 border-b border-store-line pb-[10px]">
                        <strong className="font-subheading">{t('header.accountDetails')}</strong>
                        <button
                            className="admin-icon-button grid place-items-center border-0 bg-transparent p-[3px] text-black hover:bg-black/5"
                            type="button"
                            aria-label={t('header.closeAccount')}
                            onClick={() => {
                                setIsOpen(false);
                                buttonRef.current?.focus();
                            }}
                        >
                            <X size={16} aria-hidden="true" />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="relative mx-auto mb-3 grid size-20 place-items-center overflow-hidden rounded-full border-2 border-store-yellow bg-store-mint text-lg font-bold disabled:opacity-60"
                        aria-label={profileText('changeAvatar')}
                        disabled={uploading}
                        onClick={() => inputRef.current?.click()}
                    >
                        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-full object-cover" /> : initials}
                        <span className="absolute inset-0 grid place-items-center bg-black/25 text-gray-200">
                            <Camera size={20} aria-hidden="true" />
                        </span>
                    </button>
                    <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="sr-only" onChange={changeAvatar} />
                    {uploading && <p role="status" className="mb-2 text-xs">{profileText('avatarUploading')}</p>}
                    {message && <p role={error ? 'alert' : 'status'} className={`mb-2 text-xs ${error ? 'text-danger' : 'text-store-green'}`}>{message}</p>}
                    <p>{displayName}</p>
                    <p className="admin-account-email font-subtext text-[12px] text-store-muted wrap-anywhere">
                        {user.email}
                    </p>
                    <span className="admin-account-role mt-3 inline-block border border-black bg-store-mint px-2 py-[3px] font-label text-[11px]">
                        {roleLabel}
                    </span>
                </div>
            )}
        </div>
    );
}
