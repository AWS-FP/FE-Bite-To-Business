import {
    History,
    LayoutDashboard,
    LogOut,
    ReceiptText,
    Settings,
    ShoppingCart,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NotificationSystem from '../../customer/NotificationSystem';
import { formatCurrencyVnd } from '../../../constants/customer/homeData';
import { getWorkspaceHome, ROUTES } from '../../../router/routes';
import { useAuthStore } from '../../../store/admin/authStore';
import { useCartStore } from '../../../store/customer/cartStore';
import GuestHeaderActions from './GuestHeaderActions';

export default function StoreAccountActions() {
    const { t } = useTranslation('storefront');
    const session = useAuthStore((state) => state.session);
    const clearSession = useAuthStore((state) => state.clearSession);
    const user = session?.user;
    const workspacePath = user ? getWorkspaceHome(user.role) : null;

    const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(
        null,
    );

    const dropdownRef = useRef<HTMLDivElement>(null);
    const cartItems = useCartStore((state) => state.items);

    const isLoggedIn = Boolean(user);

    const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalAmount = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    let displayName = '';
    let subLabel = '';
    let accountLabel = t('header.login');
    let initials = '';

    if (user) {
        displayName = `${user.lastName} ${user.firstName}`.trim() || user.email;
        subLabel = user.email;
        accountLabel = t('header.account', { name: displayName });
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
        if (user) {
            clearSession();
        }
    }

    return (
        <div ref={dropdownRef} className="relative flex shrink-0 items-center gap-2.5">
            <Link
                className="hidden min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3.5 text-[12px] font-bold text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-store-yellow min-[1280px]:flex"
                to={ROUTES.CATALOG}
            >
                {t('header.quickOrder')}
            </Link>

            {!isLoggedIn && <GuestHeaderActions t={t} />}

            {isLoggedIn && (
                <>
                    <Link
                        to={ROUTES.QUOTES}
                        onClick={() => setOpenDropdown(null)}
                        aria-label={t('header.quote')}
                        className="relative flex min-h-[42px] cursor-pointer items-center justify-center gap-2.5 rounded-full border-2 border-solid border-store-ink bg-store-cream px-3.5 py-1 text-left text-store-ink no-underline shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-white"
                    >
                        <div className="flex items-center pr-2 border-0 border-r border-solid border-store-ink/25">
                            <ShoppingCart size={18} className="text-store-ink" />
                        </div>
                        <div className="leading-tight">
                            <span className="block text-[10px] font-medium text-store-muted">
                                {t('header.estimatedOrder')}
                            </span>
                            <span className="block text-xs font-black text-store-ink">
                                {formatCurrencyVnd(subtotalAmount)}
                            </span>
                        </div>
                        {totalItemsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-solid border-store-green bg-danger px-1 text-[10px] leading-none font-black text-white">
                                {totalItemsCount > 9 ? '9+' : totalItemsCount}
                            </span>
                        )}
                    </Link>

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
                        className="flex size-[42px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-solid border-store-ink bg-gradient-to-br from-surface-blue to-info p-0 text-[13px] font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)] hover:brightness-105"
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
                <div className="absolute top-[54px] right-0 z-50 w-[380px] rounded-[22px] border border-solid border-store-line bg-white p-5 text-store-ink shadow-[0_20px_50px_color-mix(in_srgb,_var(--color-black)_35%,_transparent)]">
                    <div className="pb-3 border-0 border-b border-solid border-store-line">
                        <h3 className="font-subheading m-0 text-sm font-bold text-store-ink">
                            Recently Added Items ({totalItemsCount})
                        </h3>
                    </div>

                    <div className="max-h-[320px] divide-y divide-gray-100 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3.5 py-3.5">
                                <Link
                                    to={`/products/${item.id}`}
                                    onClick={() => setOpenDropdown(null)}
                                    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-blue text-[10px] font-bold text-info no-underline"
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
                                        className="m-0 block text-xs font-extrabold leading-snug text-store-ink no-underline hover:text-store-ink"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="m-0 mt-0.5 text-[11px] text-store-muted">
                                        {item.spec}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-store-ink">
                                            {formatCurrencyVnd(item.unitPrice)}
                                        </span>

                                        <div className="flex h-7 items-center rounded-md border border-solid border-store-line bg-white px-1.5">
                                            <button
                                                type="button"
                                                onClick={() => updateCartQuantity(item.id, -1)}
                                                className="flex h-5 w-5 cursor-pointer items-center justify-center border-0 bg-transparent text-store-muted hover:text-black"
                                            >
                                                <Minus size={11} />
                                            </button>
                                            <span className="min-w-[22px] text-center text-[11px] font-bold text-store-ink">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateCartQuantity(item.id, 1)}
                                                className="flex h-5 w-5 cursor-pointer items-center justify-center border-0 bg-transparent text-store-muted hover:text-black"
                                            >
                                                <Plus size={11} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 pt-3.5 border-0 border-t border-solid border-store-line">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-store-muted">
                                Estimated Subtotal:
                            </span>
                            <span className="text-base font-black text-store-ink">
                                {formatCurrencyVnd(subtotalAmount)}
                            </span>
                        </div>

                        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                            <Link
                                to={ROUTES.QUOTES}
                                onClick={() => setOpenDropdown(null)}
                                className="flex h-10 items-center justify-center rounded-lg border border-solid border-store-line bg-white text-xs font-bold text-store-ink no-underline transition-colors hover:bg-surface-soft"
                            >
                                View Cart
                            </Link>
                            <Link
                                to={ROUTES.QUOTES}
                                onClick={() => setOpenDropdown(null)}
                                className="flex h-10 items-center justify-center rounded-lg border-0 bg-store-green text-xs font-bold text-white no-underline transition-colors hover:bg-store-green"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP 2: PROFILE DROPDOWN */}
            {isLoggedIn && openDropdown === 'profile' && (
                <div className="absolute top-[54px] right-0 z-50 w-[265px] overflow-hidden rounded-[22px] border border-solid border-store-ink/15 bg-store-cream text-store-ink shadow-[0_20px_50px_color-mix(in_srgb,_var(--color-black)_35%,_transparent)]">
                    <div className="flex items-center gap-3.5 p-4 border-0 border-b border-solid border-store-ink/10">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-solid border-store-ink bg-gradient-to-br from-surface-blue to-info text-sm font-black text-store-ink">
                            {user?.avatarUrl ? (
                                <img
                                    className="block size-full object-cover"
                                    src={user.avatarUrl}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-subheading m-0 truncate text-sm font-bold text-store-ink">
                                {displayName}
                            </h4>
                            <p className="m-0 truncate text-[11px] text-store-muted">{subLabel}</p>
                            <span className="mt-1.5 inline-block rounded-md bg-surface-blue px-2 py-0.5 text-[10px] font-extrabold uppercase text-role-delivery">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    <div className="py-1.5 border-0 border-b border-solid border-store-ink/10">
                        {workspacePath && (
                            <Link
                                to={workspacePath}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                            >
                                <LayoutDashboard size={15} className="text-store-ink" />
                                <span>{t('profileDropdown.workspace')}</span>
                            </Link>
                        )}
                        {user?.role === 'CUSTOMER' && <>
                        <Link
                            to={ROUTES.QUOTES}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                        >
                            <History size={15} className="text-store-ink" />
                            <span>{t('profileDropdown.orderHistory')}</span>
                        </Link>
                        <Link
                            to={ROUTES.QUOTES}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                        >
                            <ReceiptText size={15} className="text-store-ink" />
                            <span>{t('profileDropdown.recurringLists')}</span>
                        </Link>
                        <Link
                            to={ROUTES.QUOTES}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                        >
                            <Users size={15} className="text-store-ink" />
                            <span>{t('profileDropdown.customQuotes')}</span>
                        </Link>
                        </>}
                    </div>

                    <div className="py-1.5">
                        <Link
                            to={workspacePath || ROUTES.PROFILE}
                            state={workspacePath ? { openAccountSettings: true } : undefined}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                        >
                            <Settings size={15} className="text-store-ink" />
                            <span>{t('profileDropdown.accountSettings')}</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-4 py-2 text-left text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
                        >
                            <LogOut size={15} className="text-danger" />
                            <span>{t('profileDropdown.signOut')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
