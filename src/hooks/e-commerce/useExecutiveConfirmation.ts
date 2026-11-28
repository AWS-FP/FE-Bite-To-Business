import { createContext, useContext } from 'react';

export type ConfirmationOptions = {
    danger?: boolean;
    title?: string;
    reasonLabel?: string;
};
export type ConfirmationRequest = (
    message: string,
    action: (reason: string) => unknown | Promise<unknown>,
    options?: ConfirmationOptions,
) => Promise<boolean>;

export const ExecutiveConfirmationContext = createContext<ConfirmationRequest | null>(null);

export function useExecutiveConfirmation() {
    const confirm = useContext(ExecutiveConfirmationContext);
    if (!confirm) throw new Error('ExecutiveConfirmationProvider is required');
    return confirm;
}
