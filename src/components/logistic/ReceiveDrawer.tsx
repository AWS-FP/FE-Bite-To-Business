import { useEffect, useState } from 'react';
import { useLogistics } from './LogisticsModel.tsx';
import { Drawer } from './LogisticsUI.tsx';

export default function ReceiveDrawer() {
    const { receiveOpen, setReceiveOpen, receiveSku, inventory, receiveStock } = useLogistics();
    const [sku, setSku] = useState(receiveSku);
    const [quantity, setQuantity] = useState('40');
    const [note, setNote] = useState('');
    useEffect(()=>{if(receiveOpen){setSku(receiveSku);setQuantity('40');setNote('');}},[receiveOpen, receiveSku]);
    if(!receiveOpen)return null;
    const amount=Number(quantity);
    const valid=Number.isSafeInteger(amount)&&amount>0;
    return <Drawer eyebrow="QUẢN LÝ TỒN KHO / NHẬP TRỰC TIẾP" title="Ghi nhận hàng mới vào kho" onClose={()=>setReceiveOpen(false)} footer={<><span className="lg-drawer-footnote">ⓘ Dữ liệu chỉ được cập nhật trong phiên demo</span><button type="button" className="lg-btn" onClick={()=>setReceiveOpen(false)}>Hủy</button><button type="submit" form="logistic-receive-form" disabled={!valid} className="lg-btn lg-btn--primary">+ Xác nhận nhập kho</button></>}>
        <p className="lg-drawer-caption">Tăng trực tiếp lượng On Hand và cập nhật lại trạng thái sản phẩm.</p><form id="logistic-receive-form" onSubmit={e=>{e.preventDefault();if(valid)receiveStock({sku,quantity:amount,note});}}><div className="lg-form-section">1. Thông tin lô hàng nhập</div><label className="lg-form-label">Chọn mã SKU sản phẩm *<select required value={sku} onChange={e=>setSku(e.target.value)}>{inventory.map(i=><option key={i.sku} value={i.sku}>{i.sku} — {i.name}</option>)}</select></label><div className="lg-form-grid"><label className="lg-form-label">Số lượng thực nhận *<input type="number" min="1" step="1" required value={quantity} onChange={e=>setQuantity(e.target.value)}/></label><label className="lg-form-label">Loại biến động<input readOnly value="RECEIVE (Nhập mới)" /></label></div><label className="lg-form-label">Ghi chú / Tham chiếu lô nhập<textarea rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder="Lô hàng nhập bổ sung..." /></label><div className="lg-form-info"><span>Người nhập:</span><b>Trần Đức Minh (NV-002)</b><span>Cơ chế chống lặp:</span><b>DEMO · không đồng bộ server</b></div></form>
    </Drawer>;
}
