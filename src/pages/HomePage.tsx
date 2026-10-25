import { useTranslation } from 'react-i18next'
import Footer from '@/layouts/Footer'
import Header from '@/layouts/Header'

export default function HomePage() {
  const { t } = useTranslation('storefront')

  return (
    <div className="flex min-h-dvh flex-col bg-store-cream">
      <Header />
      {/* Homepage chưa có nội dung. Khi code, thêm các section vào */}
      <main className="min-h-[200px] flex-1 outline-none" id="main-content" tabIndex={-1} aria-label={t('main')} />
      <Footer />
    </div>
  )
}
