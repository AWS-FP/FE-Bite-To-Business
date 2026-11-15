import { CircleCheck, MapPin, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useDelivery } from './DeliveryModel.tsx';

type Props = { open: boolean; onClose: () => void };

export function DeliveryMenuButton({ onClick }: { onClick: () => void }) {
    return <button className="dl-mobile-menu" type="button" aria-label="Mở menu" onClick={onClick}><Menu size={21} /></button>;
}

export default function DeliverySidebar({ open, onClose }: Props) {
    const { language } = useDelivery();
    return <>
        {open && <button className="dl-sidebar-backdrop" type="button" aria-label="Đóng menu" onClick={onClose} />}
        <aside className={`dl-sidebar ${open ? 'dl-sidebar--open' : ''}`}>
            <div className="dl-brand">
                <Link to={ROUTES.HOME} onClick={onClose} aria-label="Về trang chủ" className="flex min-h-[98px] items-center gap-2 py-3 text-inherit no-underline">
                    <img src="/images/storefront/brand-logo.png" alt="" width={88} height={68} className="block w-[88px] shrink-0 object-contain" />
                    <span className="brand-name flex flex-col text-[24px] leading-[28.8px] tracking-[-0.3px]"><span>Bite to</span><span>Business</span></span>
                </Link>
                <button className="dl-sidebar-close" type="button" aria-label="Đóng menu" onClick={onClose}><X size={19}/></button>
            </div>
            <p className="dl-sidebar-caption">● {language === 'vi' ? 'KHÔNG GIAN GIAO NHẬN' : 'DELIVERY WORKSPACE'}</p>
            <nav className="dl-nav" aria-label="Delivery Staff navigation">
                <p className="dl-nav-heading">{language === 'vi' ? 'QUẢN LÝ CHUYẾN GIAO' : 'TRIP MANAGEMENT'}</p>
                <NavLink to={ROUTES.DELIVERY_TRIPS} end onClick={onClose} className={({isActive}) => `dl-nav-link ${isActive ? 'dl-nav-link--active' : ''}`}>
                    <MapPin size={16}/><span>{language === 'vi' ? 'Đơn hàng giao nhận' : 'Delivery orders'}</span>
                </NavLink>
                <NavLink to={ROUTES.DELIVERY_HISTORY} onClick={onClose} className={({isActive}) => `dl-nav-link ${isActive ? 'dl-nav-link--active' : ''}`}>
                    <CircleCheck size={16}/><span>{language === 'vi' ? 'Lịch sử chuyến giao' : 'Delivery history'}</span>
                </NavLink>
            </nav>
            <p className="dl-sidebar-footer">DELIVERY STAFF</p>
        </aside>
    </>;
}
