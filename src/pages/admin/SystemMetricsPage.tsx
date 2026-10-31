import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Check,
    CheckCircle2,
    CircleHelp,
    Clock3,
    Cpu,
    Download,
    FileBarChart2,
    FileText,
    Info,
    RefreshCw,
    Search,
    Server,
    ShieldCheck,
    SlidersHorizontal,
    Users,
    Wallet,
    WifiOff,
} from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import SystemSettingsForm from '@/components/admin/SystemSettingsForm';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const health = useSystemMetrics();
    const registrations = useRegistrationStats();
    const staff = useStaff({ page: 0, size: 1 });
    const session = useAuthStore((state) => state.session);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const currentTab = searchParams.get('tab') || 'overview';
    const tab = ['overview', 'reports', 'ai', 'settings', 'logs'].includes(currentTab)
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
            <header className="system-intro">
                <div>
                    <p className="system-eyebrow">
                        <span>03</span>
                        {t('system.eyebrow')}
                    </p>
                    <h1>{t('system.title')}</h1>
                    <p className="system-intro-description">{t('system.description')}</p>
                </div>
                <div className="system-intro-note">
                    <ShieldCheck size={23} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                        <strong>{t('system.adminOnly')}</strong>
                        <span>{t('system.timezone')}</span>
                    </div>
                </div>
            </header>

            <nav className="system-tabs" aria-label={t('system.tabsLabel')}>
                <Link to="?tab=overview" aria-current={tab === 'overview' ? 'page' : undefined}>
                    <Activity size={17} />
                    {t('system.tabs.overview')}
                </Link>
                <Link to="?tab=reports" aria-current={tab === 'reports' ? 'page' : undefined}>
                    <FileBarChart2 size={17} />
                    {t('system.tabs.reports')}
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
                                    ? '—'
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
                                {health.data && !health.isError ? (
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
                                {registrations.data && !registrations.isError
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
                                {staff.data && !staff.isError
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
                                        <Activity size={18} />
                                        {t('system.sources.telemetry')}
                                    </span>
                                    <span className="system-badge">
                                        {t('system.status.notConnected')}
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
                                <li>
                                    <span>
                                        <Cpu size={18} />
                                        {t('system.sources.ai')}
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
                    <section className="system-panel">
                        <header className="system-panel-heading">
                            <div>
                                <h2>{t('system.traffic.title')}</h2>
                                <p>{t('system.traffic.description')}</p>
                            </div>
                            <span className="system-badge">{t('system.status.notConnected')}</span>
                        </header>
                        <div className="system-chart-empty">
                            <BarChart3 size={38} strokeWidth={1.3} aria-hidden="true" />
                            <h3>{t('system.traffic.empty')}</h3>
                            <p>{t('system.traffic.hint')}</p>
                        </div>
                    </section>
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
            {tab === 'reports' && <SystemReports />}
            {tab === 'ai' && (
                <SystemAiUsage onConfigure={() => setSearchParams({ tab: 'settings' })} />
            )}
            {tab === 'settings' && (
                <SystemSettingsForm
                    key={`${session?.user.id}:${sessionVersion}`}
                    storageKey={`bitetobusiness.admin.systemDraft.${session?.user.id}`}
                />
            )}
            {tab === 'logs' && <SystemLogs />}
        </div>
    );
}

function RegistrationChart({ stats, loading }: { stats?: RegistrationStats; loading: boolean }) {
    const { t, i18n } = useTranslation('admin');
    const number = new Intl.NumberFormat(i18n.resolvedLanguage === 'en' ? 'en-GB' : 'vi-VN');
    if (loading)
        return (
            <div className="system-empty-state" role="status">
                <RefreshCw className="animate-spin motion-reduce:animate-none" size={28} />
                <p>{t('system.loading')}</p>
            </div>
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

function SystemReports() {
    const { t } = useTranslation('admin');
    const [filters, setFilters] = useState(() => {
        const today = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh',
        }).format(new Date());
        return { from: `${today.slice(0, 8)}01`, to: today, group: 'day', basis: 'payments' };
    });
    return (
        <>
            <div className="system-section-toolbar">
                <div>
                    <h2>{t('system.reports.title')}</h2>
                    <p>{t('system.reports.description')}</p>
                </div>
                <span className="system-badge">VND · Asia/Saigon</span>
            </div>
            <section className="system-panel">
                <header className="system-panel-heading">
                    <div>
                        <h2>{t('system.reports.filters')}</h2>
                        <p>{t('system.reports.filtersHint')}</p>
                    </div>
                    <FileBarChart2 size={24} aria-hidden="true" />
                </header>
                <div className="system-form-body system-report-filters">
                    <label>
                        {t('system.filters.from')}
                        <input
                            type="date"
                            value={filters.from}
                            max={filters.to || undefined}
                            onChange={(event) =>
                                setFilters({ ...filters, from: event.target.value })
                            }
                        />
                    </label>
                    <label>
                        {t('system.filters.to')}
                        <input
                            type="date"
                            value={filters.to}
                            min={filters.from || undefined}
                            onChange={(event) => setFilters({ ...filters, to: event.target.value })}
                        />
                    </label>
                    <label>
                        {t('system.filters.group')}
                        <select
                            value={filters.group}
                            onChange={(event) =>
                                setFilters({ ...filters, group: event.target.value })
                            }
                        >
                            <option value="day">{t('system.filters.day')}</option>
                            <option value="week">{t('system.filters.week')}</option>
                            <option value="month">{t('system.filters.month')}</option>
                        </select>
                    </label>
                    <label>
                        {t('system.reports.basis')}
                        <select
                            value={filters.basis}
                            onChange={(event) =>
                                setFilters({ ...filters, basis: event.target.value })
                            }
                        >
                            <option value="payments">{t('system.reports.paymentsBasis')}</option>
                            <option value="orders">{t('system.reports.completedBasis')}</option>
                        </select>
                    </label>
                </div>
                <footer className="system-panel-footer">
                    <p className="system-muted">{t('system.reports.waitingHint')}</p>
                    <div className="system-button-row">
                        <AdminButton disabled>
                            <Search size={16} />
                            {t('system.reports.preview')}
                        </AdminButton>
                        <AdminButton disabled tone="primary">
                            <Download size={16} />
                            {t('system.reports.export')}
                        </AdminButton>
                    </div>
                </footer>
            </section>
            <div className="system-metric-grid system-metric-grid-three">
                <article className="system-metric-card">
                    <div className="system-metric-label">
                        <span>{t('system.reports.paid')}</span>
                        <Wallet size={20} />
                    </div>
                    <strong>—</strong>
                    <p>{t('system.reports.paidHint')}</p>
                </article>
                <article className="system-metric-card">
                    <div className="system-metric-label">
                        <span>{t('system.reports.completed')}</span>
                        <CheckCircle2 size={20} />
                    </div>
                    <strong>—</strong>
                    <p>{t('system.reports.completedHint')}</p>
                </article>
                <article className="system-metric-card">
                    <div className="system-metric-label">
                        <span>{t('system.reports.cancelled')}</span>
                        <FileText size={20} />
                    </div>
                    <strong>—</strong>
                    <p>{t('system.noData')}</p>
                </article>
            </div>
            <section className="system-panel">
                <header className="system-panel-heading">
                    <div>
                        <h2>
                            {t(
                                filters.basis === 'payments'
                                    ? 'system.reports.paymentChart'
                                    : 'system.reports.orderChart',
                            )}
                        </h2>
                        <p>{t('system.reports.chartHint')}</p>
                    </div>
                    <span className="system-badge">{t('system.status.notConnected')}</span>
                </header>
                <div className="system-chart-empty">
                    <FileBarChart2 size={40} strokeWidth={1.3} />
                    <h3>{t('system.reports.empty')}</h3>
                    <p>{t('system.reports.emptyHint')}</p>
                </div>
            </section>
            <div className="system-notice">
                <Info size={20} />
                <p>{t('system.reports.definition')}</p>
            </div>
        </>
    );
}

function SystemAiUsage({ onConfigure }: { onConfigure: () => void }) {
    const { t } = useTranslation('admin');
    return (
        <>
            <div className="system-section-toolbar">
                <div>
                    <h2>{t('system.ai.title')}</h2>
                    <p>{t('system.ai.description')}</p>
                </div>
                <AdminButton onClick={onConfigure}>
                    <SlidersHorizontal size={16} />
                    {t('system.ai.configure')}
                </AdminButton>
            </div>
            <div className="system-metric-grid">
                <article className="system-metric-card">
                    <div className="system-metric-label">
                        <span>{t('system.ai.requests')}</span>
                        <Cpu size={20} />
                    </div>
                    <strong>—</strong>
                    <p>{t('system.noData')}</p>
                </article>
                <article className="system-metric-card">
                    <div className="system-metric-label">
                        <span>{t('system.ai.tokens')}</span>
                        <BarChart3 size={20} />
                    </div>
                    <strong>—</strong>
                    <p>{t('system.ai.tokensHint')}</p>
                </article>
                <article className="system-metric-card">
                    <div className="system-metric-label">
                        <span>{t('system.ai.cost')}</span>
                        <Wallet size={20} />
                    </div>
                    <strong>—</strong>
                    <p>{t('system.ai.costHint')}</p>
                </article>
                <article className="system-metric-card">
                    <div className="system-metric-label">
                        <span>{t('system.ai.uiSuccess')}</span>
                        <Check size={20} />
                    </div>
                    <strong>—</strong>
                    <p>{t('system.ai.uiSuccessHint')}</p>
                </article>
            </div>
            <section className="system-panel">
                <header className="system-panel-heading">
                    <div>
                        <h2>{t('system.ai.usageChart')}</h2>
                        <p>{t('system.ai.usageHint')}</p>
                    </div>
                    <span className="system-badge">{t('system.status.notConnected')}</span>
                </header>
                <div className="system-chart-empty">
                    <Cpu size={40} strokeWidth={1.3} />
                    <h3>{t('system.ai.empty')}</h3>
                    <p>{t('system.ai.emptyHint')}</p>
                </div>
            </section>
            <div className="system-notice">
                <Info size={20} />
                <p>{t('system.ai.billingNote')}</p>
            </div>
        </>
    );
}

function SystemLogs() {
    const { t } = useTranslation('admin');
    return (
        <>
            <div className="system-section-toolbar">
                <div>
                    <h2>{t('system.logs.title')}</h2>
                    <p>{t('system.logs.description')}</p>
                </div>
                <span className="system-badge">{t('system.status.notConnected')}</span>
            </div>
            <section className="system-panel">
                <div className="system-form-body system-log-filters">
                    <label>
                        {t('system.logs.search')}
                        <input type="search" placeholder={t('system.logs.searchHint')} disabled />
                    </label>
                    <label>
                        {t('system.logs.type')}
                        <select disabled defaultValue="all">
                            <option value="all">{t('system.logs.all')}</option>
                        </select>
                    </label>
                </div>
                <div className="system-table-scroll">
                    <table className="system-log-table">
                        <thead>
                            <tr>
                                <th>{t('system.logs.time')}</th>
                                <th>{t('system.logs.event')}</th>
                                <th>{t('system.logs.source')}</th>
                                <th>{t('system.logs.code')}</th>
                                <th>{t('system.logs.actor')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={5}>
                                    <div className="system-empty-state">
                                        <FileText size={35} strokeWidth={1.4} />
                                        <h3>{t('system.logs.empty')}</h3>
                                        <p>{t('system.logs.emptyHint')}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <div className="system-notice">
                <ShieldCheck size={20} />
                <p>{t('system.logs.draftNote')}</p>
            </div>
        </>
    );
}
