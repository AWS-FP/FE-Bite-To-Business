import { Fragment, type ReactNode } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PageNavCrumb {
    label: ReactNode;
    /** Route to go to. The last crumb has no `to`: it is the current page. */
    to?: string;
}

interface PageNavBack {
    label: ReactNode;
    to?: string;
    /** For in-page flows (e.g. closing a wizard) that are not a route change. */
    onClick?: () => void;
    disabled?: boolean;
}

type PageNavProps = {
    /** 'dark' for pages whose header sits on the dark green background. */
    tone?: 'light' | 'dark';
    className?: string;
    ariaLabel?: string;
} & ({ items: PageNavCrumb[]; back?: never } | { back: PageNavBack; items?: never });

const palette = {
    light: {
        link: 'text-store-green hover:text-store-dark',
        current: 'text-store-ink',
        separator: 'text-store-muted',
    },
    dark: {
        link: 'text-[#d1dfd2] hover:text-store-yellow',
        current: 'text-[#ffdd63]',
        separator: 'text-[#d1dfd2]/70',
    },
};

/**
 * Shared page navigation for every role: a breadcrumb trail (`items`) or a single
 * "back" link (`back`), so all workspaces use the same size, colours and icons.
 */
export default function PageNav({
    tone = 'light',
    className = '',
    ariaLabel = 'Breadcrumb',
    ...props
}: PageNavProps) {
    const colors = palette[tone];
    const linkClass = `rounded-sm font-semibold no-underline underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-yellow ${colors.link}`;

    if (props.back) {
        const { label, to, onClick, disabled } = props.back;
        const content = (
            <>
                <ArrowLeft size={17} aria-hidden="true" className="shrink-0" />
                {label}
            </>
        );
        const backClass = `inline-flex items-center gap-2 text-sm ${linkClass}`;
        return (
            <nav aria-label={ariaLabel} className={className}>
                {to ? (
                    <Link to={to} className={backClass}>
                        {content}
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={onClick}
                        disabled={disabled}
                        className={`${backClass} cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {content}
                    </button>
                )}
            </nav>
        );
    }

    const items = props.items ?? [];
    return (
        <nav aria-label={ariaLabel} className={className}>
            <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-sm">
                {items.map((item, index) => {
                    const last = index === items.length - 1;
                    return (
                        <Fragment key={index}>
                            {index > 0 && (
                                <li aria-hidden="true" className={`flex ${colors.separator}`}>
                                    <ChevronRight size={14} />
                                </li>
                            )}
                            <li className="min-w-0">
                                {item.to && !last ? (
                                    <Link to={item.to} className={linkClass}>
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        aria-current={last ? 'page' : undefined}
                                        className={`block max-w-[60vw] truncate font-bold ${colors.current}`}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
