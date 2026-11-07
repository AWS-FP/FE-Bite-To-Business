import { useState } from 'react';
import { useAuthStore } from '@/store/admin/authStore';
import {
    initialEcommerceData,
    type EcommerceData,
    type EcommerceCampaign,
    type EcommerceCoupon,
    type EcommerceProduct,
} from './ecommerceData';

// Dữ liệu demo theo tài khoản, không kết nối backend và không sửa data thực.
function readData(key: string): EcommerceData {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return initialEcommerceData();
        const saved: unknown = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
            const data = saved as Partial<EcommerceData>;
            if (Array.isArray(data.products) && Array.isArray(data.campaigns) && Array.isArray(data.coupons)) {
                return data as EcommerceData;
            }
        }
    } catch { /* localStorage không khả dụng */ }
    return initialEcommerceData();
}

export function useEcommerceData() {
    const userEmail = useAuthStore(state => state.session?.user.email ?? 'guest');
    const key = `btb.ecommerce.ui.v1.${userEmail}`;
    const [data, setData] = useState<EcommerceData>(() => readData(key));

    function write(next: EcommerceData) {
        setData(next);
        try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* demo vẫn dùng được trong phiên */ }
    }

    function updateProducts(updater: (products: EcommerceProduct[]) => EcommerceProduct[]) {
        write({ ...data, products: updater(data.products) });
    }
    function updateCampaigns(updater: (campaigns: EcommerceCampaign[]) => EcommerceCampaign[]) {
        write({ ...data, campaigns: updater(data.campaigns) });
    }
    function updateCoupons(updater: (coupons: EcommerceCoupon[]) => EcommerceCoupon[]) {
        write({ ...data, coupons: updater(data.coupons) });
    }
    function resetDemo() { write(initialEcommerceData()); }

    return { data, updateProducts, updateCampaigns, updateCoupons, resetDemo };
}
