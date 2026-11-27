import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getApplicationLogs } from '@/services/admin/systemService';
import { useAuthStore } from '@/store/admin/authStore';

export default function SystemLogPanel({ hours }: { hours: number }) {
    const { t, i18n } = useTranslation('admin');
    const session = useAuthStore((state) => state.session);
    const version = useAuthStore((state) => state.sessionVersion);
    const query = useQuery({
        queryKey: ['admin', session?.user.id, version, 'applicationLogs', hours],
        queryFn: ({ signal }) => getApplicationLogs(hours, signal),
        enabled: session?.user.role === 'ADMIN',
        refetchInterval: (q) => q.state.data?.status === 'LOADING' ? 3000 : 60_000,
        retry: false,
    });
    const result = query.data;
    const status = query.isError ? 'UNAVAILABLE' : result?.status ?? 'LOADING';
    const format = (time: string) => {
        const normalized = time.includes('T') ? time : time.replace(' ', 'T') + 'Z';
        const value = new Date(normalized);
        return Number.isNaN(value.getTime()) ? time : value.toLocaleString(i18n.language, { timeZone: 'Asia/Ho_Chi_Minh' });
    };
    return (
        <section className="system-panel overflow-hidden">
            <header className="system-panel-heading"><div><h2>{t('system.monitoring.applicationLogs')}</h2><p>{t('system.monitoring.applicationLogsHint')}</p></div></header>
            {status !== 'AVAILABLE' ? <p className="system-empty-state" role="status">{t(`system.monitoring.logStatus.${status}`)}</p> :
                result?.entries.length ? <div className="max-h-[480px] overflow-auto p-5"><ol className="m-0 space-y-2 p-0 list-none">{result.entries.map((entry, index) =>
                    <li key={`${entry.time}-${index}`} className="grid gap-1 rounded-lg border border-store-line bg-slate-50 px-4 py-3 text-xs sm:grid-cols-[150px_1fr]"><time className="font-semibold text-store-muted">{format(entry.time)}</time><span className="break-words font-mono leading-relaxed text-store-ink">{entry.message}</span></li>
                )}</ol></div> : <p className="system-empty-state">{t('system.monitoring.noApplicationLogs')}</p>}
        </section>
    );
}
