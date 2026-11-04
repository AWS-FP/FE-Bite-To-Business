import { useTranslation } from 'react-i18next';

interface AuthJournalProps {
    className: string;
}

// Khung bài giới thiệu trên hai trang đăng nhập và đăng ký.
// Nội dung VI/EN nằm ở auth.heroTitle và auth.heroDescription.
export default function AuthJournal({ className }: AuthJournalProps) {
    const { t } = useTranslation();

    return (
        <article
            className={`auth-journal absolute -rotate-[1.5deg] bg-auth-cream p-[22px] text-auth-ink shadow-[8px_8px_0_var(--color-auth-ink)] ${className}`}
        >
            <div
                className="auth-journal-masthead flex items-center justify-between gap-2 border-0 border-b-[3px]
 border-solid border-store-line pb-2 font-label text-[9px] font-bold tracking-[1.2px] uppercase"
            >
                <span>The Bite to Business Journal</span>
                <span className="font-normal">2026</span>
            </div>

            <p className="auth-journal-category mt-[14px] mb-0 flex items-center gap-2 font-label text-[12px] font-bold">
                <span className="text-danger-strong">{t('auth.food')}</span>
                <span className="border-0 border-l border-solid border-store-line/31 pl-2 text-auth-muted">
                    {t('auth.supplyChain')}
                </span>
            </p>

            <h2 className="mt-2 mb-0 font-subheading text-[28px] leading-[1.08] font-bold tracking-[-0.8px]">
                {t('auth.heroTitle')}
            </h2>
            <p
                className="auth-journal-description mt-[14px] mb-0 border-0 border-l-2 border-solid border-danger-strong pl-3
 font-subtext text-[14px] leading-[1.4] font-normal text-auth-muted"
            >
                {t('auth.heroDescription')}
            </p>
        </article>
    );
}
