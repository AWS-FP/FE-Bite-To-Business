import { useDelivery } from './DeliveryModel.tsx';
import { StatusBadge } from './DeliveryUI.tsx';

export default function DeliveryPackageList() {
    const { trip, language } = useDelivery();
    return <section className="dl-panel dl-packages-panel">
        <div className="dl-panel-heading"><div><h2>{language === 'vi' ? 'Chi tiết các kiện hàng (Packages) & Điểm đến' : 'Packages & delivery destinations'} <StatusBadge>{trip?.packageCount ?? 0} kiện</StatusBadge></h2>
            <p>{language === 'vi' ? 'Kiểm tra người nhận, số điện thoại, địa chỉ và ghi chú từng kiện.' : 'Review recipient and delivery instructions for each package.'}</p></div></div>
        {trip?.packages.map((pack) => <article className="dl-package" key={pack.id}>
            <div className="dl-package-header"><span className="dl-stop-number">{String(pack.stopNumber).padStart(2,'0')}</span><div className="dl-package-title"><h3>Kiện #{pack.id} — {pack.destinationName} ({pack.distanceKm} km)</h3><p>Người nhận: <b>{pack.recipient}</b> · SĐT: <b>{pack.phone}</b></p></div><StatusBadge>• Điểm dừng {pack.stopNumber}</StatusBadge></div>
            <div className="dl-package-details"><p><b>Địa chỉ điểm đến:</b> {pack.address}</p><p><b>Sản phẩm & Số lượng:</b> {pack.products}</p><p><b>Ghi chú giao hàng:</b> “{pack.note}”</p></div>
        </article>)}
        {!trip && <p className="dl-empty">Không có kiện hàng đang chờ giao.</p>}
    </section>;
}
