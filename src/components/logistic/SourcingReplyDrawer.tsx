import { useEffect, useState } from 'react';
import { useLogistics } from './LogisticsModel.tsx';
import { Drawer } from './LogisticsUI.tsx';

export default function SourcingReplyDrawer() {
    const { replyId, setReplyId, requests, sendReply } = useLogistics();
    const request=requests.find(x=>x.id===replyId);
    const [body,setBody]=useState('');
    useEffect(()=>{setBody(request?.reply??`Chào ${request?.customer??'Quý khách'},\n\nChúng tôi đã nhận yêu cầu về sản phẩm ${request?.product??''}. Logistics sẽ kiểm tra tình trạng cung ứng và phản hồi khi có thông tin xác nhận.\n\nTrân trọng,\nBite to Business`);},[request?.id,request?.reply,request?.customer,request?.product]);
    if(!request)return null;
    const readonly=request.status==='SENT';
    return <Drawer eyebrow="TIẾP NHẬN YÊU CẦU / SOẠN PHẢN HỒI" title={readonly?'Bản lưu phản hồi demo':'Soạn phản hồi khách hàng'} onClose={()=>setReplyId(null)} footer={<><span className="lg-drawer-footnote">Chỉ lưu bản nháp trong bộ nhớ, chưa gửi SMTP</span><button type="button" className="lg-btn" onClick={()=>setReplyId(null)}>Đóng</button>{!readonly&&<button type="submit" form="logistic-reply-form" disabled={!body.trim()} className="lg-btn lg-btn--primary">✓ Lưu phản hồi demo</button>}</>}><div className="lg-form-info"><span>Khách hàng:</span><b>{request.customer}</b><span>Gmail:</span><b>{request.email}</b><span>Sản phẩm:</span><b>{request.product}</b><span>Yêu cầu:</span><b>{request.note}</b></div><form id="logistic-reply-form" onSubmit={e=>{e.preventDefault();if(body.trim()&&!readonly)sendReply(request.id,body);}}><div className="lg-form-section">Nội dung phản hồi</div><label className="lg-form-label">Bản nháp email<textarea rows={12} readOnly={readonly} required value={body} onChange={e=>setBody(e.target.value)}/></label></form></Drawer>;
}
