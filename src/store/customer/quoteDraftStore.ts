import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PackageDraft } from '@/components/customer/checkout/PackageForm';

export interface QuoteFormDraft {
    productCode: string;
    shippingCode: string;
    quantities: Record<string, string>;
    parcel: PackageDraft;
    /** The customer cleared the default package filled from their profile; do not fill it again. */
    profileDefaultDismissed?: boolean;
}

export const emptyParcel: PackageDraft = {
    name: '',
    recipientName: '',
    recipientPhone: '',
    deliveryDate: '',
    deliveryTimeSlot: '',
    address: '',
    note: '',
    city: 'HCM',
};

export const emptyQuoteForm: QuoteFormDraft = {
    productCode: '',
    shippingCode: '',
    quantities: {},
    parcel: emptyParcel,
};

interface QuoteDraftState {
    forms: Record<string, QuoteFormDraft>;
    updateForm: (owner: string, update: (form: QuoteFormDraft) => QuoteFormDraft) => void;
    resetForm: (owner: string) => void;
}

export const useQuoteDraftStore = create<QuoteDraftState>()(
    persist(
        (set) => ({
            forms: {},
            updateForm: (owner, update) =>
                set((state) => ({
                    forms: { ...state.forms, [owner]: update(state.forms[owner] ?? emptyQuoteForm) },
                })),
            resetForm: (owner) =>
                set((state) => {
                    const forms = { ...state.forms };
                    delete forms[owner];
                    return { forms };
                }),
        }),
        {
            name: 'bitetobusiness.quote-form-drafts',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ forms: state.forms }),
        },
    ),
);
