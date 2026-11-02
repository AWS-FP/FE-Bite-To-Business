import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
    sectionNumber: string;
    eyebrow: string;
    title: string;
    description: string;
    children?: ReactNode;
}

export default function AdminPageHeader({
    sectionNumber,
    eyebrow,
    title,
    description,
    children,
}: AdminPageHeaderProps) {
    return (
        <header className="admin-page-heading flex min-h-[106px] items-start justify-between gap-6">
            <div className="min-w-0">
                <p className="flex items-center gap-2.5 font-body text-[11px] leading-[16.5px] font-semibold tracking-[1.2px] uppercase">
                    <span className="grid size-[25px] shrink-0 place-items-center rounded-[3px] border border-black bg-[#fff8e8] tracking-normal">
                        {sectionNumber}
                    </span>
                    {eyebrow}
                </p>
                <h1 className="pt-2 font-body text-[34px] leading-[44px] font-bold tracking-[-1px]">
                    {title}
                </h1>
                <p className="pt-2 text-[13px] leading-[21px] text-[#65655e]">{description}</p>
            </div>
            {children && <div className="flex shrink-0 items-center gap-3 pt-1">{children}</div>}
        </header>
    );
}
