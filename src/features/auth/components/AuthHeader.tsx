import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../app/router/routes'
import LanguageSwitcher from '../../../layout/LanguageSwitcher'

// Header dùng chung cho các trang trong feature auth.
export default function AuthHeader() {
  const { t } = useTranslation()

  return (
    <header className="auth-header relative z-[2] border-0 border-b border-solid border-[#ffffff20]">
      <div
        className="auth-header-inner mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-5 px-10 py-1
        max-[600px]:flex-wrap max-[600px]:gap-2.5 max-[600px]:px-4"
      >
        <Link
          className="auth-brand inline-flex items-center gap-2 font-brand text-[20px] font-normal tracking-[-0.5px] text-white
          no-underline max-[600px]:text-[16px]"
          to={ROUTES.HOME}
          aria-label={t('auth.home')}
        >
          <img
            className="auth-brand-logo block h-10 w-[60px] shrink-0 object-contain max-[600px]:h-9 max-[600px]:w-11"
            src="/logo.svg"
            alt=""
            width={60}
            height={40}
          />
          <span className="brand-name">Bite to Business</span>
        </Link>

        <nav
          className="auth-header-actions flex items-center gap-3 max-[600px]:gap-0"
          aria-label={t('auth.navigation')}
        >
          <Link
            className="auth-browse-link flex min-h-9 items-center rounded-[30px] border border-solid border-[#ffffff50] px-4
            py-1.5 text-[14px] font-semibold text-white no-underline transition-[background] duration-150
            hover:bg-[#ffffff15] max-[600px]:hidden"
            to={ROUTES.CATALOG}
          >
            {t('auth.browse')}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
