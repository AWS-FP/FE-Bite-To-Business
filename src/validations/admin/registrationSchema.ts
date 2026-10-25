import { z } from 'zod';
import type { RegisterRequest } from '@/types/admin/auth';
import type { DeliveryCity } from '@/types/location';
import { normalizePhone } from '@/utils/phone';
import { gmailSchema, optionalGmailSchema } from './authSchema';

const nameSchema = z
    .string()
    .trim()
    .min(1, 'errors.required')
    .regex(/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u, 'errors.name')
    .max(100, 'errors.tooLong');

const requiredText = (max: number) =>
    z.string().trim().min(1, 'errors.required').max(max, 'errors.tooLong');

const optionalText = (max: number) =>
    z
        .string()
        .trim()
        .max(max, 'errors.tooLong')
        .nullish()
        .transform((value) => value || null);

export function createRegistrationSchema(cities: DeliveryCity[]): z.ZodType<RegisterRequest> {
    return z
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
            customerType: z.enum(['HOUSEHOLD_INDIVIDUAL_BUSINESS', 'BUSINESS_COOPERATIVE'], {
                errorMap: () => ({ message: 'errors.required' }),
            }),
            businessName: requiredText(200),
            province: requiredText(100),
            district: z.string().nullable(),
            ward: requiredText(100),
            deliveryAddress: requiredText(1000),
            deliveryNote: optionalText(1000),
            invoiceSameAsDelivery: z.boolean(),
            invoicePurchaser: optionalText(200),
            invoiceTaxCode: z
                .string()
                .trim()
                .regex(/^(?:[0-9]{10})?$/, 'errors.taxCode')
                .nullish()
                .transform((value) => value || null),
            invoiceEmail: optionalGmailSchema,
            invoiceAddress: optionalText(1000),
        })
        .superRefine((values, context) => {
            const city = cities.find((item) => item.name === values.province);
            if (values.province && !city) {
                context.addIssue({
                    code: 'custom',
                    path: ['province'],
                    message: 'errors.location',
                });
            }
            if (values.ward && !city?.wards.some((item) => item.name === values.ward)) {
                context.addIssue({ code: 'custom', path: ['ward'], message: 'errors.location' });
            }
        })
        .transform((values) => ({
            ...values,
            district: null,
            invoiceAddress: values.invoiceSameAsDelivery ? null : values.invoiceAddress,
        }));
}
