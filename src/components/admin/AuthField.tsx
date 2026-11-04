import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AuthFieldProps {
    name: string;
    label: string;
    required?: boolean;
    optional?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
}

// Dùng chung nhãn, hướng dẫn và lỗi. Input tự nối aria-describedby tới name-help.
export default function AuthField({
    name,
    label,
    required,
    optional,
    hint,
    error,
    children,
}: AuthFieldProps) {
    const { t } = useTranslation();

    return (
        <div className="auth-field min-w-0">
            <label className="mb-[7px] block text-[14px] leading-5 font-semibold" htmlFor={name}>
                {label}
                {required && <span className="auth-required text-danger"> *</span>}
                {optional && (
                    <span className="auth-optional font-subtext text-[11px] font-normal text-auth-muted">
                        {' '}
                        ({t('auth.optional')})
                    </span>
                )}
            </label>
            {children}
            <div id={`${name}-help`}>
                {error && (
                    <p className="auth-field-error mt-1.5 mb-0 font-subtext text-[12px] leading-[1.5] text-danger">
                        {t(error)}
                    </p>
                )}
                {!error && hint && (
                    <p className="auth-field-hint mt-1.5 mb-0 font-subtext text-[12px] leading-[1.5] text-auth-muted">
                        {hint}
                    </p>
                )}
            </div>
        </div>
    );
}
