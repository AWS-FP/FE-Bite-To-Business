import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDeliveryCities } from '@/services/locationService';
import { updateCustomerProfile } from '@/services/customer/profileService';
import { useAuthStore } from '@/store/admin/authStore';
import type { CustomerProfile, UpdateCustomerProfile } from '@/types/customer/profile';
import { getAuthError } from '@/utils/admin/authError';
import { fullDeliveryAddress } from '@/utils/deliveryAddress';
import { normalizePhone } from '@/utils/phone';

type ProfileFields = {
    firstName: string;
    lastName: string;
    phone: string;
    businessName: string;
    province: string;
    ward: string;
    deliveryAddress: string;
    deliveryNote: string;
    invoiceSameAsDelivery: boolean;
    invoicePurchaser: string;
    invoiceTaxCode: string;
    invoiceEmail: string;
    invoiceAddress: string;
};

function toFields(profile: CustomerProfile): ProfileFields {
    return {
        firstName: profile.user.firstName || '',
        lastName: profile.user.lastName || '',
        phone: profile.user.phone || '',
        businessName: profile.businessName || '',
        province: profile.province || '',
        ward: profile.ward || '',
        deliveryAddress: profile.deliveryAddress || '',
        deliveryNote: profile.deliveryNote || '',
        invoiceSameAsDelivery: profile.invoiceSameAsDelivery ?? false,
        invoicePurchaser: profile.invoicePurchaser || '',
        invoiceTaxCode: profile.invoiceTaxCode || '',
        invoiceEmail: profile.invoiceEmail || '',
        invoiceAddress: profile.invoiceAddress || '',
    };
}

const controlClass =
    'h-11 w-full min-w-0 rounded-lg border border-store-line bg-white px-3 font-body text-sm font-normal text-store-ink outline-none placeholder:text-store-placeholder focus:border-store-green disabled:bg-surface-soft';

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: ReactNode;
}) {
    return (
        <label className="block min-w-0 font-body text-sm font-semibold text-store-ink">
            <span className="mb-2 block">
                {label} {required && <span className="text-danger">*</span>}
            </span>
            {children}
        </label>
    );
}

function Section({
    id,
    title,
    description,
    children,
}: {
    id: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section
            id={id}
            className="scroll-mt-[245px] rounded-2xl border border-store-line bg-white p-5"
        >
            <div className="mb-5 border-b border-store-line pb-4">
                <h2 className="m-0 font-subheading text-xl font-bold text-store-ink">{title}</h2>
                <p className="mb-0 mt-1 text-sm text-store-muted">{description}</p>
            </div>
            {children}
        </section>
    );
}

