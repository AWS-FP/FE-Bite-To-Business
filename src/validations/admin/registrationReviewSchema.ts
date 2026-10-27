import { z } from 'zod';

export const registrationReviewSchema = z
    .object({
        decision: z.enum(['APPROVE', 'REJECT']),
        note: z.string().trim().max(2000, 'review.reasonTooLong'),
    })
    .refine((values) => values.decision !== 'REJECT' || !!values.note, {
        path: ['note'],
        message: 'errors.reasonRequired',
    });
