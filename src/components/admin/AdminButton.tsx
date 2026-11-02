import type { ButtonHTMLAttributes } from 'react';
import AdminIcon from './AdminIcon';
import type { AdminIconName } from './AdminIcon';
import './AdminButton.css';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    tone?: 'primary' | 'danger' | 'subtleDanger' | 'plain';
    icon?: AdminIconName;
    busy?: boolean;
}

export default function AdminButton({
    children,
    tone = 'plain',
    icon,
    busy,
    className = '',
    disabled,
    ...props
}: AdminButtonProps) {
    return (
        <button
            type="button"
            {...props}
            disabled={disabled || busy}
            aria-busy={busy || undefined}
            data-tone={tone}
            className={`admin-button inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] border border-black px-[15px] py-2.5 font-body text-[13px] leading-5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
            {busy && (
                <AdminIcon name="refresh" className="animate-spin motion-reduce:animate-none" />
            )}
            {!busy && icon && <AdminIcon name={icon} />}
            {children}
        </button>
    );
}
