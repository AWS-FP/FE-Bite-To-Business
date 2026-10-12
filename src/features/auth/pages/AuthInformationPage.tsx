import { useEffect } from 'react'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Brand from '../../../components/navigation/Brand'
import LanguageSwitcher from '../../../components/navigation/LanguageSwitcher'

// Navigation destinations until the registration/reset forms are implemented.
export default function AuthInformationPage({ kind }: { kind: 'register' | 'forgot' }) {
  const { t } = useTranslation()
  const title = t(`information.${kind}Title`)
  useEffect(() => { document.title = `${title} | MD Foods` }, [title])
  return (
    <main className="auth-information">
      <header><Brand compact /><LanguageSwitcher /></header>
      <section className="information-content">
        <MailCheck size={32} aria-hidden="true" /><h1>{title}</h1>
        <p>{t(`information.${kind}Description`)}</p><p className="information-pending">{t('information.pending')}</p>
        <Link to="/login"><ArrowLeft size={17} aria-hidden="true" />{t('information.back')}</Link>
      </section>
    </main>
  )
}
