import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AuthCard from '@/components/admin/AuthCard';
import AuthHeader from '@/components/admin/AuthHeader';
import RegisterDecoration from '@/components/admin/RegisterDecoration';
import VerifyOtpForm from '@/components/admin/VerifyOtpForm';

export default function VerifyOtpPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const email = typeof location.state?.email === 'string' ? location.state.email : '';

    useEffect(() => {
        document.title = `${t('verifyOtp.title')} | Bite to Business`;
        document.getElementById('auth-title')?.focus();
    }, [t]);

    return (
        <div className="auth-page auth-register-page min-h-dvh overflow-clip bg-auth-green text-auth-ink [&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_:focus-visible]:outline-[3px_solid_var(--color-store-pink)] [&_:focus-visible]:outline-offset-4 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none">
            <AuthHeader />
            <div className="auth-scene relative mx-auto grid min-h-[calc(100dvh-81px)] max-w-[1440px] grid-cols-1">
                <RegisterDecoration />
                <main
                    className="auth-main relative z-[1] col-start-1 row-start-1 flex self-start justify-center px-6 pt-6 pb-20 max-[1200px]:pt-2.5"
                    id="main-content"
                >
                    <AuthCard className="auth-activation-card">
                        <h1 id="auth-title" tabIndex={-1}>
                            {t('verifyOtp.title')}
                        </h1>
                        <p className="mt-3 mb-0 font-subtext text-[14px] leading-[1.6] text-auth-muted">
                            {t('verifyOtp.description')}
                        </p>
                        {location.state?.registrationSubmitted && (
                            <p className="activation-notice mt-5 mb-0" role="status">
                                {t('register.submitted')}
                            </p>
                        )}
                        <VerifyOtpForm initialEmail={email} />
                    </AuthCard>
                </main>
            </div>
        </div>
    );
}
