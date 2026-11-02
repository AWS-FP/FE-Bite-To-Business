import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { createStaff } from '@/services/admin/staffService';
import type { ApiErrorResponse } from '@/types/api';
import type { CreateStaffRequest, StaffAccount } from '@/types/admin/staff';
import { createStaffSchema } from '@/validations/admin/staffSchema';
import { normalizePhone } from '@/utils/phone';
import AdminModal from './AdminModal';
import AdminButton from './AdminButton';
import AuthField from './AuthField';
import StaffError from './StaffError';
import StaffIcon from './StaffIcon';

export default function StaffCreateForm({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: (staff: StaffAccount) => void;
}) {
    const { t } = useTranslation('admin');
    const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [serverError, setServerError] = useState<unknown>(null);
    const submitting = useRef(false);
    const {
        register,
        handleSubmit,
        setError,
        setFocus,
        setValue,
        formState: { errors },
    } = useForm<CreateStaffRequest>({
        resolver: zodResolver(createStaffSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });
    useEffect(() => {
        setFocus('lastName');
    }, [setFocus]);

    async function handleCreate(request: CreateStaffRequest) {
        if (submitting.current) return;
        submitting.current = true;
        setBusy(true);
        setServerError(null);
        try {
            const staff = await createStaff(request);
            onCreated(staff);
        } catch (error) {
            setServerError(error);
            if (axios.isAxiosError<ApiErrorResponse>(error)) {
                const code = error.response?.data?.code;
                if (code === 'EMAIL_ALREADY_EXISTS')
                    setError('email', { message: 'errors.emailExists' }, { shouldFocus: true });
                else if (code === 'PHONE_ALREADY_EXISTS')
                    setError('phone', { message: 'errors.phoneExists' }, { shouldFocus: true });
                const fields: (keyof CreateStaffRequest)[] = [
                    'firstName',
                    'lastName',
                    'email',
                    'phone',
                    'role',
                    'password',
                    'confirmPassword',
                ];
                const serverFields = error.response?.data?.errors;
                for (const fieldError of Array.isArray(serverFields) ? serverFields : []) {
                    const field = fields.find((name) => name === fieldError.field);
                    if (field) setError(field, { message: 'errors.serverField' });
                }
            }
        } finally {
            submitting.current = false;
            setBusy(false);
        }
    }

    return (
        <AdminModal
            labelledBy="staff-create-title"
            onDismiss={onClose}
            busy={busy}
            className="staff-create-modal"
        >
            <header className="staff-modal-header">
                <div className="staff-modal-symbol">
                    <StaffIcon name="staff-large" />
                </div>
                <div className="staff-modal-titles">
                    <h2 id="staff-create-title">{t('staff.createTitle')}</h2>
                    <p>{t('staff.createHint')}</p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={busy}
                    aria-label={t('staff.close')}
                    className="staff-close-button"
                >
                    <StaffIcon name="close" />
                </button>
            </header>
            <form
                onSubmit={(event) => {
                    void handleSubmit(handleCreate)(event);
                }}
                noValidate
                className="staff-create-form"
                aria-busy={busy}
            >
                <div className="staff-form-body">
                    {serverError !== null && <StaffError error={serverError} />}
                    <fieldset disabled={busy} className="staff-form-fields">
                        <legend className="staff-form-section">
                            <StaffIcon name="user" />
                            {t('staff.employeeSection')}
                        </legend>
                        <AuthField
                            name="staff-last-name"
                            label={t('staff.fields.lastName')}
                            required
                            error={errors.lastName?.message}
                        >
                            <input
                                id="staff-last-name"
                                {...register('lastName')}
                                autoComplete="family-name"
                                maxLength={100}
                                placeholder={t('staff.placeholders.lastName')}
                                aria-invalid={!!errors.lastName}
                                aria-describedby="staff-last-name-help"
                            />
                        </AuthField>
                        <AuthField
                            name="staff-first-name"
                            label={t('staff.fields.firstName')}
                            required
                            error={errors.firstName?.message}
                        >
                            <input
                                id="staff-first-name"
                                {...register('firstName')}
                                autoComplete="given-name"
                                maxLength={100}
                                placeholder={t('staff.placeholders.firstName')}
                                aria-invalid={!!errors.firstName}
                                aria-describedby="staff-first-name-help"
                            />
                        </AuthField>
                        <AuthField
                            name="staff-email"
                            label="Gmail"
                            required
                            error={errors.email?.message}
                        >
                            <input
                                id="staff-email"
                                type="email"
                                {...register('email')}
                                autoComplete="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                maxLength={254}
                                placeholder={t('staff.placeholders.email')}
                                aria-invalid={!!errors.email}
                                aria-describedby="staff-email-help"
                            />
                        </AuthField>
                        <AuthField
                            name="staff-phone"
                            label={t('staff.fields.phone')}
                            required
                            error={errors.phone?.message}
                        >
                            <input
                                id="staff-phone"
                                type="tel"
                                {...register('phone', {
                                    onBlur: (event) =>
                                        setValue('phone', normalizePhone(event.target.value), {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        }),
                                })}
                                autoComplete="off"
                                maxLength={20}
                                placeholder={t('staff.placeholders.phone')}
                                aria-invalid={!!errors.phone}
                                aria-describedby="staff-phone-help"
                            />
                        </AuthField>
                        <div className="staff-form-full">
                            <AuthField
                                name="staff-role"
                                label={t('staff.fields.role')}
                                required
                                error={errors.role?.message}
                            >
                                <div className="staff-form-select">
                                    <select
                                        id="staff-role"
                                        {...register('role')}
                                        defaultValue=""
                                        aria-invalid={!!errors.role}
                                        aria-describedby="staff-role-help"
                                    >
                                        <option value="" disabled>
                                            {t('staff.selectRole')}
                                        </option>
                                        <option value="ECOMMERCE_EXECUTIVE">
                                            {t('staff.roles.ECOMMERCE_EXECUTIVE')}
                                        </option>
                                        <option value="LOGISTICS_STAFF">
                                            {t('staff.roles.LOGISTICS_STAFF')}
                                        </option>
                                        <option value="DELIVERY_STAFF">
                                            {t('staff.roles.DELIVERY_STAFF')}
                                        </option>
                                    </select>
                                    <StaffIcon name="select-down" />
                                </div>
                            </AuthField>
                        </div>
                    </fieldset>
                    <fieldset disabled={busy} className="staff-form-fields staff-password-fields">
                        <legend className="staff-form-section">
                            <StaffIcon name="lock" />
                            {t('staff.loginSection')}
                        </legend>
                        <AuthField
                            name="staff-password"
                            label={t('staff.fields.password')}
                            required
                            error={errors.password?.message}
                            hint={t('staff.passwordHint')}
                        >
                            <div className="staff-password-control">
                                <input
                                    id="staff-password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    autoComplete="new-password"
                                    maxLength={72}
                                    placeholder={t('staff.placeholders.password')}
                                    aria-invalid={!!errors.password}
                                    aria-describedby="staff-password-help"
                                />
                                <button
                                    type="button"
                                    disabled={busy}
                                    aria-label={t(
                                        showPassword ? 'staff.hidePassword' : 'staff.showPassword',
                                    )}
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <StaffIcon name="eye" />
                                </button>
                            </div>
                        </AuthField>
                        <AuthField
                            name="staff-confirm-password"
                            label={t('staff.fields.confirmPassword')}
                            required
                            error={errors.confirmPassword?.message}
                        >
                            <div className="staff-password-control">
                                <input
                                    id="staff-confirm-password"
                                    type={showConfirmation ? 'text' : 'password'}
                                    {...register('confirmPassword')}
                                    autoComplete="new-password"
                                    maxLength={72}
                                    placeholder={t('staff.placeholders.confirmPassword')}
                                    aria-invalid={!!errors.confirmPassword}
                                    aria-describedby="staff-confirm-password-help"
                                />
                                <button
                                    type="button"
                                    disabled={busy}
                                    aria-label={t(
                                        showConfirmation
                                            ? 'staff.hideConfirmation'
                                            : 'staff.showConfirmation',
                                    )}
                                    aria-pressed={showConfirmation}
                                    onClick={() => setShowConfirmation(!showConfirmation)}
                                >
                                    <StaffIcon name="eye" />
                                </button>
                            </div>
                        </AuthField>
                    </fieldset>
                </div>
                <footer className="staff-form-actions">
                    <AdminButton onClick={onClose} disabled={busy}>
                        {t('staff.cancel')}
                    </AdminButton>
                    <AdminButton
                        type="submit"
                        tone="primary"
                        busy={busy}
                        className="staff-submit-create"
                    >
                        {!busy && <StaffIcon name="plus" />}
                        {t(busy ? 'staff.creating' : 'staff.createSubmit')}
                    </AdminButton>
                </footer>
            </form>
        </AdminModal>
    );
}
