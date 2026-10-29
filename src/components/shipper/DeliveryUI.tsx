import type { ReactNode } from 'react';

export function SectionHeading({ number, eyebrow, title, description, action }: {
    number: string; eyebrow: string; title: string; description?: string; action?: ReactNode;
}) {
    return <div className="dl-page-heading"><div className="dl-page-heading-copy">
        <div className="dl-section-eyebrow"><span>{number}</span>{eyebrow}</div>
        <h1>{title}</h1>{description && <p>{description}</p>}
    </div>{action && <div className="dl-page-heading-actions">{action}</div>}</div>;
}

export function StatusBadge({ children, tone = 'success' }: { children: ReactNode; tone?: 'success' | 'warning' | 'neutral' }) {
    return <span className={`dl-status dl-status--${tone}`}>{children}</span>;
}
