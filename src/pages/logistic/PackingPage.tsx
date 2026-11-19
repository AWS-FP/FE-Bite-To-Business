import Pagination from '@/components/common/Pagination';
import LogisticsPageShell, { ListStatus } from '@/components/logistic/LogisticsPageShell';
import { useLogisticsList, type CancelledPackage } from '@/hooks/logistic/useLogisticsData';
export default function PackingPage() {
    const data = useLogisticsList<CancelledPackage>('/api/logistics/cancelled-packages');
    return <LogisticsPageShell number="03" label="Điều phối đơn hàng" title="Package đã hủy" description="Theo dõi các package đã được ghi nhận hủy."><section className="rounded-xl border border-store-line bg-white p-5">
        <ListStatus loading={data.loading} error={data.error} empty={data.items.length === 0} />
        {data.items.map(item => <article key={item.packageId} className="border-b py-4"><strong>{item.packageName}</strong><p className="mt-1 text-sm text-store-muted">{item.packageNumber} · Đơn {item.orderId}</p><p className="text-sm">Hủy lúc {new Date(item.cancelledAt).toLocaleString('vi-VN')}</p></article>)}
        <Pagination page={data.page} totalPages={data.totalPages} loading={data.loading} onPageChange={data.setPage} />
    </section></LogisticsPageShell>;
}
