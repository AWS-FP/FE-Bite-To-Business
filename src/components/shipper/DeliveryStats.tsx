import { Box, Clock3, Map, Truck } from 'lucide-react';
import { useDelivery } from './DeliveryModel.tsx';

export default function DeliveryStats() {
    const { language, trip } = useDelivery();
    const stats = [
        { label: language === 'vi' ? 'Số kiện hàng (Packages)' : 'Packages', value: String(trip?.packageCount ?? 0).padStart(2, '0'), foot: language === 'vi' ? 'Tương ứng 02 điểm đến trong chuyến' : 'Delivery stops', icon: Box, tone: 'cream' },
        { label: language === 'vi' ? 'Quãng đường tượng trưng' : 'Estimated distance', value: `${trip?.distanceKm ?? 0}`, unit: 'km', foot: language === 'vi' ? 'Xuất phát từ Kho cố định Landmark 81' : 'From Landmark 81 warehouse', icon: Map, tone: 'yellow' },
        { label: language === 'vi' ? 'ETA trung bình dự kiến' : 'Estimated ETA', value: `${trip?.etaMinutes ?? 0}`, unit: language === 'vi' ? 'phút' : 'min', foot: language === 'vi' ? 'Quãng đường + Vận tốc cố định (Bộ đếm đỏ)' : 'Illustrative ETA only', icon: Clock3, tone: 'green' },
        { label: language === 'vi' ? 'Trạng thái chuyến' : 'Trip status', value: trip ? 'IN_DELIVERY' : 'COMPLETED', foot: language === 'vi' ? 'Có thể hoàn tất sớm hoặc trễ ETA' : 'May finish early or late', icon: Truck, tone: 'pink' },
    ];
    return <div className="dl-stats">{stats.map((stat) => <article key={stat.label} className="dl-stat">
        <div className="dl-stat-head"><b>{stat.label}</b><span className={`dl-stat-icon dl-stat-icon--${stat.tone}`}><stat.icon size={18}/></span></div>
        <div className={`dl-stat-value ${stat.value.length > 9 ? 'dl-stat-value--text' : ''}`}>{stat.value}{stat.unit && <span>{stat.unit}</span>}</div>
        <p>{stat.foot}</p>
    </article>)}</div>;
}
