import LogisticsPageShell, { ListStatus, Pagination } from '@/components/logistic/LogisticsPageShell';
import { useLogisticsList, type Stock } from '@/hooks/logistic/useLogisticsData';
export default function InventoryPage() {
    const data = useLogisticsList<Stock>('/api/logistics/inventory');
    return <LogisticsPageShell title="Quản lý tồn kho" description="Theo dõi hàng trong kho, hàng đã giữ và hàng có thể bán."><section className="overflow-x-auto rounded-xl border border-store-line bg-white p-5">
        <ListStatus loading={data.loading} error={data.error} empty={data.items.length === 0} />
        {data.items.length > 0 && <table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Sản phẩm</th><th>Mã SKU</th><th>Trong kho</th><th>Đã giữ</th><th>Có thể bán</th></tr></thead><tbody>{data.items.map(item => <tr key={item.productId} className="border-b"><td className="p-3 font-bold">{item.name}</td><td>{item.sku}</td><td>{item.onHand} {item.unit}</td><td>{item.reserved}</td><td>{item.available}</td></tr>)}</tbody></table>}
        <Pagination {...data} />
    </section></LogisticsPageShell>;
}
