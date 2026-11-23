import { MapPinned, Plus, Trash2, UserRoundCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import type { Quote, QuotePackage } from '@/types/customer/quote';
import { searchDeliveryAddresses } from '@/services/geocodingService';
import type { AddressSuggestion } from '@/types/geocoding';
import { sameDeliveryAddress } from '@/utils/customer/sameDeliveryAddress';

export interface PackageDraft {
    name: string;
    recipientName: string;
    recipientPhone: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    address: string;
    addressRefId?: string;
    /** Exact point chosen on the distribution page; used instead of geocoding the address text. */
    latitude?: number;
    longitude?: number;
    /** Filled from the delivery details the customer gave at registration. */
    fromProfile?: boolean;
    note: string;
    city: 'HCM' | 'HANOI';
}

interface PackageFormProps {
    quote: Quote;
    packages: QuotePackage[];
    parcel: PackageDraft;
    setParcel: Dispatch<SetStateAction<PackageDraft>>;
    quantities: Record<string, string>;
    setQuantities: Dispatch<SetStateAction<Record<string, string>>>;
    allocated: (itemId: string) => number;
    busy: boolean;
    error: string;
    duplicateAddressError: boolean;
    clearAddressError: () => void;
    createPackage: (event: FormEvent<HTMLFormElement>) => void;
    /** Opens the distribution map to pick the address, then comes back to this step. */
    onPickOnMap?: () => void;
    /** Clears the default package filled from the profile. */
    onClearProfileDefault?: () => void;
    /** Bumped each time the customer tries to continue with products left unallocated. */
    revealErrors?: number;
}

const field =
    'w-full rounded-lg border border-store-ink/25 bg-white px-3 py-2.5 text-sm text-store-ink focus:border-store-ink focus:outline-none';
const secondary =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-store-ink/25 bg-white px-4 py-2 font-bold text-store-ink hover:bg-store-cream';

export default function PackageForm({
    quote,
    packages,
    parcel,
    setParcel,
    quantities,
    setQuantities,
    allocated,
    busy,
    error,
    duplicateAddressError,
    clearAddressError,
    createPackage,
    onPickOnMap,
    onClearProfileDefault,
    revealErrors = 0,
}: PackageFormProps) {
    const { t, i18n } = useTranslation('quote');
    const productName = (item: Quote['items'][number]) =>
        i18n.resolvedLanguage === 'en' ? item.nameEn || item.nameVi : item.nameVi;
    const [startTime = '', endTime = ''] = parcel.deliveryTimeSlot.split(' - ');
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [suggestionError, setSuggestionError] = useState(false);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const pinnedFromMap = parcel.latitude != null && parcel.longitude != null;
    const addressResolved = !!parcel.addressRefId || pinnedFromMap;
    useEffect(() => {
        if (addressResolved || parcel.address.trim().length < 2) return;
        const controller = new AbortController();
        const timer = window.setTimeout(() => {
            void searchDeliveryAddresses(
                parcel.address.trim(),
                parcel.city === 'HCM' ? 'hcm' : 'hanoi',
                controller.signal,
            )
                .then((result) => {
                    if (!controller.signal.aborted) {
                        setSuggestions(result);
                        setSuggestionError(false);
                    }
                })
                .catch(() => {
                    if (!controller.signal.aborted) {
                        setSuggestions([]);
                        setSuggestionError(true);
                    }
                });
        }, 350);
        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [parcel.address, addressResolved, parcel.city]);
    // "Review quote total" with products still unallocated reveals every error in this form too.
    const [revealHandled, setRevealHandled] = useState(0);
    const revealed = revealErrors > revealHandled;
    const showError = (name: string, message: string | undefined) =>
        message &&
        (submitted || revealed || touched[name] || (name === 'address' && duplicateAddressError))
            ? message
            : undefined;
    const markTouched = (name: string) => setTouched((current) => ({ ...current, [name]: true }));
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const errors: Record<string, string> = {};
    if (!parcel.name.trim()) errors.name = t('validation.required');
    if (!parcel.recipientName.trim()) errors.recipientName = t('validation.required');
    if (!parcel.recipientPhone.trim()) errors.recipientPhone = t('validation.required');
    if (!parcel.deliveryDate) errors.deliveryDate = t('validation.required');
    else if (parcel.deliveryDate < todayString) errors.deliveryDate = t('validation.datePast');
    if (!startTime || !endTime) errors.time = t('validation.timeRequired');
    else if (endTime <= startTime) errors.time = t('errors.invalidTime');
    if (!parcel.address.trim()) errors.address = t('validation.required');
    else if (
        duplicateAddressError ||
        packages.some((item) => sameDeliveryAddress(parcel.city, parcel.address, item))
    ) {
        errors.address = t('validation.duplicateAddress');
    }

    let selected = false;
    for (const item of quote.items) {
        const raw = quantities[item.productId];
        if (!raw) continue;
        const quantity = Number(raw);
        const max = Math.max(0, Number(item.quantity) - allocated(item.id));
        const step = Number(item.quantityStep);
        if (
            !Number.isFinite(quantity) ||
            quantity < 0 ||
            Math.abs(quantity * 1000 - Math.round(quantity * 1000)) > 1e-7
        ) {
            errors[item.productId] = t('validation.quantityInvalid');
        } else if (quantity > max + 1e-8) {
            errors[item.productId] = t('validation.quantityMax', { max, unit: item.unitCode });
        } else if (step <= 0 || Math.abs(quantity / step - Math.round(quantity / step)) > 1e-7) {
            errors[item.productId] = t('validation.quantityStep', { step, unit: item.unitCode });
        } else if (quantity > 0) {
            selected = true;
        }
    }
    if (!selected && !quote.items.some((item) => errors[item.productId]))
        errors.quantities = t('validation.quantityRequired');

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (Object.keys(errors).length > 0) {
            setSubmitted(true);
            return;
        }
        setSubmitted(false);
        setTouched({});
        setRevealHandled(revealErrors);
        createPackage(event);
    }
    const errorText = (name: string) => {
        const message = showError(name, errors[name]);
        return message ? (
            <span role="alert" className="mt-1 block text-sm font-normal text-red-700">
                {message}
            </span>
        ) : null;
    };
    return (
        <form
            id="package-form"
            noValidate
            onSubmit={onSubmit}
            className="rounded-2xl border border-store-ink/20 bg-white p-6"
        >
            <h2 className="m-0 font-subheading text-xl font-bold">{t('form.title')}</h2>
            {parcel.fromProfile && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-store-green/30 bg-surface-green px-4 py-3 text-sm">
                    <p className="m-0 flex items-center gap-2 text-store-ink">
                        <UserRoundCheck size={18} className="shrink-0 text-store-green" aria-hidden="true" />
                        {t('form.profileDefault')}
                    </p>
                    {onClearProfileDefault && (
                        <button
                            type="button"
                            onClick={onClearProfileDefault}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50"
                        >
                            <Trash2 size={14} aria-hidden="true" />
                            {t('form.clearProfileDefault')}
                        </button>
                    )}
                </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-4">
                <label className="text-sm font-bold">
                    {t('form.name')}
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={200}
                        value={parcel.name}
                        onBlur={() => markTouched('name')}
                        aria-invalid={!!showError('name', errors.name)}
                        onChange={(e) => setParcel({ ...parcel, name: e.target.value })}
                        placeholder={t('form.namePlaceholder')}
                    />
                    {errorText('name')}
                </label>
                <label className="text-sm font-bold">
                    {t('form.city')}
                    <select
                        className={`${field} mt-2`}
                        value={parcel.city}
                        onChange={(e) => {
                            setSuggestions([]);
                            setSuggestionError(false);
                            clearAddressError();
                            setParcel({
                                ...parcel,
                                city: e.target.value as 'HCM' | 'HANOI',
                                addressRefId: undefined,
                                latitude: undefined,
                                longitude: undefined,
                            });
                        }}
                    >
                        <option value="HCM">{t('form.hcm')}</option>
                        <option value="HANOI">{t('form.hanoi')}</option>
                    </select>
                </label>
                <label className="text-sm font-bold">
                    {t('form.recipient')}
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={200}
                        value={parcel.recipientName}
                        onBlur={() => markTouched('recipientName')}
                        aria-invalid={!!showError('recipientName', errors.recipientName)}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                recipientName: e.target.value,
                            })
                        }
                    />
                    {errorText('recipientName')}
                </label>
                <label className="text-sm font-bold">
                    {t('form.phone')}
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={30}
                        value={parcel.recipientPhone}
                        onBlur={() => markTouched('recipientPhone')}
                        aria-invalid={!!showError('recipientPhone', errors.recipientPhone)}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                recipientPhone: e.target.value,
                            })
                        }
                    />
                    {errorText('recipientPhone')}
                </label>
                <label className="text-sm font-bold">
                    {t('form.date')}
                    <input
                        type="date"
                        className={`${field} mt-2`}
                        required
                        value={parcel.deliveryDate}
                        onBlur={() => markTouched('deliveryDate')}
                        aria-invalid={!!showError('deliveryDate', errors.deliveryDate)}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                deliveryDate: e.target.value,
                            })
                        }
                    />
                    {errorText('deliveryDate')}
                </label>
                <fieldset className="min-w-0 border-0 p-0 text-sm font-bold">
                    <legend>{t('form.time')}</legend>
                    <div className="mt-2 flex items-center gap-2">
                        <label className="min-w-0 flex-1">
                            <span className="sr-only">{t('form.startTime')}</span>
                            <input
                                type="time"
                                className={field}
                                required
                                value={startTime}
                                onBlur={() => markTouched('time')}
                                aria-invalid={!!showError('time', errors.time)}
                                onChange={(e) =>
                                    setParcel({
                                        ...parcel,
                                        deliveryTimeSlot: `${e.target.value} - ${endTime}`,
                                    })
                                }
                            />
                        </label>
                        <span aria-hidden="true">–</span>
                        <label className="min-w-0 flex-1">
                            <span className="sr-only">{t('form.endTime')}</span>
                            <input
                                type="time"
                                className={field}
                                required
                                min={startTime || undefined}
                                value={endTime}
                                onBlur={() => markTouched('time')}
                                aria-invalid={!!showError('time', errors.time)}
                                onChange={(e) =>
                                    setParcel({
                                        ...parcel,
                                        deliveryTimeSlot: `${startTime} - ${e.target.value}`,
                                    })
                                }
                            />
                        </label>
                    </div>
                    {errorText('time')}
                </fieldset>
                <div
                    className="relative col-span-2 text-sm font-bold"
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
                            setSuggestionsOpen(false);
                    }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <label htmlFor="package-address">{t('form.address')}</label>
                        {onPickOnMap && (
                            <button
                                type="button"
                                onClick={onPickOnMap}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-store-ink/25 bg-white px-3 py-1.5 text-xs font-bold text-store-green hover:bg-store-cream"
                            >
                                <MapPinned size={15} aria-hidden="true" />
                                {t('form.pickOnMap')}
                            </button>
                        )}
                    </div>
                    <input
                        id="package-address"
                        className={`${field} mt-2`}
                        required
                        maxLength={200}
                        value={parcel.address}
                        onFocus={() => setSuggestionsOpen(true)}
                        onBlur={() => markTouched('address')}
                        aria-invalid={!!showError('address', errors.address)}
                        onChange={(e) => {
                            setSuggestions([]);
                            setSuggestionError(false);
                            clearAddressError();
                            setParcel({
                                ...parcel,
                                address: e.target.value,
                                addressRefId: undefined,
                                latitude: undefined,
                                longitude: undefined,
                            });
                        }}
                        placeholder={t('form.addressPlaceholder')}
                    />
                    {errorText('address')}
                    {pinnedFromMap && (
                        <p className="mt-1 text-xs font-normal text-store-green">
                            {t('form.addressFromDistribution')}
                        </p>
                    )}
                    {suggestionsOpen &&
                        !addressResolved &&
                        parcel.address.trim().length >= 2 &&
                        suggestions.length > 0 && (
                            <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-store-ink/20 bg-white p-1 shadow-lg">
                                {suggestions.map((suggestion) => (
                                    <li key={suggestion.refId}>
                                        <button
                                            type="button"
                                            className="w-full rounded px-3 py-2 text-left font-normal hover:bg-store-cream focus:bg-store-cream"
                                            onClick={() => {
                                                setParcel({
                                                    ...parcel,
                                                    address: suggestion.display,
                                                    addressRefId: suggestion.refId,
                                                    latitude: undefined,
                                                    longitude: undefined,
                                                });
                                                setSuggestions([]);
                                                setSuggestionsOpen(false);
                                                setSuggestionError(false);
                                                clearAddressError();
                                            }}
                                        >
                                            {suggestion.display}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    {!addressResolved &&
                        parcel.address.trim().length >= 2 &&
                        suggestionError && (
                            <p className="mt-1 text-xs font-normal text-store-muted">
                                {t('form.suggestionUnavailable')}
                            </p>
                        )}
                </div>
                <label className="col-span-2 text-sm font-bold">
                    {t('form.note')}{' '}
                    <span className="font-normal text-store-muted">{t('form.optional')}</span>
                    <input
                        className={`${field} mt-2`}
                        maxLength={1000}
                        value={parcel.note}
                        onChange={(e) => setParcel({ ...parcel, note: e.target.value })}
                    />
                </label>
            </div>
            <h3 className="mb-3 mt-6 text-base font-bold">{t('form.quantities')}</h3>
            {errorText('quantities')}
            <div className="space-y-3">
                {quote.items.map((item) => (
                    <div key={item.id} className="rounded-lg bg-store-cream px-4 py-3 text-sm">
                        <label className="flex items-center justify-between gap-4">
                            <span>
                                <strong>{productName(item)}</strong>
                                <span className="ml-2 text-store-muted">
                                    {t('form.remaining', {
                                        quantity: Number(
                                            Math.max(
                                                0,
                                                Number(item.quantity) -
                                                    allocated(item.id) -
                                                    Math.max(
                                                        0,
                                                        Number(quantities[item.productId]) || 0,
                                                    ),
                                            ).toFixed(3),
                                        ),
                                        unit: item.unitCode,
                                    })}
                                </span>
                                {!(Number(item.quantityStep) > 0) && (
                                    <span className="ml-2 text-store-muted">
                                        {t('form.missingStep')}
                                    </span>
                                )}
                            </span>
                            <input
                                type="number"
                                min="0"
                                step={
                                    Number(item.quantityStep) > 0
                                        ? Number(item.quantityStep)
                                        : undefined
                                }
                                max={Math.max(0, Number(item.quantity) - allocated(item.id))}
                                disabled={
                                    busy ||
                                    !(Number(item.quantityStep) > 0) ||
                                    Number(item.quantity) - allocated(item.id) <= 0
                                }
                                className={`${field} max-w-28`}
                                value={quantities[item.productId] || ''}
                                onBlur={() => markTouched(item.productId)}
                                aria-invalid={!!showError(item.productId, errors[item.productId])}
                                onChange={(e) => {
                                    markTouched(item.productId);
                                    setQuantities({
                                        ...quantities,
                                        [item.productId]: e.target.value,
                                    });
                                }}
                                aria-label={t('form.quantityLabel', { name: productName(item) })}
                            />
                        </label>
                        {errorText(item.productId)}
                        {revealed &&
                            !errors[item.productId] &&
                            Number(item.quantity) - allocated(item.id) > 1e-8 && (
                                <span role="alert" className="mt-1 block text-sm font-normal text-red-700">
                                    {t('validation.unallocated', {
                                        quantity: Number(
                                            (Number(item.quantity) - allocated(item.id)).toFixed(3),
                                        ),
                                        unit: item.unitCode,
                                    })}
                                </span>
                            )}
                    </div>
                ))}
            </div>
            <p className="mt-4 text-sm text-store-muted">{t('form.addressNote')}</p>
            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                    {error}
                </p>
            )}
            <button disabled={busy} type="submit" className={secondary}>
                <Plus size={17} /> {busy ? t('form.creating') : t('createPackage')}
            </button>
        </form>
    );
}
