import { useProfileContext } from './ProfileModel.tsx';
import { Landmark } from 'lucide-react';
import { Label, Input, Panel, PanelTitle, Pill } from './ProfileUI.tsx';
import { PAYMENT_IMAGES } from './ProfileModel.tsx';

export default function BillingSection() {
    const { profile, setField } = useProfileContext();
    return (
        <Panel id="billing">
            <PanelTitle
                n="2"
                title="VAT E-Invoice & Tax Billing Profile"
                subtitle="Billing details saved to your profile draft."
                trailing={
                    <Pill>
                        {/^\d{10}(\d{3})?$/.test(profile.taxId)
                            ? 'Tax ID format valid'
                            : 'Tax ID not validated'}
                    </Pill>
                }
            />
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label>Corporate Tax ID (10 or 13 digits)</Label>
                    <Input
                        value={profile.taxId}
                        onChange={(v) => setField('taxId', v.replace(/\D/g, '').slice(0, 13))}
                        placeholder="e.g. 0316894210"
                    />
                </div>
                <div>
                    <Label>Invoice Recipient Email</Label>
                    <Input
                        value={profile.invoiceEmail}
                        onChange={(v) => setField('invoiceEmail', v)}
                        type="email"
                        placeholder="accounting@company.com"
                    />
                </div>
                <div>
                    <Label>Legal Buyer Name on Invoice</Label>
                    <Input
                        value={profile.legalName}
                        onChange={(v) => setField('legalName', v)}
                        placeholder="Registered legal business name"
                    />
                </div>
                <div>
                    <Label>Preferred Payment Method (display preference)</Label>
                    <div className="grid grid-cols-3 gap-2.5">
                        {(['MOMO', 'VISA', 'OTHER'] as const).map((payment) => {
                            const selected = profile.payment === payment;
                            const caption =
                                payment === 'OTHER'
                                    ? 'Other / Bank'
                                    : payment === 'MOMO'
                                      ? 'MoMo Wallet'
                                      : 'Visa Card';
                            return (
                                <button
                                    key={payment}
                                    type="button"
                                    aria-label={`Choose ${caption}`}
                                    aria-pressed={selected}
                                    onClick={() => setField('payment', payment)}
                                    className={`relative flex h-[76px] min-w-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border-2 px-2 py-2 transition-all duration-200 hover:-translate-y-0.5 ${
                                        selected
                                            ? 'border-[#15573F] bg-[#E4F5EB] shadow-[0_4px_12px_rgba(16,75,51,.13)]'
                                            : 'border-[#D8E0D8] bg-white hover:border-[#9BBEAB] hover:bg-[#F7FBF7]'
                                    }`}
                                >
                                    {selected && (
                                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#15573F] text-[10px] font-bold text-white">
                                            ✓
                                        </span>
                                    )}
                                    {payment === 'OTHER' ? (
                                        <Landmark
                                            size={32}
                                            aria-hidden="true"
                                            className="h-9 w-9 text-[#15573F]"
                                        />
                                    ) : (
                                        <img
                                            src={PAYMENT_IMAGES[payment]}
                                            alt={`${payment} logo`}
                                            draggable={false}
                                            className="h-9 w-full max-w-[112px] object-contain"
                                        />
                                    )}
                                    <span className="truncate text-[10px] font-bold text-[#38574A]">
                                        {caption}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[#F0E8D9] p-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold">
                    <input
                        type="checkbox"
                        className="accent-[#123B2E]"
                        checked={profile.sameBilling}
                        onChange={(e) => setField('sameBilling', e.target.checked)}
                    />{' '}
                    Billing address is the same as primary receiving kitchen
                </label>
                {!profile.sameBilling && (
                    <div className="mt-3">
                        <Label>Registered Tax Billing Address</Label>
                        <Input
                            value={profile.billingAddress}
                            onChange={(v) => setField('billingAddress', v)}
                            placeholder="Address on tax invoice"
                        />
                    </div>
                )}
                {profile.sameBilling && (
                    <p className="m-0 mt-2 text-[11px] text-[#576D60]">
                        {profile.addresses.find((a) => a.primary)?.address ||
                            'Add a primary delivery destination below.'}
                    </p>
                )}
            </div>
            <p className="mb-0 mt-2 text-[10px] text-[#78847D]">
                Tax ID format checks are local only. Official validation and payment processing are
                not connected.
            </p>
        </Panel>
    );
}
