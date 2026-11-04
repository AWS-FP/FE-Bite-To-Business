import { ArrowLeft, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StorefrontLayout from '../layouts/StorefrontLayout';
import { ROUTES } from '../router/routes';

/**
 * Trang giữ chỗ cho đến khi Landing Page từ feat/landing-page-ui được tích hợp.
 * Khi merge tính năng của đồng đội: thay Component trong router.tsx bằng LandingPage thật.
 */
export default function LandingPlaceholderPage() {
    const { t } = useTranslation('storefront');

    return (
        <StorefrontLayout
            rootClassName="flex min-h-screen flex-col bg-store-green text-store-cream"
            mainClassName="flex flex-1 items-center justify-center px-5 py-16"
        >
            <section className="w-full max-w-2xl rounded-[28px] border border-solid border-white/15 bg-white/5 text-center shadow-lg p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-store-yellow text-store-green">
                    <Sprout size={30} aria-hidden="true" />
                </div>
                <span className="mt-7 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-store-yellow">
                    Bite to Business
                </span>
                <h1 className="mt-3 font-heading text-4xl">{t('landingPending.title')}</h1>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-surface-green">
                    {t('landingPending.description')}
                </p>
                <Link
                    className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-store-yellow px-6 text-sm font-extrabold text-store-green no-underline transition-colors hover:bg-store-yellow"
                    to={ROUTES.HOME}
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    {t('landingPending.backToShop')}
                </Link>
            </section>
        </StorefrontLayout>
    );
}
