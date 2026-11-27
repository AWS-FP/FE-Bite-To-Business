import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExecutiveConfirmationProvider from '@/components/e-commerce/ExecutiveConfirmationProvider';
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
export default function LogisticsLayout() {
    const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false }, mutations: { retry: false } } }));
    return <QueryClientProvider client={client}><ExecutiveConfirmationProvider><Workspace/></ExecutiveConfirmationProvider></QueryClientProvider>;
}
