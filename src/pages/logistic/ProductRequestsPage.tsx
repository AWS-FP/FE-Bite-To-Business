import ProductRequestTable from '../../components/logistic/ProductRequestTable.tsx';
import { LogPageTitle } from '../../components/logistic/LogisticsUI.tsx';
export default function ProductRequestsPage(){return <><LogPageTitle code="04" eyebrow="TIẾP NHẬN & PHẢN HỒI QUA SMTP (MỤC 6)" title="Yêu cầu bán thêm sản phẩm mới" description="Logistics Staff chọn sản phẩm đã bổ sung để hệ thống lấy Tên, Ngày thêm, Giá bán hiện hành và Số lượng có thể bán gửi qua SMTP tới Gmail tài khoản của Customer. (Hiện là demo giao diện.)"/><ProductRequestTable/></>}
