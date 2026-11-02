import { Check, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeliveryStats from '../../components/shipper/DeliveryStats';
import DeliveryMapPlaceholder from '../../components/shipper/DeliveryMapPlaceholder';
import DeliveryPackageList from '../../components/shipper/DeliveryPackageList';
import { useDelivery } from '../../components/shipper/DeliveryModel';
import { SectionHeading } from '../../components/shipper/DeliveryUI';
import { ROUTES } from '../../router/routes';

export default function CurrentTripPage() {
    const { trip, language, setConfirmationOpen, resetDemo } = useDelivery();
    return <>
        <SectionHeading number="01" eyebrow={language === 'vi' ? 'LỘ TRÌNH & HOÀN TẤT CHUYẾN (MỤC 13.3 & 13.4)' : 'TRIP PROGRESS & COMPLETION'}
            title={language === 'vi' ? 'Chuyến giao được phân công' : 'Assigned delivery trip'}
            description={trip ? `Một chuyến giao tương ứng một Order (#${trip.orderCode}). Sau khi giao thực tế tại tất cả các điểm đến, bấm Hoàn tất đơn hàng.` : 'Chuyến giao demo đã hoàn tất và được chuyển vào lịch sử.'}
            action={<><span className="dl-order-sticker">1 CHUYẾN = 1 ORDER</span>{trip ? <button type="button" className="dl-btn dl-btn--primary dl-btn--large" onClick={() => setConfirmationOpen(true)}><Check size={15}/> Hoàn tất đơn hàng (#{trip.orderCode})</button> : <button type="button" className="dl-btn dl-btn--primary" onClick={resetDemo}><RotateCcw size={15}/> Reset demo</button>}</>}
        />
        {trip ? <><DeliveryStats/><div className="dl-detail-grid"><DeliveryMapPlaceholder/><DeliveryPackageList/></div></>
            : <section className="dl-completed-empty"><div className="dl-completed-icon"><Check size={27}/></div><h2>Đơn hàng đã chuyển sang COMPLETED</h2><p>Trạng thái chỉ được cập nhật trong dữ liệu demo trên trình duyệt.</p><div className="dl-completed-actions"><Link className="dl-btn dl-btn--primary" to={ROUTES.DELIVERY_HISTORY}>Xem lịch sử giao hàng</Link><button className="dl-btn" type="button" onClick={resetDemo}>Tạo lại chuyến demo</button></div></section>}
    </>;
}
