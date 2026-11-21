import { useTranslation } from 'react-i18next';

export function useExecutiveText() {
    const { i18n } = useTranslation();
    const en = i18n.resolvedLanguage?.startsWith('en') ?? false;
    return (vi: string, english: string) => (en ? english : vi);
}

export const executiveUi = {
    card: 'overflow-hidden rounded-xl border border-[#d9d7cc] bg-white shadow-[0_3px_0_rgba(16,52,39,0.04)]',
    input: 'h-11 w-full rounded-xl border border-[#c4d7c8] bg-[#f8fbf6] px-3 text-sm text-[#173f30] outline-none focus:border-[#146b4b] focus:ring-2 focus:ring-emerald-100',
    button: 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#173f30] bg-[#ffe15c] px-4 py-2 text-sm font-bold text-[#102c22] transition hover:bg-[#ffeb93] disabled:cursor-not-allowed disabled:opacity-45',
    secondary:
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#b9c8c0] bg-white px-4 py-2 text-sm font-semibold text-[#173f30] transition hover:bg-[#f0f7ee] disabled:cursor-not-allowed disabled:opacity-45',
    muted: 'text-sm leading-6 text-[#6b7972]',
    table: 'w-full min-w-[660px] border-collapse text-left text-sm',
    th: 'border-b border-[#e3e7df] bg-[#f7f9f3] px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#62746a]',
    td: 'border-b border-[#edf0ea] px-5 py-4 align-middle',
};
