// Lớp Tailwind dùng chung cho các màn hình E-commerce.
export const executiveUi = {
    card: 'overflow-hidden rounded-xl border border-[#d9d7cc] bg-white shadow-[0_3px_0_rgba(16,52,39,0.04)]',
    input: 'h-11 w-full rounded-xl border border-[#c4d7c8] bg-[#f8fbf6] px-3 text-sm text-[#173f30] border-solid outline-none focus:!outline-none focus:!shadow-none focus:border-[#146b4b]',
    selectTrigger: 'flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-solid border-store-line bg-white px-3 text-left text-sm font-semibold text-store-green transition hover:border-store-sage focus:!outline-none focus:!shadow-none focus-visible:border-store-green focus-visible:!bg-surface-green aria-expanded:border-store-green disabled:opacity-40',
    selectPanel: 'rounded-xl border border-solid border-store-line bg-white p-1.5 shadow-[0_12px_30px_rgba(18,55,42,0.12)]',
    selectSearch: 'flex items-center gap-2 rounded-lg border border-solid border-store-line bg-white px-3 focus-within:border-store-green',
    selectSearchInput: 'h-10 min-w-0 flex-1 appearance-none !border-0 bg-transparent text-sm text-store-ink !outline-none !shadow-none placeholder:text-store-muted',
    selectOption: 'flex w-full items-center justify-between gap-3 rounded-lg !border-0 bg-white px-3 py-2.5 text-left text-sm text-store-green !outline-none !shadow-none transition-colors hover:bg-surface-green focus-visible:!bg-surface-green aria-selected:!bg-surface-yellow aria-selected:font-semibold disabled:opacity-40',
    button: 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#173f30] bg-[#ffe15c] px-4 py-2 text-sm font-bold text-[#102c22] transition hover:bg-[#ffeb93] disabled:cursor-not-allowed disabled:opacity-45',
    secondary:
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#b9c8c0] bg-white px-4 py-2 text-sm font-semibold text-[#173f30] transition hover:bg-[#f0f7ee] disabled:cursor-not-allowed disabled:opacity-45',
    muted: 'text-sm leading-6 text-[#6b7972]',
    table: 'w-full min-w-[660px] border-collapse text-left text-sm',
    th: 'border-b border-[#e3e7df] bg-[#f7f9f3] px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#62746a]',
    td: 'border-b border-[#edf0ea] px-5 py-4 align-middle',
};