export default function ProfileForm({ initialProfile }: { initialProfile: CustomerProfile }) {
    const { t } = useTranslation('profile');
    const queryClient = useQueryClient();
    const [savedProfile, setSavedProfile] = useState(initialProfile);
    const [fields, setFields] = useState(() => toFields(initialProfile));
    const [legacyConfirmed, setLegacyConfirmed] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [success, setSuccess] = useState(false);
    const locations = useQuery({
        queryKey: ['delivery-cities', 'v2'],
        queryFn: ({ signal }) => getDeliveryCities(signal),
        staleTime: 86400000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
    const selectedCity = locations.data?.find((city) => city.name === fields.province);
    const wards = selectedCity?.wards || [];
    const fullAddress = fullDeliveryAddress(
        fields.deliveryAddress,
        fields.ward,
        null,
        fields.province,
    );

    function setField<K extends keyof ProfileFields>(key: K, value: ProfileFields[K]) {
        setFields((previous) => ({ ...previous, [key]: value }));
        setMessage('');
        setSuccess(false);
    }

    function discard() {
        setFields(toFields(savedProfile));
        setLegacyConfirmed(false);
        setMessage('');
        setErrorCode('');
        setSuccess(false);
    }

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage('');
        setErrorCode('');
        setSuccess(false);
        const phone = normalizePhone(fields.phone);
        if (
            !fields.firstName.trim() ||
            !fields.lastName.trim() ||
            !fields.businessName.trim() ||
            !fields.province ||
            !fields.ward.trim() ||
            !fields.deliveryAddress.trim()
        ) {
            setMessage(t('required'));
            return;
        }
        if (!/^\+84[35789][0-9]{8}$/.test(phone)) {
            setMessage(t('invalidPhone'));
            return;
        }
        if (fields.invoiceTaxCode && !/^[0-9]{10}$/.test(fields.invoiceTaxCode.trim())) {
            setMessage(t('invalidTax'));
            return;
        }
        if (
            fields.invoiceEmail &&
            !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/i.test(fields.invoiceEmail.trim())
        ) {
            setMessage(t('invalidEmail'));
            return;
        }
        if (savedProfile.district && !legacyConfirmed) {
            setMessage(t('legacyConfirm'));
            return;
        }
        const request: UpdateCustomerProfile = {
            ...fields,
            phone,
            avatarUrl: savedProfile.user.avatarUrl,
            deliveryNote: fields.deliveryNote.trim() || null,
            invoicePurchaser: fields.invoicePurchaser.trim() || null,
            invoiceTaxCode: fields.invoiceTaxCode.trim() || null,
            invoiceEmail: fields.invoiceEmail.trim() || null,
            invoiceAddress: fields.invoiceSameAsDelivery
                ? null
                : fields.invoiceAddress.trim() || null,
        };
        const sessionVersion = useAuthStore.getState().sessionVersion;
        setSaving(true);
        try {
            const updated = await updateCustomerProfile(request);
            const state = useAuthStore.getState();
            if (
                state.session &&
                state.sessionVersion === sessionVersion &&
                state.session.user.id === updated.user.id
            ) {
                state.updateSession(sessionVersion, { ...state.session, user: updated.user });
                queryClient.setQueryData(['customer-profile', updated.user.id], updated);
                setSavedProfile(updated);
                setFields(toFields(updated));
                setLegacyConfirmed(false);
                setMessage(t('saved'));
                setSuccess(true);
            }
        } catch (error) {
            setMessage(t('saveError'));
            setErrorCode(getAuthError(error).code);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={save} className="min-w-0 space-y-4">
            <fieldset disabled={saving} className="m-0 min-w-0 space-y-4 border-0 p-0">
                <Section id="personal" title={t('personal')} description={t('personalHint')}>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label={t('firstName')} required>
                            <input
                                className={controlClass}
                                value={fields.firstName}
                                onChange={(e) => setField('firstName', e.target.value)}
                                maxLength={100}
                                required
                            />
                        </Field>
                        <Field label={t('lastName')} required>
                            <input
                                className={controlClass}
                                value={fields.lastName}
                                onChange={(e) => setField('lastName', e.target.value)}
                                maxLength={100}
                                required
                            />
                        </Field>
                        <Field label={t('businessName')} required>
                            <input
                                className={controlClass}
                                value={fields.businessName}
                                onChange={(e) => setField('businessName', e.target.value)}
                                maxLength={200}
                                required
                            />
                        </Field>
                        <Field label={t('phone')} required>
                            <input
                                className={controlClass}
                                type="tel"
                                value={fields.phone}
                                onChange={(e) => setField('phone', e.target.value)}
                                required
                            />
                        </Field>
                        <Field label={t('email')}>
                            <input
                                className={controlClass}
                                type="email"
                                value={savedProfile.user.email}
                                disabled
                            />
                        </Field>
                    </div>
                    <div className="mt-3 text-xs">
                        {savedProfile.user.emailVerified ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-success">
                                <Check size={14} aria-hidden="true" />
                                {t('verified')}
                            </span>
                        ) : (
                            <span className="text-store-muted">{t('unverified')}</span>
                        )}
                    </div>
                </Section>
                <Section id="delivery" title={t('delivery')} description={t('deliveryHint')}>
                    {savedProfile.district && (
                        <div className="mb-4 rounded-lg border border-store-yellow bg-surface-yellow p-4 text-sm">
                            <p className="m-0">
                                {t('legacy', { district: savedProfile.district })}
                            </p>
                            <label className="mt-3 flex items-center gap-2 font-semibold">
                                <input
                                    type="checkbox"
                                    checked={legacyConfirmed}
                                    onChange={(e) => setLegacyConfirmed(e.target.checked)}
                                />
                                {t('legacyConfirm')}
                            </label>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label={t('city')} required>
                            <select
                                className={controlClass}
                                value={fields.province}
                                onChange={(e) =>
                                    setFields((previous) => ({
                                        ...previous,
                                        province: e.target.value,
                                        ward: '',
                                    }))
                                }
                                required
                            >
                                <option value="">{t('chooseCity')}</option>
                                <option value="Thành phố Hà Nội">Thành phố Hà Nội</option>
                                <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
                            </select>
                        </Field>
                        <Field label={t('ward')} required>
                            {locations.isError ? (
                                <input
                                    className={controlClass}
                                    value={fields.ward}
                                    onChange={(e) => setField('ward', e.target.value)}
                                    maxLength={100}
                                    required
                                />
                            ) : (
                                <select
                                    className={controlClass}
                                    value={fields.ward}
                                    onChange={(e) => setField('ward', e.target.value)}
                                    disabled={!selectedCity}
                                    required
                                >
                                    <option value="">{t('chooseWard')}</option>
                                    {fields.ward &&
                                        !wards.some((ward) => ward.name === fields.ward) && (
                                            <option value={fields.ward}>{fields.ward}</option>
                                        )}
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.name}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </Field>
                        <div className="col-span-2">
                            <Field label={t('address')} required>
                                <input
                                    className={controlClass}
                                    value={fields.deliveryAddress}
                                    onChange={(e) => setField('deliveryAddress', e.target.value)}
                                    placeholder={t('addressPlaceholder')}
                                    maxLength={1000}
                                    required
                                />
                            </Field>
                        </div>
                        <div className="col-span-2">
                            <Field label={t('note')}>
                                <textarea
                                    className={`${controlClass} h-auto resize-y py-3`}
                                    rows={2}
                                    value={fields.deliveryNote}
                                    onChange={(e) => setField('deliveryNote', e.target.value)}
                                    maxLength={1000}
                                />
                            </Field>
                        </div>
                    </div>
                    {locations.isError && (
                        <p role="status" className="mb-0 text-sm text-danger-strong">
                            {t('locationError')}{' '}
                            <button
                                type="button"
                                className="underline"
                                onClick={() => void locations.refetch()}
                            >
                                {t('retry')}
                            </button>
                        </p>
                    )}
                    {fullAddress && (
                        <p className="mb-0 mt-4 rounded-lg bg-surface-green px-4 py-3 text-sm">
                            <strong>{t('fullAddress')}:</strong> {fullAddress}
                        </p>
                    )}
                </Section>
                <Section id="billing" title={t('billing')} description={t('billingHint')}>
                    <label className="mb-4 flex items-center gap-2 text-sm font-semibold">
                        <input
                            type="checkbox"
                            checked={fields.invoiceSameAsDelivery}
                            onChange={(e) => setField('invoiceSameAsDelivery', e.target.checked)}
                            className="accent-store-green"
                        />
                        {t('sameAddress')}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label={t('purchaser')}>
                            <input
                                className={controlClass}
                                value={fields.invoicePurchaser}
                                onChange={(e) => setField('invoicePurchaser', e.target.value)}
                                maxLength={200}
                            />
                        </Field>
                        <Field label={t('taxCode')}>
                            <input
                                className={controlClass}
                                inputMode="numeric"
                                value={fields.invoiceTaxCode}
                                onChange={(e) => setField('invoiceTaxCode', e.target.value)}
                                maxLength={10}
                            />
                        </Field>
                        <Field label={t('invoiceEmail')}>
                            <input
                                className={controlClass}
                                type="email"
                                value={fields.invoiceEmail}
                                onChange={(e) => setField('invoiceEmail', e.target.value)}
                                maxLength={254}
                            />
                        </Field>
                        <Field label={t('invoiceAddress')}>
                            <input
                                className={controlClass}
                                value={
                                    fields.invoiceSameAsDelivery
                                        ? fullAddress
                                        : fields.invoiceAddress
                                }
                                onChange={(e) => setField('invoiceAddress', e.target.value)}
                                disabled={fields.invoiceSameAsDelivery}
                                maxLength={1000}
                            />
                        </Field>
                    </div>
                </Section>
            </fieldset>
            {message && (
                <div
                    role={success ? 'status' : 'alert'}
                    className={`rounded-lg border p-4 text-sm ${success ? 'border-store-line bg-surface-green text-store-green' : 'border-danger-line bg-danger-soft text-danger-strong'}`}
                >
                    {success && <Check size={16} className="mr-2 inline" />}
                    {message}
                    {errorCode && <div className="mt-1">{t('errorCode', { code: errorCode })}</div>}
                </div>
            )}
            <div className="flex justify-end gap-3 border-t border-store-line pt-4">
                <button
                    type="button"
                    disabled={saving}
                    onClick={discard}
                    className="rounded-lg border border-store-line bg-white px-5 py-3 text-sm font-bold text-store-ink"
                >
                    {t('discard')}
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-store-ink bg-store-yellow px-6 py-3 text-sm font-bold text-store-ink disabled:opacity-60"
                >
                    <Save size={16} />
                    {saving ? t('saving') : t('save')}
                </button>
            </div>
        </form>
    );
}
