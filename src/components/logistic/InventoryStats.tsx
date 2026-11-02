import { Boxes, Check, Clock3, X } from 'lucide-react';
import { useLogistics } from './LogisticsModel.tsx';

export default function InventoryStats() {
    const { inventory, language } = useLogistics();
    const active = inventory.filter(item => item.onHand > item.reserved).length;
    const unavailable = inventory.length - active;
    const reserved = inventory.reduce((sum, item) => sum + item.reserved, 0);
    const data = [
        {label:language==='vi'?'Tổng mã SKU theo dõi':'Tracked SKUs', value:inventory.length, description:'Tất cả mặt hàng tại kho duy nhất MVP', icon:Boxes, tone:'cream'},
        {label:language==='vi'?'Đủ tồn kho bán':'Available to sell',value:active, description:'Lượng có thể bán (Available > 0)', icon:Check, tone:'green'},
        {label:language==='vi'?'Đang giữ cho Order':'Reserved for orders', value:reserved,description:'Đơn vị đang ở trạng thái RESERVED',icon:Clock3,tone:'yellow'},
        {label:language==='vi'?'Hết hàng (Available = 0)':'Out of stock',value:unavailable, description:'Tự động gắn nhãn Hết hàng trên Card',icon:X,tone:'pink'},
    ];
    return <div className="lg-stats">{data.map(item=><div className="lg-stat" key={item.label}><div className="lg-stat-top"><strong>{item.label}</strong><span className={`lg-stat-icon lg-stat-icon--${item.tone}`}><item.icon size={17}/></span></div><div className="lg-stat-value">{String(item.value).padStart(2,'0')}</div><p>{item.description}</p></div>)}</div>;
}
