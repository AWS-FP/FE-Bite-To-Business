import { z } from 'zod';

export const backendHealthSchema = z.object({
    status: z.literal('UP'),
    service: z.string().min(1),
});

export const systemDraftSchema = z
    .object({
        primaryModel: z.string().trim().max(256, 'system.validation.modelLength'),
        fallbackModel: z.string().trim().max(256, 'system.validation.modelLength'),
        maxTokens: z.number().int().min(1).max(1_000_000),
        timeoutSeconds: z.number().int().min(5).max(120),
        retries: z.number().int().min(0).max(3),
        errorThreshold: z.number().min(0).max(100),
        budgetThreshold: z.number().min(0).max(100),
        chatEnabled: z.boolean(),
        recommendationsEnabled: z.boolean(),
        generativeUiEnabled: z.boolean(),
    })
    .superRefine((value, context) => {
        if (
            (value.chatEnabled || value.recommendationsEnabled || value.generativeUiEnabled) &&
            !value.primaryModel
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['primaryModel'],
                message: 'system.validation.modelRequired',
            });
        }
        if (value.primaryModel && value.primaryModel === value.fallbackModel) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['fallbackModel'],
                message: 'system.validation.differentModel',
            });
        }
    });

export type SystemConfigDraft = z.infer<typeof systemDraftSchema>;

export const systemDraftDefaults: SystemConfigDraft = {
    primaryModel: '',
    fallbackModel: '',
    maxTokens: 2048,
    timeoutSeconds: 30,
    retries: 1,
    errorThreshold: 5,
    budgetThreshold: 80,
    chatEnabled: false,
    recommendationsEnabled: false,
    generativeUiEnabled: false,
};
