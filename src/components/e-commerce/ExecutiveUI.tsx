import type { ReactNode } from 'react';
import { AlertCircle, ArrowRight, Inbox, LockKeyhole, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';

export function ExecutiveHeading({ number, eyebrow, title, description, action }: {
    number: string; eyebrow: string; title: string; description: string; action?: ReactNode;
}) {
    return <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#39614a]">
                <span className="grid h-7 w-7 place-items-center rounded border border-[#a2b9aa] bg-[#e7f1e5] tracking-normal">{number}</span>{eyebrow}
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#143d2e] sm:text-[36px]">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-[#697870]">{description}</p>
        </div>
        {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </header>;
}

export function ExecutivePanel({ title, caption, action, children }: {
    title: string; caption?: string; action?: ReactNode; children: ReactNode;
}) {
    return <section className={executiveUi.card}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebeee7] px-5 py-4 sm:px-6">
            <div><h2 className="text-lg font-bold text-[#143d2e]">{title}</h2>{caption && <p className="mt-1 text-xs text-[#6b7972]">{caption}</p>}</div>
            {action}
        </div>
        {children}
    </section>;
}

export function ExecutiveStat({ title, value, icon, detail, tone = 'green' }: {
    title: string; value: ReactNode; icon: ReactNode; detail?: string; tone?: 'green' | 'yellow' | 'blue' | 'coral';
}) {
    const colors = {
        green: { card: '!bg-[#eef7ef] !border-[#c5ddcc]', icon: 'bg-[#d8eddd] text-[#1b6340]', value: 'text-[#143d2e]' },
        yellow: { card: '!bg-[#fff9df] !border-[#ecdba0]', icon: 'bg-[#ffedab] text-[#795b14]', value: 'text-[#664b12]' },
        blue: { card: '!bg-[#eef5fb] !border-[#cbddeb]', icon: 'bg-[#dcecf8] text-[#285e88]', value: 'text-[#214d72]' },
        coral: { card: '!bg-[#fff4ed] !border-[#efd8cb]', icon: 'bg-[#fce4d6] text-[#994b2e]', value: 'text-[#803c28]' },
    }[tone];
    return <div className={`${executiveUi.card} ${colors.card} border-solid p-5`}>
        <div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-store-muted">{title}</p><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${colors.icon}`}>{icon}</span></div>
        <strong className={`mt-3 block break-words font-price text-[29px] font-extrabold tabular-nums ${colors.value}`}>{value}</strong>
        <p className="mt-1 min-h-5 text-xs text-store-muted">{detail ?? ' '}</p>
    </div>;
}

export function ExecutiveEmpty({ title, description, icon, action }: {
    title: string; description: string; icon?: ReactNode; action?: ReactNode;
}) {
    return <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-[#eef4eb] text-[#53745d]">{icon ?? <Inbox size={27}/>}</div>
        <h3 className="mt-4 text-base font-bold text-[#173f30]">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b7972]">{description}</p>
        {action && <div className="mt-5">{action}</div>}
    </div>;
}

export function ExecutiveApiNote({ message }: { message: string }) {
    return <div className="flex items-start gap-2 rounded-xl border border-[#d8e4d7] bg-[#f1f7ef] px-4 py-3 text-xs leading-5 text-[#46634f]"><LockKeyhole size={17} className="mt-0.5 shrink-0"/><p>{message}</p></div>;
}

export function ExecutiveError({ message, retry }: { message: string; retry?: () => void }) {
    const label = useExecutiveText();
    return <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={19}/><span className="flex-1">{message}</span>{retry && <button type="button" onClick={retry} className={executiveUi.secondary}><RefreshCw size={15}/>{label('Thử lại','Retry')}</button>}</div>;
}

export function ExecutiveShortcut({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
    return <Link to={to} className="group flex items-center justify-between gap-3 rounded-xl border border-[#dfebe1] bg-white px-4 py-4 text-sm font-semibold text-[#184b36] no-underline transition hover:-translate-y-0.5 hover:border-[#86bd91] hover:bg-[#f3faef]">
        <span className="flex items-center gap-3">{icon}{label}</span><ArrowRight size={17} className="transition group-hover:translate-x-1"/>
    </Link>;
}
