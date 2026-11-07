export type ProductState = 'active' | 'draft' | 'hidden';
export type DiscountType = 'percent' | 'fixed';
export type CampaignState = 'draft' | 'active' | 'paused';
export type CouponState = 'active' | 'paused';

export interface EcommerceProduct {
    id: string;
    sku: string;
    name: string;
    brand: string;
    category: string;
    unit: string;
    price: number;
    stock: number;
    state: ProductState;
    description: string;
    updatedAt: string;
    moq?: number;
    step?: number;
    volumeTiers?: { min: number; price: number }[];
}

export interface EcommerceCampaign {
    id: string;
    name: string;
    description: string;
    type: DiscountType;
    value: number;
    startDate: string;
    endDate: string;
    state: CampaignState;
    scope: 'all' | 'selected';
    productIds: string[];
}

export interface EcommerceCoupon {
    id: string;
    code: string;
    description: string;
    type: DiscountType;
    value: number;
    minOrder: number;
    maxDiscount: number;
    usageLimit: number;
    used: number;
    startDate: string;
    endDate: string;
    state: CouponState;
}

export interface EcommerceData {
    products: EcommerceProduct[];
    campaigns: EcommerceCampaign[];
    coupons: EcommerceCoupon[];
}

export const CATEGORIES = ['Thực phẩm tươi', 'Đồ uống', 'Nguyên liệu khô', 'Bao bì & dụng cụ', 'Bánh & tráng miệng'];

const seedProducts: EcommerceProduct[] = [
    { id: 'p001', sku: 'BTB-FRESH-001', name: 'Rau xà lách thủy canh', brand: 'Green Farm', category: 'Thực phẩm tươi', unit: 'kg', price: 35000, stock: 135, state: 'active', description: 'Xà lách phục vụ bếp ăn, giá tính theo kg.', updatedAt: '2026-11-06' },
    { id: 'p002', sku: 'BTB-BEV-002', name: 'Cà phê Cold Brew Cam', brand: 'Bite Drinks', category: 'Đồ uống', unit: 'chai 500ml', price: 46000, stock: 54, state: 'active', description: 'Đồ uống pha sẵn, bảo quản lạnh.', updatedAt: '2026-11-06' },
    { id: 'p003', sku: 'BTB-DRY-003', name: 'Gạo Jasmine cao cấp', brand: 'Đồng Lúa', category: 'Nguyên liệu khô', unit: 'bao 5kg', price: 169000, stock: 18, state: 'active', description: 'Gạo thơm dành cho nhà hàng.', updatedAt: '2026-11-05' },
    { id: 'p004', sku: 'BTB-BOX-004', name: 'Hộp bã mía 2 ngăn', brand: 'EcoPack', category: 'Bao bì & dụng cụ', unit: 'lốc 50 cái', price: 125000, stock: 75, state: 'active', description: 'Bao bì thân thiện môi trường.', updatedAt: '2026-11-04' },
    { id: 'p005', sku: 'BTB-CAKE-005', name: 'Bánh mì sandwich ngũ cốc', brand: 'Fresh Bake', category: 'Bánh & tráng miệng', unit: 'túi 12 lát', price: 42000, stock: 0, state: 'active', description: 'Sản phẩm dùng trong các suất ăn.', updatedAt: '2026-11-02' },
    { id: 'p006', sku: 'BTB-FRESH-006', name: 'Cà chua bi hữu cơ', brand: 'Green Farm', category: 'Thực phẩm tươi', unit: 'kg', price: 78000, stock: 26, state: 'active', description: 'Nguồn nguyên liệu tươi cho nhà hàng.', updatedAt: '2026-11-02' },
    { id: 'p007', sku: 'BTB-DRY-007', name: 'Bột ca cao nguyên chất', brand: 'Cacao House', category: 'Nguyên liệu khô', unit: 'gói 500g', price: 125000, stock: 12, state: 'draft', description: 'Sản phẩm chuẩn bị đăng bán.', updatedAt: '2026-11-01' },
    { id: 'p008', sku: 'BTB-BEV-008', name: 'Nước ép cam cà rốt', brand: 'Bite Drinks', category: 'Đồ uống', unit: 'chai 350ml', price: 39000, stock: 89, state: 'active', description: 'Nước ép đóng chai.', updatedAt: '2026-10-30' },
    { id: 'p009', sku: 'BTB-BOX-009', name: 'Bộ muỗng nĩa gỗ', brand: 'EcoPack', category: 'Bao bì & dụng cụ', unit: 'hộp 100 bộ', price: 96000, stock: 40, state: 'hidden', description: 'Tạm ẩn khỏi gian hàng.', updatedAt: '2026-10-28' },
];

