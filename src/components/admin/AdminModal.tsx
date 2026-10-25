import { useEffect, useRef } from 'react';
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react';
import './AdminModal.css';

interface AdminModalProps {
    children: ReactNode;
    labelledBy: string;
    onDismiss: () => void;
    busy?: boolean;
    className?: string;
    drawer?: boolean;
}

// Native dialog giữ focus, khóa phần nền và trả focus về nút mở khi đóng.
export default function AdminModal({
    children,
    labelledBy,
    onDismiss,
    busy = false,
    drawer = false,
    className = '',
}: AdminModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        dialog?.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            dialog?.close();
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
        event.preventDefault();
        if (!busy) onDismiss();
    }

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (busy || event.target !== event.currentTarget) return;

        const dialogBounds = event.currentTarget.getBoundingClientRect();
        if (
            event.clientX < dialogBounds.left ||
            event.clientX > dialogBounds.right ||
            event.clientY < dialogBounds.top ||
            event.clientY > dialogBounds.bottom
        ) {
            onDismiss();
        }
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={labelledBy}
            aria-busy={busy}
            data-drawer={drawer}
            onCancel={handleCancel}
            onClick={handleBackdropClick}
            className={`admin-modal fixed overflow-hidden border-2 border-black bg-white p-0 font-body text-black backdrop:bg-[#0009] [&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-60 [&_button:focus-visible]:outline-[3px_solid_#ffe14d] [&_button:focus-visible]:outline-offset-2 [&_h2]:m-0 [&_h3]:m-0 [&_p]:m-0 ${className}`}
        >
            <div className={`flex flex-col ${drawer ? 'h-dvh' : 'max-h-[calc(100dvh-48px)]'}`}>
                {children}
            </div>
        </dialog>
    );
}
