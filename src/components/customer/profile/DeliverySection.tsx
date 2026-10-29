import { useProfileContext } from './ProfileModel.tsx';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Panel, PanelTitle, Pill } from './ProfileUI.tsx';
import { makeAddress } from './ProfileModel.tsx';
import { copy } from './ProfileModel.tsx';

export default function DeliverySection() {
    const { profile, setEditAddress, setProfile } = useProfileContext();
    return (
        <Panel id="deliveries">
            <PanelTitle
                n="3"
                title="Delivery Destinations & Cold-Chain Drop Points"
                subtitle="Manage branches and receiving contacts for your kitchens."
            />
            <button
                type="button"
                onClick={() => setEditAddress(makeAddress())}
                className="mb-5 inline-flex items-center gap-1.5 rounded-xl bg-[#153F30] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#256447]"
            >
                <Plus size={14} /> Add Branch Destination
            </button>
            {profile.addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#B8C9BA] bg-white/70 p-8 text-center text-sm text-[#718076]">
                    No delivery destinations yet. Add your first kitchen or branch.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {profile.addresses.map((a) => (
                        <article
                            key={a.id}
                            className={`rounded-2xl border p-4 ${a.primary ? 'border-[#5E987C] bg-[#EBF5EF]' : 'border-[#E0E2DE] bg-white'}`}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                {a.primary ? (
                                    <Pill>PRIMARY KITCHEN</Pill>
                                ) : (
                                    <Pill tone="yellow">BRANCH</Pill>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        title="Edit"
                                        onClick={() => setEditAddress(copy(a))}
                                        className="rounded-lg p-1.5 hover:bg-black/5"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        title="Remove"
                                        onClick={() =>
                                            setProfile((p) => ({
                                                ...p,
                                                addresses: p.addresses
                                                    .filter((x) => x.id !== a.id)
                                                    .map((x, i, arr) => ({
                                                        ...x,
                                                        primary: arr.some((z) => z.primary)
                                                            ? x.primary
                                                            : i === 0,
                                                    })),
                                            }))
                                        }
                                        className="rounded-lg p-1.5 text-[#B64B42] hover:bg-red-50"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="mt-3 font-serif text-base font-bold">{a.name}</h3>
                            <p className="mt-2 text-xs leading-5 text-[#65746B]">{a.address}</p>
                            <p className="mt-2 text-[11px] text-[#718076]">
                                Receiver: <strong>{a.receiver}</strong> · {a.phone}
                            </p>
                            <div className="mt-3 border-t border-[#D7E4DC] pt-3 text-[11px] text-[#6E7F73]">
                                ETA available after logistics integration
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </Panel>
    );
}
