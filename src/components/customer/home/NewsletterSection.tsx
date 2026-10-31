import { useHomeModelContext } from './HomeModel.tsx';

export default function NewsletterSection() {
    const { t } = useHomeModelContext();
    return (
        <section className="mx-auto max-w-[1320px] px-5 pt-6 pb-16">
            <div className="flex flex-col justify-between gap-6 rounded-[26px] border-2 border-solid border-[#14132b] bg-[#FDE047] p-8 sm:p-10 text-[#14132b] shadow-[7px_7px_0_#14132b] lg:flex-row lg:items-center">
                <div>
                    <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#14132b]">
                        {t('homePage.newsletterTag', 'FOR PURCHASING MANAGERS & F&B OWNERS')}
                    </span>
                    <h2 className="m-0 mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#14132b]">
                        {t(
                            'homePage.newsletterTitle',
                            'Get Weekly Wholesale Price Lists across 14 Categories',
                        )}
                    </h2>
                    <p className="m-0 mt-1 text-xs text-[#374151]">
                        {t(
                            'homePage.newsletterDesc',
                            'Automatically updated weekly price books with volume discount tiers sent straight to your inbox.',
                        )}
                    </p>
                </div>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full max-w-[520px] flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="email"
                        placeholder={t(
                            'homePage.newsletterPlaceholder',
                            'Enter your business email or Zalo phone number...',
                        )}
                        className="h-12 flex-1 rounded-xl border-2 border-solid border-[#14132b] bg-white px-4 text-xs text-[#14132b] outline-none placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        className="h-12 shrink-0 cursor-pointer rounded-xl border-2 border-solid border-white bg-[#14132b] px-6 text-xs font-extrabold text-white transition-transform hover:-translate-y-0.5"
                    >
                        {t('homePage.newsletterBtn', 'Get Price List Now')}
                    </button>
                </form>
            </div>
        </section>
    );
}
