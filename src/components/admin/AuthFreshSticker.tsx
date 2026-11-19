import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AuthFreshSticker({ className }: { className: string }) {
    const { t } = useTranslation();
    return <div className={`auth-fresh-sticker absolute flex -rotate-[10deg] items-center gap-2 rounded-[4px] border-2 border-auth-ink bg-store-pink px-3 py-2 text-auth-ink shadow-[4px_4px_0_var(--color-auth-ink)] ${className}`}>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-auth-ink bg-store-yellow"><Leaf size={18} aria-hidden="true" /></span>
        <span className="font-label text-[11px] leading-tight font-bold uppercase tracking-[0.06em]">{t('auth.fresh')}<br />{t('auth.everyMorning')}</span>
    </div>;
}
