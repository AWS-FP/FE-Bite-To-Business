import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getDeliveryCities } from '@/services/locationService';
import type { RegisterRequest } from '@/types/admin/auth';
import { getAuthError } from '@/utils/admin/authError';
import { fullDeliveryAddress } from '@/utils/deliveryAddress';
import AuthField from './AuthField';
import './DeliveryAddressStep.css';

interface DeliveryAddressStepProps {
    form: UseFormReturn<RegisterRequest>;
}

export default function DeliveryAddressStep({ form }: DeliveryAddressStepProps) {
    const { t } = useTranslation();
    const {
        register,
        control,
        resetField,
        clearErrors,
        formState: { errors, isSubmitting },
    } = form;
    const province = useWatch({ control, name: 'province' });
    const ward = useWatch({ control, name: 'ward' });
    const deliveryAddress = useWatch({ control, name: 'deliveryAddress' });

    const citiesQuery = useQuery({
        queryKey: ['delivery-cities', 'v2'],
        queryFn: ({ signal }) => getDeliveryCities(signal),
    });
    const selectedCity = citiesQuery.data?.find((city) => city.name === province);

    function handleProvinceChange() {
        clearErrors('province');
        resetField('ward');
    }

    function handleWardChange() {
        clearErrors('ward');
    }

    function handleRetryLocations() {
        if (citiesQuery.isError) void citiesQuery.refetch();
    }

    return (
        <div className="auth-fields flex flex-col gap-5">
            <div className="auth-info-banner flex items-start gap-2.5 rounded-xl border border-solid border-[#123b2e26] bg-[#e8eaff] px-4 py-[14px] text-[13px] leading-[1.6] text-[#343282]">
                <MapPin className="mt-0.5 shrink-0" size={19} aria-hidden="true" />
                <div>
                    <strong>{t('register.deliveryTitle')}</strong>
                    <p className="m-0">{t('register.deliveryHint')}</p>
                </div>
            </div>

            <AuthField
                name="businessName"
                label={t('fields.businessName')}
                required
                hint={t('register.businessNameHint')}
                error={errors.businessName?.message}
            >
                <input
                    className="auth-delivery-control"
                    id="businessName"
                    autoComplete="organization"
                    required
                    maxLength={200}
                    placeholder={t('placeholders.businessName')}
                    {...register('businessName')}
                    aria-invalid={!!errors.businessName}
                    aria-describedby="businessName-help"
                />
            </AuthField>

            <AuthField
                name="province"
                label={t('fields.province')}
                required
                hint={t('address.serviceArea')}
                error={errors.province?.message}
            >
                <select
                    className="auth-delivery-control"
                    id="province"
                    autoComplete="address-level1"
                    required
                    disabled={citiesQuery.isPending || citiesQuery.isError || isSubmitting}
                    {...register('province', {
                        onChange: handleProvinceChange,
                    })}
                    value={province || ''}
                    aria-invalid={!!errors.province}
                    aria-describedby="province-help"
                >
                    <option value="">
                        {citiesQuery.isPending ? t('address.loading') : t('placeholders.province')}
                    </option>
                    {citiesQuery.data?.map((city) => (
                        <option key={city.code} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </AuthField>

            <AuthField name="ward" label={t('fields.ward')} required error={errors.ward?.message}>
                <select
                    className="auth-delivery-control"
                    id="ward"
                    autoComplete="address-level2"
                    required
                    disabled={!selectedCity || isSubmitting}
                    {...register('ward', {
                        onChange: handleWardChange,
                    })}
                    value={ward || ''}
                    aria-invalid={!!errors.ward}
                    aria-describedby="ward-help"
                >
                    <option value="">
                        {!selectedCity ? t('address.chooseCityFirst') : t('placeholders.ward')}
                    </option>
                    {selectedCity?.wards.map((item) => (
                        <option key={item.code} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </AuthField>

            {citiesQuery.isError && (
                <div
                    className="rounded-xl border border-solid border-[#f5c2bc] bg-[#ffedeb] p-4 text-[13px] leading-6 text-[#9b2018]"
                    role="alert"
                >
                    <p className="m-0">{t('address.loadError')}</p>
                    <p className="mt-1 mb-2 break-words font-mono text-[12px]">
                        {t('errors.code', { code: getAuthError(citiesQuery.error).code })}
                    </p>
                    <button
                        type="button"
                        className="rounded-lg border border-solid border-current bg-transparent px-3 py-1 font-semibold"
                        disabled={citiesQuery.isFetching}
                        onClick={handleRetryLocations}
                    >
                        {t('address.retry')}
                    </button>
                </div>
            )}

            <AuthField
                name="deliveryAddress"
                label={t('fields.deliveryAddress')}
                required
                hint={t('register.addressHint')}
                error={errors.deliveryAddress?.message}
            >
                <input
                    className="auth-delivery-control"
                    id="deliveryAddress"
                    autoComplete="address-line1"
                    required
                    maxLength={1000}
                    placeholder={t('placeholders.deliveryAddress')}
                    {...register('deliveryAddress')}
                    aria-invalid={!!errors.deliveryAddress}
                    aria-describedby="deliveryAddress-help"
                />
            </AuthField>

            {province && ward && deliveryAddress?.trim() && (
                <div className="rounded-xl border border-solid border-[#123b2e26] bg-[#eaf3ec] p-4 text-[13px] leading-6 text-auth-green">
                    <strong className="block">{t('fields.fullDeliveryAddress')}</strong>
                    <output className="block break-words" aria-live="polite">
                        {fullDeliveryAddress(deliveryAddress, ward, null, province)}
                    </output>
                </div>
            )}

            <AuthField
                name="deliveryNote"
                label={t('fields.deliveryNote')}
                optional
                error={errors.deliveryNote?.message}
            >
                <textarea
                    className="auth-delivery-control"
                    id="deliveryNote"
                    rows={3}
                    maxLength={1000}
                    placeholder={t('placeholders.deliveryNote')}
                    {...register('deliveryNote')}
                    aria-invalid={!!errors.deliveryNote}
                    aria-describedby="deliveryNote-help"
                />
            </AuthField>
        </div>
    );
}
