import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import AuthCard from '@/components/admin/AuthCard';
import AuthHeader from '@/components/admin/AuthHeader';
import RegisterDecoration from '@/components/admin/RegisterDecoration';
import SetPasswordForm from '@/components/admin/SetPasswordForm';
import VerifyOtpForm from '@/components/admin/VerifyOtpForm';
import RegistrationSuccess from '@/components/admin/RegistrationSuccess';

export default function ActivationPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const email = typeof location.state?.email === 'string' ? location.state.email : '';

    useEffect(() => {
        document.title = `${location.pathname === ROUTES.SET_PASSWORD ? t('setPassword.title') : t('verifyOtp.title')} | Bite to Business`;
        document.getElementById('auth-title')?.focus();
    }, [location.pathname, t]);

    return (
        <div className="auth-page auth-register-page min-h-dvh overflow-clip bg-auth-green text-auth-ink [&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_:focus-visible]:outline-[3px_solid_#f2adce] [&_:focus-visible]:outline-offset-4 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none">
            <AuthHeader />
            <div className="auth-scene relative mx-auto min-h-[calc(100dvh-81px)] max-w-[1440px]">
                <RegisterDecoration />
                <main
                    className="auth-main relative z-[1] flex justify-center px-6 pt-6 pb-20 max-[1200px]:pt-2.5 max-[600px]:pr-4 max-[600px]:pb-[42px] max-[600px]:pl-3"
                    id="main-content"
                >
                    <AuthCard className="auth-activation-card">
                        {location.pathname === ROUTES.SET_PASSWORD && <SetPasswordForm />}
                        {location.pathname === ROUTES.VERIFY_OTP &&
                            location.state?.registrationSubmitted &&
                            email && <RegistrationSuccess email={email} />}
                        {location.pathname === ROUTES.VERIFY_OTP &&
                            (!location.state?.registrationSubmitted || !email) && (
                                <>
                                    <h1 id="auth-title" tabIndex={-1}>
                                        {t('verifyOtp.title')}
                                    </h1>
                                    <p className="mt-3 mb-0 font-subtext text-[14px] leading-[1.6] text-auth-muted">
                                        {t('verifyOtp.description')}
                                    </p>
                                    <VerifyOtpForm initialEmail={email} />
                                </>
                            )}
                    </AuthCard>
                </main>
            </div>
        </div>
    );
}
