import Skeleton from '@/components/common/Skeleton';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    ArrowUpRight,
    CircleHelp,
    Clock3,
    Cpu,
    Download,
    FileBarChart2,
    FileText,
    Info,
    RefreshCw,
    Server,
    ShieldCheck,
    SlidersHorizontal,
    Users,
    Wallet,
    WifiOff,
} from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SystemMonitoringDashboard from '@/components/admin/SystemMonitoringDashboard';
import SystemSettingsForm from '@/components/admin/SystemSettingsForm';
import FinanceReport from '@/components/admin/FinanceReport';
import { useSystemMetrics } from '@/hooks/admin/useSystemMetrics';
import { useRegistrationStats } from '@/hooks/admin/useRegistrations';
import { useStaff } from '@/hooks/admin/useStaff';
import { useAuthStore } from '@/store/admin/authStore';
import { exportRegistrationMetrics } from '@/utils/admin/systemMetrics';
import { getAuthError } from '@/utils/admin/authError';
import { ROUTES } from '@/router/routes';
import type { RegistrationStats } from '@/types/admin/registration';
import './SystemMetricsPage.css';

export default function SystemMetricsPage() {
    const { t, i18n } = useTranslation('admin');
    const [searchParams] = useSearchParams();
    const health = useSystemMetrics();
    const registrations = useRegistrationStats();
    const staff = useStaff({ page: 0, size: 1 });
    const session = useAuthStore((state) => state.session);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const requestedTab = searchParams.get('tab') || 'overview';
    const currentTab = requestedTab === 'reports' ? 'revenue' : requestedTab;
    const tab = ['overview', 'revenue', 'ai', 'settings', 'logs'].includes(currentTab)
        ? currentTab
        : 'overview';
    const refreshing = health.isFetching || registrations.isFetching || staff.isFetching;
    const number = new Intl.NumberFormat(i18n.resolvedLanguage === 'en' ? 'en-GB' : 'vi-VN');

    useEffect(() => {
        document.title = `${t('navigation.system')} | Bite to Business`;
    }, [t]);

    function refreshOverview() {
        void health.refetch();
        void registrations.refetch();
        void staff.refetch();
    }

    function exportOverview() {
        if (!registrations.data || registrations.isError) return;
        exportRegistrationMetrics(
            registrations.data,
            {
                metric: t('system.export.metric'),
                value: t('system.export.value'),
                capturedAt: t('system.export.capturedAt'),
                total: t('system.overview.registrations'),
                pending: t('system.registrations.pending'),
                approved: t('system.registrations.approved'),
                rejected: t('system.registrations.rejected'),
            },
            registrations.dataUpdatedAt,
        );
    }

    return (
        <div className="system-page">
            <AdminPageHeader
                sectionNumber="03"
                eyebrow={t('system.eyebrow')}
                title={t('system.title')}
                description={t('system.description')}
            >
                <div className="flex items-center gap-3 rounded-[3px] border border-black bg-store-cream px-4 py-3">
                    <ShieldCheck size={20} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                        <strong className="block text-[12px] leading-[18px] font-semibold">
                            {t('system.adminOnly')}
                        </strong>
                        <span className="block pt-1 text-[11px] leading-[16.5px] text-store-muted">
                            {t('system.timezone')}
                        </span>
                    </div>
                </div>
            </AdminPageHeader>

            <nav className="system-tabs" aria-label={t('system.tabsLabel')}>
                <Link to="?tab=overview" aria-current={tab === 'overview' ? 'page' : undefined}>
                    <Activity size={17} />
                    {t('system.tabs.overview')}
                </Link>
                <Link to="?tab=revenue" aria-current={tab === 'revenue' ? 'page' : undefined}>
                    <FileBarChart2 size={17} />
                    {t('system.tabs.revenue')}
                </Link>
                <Link to="?tab=ai" aria-current={tab === 'ai' ? 'page' : undefined}>
                    <Cpu size={17} />
                    {t('system.tabs.ai')}
                </Link>
                <Link to="?tab=settings" aria-current={tab === 'settings' ? 'page' : undefined}>
                    <SlidersHorizontal size={17} />
                    {t('system.tabs.settings')}
                </Link>
                <Link to="?tab=logs" aria-current={tab === 'logs' ? 'page' : undefined}>
                    <FileText size={17} />
                    {t('system.tabs.logs')}
                </Link>
            </nav>

            {tab === 'overview' && (
                <>
                    <SystemMonitoringDashboard />
                    <div className="system-section-toolbar">
                        <div>
                            <h2>{t('system.overview.title')}</h2>
                            <p>{t('system.overview.description')}</p>
                        </div>
                        <AdminButton
                            onClick={refreshOverview}
                            busy={refreshing}
                            disabled={refreshing}
                        >
                            {!refreshing && <RefreshCw size={16} />}
                            {t('system.refresh')}
                        </AdminButton>
                    </div>
                    {(health.isError || registrations.isError || staff.isError) && (
                        <div className="system-notice system-notice-warning" role="alert">
                            <WifiOff size={20} aria-hidden="true" />
                            <div>
                                <strong>{t('system.overview.partialError')}</strong>
                                <p>{t('system.overview.partialErrorHint')}</p>
                                <p className="system-error-codes">
                                    {health.isError &&
                                        `${t('system.overview.backend')}: ${getAuthError(health.error).code}. `}
                                    {registrations.isError &&
                                        `${t('system.overview.registrations')}: ${getAuthError(registrations.error).code}. `}
                                    {staff.isError &&
                                        `${t('system.overview.staff')}: ${getAuthError(staff.error).code}.`}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="system-metric-grid">
                        <article className="system-metric-card system-metric-featured">
                            <div className="system-metric-label">
                                <span>{t('system.overview.backend')}</span>
                                <Server size={20} aria-hidden="true" />
                            </div>
                            <strong>
                                {health.isPending
                                    ? <Skeleton className="h-8 w-28"/>
                                    : health.isError
                                      ? t('system.status.unreachable')
                                      : t('system.status.responding')}
                            </strong>
                            <p>{t('system.overview.backendHint')}</p>
                        </article>
                        <article className="system-metric-card">
                            <div className="system-metric-label">
                                <span>{t('system.overview.roundTrip')}</span>
                                <Clock3 size={20} aria-hidden="true" />
                            </div>
                            <strong>
                                {health.isPending ? <Skeleton className="h-8 w-24"/> : health.data && !health.isError ? (
                                    <>
                                        {number.format(health.data.roundTripMs)}
                                        <small> ms</small>
                                    </>
                                ) : (
                                    '—'
                                )}
                            </strong>
                            <p>{t('system.overview.roundTripHint')}</p>
                        </article>
                        <article className="system-metric-card">
                            <div className="system-metric-label">
                                <span>{t('system.overview.registrations')}</span>
                                <FileText size={20} aria-hidden="true" />
                            </div>
                            <strong>
                                {registrations.isPending ? <Skeleton className="h-8 w-24"/> : registrations.data && !registrations.isError
                                    ? number.format(registrations.data.total)
                                    : '—'}
                            </strong>
                            <p>{t('system.overview.allTime')}</p>
                        </article>
                        <article className="system-metric-card">
                            <div className="system-metric-label">
                                <span>{t('system.overview.staff')}</span>
                                <Users size={20} aria-hidden="true" />
                            </div>
                            <strong>
                                {staff.isPending ? <Skeleton className="h-8 w-24"/> : staff.data && !staff.isError
                                    ? number.format(staff.data.totalElements)
                                    : '—'}
                            </strong>
                            <p>{t('system.overview.staffHint')}</p>
                        </article>
                    </div>

                    <div className="system-overview-columns">
                        <section className="system-panel">
                            <header className="system-panel-heading">
                                <div>
                                    <h2>{t('system.registrations.title')}</h2>
                                    <p>{t('system.registrations.description')}</p>
                                </div>
                                <span className="system-badge">{t('system.overview.allTime')}</span>
                            </header>
                            <RegistrationChart
                                stats={registrations.isError ? undefined : registrations.data}
                                loading={registrations.isPending}
                            />
                            <footer className="system-panel-footer">
                                <Link to={ROUTES.ADMIN_REGISTRATIONS}>
                                    {t('system.registrations.view')}
                                    <ArrowUpRight size={15} />
                                </Link>
                                <AdminButton
                                    onClick={exportOverview}
                                    disabled={
                                        !registrations.data ||
                                        registrations.isError ||
                                        registrations.isFetching
                                    }
                                >
                                    <Download size={15} />
                                    {t('system.registrations.export')}
                                </AdminButton>
                            </footer>
                        </section>
                        <section className="system-panel">
                            <header className="system-panel-heading">
                                <div>
                                    <h2>{t('system.sources.title')}</h2>
                                    <p>{t('system.sources.description')}</p>
                                </div>
                            </header>
                            <ul className="system-source-list">
                                <li>
                                    <span>
                                        <Server size={18} />
                                        {t('system.sources.api')}
                                    </span>
                                    <span
                                        className={`system-badge ${health.isSuccess ? 'system-badge-green' : ''}`}
                                    >
                                        {t(
                                            health.isPending
                                                ? 'system.status.checking'
                                                : health.isError
                                                  ? 'system.status.unreachable'
                                                  : 'system.status.responding',
                                        )}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <FileText size={18} />
                                        {t('system.sources.accounts')}
                                    </span>
                                    <span
                                        className={`system-badge ${registrations.isSuccess ? 'system-badge-green' : ''}`}
                                    >
                                        {t(
                                            registrations.isSuccess
                                                ? 'system.status.available'
                                                : registrations.isPending
                                                  ? 'system.status.checking'
                                                  : 'system.status.unavailable',
                                        )}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <Wallet size={18} />
                                        {t('system.sources.payments')}
                                    </span>
                                    <span className="system-badge">
                                        {t('system.status.notConnected')}
                                    </span>
                                </li>
                            </ul>
                            <p className="system-source-note">
                                <Info size={16} />
                                {t('system.sources.note')}
                            </p>
                        </section>
                    </div>

                    <p className="system-updated" role="status">
                        <Clock3 size={14} />
                        {health.data
                            ? t('system.updated', {
                                  time: new Intl.DateTimeFormat(
                                      i18n.resolvedLanguage === 'en' ? 'en-GB' : 'vi-VN',
                                      {
                                          dateStyle: 'short',
                                          timeStyle: 'medium',
                                          timeZone: 'Asia/Ho_Chi_Minh',
                                      },
                                  ).format(new Date(health.data.checkedAt)),
                              })
                            : t('system.noUpdate')}
                    </p>
                </>
            )}
            {tab === 'revenue' && <FinanceReport />}
            {tab === 'ai' && <SystemMonitoringDashboard mode="ai" />}
            {tab === 'settings' && (
                <SystemSettingsForm
                    key={`${session?.user.id}:${sessionVersion}`}
                    storageKey={`bitetobusiness.admin.systemDraft.${session?.user.id}`}
                />
            )}
            {tab === 'logs' && <SystemMonitoringDashboard mode="logs" />}
        </div>
    );
}

function RegistrationChart({ stats, loading }: { stats?: RegistrationStats; loading: boolean }) {
    const { t, i18n } = useTranslation('admin');
    const number = new Intl.NumberFormat(i18n.resolvedLanguage === 'en' ? 'en-GB' : 'vi-VN');
    if (loading)
        return (
            <div aria-busy="true" className="system-registration-chart"><div className="system-chart-total"><Skeleton className="mx-auto h-10 w-20"/><Skeleton className="mx-auto mt-2 h-4 w-24"/></div><div className="system-bar-list">{Array.from({length:3},(_,i)=><div key={i} className="system-bar-row"><Skeleton className="h-4 w-32"/><Skeleton className="mt-2 h-3 w-full"/></div>)}</div></div>
        );
    if (!stats)
        return (
            <div className="system-empty-state">
                <CircleHelp size={32} />
                <h3>{t('system.noData')}</h3>
                <p>{t('system.registrations.unavailable')}</p>
            </div>
        );
    if (stats.total === 0)
        return (
            <div className="system-empty-state">
                <Users size={32} />
                <h3>{t('system.registrations.empty')}</h3>
                <p>{t('system.registrations.emptyHint')}</p>
            </div>
        );
    return (
        <div
            className="system-registration-chart"
            role="img"
            aria-label={t('system.registrations.chartLabel', { ...stats })}
        >
            <div className="system-chart-total">
                <strong>{number.format(stats.total)}</strong>
                <span>{t('system.registrations.total')}</span>
            </div>
            <div className="system-bar-list" aria-hidden="true">
                <div className="system-bar-row">
                    <div>
                        <span>{t('system.registrations.pending')}</span>
                        <strong>{number.format(stats.pending)}</strong>
                    </div>
                    <div className="system-bar-track">
                        <span
                            className="system-bar-yellow"
                            style={{
                                width: `${Math.min(100, (stats.pending / stats.total) * 100)}%`,
                            }}
                        />
                    </div>
                </div>
                <div className="system-bar-row">
                    <div>
                        <span>{t('system.registrations.approved')}</span>
                        <strong>{number.format(stats.approved)}</strong>
                    </div>
                    <div className="system-bar-track">
                        <span
                            className="system-bar-green"
                            style={{
                                width: `${Math.min(100, (stats.approved / stats.total) * 100)}%`,
                            }}
                        />
                    </div>
                </div>
                <div className="system-bar-row">
                    <div>
                        <span>{t('system.registrations.rejected')}</span>
                        <strong>{number.format(stats.rejected)}</strong>
                    </div>
                    <div className="system-bar-track">
                        <span
                            className="system-bar-pink"
                            style={{
                                width: `${Math.min(100, (stats.rejected / stats.total) * 100)}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
