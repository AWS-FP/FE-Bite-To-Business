import { CircleCheck, MapPin, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useDelivery } from './DeliveryModel.tsx';
import SidebarCollapseButton from '@/components/common/SidebarCollapseButton';

type Props = { open: boolean; onClose: () => void; isCollapsed: boolean; onToggleCollapse: () => void };

export function DeliveryMenuButton({ onClick }: { onClick: () => void }) {
    return <button className="dl-mobile-menu" type="button" aria-label="Mở menu" onClick={onClick}><Menu size={21} /></button>;
}

export default function DeliverySidebar({ open, onClose, isCollapsed, onToggleCollapse }: Props) {
    const { language } = useDelivery();
    return <>
        {open && <button className="dl-sidebar-backdrop" type="button" aria-label="Đóng menu" onClick={onClose} />}
        <aside id="delivery-sidebar" className={`dl-sidebar ${open ? 'dl-sidebar--open' : ''}`}>
            <div className="dl-brand">
                <Link to={ROUTES.HOME} onClick={onClose} aria-label="Về trang chủ" className="flex min-h-[98px] items-center gap-2 py-3 text-inherit no-underline">
                    <img src="/images/storefront/brand-logo.png" alt="" width={88} height={68} className="block w-[88px] shrink-0 object-contain" />
                    <span className="brand-name flex flex-col text-[24px] leading-[28.8px] tracking-[-0.3px]"><span>Bite to</span><span>Business</span></span>
                </Link>
                <button className="dl-sidebar-close" type="button" aria-label="Đóng menu" onClick={onClose}><X size={19}/></button>
            </div>
            <p className="dl-sidebar-caption">● {language === 'vi' ? 'KHÔNG GIAN LÀM VIỆC' : 'WORKSPACE'}</p>
            <nav className="dl-nav" aria-label="Delivery Staff navigation">
                <p className="dl-nav-heading">{language === 'vi' ? 'QUẢN LÝ CHUYẾN GIAO' : 'TRIP MANAGEMENT'}</p>
                <NavLink to={ROUTES.DELIVERY_TRIPS} end onClick={onClose} title={language === 'vi' ? 'Đơn hàng giao nhận' : 'Delivery orders'} aria-label={language === 'vi' ? 'Đơn hàng giao nhận' : 'Delivery orders'} className={({isActive}) => `dl-nav-link ${isActive ? 'dl-nav-link--active' : ''}`}>
                    <MapPin size={16}/><span>{language === 'vi' ? 'Đơn hàng giao nhận' : 'Delivery orders'}</span>
                </NavLink>
                <NavLink to={ROUTES.DELIVERY_HISTORY} onClick={onClose} title={language === 'vi' ? 'Lịch sử chuyến giao' : 'Delivery history'} aria-label={language === 'vi' ? 'Lịch sử chuyến giao' : 'Delivery history'} className={({isActive}) => `dl-nav-link ${isActive ? 'dl-nav-link--active' : ''}`}>
                    <CircleCheck size={16}/><span>{language === 'vi' ? 'Lịch sử chuyến giao' : 'Delivery history'}</span>
                </NavLink>
            </nav>
            <div className="staff-sidebar-bottom mt-auto border-t border-black px-4 py-4">
                <div className="ml-auto w-fit"><SidebarCollapseButton sidebarId="delivery-sidebar" isCollapsed={isCollapsed} onToggle={onToggleCollapse} /></div>
            </div>
        </aside>
    </>;
}
