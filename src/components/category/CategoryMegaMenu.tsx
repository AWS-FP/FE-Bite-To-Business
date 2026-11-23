import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, FolderOpen, RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { getHomeCategories } from '@/services/customer/homeService';
import type { HomeCategory } from '@/types/customer/home';
import { ROUTES } from '@/router/routes';

interface CategoryMegaMenuProps {
    open: boolean;
    onClose: () => void;
    top: number;
}

function iconForCategory(category: HomeCategory): string | null {
    // Category visuals come from the Customer API; dessert uses its dedicated cake SVG.
    const name = `${category.nameEn} ${category.nameVi} ${category.code}`.toLowerCase();
    if (/bakery|dessert|bánh ngọt|bánh và/.test(name))
        return '/icons/cake-svgrepo-com.svg';
    return category.imageSvg?.trim() || null;
}

export default function CategoryMegaMenu({ open, onClose, top }: CategoryMegaMenuProps) {
    const { t, i18n } = useTranslation('storefront');
    const navigate = useNavigate();
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(0);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();
        const escape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', escape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', escape);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        const controller = new AbortController();
        getHomeCategories(controller.signal)
            .then((items) => {
                if (controller.signal.aborted) return;
                setCategories(items.filter((cat) => !cat.parentId));
                setSelectedId((current) =>
                    items.some((cat) => cat.id === current) ? current : (items[0]?.id ?? null),
                );
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [open, reload]);

    const selected = useMemo(
        () => categories.find((item) => item.id === selectedId) ?? categories[0] ?? null,
        [categories, selectedId],
    );
    const english = i18n.resolvedLanguage?.startsWith('en');
    const name = useCallback(
        (item: HomeCategory) => (english ? item.nameEn : item.nameVi),
        [english],
    );
    function goToCategory(id: string) {
        onClose();
        navigate(`${ROUTES.CATALOG}?category=${encodeURIComponent(id)}`);
    }

    if (!open) return null;

    return (
        <div
            id="btb-category-mega-menu"
            className="fixed inset-x-0 bottom-0 z-[100] flex font-body text-store-ink"
            style={{ top: `${Math.max(0, top)}px` }}
        >
            <div
                className="absolute inset-0 bg-store-dark/70 backdrop-blur-[3px]"
                onClick={onClose}
                aria-hidden="true"
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="btb-category-title"
                className="relative flex h-full w-[min(1050px,100vw)] flex-col overflow-hidden rounded-tr-3xl bg-store-cream shadow-2xl"
            >
                <div className="flex shrink-0 items-center justify-between gap-4 bg-store-green px-5 py-5 text-white sm:px-8">
                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-widest text-store-yellow">
                            {t('customerUI.categoriesTag')}
                        </p>
                        <h2
                            id="btb-category-title"
                            className="m-0 mt-1 font-subheading text-2xl font-bold"
                        >
                            {t('customerUI.categoryTitle')}
                        </h2>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label={t('customerUI.categoryClose')}
                        className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/30"
                    >
                        <X size={23} />
                    </button>
                </div>
                {loading ? (
                    <div role="status" className="p-8 text-sm">
                        {t('customerUI.categoryLoading')}
                    </div>
                ) : error ? (
                    <div className="p-8">
                        <p role="alert">{t('customerUI.categoryError')}</p>
                        <button
                            type="button"
                            onClick={() => {
                                setError(false);
                                setLoading(true);
                                setReload((v) => v + 1);
                            }}
                            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-store-yellow px-4 py-2 text-sm font-bold"
                        >
                            <RefreshCw size={16} />
                            {t('customerUI.categoryRetry')}
                        </button>
                    </div>
                ) : (
                    <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[270px_minmax(0,1fr)]">
                        <nav
                            aria-label={t('customerUI.categorySelect')}
                            className="max-h-[190px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-store-line bg-white p-3 sm:max-h-none sm:border-b-0 sm:border-r"
                        >
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setSelectedId(category.id)}
                                    aria-current={selected?.id === category.id ? 'true' : undefined}
                                    className={`my-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold transition ${selected?.id === category.id ? 'bg-store-yellow text-store-ink' : 'bg-transparent text-store-ink hover:bg-surface-green'}`}
                                >
                                    {iconForCategory(category) ? (
                                        <img
                                            src={iconForCategory(category)!}
                                            width={27}
                                            height={27}
                                            alt=""
                                            className="h-7 w-7 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <FolderOpen
                                            size={23}
                                            className="shrink-0 text-store-green"
                                        />
                                    )}
                                    <span className="min-w-0 flex-1">{name(category)}</span>
                                    <ChevronRight size={15} className="shrink-0 opacity-50" />
                                </button>
                            ))}
                        </nav>
                        <div className="min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 sm:p-8">
                            {selected && (
                                <>
                                    <p className="m-0 text-[11px] font-extrabold uppercase tracking-wider text-store-muted">
                                        {t('customerUI.categoryBrowsing')}
                                    </p>
                                    <h3 className="m-0 mt-2 font-subheading text-3xl font-bold">
                                        {name(selected)}
                                    </h3>
                                    <p className="mt-2 text-sm text-store-muted">
                                        {english ? selected.descriptionEn : selected.descriptionVi}
                                    </p>
                                    <div className="my-5 flex flex-wrap items-center gap-3">
                                        <span className="rounded-full bg-surface-green px-4 py-2 text-xs font-bold text-store-green">
                                            {t('customerUI.categoryProducts', {
                                                count: selected.productCount,
                                            })}
                                        </span>
                                        <button
                                            onClick={() => goToCategory(selected.id)}
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-xl bg-store-green px-4 py-2 text-xs font-bold text-white hover:bg-store-dark"
                                        >
                                            {t('customerUI.categorySearch')}
                                            <ChevronRight size={15} />
                                        </button>
                                    </div>
                                    <h4 className="mb-4 font-subheading text-base font-bold">
                                        {t('customerUI.categoryChildren')}
                                    </h4>
                                    {selected.children?.length ? (
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {selected.children.map((child) => (
                                                <button
                                                    type="button"
                                                    key={child.id}
                                                    onClick={() => goToCategory(child.id)}
                                                    className="flex min-h-[88px] cursor-pointer items-center gap-3 rounded-2xl border border-store-line bg-white p-4 text-left text-sm font-semibold transition hover:border-store-green hover:bg-surface-green"
                                                >
                                                    <FolderOpen
                                                        size={23}
                                                        className="shrink-0 text-store-green"
                                                    />
                                                    <span>{name(child)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-store-muted">
                                            {t('customerUI.categoryEmptyChildren')}
                                        </p>
                                    )}
                                </>
                            )}
                            {categories.length === 0 && (
                                <p className="text-sm">{t('customerUI.emptyCategories')}</p>
                            )}
                        </div>
                    </div>
                )}
                <div className="flex shrink-0 items-center justify-between bg-surface-green px-5 py-3 text-xs text-store-green sm:px-8">
                    <span>{t('customerUI.categoryCount', { count: categories.length })}</span>
                    <Link
                        onClick={onClose}
                        to={ROUTES.CATALOG}
                        className="font-bold text-store-green"
                    >
                        {t('customerUI.showAllProducts')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
