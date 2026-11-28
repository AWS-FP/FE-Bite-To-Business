import { useState } from 'react';
export function useLogPagination<T>(items: readonly T[], scope: string, size = 10) {
    const [position, setPosition] = useState({scope, page:0});
    const totalPages=Math.ceil(items.length/size);
    const page=Math.min(position.scope===scope?position.page:0,Math.max(0,totalPages-1));
    return {rows:items.slice(page*size,(page+1)*size),page,totalPages,onPageChange:(value:number)=>setPosition({scope,page:value})};
}
