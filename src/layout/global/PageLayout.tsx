import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

interface PageLayoutProps {
  name: string
  header?: ReactNode
  sidebar?: ReactNode
  footer?: ReactNode
}

// Khung chung cho các role; Outlet hiển thị page tương ứng với route con đang mở.
export default function PageLayout({ name, header, sidebar, footer }: PageLayoutProps) {
  return (
    <div data-layout={name}>
      {header}
      <div>
        {sidebar}
        <main>
          <Outlet />
        </main>
      </div>
      {footer}
    </div>
  )
}
