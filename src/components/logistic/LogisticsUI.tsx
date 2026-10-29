import type { ReactNode } from 'react';

export function LogPageTitle({ code, eyebrow, title, description, action }: { code: string; eyebrow: string; title: string; description: string; action?: ReactNode }) {
    return <div className="lg-page-title"><div><div className="lg-eyebrow"><span className="lg-index">{code}</span>{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="lg-page-action">{action}</div>}</div>;
}
export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'success' | 'yellow' | 'danger' | 'blue'; children: ReactNode }) {
    return <span className={`lg-badge lg-badge--${tone}`}>{children}</span>;
}
export function Panel({ title, subtitle, right, children }: { title?: string; subtitle?: string; right?: ReactNode; children: ReactNode }) {
    return <section className="lg-panel"><div className="lg-panel-head"><div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div>{right}</div>{children}</section>;
}
export function EmptyRows({ columns, text = 'Không tìm thấy kết quả.' }: { columns: number; text?: string }) {
    return <tr><td colSpan={columns} className="lg-empty">{text}</td></tr>;
}
export function Drawer({ title, eyebrow, children, onClose, footer }: { title: string; eyebrow: string; children: ReactNode; onClose: () => void; footer: ReactNode }) {
    return <div className="lg-drawer-mask" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section className="lg-drawer" role="dialog" aria-modal="true" aria-label={title}><div className="lg-drawer-head"><div><p className="lg-drawer-eyebrow">{eyebrow}</p><h2>{title}</h2></div><button type="button" className="lg-icon-button" aria-label="Đóng" onClick={onClose}>×</button></div><div className="lg-drawer-body">{children}</div><div className="lg-drawer-footer">{footer}</div></section></div>;
}
