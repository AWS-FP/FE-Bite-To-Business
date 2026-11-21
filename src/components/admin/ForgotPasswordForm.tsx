import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import {
    requestPasswordReset,
    resetPassword,
    verifyPasswordResetOtp,
} from '@/services/admin/authService';
import { getAuthError, type AuthError } from '@/utils/admin/authError';
import { gmailSchema, setPasswordSchema, verifyOtpSchema } from '@/validations/admin/authSchema';
import AuthField from './AuthField';
import './ActivationForm.css';

const RESEND_COOLDOWN_SECONDS = 60;

type Step = 'email' | 'otp' | 'password';

interface ResetSession {
    accessToken: string;
    expiresAt: number;
}

/**
 * Quên mật khẩu 3 bước: nhập Gmail → nhập OTP → đặt mật khẩu mới.
 * Token sau OTP chỉ giữ trong bộ nhớ component; tải lại trang thì phải yêu cầu mã mới.
 */
export default function ForgotPasswordForm({ initialEmail = '' }: { initialEmail?: string }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [serverError, setServerError] = useState<AuthError | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendAt, setResendAt] = useState(0);
    const [now, setNow] = useState(() => Date.now());
    const [session, setSession] = useState<ResetSession | null>(null);
    const submittingRef = useRef(false);
    const firstFieldRef = useRef<HTMLInputElement>(null);

    // Đếm ngược nút gửi lại mã.
    useEffect(() => {
        if (resendAt <= now) return;
        const timer = window.setTimeout(() => setNow(Date.now()), 1000);
        return () => window.clearTimeout(timer);
    }, [resendAt, now]);

    // Hết hạn phiên đặt mật khẩu thì quay về bước nhập Gmail.
    useEffect(() => {
        if (!session) return;
        const timer = window.setTimeout(
            () => {
                if (submittingRef.current) return;
                expireSession();
            },
            Math.max(0, session.expiresAt - Date.now()),
        );
        return () => window.clearTimeout(timer);
    }, [session]);

    useEffect(() => {
        firstFieldRef.current?.focus();
    }, [step]);

    const resendSeconds = Math.max(0, Math.ceil((resendAt - now) / 1000));

    function expireSession() {
        setSession(null);
        setPassword('');
        setConfirmPassword('');
        setOtp('');
        setStep('email');
        setNotice(null);
        setServerError({
            messageKey: 'forgotPassword.setupExpired',
            code: 'SETUP_SESSION_EXPIRED',
        });
    }

    async function run(action: () => Promise<void>) {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setIsSubmitting(true);
        setServerError(null);
        try {
            await action();
        } catch (error) {
            const authError = getAuthError(error);
            if (
                step === 'password' &&
                (authError.code === 'SETUP_SESSION_EXPIRED' || authError.code === 'UNAUTHORIZED')
            ) {
                expireSession();
            } else {
                setServerError(authError);
            }
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    function sendCode() {
        const result = gmailSchema.safeParse(email);
        if (!result.success) {
            setErrors({ email: result.error.issues[0]?.message });
            firstFieldRef.current?.focus();
            return;
        }
        setErrors({});
        return run(async () => {
            await requestPasswordReset(result.data);
            setEmail(result.data);
            setOtp('');
            setNotice(t('forgotPassword.codeSent'));
            const sentAt = Date.now();
            setNow(sentAt);
            setResendAt(sentAt + RESEND_COOLDOWN_SECONDS * 1000);
            setStep('otp');
        });
    }

    function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        void sendCode();
    }

    function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const result = verifyOtpSchema.safeParse({ email, otp });
        if (!result.success) {
            setErrors({ otp: result.error.flatten().fieldErrors.otp?.[0] });
            firstFieldRef.current?.focus();
            return;
        }
        setErrors({});
        void run(async () => {
            const response = await verifyPasswordResetOtp(result.data);
            setSession({
                accessToken: response.accessToken,
                expiresAt: Date.now() + response.expiresIn * 1000,
            });
            setNotice(null);
            setStep('password');
        });
    }

    function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!session || session.expiresAt <= Date.now()) {
            expireSession();
            return;
        }
        const result = setPasswordSchema.safeParse({ password, confirmPassword });
        if (!result.success) {
            const fields = result.error.flatten().fieldErrors;
            setErrors({
                password: fields.password?.[0],
                confirmPassword: fields.confirmPassword?.[0],
            });
            firstFieldRef.current?.focus();
            return;
        }
        setErrors({});
        void run(async () => {
            // Giữ nguyên mật khẩu, kể cả khoảng trắng; không tự đăng nhập sau khi đặt lại.
            await resetPassword(result.data, session.accessToken);
            setSession(null);
            navigate(ROUTES.LOGIN, {
                replace: true,
                state: { email, passwordResetComplete: true },
            });
        });
    }

    const submitButton = (label: string, busyLabel: string) => (
        <button className="activation-button" type="submit" disabled={isSubmitting}>
            {isSubmitting && (
                <LoaderCircle
                    size={18}
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                />
            )}
            {isSubmitting ? busyLabel : label}
        </button>
    );

    const feedback: ReactNode = (
        <>
            {notice && (
                <div className="activation-notice" role="status">
                    {notice}
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
        </>
    );

    return (
        <>
            <h1 id="auth-title" tabIndex={-1}>
                {t('forgotPassword.title')}
            </h1>

            {step === 'email' && (
                <>
                    <p className="mt-3 mb-0 font-subtext text-[14px] leading-[1.6] text-auth-muted">
                        {t('forgotPassword.emailDescription')}
                    </p>
                    <form
                        className="activation-form"
                        onSubmit={handleEmailSubmit}
                        noValidate
                        aria-busy={isSubmitting}
                    >
                        {feedback}
                        <AuthField
                            name="reset-email"
                            label={t('fields.registrationEmail')}
                            required
                            error={errors.email}
                        >
                            <input
                                className="activation-input"
                                id="reset-email"
                                ref={firstFieldRef}
                                type="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                maxLength={254}
                                required
                                value={email}
                                disabled={isSubmitting}
                                placeholder={t('placeholders.email')}
                                aria-invalid={!!errors.email}
                                aria-describedby="reset-email-help"
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setErrors({});
                                    setServerError(null);
                                }}
                            />
                        </AuthField>
                        {submitButton(t('forgotPassword.sendCode'), t('forgotPassword.sending'))}
                        <Link
                            className="activation-link text-center"
                            to={ROUTES.LOGIN}
                            state={{ email }}
                        >
                            {t('register.backToLogin')}
                        </Link>
                    </form>
                </>
            )}

            {step === 'otp' && (
                <>
                    <p className="mt-3 mb-0 break-words font-subtext text-[14px] leading-[1.6] text-auth-muted">
                        {t('forgotPassword.otpDescription')}{' '}
                        <strong className="text-auth-ink">{email}</strong>
                    </p>
                    <form
                        className="activation-form"
                        onSubmit={handleOtpSubmit}
                        noValidate
                        aria-busy={isSubmitting}
                    >
                        {feedback}
                        <AuthField
                            name="reset-otp"
                            label={t('forgotPassword.codeLabel')}
                            required
                            hint={t('verifyOtp.codeHint')}
                            error={errors.otp}
                        >
                            <input
                                className="activation-input activation-otp"
                                id="reset-otp"
                                ref={firstFieldRef}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                required
                                maxLength={10}
                                value={otp}
                                disabled={isSubmitting}
                                placeholder="000000"
                                aria-invalid={!!errors.otp}
                                aria-describedby="reset-otp-help"
                                onChange={(event) => {
                                    setOtp(event.target.value.replace(/[^0-9]/g, ''));
                                    setErrors({});
                                    setServerError(null);
                                }}
                            />
                        </AuthField>
                        {submitButton(t('verifyOtp.submit'), t('verifyOtp.submitting'))}
                        <div className="flex flex-wrap justify-between gap-3">
                            <button
                                className="activation-link border-0 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-60"
                                type="button"
                                disabled={isSubmitting || resendSeconds > 0}
                                onClick={() => void sendCode()}
                            >
                                {resendSeconds > 0
                                    ? t('forgotPassword.resendIn', { seconds: resendSeconds })
                                    : t('forgotPassword.resend')}
                            </button>
                            <button
                                className="activation-link border-0 bg-transparent p-0"
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setStep('email');
                                    setNotice(null);
                                    setServerError(null);
                                    setErrors({});
                                }}
                            >
                                {t('forgotPassword.changeEmail')}
                            </button>
                        </div>
                    </form>
                </>
            )}

            {step === 'password' && (
                <>
                    <p className="mt-3 mb-0 break-words font-subtext text-[14px] leading-[1.6] text-auth-muted">
                        {t('forgotPassword.passwordDescription')}{' '}
                        <strong className="text-auth-ink">{email}</strong>
                    </p>
                    <form
                        className="activation-form"
                        onSubmit={handlePasswordSubmit}
                        noValidate
                        aria-busy={isSubmitting}
                    >
                        {feedback}
                        <AuthField
                            name="reset-new-password"
                            label={t('setPassword.passwordLabel')}
                            required
                            hint={t('setPassword.passwordHint')}
                            error={errors.password}
                        >
                            <div className="activation-password">
                                <input
                                    className="activation-input"
                                    id="reset-new-password"
                                    ref={firstFieldRef}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    maxLength={72}
                                    value={password}
                                    disabled={isSubmitting}
                                    placeholder={t('placeholders.password')}
                                    aria-invalid={!!errors.password}
                                    aria-describedby="reset-new-password-help"
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        setErrors({});
                                        setServerError(null);
                                    }}
                                />
                                <button
                                    type="button"
                                    aria-label={
                                        showPassword
                                            ? t('login.hidePassword')
                                            : t('login.showPassword')
                                    }
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={17} aria-hidden="true" />
                                    ) : (
                                        <Eye size={17} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </AuthField>
                        <AuthField
                            name="reset-confirm-password"
                            label={t('setPassword.confirmLabel')}
                            required
                            error={errors.confirmPassword}
                        >
                            <div className="activation-password">
                                <input
                                    className="activation-input"
                                    id="reset-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    maxLength={72}
                                    value={confirmPassword}
                                    disabled={isSubmitting}
                                    placeholder={t('setPassword.confirmPlaceholder')}
                                    aria-invalid={!!errors.confirmPassword}
                                    aria-describedby="reset-confirm-password-help"
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        setErrors({ ...errors, confirmPassword: undefined });
                                        setServerError(null);
                                    }}
                                />
                                <button
                                    type="button"
                                    aria-label={
                                        showConfirmPassword
                                            ? t('setPassword.hideConfirm')
                                            : t('setPassword.showConfirm')
                                    }
                                    aria-pressed={showConfirmPassword}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={17} aria-hidden="true" />
                                    ) : (
                                        <Eye size={17} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </AuthField>
                        {submitButton(t('forgotPassword.submit'), t('forgotPassword.submitting'))}
                        <Link className="activation-link text-center" to={ROUTES.LOGIN}>
                            {t('register.backToLogin')}
                        </Link>
                    </form>
                </>
            )}
        </>
    );
}
