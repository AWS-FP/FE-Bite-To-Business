import { Check, CircleCheck, X } from 'lucide-react';
import { useEffect } from 'react';
import { DEMO_DRIVER } from '../../constants/shipper/deliveryDemo';
import { useDelivery } from './DeliveryModel.tsx';

export default function CompletionDialog() {
    const { confirmationOpen, setConfirmationOpen, trip, completeTrip, language } = useDelivery();
    useEffect(() => {
        if (!confirmationOpen) return;
        function onKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') setConfirmationOpen(false); }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [confirmationOpen, setConfirmationOpen]);
    if (!confirmationOpen || !trip) return null;
    return <div className="dl-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmationOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="delivery-confirm-title" className="dl-modal">
            <div className="dl-modal-top"><span className="dl-modal-check"><Check size={19}/></span><button type="button" aria-label="Đóng" className="dl-icon-button" onClick={() => setConfirmationOpen(false)}><X size={17}/></button></div>
            <h2 id="delivery-confirm-title">{language === 'vi' ? `Xác nhận hoàn tất chuyến giao #${trip.orderCode}?` : `Complete delivery #${trip.orderCode}?`}</h2>
            <p className="dl-modal-sub">{language === 'vi' ? `Toàn bộ các kiện hàng (${trip.packages.map((p) => p.id).join(', ')}) sẽ chuyển sang trạng thái DELIVERED và đơn hàng chuyển sang COMPLETED.` : 'All packages will be marked delivered and the order marked completed.'}</p>
            <div className="dl-modal-driver"><span>TÀI XẾ ĐƯỢC PHÂN CÔNG XÁC NHẬN</span><strong>{DEMO_DRIVER.name} ({DEMO_DRIVER.employeeCode}) · Idempotency Key: CMP-512</strong><small>DEMO · Chỉ cập nhật dữ liệu trên trình duyệt</small></div>
            <div className="dl-modal-note"><CircleCheck size={15}/><p>Customer không cần xác nhận qua email. Hệ thống thực tế sẽ cần backend cấp nhận hoàn tất sớm hoặc trễ ETA dựa trên thời gian giao hàng.</p></div>
            <div className="dl-modal-actions"><button type="button" className="dl-btn" onClick={() => setConfirmationOpen(false)}>Hủy</button><button type="button" className="dl-btn dl-btn--primary" onClick={completeTrip}><Check size={15}/> Xác nhận hoàn tất đơn hàng</button></div>
        </section>
    </div>;
}
