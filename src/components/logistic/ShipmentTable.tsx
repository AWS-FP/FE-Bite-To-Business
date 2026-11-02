import { useLogistics } from './LogisticsModel.tsx';
import { Badge, Panel } from './LogisticsUI.tsx';
import type { OrderStatus } from '../../types/logistic/logistics.ts';

const states: Record<OrderStatus,{label:string; tone:'neutral'|'yellow'|'danger'|'blue'}> = {
    PREPARING:{label:'• Chờ đóng kiện (PREPARING)',tone:'neutral'},
    WAITING:{label:'• Chờ xử lý (WAITING)',tone:'yellow'},
    IN_DELIVERY:{label:'• Đang giao (IN_DELIVERY)',tone:'yellow'},
    RELEASED:{label:'• Đã hủy trước xuất (RELEASED)',tone:'danger'},
};
export default function ShipmentTable() {
    const { orders, setDispatchId } = useLogistics();
    return <Panel title="Danh sách Order chờ đóng kiện & điều chuyển" subtitle="Kiểm tra ghi chú từng dòng sản phẩm của Customer trước khi đóng thùng lạnh." right={<Badge tone="success">{orders.length} đơn hàng</Badge>}><div className="lg-table-scroll"><table className="lg-table"><thead><tr><th>Mã Order</th><th>Customer / Doanh nghiệp</th><th>Số kiện / Điểm đến</th><th>Ghi chú đóng sản phẩm</th><th>Trạng thái kiện</th><th>Delivery Staff phụ trách</th><th className="lg-cell-right">Thao tác</th></tr></thead><tbody>{orders.map(order=><tr key={order.id}><td className="lg-mono lg-bold">{order.id}</td><td><strong>{order.customer}</strong><small>{order.customerId}</small></td><td><strong>{String(order.packageCount).padStart(2,'0')} Kiện · {order.destinations}</strong></td><td className="lg-muted">“{order.note}”</td><td><Badge tone={states[order.status].tone}>{states[order.status].label}</Badge></td><td className="lg-muted">{order.assignedTo??'Chưa phân công'}</td><td className="lg-cell-right">{order.status==='PREPARING'||order.status==='WAITING'?<button type="button" className="lg-btn lg-btn--compact" onClick={()=>setDispatchId(order.id)}>Đóng kiện & Giao chuyến</button>:order.status==='IN_DELIVERY'?<button type="button" className="lg-btn lg-btn--compact" onClick={()=>setDispatchId(order.id)}>Xem lộ trình</button>:<span className="lg-muted">Đã hoàn tồn kho</span>}</td></tr>)}</tbody></table></div></Panel>;
}
