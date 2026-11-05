/** Dữ liệu MINH HỌA theo screenshot Figma. Thay bằng API catalog khi backend sẵn sàng. */
export type CategoryId =
    | 'meat' | 'seafood' | 'eggs' | 'vegetables' | 'fruit' | 'grains'
    | 'noodles' | 'nuts' | 'dairy' | 'vegetarian' | 'seasoning'
    | 'prepared' | 'bakery' | 'beverages';

export interface CategoryInfo {
    id: CategoryId;
    name: string;
    count: number;
    caption: string;
    subcategories: readonly string[];
    image: string | null;
    emoji: string;
    tint: string;
    objectPosition?: string;
}

export interface CategoryProduct {
    id: string;
    categoryId: CategoryId;
    name: string;
    group: string;
    sku: string;
    price: number | null;
    image: string | null;
    unit: string;
}

/** Các số lượng trong danh mục là số liệu trình bày thiết kế, chưa xác minh từ API. */
export const CATEGORIES: readonly CategoryInfo[] = [
    { id: 'meat', name: 'Thịt và gia cầm', count: 26, caption: 'Thịt heo · Thịt bò', subcategories: ['Thịt heo', 'Thịt bò', 'Thịt gà', 'Thịt vịt'], image: null, emoji: '', tint: '#f7d6c1' },
    { id: 'seafood', name: 'Cá và hải sản', count: 25, caption: 'Cá · Tôm/Cua', subcategories: ['Cá', 'Tôm/Cua', 'Mực/Bạch tuộc', 'Hải sản khô'], image: null, emoji: '', tint: '#cfeaf0' },
    { id: 'eggs', name: 'Các loại trứng', count: 20, caption: 'Trứng cút · Trứng gà', subcategories: ['Trứng gà', 'Trứng vịt', 'Trứng cút', 'Trứng chế biến'], image: null, emoji: '', tint: '#f4e9d2' },
    { id: 'vegetables', name: 'Rau, củ và nấm', count: 80, caption: 'Rau củ tươi · Nấm', subcategories: ['Rau lá', 'Rau củ', 'Các loại nấm', 'Rau gia vị'], image: null, emoji: '', tint: '#d9eace' },
    { id: 'fruit', name: 'Trái cây', count: 20, caption: 'Trái cây theo mùa · Trái cây nhập khẩu', subcategories: ['Trái cây theo mùa', 'Trái cây nhập khẩu', 'Trái cây sơ chế'], image: null, emoji: '', tint: '#ffe2c3', objectPosition: '78% center' },
    { id: 'grains', name: 'Gạo, ngũ cốc và bột', count: 64, caption: 'Gạo · Bột các loại', subcategories: ['Gạo', 'Bột', 'Ngũ cốc', 'Đậu khô'], image: null, emoji: '', tint: '#ebdcae' },
    { id: 'noodles', name: 'Bún, mì và pasta', count: 20, caption: 'Mì · Nui', subcategories: ['Bún', 'Mì', 'Pasta', 'Miến'], image: null, emoji: '', tint: '#e5d6c3' },
    { id: 'nuts', name: 'Đậu và các loại hạt', count: 20, caption: 'Đậu · Hạt', subcategories: ['Đậu hạt', 'Hạt dinh dưỡng', 'Ngũ cốc hạt'], image: null, emoji: '', tint: '#e3d4b6' },
    { id: 'dairy', name: 'Sữa và các sản phẩm từ sữa', count: 28, caption: 'Bơ · Phô mai', subcategories: ['Sữa', 'Bơ', 'Phô mai', 'Kem sữa'], image: null, emoji: '', tint: '#eee9dc' },
    { id: 'vegetarian', name: 'Đậu phụ và đồ chay', count: 12, caption: 'Đậu hũ tươi · Đồ chay đóng gói', subcategories: ['Đậu hũ', 'Đồ chay', 'Nấm chế biến'], image: null, emoji: '', tint: '#d8e6cc' },
    { id: 'seasoning', name: 'Dầu ăn, gia vị và sốt', count: 20, caption: 'Dầu ăn · Sốt', subcategories: ['Dầu ăn', 'Gia vị', 'Các loại sốt', 'Nước chấm'], image: null, emoji: '', tint: '#eed5bd' },
    { id: 'prepared', name: 'Thực phẩm chế biến và đồ hộp', count: 16, caption: 'Ngô & bắp · Thịt hộp', subcategories: ['Đồ hộp', 'Thực phẩm đông lạnh', 'Đồ chế biến sẵn'], image: null, emoji: '', tint: '#dfd3c3' },
    { id: 'bakery', name: 'Bánh và tráng miệng', count: 7, caption: 'Bánh quy & crackers · Nguyên liệu tráng miệng', subcategories: ['Bánh', 'Bánh quy', 'Tráng miệng'], image: null, emoji: '', tint: '#ffe14d' },
    { id: 'beverages', name: 'Đồ uống và pha chế', count: 30, caption: 'Nước ngọt · Nước uống tạo vị', subcategories: ['Nước giải khát', 'Siro', 'Nguyên liệu pha chế'], image: null, emoji: '', tint: '#f4d1a1' },
];

