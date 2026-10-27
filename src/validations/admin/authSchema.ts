import { z } from 'zod';

const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

// Giữ key i18n để thông báo lỗi đổi ngôn ngữ cùng giao diện.
export const gmailSchema = z
    .string({ required_error: 'errors.required' })
    .trim()
    .min(1, 'errors.required')
    .regex(gmailPattern, 'errors.gmail')
    .max(254, 'errors.tooLong')
    .toLowerCase();

export const optionalGmailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'errors.tooLong')
    .refine((value) => !value || gmailPattern.test(value), 'errors.gmail')
    .nullish()
    .transform((value) => value || null);

export const loginSchema = z.object({
    email: gmailSchema,
    password: z.string().min(1, 'errors.required').max(256, 'errors.tooLong'),
});

export const verifyOtpSchema = z.object({
    email: gmailSchema,
    otp: z
        .string()
        .min(1, 'errors.required')
        .regex(/^[0-9]{6,10}$/, 'errors.otpFormat'),
});

// Kiểm tra mật khẩu nhưng giữ nguyên giá trị, kể cả khoảng trắng.
export const setPasswordSchema = z
    .object({
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
