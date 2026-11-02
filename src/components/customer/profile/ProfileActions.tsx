import { useProfileContext } from './ProfileModel.tsx';
import { Save } from 'lucide-react';
import { copy } from './ProfileModel.tsx';

export default function ProfileActions() {
    const { savedProfile, setProfile, say, save } = useProfileContext();
    return (
        <div className="flex flex-wrap justify-end gap-3 rounded-2xl bg-[#F9F7F1] p-4">
            <button
                type="button"
                onClick={() => {
                    setProfile(copy(savedProfile));
                    say('Unsaved edits discarded.');
                }}
                className="rounded-xl border border-[#D3DBD5] px-5 py-2.5 text-xs font-bold hover:bg-white"
            >
                Discard
            </button>
            <button
                type="button"
                onClick={save}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFE14D] px-6 py-2.5 text-xs font-black text-[#19352B] shadow-sm transition hover:bg-[#FFEA83]"
            >
                <Save size={15} /> Save Profile
            </button>
        </div>
    );
}
