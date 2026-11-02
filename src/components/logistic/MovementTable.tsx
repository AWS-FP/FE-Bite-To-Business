import { useLogistics } from './LogisticsModel.tsx';
import { Badge, Panel } from './LogisticsUI.tsx';
import type { MovementKind } from '../../types/logistic/logistics.ts';

const labels: Record<MovementKind,string>={RECEIVE:'RECEIVE (Nhập kho)',RESERVE:'RESERVE (Giữ đơn)',RELEASE:'RELEASE (Hủy trước xuất)',SHIP:'SHIP (Xuất kho)'};
const tone:Record<MovementKind,'success'|'yellow'|'neutral'|'blue'>={RECEIVE:'success',RESERVE:'yellow',RELEASE:'neutral',SHIP:'blue'};
export default function MovementTable() {
    const { movements } = useLogistics();
    return <Panel title="Lịch sử biến động & nhập kho gần nhất" subtitle="Mọi thao tác RECEIVE, RESERVE, SHIP, RELEASE đều lưu người thực hiện, thời điểm và công ghi trùng (Idempotent)."><div className="lg-table-scroll"><table className="lg-table"><thead><tr><th>Mã giao dịch kho</th><th>Loại biến động</th><th>Sản phẩm / SKU</th><th className="lg-number">Số lượng biến động</th><th>Người thực hiện</th><th>Thời điểm</th><th>Ghi chú / Nguyên nhân</th></tr></thead><tbody>{movements.map(x=><tr key={x.id}><td className="lg-mono lg-bold">{x.id}</td><td><Badge tone={tone[x.kind]}>{labels[x.kind]}</Badge></td><td className="lg-bold">{x.name} <span className="lg-muted">({x.sku})</span></td><td className={`lg-number lg-bold ${x.kind==='RECEIVE'?'lg-success-text':x.kind==='RESERVE'?'lg-warn-text':'lg-blue-text'}`}>{x.kind==='RECEIVE'?'+':x.kind==='SHIP'?'-':''}{x.quantity} {x.kind==='RESERVE'?'Reserved ':''}</td><td className="lg-muted">{x.actor}</td><td className="lg-muted">{x.time}</td><td className="lg-muted">{x.note}</td></tr>)}</tbody></table></div></Panel>;
}
