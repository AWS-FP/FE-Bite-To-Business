import { ArrowLeft, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRoleHome, ROUTES } from '@/router/routes';
import useAuth from '@/hooks/admin/useAuth';
import { getAuthError, type AuthError } from '@/utils/admin/authError';
import { loginSchema } from '@/validations/admin/authSchema';
import AuthField from './AuthField';

export default function LoginForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, isLoading } = useAuth();
    const [email, setEmail] = useState(() =>
        typeof location.state?.email === 'string' ? location.state.email : '',
    );
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordHelp, setShowPasswordHelp] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverError, setServerError] = useState<AuthError | null>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const submittingRef = useRef(false);

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
        setErrors({ ...errors, email: undefined });
        setServerError(null);
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        setErrors({ ...errors, password: undefined });
        setServerError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current) return;

        const result = loginSchema.safeParse({ email, password });
        setServerError(null);
        if (!result.success) {
            const fields = result.error.flatten().fieldErrors;
            setErrors({ email: fields.email?.[0], password: fields.password?.[0] });
            if (fields.email) emailRef.current?.focus();
            else passwordRef.current?.focus();
            return;
        }
        setErrors({});

        submittingRef.current = true;
        try {
            // Chỉ chuẩn hóa email; không trim hoặc thay đổi mật khẩu của người dùng.
            const session = await signIn(result.data);
            let destination = getRoleHome(session.user.role);
            const previousPage = location.state?.from?.pathname;

            // Nếu login được mở bởi route guard, quay lại trang nội bộ mà khách đang xem.
            if (
                typeof previousPage === 'string' &&
                previousPage.startsWith('/') &&
                !previousPage.startsWith('//') &&
                !previousPage.startsWith('/login') &&
                !previousPage.startsWith('/register')
            ) {
                destination = previousPage;
            }
            navigate(destination, { replace: true });
        } catch (error) {
            setServerError(getAuthError(error));
        } finally {
            submittingRef.current = false;
        }
    }

    return (
        <>
            <Link
                className="auth-back-home mb-[18px] inline-flex items-center gap-[5px] text-[12px] font-bold text-black no-underline hover:text-auth-green"
                to={ROUTES.HOME}
            >
                <ArrowLeft size={14} aria-hidden="true" />
                {t('auth.home')}
            </Link>
            <h1 id="auth-title">{t('login.title')}</h1>
            {location.state?.activationComplete && (
                <p
                    className="mt-5 mb-0 rounded-xl border border-solid border-auth-green/15 bg-surface-green px-4 py-[14px] text-[13px] leading-[1.6] text-auth-green"
                    role="status"
                >
                    {t('login.activationComplete')}
                </p>
            )}
            <form
                className="auth-form mt-6 login-form flex flex-col gap-5 [&>.auth-error-banner]:mb-0 [&>.auth-button]:mt-0.5"
                onSubmit={handleSubmit}
                noValidate
                aria-busy={isLoading}
            >
                {serverError && (
                    <div
                        className="auth-error-banner mb-5 rounded-xl border border-solid border-danger-line bg-danger-soft px-4 py-[14px]
 text-[13px] leading-[1.6] text-danger-strong"
                        role="alert"
                    >
                        {t(serverError.messageKey)}
                        <span className="mt-1 block break-words font-mono text-[12px]">
                            {t('errors.code', { code: serverError.code })}
                            {serverError.status && ` · HTTP ${serverError.status}`}
                        </span>
                    </div>
                )}

                <AuthField name="login-email" label={t('fields.email')} error={errors.email}>
                    <input
                        className="w-full rounded-xl border border-solid border-auth-ink/13 bg-white px-[15px] text-[14px] text-auth-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-store-placeholder placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--color-auth-green)_9.41%,_transparent)] aria-invalid:border-danger aria-invalid:focus:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--color-danger)_9.41%,_transparent)] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-auth-muted h-12 py-0"
                        id="login-email"
                        ref={emailRef}
                        type="email"
                        name="email"
                        autoComplete="username"
                        inputMode="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={254}
                        required
                        placeholder={t('placeholders.email')}
                        value={email}
                        disabled={isLoading}
                        aria-invalid={!!errors.email}
                        aria-describedby="login-email-help"
                        onChange={handleEmailChange}
                    />
                </AuthField>

                <AuthField
                    name="login-password"
                    label={t('fields.password')}
                    error={errors.password}
                >
                    <div className="auth-password-input relative flex items-center">
                        <input
                            className="w-full rounded-xl border border-solid border-auth-ink/13 bg-white px-[15px] text-[14px] text-auth-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-store-placeholder placeholder:opacity-100 focus:border-auth-green focus:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--color-auth-green)_9.41%,_transparent)] aria-invalid:border-danger aria-invalid:focus:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--color-danger)_9.41%,_transparent)] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-auth-muted h-12 py-0 pr-[50px]"
                            id="login-password"
                            ref={passwordRef}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            autoComplete="current-password"
                            required
                            maxLength={256}
                            placeholder={t('placeholders.password')}
                            value={password}
                            disabled={isLoading}
                            aria-invalid={!!errors.password}
                            aria-describedby="login-password-help"
                            onChange={handlePasswordChange}
                        />
                        <button
                            type="button"
                            className="auth-password-toggle absolute right-1 grid size-10 place-items-center rounded-lg border-0 bg-transparent
 p-0 text-auth-green hover:bg-auth-green/5"
                            aria-label={
                                showPassword ? t('login.hidePassword') : t('login.showPassword')
                            }
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword && <EyeOff size={17} aria-hidden="true" />}
                            {!showPassword && <Eye size={17} aria-hidden="true" />}
                        </button>
                    </div>
                </AuthField>

                <div className="auth-forgot-row -mt-2 flex justify-end">
                    <button
                        className="auth-text-button border-0 bg-transparent px-0 py-[3px] text-[12px] leading-[1.5] font-bold
 text-auth-green underline-offset-4 hover:underline"
                        type="button"
                        aria-expanded={showPasswordHelp}
                        aria-controls="password-help"
                        onClick={() => setShowPasswordHelp(!showPasswordHelp)}
                    >
                        {t('login.forgotPassword')}
                    </button>
                </div>
                {showPasswordHelp && (
                    <p
                        className="auth-info-banner m-0 rounded-xl border border-solid border-auth-green/15 bg-surface-blue px-4 py-[14px]
 text-[13px] leading-[1.6] text-info"
                        id="password-help"
                        role="status"
                    >
                        {t('login.passwordHelp')}
                    </p>
                )}

                <button
                    className="auth-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-solid px-[18px] py-3 text-center text-[14px] leading-[1.4] font-bold no-underline transition-[background,transform] duration-150 active:translate-y-px disabled:active:translate-y-0 disabled:opacity-[0.65] auth-button-primary w-full border-transparent bg-auth-ink text-white hover:bg-auth-green disabled:hover:bg-auth-ink"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading && (
                        <LoaderCircle
                            className="auth-spinner animate-[spin_0.8s_linear_infinite] motion-reduce:animate-none"
                            size={18}
                            aria-hidden="true"
                        />
                    )}
                    {isLoading ? t('login.submitting') : t('login.submit')}
                </button>
                <span className="auth-sr-only sr-only" aria-live="polite">
                    {isLoading && t('login.submitting')}
                </span>
            </form>
            <p className="auth-switch-page mt-6 mb-0 text-center font-subtext text-[14px] leading-[1.6] text-auth-muted [&_a]:font-bold [&_a]:text-auth-ink [&_a]:decoration-store-pink [&_a]:decoration-[3px] [&_a]:underline-offset-4 [&_a:hover]:text-auth-green">
                {t('login.noAccount')} <Link to={ROUTES.REGISTER}>{t('register.title')}</Link>
            </p>
            <p className="mt-3 mb-0 text-center font-subtext text-[12px] leading-[1.6] text-auth-muted">
                {t('verifyOtp.resumeText')}{' '}
                <Link
                    className="font-bold text-auth-green underline underline-offset-4"
                    to={ROUTES.VERIFY_OTP}
                    state={{ email }}
                >
                    {t('verifyOtp.resumeLink')}
                </Link>
            </p>
        </>
    );
}
