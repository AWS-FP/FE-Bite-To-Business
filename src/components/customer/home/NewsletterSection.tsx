import { useHomeModelContext } from './HomeModel.tsx';

export default function NewsletterSection() {
    const { t } = useHomeModelContext();
    return (
        <section className="mx-auto max-w-[1320px] px-5 pt-6 pb-16">
            <div className="flex justify-between gap-6 rounded-[26px] border-2 border-solid border-store-ink bg-store-yellow p-10 text-store-ink shadow-[7px_7px_0_var(--color-store-ink)] flex-row items-center">
                <div>
                    <span className="block text-[11px] font-extrabold uppercase tracking-wider text-store-ink">
                        {t('homePage.newsletterTag', 'FOR PURCHASING MANAGERS & F&B OWNERS')}
                    </span>
                    <h2 className="m-0 mt-1 font-subheading lining-nums text-3xl font-bold text-store-ink">
                        {t(
                            'homePage.newsletterTitle',
                            'Get Weekly Wholesale Price Lists across 14 Categories',
                        )}
                    </h2>
                    <p className="m-0 mt-1 text-xs text-store-ink">
                        {t(
                            'homePage.newsletterDesc',
                            'Automatically updated weekly price books with volume discount tiers sent straight to your inbox.',
                        )}
                    </p>
                </div>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full max-w-[520px] gap-3 flex-row"
                >
                    <input
                        type="email"
                        placeholder={t(
                            'homePage.newsletterPlaceholder',
                            'Enter your business email or Zalo phone number...',
                        )}
                        className="h-12 flex-1 rounded-xl border-2 border-solid border-store-ink bg-white px-4 text-xs text-store-ink outline-none placeholder:text-store-placeholder"
                    />
                    <button
                        type="submit"
                        className="h-12 shrink-0 cursor-pointer rounded-xl border-2 border-solid border-white bg-store-ink px-6 text-xs font-extrabold text-white transition-transform hover:-translate-y-0.5"
                    >
                        {t('homePage.newsletterBtn', 'Get Price List Now')}
                    </button>
                </form>
            </div>
        </section>
    );
}
