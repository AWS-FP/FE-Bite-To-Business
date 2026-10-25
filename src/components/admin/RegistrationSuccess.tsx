import { Check, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import VerifyOtpForm from './VerifyOtpForm';

interface RegistrationSuccessProps {
    email: string;
}

export default function RegistrationSuccess({ email }: RegistrationSuccessProps) {
    const { t } = useTranslation();
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    return (
        <div className="auth-success text-center">
            <div
                className="auth-success-icon mx-auto mt-0 mb-5 grid size-[72px] place-items-center rounded-full border-2
        border-solid border-auth-green bg-[#eaf3ec] text-auth-green"
            >
                <Check size={32} aria-hidden="true" />
            </div>
            <span
                className="auth-status-pill mb-[18px] inline-block rounded-[20px] border border-solid border-[#17133a20]
        bg-[#ffe14d55] px-3 py-1.5 font-label text-[12px] font-bold"
            >
                {t('register.submitted')}
            </span>
            <h1 id="auth-title" ref={titleRef} tabIndex={-1}>
                {t('register.successTitle')}
            </h1>
            <p
                className="auth-introduction mt-2.5 mb-0 font-subtext text-[16px] leading-[1.6] text-auth-muted
        max-[600px]:text-[15px]"
            >
                {t('register.successDescription')}
            </p>
            <div
                className="auth-success-email mt-6 flex items-center justify-center gap-2.5 rounded-xl bg-white px-3 py-4
        text-[14px] [&_strong]:min-w-0 [&_strong]:[overflow-wrap:anywhere] [&>svg]:shrink-0"
            >
                <Mail size={20} aria-hidden="true" />
                <strong>{email}</strong>
            </div>
            <VerifyOtpForm initialEmail={email} showEmailField={false} />
            <Link className="activation-link mt-5 block" to={ROUTES.LOGIN}>
                {t('register.backToLogin')}
            </Link>
            <Link
                className="auth-success-browse mt-5 inline-block text-[13px] text-auth-green underline-offset-4"
                to={ROUTES.CATALOG}
            >
                {t('auth.browse')}
            </Link>
        </div>
    );
}
