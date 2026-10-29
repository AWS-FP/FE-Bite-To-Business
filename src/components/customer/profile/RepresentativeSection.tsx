import { useProfileContext, windows } from './ProfileModel.tsx';
import { Label, Input, Panel, PanelTitle, Pill } from './ProfileUI.tsx';

export default function RepresentativeSection() {
    const { user, profile, setField } = useProfileContext();
    return (
        <Panel id="representative">
            <PanelTitle
                n="1"
                title="Representative & Organization Information"
                subtitle="Primary contact details for quotation and order records."
                trailing={<Pill>Single Representative Policy</Pill>}
            />
            <div className="grid gap-x-4 gap-y-4 md:grid-cols-2">
                <div>
                    <Label>Representative Full Name *</Label>
                    <Input
                        value={profile.representative}
                        onChange={(v) => setField('representative', v)}
                        placeholder="Full name"
                    />
                </div>
                <div>
                    <Label>Business / Cooperative Name *</Label>
                    <Input
                        value={profile.company}
                        onChange={(v) => setField('company', v)}
                        placeholder="Registered organization"
                    />
                </div>
                <div>
                    <Label>Login Email (verified by auth provider)</Label>
                    <div className="relative">
                        <Input value={user?.email ?? ''} disabled />
                        <span className="absolute right-2 top-2.5 rounded-full bg-[#DFF4EA] px-2 py-1 text-[10px] font-bold text-[#15573F]">
                            {user?.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                    </div>
                </div>
                <div>
                    <Label>Vietnam Phone Number *</Label>
                    <Input
                        value={profile.phone}
                        onChange={(v) => setField('phone', v)}
                        type="tel"
                        placeholder="09xx xxx xxx"
                    />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input value="••••••••••" disabled />
                </div>
                <div>
                    <Label>Preferred Delivery Time Window</Label>
                    <select
                        value={profile.deliveryWindow}
                        onChange={(e) => setField('deliveryWindow', e.target.value)}
                        className="h-11 w-full rounded-xl border border-[#D3DBD5] bg-white px-3 text-xs text-[#172C26] outline-none focus:border-[#1B654B]"
                    >
                        {windows.map((window) => (
                            <option key={window}>{window}</option>
                        ))}
                    </select>
                </div>
            </div>
            <p className="mb-0 mt-3 text-[11px] text-[#79877C]">
                Password updates require your authentication backend; this screen does not collect
                or store passwords.
            </p>
        </Panel>
    );
}
