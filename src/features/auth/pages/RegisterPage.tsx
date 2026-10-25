import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import RegisterDecoration from '../components/RegisterDecoration'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [addressQueryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 86400000, retry: 1 } } }),
  )

  useEffect(() => {
    document.title = `${t('register.title')} | Bite to Business`
  }, [t])

  return (
    <div
      className="auth-page auth-register-page min-h-dvh overflow-clip bg-auth-green text-auth-ink
      [&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_:focus-visible]:outline-[3px_solid_#f2adce]
      [&_:focus-visible]:outline-offset-4 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none
      motion-reduce:[&_*]:scroll-auto"
    >
      <AuthHeader />
      <div className="auth-scene relative mx-auto min-h-[calc(100dvh-81px)] max-w-[1440px]">
        <RegisterDecoration />
        <main
          className="auth-main relative z-[1] flex justify-center px-6 pt-6 pb-20 max-[1200px]:pt-2.5 max-[600px]:pr-4
          max-[600px]:pb-[42px] max-[600px]:pl-3"
          id="main-content"
        >
          <AuthCard className="auth-register-card">
            <QueryClientProvider client={addressQueryClient}>
              <RegisterForm />
            </QueryClientProvider>
          </AuthCard>
        </main>
      </div>
    </div>
  )
}
