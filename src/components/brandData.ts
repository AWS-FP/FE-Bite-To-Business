/** Dữ liệu trình diễn giao diện (mock). Không có API, không xác nhận tồn kho/giá thật. */
export type BrandTheme = 'rose' | 'orange' | 'blue' | 'indigo' | 'teal';

export interface Brand {
    slug: string;
    shortName: string;
    name: string;
    tagline: string;
    description: string;
    theme: BrandTheme;
    specialty: string;
    benefits: string[];
}

export interface BrandProduct {
    id: string;
    brandSlug: string;
    name: string;
    category: string;
    description: string;
    price: number;
    unit: string;
    pack: string;
    badge: string;
}

export const BRANDS: Brand[] = [
    {
        slug: 'meatdeli', shortName: 'MD', name: 'MeatDeli',
        tagline: 'Thịt sạch chuẩn Âu',
        description: 'Tươi ngon mỗi ngày · Truy xuất rõ ràng. Chọn thịt theo nhu cầu nhà hàng và bếp ăn.',
        theme: 'rose', specialty: 'Thịt heo mát & thực phẩm sơ chế',
        benefits: ['Quy cách cắt phù hợp bếp', 'Thông tin nguồn gốc rõ ràng', 'Phù hợp nhà hàng và bếp ăn'],
    },
    {
        slug: 'cp', shortName: 'C.P', name: 'C.P. Việt Nam',
        tagline: 'Thực phẩm & gia cầm',
        description: 'Nhóm nguyên liệu gia cầm và thực phẩm chế biến cho vận hành bếp chuyên nghiệp.',
        theme: 'orange', specialty: 'Thịt gà, thịt heo & đồ chế biến',
        benefits: ['Đa dạng quy cách', 'Phù hợp bếp suất ăn', 'Dễ chọn theo nhu cầu'],
    },
    {
        slug: 'anchor', shortName: 'AN', name: 'Anchor Dairy NZ',
        tagline: 'Bơ sữa & phô mai',
        description: 'Các nhóm nguyên liệu từ sữa dành cho quán cà phê, tiệm bánh và nhà hàng.',
        theme: 'blue', specialty: 'Bơ, sữa, kem & phô mai',
        benefits: ['Đa dạng nhóm bơ sữa', 'Phù hợp ngành bánh', 'Dễ phân loại nguyên liệu'],
    },
    {
        slug: 'barilla', shortName: 'BI', name: 'Barilla Italia',
        tagline: 'Mỳ Ý & sốt Âu',
        description: 'Lựa chọn nguyên liệu phong cách Ý cho bếp Âu và nhà hàng.',
        theme: 'indigo', specialty: 'Mì pasta & sốt',
        benefits: ['Nhiều loại pasta', 'Phù hợp nhà hàng Âu', 'Dễ kết hợp thực đơn'],
    },
    {
        slug: 'vinh-hoan', shortName: 'VH', name: 'Vĩnh Hoàn Corp',
        tagline: 'Cá tra & hải sản',
        description: 'Nhóm sản phẩm thủy sản phù hợp bếp nhà hàng và bếp ăn số lượng lớn.',
        theme: 'teal', specialty: 'Cá & thủy sản',
        benefits: ['Đa dạng nhóm cá', 'Dễ chọn quy cách', 'Phù hợp nhiều mô hình bếp'],
    },
];

