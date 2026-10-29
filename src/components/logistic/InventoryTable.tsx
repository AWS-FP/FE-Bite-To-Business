import { RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORY_NAMES } from '../../constants/logistic/demoData';
import type { StockCategory } from '../../types/logistic/logistics.ts';
import { useLogistics } from './LogisticsModel.tsx';
import { Badge, EmptyRows, Panel } from './LogisticsUI.tsx';

type Filter = 'all' | 'active' | 'out';
export default function InventoryTable() {
    const { inventory, openReceive, resetDemo } = useLogistics();
    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<'all' | StockCategory>('all');
    const counts = { all:inventory.length,active:inventory.filter(x=>x.onHand>x.reserved).length,out:inventory.filter(x=>x.onHand===x.reserved).length };
    const visible = useMemo(()=>inventory.filter(x=>{
        const available=x.onHand-x.reserved;
        return (filter==='all'||(filter==='active'&&available>0)||(filter==='out'&&available===0))&&(category==='all'||category===x.category)&&(`${x.name} ${x.sku}`.toLowerCase().includes(search.toLowerCase()));
    }),[inventory,filter,category,search]);
    return <Panel title="Sổ cái tồn kho thời gian thực" subtitle="Reserved do quy trình giữ/xuất/giải phóng tự động tính. Logistics Staff không sửa tay cột Reserved hoặc giá bán." right={<button type="button" title="Reset dữ liệu demo" aria-label="Khôi phục dữ liệu demo" className="lg-icon-button" onClick={resetDemo}><RefreshCw size={17}/></button>}>
        <div className="lg-toolbar"><div className="lg-filter-tabs"><button type="button" className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Tất cả <b>{counts.all}</b></button><button type="button" className={filter==='active'?'active':''} onClick={()=>setFilter('active')}>Đang bán <b>{counts.active}</b></button><button type="button" className={filter==='out'?'active':''} onClick={()=>setFilter('out')}>Hết hàng <b>{counts.out}</b></button></div><div className="lg-toolbar-search"><label className="lg-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm tên SP, mã SKU..." aria-label="Tìm sản phẩm" /></label><select aria-label="Nhóm hàng" value={category} onChange={e=>setCategory(e.target.value as typeof category)}><option value="all">Tất cả nhóm hàng</option>{Object.entries(CATEGORY_NAMES).map(([key,value])=><option key={key} value={key}>{value}</option>)}</select></div></div>
        <div className="lg-table-scroll"><table className="lg-table"><thead><tr><th>Sản phẩm / Mã SKU</th><th>Nhóm hàng</th><th>Đơn vị / MOQ</th><th className="lg-number">On Hand (Trong kho)</th><th className="lg-number">Reserved (Đã giữ)</th><th className="lg-number">Available (Có thể bán)</th><th>Trạng thái Card</th><th className="lg-cell-right">Thao tác</th></tr></thead><tbody>{visible.length?visible.map(x=>{const available=x.onHand-x.reserved;return <tr key={x.sku}><td><div className="lg-product-cell"><span className="lg-product-index">{String(inventory.indexOf(x)+1).padStart(2,'0')}</span><div><b>{x.name}</b><small>{x.sku}</small></div></div></td><td className="lg-muted">{CATEGORY_NAMES[x.category]}</td><td>{x.unit} (MOQ: {x.moq})</td><td className="lg-number lg-bold">{x.onHand}</td><td className="lg-number lg-muted lg-bold">{x.reserved}</td><td className={`lg-number lg-bold ${available===0?'lg-danger-text':''}`}>{available}</td><td>{available>0?<Badge tone="success">✓ Đang bán</Badge>:<Badge tone="danger">• Hết hàng (0)</Badge>}</td><td className="lg-cell-right"><button type="button" className="lg-btn lg-btn--compact" onClick={()=>openReceive(x.sku)}>+ Nhập thêm</button></td></tr>;}):<EmptyRows columns={8}/>}</tbody></table></div><div className="lg-panel-foot">Hiển thị {visible.length} trong {inventory.length} kết quả <span>Trang 1 / 1</span></div>
    </Panel>;
}
