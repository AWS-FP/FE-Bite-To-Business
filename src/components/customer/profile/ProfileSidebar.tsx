import { Building2, FileText, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfileSidebar() {
    const { t } = useTranslation('profile');

    return (
        <aside className="sticky top-[245px] self-start overflow-hidden rounded-2xl border border-store-line bg-white">
            <nav aria-label={t('navigation')} className="p-3">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-store-muted">
                    {t('navigation')}
                </p>
                {[
                    { id: 'personal', label: t('personal'), Icon: Building2 },
                    { id: 'delivery', label: t('delivery'), Icon: MapPin },
                    { id: 'billing', label: t('billing'), Icon: FileText },
                ].map(({ id, label, Icon }) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-store-ink no-underline hover:bg-store-cream"
                    >
                        <Icon size={17} className="text-store-green" aria-hidden="true" />
                        {label}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
