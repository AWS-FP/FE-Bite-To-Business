import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthCard from '@/components/admin/AuthCard';
import AuthHeader from '@/components/admin/AuthHeader';
import RegisterDecoration from '@/components/admin/RegisterDecoration';
import SetPasswordForm from '@/components/admin/SetPasswordForm';

export default function ActivationPage() {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `${t('setPassword.title')} | Bite to Business`;
        document.getElementById('auth-title')?.focus();
    }, [t]);

    return (
        <div className="auth-page auth-register-page min-h-dvh overflow-clip bg-auth-green text-auth-ink [&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_:focus-visible]:outline-[3px_solid_#f2adce] [&_:focus-visible]:outline-offset-4 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none">
            <AuthHeader />
            <div className="auth-scene relative mx-auto grid min-h-[calc(100dvh-81px)] max-w-[1440px] grid-cols-1">
                <RegisterDecoration />
                <main
                    className="auth-main relative z-[1] col-start-1 row-start-1 flex self-start justify-center px-6 pt-6 pb-20 max-[1200px]:pt-2.5"
                    id="main-content"
                >
                    <AuthCard className="auth-activation-card">
                        <SetPasswordForm />
                    </AuthCard>
                </main>
            </div>
        </div>
    );
}
