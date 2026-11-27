import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Area,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AdminButton from './AdminButton';
import ApiDiagnosticsPanel from './ApiDiagnosticsPanel';
import SystemLogPanel from './SystemLogPanel';
import FrontendLogPanel from './FrontendLogPanel';
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
const diagnosticsMetrics = [
    'requests',
    'clientErrors',
    'errors',
    'alb4xx',
    'alb5xx',
    'latency',
    'pageLoad',
    'lcp',
    'jserrors',
    'cpu',
    'memory',
];
const gaugeMetrics = ['cpu', 'memory', 'latency', 'pageLoad', 'lcp'];
const sparseErrorMetrics = ['errors', 'clientErrors', 'alb4xx', 'alb5xx'];

export default function SystemMonitoringDashboard({ mode = 'overview' }: { mode?: Mode }) {
    const { t, i18n } = useTranslation('admin');
    const [hours, setHours] = useState(6);
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
    const keys =
        mode === 'logs'
            ? diagnosticsMetrics
            : mode === 'overview'
              ? [...cloudMetrics, 'aiRequests', 'aiFailed']
              : aiMetrics;
    const logs =
        data?.recentAiLogs.filter(
            (row) =>
                status === 'all' ||
                (status === 'failed' ? row.status === 'FAILED' : row.status !== 'FAILED'),
        ) ?? [];

    return (
        <section className="grid min-w-0 gap-5" aria-label={t('system.monitoring.title')}>
            <div className="system-section-toolbar">
                <div>
                    <h2>
                        {t(
                            mode === 'logs'
                                ? 'system.diagnostics.production'
                                : `system.monitoring.${mode === 'ai' ? 'aiTitle' : 'title'}`,
                        )}
                    </h2>
                </div>
                <div className="system-button-row">
                    <label className="flex items-center gap-2 text-xs">
                        {t('system.monitoring.range')}
                        <select
                            className="rounded-[3px] border border-solid border-black bg-white p-2.5"
                            value={hours}
                            onChange={(event) => setHours(Number(event.target.value))}
                        >
                            <option value={1}>{t('system.monitoring.hour')}</option>
                            <option value={6}>{t('system.monitoring.sixHours')}</option>
                            <option value={24}>{t('system.monitoring.day')}</option>
                            <option value={168}>{t('system.monitoring.week')}</option>
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
            {mode === 'logs' && !data && <><ApiDiagnosticsPanel hours={hours} /><SystemLogPanel hours={hours} /><FrontendLogPanel key={hours} hours={hours} /></>}
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
                    {data.cloudStatus !== 'AVAILABLE' && mode !== 'ai' && (
                        <div className="system-notice system-notice-warning">
                            {t(
                                `system.monitoring.${data.cloudStatus === 'UNAVAILABLE' ? 'cloudUnavailable' : 'cloudPartial'}`,
                            )}
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 min-[1201px]:grid-cols-4">
                        {keys.map((id) => {
                            const points = metricPoints(data, id);
                            const current = points.filter(
                                (point) => Date.parse(point.time) >= from,
                            );
                            const previous = points.filter(
                                (point) => Date.parse(point.time) < from,
                            );
                            const gauge = gaugeMetrics.includes(id);
                            const value = gauge ? current.at(-1)?.value : total(current);
                            const old = total(previous);
                            const change =
                                !gauge && value !== undefined && old !== undefined && old > 0
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
                                            {gauge && value !== undefined
                                                ? id === 'cpu' || id === 'memory'
                                                    ? ' %'
                                                    : ' ms'
                                                : ''}
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
                    {mode === 'logs' && <><ApiDiagnosticsPanel hours={hours} /><SystemLogPanel hours={hours} /><FrontendLogPanel key={hours} hours={hours} /></>}
                    <div className="grid grid-cols-1 gap-5 min-[701px]:grid-cols-2">
                        {(mode === 'ai'
                            ? aiMetrics
                            : mode === 'logs'
                              ? ['requests', 'errors', 'alb5xx', 'latency', 'pageLoad', 'lcp']
                              : ['pageviews', 'requests', 'aiRequests', 'aiFailed']
                        ).map((id) => (
                            <MetricChart key={id} id={id} data={data} date={date} />
                        ))}
                    </div>
                    <section className="system-panel">
                        <header className="system-panel-heading">
                            <div>
                                <h2>{t('system.monitoring.logsTitle')}</h2>
                                <p>{t('system.monitoring.logsHint')}</p>
                            </div>
                            <label className="flex items-center gap-2 text-xs">
                                {t('system.monitoring.status')}
                                <select
                                    className="rounded-[3px] border border-solid border-black bg-white p-2.5"
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
                            <table className="system-log-table [&_td]:border-t [&_td]:[border-top-style:solid] [&_td]:border-store-line [&_td]:px-6 [&_td]:py-3.5 [&_td]:text-xs [&_td]:wrap-anywhere">
                                <thead>
                                    <tr>
                                        {[
                                            'time',
                                            'model',
                                            'status',
                                            'duration',
                                            'input',
                                            'output',
                                            'code',
                                        ].map((key) => (
                                            <th key={key}>{t(`system.monitoring.${key}`)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((row, index) => (
                                        <tr key={row.id ?? `${row.time}-${index}`}>
                                            <td>{new Date(row.time).toLocaleString(i18n.language, { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
                                            <td>{row.model}<span className="mt-1 block font-mono text-[10px] text-store-muted" title={row.id}>{row.id}</span></td>
                                            <td><span className={`rounded-full px-2 py-1 font-semibold ${row.status === 'FAILED' ? 'bg-red-50 text-red-700' : row.status === 'SUCCEEDED' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{row.status}</span></td>
                                            <td>
                                                {row.durationMs === null
                                                    ? '—'
                                                    : `${number.format(row.durationMs)} ms`}
                                            </td>
                                            <td>
                                                {row.inputTokens === null ? '—' : number.format(row.inputTokens)}
                                            </td>
                                            <td>{row.outputTokens === null ? '—' : number.format(row.outputTokens)}</td>
                                            <td>{row.errorCode ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan={7}>{t('system.monitoring.emptyLogs')}</td>
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
    if (!aiMetrics.includes(id)) {
        const metric = data.metrics.find((series) => series.id === id);
        if (!metric) return [];
        if (!sparseErrorMetrics.includes(id) || data.cloudStatus !== 'AVAILABLE')
            return metric.points;
        // ALB only publishes error counts when nonzero. Fill gaps with zero only in known traffic buckets.
        const counts = new Map(metric.points.map((point) => [point.time, point.value]));
        for (const point of data.metrics.find((series) => series.id === 'requests')?.points ?? []) {
            if (point.value > 0 && !counts.has(point.time)) counts.set(point.time, 0);
        }
        return Array.from(counts, ([time, value]) => ({ time, value })).sort(
            (a, b) => Date.parse(a.time) - Date.parse(b.time),
        );
    }
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
    const gauge = gaugeMetrics.includes(id);
    const unit = data.metrics.find((metric) => metric.id === id)?.unit;
    const suffix =
        unit === 'percent' ? '%' : unit === 'seconds' ? ' s' : unit === 'milliseconds' ? ' ms' : '';
    const number = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 });
    return (
        <section className="system-panel overflow-hidden rounded-xl border border-store-line bg-white shadow-sm">
            <header className="system-panel-heading">
                <h2>{t(`system.monitoring.metrics.${id}`)}</h2>
            </header>
            {points.length === 0 ? (
                <div className="system-empty-state">
                    <p>{t('system.monitoring.noMetric')}</p>
                </div>
            ) : (
                <>
                    <div className="h-72 min-w-0 px-4 pt-5">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <ComposedChart
                                data={buckets}
                                accessibilityLayer
                                margin={{ top: 12, right: 16, bottom: 8, left: 4 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 5"
                                    vertical={false}
                                    stroke="#e4e9e6"
                                />
                                <XAxis
                                    dataKey="timestamp"
                                    type="number"
                                    domain={[from, to]}
                                    tickFormatter={(value) =>
                                        date(new Date(Number(value)).toISOString())
                                    }
                                    minTickGap={75}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: 'var(--color-store-muted)' }}
                                />
                                <YAxis
                                    width={75}
                                    tickFormatter={(value) =>
                                        `${number.format(Number(value))}${suffix}`
                                    }
                                    allowDecimals={gauge}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: 'var(--color-store-muted)' }}
                                />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #d8e2dc", boxShadow: "0 8px 25px rgba(10, 40, 29, .12)" }}
                                    labelFormatter={(value) =>
                                        date(new Date(Number(value)).toISOString())
                                    }
                                    formatter={(value) => [
                                        `${number.format(Number(value))}${suffix}`,
                                        t(`system.monitoring.metrics.${id}`),
                                    ]}
                                />
                                {gauge ? (
                                    <Area
                                        type="monotone"
                                        fill="rgba(18, 59, 46, 0.10)"
                                        dataKey="value"
                                        stroke="var(--color-store-green)"
                                        strokeWidth={2}
                                        dot={false}
                                        connectNulls={false}
                                        isAnimationActive={false}
                                    />
                                ) : (
                                    <Bar
                                        dataKey="value"
                                        fill="var(--color-store-green)"
                                        maxBarSize={18}
                                        radius={[4, 4, 0, 0]}
                                        isAnimationActive={false}
                                    />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between px-6 pb-4 text-[11px] text-store-muted">
                        <span>{date(data.from)}</span>
                        <span>{date(data.to)}</span>
                    </div>
                    <details className="border-t [border-top-style:solid] border-store-line px-6 py-3 text-xs">
                        <summary className="cursor-pointer">{t('system.monitoring.viewData')}</summary>
                        <table className="mt-3 w-full text-left">
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
                                            {point.value == null ? '—' : number.format(point.value)}
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
