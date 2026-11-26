import { useTranslation } from 'react-i18next';
/* Generated from the supplied HTML layout. Edit this section independently. */
type CatalogProps = {
    category: string;
    view: 'grid' | 'table';
    setCategory: (category: string) => void;
    setView: (view: 'grid' | 'table') => void;
    onAddToQuote: (itemKey: string) => void;
    showToast: (key: string) => void;
};

export default function LandingCatalog({
    category,
    view,
    setCategory,
    setView,
    onAddToQuote,
    showToast,
}: CatalogProps) {
    const { t } = useTranslation('storefront');
    return (
        <section
            className="py-12 sm:py-16"
            id="categories"
            style={{
                background: 'var(--bg-cream)',
                borderTop: 'var(--border-subtle)',
                borderBottom: 'var(--border-subtle)',
            }}
        >
            <div className="mx-auto max-w-[1320px] px-6">
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] items-end gap-8">
                    <div>
                        <span className="mb-2.5 inline-block rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3.5 py-1 font-label text-[15px] font-normal text-store-ink shadow-sm">{t('landing.catalog.eyebrow')}</span>
                        <h2 className="mb-2.5 font-subheading text-[clamp(26px,3vw,36px)] font-bold leading-[1.22] text-store-ink" style={{ marginBottom: '0' }}>
                            {t('landing.catalog.title')}
                        </h2>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>
                        {t('landing.catalog.descriptionStart')}{' '}
                        <strong>{t('landing.catalog.descriptionHighlight')}</strong>
                        {' '}{t('landing.catalog.descriptionEnd')}
                    </p>
                </div>
                <div className="mb-8 flex flex-wrap gap-3" id="categoryPillCloud">
                    <button
                        className={'group relative isolate inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-solid border-store-line bg-store-cream px-[22px] py-3 text-[14.5px] font-bold text-store-ink shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:-translate-x-0.5 [&.active]:-translate-y-0.5 [&.active]:bg-store-yellow' + (category === 'all' ? ' active' : '')}
                        data-cat="all"
                        type="button"
                        onClick={() => setCategory('all')}
                    >
                        <span style={{ position: 'relative', zIndex: '2' }}>{t('landing.catalog.all')}</span>
                        <span className="pointer-events-none absolute -right-1.5 -bottom-2 z-0 h-12 w-12 -rotate-12 text-store-ink opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-[0.18] [&_svg]:h-full [&_svg]:w-full">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2.5L14.4 8.6L20.5 11L14.4 13.4L12 19.5L9.6 13.4L3.5 11L9.6 8.6L12 2.5Z" />
                                <path d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z" />
                                <path d="M5 16L5.6 17.6L7.2 18.2L5.6 18.8L5 20.4L4.4 18.8L2.8 18.2L4.4 17.6L5 16Z" />
                            </svg>
                        </span>
                    </button>
                    <button
                        className={'group relative isolate inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-solid border-store-line bg-store-cream px-[22px] py-3 text-[14.5px] font-bold text-store-ink shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:-translate-x-0.5 [&.active]:-translate-y-0.5 [&.active]:bg-store-yellow' + (category === 'meat' ? ' active' : '')}
                        data-cat="meat"
                        type="button"
                        onClick={() => setCategory('meat')}
                    >
                        <span style={{ position: 'relative', zIndex: '2' }}>
                            {t('landing.catalog.meat')}
                        </span>
                        <span className="pointer-events-none absolute -right-1.5 -bottom-2 z-0 h-12 w-12 -rotate-12 text-store-ink opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-[0.18] [&_svg]:h-full [&_svg]:w-full">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15.5 4.5C18.5 4.5 21 7 21 10C21 15 14 20 8.5 20C5 20 3 17.8 3 14.5C3 9 8.5 4.5 15.5 4.5Z" />
                                <path d="M15 8.5C16.3807 8.5 17.5 9.61929 17.5 11C17.5 12.3807 16.3807 13.5 15 13.5C13.6193 13.5 12.5 12.3807 12.5 11C12.5 9.61929 13.6193 8.5 15 8.5Z" />
                                <path d="M7.5 15.5C9.5 15.5 11.5 14 12.5 12" />
                            </svg>
                        </span>
                    </button>
                    <button
                        className={'group relative isolate inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-solid border-store-line bg-store-cream px-[22px] py-3 text-[14.5px] font-bold text-store-ink shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:-translate-x-0.5 [&.active]:-translate-y-0.5 [&.active]:bg-store-yellow' + (category === 'seafood' ? ' active' : '')}
                        data-cat="seafood"
                        type="button"
                        onClick={() => setCategory('seafood')}
                    >
                        <span style={{ position: 'relative', zIndex: '2' }}>{t('landing.catalog.seafood')}</span>
                        <span className="pointer-events-none absolute -right-1.5 -bottom-2 z-0 h-12 w-12 -rotate-12 text-store-ink opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-[0.18] [&_svg]:h-full [&_svg]:w-full">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M2 12C5.5 7.5 11 6.5 16.5 9.5C18.8 10.8 20.5 12 22 12C20.5 12 18.8 13.2 16.5 14.5C11 17.5 5.5 16.5 2 12Z" />
                                <path d="M17 12L21.5 8V16L17 12Z" />
                                <circle cx="7.5" cy="11.5" r="1" />
                                <path d="M11 9.5C10.2 11 10.2 13 11 14.5" />
                            </svg>
                        </span>
                    </button>
                    <button
                        className={'group relative isolate inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-solid border-store-line bg-store-cream px-[22px] py-3 text-[14.5px] font-bold text-store-ink shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:-translate-x-0.5 [&.active]:-translate-y-0.5 [&.active]:bg-store-yellow' + (category === 'prepared' ? ' active' : '')}
                        data-cat="prepared"
                        type="button"
                        onClick={() => setCategory('prepared')}
                    >
                        <span style={{ position: 'relative', zIndex: '2' }}>
                            {t('landing.catalog.prepared')}
                        </span>
                        <span className="pointer-events-none absolute -right-1.5 -bottom-2 z-0 h-12 w-12 -rotate-12 text-store-ink opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-[0.18] [&_svg]:h-full [&_svg]:w-full">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 15.5C3 10.3 7 6 12 6C17 6 21 10.3 21 15.5C21 17.5 19.4 19 17.5 19H6.5C4.6 19 3 17.5 3 15.5Z" />
                                <path d="M6.5 8.5C8 10 9.5 10 12 8.5C14.5 10 16 10 17.5 8.5" />
                                <path d="M7.5 14.5C9.5 15.8 14.5 15.8 16.5 14.5" />
                            </svg>
                        </span>
                    </button>
                    <button
                        className={'group relative isolate inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-solid border-store-line bg-store-cream px-[22px] py-3 text-[14.5px] font-bold text-store-ink shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:-translate-x-0.5 [&.active]:-translate-y-0.5 [&.active]:bg-store-yellow' + (category === 'veg' ? ' active' : '')}
                        data-cat="veg"
                        type="button"
                        onClick={() => setCategory('veg')}
                    >
                        <span style={{ position: 'relative', zIndex: '2' }}>{t('landing.catalog.produce')}</span>
                        <span className="pointer-events-none absolute -right-1.5 -bottom-2 z-0 h-12 w-12 -rotate-12 text-store-ink opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-[0.18] [&_svg]:h-full [&_svg]:w-full">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17 3C11 3 5 7.5 5 14.5C5 17.8 7.2 20 10.5 20C17.5 20 21 14 21 8C21 5 19.5 3 17 3Z" />
                                <path d="M5 19L15 9" />
                                <path d="M11 13L11.5 8.5" />
                                <path d="M14 12L17.5 11.5" />
                            </svg>
                        </span>
                    </button>
                    <button
                        className={'group relative isolate inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-solid border-store-line bg-store-cream px-[22px] py-3 text-[14.5px] font-bold text-store-ink shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:-translate-x-0.5 [&.active]:-translate-y-0.5 [&.active]:bg-store-yellow' + (category === 'dairy' ? ' active' : '')}
                        data-cat="dairy"
                        type="button"
                        onClick={() => setCategory('dairy')}
                    >
                        <span style={{ position: 'relative', zIndex: '2' }}>
                            {t('landing.catalog.dairy')}
                        </span>
                        <span className="pointer-events-none absolute -right-1.5 -bottom-2 z-0 h-12 w-12 -rotate-12 text-store-ink opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-[0.18] [&_svg]:h-full [&_svg]:w-full">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 11L13.5 4.5C17.5 6 20.5 9 21 13.5V18.5C21 19.3 20.3 20 19.5 20H4.5C3.7 20 3 19.3 3 18.5V11Z" />
                                <path d="M3 11H21" />
                                <circle cx="8.5" cy="15.5" r="1.5" />
                                <circle cx="14.5" cy="16.5" r="1" />
                                <circle cx="15" cy="13.2" r="1" />
                            </svg>
                        </span>
                    </button>
                    <button
                        className={'group relative isolate inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-solid border-store-line bg-store-cream px-[22px] py-3 text-[14.5px] font-bold text-store-ink shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-store-yellow [&.active]:-translate-x-0.5 [&.active]:-translate-y-0.5 [&.active]:bg-store-yellow' + (category === 'bakery' ? ' active' : '')}
                        data-cat="bakery"
                        type="button"
                        onClick={() => setCategory('bakery')}
                    >
                        <span style={{ position: 'relative', zIndex: '2' }}>
                            {t('landing.catalog.bakery')}
                        </span>
                        <span className="pointer-events-none absolute -right-1.5 -bottom-2 z-0 h-12 w-12 -rotate-12 text-store-ink opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-[0.18] [&_svg]:h-full [&_svg]:w-full">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4.5 16.5C2.8 14.5 3 10.5 6 8C9 5.5 15 5.5 18 8C21 10.5 21.2 14.5 19.5 16.5C18.2 18 16 17.5 15 15.5C13.5 13 10.5 13 9 15.5C8 17.5 5.8 18 4.5 16.5Z" />
                                <path d="M8.5 7C9.5 9.5 9.5 12 8.8 14.5" />
                                <path d="M15.5 7C14.5 9.5 14.5 12 15.2 14.5" />
                            </svg>
                        </span>
                    </button>
                </div>
                <div id="catalog-preview">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '18px',
                            flexWrap: 'wrap',
                            gap: '10px',
                        }}
                    >
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>
                            {t('landing.catalog.featured')}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                className={view === 'grid' ? 'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink' : 'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-cream text-store-ink hover:bg-store-yellow'}
                                id="btnModeGrid"
                                style={{ padding: '7px 16px', fontSize: '12.5px' }}
                                onClick={() => setView('grid')}
                            >
                                {t('landing.catalog.grid')}
                            </button>
                            <button
                                type="button"
                                className={view === 'table' ? 'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink' : 'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-cream text-store-ink hover:bg-store-yellow'}
                                id="btnModeTable"
                                style={{ padding: '7px 16px', fontSize: '12.5px' }}
                                onClick={() => setView('table')}
                            >
                                {t('landing.catalog.table')}
                            </button>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
                        id="productGridContainer"
                        style={{ display: view === 'grid' ? 'grid' : 'none' }}
                    >
                        <div
                            className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-solid border-store-line bg-white shadow-sm transition-transform hover:-translate-y-1"
                            data-category="meat"
                            style={{
                                display:
                                    category === 'all' || category === 'meat' ? 'flex' : 'none',
                            }}
                        >
                            <div className="has-svg-bg relative flex h-[155px] items-center justify-center border-b border-solid border-store-line bg-surface-green text-[50px]">
                                <div className="absolute top-3 left-3 flex gap-1.5" style={{ zIndex: '3' }}>
                                    <span className="rounded-full border-[1.5px] border-solid border-store-ink bg-store-coral px-2.5 py-[3px] text-[11px] font-extrabold text-white shadow-none">{t('landing.catalog.bestSeller')}</span>
                                </div>
                                <div className="svg-bg-watermark watermark-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M15.5 4.5C18.5 4.5 21 7 21 10C21 15 14 20 8.5 20C5 20 3 17.8 3 14.5C3 9 8.5 4.5 15.5 4.5Z" />
                                        <path d="M15 8.5C16.3807 8.5 17.5 9.61929 17.5 11C17.5 12.3807 16.3807 13.5 15 13.5C13.6193 13.5 12.5 12.3807 12.5 11C12.5 9.61929 13.6193 8.5 15 8.5Z" />
                                        <path d="M7.5 15.5C9.5 15.5 11.5 14 12.5 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2 p-4">
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                    }}
                                >
                                    MDL-PORK-BELLY-500G
                                </div>
                                <div className="font-subheading text-[17px] font-normal leading-[1.3] text-store-ink">{t('landing.catalog.porkTitle')}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-body)' }}>
                                    {t('landing.catalog.porkUnit')}
                                </div>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span className="font-price text-lg font-extrabold text-store-green tabular-nums">{t('landing.catalog.porkPrice')}</span>
                                    <span className="font-price text-xs text-[var(--err-4)] line-through tabular-nums">{t('landing.catalog.porkOldPrice')}</span>
                                </div>
                                <div className="rounded-lg border-[1.5px] border-solid border-store-ink bg-[var(--yellow-tint)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--warn-2)]">
                                    {t('landing.catalog.porkTier')}{' '}
                                    <strong>{t('landing.catalog.porkTierPrice')}</strong>{' '}• 30+:
                                    <strong>{t('landing.catalog.porkLargeTierPrice')}</strong>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink"
                                    data-item={t('landing.catalog.porkName')}
                                    style={{
                                        width: '100%',
                                        padding: '9px',
                                        fontSize: '13px',
                                        marginTop: 'auto',
                                    }}
                                    onClick={() => onAddToQuote('landing.catalog.porkName')}
                                >
                                    {t('landing.catalog.addQuote')}
                                </button>
                            </div>
                        </div>
                        <div
                            className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-solid border-store-line bg-white shadow-sm transition-transform hover:-translate-y-1"
                            data-category="prepared"
                            style={{
                                display:
                                    category === 'all' || category === 'prepared' ? 'flex' : 'none',
                            }}
                        >
                            <div className="has-svg-bg relative flex h-[155px] items-center justify-center border-b border-solid border-store-line bg-surface-green text-[50px]">
                                <div className="absolute top-3 left-3 flex gap-1.5" style={{ zIndex: '3' }}>
                                    <span className="rounded-full border-[1.5px] border-solid border-store-ink bg-store-yellow px-2.5 py-[3px] text-[11px] font-extrabold text-store-ink shadow-none">{t('landing.catalog.new')}</span>
                                    <span className="rounded-full border-[1.5px] border-solid border-store-ink bg-store-pink px-2.5 py-[3px] text-[11px] font-extrabold text-store-ink shadow-none">{t('landing.catalog.preparedBadge')}</span>
                                </div>
                                <div className="svg-bg-watermark watermark-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 15.5C3 10.3 7 6 12 6C17 6 21 10.3 21 15.5C21 17.5 19.4 19 17.5 19H6.5C4.6 19 3 17.5 3 15.5Z" />
                                        <path d="M6.5 8.5C8 10 9.5 10 12 8.5C14.5 10 16 10 17.5 8.5" />
                                        <path d="M7.5 14.5C9.5 15.8 14.5 15.8 16.5 14.5" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2 p-4">
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                    }}
                                >
                                    MD-PREP-003
                                </div>
                                <div className="font-subheading text-[17px] font-normal leading-[1.3] text-store-ink">
                                    {t('landing.catalog.springRollTitle')}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-body)' }}>
                                    {t('landing.catalog.packUnit')}
                                </div>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span className="font-price text-lg font-extrabold text-store-green tabular-nums">{t('landing.catalog.springRollPrice')}</span>
                                    <span className="font-price text-xs text-[var(--err-4)] line-through tabular-nums">{t('landing.catalog.springRollOldPrice')}</span>
                                </div>
                                <div className="rounded-lg border-[1.5px] border-solid border-store-ink bg-[var(--yellow-tint)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--warn-2)]">
                                    {t('landing.catalog.springRollTier')}{' '}
                                    <strong>{t('landing.catalog.springRollTierPrice')}</strong>{' '}• 40+:
                                    <strong>{t('landing.catalog.springRollLargeTierPrice')}</strong>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink"
                                    data-item={t('landing.catalog.springRollName')}
                                    style={{
                                        width: '100%',
                                        padding: '9px',
                                        fontSize: '13px',
                                        marginTop: 'auto',
                                    }}
                                    onClick={() => onAddToQuote('landing.catalog.springRollName')}
                                >
                                    {t('landing.catalog.addQuote')}
                                </button>
                            </div>
                        </div>
                        <div
                            className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-solid border-store-line bg-white shadow-sm transition-transform hover:-translate-y-1"
                            data-category="prepared"
                            style={{
                                display:
                                    category === 'all' || category === 'prepared' ? 'flex' : 'none',
                            }}
                        >
                            <div className="has-svg-bg relative flex h-[155px] items-center justify-center border-b border-solid border-store-line bg-surface-green text-[50px]">
                                <div className="absolute top-3 left-3 flex gap-1.5" style={{ zIndex: '3' }}>
                                    <span className="rounded-full border-[1.5px] border-solid border-store-ink bg-store-pink px-2.5 py-[3px] text-[11px] font-extrabold text-store-ink shadow-none">{t('landing.catalog.preparedBadge')}</span>
                                </div>
                                <div className="svg-bg-watermark watermark-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="3" y1="21" x2="21" y2="3" />
                                        <circle cx="8.5" cy="15.5" r="2.8" />
                                        <circle cx="12.5" cy="11.5" r="2.8" />
                                        <circle cx="16.5" cy="7.5" r="2.8" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2 p-4">
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                    }}
                                >
                                    MD-PREP-002
                                </div>
                                <div className="font-subheading text-[17px] font-normal leading-[1.3] text-store-ink">{t('landing.catalog.beefBallTitle')}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-body)' }}>
                                    {t('landing.catalog.packUnit')}
                                </div>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span className="font-price text-lg font-extrabold text-store-green tabular-nums">{t('landing.catalog.beefBallPrice')}</span>
                                </div>
                                <div className="rounded-lg border-[1.5px] border-solid border-store-ink bg-[var(--yellow-tint)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--warn-2)]">
                                    {t('landing.catalog.beefBallTier')}{' '}
                                    <strong>{t('landing.catalog.beefBallTierPrice')}</strong>{' '}• 25+:
                                    <strong>{t('landing.catalog.beefBallLargeTierPrice')}</strong>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink"
                                    data-item={t('landing.catalog.beefBallName')}
                                    style={{
                                        width: '100%',
                                        padding: '9px',
                                        fontSize: '13px',
                                        marginTop: 'auto',
                                    }}
                                    onClick={() => onAddToQuote('landing.catalog.beefBallName')}
                                >
                                    {t('landing.catalog.addQuote')}
                                </button>
                            </div>
                        </div>
                        <div
                            className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-solid border-store-line bg-white shadow-sm transition-transform hover:-translate-y-1"
                            data-category="bakery"
                            style={{
                                display:
                                    category === 'all' || category === 'bakery' ? 'flex' : 'none',
                            }}
                        >

                            <div className="has-svg-bg relative flex h-[155px] items-center justify-center border-b border-solid border-store-line bg-surface-green text-[50px]">
                                <div className="svg-bg-watermark watermark-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M4.5 16.5C2.8 14.5 3 10.5 6 8C9 5.5 15 5.5 18 8C21 10.5 21.2 14.5 19.5 16.5C18.2 18 16 17.5 15 15.5C13.5 13 10.5 13 9 15.5C8 17.5 5.8 18 4.5 16.5Z" />
                                        <path d="M8.5 7C9.5 9.5 9.5 12 8.8 14.5" />
                                        <path d="M15.5 7C14.5 9.5 14.5 12 15.2 14.5" />
                                    </svg>
                                </div>

                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-store-ink/72 px-3 text-center text-[13px] font-extrabold text-store-yellow backdrop-blur-[2px]">
                                    {t('landing.catalog.outOfStock')}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2 p-4">
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                    }}
                                >
                                    MD-BAKE-001
                                </div>
                                <div className="font-subheading text-[17px] font-normal leading-[1.3] text-store-ink">
                                    {t('landing.catalog.croissantTitle')}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-body)' }}>
                                    {t('landing.catalog.croissantUnit')}
                                </div>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span
                                        className="font-price text-lg font-extrabold text-store-green tabular-nums"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {t('landing.catalog.croissantPrice')}
                                    </span>
                                </div>
                                <div
                                    className="rounded-lg border-[1.5px] border-solid border-store-ink bg-[var(--yellow-tint)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--warn-2)]"
                                    style={{
                                        background: 'var(--coral-soft-bg)',
                                        color: 'var(--coral)',
                                    }}
                                >
                                    {t('landing.catalog.unavailable')}
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm"
                                    disabled
                                    style={{
                                        width: '100%',
                                        padding: '9px',
                                        fontSize: '13px',
                                        marginTop: 'auto',
                                        background: 'var(--color-surface-soft)',
                                        color: 'var(--color-store-muted)',
                                    }}
                                >
                                    {t('landing.catalog.outOfStock')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            background: 'var(--surface-white)',
                            border: 'var(--border-card)',
                            borderRadius: 'var(--radius-md)',
                            padding: '18px 22px',
                            marginTop: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '14px',
                            boxShadow: 'var(--shadow-soft)',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontFamily: 'var(--font-subheading)',
                                    fontWeight: '800',
                                    fontSize: '17px',
                                    color: 'var(--navy)',
                                }}
                            >
                                {t('landing.catalog.requestTitle')}
                            </div>
                            <div style={{ fontSize: '13.5px', color: 'var(--text-body)' }}>
                                {t('landing.catalog.requestStart')}{' '}
                                <strong>Bite to Business</strong>
                                {' '}{t('landing.catalog.requestEnd')}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-cream text-store-ink hover:bg-store-yellow"
                            id="btnRequestNewProduct"
                            style={{ padding: '9px 18px', fontSize: '13px' }}
                            onClick={() =>
                                showToast(
                                    'landing.catalog.requestToast',
                                )
                            }
                        >
                            {t('landing.catalog.requestButton')}
                        </button>
                    </div>
                    <div
                        className="hidden overflow-x-auto rounded-[var(--radius-md)] border border-solid border-store-line bg-store-cream shadow-sm"
                        id="productTableContainer"
                        style={{ display: view === 'table' ? 'block' : 'none' }}
                    >
                        <table className="w-full border-collapse text-sm [&_td]:border-b-[1.5px] [&_td]:border-solid [&_td]:border-store-ink [&_td]:px-4 [&_td]:py-3.5 [&_td]:text-store-ink [&_th]:border-b-[2.5px] [&_th]:border-solid [&_th]:border-store-ink [&_th]:bg-store-ink [&_th]:px-4 [&_th]:py-3.5 [&_th]:text-left [&_th]:font-heading [&_th]:font-bold [&_th]:text-store-yellow">
                            <thead>
                                <tr>
                                    <th>{t('landing.catalog.skuColumn')}</th>
                                    <th>{t('landing.catalog.unitColumn')}</th>
                                    <th>{t('landing.catalog.retailColumn')}</th>
                                    <th>{t('landing.catalog.volumeColumn')}</th>
                                    <th>{t('landing.catalog.stockColumn')}</th>
                                    <th>{t('landing.catalog.actionColumn')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>MDL-PORK-BELLY-500G</strong>{' '}{t('landing.catalog.porkTableTitle')}
                                    </td>
                                    <td>{t('landing.catalog.trayMoq')}</td>
                                    <td>{t('landing.catalog.porkTablePrice')}</td>
                                    <td>
                                        <strong style={{ color: 'var(--forest)' }}>
                                            {t('landing.catalog.porkTableTier')}
                                        </strong>
                                    </td>
                                    <td>
                                        <span
                                            style={{ color: 'var(--green-ok)', fontWeight: '700' }}
                                        >
                                            {t('landing.catalog.porkStock')}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink"
                                            data-item={t('landing.catalog.porkBulkName')}
                                            style={{ padding: '6px 14px', fontSize: '12px' }}
                                            onClick={() =>
                                                onAddToQuote('landing.catalog.porkBulkName')
                                            }
                                        >
                                            {t('landing.catalog.porkBulkAdd')}
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>MD-PREP-003</strong>{' '}{t('landing.catalog.springRollTableTitle')}
                                    </td>
                                    <td>{t('landing.catalog.packMoq')}</td>
                                    <td>{t('landing.catalog.springRollTablePrice')}</td>
                                    <td>
                                        <strong style={{ color: 'var(--forest)' }}>
                                            {t('landing.catalog.springRollTableTier')}
                                        </strong>
                                    </td>
                                    <td>
                                        <span
                                            style={{ color: 'var(--green-ok)', fontWeight: '700' }}
                                        >
                                            {t('landing.catalog.springRollStock')}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink"
                                            data-item={t('landing.catalog.springRollBulkName')}
                                            style={{ padding: '6px 14px', fontSize: '12px' }}
                                            onClick={() =>
                                                onAddToQuote('landing.catalog.springRollBulkName')
                                            }
                                        >
                                            {t('landing.catalog.springRollBulkAdd')}
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>MD-PREP-002</strong>{' '}{t('landing.catalog.beefBallTableTitle')}
                                    </td>
                                    <td>{t('landing.catalog.packMoq')}</td>
                                    <td>{t('landing.catalog.beefBallTablePrice')}</td>
                                    <td>
                                        <strong style={{ color: 'var(--forest)' }}>
                                            {t('landing.catalog.beefBallTableTier')}
                                        </strong>
                                    </td>
                                    <td>
                                        <span
                                            style={{ color: 'var(--green-ok)', fontWeight: '700' }}
                                        >
                                            {t('landing.catalog.beefBallStock')}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-solid border-store-line px-6 py-3 font-body text-[15px] font-bold no-underline shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sm bg-store-yellow text-store-ink"
                                            data-item={t('landing.catalog.beefBallBulkName')}
                                            style={{ padding: '6px 14px', fontSize: '12px' }}
                                            onClick={() => onAddToQuote('landing.catalog.beefBallBulkName')}
                                        >
                                            {t('landing.catalog.beefBallBulkAdd')}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}