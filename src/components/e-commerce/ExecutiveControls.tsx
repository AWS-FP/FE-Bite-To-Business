import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { executiveUi } from './executiveTokens';

type OptionProps = { value?: string; children?: ReactNode; disabled?: boolean };
type SelectProps = {
    label?: string; ariaLabel?: string; value: string; onValueChange: (next: string) => void;
    children: ReactNode; className?: string; disabled?: boolean;
};

/** Compact custom listbox with a fixed portal; it is not clipped by an overflow-hidden panel. */
export function ExecutiveSelect({ label, ariaLabel, value, onValueChange, children, className='', disabled=false }: SelectProps) {
    const options = Children.toArray(children).filter((node):node is ReactElement<OptionProps> =>
        isValidElement<OptionProps>(node) && node.type === 'option'
    ).map(node => ({ value: String(node.props.value ?? node.props.children ?? ''), label: String(node.props.children ?? ''), disabled: Boolean(node.props.disabled) }));
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top:0, left:0, width:220 });
    const trigger=useRef<HTMLButtonElement>(null), menu=useRef<HTMLDivElement>(null);
    const optionRefs=useRef<(HTMLButtonElement|null)[]>([]);
    const selected=options.find(o=>o.value===value) ?? options[0];
    const selectedIndex=Math.max(0, options.findIndex(o=>o.value===value));
    function openMenu(){
        if(disabled)return;
        if(open){setOpen(false);return;}
        const rect=trigger.current?.getBoundingClientRect();
        if(rect){const width=Math.max(rect.width,220);setPosition({top:rect.bottom+7,left:Math.max(8,Math.min(rect.left,window.innerWidth-width-8)),width});}
        setOpen(true);
    }
    function choose(next:string){onValueChange(next);setOpen(false);trigger.current?.focus();}
    useEffect(()=>{
        if(!open)return;
        optionRefs.current[selectedIndex]?.focus();
        const outside=(event:PointerEvent)=>{
            const node=event.target as Node;
            if(!trigger.current?.contains(node)&&!menu.current?.contains(node))setOpen(false);
        };
        const keyboard=(event:KeyboardEvent)=>{
            if(event.key==='Escape'){event.preventDefault();setOpen(false);trigger.current?.focus();}
        };
        const closeOnScroll=(event:Event)=>{if(!menu.current?.contains(event.target as Node))setOpen(false);};
        document.addEventListener('pointerdown',outside);
        document.addEventListener('keydown',keyboard);
        window.addEventListener('scroll',closeOnScroll,true);
        return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',keyboard);window.removeEventListener('scroll',closeOnScroll,true);};
    },[open,selectedIndex]);
    return <div className={`relative min-w-0 ${className}`}>
        {label&&<span className="mb-1.5 block text-xs font-bold text-[#43634e]">{label}</span>}
        <button type="button" ref={trigger} disabled={disabled} aria-label={ariaLabel??label} aria-haspopup="listbox" aria-expanded={open} onClick={openMenu} onKeyDown={e=>{
            if(!open&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();openMenu();}
        }} className={`${executiveUi.input} flex !h-11 items-center justify-between gap-2 !rounded-xl !border-[#bdd5c4] !bg-[#f8fbf6] text-left !font-semibold shadow-sm transition hover:!border-[#4e9970] hover:!bg-white focus-visible:!ring-4 focus-visible:!ring-[#c5eacb] disabled:opacity-40`}>
            <span className="min-w-0 truncate">{selected?.label||'—'}</span>
            <ChevronDown size={17} className={`shrink-0 text-[#276747] transition-transform duration-200 ${open?'rotate-180':''}`}/>
        </button>
        {open&&createPortal(<div ref={menu} role="listbox" aria-label={ariaLabel??label??'Options'} style={{position:'fixed',top:position.top,left:position.left,width:position.width,zIndex:250}} className="max-h-64 overflow-y-auto rounded-2xl border border-[#d3e4d6] bg-white p-1.5 shadow-[0_20px_55px_rgba(16,55,35,.22)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {options.map((o,i)=><button key={`${o.value}-${i}`} ref={el=>{optionRefs.current[i]=el;}} type="button" role="option" aria-selected={o.value===value} disabled={o.disabled} onClick={()=>choose(o.value)} onKeyDown={e=>{
                if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const direction=e.key==='ArrowDown'?1:-1;optionRefs.current[(i+direction+options.length)%options.length]?.focus();}
                if(e.key==='Home'){e.preventDefault();optionRefs.current[0]?.focus();}
                if(e.key==='End'){e.preventDefault();optionRefs.current[options.length-1]?.focus();}
                if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(o.value);}
            }} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#29895d] ${o.value===value?'bg-[#fff0ac] text-[#14392b]':'text-[#2c5340] hover:bg-[#edf7ec]'}`}><span>{o.label}</span>{o.value===value&&<Check size={16} className="shrink-0 text-[#205b3b]"/>}</button>)}
        </div>,document.body)}
    </div>;
}
export function ExecutivePagination({ page, totalPages, onChange, tr }: {page: number; totalPages: number; onChange:(next: number)=>void; tr:(vi: string, en: string)=>string}) {
    return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7eee4] px-5 py-4 text-sm">
        <span className="font-semibold text-[#64806b]">{tr('Trang','Page')} {page + 1}/{Math.max(totalPages,1)}</span>
        <div className="flex items-center gap-2"><button type="button" className={executiveUi.secondary} disabled={page===0} onClick={()=>onChange(page-1)}>{tr('Trước','Previous')}</button><button type="button" className={executiveUi.secondary} disabled={page+1>=totalPages} onClick={()=>onChange(page+1)}>{tr('Tiếp','Next')}</button></div>
    </div>;
}
export function ExecutiveBadge({ status }: {status: string}) {
    const safe = (status ?? '').toUpperCase();
    const warm = ['PENDING_APPROVAL','PENDING','DRAFT','REVIEWING'].includes(safe);
    const good = ['PUBLISHED','APPROVED','VISIBLE','COMPLETED','ADDED'].includes(safe);
    return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${good ? 'bg-[#e4f3e5] text-[#216643]' : warm ? 'bg-[#fff2c5] text-[#8b6100]' : 'bg-[#f1eeee] text-[#6f6060]'}`}>{safe.replace(/_/g,' ')}</span>;
}
export function ExecutiveFeedback({ message, error }: {message?: string;error?:boolean}) {
    if(!message)return null;
    return <p role={error?'alert':'status'} className={`rounded-xl border px-4 py-3 text-sm ${error?'border-rose-200 bg-rose-50 text-rose-700':'border-[#c9e8cb] bg-[#eff9ef] text-[#246445]'}`}>{message}</p>;
}
