import { z } from 'zod';
import { gmailSchema } from './authSchema';
import { normalizePhone } from '@/utils/phone';

const nameSchema = z
    .string()
    .trim()
    .min(1, 'errors.required')
    .regex(/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u, 'errors.name')
    .max(100, 'errors.tooLong');

export const createStaffSchema = z
    .object({
        firstName: nameSchema,
        lastName: nameSchema,
        email: gmailSchema,
        phone: z
            .string()
            .trim()
            .min(1, 'errors.required')
            .transform(normalizePhone)
            .refine((value) => /^\+84[35789]\d{8}$/.test(value), 'errors.phone'),
        role: z.enum(['ECOMMERCE_EXECUTIVE', 'LOGISTICS_STAFF', 'DELIVERY_STAFF'], {
            errorMap: () => ({ message: 'errors.required' }),
        }),
        password: z
            .string()
            .refine((value) => !!value.trim(), 'errors.required')
            .pipe(z.string().min(8, 'errors.passwordLength').max(72, 'errors.passwordLength')),
        confirmPassword: z.string().refine((value) => !!value.trim(), 'errors.required'),
    })
    .refine((values) => values.password === values.confirmPassword, {
        path: ['confirmPassword'],
        message: 'errors.passwordMismatch',
    });
