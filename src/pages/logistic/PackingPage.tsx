import ShipmentTable from '../../components/logistic/ShipmentTable.tsx';
import { LogPageTitle } from '../../components/logistic/LogisticsUI.tsx';
export default function PackingPage(){return <><LogPageTitle code="03" eyebrow="CHUẨN BỊ KIỆN & GIAO HÀNG (MỤC 13.1 & 13.2)" title="Đóng kiện & Phân công Chuyến" description="Mỗi Order tương ứng một chuyến giao. Một Order có thể chia thành nhiều Package với nhiều điểm đến và gán cho một Delivery Staff." action={<span className="lg-warehouse">1 ORDER = 1 CHUYẾN GIAO</span>}/><ShipmentTable/></>}
