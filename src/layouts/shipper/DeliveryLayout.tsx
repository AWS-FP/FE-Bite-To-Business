import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DeliverySidebar from '../../components/shipper/DeliverySidebar';
import DeliveryTopbar from '../../components/shipper/DeliveryTopbar';
import { DeliveryProvider } from '../../components/shipper/DeliveryModel';
import '../../components/shipper/delivery.css';

function DeliveryWorkspace() {
    const [open, setOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    return <div className={`dl-workspace ${isCollapsed ? 'is-collapsed' : ''}`}>
        <DeliverySidebar open={open} onClose={() => setOpen(false)} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)}/>
        <div className="dl-content-wrap"><DeliveryTopbar onOpenMenu={() => setOpen(true)}/>
            <main id="delivery-main" className="dl-main"><Outlet/></main>
        </div>
    </div>;
}

export default function DeliveryLayout() {
    return <DeliveryProvider><DeliveryWorkspace/></DeliveryProvider>;
}
