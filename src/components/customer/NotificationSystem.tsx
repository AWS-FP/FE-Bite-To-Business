
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
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { INITIAL_NOTIFICATIONS } from '../../constants/customer/homeData'
import type { NotificationItemData } from '../../constants/customer/homeData'

export interface NotificationSystemProps {
    isOpen?: boolean
    onToggle?: () => void
    onClose?: () => void
}

type Filter = 'all' | NotificationItemData['category']
type PreferenceKey =
    | 'quoteApproval'
    | 'quoteExpiry'
    | 'deliveryEta'
    | 'sourcingReply'

type Preferences = Record<PreferenceKey, boolean>

const DEFAULT_PREFS: Preferences = {
    quoteApproval: true,
    quoteExpiry: true,
    deliveryEta: true,
    sourcingReply: true,
}

const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'system', label: 'Updates' },
    { key: 'quote', label: 'Quotes' },
    { key: 'delivery', label: 'Delivery' },
]

function CategoryIcon({
                          category,
                      }: {
    category: NotificationItemData['category']
}) {
    const styles = {
        system: 'bg-[#FFF0D9] text-[#A75A00]',
        quote: 'bg-[#E2F2E9] text-[#14573E]',
        delivery: 'bg-[#E8EEFF] text-[#3456A6]',
    }[category]

    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles}`}
        >
            {category === 'system' ? <Sparkles size={19} /> : null}
            {category === 'quote' ? <FileText size={19} /> : null}
            {category === 'delivery' ? <Truck size={19} /> : null}
        </div>
    )
}

function PreferenceRow({
                           title,
                           description,
                           checked,
                           onToggle,
                       }: {
    title: string
    description: string
    checked: boolean
    onToggle: () => void
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0 flex-1">
                <p className="m-0 text-[13px] font-bold leading-5 text-[#1A3028]">
                    {title}
                </p>
                <p className="m-0 mt-1 text-[11px] leading-[1.6] text-[#77847D]">
                    {description}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={title}
                onClick={onToggle}
                className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full border-0 p-0.5 transition-colors duration-200 ${
                    checked ? 'bg-[#184F3A]' : 'bg-[#C8D0CB]'
                }`}
            >
                <span
                    className={`block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    )
}

export default function NotificationSystem({
                                               isOpen: controlledIsOpen,
                                               onToggle,
                                               onClose,
                                           }: NotificationSystemProps) {
    const [localIsOpen, setLocalIsOpen] = useState(false)
    const isOpen = controlledIsOpen ?? localIsOpen

    const [notifications, setNotifications] = useState<NotificationItemData[]>(
        INITIAL_NOTIFICATIONS
    )

    const [filter, setFilter] = useState<Filter>('all')
    const [view, setView] = useState<'list' | 'settings'>('list')
    const [selected, setSelected] = useState<NotificationItemData | null>(null)
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFS)

    const unreadCount = notifications.filter((item) => item.unread).length

    const visibleNotifications = useMemo(
        () =>
            filter === 'all'
                ? notifications
                : notifications.filter((item) => item.category === filter),
        [notifications, filter]
    )

    useEffect(() => {
        if (!selected) return

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelected(null)
        }

        window.addEventListener('keydown', onEscape)

        return () => window.removeEventListener('keydown', onEscape)
    }, [selected])

    function toggleDropdown() {
        if (onToggle) onToggle()
        else setLocalIsOpen((value) => !value)

        setView('list')
    }

    function closeDropdown() {
        if (onClose) onClose()
        else setLocalIsOpen(false)
    }

    function markRead(id: string) {
        setNotifications((current) =>
            current.map((item) =>
                item.id === id
                    ? { ...item, unread: false }
                    : item
            )
        )
    }

    function openDetail(item: NotificationItemData) {
        markRead(item.id)
        closeDropdown()
        setSelected(item)
    }

    function setPreference(key: PreferenceKey) {
        setPreferences((previous) => ({
            ...previous,
            [key]: !previous[key],
        }))
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
                    className={`relative flex size-[42px] cursor-pointer items-center justify-center rounded-full border-2 border-solid border-[#14132B] text-[#14132B] shadow-[2px_2px_0_#14132B] transition-colors ${
                        isOpen
                            ? 'bg-[#FACC15]'
                            : 'bg-[#FFF1E0] hover:bg-[#FACC15]'
                    }`}
                >
                    <Bell size={19} />

                    {unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-solid border-[#123B2E] bg-[#EF4444] px-1 text-[10px] font-black leading-none text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* DROPDOWN */}
                {isOpen && (
                    <div
                        role="dialog"
                        aria-label="Purchasing notifications"
                        className="absolute right-0 top-[54px] z-[80] flex w-[min(420px,calc(100vw-24px))] max-h-[min(78vh,640px)] flex-col overflow-hidden rounded-[24px] border border-solid border-[#C9D8CF] bg-[#F8FAF8] text-[#162E25] shadow-[0_20px_60px_rgba(8,31,23,0.28)]"
                    >
                        {/* HEADER - Một lớp bo góc duy nhất */}
                        <div className="shrink-0 bg-[#123B2E] px-5 pb-4 pt-4 text-white">
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <div className="min-w-0">
                                    {view === 'settings' && (
                                        <button
                                            type="button"
                                            onClick={() => setView('list')}
                                            className="mb-2 inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-semibold text-white/75 hover:text-white"
                                        >
                                            <ArrowLeft size={13} />
                                            Back to notifications
                                        </button>
                                    )}

                                    <p className="m-0 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#FACC15]">
                                        BITE TO BUSINESS
                                    </p>

                                    <h3 className="m-0 mt-1 font-serif text-[19px] font-bold leading-6">
                                        {view === 'list'
                                            ? 'Notifications'
                                            : 'Notification settings'}
                                    </h3>

                                    <p className="m-0 mt-1 text-[11px] leading-4 text-[#BED5C8]">
                                        {view === 'list'
                                            ? 'Your purchasing activity, all in one place'
                                            : 'Demo preferences for this session'}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-1.5">
                                    {view === 'list' && unreadCount > 0 && (
                                        <span className="rounded-full bg-[#FACC15] px-2.5 py-1 text-[11px] font-black text-[#142D23]">
                                            {unreadCount} new
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        aria-label={
                                            view === 'list'
                                                ? 'Notification settings'
                                                : 'Back to notifications'
                                        }
                                        onClick={() =>
                                            setView(
                                                view === 'list'
                                                    ? 'settings'
                                                    : 'list'
                                            )
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
                                <div className="shrink-0 border-0 border-b border-solid border-[#E1E8E3] bg-white px-4 pb-3 pt-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[11px] font-bold text-[#56695E]">
                                            Inbox{' '}
                                            <span className="text-[#91A39A]">
                                                · {notifications.length}
                                            </span>
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNotifications((list) =>
                                                    list.map((n) => ({
                                                        ...n,
                                                        unread: false,
                                                    }))
                                                )
                                            }
                                            disabled={unreadCount === 0}
                                            className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-bold text-[#1B674A] hover:underline disabled:cursor-default disabled:opacity-40"
                                        >
                                            <CheckCheck size={14} />
                                            Mark all read
                                        </button>
                                    </div>

                                    <div className="mt-3 flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                                        {FILTERS.map((tab) => (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                onClick={() =>
                                                    setFilter(tab.key)
                                                }
                                                aria-pressed={
                                                    filter === tab.key
                                                }
                                                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-solid px-3 py-1.5 text-[11px] font-bold transition-colors ${
                                                    filter === tab.key
                                                        ? 'border-[#123B2E] bg-[#123B2E] text-white'
                                                        : 'border-[#DDE5E0] bg-[#F7FAF8] text-[#587164] hover:border-[#8EAA9B]'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* NOTIFICATION LIST */}
                                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain bg-[#F8FAF8] p-3 [scrollbar-width:thin]">
                                    {visibleNotifications.length === 0 ? (
                                        <div className="flex min-h-[185px] flex-col items-center justify-center px-4 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F1EA] text-[#1B674A]">
                                                <Inbox size={24} />
                                            </div>
                                            <p className="m-0 mt-3 text-sm font-bold">
                                                Nothing here yet
                                            </p>
                                            <p className="m-0 mt-1 text-xs text-[#7E8D84]">
                                                Try another category.
                                            </p>
                                        </div>
                                    ) : (
                                        visibleNotifications.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() =>
                                                    openDetail(item)
                                                }
                                                className={`group w-full cursor-pointer rounded-2xl border border-solid p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#9AB9A8] hover:shadow-sm ${
                                                    item.unread
                                                        ? 'border-[#CFE1D5] bg-white'
                                                        : 'border-[#E8EDE9] bg-[#FDFEFD] opacity-85'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <CategoryIcon
                                                        category={
                                                            item.category
                                                        }
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
                                                            <span
                                                                className={`max-w-full break-words rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase leading-[1.5] ${item.badgeBg} ${item.badgeText}`}
                                                            >
                                                                {item.badge}
                                                            </span>

                                                            {item.unread && (
                                                                <span className="h-2 w-2 shrink-0 rounded-full bg-[#E85E52]" />
                                                            )}
                                                        </div>

                                                        <h4 className="m-0 mt-2 text-[12px] font-extrabold leading-[1.5] text-[#152F25]">
                                                            {item.title}
                                                        </h4>

                                                        <p className="m-0 mt-1 line-clamp-2 text-[11px] leading-[1.65] text-[#718078]">
                                                            {
                                                                item.description
                                                            }
                                                        </p>

                                                        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8A9890]">
                                                                <Clock3
                                                                    size={11}
                                                                />
                                                                {
                                                                    item.timeAgo
                                                                }
                                                            </span>

                                                            <span className="text-[10px] font-extrabold text-[#1B674A] group-hover:underline">
                                                                View details →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                {/* FOOTER */}
                                <div className="flex shrink-0 items-center justify-between gap-3 border-0 border-t border-solid border-[#E0E8E2] bg-white px-4 py-3">
                                    <span className="text-[10px] text-[#8A9890]">
                                        Demo notifications
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNotifications([])
                                        }
                                        disabled={
                                            notifications.length === 0
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[11px] font-bold text-[#9A5044] hover:text-[#D04338] disabled:opacity-40"
                                    >
                                        <Trash2 size={13} />
                                        Clear all
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* NOTIFICATION SETTINGS */}
                                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#F8FAF8] p-4 [scrollbar-width:thin]">
                                    <div className="rounded-2xl border border-solid border-[#E0E9E2] bg-white p-4">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-extrabold text-[#1B674A]">
                                            <FileText size={16} />
                                            QUOTES & ORDERS
                                        </div>

                                        <div className="divide-y divide-[#ECF0EC]">
                                            <PreferenceRow
                                                title="Quote approval status"
                                                description="Notifications about approvals and price reviews."
                                                checked={
                                                    preferences.quoteApproval
                                                }
                                                onToggle={() =>
                                                    setPreference(
                                                        'quoteApproval'
                                                    )
                                                }
                                            />

                                            <PreferenceRow
                                                title="Quote expiry reminders"
                                                description="Warnings before an approved quote expires."
                                                checked={
                                                    preferences.quoteExpiry
                                                }
                                                onToggle={() =>
                                                    setPreference(
                                                        'quoteExpiry'
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-2xl border border-solid border-[#E0E9E2] bg-white p-4">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-extrabold text-[#1B674A]">
                                            <Truck size={16} />
                                            LOGISTICS
                                        </div>

                                        <div className="divide-y divide-[#ECF0EC]">
                                            <PreferenceRow
                                                title="Delivery ETA"
                                                description="Cold-truck departures and delivery updates."
                                                checked={
                                                    preferences.deliveryEta
                                                }
                                                onToggle={() =>
                                                    setPreference(
                                                        'deliveryEta'
                                                    )
                                                }
                                            />

                                            <PreferenceRow
                                                title="New product sourcing"
                                                description="Replies to requests for unlisted ingredients."
                                                checked={
                                                    preferences.sourcingReply
                                                }
                                                onToggle={() =>
                                                    setPreference(
                                                        'sourcingReply'
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-[11px] leading-5 text-[#89978E]">
                                        These switches are frontend-only until notification APIs are connected.
                                    </p>
                                </div>

                                <div className="shrink-0 border-t border-[#E0E8E2] bg-white p-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setView('list')
                                        }
                                        className="w-full cursor-pointer rounded-xl border-0 bg-[#123B2E] px-4 py-3 text-[12px] font-bold text-white hover:bg-[#1E5742]"
                                    >
                                        Back to notifications
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* NOTIFICATION DETAIL MODAL */}
            {selected && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#081A14]/65 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelected(null)
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="Notification details"
                        className="w-full max-w-[540px] overflow-hidden rounded-[26px] bg-white text-[#172F25] shadow-[0_25px_80px_rgba(0,0,0,.3)]"
                    >
                        <div className="flex items-start justify-between gap-4 bg-[#123B2E] px-6 py-5 text-white">
                            <div className="min-w-0">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FACC15]">
                                    {selected.badge}
                                </span>

                                <h3 className="m-0 mt-2 font-serif text-xl font-bold leading-snug">
                                    {selected.title}
                                </h3>

                                <p className="m-0 mt-2 inline-flex items-center gap-1 text-[11px] text-[#D0E2D7]">
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

                        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
                            <p className="m-0 text-sm leading-7 text-[#53675B]">
                                {selected.description}
                            </p>

                            {selected.isSystemUpdatePopup &&
                            selected.popupHighlights?.length ? (
                                <div className="rounded-2xl bg-[#EDF7F0] p-4">
                                    <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#174E39]">
                                        <ShieldCheck size={17} />
                                        Release highlights ·{' '}
                                        {selected.popupVersion ??
                                            'Update'}
                                    </div>

                                    <div className="space-y-3">
                                        {selected.popupHighlights.map(
                                            (highlight) => (
                                                <div
                                                    key={
                                                        highlight.title
                                                    }
                                                    className="flex items-start gap-2 text-xs leading-6"
                                                >
                                                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#174E39] text-white">
                                                        <Check size={12} />
                                                    </span>

                                                    <p className="m-0 text-[#39574A]">
                                                        <strong className="text-[#173D2D]">
                                                            {
                                                                highlight.title
                                                            }
                                                        </strong>{' '}
                                                        {highlight.detail}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : null}

                            {!selected.isSystemUpdatePopup && (
                                <p className="m-0 rounded-xl bg-[#F7F8F4] p-3 text-[11px] leading-5 text-[#77847C]">
                                    This is a sample notification. Related purchasing actions will be available after backend integration.
                                </p>
                            )}
                        </div>

                        <div className="border-t border-[#E5ECE6] px-6 py-4 text-right">
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="cursor-pointer rounded-xl border-0 bg-[#FACC15] px-6 py-2.5 text-xs font-extrabold text-[#142D23] hover:bg-[#F9DB4E]"
                            >
                                Done
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}
