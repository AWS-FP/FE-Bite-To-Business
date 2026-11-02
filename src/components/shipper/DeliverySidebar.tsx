import { CircleCheck, MapPin, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useDelivery } from './DeliveryModel.tsx';

type Props = { open: boolean; onClose: () => void };

export function DeliveryMenuButton({ onClick }: { onClick: () => void }) {
    return <button className="dl-mobile-menu" type="button" aria-label="Mở menu" onClick={onClick}><Menu size={21} /></button>;
}

export default function DeliverySidebar({ open, onClose }: Props) {
    const { language, trip } = useDelivery();
    return <>
        {open && <button className="dl-sidebar-backdrop" type="button" aria-label="Đóng menu" onClick={onClose} />}
        <aside className={`dl-sidebar ${open ? 'dl-sidebar--open' : ''}`}>
            <div className="dl-brand"><div className="dl-brand-mark">BTB</div><strong>Bite to<br/>Business</strong>
                <button className="dl-sidebar-close" type="button" aria-label="Đóng menu" onClick={onClose}><X size={19}/></button>
            </div>
            <p className="dl-sidebar-caption">● {language === 'vi' ? 'KHÔNG GIAN GIAO NHẬN' : 'DELIVERY WORKSPACE'}</p>
            <nav className="dl-nav" aria-label="Delivery Staff navigation">
                <p className="dl-nav-heading">{language === 'vi' ? 'QUẢN LÝ CHUYẾN GIAO' : 'TRIP MANAGEMENT'}</p>
                <NavLink to={ROUTES.DELIVERY_TRIPS} end onClick={onClose} className={({isActive}) => `dl-nav-link ${isActive ? 'dl-nav-link--active' : ''}`}>
                    <MapPin size={16}/><span>{language === 'vi' ? 'Chuyến giao hiện tại' : 'Current delivery'}</span><b>{trip ? '01' : '00'}</b>
                </NavLink>
                <NavLink to={ROUTES.DELIVERY_HISTORY} onClick={onClose} className={({isActive}) => `dl-nav-link ${isActive ? 'dl-nav-link--active' : ''}`}>
                    <CircleCheck size={16}/><span>{language === 'vi' ? 'Lịch sử chuyến giao' : 'Delivery history'}</span><b>{String(trip ? 14 : 15).padStart(2, '0')}</b>
                </NavLink>
            </nav>
            <p className="dl-sidebar-footer">DELIVERY STAFF · FRONTEND DEMO</p>
        </aside>
    </>;
}
