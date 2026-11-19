import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    Bell,
    Check,
    CheckCheck,
    Clock3,
    FileText,
    Inbox,
    Settings2,
    ShieldCheck,
    Sparkles,
    Trash2,
    Truck,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { INITIAL_NOTIFICATIONS } from '../../constants/customer/homeData';
import { useAuthStore } from '@/store/admin/authStore';
import {
    getCustomerNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from '@/services/customer/notificationService';
import type { CustomerNotification } from '@/services/customer/notificationService';
import type { NotificationItemData } from '../../constants/customer/homeData';

export interface NotificationSystemProps {
    isOpen?: boolean;
    onToggle?: () => void;
    onClose?: () => void;
}

type Filter = 'all' | NotificationItemData['category'];

function toNotificationItem(item: CustomerNotification, english: boolean): NotificationItemData {
    const category =
        item.notificationType === 'QUOTE'
            ? 'quote'
            : item.notificationType === 'DELIVERY' || item.notificationType === 'ORDER'
              ? 'delivery'
              : 'system';
    return {
        id: item.id,
        category,
        badge: item.notificationType,
        badgeBg: 'bg-surface-yellow',
        badgeText: 'text-store-ink',
        title: english ? item.titleEn : item.titleVi,
        description: english ? item.contentEn : item.contentVi,
        timeAgo: new Date(item.createdAt).toLocaleString(english ? 'en-US' : 'vi-VN'),
        unread: !item.isRead,
    };
}
type PreferenceKey = 'quoteApproval' | 'quoteExpiry' | 'deliveryEta' | 'sourcingReply';

type Preferences = Record<PreferenceKey, boolean>;

const DEFAULT_PREFS: Preferences = {
    quoteApproval: true,
    quoteExpiry: true,
    deliveryEta: true,
    sourcingReply: true,
};

const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'notifFilterAll' },
    { key: 'system', label: 'notifFilterUpdates' },
    { key: 'quote', label: 'notifFilterQuotes' },
    { key: 'delivery', label: 'notifFilterDelivery' },
];

function CategoryIcon({ category }: { category: NotificationItemData['category'] }) {
    const styles = {
        system: 'bg-warning-soft text-warning',
        quote: 'bg-surface-green text-store-ink',
        delivery: 'bg-surface-blue text-info',
    }[category];

    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles}`}
        >
            {category === 'system' ? <Sparkles size={19} /> : null}
            {category === 'quote' ? <FileText size={19} /> : null}
            {category === 'delivery' ? <Truck size={19} /> : null}
        </div>
    );
}

function PreferenceRow({
    title,
    description,
    checked,
    onToggle,
}: {
    title: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0 flex-1">
                <p className="m-0 text-[13px] font-bold leading-5 text-store-ink">{title}</p>
                <p className="m-0 mt-1 text-[11px] leading-[1.6] text-store-muted">{description}</p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={title}
                onClick={onToggle}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full !border-0 p-0 !shadow-none transition-colors duration-200 focus:!border-0 focus:!shadow-none focus:!outline-none focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-store-yellow ${
                    checked ? 'bg-store-green' : 'bg-surface-soft'
                }`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-1 top-1 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
}

