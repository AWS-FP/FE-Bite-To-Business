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

export default function ConfirmModal({ open, title, message, confirmLabel = 'Xác nhận', cancelLabel = 'Hủy', busy = false, error, danger = false, workspace = false, confirmDisabled = false, onConfirm, onCancel }: ConfirmModalProps) {
    const { i18n } = useTranslation();
    const titleId = useId();
    const messageId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelButton = useRef<HTMLButtonElement>(null);
    const cancelRef = useRef(onCancel);
    const busyRef = useRef(busy);
    useEffect(() => { cancelRef.current = onCancel; busyRef.current = busy; }, [onCancel, busy]);

    useEffect(() => {
        if (!open) return;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        cancelButton.current?.focus();
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                if (!busyRef.current) cancelRef.current();
            }
            if (event.key === 'Tab') {
                const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
                    'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
                ) ?? []);
                const first = elements[0], last = elements[elements.length - 1];
                if (!first) { event.preventDefault(); dialogRef.current?.focus(); }
                else if (!dialogRef.current?.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
                    event.preventDefault();
                    (event.shiftKey ? last : first)?.focus();
                }
            }
        }
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            previousFocus?.focus();
        };
    }, [open]);

    useEffect(() => { if (open && busy) dialogRef.current?.focus(); }, [open, busy]);

    if (!open) return null;
    return createPortal(
        <div className={`fixed inset-0 ${workspace ? 'z-[600]' : 'z-[100]'} flex items-center justify-center bg-black/40 p-6`} onClick={() => !busy && onCancel()}>
            <div ref={dialogRef} tabIndex={-1} role="dialog" aria-busy={busy} aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId} onClick={event => event.stopPropagation()} className={`w-full max-w-md rounded-xl p-6 text-left ${workspace ? 'border border-[#dce9dc] bg-[#fffaf0] text-[#173e2e] shadow-2xl' : 'border-2 border-black bg-white text-black'}`}>
                <h2 id={titleId} className="font-subheading text-xl font-bold">{title}</h2>
                <div id={messageId} className="mt-4 break-words text-sm leading-6">{message}</div>
                {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
                <div className="mt-6 flex justify-end gap-3">
                    <button ref={cancelButton} type="button" disabled={busy} onClick={onCancel} className="rounded border border-black bg-white px-4 py-2 text-sm font-semibold hover:bg-store-cream disabled:opacity-50">{cancelLabel}</button>
                    <button type="button" disabled={busy || confirmDisabled} onClick={onConfirm} className={`rounded border px-4 py-2 text-sm font-semibold disabled:opacity-50 ${danger ? 'border-red-700 bg-red-700 text-white hover:bg-red-800' : workspace ? 'border-[#173e2e] bg-store-yellow text-[#173e2e] hover:brightness-95' : 'border-black bg-store-yellow text-black hover:brightness-95'}`}>{busy ? (i18n.resolvedLanguage === 'en' ? 'Processing...' : 'Đang xử lý...') : confirmLabel}</button>
                </div>
            </div>
        </div>, document.body,
    );
}