/** 6 sản phẩm demo ở danh mục đầu bám theo ảnh thiết kế; các danh mục khác có dữ liệu xem trước. */
const MEAT_PRODUCTS: readonly CategoryProduct[] = [
    { id: 'meat-01', categoryId: 'meat', group: 'THỊT HEO', name: 'Ba Chỉ Heo Mát Chuẩn Khay 500g', sku: 'PORK-BELLY-CHL-500G', price: 90000, unit: '/ khay', image: null },
    { id: 'meat-02', categoryId: 'meat', group: 'THỊT HEO', name: 'Nạc Vai Heo Sạch Chân Không 1kg', sku: 'PORK-SHOULDER-CHL-1KG', price: 150000, unit: '/ kg', image: null },
    { id: 'meat-03', categoryId: 'meat', group: 'THỊT HEO', name: 'Nạc Đùi Heo Hút Chân Không 1kg', sku: 'PORK-LEG-CHL-1KG', price: 160000, unit: '/ kg', image: null },
    { id: 'meat-04', categoryId: 'meat', group: 'THỊT HEO', name: 'Sườn Non Heo Cắt Khúc Nhập Khẩu Thùng 10kg', sku: 'PORK-RIBS-FROZEN-10KG', price: 4000000, unit: '/ thùng', image: null },
    { id: 'meat-05', categoryId: 'meat', group: 'THỊT HEO', name: 'Thịt Heo Xay Mát Chuẩn BRC Khay 400g', sku: 'PORK-MINCE-BRC-400G', price: 40000, unit: '/ khay', image: null },
    { id: 'meat-06', categoryId: 'meat', group: 'THỊT HEO', name: 'Chân Giò Heo Rút Xương Cuộn Lưới 1kg', sku: 'PORK-HOCK-1KG', price: 143000, unit: '/ kg', image: null },
];

const PREVIEW_NAMES: Record<Exclude<CategoryId, 'meat'>, readonly string[]> = {
    seafood: ['Cá biển tươi theo ngày', 'Tôm bóc vỏ đông lạnh', 'Mực ống làm sạch', 'Cá phi lê cấp đông', 'Cua biển phân loại', 'Hải sản tổng hợp'],
    eggs: ['Trứng gà tươi', 'Trứng vịt tươi', 'Trứng cút', 'Trứng gà đóng khay', 'Trứng vịt đóng hộp', 'Trứng cút đóng gói'],
    vegetables: ['Rau cải tươi', 'Cà chua', 'Cà rốt', 'Khoai tây', 'Nấm tươi', 'Rau gia vị'],
    fruit: ['Cam tươi', 'Táo nhập khẩu', 'Chuối chín', 'Dưa hấu', 'Ổi tươi', 'Trái cây theo mùa'],
    grains: ['Gạo thơm', 'Gạo trắng', 'Bột mì', 'Bột gạo', 'Yến mạch', 'Ngũ cốc tổng hợp'],
    noodles: ['Bún tươi', 'Mì trứng', 'Nui khô', 'Pasta', 'Miến dong', 'Bánh phở'],
    nuts: ['Đậu xanh', 'Đậu đỏ', 'Đậu nành', 'Hạt điều', 'Hạt sen', 'Hạt dinh dưỡng'],
    dairy: ['Sữa tươi', 'Sữa đặc', 'Bơ lạt', 'Phô mai', 'Kem sữa', 'Sữa chua'],
    vegetarian: ['Đậu hũ non', 'Đậu hũ trắng', 'Chả chay', 'Nấm chế biến', 'Đồ chay đông lạnh', 'Rau củ sơ chế'],
    seasoning: ['Dầu ăn', 'Nước mắm', 'Nước tương', 'Tương ớt', 'Sốt cà chua', 'Gia vị tổng hợp'],
    prepared: ['Cá hộp', 'Thịt hộp', 'Ngô hộp', 'Đậu hộp', 'Đồ ăn sơ chế', 'Thực phẩm đóng gói'],
    bakery: ['Bánh mì', 'Bánh quy', 'Bánh croissant', 'Bánh ngọt', 'Nguyên liệu làm bánh', 'Tráng miệng'],
    beverages: ['Nước trái cây', 'Trà đóng chai', 'Nước giải khát', 'Siro trái cây', 'Cà phê pha chế', 'Nước khoáng'],
};

export function getPreviewProducts(category: CategoryInfo): readonly CategoryProduct[] {
    if (category.id === 'meat') return MEAT_PRODUCTS;
    return PREVIEW_NAMES[category.id].map((name, index) => ({
        id: `${category.id}-${String(index + 1).padStart(2, '0')}`,
        categoryId: category.id,
        group: category.name.toLocaleUpperCase('vi'),
        name,
        sku: `DEMO-${category.id.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
        price: null, // không tự bịa giá cho những nhóm chưa có trong ảnh
        unit: '',
        image: category.image,
    }));
}

export const DISPLAY_PRODUCT_TOTAL = '385+'; // Theo banner Figma, KHÔNG phải số liệu API.
