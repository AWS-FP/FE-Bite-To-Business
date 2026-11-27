import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    busy?: boolean;
    error?: string;
    danger?: boolean;
    workspace?: boolean;
    confirmDisabled?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel,
    cancelLabel,
    busy = false,
    error,
    danger = false,
    workspace = false,
    confirmDisabled = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const { i18n } = useTranslation();

    const isEnglish = (i18n.resolvedLanguage ?? i18n.language ?? 'vi').startsWith('en');

    const titleId = useId();
    const messageId = useId();

    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelButton = useRef<HTMLButtonElement>(null);

    const cancelRef = useRef(onCancel);
    const busyRef = useRef(busy);

    useEffect(() => {
        cancelRef.current = onCancel;
        busyRef.current = busy;
    }, [onCancel, busy]);

    useEffect(() => {
        if (!open) return;

        const previousFocus =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;

        if (busyRef.current) {
            dialogRef.current?.focus();
        } else {
            cancelButton.current?.focus();
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();

                if (!busyRef.current) {
                    cancelRef.current();
                }

                return;
            }

            if (event.key !== 'Tab') return;

            const dialog = dialogRef.current;

            if (!dialog) return;

            const elements = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
                ),
            ).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);

            const first = elements[0];
            const last = elements[elements.length - 1];
            const active = document.activeElement;

            if (!first || !last) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            if (
                !dialog.contains(active) ||
                active === dialog ||
                (event.shiftKey && active === first) ||
                (!event.shiftKey && active === last)
            ) {
                event.preventDefault();

                if (event.shiftKey) {
                    last.focus();
                } else {
                    first.focus();
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);

            if (previousFocus?.isConnected) {
                previousFocus.focus();
            }
        };
    }, [open]);

    useEffect(() => {
        if (open && busy) {
            dialogRef.current?.focus();
        }
    }, [open, busy]);

    if (!open) return null;

    return createPortal(
        <div
            className={`fixed inset-0 ${
                workspace ? 'z-[600]' : 'z-[100]'
            } flex items-center justify-center bg-black/40 p-6`}
            onClick={() => {
                if (!busy) onCancel();
            }}
        >
            <div
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-busy={busy}
                aria-labelledby={titleId}
                aria-describedby={messageId}
                onClick={(event) => event.stopPropagation()}
                className={`w-full max-w-md rounded-xl p-6 text-left ${
                    workspace
                        ? 'border border-[#dce9dc] bg-[#fffaf0] text-[#173e2e] shadow-2xl'
                        : 'border-2 border-black bg-white text-black'
                }`}
            >
                <h2 id={titleId} className="font-subheading text-xl font-bold">
                    {title}
                </h2>

                <div id={messageId} className="mt-4 break-words text-sm leading-6">
                    {message}
                </div>

                {error && (
                    <p role="alert" className="mt-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                        ref={cancelButton}
                        type="button"
                        disabled={busy}
                        onClick={onCancel}
                        className={`rounded border bg-white px-4 py-2 text-sm font-semibold hover:bg-store-cream disabled:cursor-not-allowed disabled:opacity-50 ${
                            workspace
                                ? 'border-[#a4c4ad] text-[#173e2e]'
                                : 'border-black text-black'
                        }`}
                    >
                        {cancelLabel ?? (isEnglish ? 'Cancel' : 'Hủy')}
                    </button>

                    <button
                        type="button"
                        disabled={busy || confirmDisabled}
                        onClick={() => {
                            if (!busy && !confirmDisabled) {
                                onConfirm();
                            }
                        }}
                        className={`rounded border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                            danger
                                ? 'border-red-700 bg-red-700 text-white hover:bg-red-800'
                                : workspace
                                  ? 'border-[#173e2e] bg-store-yellow text-[#173e2e] hover:brightness-95'
                                  : 'border-black bg-store-yellow text-black hover:brightness-95'
                        }`}
                    >
                        {busy
                            ? isEnglish
                                ? 'Processing...'
                                : 'Đang xử lý...'
                            : (confirmLabel ?? (isEnglish ? 'Confirm' : 'Xác nhận'))}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
