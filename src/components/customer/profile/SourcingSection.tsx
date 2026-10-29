import { useProfileContext } from './ProfileModel.tsx';
import { Input, Panel, Pill } from './ProfileUI.tsx';

export default function SourcingSection() {
    const { storageKey, sourcing, setSourcing, requestSaved, setRequestSaved, say } =
        useProfileContext();
    return (
        <Panel id="sourcing" className="h-full">
            <div className="mb-3 flex items-center gap-2">
                <Pill tone="yellow">SOURCING REQUEST</Pill>
                <span className="ml-auto text-[10px] text-[#8A918A]">Local draft</span>
            </div>
            <h2 className="m-0 font-serif text-lg font-bold">Request Unlisted Product</h2>
            <p className="mt-2 text-xs leading-5 text-[#718076]">
                Describe a product you need and prepare a request for your logistics team.
            </p>
            <div className="mt-4 space-y-2">
                <Input
                    value={sourcing.name}
                    onChange={(v) => setSourcing((s) => ({ ...s, name: v }))}
                    placeholder="Product name * (e.g. Butter 25 kg)"
                />
                <Input
                    value={sourcing.link}
                    onChange={(v) => setSourcing((s) => ({ ...s, link: v }))}
                    placeholder="Reference link (optional)"
                />
                <textarea
                    rows={3}
                    value={sourcing.note}
                    onChange={(e) => setSourcing((s) => ({ ...s, note: e.target.value }))}
                    placeholder="Desired packaging, brand or weekly volume (optional)..."
                    className="w-full resize-y rounded-xl border border-[#D3DBD5] bg-white p-3 text-xs text-[#172C26] outline-none focus:border-[#1B654B]"
                />
            </div>
            <button
                type="button"
                onClick={() => {
                    if (!sourcing.name.trim()) {
                        say('Enter a product name first.');
                        return;
                    }
                    try {
                        localStorage.setItem(`${storageKey}:sourcing`, JSON.stringify(sourcing));
                        setRequestSaved(true);
                        say('Sourcing request saved as a local draft; not sent to Logistics.');
                    } catch {
                        say('Could not save sourcing draft.');
                    }
                }}
                className="mt-3 w-full rounded-xl bg-[#153F30] py-3 text-xs font-bold text-white hover:bg-[#256447]"
            >
                Save Sourcing Request Draft
            </button>
            {requestSaved && (
                <p className="mb-0 mt-2 text-xs font-medium text-[#26754D]">
                    Draft saved in this browser.
                </p>
            )}
        </Panel>
    );
}
