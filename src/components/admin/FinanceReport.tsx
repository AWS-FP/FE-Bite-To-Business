import TableSkeleton from '@/components/common/TableSkeleton';
import Skeleton from '@/components/common/Skeleton';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Download,
    Info,
    RefreshCw,
    Wallet,
    CircleHelp,
} from 'lucide-react';
import './FinanceReport.css';
import AdminButton from './AdminButton';
import type { FinanceFilters, FinancePage } from '@/types/admin/finance';
import { useFinanceReports } from '@/hooks/admin/useFinanceReports';
import { exportFinanceReport } from '@/utils/admin/finance';

function initialFilters(): FinanceFilters {
    const today = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date());
    return { from: today.slice(0, 8) + '01', to: today, group: 'day' };
}

export default function FinanceReport() {
    const { t, i18n } = useTranslation('admin');
    const label = (key: string) => t(`system.finance.${key}`);
    const [filters, setFilters] = useState(initialFilters);
    const [draft, setDraft] = useState(filters);
    const [basis, setBasis] = useState('payments');
    const [errors, setErrors] = useState<Partial<Record<'from' | 'to' | 'customerId', string>>>({});
    const [page, setPage] = useState(0);
    const [customerPage, setCustomerPage] = useState(0);
    const [kind, setKind] = useState('ALL');
    const [status, setStatus] = useState('ALL');
    const { report, transactions, customers } = useFinanceReports(
        filters,
        page,
        customerPage,
        kind,
        status,
    );
    const money = (value: number | null | undefined) =>
        value == null
            ? '—'
            : new Intl.NumberFormat(i18n.language, {
                  style: 'currency',
                  currency: 'VND',
                  maximumFractionDigits: 0,
              }).format(value);
    const busy = report.isFetching || transactions.isFetching || customers.isFetching;

    function apply(event: FormEvent) {
        event.preventDefault();
        const days = (Date.parse(draft.to) - Date.parse(draft.from)) / 86_400_000;
        const nextErrors: typeof errors = {};
        if (!draft.from) nextErrors.from = label('requiredDate');
        if (!draft.to) nextErrors.to = label('requiredDate');
        if (draft.from && draft.to && (!Number.isFinite(days) || days < 0))
            nextErrors.to = label('invalidRange');
        if (days > 365) nextErrors.to = label('longRange');
        if (
            draft.customerId &&
            !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(draft.customerId)
        ) {
            nextErrors.customerId = label('invalidCustomer');
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        setFilters({ ...draft, customerId: draft.customerId || undefined });
        setPage(0);
        setCustomerPage(0);
    }

    function selectRange(days?: number) {
        const range = initialFilters();
        if (days) {
            const start = new Date(range.to + 'T00:00:00Z');
            start.setUTCDate(start.getUTCDate() - days + 1);
            range.from = start.toISOString().slice(0, 10);
        }
        setDraft({ ...draft, from: range.from, to: range.to });
        setErrors({});
    }

    function filterCustomer(customerId?: string) {
        const next = { ...filters, customerId };
        setFilters(next);
        setDraft(next);
        setErrors({});
        setPage(0);
        setCustomerPage(0);
    }

    function exportCsv() {
        if (!report.data || report.isError) return;
        exportFinanceReport(report.data);
    }

    const summary = report.data?.summary;
    const cards = [
        ['collected', summary?.collected, ArrowDownLeft],
        ['refunded', summary?.refunded, ArrowUpRight],
        ['netCollected', summary?.netCollected, Wallet],
        ['openReviewAmount', summary?.openReviewAmount, CircleHelp],
    ] as const;

    return (
        <section className="finance-report" aria-label={t('system.reports.title')}>
            <div className="system-section-toolbar">
                <div>
                    <h2>{t('system.reports.title')}</h2>
                </div>
                <AdminButton
                    busy={busy}
                    onClick={() => {
                        void report.refetch();
                        void transactions.refetch();
                        void customers.refetch();
                    }}
                >
                    <RefreshCw size={16} />
                    {t('system.refresh')}
                </AdminButton>
            </div>
            <details className="finance-info">
                <summary>
                    <Info size={15} aria-hidden="true" />
                    {label('reportInfo')}
                </summary>
                <div>
                    <p>{label('scope')}</p>
                    <p>{label('dateHint')}</p>
                    <p>{label('transactionHint')}</p>
                </div>
            </details>
            <form noValidate className="system-panel finance-filters" onSubmit={apply}>
                <div className="finance-presets" role="group" aria-label={label('quickRange')}>
                    <button type="button" onClick={() => selectRange(7)}>
                        {label('last7')}
                    </button>
                    <button type="button" onClick={() => selectRange(30)}>
                        {label('last30')}
                    </button>
                    <button type="button" onClick={() => selectRange()}>
                        {label('thisMonth')}
                    </button>
                </div>
                <div className="system-form-body system-report-filters">
                    <label>
                        {t('system.filters.from')}
                        <input
                            type="date"
                            aria-invalid={!!errors.from}
                            aria-describedby={errors.from ? 'finance-from-error' : undefined}
                            value={draft.from}
                            onChange={(event) => setDraft({ ...draft, from: event.target.value })}
                        />
                        {errors.from && (
                            <span
                                id="finance-from-error"
                                className="finance-field-error"
                                role="alert"
                            >
                                {errors.from}
                            </span>
                        )}
                    </label>
                    <label>
                        {t('system.filters.to')}
                        <input
                            type="date"
                            aria-invalid={!!errors.to}
                            aria-describedby={errors.to ? 'finance-to-error' : undefined}
                            value={draft.to}
                            onChange={(event) => setDraft({ ...draft, to: event.target.value })}
                        />
                        {errors.to && (
                            <span
                                id="finance-to-error"
                                className="finance-field-error"
                                role="alert"
                            >
                                {errors.to}
                            </span>
                        )}
                    </label>
                    <label>
                        {t('system.filters.group')}
                        <select
                            value={draft.group}
                            onChange={(event) => setDraft({ ...draft, group: event.target.value })}
                        >
                            {['day', 'week', 'month'].map((group) => (
                                <option value={group} key={group}>
                                    {t(`system.filters.${group}`)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span className="finance-customer-label">
                            {label('customerId')}
                            {draft.customerId && (
                                <button type="button" onClick={() => filterCustomer()}>
                                    {label('clearCustomer')}
                                </button>
                            )}
                        </span>
                        <input
                            aria-invalid={!!errors.customerId}
                            aria-describedby={
                                errors.customerId ? 'finance-customer-error' : undefined
                            }
                            value={draft.customerId ?? ''}
                            onChange={(event) =>
                                setDraft({ ...draft, customerId: event.target.value.trim() })
                            }
                        />
                        {errors.customerId && (
                            <span
                                id="finance-customer-error"
                                className="finance-field-error"
                                role="alert"
                            >
                                {errors.customerId}
                            </span>
                        )}
                    </label>
                </div>

                <footer className="system-panel-footer">
                    <span className="finance-period">
                        {filters.from} — {filters.to} · VND
                    </span>
                    <div className="system-button-row">
                        <AdminButton type="submit">{label('apply')}</AdminButton>
                        <AdminButton
                            onClick={exportCsv}
                            disabled={!report.data || report.isError || report.isFetching}
                        >
                            <Download size={16} />
                            {t('system.reports.export')}
                        </AdminButton>
                    </div>
                </footer>
            </form>
            {report.isError && (
                <p role="alert" className="system-notice system-notice-warning">
                    {label('loadError')}
                    {report.data && <> {label('stale')}</>}
                </p>
            )}

            <div className="system-metric-grid">
                {cards.map(([name, value, Icon]) => (
                    <article
                        key={name}
                        className={`system-metric-card finance-metric ${name === 'netCollected' ? 'finance-metric-net' : ''}`}
                    >
                        <div className="system-metric-label">
                            <span>{label(name)}</span>
                            <Icon size={20} aria-hidden="true" />
                        </div>
                        <strong>{report.isPending ? <Skeleton className="h-8 w-32"/> : money(value)}</strong>
                    </article>
                ))}
            </div>
            {summary && (
                <dl className="finance-counts">
                    {[
                        ['orders', summary.orders],
                        ['completedOrders', summary.completedOrders],
                        ['cancelledOrders', summary.cancelledOrders],
                        ['openReviews', summary.openReviewCount],
                    ].map(([name, value]) => (
                        <div key={name}>
                            <dt>{label(String(name))}</dt>
                            <dd>{new Intl.NumberFormat(i18n.language).format(Number(value))}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {report.data && (
                <section className="system-panel">
                    <header className="system-panel-heading">
                        <h2>{label('trend')}</h2>
                        <label>
                            {t('system.reports.basis')}{' '}
                            <select
                                value={basis}
                                onChange={(event) => setBasis(event.target.value)}
                            >
                                <option value="payments">
                                    {t('system.reports.paymentsBasis')}
                                </option>
                                <option value="orders">{t('system.reports.completedBasis')}</option>
                            </select>
                        </label>
                    </header>
                    <div className="finance-chart">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <ComposedChart
                                data={report.data.periods}
                                accessibilityLayer
                                margin={{ left: 20, right: 12 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="var(--color-store-line)"
                                />
                                <XAxis dataKey="date" minTickGap={35} tick={{ fontSize: 11 }} />
                                <YAxis
                                    width={85}
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat(i18n.language, {
                                            notation: 'compact',
                                        }).format(Number(value))
                                    }
                                />
                                <Tooltip
                                    formatter={(value) => money(Number(value))}
                                    contentStyle={{
                                        border: '1px solid var(--color-store-line)',
                                        background: 'var(--color-surface-soft)',
                                        color: 'var(--color-store-ink)',
                                    }}
                                />
                                <Legend />
                                {basis === 'payments' ? (
                                    <>
                                        <Bar
                                            dataKey="collected"
                                            name={label('collected')}
                                            fill="var(--color-store-green)"
                                            maxBarSize={26}
                                            isAnimationActive={false}
                                        />
                                        <Bar
                                            dataKey="refunded"
                                            name={label('refunded')}
                                            fill="var(--color-danger)"
                                            maxBarSize={26}
                                            isAnimationActive={false}
                                        />
                                        <Line
                                            dataKey="netCollected"
                                            name={label('netCollected')}
                                            stroke="var(--color-warning)"
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    </>
                                ) : (
                                    <Bar
                                        dataKey="completedAmount"
                                        name={label('completedAmount')}
                                        fill="var(--color-store-green)"
                                        maxBarSize={26}
                                        isAnimationActive={false}
                                    />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            )}
            <section className="system-panel">
                <header className="system-panel-heading">
                    <h2>{label('transactions')}</h2>
                    <div className="system-button-row">
                        <label>
                            {label('kind')}{' '}
                            <select
                                value={kind}
                                onChange={(event) => {
                                    setKind(event.target.value);
                                    setPage(0);
                                }}
                            >
                                {['ALL', 'PAYMENT', 'REFUND', 'SEPAY_REVIEW'].map((value) => (
                                    <option value={value} key={value}>
                                        {label(value)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            {label('status')}{' '}
                            <select
                                value={status}
                                onChange={(event) => {
                                    setStatus(event.target.value);
                                    setPage(0);
                                }}
                            >
                                {[
                                    'ALL',
                                    'PENDING',
                                    'SUCCESS',
                                    'FAILED',
                                    'CANCELLED',
                                    'EXPIRED',
                                    'REQUESTED',
                                    'APPROVED',
                                    'REJECTED',
                                    'PROCESSING',
                                    'REFUNDED',
                                    'REVIEW',
                                    'RESTORED',
                                    'IGNORED',
                                ].map((value) => (
                                    <option key={value} value={value}>
                                        {label(value)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </header>

                {transactions.isError && <p role="alert">{label('loadError')}</p>}
                {transactions.isPending && <TableSkeleton columns={6} tableClass="system-log-table w-full" />}
                {transactions.data && (
                    <div className="overflow-x-auto">
                        <table className="system-log-table w-full">
                            <thead>
                                <tr>
                                    {['time', 'kind', 'order', 'status', 'amount', 'reference'].map(
                                        (name) => (
                                            <th key={name}>{label(name)}</th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.content.map((row) => (
                                    <tr key={row.kind + row.id}>
                                        <td>
                                            {new Intl.DateTimeFormat(i18n.language, {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                                timeZone: 'Asia/Ho_Chi_Minh',
                                            }).format(new Date(row.time))}
                                        </td>
                                        <td>{label(row.kind)}</td>
                                        <td>{row.orderNumber ?? '—'}</td>
                                        <td>
                                            <span
                                                className="finance-status"
                                                data-status={row.status}
                                            >
                                                {label(row.status)}
                                            </span>
                                        </td>
                                        <td>{money(row.amount)}</td>
                                        <td>{row.reference ?? '—'}</td>
                                    </tr>
                                ))}
                                {!transactions.data.content.length && (
                                    <tr>
                                        <td colSpan={6}>{label('empty')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pager data={transactions.data} busy={transactions.isFetching} onPage={setPage} />
            </section>
            <section className="system-panel">
                <header className="system-panel-heading">
                    <h2>{label('customers')}</h2>
                </header>
                {customers.isError && <p role="alert">{label('loadError')}</p>}
                {customers.isPending && <TableSkeleton columns={5} tableClass="system-log-table w-full" />}
                {customers.data && (
                    <div className="overflow-x-auto">
                        <table className="system-log-table w-full">
                            <thead>
                                <tr>
                                    {[
                                        'customer',
                                        'orders',
                                        'collected',
                                        'refunded',
                                        'netCollected',
                                    ].map((name) => (
                                        <th key={name}>{label(name)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {customers.data.content.map((row) => (
                                    <tr key={row.customerId}>
                                        <td>
                                            <button
                                                type="button"
                                                className="finance-customer-link"
                                                onClick={() => filterCustomer(row.customerId)}
                                                title={label('filterCustomer')}
                                            >
                                                {row.name || row.customerId}
                                            </button>
                                        </td>
                                        <td>{row.orders}</td>
                                        <td>{money(row.collected)}</td>
                                        <td>{money(row.refunded)}</td>
                                        <td>{money(row.netCollected)}</td>
                                    </tr>
                                ))}
                                {!customers.data.content.length && (
                                    <tr>
                                        <td colSpan={5}>{label('empty')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pager data={customers.data} busy={customers.isFetching} onPage={setCustomerPage} />
            </section>
        </section>
    );
}

function Pager({
    data,
    busy,
    onPage,
}: {
    data?: FinancePage<unknown>;
    busy: boolean;
    onPage: (page: number) => void;
}) {
    const { t } = useTranslation('admin');
    if (!data || data.totalPages <= 1) return null;
    return (
        <footer className="system-panel-footer">
            <span>
                {data.page + 1} / {data.totalPages} · {data.totalElements}
            </span>
            <div className="system-button-row">
                <AdminButton
                    disabled={busy || data.page === 0}
                    onClick={() => onPage(data.page - 1)}
                >
                    {t('system.finance.previous')}
                </AdminButton>
                <AdminButton
                    disabled={busy || data.page + 1 >= data.totalPages}
                    onClick={() => onPage(data.page + 1)}
                >
                    {t('system.finance.next')}
                </AdminButton>
            </div>
        </footer>
    );
}