export default function NotificationSystem({
    isOpen: controlledIsOpen,
    onToggle,
    onClose,
}: NotificationSystemProps) {
    const { t, i18n } = useTranslation('storefront');
    const ui = (key: string) => t(`customerUI.${key}`);
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const isCustomer = useAuthStore((state) => state.session?.user.role === 'CUSTOMER');
    const [localIsOpen, setLocalIsOpen] = useState(false);
    const isOpen = controlledIsOpen ?? localIsOpen;

    const [notifications, setNotifications] = useState<NotificationItemData[]>(
        isCustomer ? [] : INITIAL_NOTIFICATIONS,
    );
    const [loadError, setLoadError] = useState(false);

    const [filter, setFilter] = useState<Filter>('all');
    const [view, setView] = useState<'list' | 'settings'>('list');
    const [selected, setSelected] = useState<NotificationItemData | null>(null);
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFS);

    useEffect(() => {
        if (!isCustomer) return;
        let active = true;
        getCustomerNotifications(0, 20)
            .then((page) => {
                if (active) {
                    setNotifications(page.content.map((item) => toNotificationItem(item, english)));
                    setLoadError(false);
                }
            })
            .catch(() => {
                if (active) setLoadError(true);
            });
        return () => {
            active = false;
        };
    }, [isCustomer, isOpen, english]);

    const unreadCount = notifications.filter((item) => item.unread).length;

    const visibleNotifications = useMemo(
        () =>
            filter === 'all'
                ? notifications
                : notifications.filter((item) => item.category === filter),
        [notifications, filter],
    );

    useEffect(() => {
        if (!selected) return;

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelected(null);
        };

        window.addEventListener('keydown', onEscape);

        return () => window.removeEventListener('keydown', onEscape);
    }, [selected]);

    function toggleDropdown() {
        if (onToggle) onToggle();
        else setLocalIsOpen((value) => !value);

        setView('list');
    }

    function closeDropdown() {
        if (onClose) onClose();
        else setLocalIsOpen(false);
    }

    function markRead(id: string) {
        if (isCustomer) void markNotificationRead(id).catch(() => setLoadError(true));
        setNotifications((current) =>
            current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
        );
    }

    function openDetail(item: NotificationItemData) {
        markRead(item.id);
        closeDropdown();
        setSelected(item);
    }

    function setPreference(key: PreferenceKey) {
        setPreferences((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));
    }

    return (
        <>
            <div className="relative shrink-0">
                {/* NOTIFICATION BELL */}
                <button
                    type="button"
                    onClick={toggleDropdown}
                    aria-label="Notifications"
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    className={`relative flex size-[52px] cursor-pointer items-center justify-center rounded-full border-2 border-solid border-store-ink text-store-ink shadow-[2px_2px_0_var(--color-store-ink)] transition-colors ${
                        isOpen ? 'bg-store-yellow' : 'bg-store-cream hover:bg-store-yellow'
                    }`}
                >
                    <Bell size={19} />

                    {unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-solid border-store-green bg-danger px-1 text-[10px] font-black leading-none text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* DROPDOWN */}
                {isOpen && (
                    <div
                        role="dialog"
                        aria-label="Purchasing notifications"
                        className="absolute right-0 top-[60px] z-[80] flex w-[min(420px,calc(100vw-24px))] max-h-[min(78vh,640px)] flex-col overflow-hidden rounded-[24px] border border-solid border-store-line bg-surface-green text-store-ink shadow-[0_20px_60px_color-mix(in_srgb,_var(--color-store-dark)_28%,_transparent)]"
                    >
                        {/* HEADER - Một lớp bo góc duy nhất */}
                        <div className="shrink-0 bg-store-green px-5 pb-4 pt-4 text-white">
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <div className="min-w-0">
                                    {view === 'settings' && (
                                        <button
                                            type="button"
                                            onClick={() => setView('list')}
                                            className="mb-2 inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-semibold text-white/75 hover:text-white"
                                        >
                                            <ArrowLeft size={13} />
                                            {ui('notificationBack')}
                                        </button>
                                    )}

                                    <p className="m-0 text-[10px] font-extrabold uppercase tracking-[0.14em] text-store-yellow">
                                        BITE TO BUSINESS
                                    </p>

                                    <h3 className="m-0 mt-1 font-subheading text-[19px] font-bold leading-6">
                                        {view === 'list'
                                            ? ui('notificationTitle')
                                            : ui('notificationSettings')}
                                    </h3>

                                    <p className="m-0 mt-1 text-[11px] leading-4 text-store-muted-light">
                                        {view === 'list'
                                            ? ui('notificationDesc')
                                            : ui('notificationSettingsDesc')}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-1.5">
                                    {view === 'list' && unreadCount > 0 && (
                                        <span className="rounded-full bg-store-yellow px-2.5 py-1 text-[11px] font-black text-store-ink">
                                            {unreadCount} {ui('notifNew')}
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        aria-label={
                                            view === 'list'
                                                ? ui('notificationSettings')
                                                : ui('notificationBack')
                                        }
                                        onClick={() =>
                                            setView(view === 'list' ? 'settings' : 'list')
                                        }
                                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-solid border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                                    >
                                        {view === 'list' ? (
                                            <Settings2 size={17} />
                                        ) : (
                                            <ArrowLeft size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {view === 'list' ? (
                            <>
                                {/* FILTER BAR */}
                                <div className="shrink-0 border-0 border-b border-solid border-store-line bg-white px-4 pb-3 pt-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[11px] font-bold text-store-muted">
                                            {ui('notifInbox')}{' '}
                                            <span className="text-store-placeholder">
                                                · {notifications.length}
                                            </span>
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (isCustomer)
                                                    void markAllNotificationsRead().catch(() =>
                                                        setLoadError(true),
                                                    );
                                                setNotifications((list) =>
                                                    list.map((n) => ({ ...n, unread: false })),
                                                );
                                            }}
                                            disabled={unreadCount === 0}
                                            className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-bold text-store-ink hover:underline disabled:cursor-default disabled:opacity-40"
                                        >
                                            <CheckCheck size={14} />
                                            {ui('notifMarkAll')}
                                        </button>
                                    </div>

                                    <div className="mt-3 flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                        {FILTERS.map((tab) => (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                onClick={() => setFilter(tab.key)}
                                                aria-pressed={filter === tab.key}
                                                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-solid px-3 py-1.5 text-[11px] font-bold transition-colors ${
                                                    filter === tab.key
                                                        ? 'border-store-green bg-store-green text-white'
                                                        : 'border-store-line bg-surface-green text-store-muted hover:border-store-line'
                                                }`}
                                            >
                                                {ui(tab.label)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* NOTIFICATION LIST */}
                                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-contain bg-surface-green p-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                    {visibleNotifications.length === 0 ? (
                                        <div className="flex min-h-[185px] flex-col items-center justify-center px-4 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-green text-store-ink">
                                                <Inbox size={24} />
                                            </div>
                                            <p className="m-0 mt-3 text-sm font-bold">
                                                {ui('notifEmpty')}
                                            </p>
                                            <p className="m-0 mt-1 text-xs text-store-muted">
                                                {loadError
                                                    ? ui('notifLoadError')
                                                    : ui('notifNoMatches')}
                                            </p>
                                        </div>
                                    ) : (
                                        visibleNotifications.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => openDetail(item)}
                                                className={`group w-full cursor-pointer rounded-2xl border border-solid p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-store-line hover:shadow-sm ${
                                                    item.unread
                                                        ? 'border-store-line bg-white'
                                                        : 'border-store-line bg-surface-green opacity-85'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <CategoryIcon category={item.category} />

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
                                                            <span
                                                                className={`max-w-full break-words rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase leading-[1.5] ${item.badgeBg} ${item.badgeText}`}
                                                            >
                                                                {item.badge}
                                                            </span>

                                                            {item.unread && (
                                                                <span className="h-2 w-2 shrink-0 rounded-full bg-danger" />
                                                            )}
                                                        </div>

                                                        <h4 className="font-subheading m-0 mt-2 text-[12px] font-bold leading-[1.5] text-store-ink">
                                                            {item.title}
                                                        </h4>

                                                        <p className="m-0 mt-1 line-clamp-2 text-[11px] leading-[1.65] text-store-muted">
                                                            {item.description}
                                                        </p>

                                                        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-store-muted">
                                                                <Clock3 size={11} />
                                                                {item.timeAgo}
                                                            </span>

                                                            <span className="text-[10px] font-extrabold text-store-ink group-hover:underline">
                                                                {ui('notifDetails')} →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                {/* FOOTER */}
                                <div className="flex shrink-0 items-center justify-between gap-3 border-0 border-t border-solid border-store-line bg-white px-4 py-3">
                                    <span className="text-[10px] text-store-muted">
                                        {isCustomer ? ui('notifSystem') : ui('notifSystem')}
                                    </span>

                                    {!isCustomer && (
                                        <button
                                            type="button"
                                            onClick={() => setNotifications([])}
                                            disabled={notifications.length === 0}
                                            className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[11px] font-bold text-danger hover:text-danger disabled:opacity-40"
                                        >
                                            <Trash2 size={13} />
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* NOTIFICATION SETTINGS */}
                                <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-contain bg-surface-green p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                    <div className="rounded-2xl border border-solid border-store-line bg-white p-4">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-extrabold text-store-ink">
                                            <FileText size={16} />
                                            {ui('notificationQuotes')}
                                        </div>

                                        <div className="divide-y divide-[var(--color-surface-soft)]">
                                            <PreferenceRow
                                                title={ui('notificationApproval')}
                                                description={ui('notificationApprovalDesc')}
                                                checked={preferences.quoteApproval}
                                                onToggle={() => setPreference('quoteApproval')}
                                            />

                                            <PreferenceRow
                                                title={ui('notificationExpiry')}
                                                description={ui('notificationExpiryDesc')}
                                                checked={preferences.quoteExpiry}
                                                onToggle={() => setPreference('quoteExpiry')}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-2xl border border-solid border-store-line bg-white p-4">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-extrabold text-store-ink">
                                            <Truck size={16} />
                                            {ui('notificationLogistics')}
                                        </div>

                                        <div className="divide-y divide-[var(--color-surface-soft)]">
                                            <PreferenceRow
                                                title={ui('notificationDelivery')}
                                                description={ui('notificationDeliveryDesc')}
                                                checked={preferences.deliveryEta}
                                                onToggle={() => setPreference('deliveryEta')}
                                            />

                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-2xl border border-solid border-store-line bg-white p-4">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-extrabold text-store-ink">
                                            <FileText size={16} />
                                            {ui('notificationProductRequests')}
                                        </div>
                                        <PreferenceRow
                                            title={ui('notificationSourcing')}
                                            description={ui('notificationSourcingDesc')}
                                            checked={preferences.sourcingReply}
                                            onToggle={() => setPreference('sourcingReply')}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* NOTIFICATION DETAIL MODAL */}
            {selected && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-store-dark/65 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelected(null);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="Notification details"
                        className="w-full max-w-[540px] overflow-hidden rounded-[26px] bg-white text-store-ink shadow-[0_25px_80px_color-mix(in_srgb,_var(--color-black)_30%,_transparent)]"
                    >
                        <div className="flex items-start justify-between gap-4 bg-store-green px-6 py-5 text-white">
                            <div className="min-w-0">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-store-yellow">
                                    {selected.badge}
                                </span>

                                <h3 className="m-0 mt-2 font-subheading text-xl font-bold leading-snug">
                                    {selected.title}
                                </h3>

                                <p className="m-0 mt-2 inline-flex items-center gap-1 text-[11px] text-surface-green">
                                    <Clock3 size={12} />
                                    {selected.timeAgo}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                aria-label="Close notification"
                                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-solid border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="max-h-[60vh] space-y-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 py-5">
                            <p className="m-0 text-sm leading-7 text-store-muted">
                                {selected.description}
                            </p>

                            {selected.isSystemUpdatePopup && selected.popupHighlights?.length ? (
                                <div className="rounded-2xl bg-surface-green p-4">
                                    <div className="mb-3 flex items-center gap-2 text-xs font-bold text-store-ink">
                                        <ShieldCheck size={17} />
                                        Release highlights · {selected.popupVersion ?? 'Update'}
                                    </div>

                                    <div className="space-y-3">
                                        {selected.popupHighlights.map((highlight) => (
                                            <div
                                                key={highlight.title}
                                                className="flex items-start gap-2 text-xs leading-6"
                                            >
                                                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-store-green text-white">
                                                    <Check size={12} />
                                                </span>

                                                <p className="m-0 text-store-ink">
                                                    <strong className="text-store-ink">
                                                        {highlight.title}
                                                    </strong>{' '}
                                                    {highlight.detail}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {!selected.isSystemUpdatePopup && (
                                <p className="m-0 rounded-xl bg-surface-green p-3 text-[11px] leading-5 text-store-muted">
                                    This is a sample notification. Related purchasing actions will
                                    be available after backend integration.
                                </p>
                            )}
                        </div>

                        <div className="border-t border-store-line px-6 py-4 text-right">
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="cursor-pointer rounded-xl border-0 bg-store-yellow px-6 py-2.5 text-xs font-extrabold text-store-ink hover:bg-store-yellow"
                            >
                                Done
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}