export const BRAND_PRODUCTS: BrandProduct[] = [
    { id: 'md-1', brandSlug: 'meatdeli', name: 'Thịt Ba Rọi Heo Mát Cắt Lát', category: 'Thịt heo mát', description: 'Cắt lát tiện lợi, bảo quản mát chuẩn thịt sạch.', price: 158000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'BÁN CHẠY SỐ 1' },
    { id: 'md-2', brandSlug: 'meatdeli', name: 'Nạc Vai Heo Mát Không Xương', category: 'Thịt heo mát', description: 'Thớ thịt mềm, phù hợp bếp ăn và nhà hàng.', price: 176000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'CHUẨN MEATDELI' },
    { id: 'md-3', brandSlug: 'meatdeli', name: 'Sườn Non Heo Mát Tuyển Chọn', category: 'Thịt heo mát', description: 'Đóng gói định lượng, sẵn sàng cho mọi món ngon.', price: 189000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'ƯU ĐÃI B2B' },
    { id: 'md-4', brandSlug: 'meatdeli', name: 'Thăn Ngoại Heo Mát', category: 'Thịt heo mát', description: 'Tham khảo cho các món áp chảo.', price: 172000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'CHO BẾP ĂN' },
    { id: 'md-5', brandSlug: 'meatdeli', name: 'Nạc Dăm Heo Mát', category: 'Thịt heo mát', description: 'Lựa chọn nguyên liệu theo bếp.', price: 165000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'GỢI Ý' },
    { id: 'cp-1', brandSlug: 'cp', name: 'Ức Gà Phi Lê Không Da', category: 'Gia cầm tươi', description: 'Phi lê sẵn, tiết kiệm thời gian sơ chế tại bếp.', price: 118000, unit: 'kg', pack: 'Đóng gói tham khảo: 2kg', badge: 'BẾP CHỌN' },
    { id: 'cp-2', brandSlug: 'cp', name: 'Xúc Xích Tiệt Trùng', category: 'Thực phẩm chế biến', description: 'Tiện lợi cho quầy ăn nhanh và buffet.', price: 68000, unit: 'gói', pack: 'Đóng gói tham khảo: 500g', badge: 'TIỆN LỢI' },
    { id: 'cp-3', brandSlug: 'cp', name: 'Đùi Gà Góc Tư', category: 'Gia cầm tươi', description: 'Lựa chọn phổ biến cho bếp suất ăn.', price: 96000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'SẢN PHẨM CHỌN' },
    { id: 'an-1', brandSlug: 'anchor', name: 'Bơ Lạt Làm Bánh', category: 'Bơ sữa', description: 'Nguyên liệu dùng cho tiệm bánh và bếp Âu.', price: 135000, unit: 'hộp', pack: 'Quy cách tham khảo: 250g', badge: 'TIỆM BÁNH CHỌN' },
    { id: 'an-2', brandSlug: 'anchor', name: 'Kem Whipping', category: 'Bơ sữa', description: 'Thành phần lý tưởng cho món tráng miệng.', price: 98000, unit: 'hộp', pack: 'Quy cách tham khảo: 1L', badge: 'PHỔ BIẾN' },
    { id: 'an-3', brandSlug: 'anchor', name: 'Phô Mai Chế Biến', category: 'Bơ sữa', description: 'Thêm lựa chọn cho món nướng và món Âu.', price: 126000, unit: 'gói', pack: 'Quy cách tham khảo: 500g', badge: 'NGUYÊN LIỆU BẾP' },
    { id: 'bi-1', brandSlug: 'barilla', name: 'Mì Ý Spaghetti', category: 'Mì pasta', description: 'Pasta sợi dài cho bếp nhà hàng.', price: 54000, unit: 'gói', pack: 'Quy cách tham khảo: 500g', badge: 'BẾP ÂU CHỌN' },
    { id: 'bi-2', brandSlug: 'barilla', name: 'Mì Penne', category: 'Mì pasta', description: 'Dạng ống phù hợp món pasta sốt kem.', price: 57000, unit: 'gói', pack: 'Quy cách tham khảo: 500g', badge: 'PHỔ BIẾN' },
    { id: 'bi-3', brandSlug: 'barilla', name: 'Sốt Cà Chua Pasta', category: 'Sốt Âu', description: 'Giải pháp nhanh cho món pasta nhà hàng.', price: 73000, unit: 'lọ', pack: 'Quy cách tham khảo: 400g', badge: 'GỢI Ý' },
    { id: 'vh-1', brandSlug: 'vinh-hoan', name: 'Phi Lê Cá Tra Đông Lạnh', category: 'Cá & hải sản', description: 'Cắt phi lê, tiện lợi cho vận hành bếp.', price: 89000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'ĐƯỢC CHỌN' },
    { id: 'vh-2', brandSlug: 'vinh-hoan', name: 'Cá Tra Cắt Khúc', category: 'Cá & hải sản', description: 'Phù hợp nhiều món ăn truyền thống.', price: 69000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'GỢI Ý' },
    { id: 'vh-3', brandSlug: 'vinh-hoan', name: 'Cá Tra Tẩm Gia Vị', category: 'Thực phẩm chế biến', description: 'Tiết kiệm công sơ chế cho bếp.', price: 105000, unit: 'gói', pack: 'Quy cách tham khảo: 1kg', badge: 'TIỆN LỢI' },

    { id: 'cp-4', brandSlug: 'cp', name: 'Cánh Gà Giữa', category: 'Gia cầm tươi', description: 'Nguyên liệu cho các món chiên nướng.', price: 109000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'BẾP CHỌN' },
    { id: 'cp-5', brandSlug: 'cp', name: 'Thịt Heo Xay', category: 'Thịt heo', description: 'Phù hợp chế biến món bếp.', price: 124000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'MẪU' },
    { id: 'an-4', brandSlug: 'anchor', name: 'Phô Mai Mozzarella', category: 'Bơ sữa', description: 'Cho món nướng và pizza.', price: 148000, unit: 'gói', pack: 'Quy cách tham khảo: 500g', badge: 'TIỆM BÁNH' },
    { id: 'an-5', brandSlug: 'anchor', name: 'Sữa Tươi Nguyên Kem', category: 'Bơ sữa', description: 'Dùng cho pha chế và làm bánh.', price: 48000, unit: 'hộp', pack: 'Quy cách tham khảo: 1L', badge: 'GỢI Ý' },
    { id: 'bi-4', brandSlug: 'barilla', name: 'Mì Ý Fusilli', category: 'Mì pasta', description: 'Pasta xoắn cho món sốt.', price: 62000, unit: 'gói', pack: 'Quy cách tham khảo: 500g', badge: 'BẾP ÂU' },
    { id: 'bi-5', brandSlug: 'barilla', name: 'Sốt Pesto', category: 'Sốt Âu', description: 'Gợi ý cho thực đơn pasta.', price: 115000, unit: 'lọ', pack: 'Quy cách tham khảo: 190g', badge: 'GỢI Ý' },
    { id: 'vh-4', brandSlug: 'vinh-hoan', name: 'Cá Tra Cắt Miếng', category: 'Cá & hải sản', description: 'Phục vụ các món ăn bếp.', price: 93000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'MẪU' },
    { id: 'vh-5', brandSlug: 'vinh-hoan', name: 'Cá Tra Phi Lê Tẩm Bột', category: 'Thực phẩm chế biến', description: 'Tham khảo món chiên tiện lợi.', price: 107000, unit: 'gói', pack: 'Quy cách tham khảo: 1kg', badge: 'TIỆN LỢI' },
];

