import { PackagePlus } from 'lucide-react';
import { useLogistics } from '../../components/logistic/LogisticsModel.tsx';
import { LogPageTitle } from '../../components/logistic/LogisticsUI.tsx';
import MovementTable from '../../components/logistic/MovementTable.tsx';
export default function ReceivePage(){const {openReceive}=useLogistics();return <><LogPageTitle code="02" eyebrow="NGHIỆP VỤ NHẬP KHO DEMO (MỤC 12.1)" title="Nhập kho trực tiếp (RECEIVE)" description="Ghi nhận số lượng hàng mới về trực tiếp vào kho mà không cần quy trình Purchase Order từ nhà cung cấp." action={<button type="button" className="lg-btn lg-btn--primary" onClick={()=>openReceive()}><PackagePlus size={16}/> + Tạo phiếu nhập kho mới</button>}/><MovementTable/></>}
