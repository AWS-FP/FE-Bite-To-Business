import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProfileSidebar from '@/components/customer/profile/ProfileSidebar';
import ProfileAccountCard from '@/components/customer/profile/ProfileAccountCard';
import ProfileForm from '@/components/customer/profile/ProfileForm';
import { getCustomerProfile } from '@/services/customer/profileService';
import { useAuthStore } from '@/store/admin/authStore';
import { getAuthError } from '@/utils/admin/authError';
import { ROUTES } from '@/router/routes';

function ProfileContent() {
    const { t } = useTranslation('profile');
    const customerId = useAuthStore((state) => state.session?.user.id);
    const query = useQuery({
        queryKey: ['customer-profile', customerId],
        queryFn: ({ signal }) => getCustomerProfile(signal),
        enabled: !!customerId,
        retry: false,
        refetchOnWindowFocus: false,
    });

    return (
        <StorefrontLayout
            rootClassName="min-h-screen bg-store-cream font-body text-store-ink"
            mainClassName="mx-auto max-w-[1440px] px-6 pb-14 pt-5"
        >
            <nav
                className="mb-5 flex items-center gap-2 text-xs text-store-muted"
                aria-label={t('breadcrumb')}
            >
                <Link className="text-store-green no-underline hover:underline" to={ROUTES.HOME}>
                    Bite to Business
                </Link>
                <ChevronRight size={14} aria-hidden="true" />
                <span>{t('breadcrumb')}</span>
            </nav>
            <div className="mb-6 flex items-center justify-between gap-6 border-b border-store-line pb-5">
                <div>
                    <p className="m-0 text-[11px] font-bold tracking-widest text-store-green">
                        {t('eyebrow')}
                    </p>
                    <h1 className="mb-1 mt-2 font-heading text-[32px] text-store-ink">
                        {t('title')}
                    </h1>
                    <p className="m-0 text-sm text-store-muted">{t('description')}</p>
                </div>
                {query.data && <ProfileAccountCard profile={query.data} />}
            </div>
            {query.isPending && (
                <p role="status" className="rounded-2xl border border-store-line bg-white p-6">
                    {t('loading')}
                </p>
            )}
            {query.isError && (
                <div
                    role="alert"
                    className="rounded-2xl border border-danger-line bg-danger-soft p-6 text-danger-strong"
                >
                    <p className="m-0 font-semibold">{t('loadError')}</p>
                    <p className="text-sm">
                        {t('errorCode', { code: getAuthError(query.error).code })}
                    </p>
                    <button
                        type="button"
                        onClick={() => void query.refetch()}
                        className="rounded-lg border border-current bg-white px-4 py-2 font-semibold"
                    >
                        {t('retry')}
                    </button>
                </div>
            )}
            {query.data && (
                <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-5">
                    <ProfileSidebar />
                    <ProfileForm key={query.data.user.id} initialProfile={query.data} />
                </div>
            )}
        </StorefrontLayout>
    );
}

export default function ProfilePage() {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <ProfileContent />
        </QueryClientProvider>
    );
}
