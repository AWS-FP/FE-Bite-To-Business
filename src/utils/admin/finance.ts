import type { FinanceReport } from '@/types/admin/finance';

export function exportFinanceReport(report: FinanceReport) {
    const rows = [
        [
            'date',
            'collected_vnd',
            'refunded_vnd',
            'net_collected_vnd',
            'completed_order_amount_vnd',
            'completed_orders',
        ],
        ...report.periods.map((row) => [
            row.date,
            row.collected,
            row.refunded,
            row.netCollected,
            row.completedAmount,
            row.completedOrders,
        ]),
    ];
    const csv = rows
        .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
        .join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-${report.from}-${report.to}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
