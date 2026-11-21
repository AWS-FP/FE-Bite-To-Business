import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PackageDraft } from '@/components/customer/checkout/PackageForm';

export interface QuoteFormDraft {
    productCode: string;
    shippingCode: string;
    quantities: Record<string, string>;
    parcel: PackageDraft;
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
}

export const useQuoteDraftStore = create<QuoteDraftState>()(
    persist(
        (set) => ({
            forms: {},
            updateForm: (owner, update) =>
                set((state) => ({
                    forms: { ...state.forms, [owner]: update(state.forms[owner] ?? emptyQuoteForm) },
                })),
        }),
        {
            name: 'bitetobusiness.quote-form-drafts',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ forms: state.forms }),
        },
    ),
);
