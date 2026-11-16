import { CircleCheck, MapPin, Menu } from 'lucide-react';
import WorkspaceSidebar from '@/layouts/WorkspaceSidebar';
import { ROUTES } from '@/router/routes';
import { useDelivery } from './DeliveryModel';

interface Props {
    open: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export function DeliveryMenuButton({ onClick }: { onClick: () => void }) {
    return <button className="dl-mobile-menu" type="button" aria-label="Mở menu" onClick={onClick}><Menu size={21} /></button>;
}

export default function DeliverySidebar({ open, onClose, isCollapsed, onToggleCollapse }: Props) {
    const { language } = useDelivery();
    const vietnamese = language === 'vi';

    return (
        <>
            {open && <button className="dl-sidebar-backdrop" type="button" aria-label="Đóng menu" onClick={onClose} />}
            <WorkspaceSidebar
                sidebarId="delivery-sidebar"
                className={`dl-shared-sidebar ${open ? 'dl-shared-sidebar--open' : ''}`}
                workspaceLabel={vietnamese ? 'KHÔNG GIAN LÀM VIỆC' : 'WORKSPACE'}
                logoSrc="/images/storefront/brand-logo.png"
                isCollapsed={isCollapsed}
                onToggleCollapse={onToggleCollapse}
                onNavigate={onClose}
                groups={[
                    {
                        label: vietnamese ? 'QUẢN LÝ CHUYẾN GIAO' : 'TRIP MANAGEMENT',
                        items: [
                            { path: ROUTES.DELIVERY_TRIPS, label: vietnamese ? 'Đơn hàng giao nhận' : 'Delivery orders', icon: <MapPin size={18} /> },
                            { path: ROUTES.DELIVERY_HISTORY, label: vietnamese ? 'Lịch sử chuyến giao' : 'Delivery history', icon: <CircleCheck size={18} /> },
                        ],
                    },
                ]}
            />
        </>
    );
}