const seedCampaigns: EcommerceCampaign[] = [
    { id: 'ca-01', name: 'Tuần lễ nguyên liệu xanh', description: 'Ưu đãi cho nhóm nguyên liệu tươi sạch.', type: 'percent', value: 12, startDate: '2026-11-01', endDate: '2026-11-16', state: 'active', scope: 'selected', productIds: ['p001', 'p006'] },
    { id: 'ca-02', name: 'Ưu đãi bếp mới', description: 'Đồng hành cùng nhà hàng bắt đầu kinh doanh.', type: 'percent', value: 10, startDate: '2026-11-11', endDate: '2026-12-01', state: 'active', scope: 'all', productIds: [] },
    { id: 'ca-03', name: 'Combo đồ uống cuối tuần', description: 'Khuyến mãi riêng cho nhóm đồ uống.', type: 'fixed', value: 15000, startDate: '2026-10-15', endDate: '2026-11-02', state: 'paused', scope: 'selected', productIds: ['p002', 'p008'] },
    { id: 'ca-04', name: 'Tháng bao bì bền vững', description: 'Ưu đãi với sản phẩm bao bì sinh thái.', type: 'percent', value: 8, startDate: '2026-12-01', endDate: '2026-12-31', state: 'draft', scope: 'selected', productIds: ['p004', 'p009'] },
];

const seedCoupons: EcommerceCoupon[] = [
    { id: 'co-01', code: 'BTBWELCOME', description: 'Ưu đãi cho đơn hàng đầu tiên', type: 'percent', value: 10, minOrder: 300000, maxDiscount: 100000, usageLimit: 200, used: 72, startDate: '2026-10-01', endDate: '2026-12-31', state: 'active' },
    { id: 'co-02', code: 'FREESHIP50', description: 'Giảm 50.000đ cho đơn đủ điều kiện', type: 'fixed', value: 50000, minOrder: 500000, maxDiscount: 0, usageLimit: 100, used: 49, startDate: '2026-11-01', endDate: '2026-11-30', state: 'active' },
    { id: 'co-03', code: 'BEPXANH', description: 'Ưu đãi dành cho khách hàng thực phẩm xanh', type: 'percent', value: 7, minOrder: 350000, maxDiscount: 80000, usageLimit: 80, used: 23, startDate: '2026-11-05', endDate: '2026-12-15', state: 'active' },
    { id: 'co-04', code: 'SAVE20K', description: 'Mã dùng thử đã tạm dừng', type: 'fixed', value: 20000, minOrder: 150000, maxDiscount: 0, usageLimit: 60, used: 15, startDate: '2026-10-01', endDate: '2026-11-30', state: 'paused' },
    { id: 'co-05', code: 'SUMMERBTB', description: 'Chương trình đã kết thúc', type: 'percent', value: 5, minOrder: 200000, maxDiscount: 30000, usageLimit: 120, used: 120, startDate: '2026-06-01', endDate: '2026-08-31', state: 'active' },
];

export function initialEcommerceData(): EcommerceData {
    return {
        products: seedProducts.map(p => ({ ...p })),
        campaigns: seedCampaigns.map(c => ({ ...c, productIds: [...c.productIds] })),
        coupons: seedCoupons.map(c => ({ ...c })),
    };
}

export const money = (value: number) => `${Math.round(value).toLocaleString('vi-VN')} ₫`;
export const shortDate = (date: string) => date ? date.split('-').reverse().join('/') : '—';

export function effectiveCampaignState(c: EcommerceCampaign): 'draft' | 'scheduled' | 'active' | 'paused' | 'ended' {
    if (c.state === 'draft') return 'draft';
    if (c.state === 'paused') return 'paused';
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
    if (c.endDate < today) return 'ended';
    if (c.startDate > today) return 'scheduled';
    return 'active';
}

export function effectiveCouponState(c: EcommerceCoupon): 'active' | 'paused' | 'scheduled' | 'ended' | 'exhausted' {
    if (c.state === 'paused') return 'paused';
    if (c.usageLimit > 0 && c.used >= c.usageLimit) return 'exhausted';
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
    if (c.endDate < today) return 'ended';
    if (c.startDate > today) return 'scheduled';
    return 'active';
}

export function newId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function toCsv(headers: string[], rows: (string | number)[][], fileName: string) {
    const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const content = '\uFEFF' + [headers, ...rows].map(row => row.map(escape).join(',')).join('\r\n');
    const objectUrl = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
}
