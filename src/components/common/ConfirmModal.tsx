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
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    busy = false,
    error,
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const { i18n } = useTranslation();
    const titleId = useId();
    const messageId = useId();
    const cancelButton = useRef<HTMLButtonElement>(null);
    const dialog = useRef<HTMLDivElement>(null);
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
        cancelButton.current?.focus();
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.stopPropagation();
                if (!busyRef.current) cancelRef.current();
            }
            if (event.key !== 'Tab') return;
            const buttons = Array.from(
                dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
            );
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (!first) {
                event.preventDefault();
                dialog.current?.focus();
            } else if (
                event.shiftKey &&
                (document.activeElement === first ||
                    !dialog.current?.contains(document.activeElement))
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                (document.activeElement === last ||
                    !dialog.current?.contains(document.activeElement))
            ) {
                event.preventDefault();
                first.focus();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previousFocus?.focus();
        };
    }, [open]);

    if (!open) return null;
    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6"
            onClick={() => !busy && onCancel()}
        >
            <div
                ref={dialog}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={messageId}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-xl border-2 border-black bg-white p-6 text-left text-black"
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
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        ref={cancelButton}
                        type="button"
                        disabled={busy}
                        onClick={onCancel}
                        className="rounded border border-black bg-white px-4 py-2 text-sm font-semibold hover:bg-store-cream disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onConfirm}
                        className={`rounded border px-4 py-2 text-sm font-semibold disabled:opacity-50 ${danger ? 'border-red-700 bg-red-700 text-white hover:bg-red-800' : 'border-black bg-store-yellow text-black hover:brightness-95'}`}
                    >
                        {busy
                            ? i18n.resolvedLanguage === 'en'
                                ? 'Processing...'
                                : 'Đang xử lý...'
                            : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
