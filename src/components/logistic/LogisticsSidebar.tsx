import { Box, Mail, Menu, PackagePlus } from 'lucide-react';
import WorkspaceSidebar from '@/layouts/WorkspaceSidebar';
import { ROUTES } from '@/router/routes';
import { useTranslation } from 'react-i18next';

interface Props {
    open: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function LogisticsSidebar({ open, onClose, isCollapsed, onToggleCollapse }: Props) {
    const { i18n } = useTranslation();
    const vietnamese = i18n.resolvedLanguage !== 'en';

    return (
        <>
            {open && <button type="button" className="lg-sidebar-backdrop" aria-label={vietnamese ? 'Đóng menu' : 'Close menu'} onClick={onClose} />}
            <WorkspaceSidebar
                sidebarId="logistics-sidebar"
                className={`lg-shared-sidebar ${open ? 'lg-shared-sidebar--open' : ''}`}
                workspaceLabel={vietnamese ? 'KHÔNG GIAN LÀM VIỆC' : 'WORKSPACE'}
                isCollapsed={isCollapsed}
                onToggleCollapse={onToggleCollapse}
                onNavigate={onClose}
                groups={[
                    {
                        label: vietnamese ? 'QUẢN LÝ KHO & TỒN KHO' : 'WAREHOUSE & INVENTORY',
                        items: [
                            { path: ROUTES.LOGISTICS_INVENTORY, label: vietnamese ? 'Sổ cái tồn kho' : 'Inventory ledger', icon: <Box size={18} /> },
                            { path: ROUTES.LOGISTICS_RECEIVE, label: vietnamese ? 'Nhập kho trực tiếp' : 'Receive stock', icon: <PackagePlus size={18} /> },
                            { path: ROUTES.LOGISTICS_CREATE_PRODUCT, label: vietnamese ? 'Thêm sản phẩm' : 'Add product', icon: <PackagePlus size={18} /> },
                        ],
                    },
                    {
                        label: vietnamese ? 'ĐIỀU PHỐI & YÊU CẦU KHÁCH' : 'DISPATCH & REQUESTS',
                        items: [
                            { path: ROUTES.LOGISTICS_PRODUCT_REQUESTS, label: vietnamese ? 'Yêu cầu thêm SP' : 'Product requests', icon: <Mail size={18} /> },
                        ],
                    },
                ]}
            />
        </>
    );
}

export function LogisticsMenuButton({ onClick }: { onClick: () => void }) {
    const { i18n } = useTranslation();
    return <button type="button" className="lg-mobile-menu lg-icon-button" aria-label={i18n.resolvedLanguage === 'en' ? 'Open menu' : 'Mở menu'} onClick={onClick}><Menu size={22} /></button>;
}
