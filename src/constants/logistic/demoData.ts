import type { DeliveryOrder, InventoryItem, ProductRequest, StockMovement, StockCategory } from '../../types/logistic/logistics.ts';

export const CATEGORY_NAMES: Record<StockCategory, string> = {
    seafood: 'Cá và hải sản',
    vegetables: 'Rau củ và nấm',
    dairy: 'Sữa & SP từ sữa',
    meat: 'Thịt và gia cầm',
};
export const DEMO_INVENTORY: InventoryItem[] = [
    {sku:'MDF-FISH-SALMONFILLET-CH-1KG',name:'Cá Hồi Na Uy Phi Lê Tươi Trim C',category:'seafood',unit:'kg',moq:1,onHand:150,reserved:30},
    {sku:'HNM-FISH-TUNASAKU-FZ-500G',name:'Cá Ngừ Đại Dương Cắt Khối Saku 500g',category:'seafood',unit:'khay',moq:3,onHand:12,reserved:12},
    {sku:'MPC-SHRIMP-BLACKTIGER-HOSO-FZ-1KG',name:'Tôm Sú Sinh Thái Nguyên Con Minh Phú',category:'seafood',unit:'hộp',moq:5,onHand:80,reserved:40},
    {sku:'KAM-VEG-CABBAGE-SHRED-1KG',name:'Bắp Cải Trắng Cắt Sợi Kamereo 1kg',category:'vegetables',unit:'gói',moq:1,onHand:120,reserved:25},
    {sku:'ANC-DAI-BUTTER-25KG',name:'Bơ Lạt Anchor New Zealand Khối 25kg',category:'dairy',unit:'thùng',moq:1,onHand:22,reserved:4},
    {sku:'PAC-BEEF-STRIPLOIN-CH-1KG',name:'Thăn Ngoại Bò Mát Nguyên Khối Pacow',category:'meat',unit:'kg',moq:2,onHand:45,reserved:6},
];
export const DEMO_MOVEMENTS: StockMovement[] = [
    {id:'MOV-2026-904',kind:'RECEIVE',sku:DEMO_INVENTORY[0].sku,name:DEMO_INVENTORY[0].name,quantity:50,actor:'Trần Đức Minh (NV-002)',time:'23/10/2026 05:15',note:'Lô hàng Air Freight sáng sớm đạt chuẩn QC'},
    {id:'MOV-2026-903',kind:'RESERVE',sku:DEMO_INVENTORY[2].sku,name:DEMO_INVENTORY[2].name,quantity:20,actor:'Hệ thống (Order Confirm)',time:'23/10/2026 07:30',note:'Giữ đủ 100% hàng cho đơn #ORD-2026-518'},
    {id:'MOV-2026-902',kind:'RELEASE',sku:DEMO_INVENTORY[3].sku,name:DEMO_INVENTORY[3].name,quantity:15,actor:'Hệ thống (Order Cancel)',time:'22/10/2026 19:10',note:'Khách hủy Order #ORD-2026-509 trước khi chuyển bắt đầu'},
];
export const DEMO_ORDERS: DeliveryOrder[] = [
    {id:'ORD-2026-518',customer:'Công ty TNHH Green Table',customerId:'KH-1017',packageCount:2,destinations:'02 điểm đến (Thủ Đức, Q.1)',note:'Chia khay 1kg, lót giấy thấm Sashimi',status:'PREPARING'},
    {id:'ORD-2026-512',customer:'HTX Nông sản Xanh',customerId:'KH-1021',packageCount:2,destinations:'02 điểm đến (Q.1, Q.3)',note:'Bắp cải để thùng riêng tránh dập lá',status:'IN_DELIVERY',assignedTo:'Lê Hoàng Long (NV-003)'},
    {id:'ORD-2026-509',customer:'Công ty CP Bếp Nhà',customerId:'KH-1019',packageCount:1,destinations:'01 điểm đến (Q.7)',note:'Không có ghi chú',status:'RELEASED'},
    {id:'ORD-2026-523',customer:'Nhà hàng The Garden',customerId:'KH-1034',packageCount:3,destinations:'01 điểm đến (Bình Thạnh)',note:'Kiểm tra nhiệt độ từng kiện',status:'WAITING'},
];
export const DEMO_REQUESTS: ProductRequest[] = [
    {id:'SR-026',customer:'Trần Minh Khang',business:'Công ty TNHH An Nhiên',customerId:'KH-1023',email:'minhkhang.tran@gmail.com',product:'Bơ Lạt Anchor New Zealand Khối 25kg',note:'Cần nhập đều 4 thùng/tuần làm bánh Croissant',status:'PENDING'},
    {id:'SR-025',customer:'Đỗ Quốc Bảo',business:'Công ty TNHH Green Table',customerId:'KH-1017',email:'quocbao.do@gmail.com',product:'Cồi Sò Điệp Nhật Bản Hokkaido Khay 1kg',note:'Size 20-30 cồi/kg chuẩn Sashimi',status:'SENT',reply:'Sản phẩm có thể cung ứng theo lịch đặt trước. Vui lòng xác nhận nhu cầu.'},
    {id:'SR-024',customer:'Nguyễn Thảo Vy',business:'Bếp Xanh Việt',customerId:'KH-1032',email:'thaovy.nguyen@gmail.com',product:'Nấm Hương Tươi Hữu Cơ 500g',note:'Ưu tiên giao vào sáng thứ Hai và thứ Năm',status:'PENDING'},
];
