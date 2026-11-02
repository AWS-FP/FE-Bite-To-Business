import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DeliverySidebar from '../../components/shipper/DeliverySidebar';
import DeliveryTopbar from '../../components/shipper/DeliveryTopbar';
import CompletionDialog from '../../components/shipper/CompletionDialog';
import { DeliveryProvider } from '../../components/shipper/DeliveryModel';
import '../../components/shipper/delivery.css';

function DeliveryWorkspace() {
    const [open, setOpen] = useState(false);
    return <div className="dl-workspace">
        <DeliverySidebar open={open} onClose={() => setOpen(false)}/>
        <div className="dl-content-wrap"><DeliveryTopbar onOpenMenu={() => setOpen(true)}/>
            <main id="delivery-main" className="dl-main"><Outlet/></main>
        </div>
        <CompletionDialog/>
    </div>;
}

export default function DeliveryLayout() {
    return <DeliveryProvider><DeliveryWorkspace/></DeliveryProvider>;
}
