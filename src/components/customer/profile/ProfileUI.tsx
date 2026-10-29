import type { ReactNode } from 'react';
import { UserRound, X } from 'lucide-react';

export function Label({ children }: { children: ReactNode }) {
    return <label className="mb-2 block text-[11px] font-bold text-[#394B47]">{children}</label>;
}
export function Input({
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false,
}: {
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
}) {
    return (
        <input
            type={type}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-11 w-full min-w-0 rounded-xl border border-[#D3DBD5] bg-white px-3.5 text-[12px] font-medium text-[#172C26] outline-none transition-colors placeholder:text-[#A5ACAA] focus:border-[#1B654B] focus:ring-2 focus:ring-[#1B654B]/15 disabled:bg-[#E8ECE8] disabled:text-[#5C6E64]"
        />
    );
}
export function Panel({
    children,
    id,
    className = '',
}: {
    children: ReactNode;
    id?: string;
    className?: string;
}) {
    return (
        <section
            id={id}
            className={`scroll-mt-24 rounded-[22px] bg-[#F9F7F1] p-5 shadow-[0_5px_20px_rgba(8,35,26,.08)] sm:p-7 ${className}`}
        >
            {children}
        </section>
    );
}
export function PanelTitle({
    n,
    title,
    subtitle,
    trailing,
}: {
    n?: string;
    title: string;
    subtitle: string;
    trailing?: ReactNode;
}) {
    return (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E4DE] pb-4">
            <div>
                <h2 className="m-0 font-serif text-[19px] font-bold leading-tight text-[#192D27]">
                    {n ? `${n}. ` : ''}
                    {title}
                </h2>
                <p className="m-0 mt-1 text-[11px] leading-relaxed text-[#78847D]">{subtitle}</p>
            </div>
            {trailing}
        </div>
    );
}
export function Pill({
    children,
    tone = 'mint',
}: {
    children: ReactNode;
    tone?: 'mint' | 'yellow';
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold ${tone === 'mint' ? 'bg-[#DFF4EA] text-[#174C39]' : 'bg-[#FFE14D] text-[#26352B]'}`}
        >
            {children}
        </span>
    );
}
export function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061B13]/80 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="max-h-[92vh] w-full max-w-[500px] overflow-y-auto rounded-[28px] bg-gradient-to-br from-[#12533B] via-[#0B3023] to-[#062519] p-5 text-white shadow-2xl sm:p-7"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <h2 className="m-0 -rotate-1 font-serif text-3xl font-black text-[#FFE14D]">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#FFE14D] shadow-none outline-none transition-colors hover:bg-transparent hover:text-[#FFF3AE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE14D]"
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        <X size={28} strokeWidth={2.5} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
export function Avatar({
    src,
    name,
    size = 'normal',
}: {
    src: string;
    name: string;
    size?: 'normal' | 'large';
}) {
    return (
        <div
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#A6D7C0] via-[#89BDAF] to-[#C8C7E5] font-serif font-bold text-[#0C3828] ${size === 'large' ? 'h-20 w-20 text-3xl' : 'h-14 w-14 text-lg'}`}
        >
            {src ? (
                <img
                    className="h-full w-full object-cover"
                    src={src}
                    alt={name ? `${name} avatar` : 'Avatar'}
                />
            ) : (
                name.trim().slice(0, 2).toUpperCase() || <UserRound size={27} />
            )}
        </div>
    );
}
