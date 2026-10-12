import { Globe2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  return (
    <div className="language-switcher" role="group" aria-label={t('language.label')}>
      <Globe2 size={16} aria-hidden="true" />
      {(['vi', 'en'] as const).map((language) => (
        <button key={language} type="button" aria-label={t(`language.${language}`)} aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => void i18n.changeLanguage(language)}>{language.toUpperCase()}</button>
      ))}
    </div>
  )
}
