import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { resendActivationOtp, verifyOtp } from '@/services/admin/authService';
import { saveActivationSession } from '@/utils/admin/activationSession';
import { getAuthError, type AuthError } from '@/utils/admin/authError';
import { gmailSchema, verifyOtpSchema } from '@/validations/admin/authSchema';
import AuthField from './AuthField';
import './ActivationForm.css';

export default function VerifyOtpForm({
    initialEmail = '',
    showEmailField = true,
}: {
    initialEmail?: string;
    showEmailField?: boolean;
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState<{ email?: string; otp?: string }>({});
    const [serverError, setServerError] = useState<AuthError | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const otpRef = useRef<HTMLInputElement>(null);
    const submittingRef = useRef(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [deadlines, setDeadlines] = useState<Record<string, number>>({});
    const [now, setNow] = useState(Date.now);
    const deadline = deadlines[email.trim().toLowerCase()] ?? 0;
    const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
    const countingDown = remaining > 0;
    useEffect(() => {
        if (!countingDown) return;
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [countingDown]);

    async function handleResend() {
        if (submittingRef.current || deadline > Date.now()) return;
        const result = gmailSchema.safeParse(email);
        setServerError(null);
        setResendMessage('');
        if (!result.success) {
            setErrors({ email: result.error.issues[0].message });
            emailRef.current?.focus();
            return;
        }
        submittingRef.current = true;
        setIsResending(true);
        setErrors({});
        try {
            const { retryAfterSeconds } = await resendActivationOtp(result.data);
            const receivedAt = Date.now();
            setNow(receivedAt);
            setDeadlines((current) => ({
                ...current,
                [result.data]: receivedAt + retryAfterSeconds * 1000,
            }));
            setResendMessage('verifyOtp.resendReceived');
        } catch (error) {
            setServerError(getAuthError(error));
        } finally {
            submittingRef.current = false;
            setIsResending(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current) return;
        const result = verifyOtpSchema.safeParse({ email, otp });
        setResendMessage('');
        setServerError(null);
        if (!result.success) {
            const fields = result.error.flatten().fieldErrors;
            setErrors({ email: fields.email?.[0], otp: fields.otp?.[0] });
            if (fields.email) emailRef.current?.focus();
            else otpRef.current?.focus();
            return;
        }
        setErrors({});

        submittingRef.current = true;
        setIsSubmitting(true);
        try {
            const response = await verifyOtp(result.data);
            saveActivationSession(result.data.email, response);
            navigate(ROUTES.SET_PASSWORD, { replace: true });
        } catch (error) {
            const authError = getAuthError(error);
            if (authError.code === 'ACCOUNT_NOT_ACTIVATED')
                authError.messageKey = 'verifyOtp.waitingApproval';
            setServerError(authError);
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className="activation-form"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting || isResending}
        >
            {location.state?.setupExpired && (
                <div className="activation-notice" role="alert">
                    {t('verifyOtp.setupExpired')}
                    <span className="activation-error-code">
                        {t('errors.code', {
                            code: location.state.setupErrorCode || 'SETUP_SESSION_EXPIRED',
                        })}
                        {location.state.setupErrorStatus &&
                            ` · HTTP ${location.state.setupErrorStatus}`}
                    </span>
                </div>
            )}
            {serverError && (
                <div className="activation-error" role="alert">
                    {t(serverError.messageKey)}
                    <span className="activation-error-code">
                        {t('errors.code', { code: serverError.code })}
                        {serverError.status && ` · HTTP ${serverError.status}`}
                    </span>
                </div>
            )}
            {showEmailField && (
                <AuthField
                    name="otp-email"
                    label={t('fields.registrationEmail')}
                    required
                    error={errors.email}
                >
                    <input
                        className="activation-input"
                        id="otp-email"
                        ref={emailRef}
                        type="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={254}
                        required
                        value={email}
                        disabled={isSubmitting || isResending}
                        placeholder={t('placeholders.email')}
                        aria-invalid={!!errors.email}
                        aria-describedby="otp-email-help"
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setResendMessage('');
                            setNow(Date.now());
                            setErrors({ ...errors, email: undefined });
                            setServerError(null);
                        }}
                    />
                </AuthField>
            )}
            <AuthField
                name="otp-code"
                label={t('verifyOtp.codeLabel')}
                required
                hint={t('verifyOtp.codeHint')}
                error={errors.otp}
            >
                <input
                    className="activation-input activation-otp"
                    id="otp-code"
                    ref={otpRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={10}
                    value={otp}
                    disabled={isSubmitting}
                    placeholder="000000"
                    aria-invalid={!!errors.otp}
                    aria-describedby="otp-code-help"
                    onChange={(event) => {
                        setOtp(event.target.value.replace(/[^0-9]/g, ''));
                        setErrors({ ...errors, otp: undefined });
                        setServerError(null);
                    }}
                />
            </AuthField>
            <button
                className="activation-button"
                type="submit"
                disabled={isSubmitting || isResending}
            >
                {isSubmitting && (
                    <LoaderCircle
                        size={18}
                        className="animate-spin motion-reduce:animate-none"
                        aria-hidden="true"
                    />
                )}
                {isSubmitting ? t('verifyOtp.submitting') : t('verifyOtp.submit')}
            </button>
            <p role="status" className="m-0 font-subtext text-[12px] leading-[1.6] text-auth-muted">
                {t(resendMessage || 'verifyOtp.resendHint')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {showEmailField && (
                    <Link className="activation-link text-center" to={ROUTES.LOGIN}>
                        {t('register.backToLogin')}
                    </Link>
                )}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isSubmitting || isResending || countingDown}
                    className="activation-link border-0 bg-transparent p-0 underline disabled:opacity-60"
                >
                    {isResending
                        ? t('verifyOtp.resending')
                        : countingDown
                          ? t('verifyOtp.resendWait', { seconds: remaining })
                          : t('verifyOtp.resend')}
                </button>
            </div>
        </form>
    );
}
