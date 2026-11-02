import type { RegistrationStats } from '@/types/admin/registration';

export function exportRegistrationMetrics(
    stats: RegistrationStats,
    labels: {
        metric: string;
        value: string;
        capturedAt: string;
        total: string;
        pending: string;
        approved: string;
        rejected: string;
    },
    updatedAt: number,
) {
    const capturedAt = new Date(updatedAt).toISOString();
    const rows = [
        [labels.metric, labels.value, labels.capturedAt],
        [labels.total, stats.total, capturedAt],
        [labels.pending, stats.pending, capturedAt],
        [labels.approved, stats.approved, capturedAt],
        [labels.rejected, stats.rejected, capturedAt],
    ];
    const csv = rows
        .map((row) =>
            row
                .map((value) => {
                    let text = String(value);
                    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
                    return `"${text.replaceAll('"', '""')}"`;
                })
                .join(','),
        )
        .join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    const date = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(updatedAt));
    link.download = `customer-registrations-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
