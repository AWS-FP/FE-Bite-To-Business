import { Box, ClipboardList, Mail, Menu, PackagePlus, Truck, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useLogistics } from './LogisticsModel.tsx';

const menu = [
    { path: ROUTES.LOGISTICS_INVENTORY, vi: 'Sổ cái tồn kho', en: 'Inventory ledger', icon: Box, counter: '06', group: 0 },
    { path: ROUTES.LOGISTICS_RECEIVE, vi: 'Nhập kho trực tiếp', en: 'Receive stock', icon: PackagePlus, counter: 'Mới', group: 0 },
    { path: ROUTES.LOGISTICS_PACKING, vi: 'Đóng kiện & Chuyến', en: 'Packing & Dispatch', icon: ClipboardList, counter: '04', group: 1 },
    { path: ROUTES.LOGISTICS_PRODUCT_REQUESTS, vi: 'Yêu cầu thêm SP', en: 'Product requests', icon: Mail, counter: '03', group: 1 },
] as const;

export default function LogisticsSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { language, requests, orders } = useLogistics();
    return <>
        {open && <button type="button" className="lg-sidebar-backdrop" aria-label="Đóng menu" onClick={onClose} />}
        <aside className={`lg-sidebar ${open ? 'lg-sidebar--open' : ''}`}>
            <div className="lg-brand">
                <Link to={ROUTES.HOME} onClick={onClose} aria-label="Về trang chủ" className="flex min-h-[98px] items-center gap-2 py-3 text-inherit no-underline">
                    <img src="/images/storefront/brand-logo.png" alt="" width={88} height={68} className="block w-[88px] shrink-0 object-contain" />
                    <span className="brand-name flex flex-col text-[24px] leading-[28.8px] tracking-[-0.3px]"><span>Bite to</span><span>Business</span></span>
                </Link>
                <button className="lg-sidebar-close" type="button" aria-label="Đóng menu" onClick={onClose}><X size={18}/></button>
            </div>
            <div className="lg-sidebar-caption">● {language === 'vi' ? 'KHÔNG GIAN QUẢN TRỊ' : 'OPERATIONS WORKSPACE'}</div>
            <nav className="lg-nav" aria-label="Logistics navigation">
                <div className="lg-nav-label">{language === 'vi' ? 'QUẢN LÝ KHO & TỒN KHO' : 'WAREHOUSE & INVENTORY'}</div>
                {menu.filter(x=>x.group===0).map(item=><NavLink key={item.path} to={item.path} onClick={onClose} className={({isActive})=>`lg-nav-item ${isActive?'lg-nav-item--active':''}`}><item.icon size={16}/><span>{language === 'vi'?item.vi:item.en}</span><b>{item.counter}</b></NavLink>)}
                <div className="lg-nav-label lg-nav-label--separate">{language === 'vi' ? 'ĐIỀU PHỐI & YÊU CẦU KHÁCH' : 'DISPATCH & REQUESTS'}</div>
                {menu.filter(x=>x.group===1).map(item=><NavLink key={item.path} to={item.path} onClick={onClose} className={({isActive})=>`lg-nav-item ${isActive?'lg-nav-item--active':''}`}><item.icon size={16}/><span>{language==='vi'?item.vi:item.en}</span><b>{item.path === ROUTES.LOGISTICS_PACKING ? String(orders.length).padStart(2,'0') : String(requests.length).padStart(2,'0')}</b></NavLink>)}
            </nav>
            <div className="lg-sidebar-bottom"><Truck size={15}/><span>LOGISTICS STAFF · DEMO UI</span></div>
        </aside>
    </>;
}
export function LogisticsMenuButton({ onClick }: {onClick: () => void}) { return <button type="button" className="lg-mobile-menu lg-icon-button" aria-label="Mở menu" onClick={onClick}><Menu size={22}/></button>; }
