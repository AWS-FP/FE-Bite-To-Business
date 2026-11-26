import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import {
    Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import AdminButton from './AdminButton';
import { getSystemMonitoring } from '@/services/admin/systemService';
import { useAuthStore } from '@/store/admin/authStore';
import type { MonitoringPoint, SystemMonitoring } from '@/types/admin/system';

type Mode = 'overview' | 'ai' | 'logs';
const cloudMetrics = [
    'pageviews',
    'sessions',
    'requests',
    'errors',
    'cpu',
    'memory',
    'latency',
    'jserrors',
];
const aiMetrics = ['aiRequests', 'aiFailed', 'inputTokens', 'outputTokens'];

export default function SystemMonitoringDashboard({ mode = 'overview' }: { mode?: Mode }) {
    const { t, i18n } = useTranslation('admin');
    const [hours, setHours] = useState(24);
    const [status, setStatus] = useState('all');
    const session = useAuthStore((state) => state.session);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const query = useQuery({
        queryKey: ['admin', session?.user.id, sessionVersion, 'monitoring', hours],
        queryFn: ({ signal }) => getSystemMonitoring(hours, signal),
        enabled: session?.user.role === 'ADMIN',
        staleTime: 60_000,
        refetchInterval: 60_000,
        retry: false,
    });
    const number = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 });
    const date = (time: string) =>
        new Intl.DateTimeFormat(i18n.language, {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh',
        }).format(new Date(time));
    const data = query.data;
    const from = data ? Date.parse(data.from) : 0;
    const keys = mode === 'overview' ? [...cloudMetrics, 'aiRequests', 'aiFailed'] : aiMetrics;
    const logs =
        data?.recentAiLogs.filter(
            (row) =>
                status === 'all' ||
                (status === 'failed' ? row.status === 'FAILED' : row.status !== 'FAILED'),
        ) ?? [];

    return (
        <section className="system-monitoring" aria-label={t('system.monitoring.title')}>
            <div className="system-section-toolbar">
                <div>
                    <h2>
                        {t(
                            `system.monitoring.${mode === 'logs' ? 'logsTitle' : mode === 'ai' ? 'aiTitle' : 'title'}`,
                        )}
                    </h2>
                    <p>{t('system.monitoring.description')}</p>
                </div>
                <div className="system-button-row">
                    <label className="monitoring-range">
                        {t('system.monitoring.range')}
                        <select
                            value={hours}
                            onChange={(event) => setHours(Number(event.target.value))}
                        >
                            <option value={24}>{t('system.monitoring.day')}</option>
                            <option value={168}>{t('system.monitoring.week')}</option>
                            <option value={720}>{t('system.monitoring.month')}</option>
                        </select>
                    </label>
                    <AdminButton
                        onClick={() => void query.refetch()}
                        busy={query.isFetching}
                        disabled={query.isFetching}
                    >
                        {!query.isFetching && <RefreshCw size={16} />}
                        {t('system.refresh')}
                    </AdminButton>
                </div>
            </div>
            {query.isError && (
                <div className="system-notice system-notice-warning" role="alert">
                    {t('system.monitoring.error')}
                </div>
            )}
            {query.isPending && <p role="status">{t('system.loading')}</p>}
            {data && (
                <>
                    <p className="system-muted">
                        {t('system.monitoring.window', {
                            from: date(data.from),
                            to: date(data.to),
                        })}
                    </p>
                    {query.isError && (
                        <p className="system-muted">{t('system.monitoring.stale')}</p>
                    )}
                    {data.cloudStatus !== 'AVAILABLE' && mode === 'overview' && (
                        <div className="system-notice system-notice-warning">
                            {t(
                                `system.monitoring.${data.cloudStatus === 'UNAVAILABLE' ? 'cloudUnavailable' : 'cloudPartial'}`,
                            )}
                        </div>
                    )}
                    {mode !== 'logs' && (
                        <>
                            <div className="system-metric-grid">
                                {keys.map((id) => {
                                    const points = metricPoints(data, id);
                                    const current = points.filter(
                                        (point) => Date.parse(point.time) >= from,
                                    );
                                    const previous = points.filter(
                                        (point) => Date.parse(point.time) < from,
                                    );
                                    const gauge = ['cpu', 'memory', 'latency'].includes(id);
                                    const value = gauge ? current.at(-1)?.value : total(current);
                                    const old = total(previous);
                                    const change =
                                        !gauge &&
                                        value !== undefined &&
                                        old !== undefined &&
                                        old > 0
                                            ? ((value - old) / old) * 100
                                            : null;
                                    return (
                                        <article className="system-metric-card" key={id}>
                                            <div className="system-metric-label">
                                                {t(`system.monitoring.metrics.${id}`)}
                                            </div>
                                            <strong>
                                                {value === undefined
                                                    ? '—'
                                                    : number.format(
                                                          id === 'latency' ? value * 1000 : value,
                                                      )}
                                                <small>
                                                    {id === 'latency' ? ' ms' : gauge ? ' %' : ''}
                                                </small>
                                            </strong>
                                            <p>
                                                {gauge
                                                    ? t('system.monitoring.latestBucket')
                                                    : change === null
                                                      ? t('system.monitoring.noComparison')
                                                      : t('system.monitoring.change', {
                                                            value: `${change > 0 ? '+' : ''}${number.format(change)}`,
                                                        })}
                                            </p>
                                        </article>
                                    );
                                })}
                            </div>
                            <p className="system-muted">{t('system.monitoring.definitions')}</p>
                            <div className="monitoring-chart-grid">
                                {(mode === 'ai'
                                    ? aiMetrics
                                    : ['pageviews', 'requests', 'aiRequests', 'aiFailed']
                                ).map((id) => (
                                    <MetricChart key={id} id={id} data={data} date={date} />
                                ))}
                            </div>
                        </>
                    )}
                    <section className="system-panel">
                        <header className="system-panel-heading">
                            <div>
                                <h2>{t('system.monitoring.logsTitle')}</h2>
                                <p>{t('system.monitoring.logsHint')}</p>
                            </div>
                            <label className="monitoring-range">
                                {t('system.monitoring.status')}
                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                >
                                    <option value="all">{t('system.monitoring.all')}</option>
                                    <option value="failed">{t('system.monitoring.failed')}</option>
                                    <option value="other">{t('system.monitoring.other')}</option>
                                </select>
                            </label>
                        </header>
                        <div className="system-table-scroll">
                            <table className="system-log-table monitoring-log-table">
                                <thead>
                                    <tr>
                                        {[
                                            'time',
                                            'model',
                                            'status',
                                            'duration',
                                            'tokens',
                                            'code',
                                        ].map((key) => (
                                            <th key={key}>{t(`system.monitoring.${key}`)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((row, index) => (
                                        <tr key={`${row.time}-${index}`}>
                                            <td>{date(row.time)}</td>
                                            <td>{row.model}</td>
                                            <td>{row.status}</td>
                                            <td>
                                                {row.durationMs === null
                                                    ? '—'
                                                    : `${number.format(row.durationMs)} ms`}
                                            </td>
                                            <td>
                                                {row.inputTokens === null ||
                                                row.outputTokens === null
                                                    ? '—'
                                                    : number.format(
                                                          row.inputTokens + row.outputTokens,
                                                      )}
                                            </td>
                                            <td>{row.errorCode ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan={6}>{t('system.monitoring.emptyLogs')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </section>
    );
}

function total(points: MonitoringPoint[]) {
    return points.length ? points.reduce((sum, point) => sum + point.value, 0) : undefined;
}

function metricPoints(data: SystemMonitoring, id: string): MonitoringPoint[] {
    if (!aiMetrics.includes(id))
        return data.metrics.find((metric) => metric.id === id)?.points ?? [];
    const field = {
        aiRequests: 'requests',
        aiFailed: 'failed',
        inputTokens: 'inputTokens',
        outputTokens: 'outputTokens',
    }[id] as 'requests' | 'failed' | 'inputTokens' | 'outputTokens';
    // The database query completed, so empty AI buckets represent zero recorded calls.
    const start = Date.parse(data.from) - (Date.parse(data.to) - Date.parse(data.from));
    const values = new Map(data.ai.map((point) => [Date.parse(point.time), point[field]]));
    const result: MonitoringPoint[] = [];
    for (let time = start; time < Date.parse(data.to); time += data.periodSeconds * 1000) {
        result.push({ time: new Date(time).toISOString(), value: values.get(time) ?? 0 });
    }
    return result;
}

function MetricChart({
    id,
    data,
    date,
}: {
    id: string;
    data: SystemMonitoring;
    date: (time: string) => string;
}) {
    const { t, i18n } = useTranslation('admin');
    const from = Date.parse(data.from);
    const to = Date.parse(data.to);
    const points = metricPoints(data, id).filter(
        (point) => Date.parse(point.time) >= from && Date.parse(point.time) < to,
    );
    const values = new Map(points.map((point) => [Date.parse(point.time), point.value]));
    const buckets: { time: string; timestamp: number; value: number | null }[] = [];
    for (let timestamp = from; timestamp < to; timestamp += data.periodSeconds * 1000) {
        buckets.push({
            time: new Date(timestamp).toISOString(),
            timestamp,
            value: values.get(timestamp) ?? null,
        });
    }
    const gauge = ['cpu', 'memory', 'latency'].includes(id);
    const unit = data.metrics.find((metric) => metric.id === id)?.unit;
    const suffix = unit === 'percent' ? '%' : unit === 'seconds' ? 's' : '';
    const number = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 });
    return (
        <section className="system-panel">
            <header className="system-panel-heading">
                <h2>{t(`system.monitoring.metrics.${id}`)}</h2>
            </header>
            {points.length === 0 ? (
                <div className="system-empty-state">
                    <p>{t('system.monitoring.noMetric')}</p>
                </div>
            ) : (
                <>
                    <div className="h-64 min-w-0 px-2 pt-4">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <ComposedChart data={buckets} accessibilityLayer margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1dcd5" />
                                <XAxis
                                    dataKey="timestamp"
                                    type="number"
                                    domain={[from, to]}
                                    tickFormatter={(value) => date(new Date(Number(value)).toISOString())}
                                    minTickGap={60}
                                    tick={{ fontSize: 11, fill: '#526579' }}
                                />
                                <YAxis
                                    width={60}
                                    tickFormatter={(value) => `${number.format(Number(value))}${suffix}`}
                                    allowDecimals={gauge}
                                    tick={{ fontSize: 11, fill: '#526579' }}
                                />
                                <Tooltip
                                    labelFormatter={(value) => date(new Date(Number(value)).toISOString())}
                                    formatter={(value) => [
                                        `${number.format(Number(value))}${suffix}`,
                                        t(`system.monitoring.metrics.${id}`),
                                    ]}
                                />
                                {gauge ? (
                                    <Line dataKey="value" stroke="#123b2e" strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
                                ) : (
                                    <Bar dataKey="value" fill="#123b2e" maxBarSize={24} isAnimationActive={false} />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="monitoring-chart-axis">
                        <span>{date(data.from)}</span>
                        <span>{date(data.to)}</span>
                    </div>
                    <details className="monitoring-chart-data">
                        <summary>{t('system.monitoring.viewData')}</summary>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('system.monitoring.time')}</th>
                                    <th>{t('system.monitoring.value')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buckets.map((point) => (
                                    <tr key={point.time}>
                                        <td>{date(point.time)}</td>
                                        <td>
                                            {point.value == null
                                                ? '—'
                                                : number.format(point.value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </details>
                </>
            )}
        </section>
    );
}
