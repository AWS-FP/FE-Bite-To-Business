import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getFrontendLogs } from '@/services/admin/systemService';
import { useAuthStore } from '@/store/admin/authStore';
import AdminButton from './AdminButton';

export default function FrontendLogPanel({hours}:{hours:number}) {
    const {i18n}=useTranslation('admin');
    const en=i18n.resolvedLanguage?.startsWith('en');
    const user=useAuthStore(s=>s.session?.user);
    const [cursor,setCursor]=useState<{before?:number;token?:string}>({});
    const query=useQuery({queryKey:['admin',user?.id,'frontendLogs',hours,cursor],queryFn:({signal})=>getFrontendLogs(hours,cursor,signal),enabled:user?.role==='ADMIN',retry:false,staleTime:60_000});
    const data=query.data;
    const date=(value:string)=>{if(!value)return '—';const n=Number(value);const d=new Date(Number.isFinite(n)?(n<1e12?n*1000:n):value);return Number.isNaN(d.getTime())?value:d.toLocaleString(i18n.language,{timeZone:'Asia/Ho_Chi_Minh'});};
    return <section className="system-panel"><header className="system-panel-heading"><div><h2>{en?'Frontend events · RUM':'Sự kiện frontend · RUM'}</h2><p>{en?'Performance, JavaScript errors and HTTP events captured by the browser.':'Hiệu năng, lỗi JavaScript và sự kiện HTTP do trình duyệt ghi nhận.'}</p></div><AdminButton onClick={()=>{setCursor({});void query.refetch();}}>{en?'Refresh':'Làm mới'}</AdminButton></header>
        {query.isPending?<p className="system-empty-state">{en?'Loading…':'Đang tải…'}</p>:query.isError||data?.status!=='AVAILABLE'?<p className="system-empty-state">{en?'Unable to load RUM events. Check the application monitor and its read permissions.':'Chưa đọc được sự kiện RUM. Kiểm tra app monitor và quyền đọc dữ liệu.'}</p>:<><div className="system-table-scroll"><table className="system-log-table [&_td]:border-t [&_td]:border-store-line [&_td]:px-5 [&_td]:py-3 [&_td]:text-xs"><thead><tr>{(en?['Time','Event','Page','Browser','HTTP','Duration','Message']:['Thời gian','Sự kiện','Trang','Trình duyệt','HTTP','Thời gian xử lý','Nội dung']).map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{data.entries.map((r,i)=><tr key={i}><td>{date(r.time)}</td><td>{r.type.replace('com.amazon.rum.','')}</td><td className="max-w-52 break-all">{r.page||'—'}</td><td>{r.browser||'—'}</td><td>{r.httpStatus??'—'}</td><td>{r.durationMs==null?'—':Math.round(r.durationMs)+' ms'}</td><td className="max-w-80 break-words">{r.message||'—'}</td></tr>)}{!data.entries.length&&<tr><td colSpan={7}>{en?'No events in this window.':'Chưa có sự kiện trong khoảng thời gian này.'}</td></tr>}</tbody></table></div><div className="flex items-center justify-between gap-3 border-t border-store-line p-4 text-xs"><span>{en?'Up to 100 events per page':'Tối đa 100 sự kiện mỗi trang'}</span><AdminButton disabled={!data.nextToken||query.isFetching} onClick={()=>setCursor({before:Date.parse(data.to),token:data.nextToken??undefined})}>{en?'Next page':'Trang tiếp'}</AdminButton></div></>}
    </section>;
}
