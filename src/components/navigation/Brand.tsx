import { Sprout } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Bite to Business">
      <span className="brand-mark"><Sprout size={27} strokeWidth={1.8} aria-hidden="true" /></span>
      <span><span className="brand-name">Bite to Business<span className="brand-dot">.</span></span>
        {!compact && <span className="brand-tagline">{t('brand.tagline')}</span>}
      </span>
    </div>
  )
}
