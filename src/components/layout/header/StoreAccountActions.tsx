import {
    History,
    Heart,
    LayoutDashboard,
    LogOut,
    ReceiptText,
    Settings,
    ShoppingCart,
    Minus,
    Plus,
    PackageOpen,
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
import LogoutConfirmation from '@/components/common/LogoutConfirmation';

export default function StoreAccountActions() {
    const { t, i18n } = useTranslation('storefront');

    const session = useAuthStore((state) => state.session);
    const clearSession = useAuthStore((state) => state.clearSession);

    const user = session?.user;
    const workspacePath = user ? getWorkspaceHome(user.role) : null;

    const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | 'cart' | null>(
        null,
    );
    const [confirmLogout, setConfirmLogout] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const cartItems = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const cartIsOpen = openDropdown === 'cart';
    const isVietnamese = i18n.language.startsWith('vi');

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

        accountLabel = t('header.account', {
            name: displayName,
        });

        initials = `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`.toUpperCase();

        if (!initials) {
            initials = user.email.charAt(0).toUpperCase();
        }
    }

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') setOpenDropdown(null);
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

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
        <div ref={dropdownRef} className="relative flex flex-1 items-center gap-2.5">
            {/* Guest Actions */}
            {!isLoggedIn && <GuestHeaderActions t={t} />}

            {isLoggedIn && (
                <>
                    {/* Cart button opens a preview; navigating starts from the preview actions. */}
                    <button
                        type="button"
                        onClick={() => setOpenDropdown((previous) => previous === 'cart' ? null : 'cart')}
                        aria-expanded={cartIsOpen}
                        aria-controls="customer-cart-preview"
                        aria-label={t('cartPreview.toggle')}
                        className="relative mx-auto flex min-h-[52px] shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-solid border-store-ink bg-store-cream px-5 py-1 text-left text-store-ink shadow-[2px_2px_0_var(--color-store-ink)] hover:bg-white"
                    >
                        <div className="flex items-center border-0 border-r border-solid border-store-ink/25 pr-2">
                            <span className="relative inline-flex">
                                <ShoppingCart size={23} className="text-store-ink" />
                                {totalItemsCount > 0 && (
                                    <span className="absolute -right-2 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-solid border-store-green bg-danger px-0.5 text-[9px] font-black leading-none text-white">
                                        {totalItemsCount > 9 ? '9+' : totalItemsCount}
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="leading-tight">
                            <span className="block text-[10px] font-medium text-store-muted">
                                {t('header.estimatedOrder')}
                            </span>
                            <span className="block text-xs font-black text-store-ink">
                                {formatCurrencyVnd(subtotalAmount)}
                            </span>
                        </div>
                    </button>

                    {/* Notification Bell */}
                    <NotificationSystem
                        isOpen={openDropdown === 'notifications'}
                        onToggle={() =>
                            setOpenDropdown((prev) =>
                                prev === 'notifications' ? null : 'notifications',
                            )
                        }
                        onClose={() => setOpenDropdown(null)}
                    />

                    {/* User Avatar Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setOpenDropdown((prev) => (prev === 'profile' ? null : 'profile'))
                        }
                        aria-label={accountLabel}
                        title={accountLabel}
                        className="flex size-[52px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-solid border-store-ink bg-gradient-to-br from-surface-blue to-info p-0 text-[13px] font-extrabold text-store-ink shadow-[2px_2px_0_var(--color-store-ink)] hover:brightness-105"
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

            {/* Preview of products currently in cart (not completed orders). */}
            {isLoggedIn && cartIsOpen && (
                <div id="customer-cart-preview" role="dialog" aria-label={t('cartPreview.title')}
                     className="absolute left-0 top-[62px] z-[70] w-[min(385px,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-store-ink/15 bg-white text-store-ink shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center justify-between border-b border-store-ink/10 px-5 py-4">
                        <h3 className="m-0 text-sm font-extrabold">
                            {t('cartPreview.title')} ({cartItems.length})
                        </h3>
                        <button type="button" onClick={() => setOpenDropdown(null)}
                                aria-label={t('cartPreview.close')}
                                className="cursor-pointer rounded-full border-0 bg-transparent px-2 py-1 text-store-ink hover:bg-store-cream">
                            ×
                        </button>
                    </div>
                    {cartItems.length > 0 ? (
                        <div className="max-h-[390px] overflow-y-auto overscroll-contain">
                            {cartItems.map((item) => {
                                const title = (isVietnamese ? item.nameVi : item.nameEn) || item.name;
                                const spec = (isVietnamese ? item.specVi : item.specEn) || item.spec;
                                return (
                                    <div key={item.id} className="flex gap-3 border-b border-store-ink/10 px-4 py-3">
                                        <div className="flex size-[70px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-store-cream">
                                            {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy"
                                                                  className="size-full object-contain" /> :
                                                <PackageOpen size={26} className="text-store-muted" aria-hidden="true" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="m-0 line-clamp-2 text-xs font-bold leading-snug">{title}</p>
                                            {spec && <p className="mb-1 mt-1 line-clamp-1 text-[11px] text-store-muted">{spec}</p>}
                                            <div className="mt-2 flex items-end justify-between gap-2">
                                                <strong className="text-xs text-store-green">{formatCurrencyVnd(item.unitPrice)}</strong>
                                                <div className="flex shrink-0 items-center rounded-lg border border-store-ink/15">
                                                    <button type="button" onClick={() => updateQuantity(item.id, -1)}
                                                            aria-label={`${t('cartPreview.decrease')} ${title}`}
                                                            className="flex size-7 cursor-pointer items-center justify-center border-0 bg-transparent hover:bg-store-cream">
                                                        <Minus size={12}/>
                                                    </button>
                                                    <span className="min-w-6 text-center text-[11px] font-bold tabular-nums">{item.quantity}</span>
                                                    <button type="button" onClick={() => updateQuantity(item.id, 1)}
                                                            aria-label={`${t('cartPreview.increase')} ${title}`}
                                                            className="flex size-7 cursor-pointer items-center justify-center border-0 bg-transparent hover:bg-store-cream">
                                                        <Plus size={12}/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : <div className="flex flex-col items-center gap-2 px-5 py-9 text-center text-store-muted">
                        <PackageOpen size={28}/><p className="m-0 text-xs">{t('cartPreview.empty')}</p>
                    </div>}
                    <div className="bg-store-cream/70 px-4 py-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-store-muted">{t('cartPreview.total')}</span>
                            <strong className="text-base font-black tabular-nums">{formatCurrencyVnd(subtotalAmount)}</strong>
                        </div>
                        <p className="mb-3 text-[10px] leading-relaxed text-store-muted">{t('cartPreview.totalNote')}</p>
                        <div>
                            {cartItems.length > 0 ? (
                                <Link to={ROUTES.QUOTES} onClick={() => setOpenDropdown(null)}
                                      className="block w-full rounded-lg bg-store-green px-3 py-3 text-center text-xs font-bold text-white no-underline hover:opacity-90">
                                    {t('cartPreview.checkout')}
                                </Link>
                            ) : (
                                <span aria-disabled="true" className="block w-full rounded-lg bg-store-green/50 px-3 py-3 text-center text-xs font-bold text-white">
                                    {t('cartPreview.checkout')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Dropdown */}
            {isLoggedIn && openDropdown === 'profile' && (
                <div className="absolute right-0 top-[60px] z-50 w-[265px] overflow-hidden rounded-[22px] border border-solid border-store-ink/15 bg-store-cream text-store-ink shadow-[0_20px_50px_color-mix(in_srgb,_var(--color-black)_35%,_transparent)]">
                    {/* User Information */}
                    <div className="flex items-center gap-3.5 border-0 border-b border-solid border-store-ink/10 p-4">
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
                            <h4 className="m-0 truncate font-subheading text-sm font-bold text-store-ink">
                                {displayName}
                            </h4>

                            <p className="m-0 truncate text-[11px] text-store-muted">{subLabel}</p>

                            <span className="mt-1.5 inline-block rounded-md bg-surface-blue px-2 py-0.5 text-[10px] font-extrabold uppercase text-role-delivery">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Account Navigation */}
                    <div className="border-0 border-b border-solid border-store-ink/10 py-1.5">
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

                        {user?.role === 'CUSTOMER' && (
                            <>
                                {/* Order History */}
                                <Link
                                    to={ROUTES.ORDERS}
                                    onClick={() => setOpenDropdown(null)}
                                    className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                                >
                                    <History size={15} className="text-store-ink" />

                                    <span>{t('profileDropdown.orderHistory')}</span>
                                </Link>

                                {/* My Favorites */}
                                <Link
                                    to={ROUTES.FAVORITES}
                                    onClick={() => setOpenDropdown(null)}
                                    className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                                >
                                    <Heart size={15} className="text-store-ink" />

                                    <span>{t('profileDropdown.favorites')}</span>
                                </Link>

                                {/* Recurring Lists */}
                                <Link
                                    to={ROUTES.QUOTES}
                                    onClick={() => setOpenDropdown(null)}
                                    className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-store-ink no-underline transition-colors hover:bg-store-ink/10"
                                >
                                    <ReceiptText size={15} className="text-store-ink" />

                                    <span>{t('profileDropdown.recurringLists')}</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Settings and Sign Out */}
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
                            onClick={() => { setOpenDropdown(null); setConfirmLogout(true); }}
                            className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-4 py-2 text-left text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
                        >
                            <LogOut size={15} className="text-danger" />

                            <span>{t('profileDropdown.signOut')}</span>
                        </button>
                    </div>
                </div>
            )}
            <LogoutConfirmation open={confirmLogout} onCancel={() => setConfirmLogout(false)} onConfirm={() => { setConfirmLogout(false); handleSignOut(); }} />
        </div>
    );
}
