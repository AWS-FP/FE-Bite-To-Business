import { SectionHeading } from '../../components/shipper/DeliveryUI';
import { useDelivery } from '../../components/shipper/DeliveryModel';

export default function DeliveryHistoryPage() {
    const { language } = useDelivery();
    return <>
        <SectionHeading number="02" eyebrow={language === 'vi' ? 'NHẬT KÝ HOÀN TẤT THỰC TẾ' : 'DELIVERY COMPLETION LOG'}
            title={language === 'vi' ? 'Lịch sử chuyến giao' : 'Delivery history'} />
        <p>Chức năng xác nhận giao và lịch sử giao hàng đang được hoàn thiện.</p>
    </>;
}
