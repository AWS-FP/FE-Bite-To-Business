import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LogisticsSidebar from '../../components/logistic/LogisticsSidebar.tsx';
import LogisticsTopbar from '../../components/logistic/LogisticsTopbar.tsx';
import '../../components/logistic/logistics.css';

function Workspace() {
    const [open, setOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    return <div className={`lg-workspace ${isCollapsed ? 'is-collapsed' : ''}`}><LogisticsSidebar open={open} onClose={()=>setOpen(false)} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)}/><div className="lg-main-wrapper"><LogisticsTopbar onOpenMenu={()=>setOpen(true)}/><main id="logistics-main" className="lg-main"><Outlet/></main></div></div>;
}
export default function LogisticsLayout() { return <Workspace/>; }
