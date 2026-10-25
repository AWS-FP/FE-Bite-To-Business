import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

interface AdminSidebarProps {
  registrationsPath: string
  staffPath: string
  pendingCount?: number
  isCollapsed: boolean
  isMobileOpen: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
}

export default function AdminSidebar({
  registrationsPath,
  staffPath,
  pendingCount,
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: AdminSidebarProps) {
  const { t } = useTranslation('admin')
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isMobileOpen) return

    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    const closeButton = sidebarRef.current?.querySelector<HTMLButtonElement>('.admin-sidebar-close')
    closeButton?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseMobile()
        return
      }

      // Khi mở menu trên điện thoại, phím Tab chỉ đi qua các nút và liên kết trong menu.
      if (event.key === 'Tab') {
        const elements = sidebarRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        )
        if (!elements) return
        const visibleElements = Array.from(elements).filter(
          (element) => element.getClientRects().length > 0,
        )
        const first = visibleElements[0]
        const last = visibleElements[visibleElements.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [isMobileOpen, onCloseMobile])

  return (
    <aside
      className="admin-sidebar sticky top-0 flex h-dvh min-h-[450px] flex-col overflow-y-auto border-r-2 border-black bg-[#fff8e8] px-4 pt-[25px] pb-4 [scrollbar-width:thin]
        max-[901px]:invisible max-[901px]:fixed max-[901px]:top-0 max-[901px]:left-0 max-[901px]:z-40 max-[901px]:min-h-0 max-[901px]:w-[248px] max-[901px]:-translate-x-full
        max-[901px]:[.is-mobile-open_&]:visible max-[901px]:[.is-mobile-open_&]:translate-x-0"
      id="admin-sidebar"
      ref={sidebarRef}
      aria-label={t('sidebar.label')}
      role={isMobileOpen ? 'dialog' : undefined}
      aria-modal={isMobileOpen ? true : undefined}
    >
      <button
        className="admin-sidebar-close admin-icon-button absolute top-2 right-2 hidden size-8 place-items-center border-0 bg-transparent p-[3px] text-black hover:bg-[#0000000d] max-[901px]:grid"
        type="button"
        aria-label={t('sidebar.close')}
        onClick={onCloseMobile}
      >
        <X size={20} aria-hidden="true" />
      </button>

      <NavLink
        className="admin-brand flex min-h-[70px] items-center gap-2 px-2 py-3 no-underline min-[901px]:[.is-collapsed_&]:justify-center min-[901px]:[.is-collapsed_&]:px-0"
        to={registrationsPath}
        aria-label="Bite to Business · Admin"
        onClick={onCloseMobile}
      >
        <img
          className="block shrink-0 object-contain min-[901px]:[.is-collapsed_&]:h-9 min-[901px]:[.is-collapsed_&]:w-[46px]"
          src="/images/admin/brand-logo.png"
          alt=""
          width={60}
          height={46}
        />
        <span className="admin-brand-name brand-name flex flex-col text-[18px] leading-[21.6px] tracking-[-0.3px] min-[901px]:[.is-collapsed_&]:hidden">
          <span>Bite to</span>
          <span>Business</span>
        </span>
      </NavLink>

      <p className="admin-sidebar-workspace flex min-h-[35px] items-center gap-[7px] px-[5px] pt-5 text-[10px] leading-[15px] font-bold tracking-[1px] min-[901px]:[.is-collapsed_&]:justify-center min-[901px]:[.is-collapsed_&]:px-0">
        <span className="size-[6px] shrink-0 rounded-full bg-black" aria-hidden="true" />
        <span className="admin-sidebar-text min-[901px]:[.is-collapsed_&]:hidden">
          {t('workspace')}
        </span>
      </p>
      <div className="admin-sidebar-divider my-[22px] h-[2px] shrink-0 bg-black" />
      <p className="admin-sidebar-group admin-sidebar-text pb-[13px] pl-[5px] text-[10px] leading-[15px] font-bold tracking-[1px] min-[901px]:[.is-collapsed_&]:hidden">
        {t('sidebar.accountManagement')}
      </p>

      <nav
        className="admin-sidebar-navigation flex flex-col gap-[7px]"
        aria-label={t('sidebar.accountManagement')}
      >
        <NavLink
          className="admin-navigation-link relative flex min-h-[51px] items-center gap-[9px] rounded-[3px] border border-black bg-white px-[11px] py-[9px] text-[13px] leading-[18.2px] font-normal no-underline
            hover:bg-[#fff3b1] aria-[current=page]:bg-[#ffe14d] aria-[current=page]:font-bold aria-[current=page]:shadow-[3px_3px_0_#000] hover:aria-[current=page]:bg-[#ffe14d]
            min-[901px]:[.is-collapsed_&]:justify-center min-[901px]:[.is-collapsed_&]:px-2"
          to={registrationsPath}
          title={t('navigation.registrations')}
          aria-label={
            pendingCount !== undefined
              ? t('sidebar.pendingRegistrations', { count: pendingCount })
              : t('navigation.registrations')
          }
          onClick={onCloseMobile}
        >
          <img
            className="block shrink-0"
            src="/images/admin/customers.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="admin-sidebar-text min-w-0 flex-1 min-[901px]:[.is-collapsed_&]:hidden">
            {t('navigation.registrations')}
          </span>
          {pendingCount !== undefined && (
            <span
              className="admin-pending-count ml-auto shrink-0 rounded-[2px] border border-black bg-white px-[5px] py-px text-[11px] leading-[16.5px] font-bold
                min-[901px]:[.is-collapsed_&]:absolute min-[901px]:[.is-collapsed_&]:-top-[6px] min-[901px]:[.is-collapsed_&]:-right-[6px]
                min-[901px]:[.is-collapsed_&]:px-[3px] min-[901px]:[.is-collapsed_&]:py-0 min-[901px]:[.is-collapsed_&]:text-[9px] min-[901px]:[.is-collapsed_&]:leading-[14px]"
              aria-hidden="true"
            >
              {pendingCount}
            </span>
          )}
        </NavLink>

        <NavLink
          className="admin-navigation-link relative flex min-h-[51px] items-center gap-[9px] rounded-[3px] border border-black bg-white px-[11px] py-[9px] text-[13px] leading-[18.2px] font-normal no-underline
            hover:bg-[#fff3b1] aria-[current=page]:bg-[#ffe14d] aria-[current=page]:font-bold aria-[current=page]:shadow-[3px_3px_0_#000] hover:aria-[current=page]:bg-[#ffe14d]
            min-[901px]:[.is-collapsed_&]:justify-center min-[901px]:[.is-collapsed_&]:px-2"
          to={staffPath}
          title={t('navigation.staff')}
          onClick={onCloseMobile}
        >
          <img
            className="block shrink-0"
            src="/images/admin/staff.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="admin-sidebar-text min-w-0 flex-1 min-[901px]:[.is-collapsed_&]:hidden">
            {t('navigation.staff')}
          </span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom mt-auto pt-12 before:mb-[15px] before:block before:border-t before:border-black before:content-['']">
        <button
          className="admin-collapse-button admin-icon-button ml-auto grid place-items-center border-0 bg-transparent p-[3px] text-black hover:bg-[#0000000d] max-[901px]:hidden min-[901px]:[.is-collapsed_&]:mr-auto"
          type="button"
          title={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          aria-label={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          aria-expanded={!isCollapsed}
          aria-controls="admin-sidebar"
          onClick={onToggleCollapse}
        >
          <img
            className="block shrink-0 min-[901px]:[.is-collapsed_&]:rotate-180"
            src="/images/admin/sidebar-collapse.svg"
            alt=""
            width={19}
            height={19}
          />
        </button>
      </div>
    </aside>
  )
}
