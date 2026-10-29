import { useProfileContext } from './ProfileModel.tsx';
import { Camera, ChevronRight, ShieldCheck } from 'lucide-react';
import { Pill, Avatar } from './ProfileUI.tsx';

export default function ProfileSidebar() {
    const { user, profile, setAvatarStep, scrollTo, navigation } = useProfileContext();
    return (
        <aside className="space-y-5 lg:sticky lg:top-5">
            <div className="rounded-[22px] bg-[#F9F7F1] p-5 shadow-sm">
                <div className="flex gap-3">
                    <div className="relative">
                        <Avatar src={profile.avatar} name={profile.representative} size="large" />
                        <button
                            type="button"
                            aria-label="Change avatar"
                            onClick={() => setAvatarStep('choose')}
                            className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFE14D] text-[#183828] shadow-md transition hover:scale-105"
                        >
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="min-w-0 flex-1">
                        <Pill>ACCOUNT</Pill>
                        <h2 className="m-0 mt-2 break-words font-serif text-[18px] font-bold">
                            {profile.representative || 'Your name'}
                        </h2>
                        <p className="mt-1 break-words text-[11px] text-[#63746A]">
                            {profile.company || 'Your organization'}
                        </p>
                    </div>
                </div>
                <div className="mt-5 border-t border-[#E4E5DF] pt-4">
                    <p className="m-0 text-[10px] font-bold uppercase tracking-wide text-[#67786C]">
                        Customer account type
                    </p>
                    <div className="mt-2 rounded-xl bg-[#E2F0E9] py-2 text-center text-sm font-bold text-[#174334]">
                        Business / Co-op
                    </div>
                    <p className="mt-3 text-[11px] leading-[1.6] text-[#819087]">
                        Personalize bulk vs. kitchen pack recommendations without changing published
                        volume pricing.
                    </p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#E4E5DF] pt-4">
                    {[
                        ['Open Quotes', '—'],
                        ['Completed Orders', '—'],
                        ['Payment Terms', '—'],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-white px-1 py-3 text-center">
                            <div className="text-[10px] text-[#75827B]">{label}</div>
                            <div className="mt-1 font-bold text-[#154431]">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="overflow-hidden rounded-[20px] bg-white shadow-sm">
                <div className="bg-[#123B2E] px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white">
                    Customer Workspace Menu
                </div>
                {navigation.map(({ id, label, icon: Icon, hint }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => scrollTo(id)}
                        className="flex w-full items-center gap-2 border-0 border-b border-[#EBEEEA] bg-white px-4 py-4 text-left text-[11px] font-bold text-[#213D30] transition-colors hover:bg-[#E4F1E9]"
                    >
                        <Icon size={15} />
                        <span className="flex-1">{label}</span>
                        {hint && (
                            <span className="rounded-full bg-[#F1F3F4] px-2 py-1 text-[10px]">
                                {hint}
                            </span>
                        )}
                        <ChevronRight size={15} />
                    </button>
                ))}
            </div>
            <div className="rounded-[18px] bg-[#E6F4EC] p-4 text-[#214535]">
                <div className="flex items-center gap-2 text-xs font-extrabold">
                    <ShieldCheck size={16} /> Account Security
                </div>
                <p className="m-0 mt-2 text-[11px] leading-5">
                    {user?.emailVerified
                        ? 'Email verified on your authenticated session.'
                        : 'Email verification is not confirmed for this session.'}{' '}
                    Profile edits are stored locally until a profile API is integrated.
                </p>
            </div>
        </aside>
    );
}
