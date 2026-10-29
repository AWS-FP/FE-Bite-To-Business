import { createContext, useContext, useRef, useState } from 'react';
import type { ReactNode, ChangeEvent } from 'react';
import { FilePlus2, LayoutTemplate, MapPin, UserRound } from 'lucide-react';
import { useAuthStore } from '../../../store/admin/authStore';

export type Payment = 'MOMO' | 'VISA' | 'OTHER';
export const PAYMENT_IMAGES: Record<Payment, string> = {
    MOMO: '/images/bank/momo.png',
    VISA: '/images/bank/VISA.png',
    OTHER: '',
};
export type SectionId = 'representative' | 'billing' | 'deliveries' | 'sourcing' | 'security';
export type Address = {
    id: string;
    name: string;
    address: string;
    receiver: string;
    phone: string;
    primary: boolean;
};
export type Profile = {
    representative: string;
    company: string;
    phone: string;
    deliveryWindow: string;
    taxId: string;
    invoiceEmail: string;
    legalName: string;
    billingAddress: string;
    sameBilling: boolean;
    payment: Payment;
    avatar: string;
    recentAvatars: string[];
    addresses: Address[];
};

export type Sourcing = { name: string; link: string; note: string };
export const windows = [
    'Early Morning Batch (05:00 AM – 07:30 AM)',
    'Morning (08:00 AM – 11:00 AM)',
    'Afternoon (01:00 PM – 05:00 PM)',
    'Flexible / Contact before delivery',
];
export const initialSourcing: Sourcing = { name: '', link: '', note: '' };
export const makeAddress = (): Address => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    address: '',
    receiver: '',
    phone: '',
    primary: false,
});
export const copy = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function useProfileState() {
    const user = useAuthStore((s) => s.session?.user);
    const storageKey = `btb:customer-profile:${user?.id ?? 'guest'}`;
    const defaultProfile = (): Profile => ({
        representative: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
        company: '',
        phone: user?.phone ?? '',
        deliveryWindow: windows[0],
        taxId: '',
        invoiceEmail: user?.email ?? '',
        legalName: '',
        billingAddress: '',
        sameBilling: true,
        payment: 'MOMO',
        avatar: user?.avatarUrl ?? '',
        recentAvatars: [],
        addresses: [],
    });
    const [profile, setProfile] = useState<Profile>(() => {
        const fallback = defaultProfile();
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? { ...fallback, ...(JSON.parse(saved) as Profile) } : fallback;
        } catch {
            return fallback;
        }
    });
    const [savedProfile, setSavedProfile] = useState<Profile>(() => copy(profile));
    const [flash, setFlash] = useState('');
    const [avatarStep, setAvatarStep] = useState<'choose' | 'crop' | null>(null);
    const [cropImage, setCropImage] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const [editAddress, setEditAddress] = useState<Address | null>(null);
    const [sourcing, setSourcing] = useState<Sourcing>(initialSourcing);
    const [requestSaved, setRequestSaved] = useState(false);
    const setField = <K extends keyof Profile>(key: K, value: Profile[K]) =>
        setProfile((p) => ({ ...p, [key]: value }));
    const say = (text: string) => {
        setFlash(text);
        window.setTimeout(() => setFlash(''), 4000);
    };

    function save() {
        if (!profile.representative.trim() || !profile.phone.trim() || !profile.company.trim()) {
            say('Please fill in representative name, organization and phone number.');
            return;
        }
        if (profile.taxId && !/^\d{10}(\d{3})?$/.test(profile.taxId)) {
            say('Tax ID must contain 10 or 13 digits.');
            return;
        }
        try {
            localStorage.setItem(storageKey, JSON.stringify(profile));
            setSavedProfile(copy(profile));
            say('Profile saved locally in this browser. Backend sync is not connected yet.');
        } catch {
            say('Could not save. The image may be too large for browser storage.');
        }
    }
    function onUpload(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (
            !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
            file.size > 3 * 1024 * 1024
        ) {
            say('Use JPG, PNG or WEBP image smaller than 3 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setCropImage(String(reader.result));
            setAvatarStep('crop');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }
    function applyAvatar(avatar: string) {
        setProfile((previous) => ({
            ...previous,
            avatar,
            recentAvatars: [avatar, ...previous.recentAvatars.filter((v) => v !== avatar)].slice(
                0,
                6,
            ),
        }));
        setAvatarStep(null);
        say('Avatar updated in preview. Select Save Profile to keep it.');
    }
    function upsertAddress() {
        if (
            !editAddress?.name.trim() ||
            !editAddress.address.trim() ||
            !editAddress.receiver.trim() ||
            !editAddress.phone.trim()
        ) {
            say('Fill in branch name, address, receiver and phone.');
            return;
        }
        setProfile((p) => {
            const exists = p.addresses.some((a) => a.id === editAddress.id);
            const addresses = exists
                ? p.addresses.map((a) => (a.id === editAddress.id ? editAddress : a))
                : [...p.addresses, editAddress];
            return {
                ...p,
                addresses: addresses.map((a, i) => ({
                    ...a,
                    primary: editAddress.primary
                        ? a.id === editAddress.id
                        : addresses.some((b) => b.primary)
                            ? a.primary
                            : i === 0,
                })),
            };
        });
        setEditAddress(null);
        say('Delivery address changed. Select Save Profile to keep it.');
    }
    function scrollTo(id: SectionId) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const navigation: { id: SectionId; label: string; icon: typeof UserRound; hint?: string }[] = [
        { id: 'representative', label: 'Representative & VAT Billing', icon: UserRound },
        {
            id: 'deliveries',
            label: 'Delivery Destinations & ETA Hub',
            icon: MapPin,
            hint: `${profile.addresses.length} Kitchens`,
        },
        { id: 'sourcing', label: 'Request New Product Sourcing', icon: FilePlus2 },
        { id: 'security', label: 'Adaptive UI (A2UI) & Security', icon: LayoutTemplate },
    ];

    return {
        user,
        storageKey,
        profile,
        savedProfile,
        flash,
        avatarStep,
        setAvatarStep,
        cropImage,
        setCropImage,
        fileRef,
        editAddress,
        setEditAddress,
        sourcing,
        setSourcing,
        requestSaved,
        setRequestSaved,
        setProfile,
        setField,
        say,
        save,
        onUpload,
        applyAvatar,
        upsertAddress,
        scrollTo,
        navigation,
        defaultProfile,
    };
}

type ProfileModel = ReturnType<typeof useProfileState>;
const ProfileContext = createContext<ProfileModel | null>(null);
export function ProfileProvider({ children }: { children: ReactNode }) {
    const value = useProfileState();
    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
export function useProfileContext() {
    const value = useContext(ProfileContext);
    if (!value) throw new Error('Profile components require ProfileProvider');
    return value;
}
