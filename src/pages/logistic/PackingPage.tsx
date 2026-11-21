import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import Pagination from '@/components/common/Pagination';
import LogisticsPageShell, { ListStatus } from '@/components/logistic/LogisticsPageShell';
import { useLogisticsList, type CancelledPackage } from '@/hooks/logistic/useLogisticsData';
export default function PackingPage() {
    const { tr, english } = useLogisticsText();
    const data = useLogisticsList<CancelledPackage>('/api/logistics/cancelled-packages');
    return <LogisticsPageShell number="03" label={tr("Điều phối đơn hàng")} title={tr("Package đã hủy")} description={tr("Theo dõi các package đã được ghi nhận hủy.")}><section className="rounded-xl border border-store-line bg-white p-5">
        <ListStatus loading={data.loading} error={data.error} empty={data.items.length === 0} />
        {data.items.map(item => <article key={item.packageId} className="border-b py-4"><strong>{item.packageName}</strong><p className="mt-1 text-sm text-store-muted">{item.packageNumber} {tr("· Đơn") + ' '}{item.orderId}</p><p className="text-sm">{tr("Hủy lúc") + ' '}{new Date(item.cancelledAt).toLocaleString(english ? 'en-US' : 'vi-VN')}</p></article>)}
        <Pagination page={data.page} totalPages={data.totalPages} loading={data.loading} onPageChange={data.setPage} />
    </section></LogisticsPageShell>;
}
