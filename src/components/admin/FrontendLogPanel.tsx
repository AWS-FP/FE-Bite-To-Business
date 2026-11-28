import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getFrontendLogs } from '@/services/admin/systemService';
import { useAuthStore } from '@/store/admin/authStore';
import { useLogPagination } from '@/hooks/admin/useLogPagination';
import Pagination from '@/components/common/Pagination';
import AdminButton from './AdminButton';

type Cursor={before?:number;token?:string};
export default function FrontendLogPanel({hours}:{hours:number}) {
    const {i18n}=useTranslation('admin');
    const en=i18n.resolvedLanguage?.startsWith('en');
    const user=useAuthStore(s=>s.session?.user);
    const query=useInfiniteQuery({
        queryKey:['admin',user?.id,'frontendLogs',hours],
        initialPageParam: {} as Cursor,
        queryFn:({signal,pageParam})=>getFrontendLogs(hours,pageParam,signal),
        getNextPageParam:last=>last.nextToken?{before:Date.parse(last.to),token:last.nextToken}:undefined,
        enabled:user?.role==='ADMIN',retry:false,staleTime:60_000,
    });
    const entries=query.data?.pages.flatMap(p=>p.entries)??[];
    const pager=useLogPagination(entries,String(hours));
    const data=query.data?.pages[0];
    const date=(value:string)=>{if(!value)return '—';const n=Number(value);const d=new Date(Number.isFinite(n)?(n<1e12?n*1000:n):value);return Number.isNaN(d.getTime())?value:d.toLocaleString(i18n.language,{timeZone:'Asia/Ho_Chi_Minh'});};
    return <section className="system-panel">
        <header className="system-panel-heading"><h2>{en?'Frontend events · RUM':'Sự kiện frontend · RUM'}</h2><AdminButton busy={query.isFetching} onClick={()=>void query.refetch()}>{en?'Refresh':'Làm mới'}</AdminButton></header>
        {query.isPending?<p className="system-empty-state">{en?'Loading…':'Đang tải…'}</p>:query.isError||data?.status!=='AVAILABLE'?<p className="system-empty-state">{en?'Unable to load RUM events. Check the application monitor and read permissions.':'Chưa đọc được sự kiện RUM. Kiểm tra app monitor và quyền đọc dữ liệu.'}</p>:<>
        <div className="system-table-scroll"><table className="system-log-table [&_td]:border-t [&_td]:border-store-line [&_td]:px-5 [&_td]:py-3 [&_td]:text-xs"><thead><tr>{(en?['Time','Event','Page','Browser','HTTP','Duration','Message']:['Thời gian','Sự kiện','Trang','Trình duyệt','HTTP','Thời gian xử lý','Nội dung']).map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{pager.rows.map((r,i)=><tr key={i}><td>{date(r.time)}</td><td>{r.type.replace('com.amazon.rum.','')}</td><td className="max-w-52 break-all">{r.page||'—'}</td><td>{r.browser||'—'}</td><td>{r.httpStatus??'—'}</td><td>{r.durationMs==null?'—':Math.round(r.durationMs)+' ms'}</td><td className="max-w-80 break-words">{r.message||'—'}</td></tr>)}{!entries.length&&<tr><td colSpan={7}>{en?'No events in this window.':'Chưa có sự kiện trong khoảng thời gian này.'}</td></tr>}</tbody></table></div>
        <Pagination {...pager} loading={query.isFetching}/>
        {query.hasNextPage&&<div className="flex justify-center pb-5"><AdminButton busy={query.isFetchingNextPage} onClick={async()=>{const nextPage=Math.floor(entries.length/10);const result=await query.fetchNextPage();if(result.isSuccess)pager.onPageChange(nextPage);}}>{en?'Load more events':'Tải thêm sự kiện'}</AdminButton></div>}
        </>}
    </section>;
}
