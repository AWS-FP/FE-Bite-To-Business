import { PackagePlus } from 'lucide-react';
import InventoryStats from '../../components/logistic/InventoryStats.tsx';
import InventoryTable from '../../components/logistic/InventoryTable.tsx';
import { useLogistics } from '../../components/logistic/LogisticsModel.tsx';
import { LogPageTitle } from '../../components/logistic/LogisticsUI.tsx';
export default function InventoryPage() {
    const { openReceive }=useLogistics();
    return <><LogPageTitle code="01" eyebrow="QUẢN LÝ KHO & TỒN KHO" title="Sổ cái tồn kho thời gian thực" description="Theo dõi lượng hàng thực tế trong kho (On Hand), lượng đang giữ cho đơn (Reserved) và lượng còn có thể bán (Available = On Hand − Reserved)." action={<><span className="lg-warehouse">KHO TÂN THUẬN / LANDMARK 81</span><button type="button" className="lg-btn lg-btn--primary" onClick={()=>openReceive()}><PackagePlus size={16}/> + Nhập hàng mới (RECEIVE)</button></>}/><InventoryStats/><InventoryTable/></>;
}