export const RELATED_PRODUCTS: BrandProduct[] = [
    { id: 'related-1', brandSlug: 'cp', name: 'Xương Đuôi Heo Đông Lạnh', category: 'Thịt heo đông lạnh', description: 'Dùng cho món nước, hầm và nước dùng.', price: 305000, unit: 'thùng', pack: 'Quy cách tham khảo: 5kg', badge: 'SẢN PHẨM BẠN XEM' },
    { id: 'related-2', brandSlug: 'cp', name: 'Ức Gà Phi Lê Không Da', category: 'Gia cầm tươi', description: 'Tiện lợi khi sơ chế tại bếp.', price: 118000, unit: 'kg', pack: 'Quy cách tham khảo: 2kg', badge: 'BẾP CHỌN' },
    { id: 'related-3', brandSlug: 'cp', name: 'Xúc Xích Tiệt Trùng', category: 'Thực phẩm chế biến', description: 'Gợi ý cho quầy ăn nhanh và buffet.', price: 68000, unit: 'gói', pack: 'Quy cách tham khảo: 500g', badge: 'TIỆN LỢI' },

    { id: 'related-4', brandSlug: 'cp', name: 'Đùi Gà Góc Tư', category: 'Gia cầm tươi', description: 'Lựa chọn tham khảo cho bếp ăn.', price: 96000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'BẾP CHỌN' },
    { id: 'related-5', brandSlug: 'meatdeli', name: 'Nạc Dăm Heo Mát', category: 'Thịt heo mát', description: 'Gợi ý bổ sung cho thực đơn.', price: 165000, unit: 'kg', pack: 'Quy cách tham khảo: 1kg', badge: 'GỢI Ý' },
];

export const formatBrandPrice = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
export const getBrandBySlug = (slug: string | undefined) => BRANDS.find((brand) => brand.slug === slug);
export const getBrandProducts = (slug: string) => BRAND_PRODUCTS.filter((product) => product.brandSlug === slug);
