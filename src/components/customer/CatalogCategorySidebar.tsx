import Skeleton from '@/components/common/Skeleton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { HomeCategory } from '@/types/customer/home';
import CategoryIcon from '@/components/customer/CategoryIcon';

type Props = {
    categories: HomeCategory[];
    categoryError: boolean;
    categoryLoading?: boolean;
    categoryId?: string | null;
    comboActive?: boolean;
    onCategorySelect: (categoryId?: string) => void;
};

export default function CatalogCategorySidebar({
    categories,
    categoryError,
    categoryLoading = false,
    categoryId,
    comboActive = false,
    onCategorySelect,
}: Props) {
    const { t, i18n } = useTranslation('storefront');
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const [expanded, setExpanded] = useState<string | null>(null);
    const title = (item: HomeCategory) => (english ? item.nameEn : item.nameVi);

    return (
        <aside className="min-w-0 rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-[calc(var(--store-header-height,150px)+1rem)] lg:flex lg:max-h-[max(12rem,calc(100dvh-var(--store-header-height,150px)-1rem))] lg:flex-col">
            <h2 className="mb-3 mt-0 font-subheading text-base font-bold">
                {t('customerUI.categoryTitle')}
            </h2>
            {categoryError && (
                <p className="text-xs text-danger">{t('customerUI.categoryError')}</p>
            )}
            <button
                type="button"
                onClick={() => onCategorySelect()}
                aria-current={!comboActive && !categoryId ? 'page' : undefined}
                className={`mb-2 w-full rounded-lg border-0 px-3 py-3 text-left text-sm font-bold transition-colors ${
                    !comboActive && !categoryId
                        ? 'bg-store-yellow text-store-ink'
                        : 'bg-surface-soft hover:bg-surface-green'
                }`}
            >
                {t('customerUI.catalogAll')}
            </button>

            <Link
                to="/collections/combos"
                aria-current={comboActive ? 'page' : undefined}
                className={`mb-2 block rounded-lg px-3 py-3 text-sm font-bold text-store-ink no-underline transition-colors ${comboActive ? 'bg-store-yellow' : 'bg-surface-soft hover:bg-surface-green'}`}
            >
                {t('header.combos')}
            </Link>

            <nav
                aria-label={t('customerUI.categorySelect')}
                className="max-h-[62vh] overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-green lg:min-h-0 lg:max-h-none lg:flex-1"
                tabIndex={0}
            >
                {categoryLoading && <div aria-busy="true" className="space-y-2">{Array.from({length:8},(_,i)=><div key={i} className="flex items-center gap-2 border-b border-store-line py-2"><Skeleton className="size-9 shrink-0"/><Skeleton className="h-4 flex-1"/><Skeleton className="size-9 shrink-0 rounded-full"/></div>)}</div>}
                {categories.map((parent) => {
                    const selectedParent =
                        categoryId === parent.id ||
                        parent.children.some((child) => child.id === categoryId);
                    const open = expanded === parent.id || (expanded === null && selectedParent);

                    return (
                        <div
                            key={parent.id}
                            className="border-b border-store-line/60 py-1 last:border-b-0"
                        >
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    aria-current={categoryId === parent.id ? 'page' : undefined}
                                    onClick={() => {
                                        setExpanded(parent.id);
                                        onCategorySelect(parent.id);
                                    }}
                                    className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border-0 px-2.5 py-3 text-left text-sm font-semibold transition-colors ${
                                        selectedParent
                                            ? 'bg-surface-green text-store-green'
                                            : 'text-store-ink hover:bg-surface-soft'
                                    }`}
                                >
                                    <CategoryIcon category={parent} className="h-7 w-7 shrink-0" />
                                    <span className="min-w-0 flex-1 break-words leading-5">
                                        {title(parent)}
                                    </span>
                                </button>
                                {parent.children.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setExpanded(open ? '' : parent.id)}
                                        aria-label={t('customerUI.expandCategory', {
                                            name: title(parent),
                                        })}
                                        aria-expanded={open}
                                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-store-line text-store-green transition hover:bg-surface-green"
                                    >
                                        <ChevronDown
                                            size={17}
                                            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                )}
                            </div>

                            {parent.children.length > 0 && (
                                <div
                                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    aria-hidden={!open}
                                    inert={!open}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <div className="mb-2 ml-6 mt-1 space-y-0.5 border-0 border-l border-solid border-store-green/20 pl-3">
                                            {parent.children.map((child) => (
                                                <button
                                                    key={child.id}
                                                    type="button"
                                                    onClick={() => onCategorySelect(child.id)}
                                                    aria-current={
                                                        categoryId === child.id ? 'page' : undefined
                                                    }
                                                    className={`group flex w-full min-w-0 items-center gap-2 rounded-lg border-0 px-2 py-2 text-left text-xs leading-5 transition-colors ${
                                                        categoryId === child.id
                                                            ? 'bg-surface-green font-bold text-store-green'
                                                            : 'bg-transparent text-store-muted hover:bg-surface-soft hover:text-store-green'
                                                    }`}
                                                >
                                                    <ChevronRight
                                                        aria-hidden="true"
                                                        size={14}
                                                        strokeWidth={2}
                                                        className="shrink-0 text-store-green/70 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
                                                    />
                                                    <span className="min-w-0 flex-1 break-words">
                                                        {title(child)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}
