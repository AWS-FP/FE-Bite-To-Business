import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LogisticsSidebar from '../../components/logistic/LogisticsSidebar.tsx';
import LogisticsTopbar from '../../components/logistic/LogisticsTopbar.tsx';
import { LogisticsProvider } from '../../components/logistic/LogisticsModel.tsx';
import ReceiveDrawer from '../../components/logistic/ReceiveDrawer.tsx';
import DispatchDrawer from '../../components/logistic/DispatchDrawer.tsx';
import SourcingReplyDrawer from '../../components/logistic/SourcingReplyDrawer.tsx';
import '../../components/logistic/logistics.css';

function Workspace() {
    const [open, setOpen] = useState(false);
    return <div className="lg-workspace"><LogisticsSidebar open={open} onClose={()=>setOpen(false)}/><div className="lg-main-wrapper"><LogisticsTopbar onOpenMenu={()=>setOpen(true)}/><main id="logistics-main" className="lg-main"><div className="lg-demo-note">DEMO FRONTEND · Dữ liệu mẫu, chưa đồng bộ hệ thống kho thực tế</div><Outlet/></main></div><ReceiveDrawer/><DispatchDrawer/><SourcingReplyDrawer/></div>;
}
export default function LogisticsLayout() { return <LogisticsProvider><Workspace/></LogisticsProvider>; }
