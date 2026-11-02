import { useState } from 'react';
import { Search } from 'lucide-react';
import { useDelivery } from './DeliveryModel.tsx';
import { StatusBadge } from './DeliveryUI.tsx';

export default function DeliveryHistoryTable() {
    const { history, language } = useDelivery();
    const [search, setSearch] = useState('');
    const filtered = history.filter((item) => `${item.orderCode} ${item.customer}`.toLowerCase().includes(search.toLowerCase()));
    return <section className="dl-panel dl-history-panel">
        <div className="dl-history-toolbar"><span>{language === 'vi' ? 'Các chuyến đã hoàn tất' : 'Completed trips'} <b>{history.length}</b></span><label className="dl-history-search"><Search size={15}/><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Tìm đơn giao" placeholder="Tìm mã Order hoặc khách hàng..." /></label></div>
        <div className="dl-table-scroll"><table className="dl-table"><thead><tr>
            <th>Mã Order</th><th>Khách hàng</th><th>Số kiện / Điểm đến</th><th>ETA dự kiến</th><th>Hoàn tất thực tế</th><th>Trạng thái</th>
        </tr></thead><tbody>
            {filtered.map((item) => <tr key={item.id}><td className="dl-table-mono">{item.orderCode}</td><td><strong>{item.customer}</strong></td><td>{String(item.packageCount).padStart(2,'0')} Kiện · {String(item.stopCount).padStart(2,'0')} Điểm đến</td><td>{item.eta}</td><td><strong>{item.completedAt}</strong>{item.differenceMinutes !== 0 && <span className="dl-table-muted"> ({item.differenceMinutes < 0 ? `Sớm ${Math.abs(item.differenceMinutes)}p` : `Trễ ${item.differenceMinutes}p`})</span>}</td><td><StatusBadge>✓ COMPLETED</StatusBadge></td></tr>)}
            {!filtered.length && <tr><td colSpan={6} className="dl-empty">Không tìm thấy chuyến giao nào.</td></tr>}
        </tbody></table></div>
        <p className="dl-history-caption">Lịch sử mẫu — các chuyến mới xác nhận chỉ lưu trên trình duyệt này.</p>
    </section>;
}
