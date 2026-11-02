import { useEffect, useState } from 'react';
import { useLogistics } from './LogisticsModel.tsx';
import { Badge, Drawer } from './LogisticsUI.tsx';

export default function DispatchDrawer() {
    const {dispatchId,setDispatchId,orders,assignDispatch}=useLogistics();
    const order=orders.find(x=>x.id===dispatchId);
    const [assignee,setAssignee]=useState('Lê Hoàng Long (NV-003)');
    const [note,setNote]=useState('');
    useEffect(()=>{setNote(order?.note??'');setAssignee(order?.assignedTo??'Lê Hoàng Long (NV-003)');},[order?.id,order?.note,order?.assignedTo]);
    if(!order)return null;
    const readonly=order.status==='IN_DELIVERY';
    return <Drawer eyebrow="ĐIỀU PHỐI / ĐÓNG KIỆN & CHUYẾN" title={readonly?'Chi tiết chuyến giao':'Đóng kiện & phân công chuyến'} onClose={()=>setDispatchId(null)} footer={<><span className="lg-drawer-footnote">Không gọi API giao hàng thật</span><button type="button" className="lg-btn" onClick={()=>setDispatchId(null)}>Đóng</button>{!readonly&&<button form="logistic-dispatch-form" type="submit" className="lg-btn lg-btn--primary">✓ Xác nhận giao chuyến</button>}</>}><p className="lg-drawer-caption">Mỗi Order tương ứng một chuyến, có thể chia nhiều kiện đến các điểm khác nhau.</p><div className="lg-form-info"><span>Mã đơn:</span><b>{order.id}</b><span>Khách hàng:</span><b>{order.customer}</b><span>Số kiện:</span><b>{order.packageCount}</b><span>Đích đến:</span><b>{order.destinations}</b></div><form id="logistic-dispatch-form" onSubmit={e=>{e.preventDefault();if(!readonly)assignDispatch(order.id,assignee,note);}}><div className="lg-form-section">1. Giao chuyến và ghi chú kiện</div><label className="lg-form-label">Nhân viên giao hàng<select value={assignee} disabled={readonly} onChange={e=>setAssignee(e.target.value)}><option>Lê Hoàng Long (NV-003)</option><option>Nguyễn Quốc Thái (NV-004)</option><option>Phạm Minh Khoa (NV-005)</option></select></label><label className="lg-form-label">Ghi chú đóng gói<textarea rows={4} value={note} disabled={readonly} onChange={e=>setNote(e.target.value)}/></label><div className="lg-callout">Trạng thái hiện tại: <Badge tone={readonly?'yellow':'neutral'}>{readonly?'IN_DELIVERY':'PREPARING / WAITING'}</Badge></div></form></Drawer>;
}
