import {
    History,
    LogOut,
    Minus,
    Plus,
    ReceiptText,
    Settings,
    ShoppingCart,
    UserCircle2,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NotificationSystem from '../../customer/NotificationSystem';
import { formatCurrencyVnd } from '../../../constants/customer/homeData';
import type { ProfileBadgeType } from '../../../constants/customer/homeData';
import { getRoleHome, ROUTES } from '../../../router/routes';
import { useAuthStore } from '../../../store/admin/authStore';
import { useCartStore } from '../../../store/customer/cartStore';
import GuestHeaderActions from './GuestHeaderActions';

const ROLE_SEQUENCE: ProfileBadgeType[] = [
    'ADMIN',
    'MAINTENANCE',
    'CUSTOMER',
    'DELIVERY',
    'PENDING PROFILE',
];

const ROLE_BADGE_STYLES: Record<ProfileBadgeType, { bg: string; text: string; border?: string }> = {
    ADMIN: { bg: 'bg-[#FACC15]', text: 'text-[#14132b]' },
    MAINTENANCE: { bg: 'bg-[#133425]', text: 'text-[#FACC15]' },
    CUSTOMER: { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]' },
    DELIVERY: { bg: 'bg-[#7C2D12]', text: 'text-white' },
    'PENDING PROFILE': {
        bg: 'bg-white',
        text: 'text-[#64748B]',
        border: 'border border-solid border-[#CBD5E1]',
    },
};

export default function StoreAccountActions() {
    const { t } = useTranslation('storefront');
    const session = useAuthStore((state) => state.session);
    const clearSession = useAuthStore((state) => state.clearSession);
    const user = session?.user;

    // UI-only preview in development; never creates an authenticated session.
    const [demoLoggedIn, setDemoLoggedIn] = useState(() => {
        if (!import.meta.env.DEV) return false;
        try {
            return sessionStorage.getItem('btb:preview-member-header') === '1';
        } catch {
            return false;
        }
    });
    useEffect(() => {
        if (!import.meta.env.DEV) return;
        try {
            sessionStorage.setItem('btb:preview-member-header', demoLoggedIn ? '1' : '0');
        } catch {
            /* storage may be blocked */
        }
    }, [demoLoggedIn]);
    // Dùng chung 1 state duy nhất cho cả 3 dropdown để không bao giờ bị đè lên nhau
    const [openDropdown, setOpenDropdown] = useState<'cart' | 'notifications' | 'profile' | null>(
        null,
    );
    const [roleIndex, setRoleIndex] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const cartItems = useCartStore((state) => state.items);
    const updateCartQuantity = useCartStore((state) => state.updateQuantity);

    const isLoggedIn = Boolean(user) || demoLoggedIn;
    const currentRole = ROLE_SEQUENCE[roleIndex];
    const currentBadgeStyle = ROLE_BADGE_STYLES[currentRole];

    const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalAmount = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    let accountPath: string = ROUTES.LOGIN;
    let displayName = 'Vivian Banshee';
    let subLabel = 'bakery of new Eridu';
    let accountLabel = t('header.login');
    let initials = 'VB';

    if (user) {
        displayName = `${user.lastName} ${user.firstName}`.trim() || user.email;
        subLabel = user.email;
        accountLabel = t('header.account', { name: displayName });
        accountPath = getRoleHome(user.role);
        if (user.role === 'CUSTOMER') accountPath = ROUTES.PROFILE;
        initials = `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`.toUpperCase();
        if (!initials) initials = user.email.charAt(0).toUpperCase();
    }

    useEffect(() => {
        function handleOutsideClick(event: globalThis.MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    function handleSignOut() {
        setOpenDropdown(null);
        setDemoLoggedIn(false);
        if (user && clearSession) {
            clearSession();
        }
    }

    return (
        <div
            ref={dropdownRef}
            className="relative flex shrink-0 items-center gap-2.5 max-[960px]:ml-auto max-[640px]:gap-1.5"
        >
            <Link
                className="hidden min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3.5 text-[12px] font-bold text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-[#ffe96d] min-[1280px]:flex"
                to={isLoggedIn ? accountPath : ROUTES.REGISTER}
            >
                {t('header.wholesale')}
            </Link>

            {!isLoggedIn && <GuestHeaderActions t={t} setDemoLoggedIn={setDemoLoggedIn} />}

            {isLoggedIn && (
                <>
                    {/* 1. Cart Button */}
                    <button
                        type="button"
                        onClick={() => setOpenDropdown((prev) => (prev === 'cart' ? null : 'cart'))}
                        aria-label={t('header.quote')}
                        className="flex min-h-[42px] cursor-pointer items-center justify-center gap-2.5 rounded-full border-2 border-solid border-store-ink bg-store-cream px-3.5 py-1 text-left text-store-ink shadow-[2px_2px_0_#14132b] hover:bg-white"
                    >
                        <div className="relative flex items-center pr-2 border-0 border-r border-solid border-store-ink/25">
                            <ShoppingCart size={18} className="text-store-ink" />
                            <span className="absolute -top-2 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full border border-solid border-store-ink bg-[#EF4444] px-1 text-[10px] font-extrabold text-white">
                                {totalItemsCount}
                            </span>
                        </div>
                        <div className="leading-tight max-[640px]:hidden">
                            <span className="block text-[10px] font-medium text-gray-600">
                                Estimated Order
                            </span>
                            <span className="block text-xs font-black text-store-ink">
                                {formatCurrencyVnd(subtotalAmount)}
                            </span>
                        </div>
                    </button>

                    {/* 2. Notification Bell (Chia sẻ chung state openDropdown) */}
                    <NotificationSystem
                        isOpen={openDropdown === 'notifications'}
                        onToggle={() =>
                            setOpenDropdown((prev) =>
                                prev === 'notifications' ? null : 'notifications',
                            )
                        }
                        onClose={() => setOpenDropdown(null)}
                    />

                    {/* 3. User Avatar Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setOpenDropdown((prev) => (prev === 'profile' ? null : 'profile'))
                        }
                        aria-label={accountLabel}
                        title={accountLabel}
                        className="flex size-[42px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-solid border-store-ink bg-gradient-to-br from-[#C4B5FD] to-[#818CF8] p-0 text-[13px] font-extrabold text-store-ink shadow-[2px_2px_0_#14132b] hover:brightness-105"
                    >
                        {user?.avatarUrl && (
                            <img
                                className="block size-full object-cover"
                                src={user.avatarUrl}
                                alt=""
                                referrerPolicy="no-referrer"
                            />
                        )}
                        {!user?.avatarUrl && <span>{initials}</span>}
                    </button>
                </>
            )}

            {/* POPUP 1: CART DROPDOWN */}
            {isLoggedIn && openDropdown === 'cart' && (
                <div className="absolute top-[54px] right-0 z-50 w-[350px] sm:w-[380px] rounded-[22px] border border-solid border-gray-200 bg-white p-5 text-[#14132b] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                    <div className="pb-3 border-0 border-b border-solid border-gray-100">
                        <h3 className="m-0 text-sm font-extrabold text-[#14132b]">
                            Recently Added Items ({totalItemsCount})
                        </h3>
                    </div>

                    <div className="max-h-[320px] divide-y divide-gray-100 overflow-y-auto">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3.5 py-3.5">
                                <Link
                                    to={`/products/${item.id}`}
                                    onClick={() => setOpenDropdown(null)}
                                    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EEF2FF] text-[10px] font-bold text-[#4F46E5] no-underline"
                                >
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span>IMG</span>
                                    )}
                                </Link>

                                <div className="min-w-0 flex-1">
                                    <Link
                                        to={`/products/${item.id}`}
                                        onClick={() => setOpenDropdown(null)}
                                        className="m-0 block text-xs font-extrabold leading-snug text-[#14132b] no-underline hover:text-[#133425]"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="m-0 mt-0.5 text-[11px] text-gray-500">
                                        {item.spec}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-[#133425]">
                                            {formatCurrencyVnd(item.unitPrice)}
                                        </span>

                                        <div className="flex h-7 items-center rounded-md border border-solid border-gray-200 bg-white px-1.5">
                                            <button
                                                type="button"
                                                onClick={() => updateCartQuantity(item.id, -1)}
                                                className="flex h-5 w-5 cursor-pointer items-center justify-center border-0 bg-transparent text-gray-600 hover:text-black"
                                            >
                                                <Minus size={11} />
                                            </button>
                                            <span className="min-w-[22px] text-center text-[11px] font-bold text-[#14132b]">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateCartQuantity(item.id, 1)}
                                                className="flex h-5 w-5 cursor-pointer items-center justify-center border-0 bg-transparent text-gray-600 hover:text-black"
                                            >
                                                <Plus size={11} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 pt-3.5 border-0 border-t border-solid border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                                Estimated Subtotal:
                            </span>
                            <span className="text-base font-black text-[#14132b]">
                                {formatCurrencyVnd(subtotalAmount)}
                            </span>
                        </div>

                        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                            <Link
                                to={ROUTES.QUOTES}
                                onClick={() => setOpenDropdown(null)}
                                className="flex h-10 items-center justify-center rounded-lg border border-solid border-gray-300 bg-white text-xs font-bold text-[#14132b] no-underline transition-colors hover:bg-gray-50"
                            >
                                View Cart
                            </Link>
                            <Link
                                to={ROUTES.QUOTES}
                                onClick={() => setOpenDropdown(null)}
                                className="flex h-10 items-center justify-center rounded-lg border-0 bg-[#133425] text-xs font-bold text-white no-underline transition-colors hover:bg-[#1a4733]"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP 2: PROFILE DROPDOWN */}
            {isLoggedIn && openDropdown === 'profile' && (
                <div className="absolute top-[54px] right-0 z-50 w-[265px] overflow-hidden rounded-[22px] border border-solid border-[#14132b]/15 bg-[#FAF3E3] text-[#14132b] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center gap-3.5 p-4 border-0 border-b border-solid border-[#14132b]/10">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-solid border-[#14132b] bg-gradient-to-br from-[#C4B5FD] to-[#818CF8] text-sm font-black text-[#14132b]">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h4 className="m-0 truncate text-sm font-extrabold text-[#14132b]">
                                {displayName}
                            </h4>
                            <p className="m-0 truncate text-[11px] text-gray-500">{subLabel}</p>
                            <span
                                className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${currentBadgeStyle.bg} ${currentBadgeStyle.text} ${currentBadgeStyle.border ?? ''}`}
                            >
                                {currentRole}
                            </span>
                        </div>
                    </div>

                    <div className="py-1.5 border-0 border-b border-solid border-[#14132b]/10">
                        <Link
                            to={ROUTES.QUOTES}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#14132b] no-underline transition-colors hover:bg-[#14132b]/10"
                        >
                            <History size={15} className="text-[#14132b]" />
                            <span>Order History</span>
                        </Link>
                        <Link
                            to={ROUTES.QUOTES}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#14132b] no-underline transition-colors hover:bg-[#14132b]/10"
                        >
                            <ReceiptText size={15} className="text-[#14132b]" />
                            <span>Recurring Shopping Lists</span>
                        </Link>
                        <Link
                            to={ROUTES.QUOTES}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#14132b] no-underline transition-colors hover:bg-[#14132b]/10"
                        >
                            <Users size={15} className="text-[#14132b]" />
                            <span>Custom Quotes &amp; Discounts</span>
                        </Link>
                    </div>

                    <div className="py-1.5">
                        <Link
                            to={ROUTES.PROFILE}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#14132b] no-underline transition-colors hover:bg-[#14132b]/10"
                        >
                            <Settings size={15} className="text-[#14132b]" />
                            <span>Account Settings</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() =>
                                setRoleIndex((prev) => (prev + 1) % ROLE_SEQUENCE.length)
                            }
                            className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-4 py-2 text-left text-xs font-medium text-[#14132b] transition-colors hover:bg-[#14132b]/10"
                        >
                            <span className="flex items-center gap-3">
                                <UserCircle2 size={15} className="text-[#14132b]" />
                                <span>Switch Account</span>
                            </span>
                            <span className="text-[10px] font-bold text-gray-500">
                                ({currentRole})
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-4 py-2 text-left text-xs font-semibold text-[#EF4444] transition-colors hover:bg-[#EF4444]/10"
                        >
                            <LogOut size={15} className="text-[#EF4444]" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
