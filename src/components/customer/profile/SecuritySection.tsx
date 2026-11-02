import { useProfileContext } from './ProfileModel.tsx';
import { MailCheck, RotateCcw } from 'lucide-react';
import { Panel, Pill } from './ProfileUI.tsx';
import { copy } from './ProfileModel.tsx';

export default function SecuritySection() {
    const { user, savedProfile, setProfile, say, defaultProfile } = useProfileContext();
    return (
        <Panel id="security" className="h-full">
            <Pill>PERSONALIZATION</Pill>
            <h2 className="m-0 mt-3 font-serif text-lg font-bold">Adaptive UI Layout & Security</h2>
            <p className="mt-2 text-xs leading-5 text-[#718076]">
                Restore saved profile edits or reset browser preview fields. Account security
                remains managed by your sign-in service.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => {
                        setProfile(copy(savedProfile));
                        say('Reverted to the last saved local profile.');
                    }}
                    className="rounded-xl border border-[#B2BEB5] bg-white px-4 py-2.5 text-xs font-bold hover:bg-[#F0F4F0]"
                >
                    <RotateCcw size={13} className="mr-1 inline" /> Revert Changes
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setProfile(defaultProfile());
                        say('Preview reset. Select Save Profile to keep the reset.');
                    }}
                    className="rounded-xl border border-[#B2BEB5] bg-white px-4 py-2.5 text-xs font-bold hover:bg-[#F0F4F0]"
                >
                    Reset to Base UI
                </button>
            </div>
            <div className="mt-6 rounded-xl bg-[#E7F2EB] p-3 text-[11px] text-[#416454]">
                <MailCheck size={15} className="mr-2 inline" />{' '}
                {user?.emailVerified
                    ? 'Primary email is verified.'
                    : 'Primary email verification is pending.'}
            </div>
        </Panel>
    );
}
