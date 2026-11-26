import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getApiDiagnostics } from '@/services/admin/systemService';
import { useAuthStore } from '@/store/admin/authStore';
import AdminButton from './AdminButton';

export default function ApiDiagnosticsPanel({ hours }: { hours: number }) {
    const { t, i18n } = useTranslation('admin');
    const session = useAuthStore((state) => state.session);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const [family, setFamily] = useState('all');
    const query = useQuery({
        queryKey: ['admin', session?.user.id, sessionVersion, 'apiDiagnostics', hours],
        queryFn: ({ signal }) => getApiDiagnostics(hours, signal),
        enabled: session?.user.role === 'ADMIN',
        staleTime: 30_000,
        refetchInterval: (q) => (q.state.data?.status === 'LOADING' ? 3000 : 60_000),
        retry: false,
    });
    const report = query.data;
    const time = new Intl.DateTimeFormat(i18n.language, {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    });
    const number = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 });
    const ms = (value: number | null) => (value === null ? '—' : number.format(value) + ' ms');
    const label = (key: string) => t('system.diagnostics.' + key);
    const errors = report?.errors.filter(
        (row) => family === 'all' || String(row.httpStatus).startsWith(family),
    );
    return (
        <section className="system-panel">
            <header className="system-panel-heading">
                <div>
                    <h2>{label('title')}</h2>
                    {report && (
                        <p>
                            {time.format(new Date(report.from))} –{' '}
                            {time.format(new Date(report.to))} (GMT+7)
                        </p>
                    )}
                </div>
                <AdminButton disabled={query.isFetching} onClick={() => void query.refetch()}>
                    {t('system.refresh')}
                </AdminButton>
            </header>
            {query.isError && (
                <p className="system-notice system-notice-warning" role="alert">
                    {label('UNAVAILABLE')}
                </p>
            )}
            {(!report || report.status !== 'AVAILABLE') && !(query.isError && !report) && (
                <p className="system-empty-state" role="status">
                    {label(report?.status ?? 'LOADING')}
                </p>
            )}
            {report?.status === 'AVAILABLE' && (
                <>
                    <header className="system-panel-heading">
                        <h3>{label('errors')}</h3>
                        <label className="monitoring-range">
                            {label('http')}
                            <select
                                value={family}
                                onChange={(event) => setFamily(event.target.value)}
                            >
                                <option value="all">{t('system.monitoring.all')}</option>
                                <option value="4">4xx</option>
                                <option value="5">5xx</option>
                            </select>
                        </label>
                    </header>
                    <div className="system-table-scroll">
                        <table className="system-log-table monitoring-log-table">
                            <thead>
                                <tr>
                                    {['route', 'http', 'source', 'count', 'last'].map((key) => (
                                        <th key={key}>{label(key)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {errors?.map((row) => (
                                    <tr
                                        key={[
                                            row.method,
                                            row.route,
                                            row.httpStatus,
                                            row.source,
                                        ].join('|')}
                                    >
                                        <td>
                                            {row.method} {row.route}
                                        </td>
                                        <td>
                                            {row.httpStatus}{' '}
                                            {t('system.diagnostics.codes.' + row.httpStatus, {
                                                defaultValue: '',
                                            })}
                                        </td>
                                        <td>{row.source === 'ALB' ? 'ALB' : 'Backend'}</td>
                                        <td>{number.format(row.requests)}</td>
                                        <td>{time.format(new Date(row.lastSeen))}</td>
                                    </tr>
                                ))}
                                {!errors?.length && (
                                    <tr>
                                        <td colSpan={5}>{label('noErrors')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <header className="system-panel-heading">
                        <h3>{label('slowest')}</h3>
                    </header>
                    <div className="system-table-scroll">
                        <table className="system-log-table monitoring-log-table">
                            <thead>
                                <tr>
                                    {['route', 'count', 'avg', 'p95'].map((key) => (
                                        <th key={key}>{label(key)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {report.slowest.map((row) => (
                                    <tr key={row.method + row.route}>
                                        <td>
                                            {row.method} {row.route}
                                        </td>
                                        <td>{number.format(row.requests)}</td>
                                        <td>{ms(row.averageMs)}</td>
                                        <td>{ms(row.p95Ms)}</td>
                                    </tr>
                                ))}
                                {!report.slowest.length && (
                                    <tr>
                                        <td colSpan={4}>{label('noTiming')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}
