import { useEffect } from 'react'
import { ArrowUpRight, BadgeCheck, Leaf, MailCheck, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Brand from '../../../components/navigation/Brand'
import LanguageSwitcher from '../../../components/navigation/LanguageSwitcher'
import groceries from '../../../assets/login-groceries.svg'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const { t } = useTranslation()
  useEffect(() => { document.title = t('login.pageTitle') }, [t])
  return (
    <main className="auth-layout">
      <section className="auth-story" aria-labelledby="story-title">
        <Brand />
        <div className="story-content">
          <p className="eyebrow story-eyebrow"><span />{t('hero.eyebrow')}</p>
          <h1 id="story-title">{t('hero.title')}</h1>
          <p className="story-description">{t('hero.description')}</p>
          <div className="grocery-illustration"><img src={groceries} alt={t('hero.imageAlt')} width={480} height={300} /></div>
          <div className="story-benefits">
            <span><BadgeCheck size={19} aria-hidden="true" />{t('hero.quality')}</span>
            <span><Truck size={19} aria-hidden="true" />{t('hero.delivery')}</span>
          </div>
        </div>
        <p className="story-footer"><Leaf size={16} aria-hidden="true" />{t('hero.footer')}</p>
      </section>
      <section className="auth-main" aria-labelledby="login-title">
        <header className="auth-toolbar"><div className="mobile-brand"><Brand compact /></div><LanguageSwitcher /></header>
        <div className="login-content">
          <div className="login-heading">
            <p className="eyebrow">{t('login.eyebrow')}</p>
            <h2 id="login-title">{t('login.title')}</h2>
            <p>{t('login.description')}</p>
          </div>
          <LoginForm />
          <p className="register-prompt">{t('login.accountQuestion')} <Link to="/register">{t('login.register')}<ArrowUpRight size={15} aria-hidden="true" /></Link></p>
          <aside className="approval-note"><MailCheck size={21} aria-hidden="true" /><div><h3>{t('login.approvalTitle')}</h3><p>{t('login.approvalDescription')}</p></div></aside>
        </div>
        <footer className="auth-footer">{t('login.copyright', { year: new Date().getFullYear() })}</footer>
      </section>
    </main>
  )
}
