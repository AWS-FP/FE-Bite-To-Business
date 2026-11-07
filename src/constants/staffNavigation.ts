import { ClipboardList, Megaphone, Package, TicketPercent, Truck, Warehouse, LayoutDashboard, WandSparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import type { StaffRole } from '@/types/admin/staff';

interface StaffWorkspace {
    label: string;
    title: string;
    roleLabel: string;
    items: { path: string; label: string; icon: LucideIcon }[];
}

export const STAFF_WORKSPACES: Record<StaffRole, StaffWorkspace> = {
    ECOMMERCE_EXECUTIVE: {
        label: 'ecommerce.workspace',
        title: 'ecommerce.title',
        roleLabel: 'ecommerce.role',
        items: [
            { path: ROUTES.ECOMMERCE_DASHBOARD, label: 'ecommerceDashboard', icon: LayoutDashboard },
            { path: ROUTES.ECOMMERCE_QUOTES, label: 'ecommerceQuotes', icon: ClipboardList },
            { path: ROUTES.ECOMMERCE_PRODUCTS, label: 'navigation.products', icon: Package },
            { path: ROUTES.ECOMMERCE_PROMOTIONS, label: 'navigation.promotions', icon: Megaphone },
            { path: ROUTES.ECOMMERCE_COUPONS, label: 'navigation.coupons', icon: TicketPercent },
            { path: ROUTES.ECOMMERCE_POSTER, label: 'ecommercePoster', icon: WandSparkles },
        ],
    },
    LOGISTICS_STAFF: {
        label: 'logistics.workspace',
        title: 'logistics.title',
        roleLabel: 'logistics.role',
        items: [
            { path: ROUTES.LOGISTICS_INVENTORY, label: 'navigation.inventory', icon: Warehouse },
            {
                path: ROUTES.LOGISTICS_PRODUCT_REQUESTS,
                label: 'navigation.productRequests',
                icon: ClipboardList,
            },
        ],
    },
    DELIVERY_STAFF: {
        label: 'delivery.workspace',
        title: 'delivery.title',
        roleLabel: 'delivery.role',
        items: [{ path: ROUTES.DELIVERY_TRIPS, label: 'navigation.trips', icon: Truck }],
    },
};
