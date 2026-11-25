import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import type { ApiErrorResponse } from '@/types/api';
import {
    DEFAULT_REGISTRATION,
    REGISTRATION_STEP_COUNT,
    REGISTRATION_STEP_FIELDS,
} from '@/constants/admin/registration';
import { register as sendRegistration } from '@/services/admin/authService';
import type { RegisterRequest } from '@/types/admin/auth';
import { getAuthError, type AuthError } from '@/utils/admin/authError';
import type { DeliveryCity } from '@/types/location';
import { createRegistrationSchema } from '@/validations/admin/registrationSchema';
import { clearActivationSession } from '@/utils/admin/activationSession';

export default function useRegisterForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const form = useForm<RegisterRequest>({
        resolver: (values, context, options) => {
            // Đọc danh mục mới nhất từ cache khi validate, kể cả sau khi đổi thành phố hoặc tải lại API.
            const cities =
                queryClient.getQueryData<DeliveryCity[]>(['delivery-cities', 'v2']) || [];
            return zodResolver(createRegistrationSchema(cities))(values, context, options);
        },
        defaultValues: DEFAULT_REGISTRATION,
        mode: 'onTouched',
        // Giữ các ô của bước trước khi component của bước đó được ẩn đi.
        shouldUnregister: false,
    });
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newsletterConsent, setNewsletterConsent] = useState(false);
    const [serverError, setServerError] = useState<AuthError | null>(null);
    const submittingRef = useRef(false);

    function goBack() {
        if (submittingRef.current) return;
        setServerError(null);
        setStep(step - 1);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current) return;
        submittingRef.current = true;
        setServerError(null);

        try {
            const valid = await form.trigger(REGISTRATION_STEP_FIELDS[step - 1], {
                shouldFocus: true,
            });
            if (!valid) return;

            if (step < REGISTRATION_STEP_COUNT) {
                setStep(step + 1);
                return;
            }

            // Resolver kiểm tra toàn bộ và trả dữ liệu đã được schema chuẩn hóa.
            await form.handleSubmit(
                async (request) => {
                    setIsSubmitting(true);
                    await sendRegistration({ ...request, newsletterConsent });
                    clearActivationSession();
                    navigate(ROUTES.VERIFY_OTP, {
                        replace: true,
                        state: {
                            email: request.email,
                            registrationSubmitted: true,
                        },
                    });
                },
                () => {
                    for (let index = 0; index < REGISTRATION_STEP_FIELDS.length; index++) {
                        const fields = REGISTRATION_STEP_FIELDS[index];
                        if (fields.some((field) => form.getFieldState(field).invalid)) {
                            setStep(index + 1);
                            break;
                        }
                    }
                },
            )();
        } catch (error) {
            setServerError(getAuthError(error));

            if (axios.isAxiosError<ApiErrorResponse>(error)) {
                const fieldErrors = error.response?.data?.errors;
                let firstErrorStep = REGISTRATION_STEP_COUNT;
                if (Array.isArray(fieldErrors)) {
                    for (const fieldError of fieldErrors) {
                        for (let index = 0; index < REGISTRATION_STEP_FIELDS.length; index++) {
                            const field = REGISTRATION_STEP_FIELDS[index].find(
                                (name) => name === fieldError.field,
                            );
                            if (field) {
                                form.setError(field, {
                                    type: 'server',
                                    message: 'errors.serverField',
                                });
                                firstErrorStep = Math.min(firstErrorStep, index + 1);
                            }
                        }
                    }
                    setStep(firstErrorStep);
                }
                // A taken email is never revealed (that would let anyone probe accounts): it gets a normal
                // receipt and an emailed rejection. A taken phone number is reported on the phone field.
                if (error.response?.data?.code === 'PHONE_ALREADY_EXISTS') {
                    form.setError('phone', { type: 'server', message: 'errors.phoneExists' });
                    setStep(
                        REGISTRATION_STEP_FIELDS.findIndex((fields) => fields.includes('phone')) + 1,
                    );
                }
            }
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    return {
        form,
        step,
        goBack,
        handleSubmit,
        isSubmitting,
        serverError,
        newsletterConsent,
        setNewsletterConsent,
    };
}
