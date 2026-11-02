import { useProfileContext } from './ProfileModel.tsx';
import { ImagePlus, Upload } from 'lucide-react';
import { Label, Input, Modal } from './ProfileUI.tsx';
import AvatarCropper from './AvatarCropper.tsx';

export default function ProfileModals() {
    const {
        profile,
        flash,
        avatarStep,
        setAvatarStep,
        cropImage,
        setCropImage,
        fileRef,
        editAddress,
        setEditAddress,
        onUpload,
        applyAvatar,
        upsertAddress,
    } = useProfileContext();
    return (
        <>
            {flash && (
                <div
                    role="status"
                    className="fixed bottom-5 right-5 z-[110] max-w-[350px] rounded-2xl bg-[#102F23] px-5 py-3 text-xs font-semibold leading-5 text-white shadow-xl"
                >
                    {flash}
                </div>
            )}

            <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={onUpload}
            />
            {avatarStep === 'choose' && (
                <Modal title="Choose an avatar" onClose={() => setAvatarStep(null)}>
                    <div className="rounded-2xl border border-dashed border-[#B5D5BE]/40 bg-white/5 p-7 text-center">
                        <ImagePlus size={46} className="mx-auto text-[#FFE14D]" />
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="mx-auto mt-5 flex items-center gap-2 rounded-full bg-[#FFE14D] px-6 py-3 text-sm font-bold text-[#143827]"
                        >
                            <Upload size={17} /> Upload image
                        </button>
                        <p className="mb-0 mt-3 text-[11px] text-white/55">
                            JPG, PNG, WEBP · Maximum 3 MB
                        </p>
                    </div>
                    <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                        <h3 className="m-0 font-serif text-lg font-bold text-[#FFE14D]">
                            Recent avatars
                        </h3>
                        <p className="mt-1 text-[11px] text-white/55">
                            Choose one of your previously used pictures.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {profile.recentAvatars.length ? (
                                profile.recentAvatars.map((src, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            setCropImage(src);
                                            setAvatarStep('crop');
                                        }}
                                        className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-[#FFE14D]/70 hover:ring-[#FFE14D]"
                                    >
                                        <img
                                            src={src}
                                            alt={`Recent avatar ${i + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))
                            ) : (
                                <span className="text-xs text-white/60">
                                    Uploaded avatars will appear here.
                                </span>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
            {avatarStep === 'crop' && (
                <Modal title="Edit avatar" onClose={() => setAvatarStep(null)}>
                    <AvatarCropper
                        src={cropImage}
                        onApply={applyAvatar}
                        onBack={() => setAvatarStep('choose')}
                    />
                </Modal>
            )}
            {editAddress && (
                <Modal
                    title={
                        profile.addresses.some((a) => a.id === editAddress.id)
                            ? 'Edit branch'
                            : 'Add branch'
                    }
                    onClose={() => setEditAddress(null)}
                >
                    <div className="space-y-3 rounded-2xl bg-[#F9F7F1] p-5 text-[#1E342B]">
                        <div>
                            <Label>Branch / Kitchen name *</Label>
                            <Input
                                value={editAddress.name}
                                onChange={(v) => setEditAddress((a) => (a ? { ...a, name: v } : a))}
                                placeholder="e.g. Central Bakery – District 3"
                            />
                        </div>
                        <div>
                            <Label>Full receiving address *</Label>
                            <Input
                                value={editAddress.address}
                                onChange={(v) =>
                                    setEditAddress((a) => (a ? { ...a, address: v } : a))
                                }
                                placeholder="Street, ward, city"
                            />
                        </div>
                        <div>
                            <Label>Receiver *</Label>
                            <Input
                                value={editAddress.receiver}
                                onChange={(v) =>
                                    setEditAddress((a) => (a ? { ...a, receiver: v } : a))
                                }
                            />
                        </div>
                        <div>
                            <Label>Phone *</Label>
                            <Input
                                value={editAddress.phone}
                                onChange={(v) =>
                                    setEditAddress((a) => (a ? { ...a, phone: v } : a))
                                }
                                type="tel"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-xs font-bold">
                            <input
                                type="checkbox"
                                checked={editAddress.primary}
                                onChange={(e) =>
                                    setEditAddress((a) =>
                                        a ? { ...a, primary: e.target.checked } : a,
                                    )
                                }
                                className="accent-[#123B2E]"
                            />{' '}
                            Set as primary kitchen
                        </label>
                        <button
                            type="button"
                            onClick={upsertAddress}
                            className="w-full rounded-xl bg-[#123B2E] py-3 text-sm font-bold text-white"
                        >
                            Save Branch
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
