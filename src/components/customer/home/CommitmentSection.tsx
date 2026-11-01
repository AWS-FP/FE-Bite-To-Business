import { useHomeModelContext } from './HomeModel.tsx';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CommitmentSection() {
    const { t } = useHomeModelContext();
    return (
        <section className="mx-auto max-w-[1320px] px-5 py-6">
            <div className="rounded-[26px] border-2 border-solid border-[#14132b] bg-[#EAF2EE] p-8 sm:p-10 text-[#14132b] shadow-[7px_7px_0_#14132b]">
                <span className="inline-block rounded-full border border-solid border-[#14132b] bg-[#FACC15] px-4 py-1 text-[11px] font-extrabold uppercase">
                    {t('homePage.b2bTag', 'FOR BUSINESSES & COOPERATIVES')}
                </span>

                <h2 className="m-0 mt-4 font-serif text-2xl sm:text-3xl font-bold text-[#14132b]">
                    {t('homePage.b2bTitle', 'Restaurants, Cafés & Corporate Offices')}
                </h2>

                <p className="m-0 mt-2 max-w-[780px] text-sm leading-relaxed text-[#374151]">
                    {t(
                        'homePage.b2bDesc',
                        'Price-stabilized wholesale food supply with full food safety certifications, tiered volume pricing, and automated e-VAT invoicing tailored for commercial kitchens.',
                    )}
                </p>

                <ul className="mt-5 list-none space-y-2.5 p-0 text-xs font-semibold text-[#14132b]">
                    <li className="flex items-center gap-2.5">
                        <Check size={16} className="text-[#15803D]" />
                        <span>
                            {t('homePage.b2bPerk1', 'Flexible weekly / monthly credit terms')}
                        </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                        <Check size={16} className="text-[#15803D]" />
                        <span>
                            {t(
                                'homePage.b2bPerk2',
                                'Automated e-VAT invoices & master supply contracts',
                            )}
                        </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                        <Check size={16} className="text-[#15803D]" />
                        <span>
                            {t(
                                'homePage.b2bPerk3',
                                'Custom portioning and vacuum packaging per Chef specs',
                            )}
                        </span>
                    </li>
                </ul>

                <div className="mt-7">
                    <Link
                        to="/register"
                        className="inline-block rounded-xl border-2 border-solid border-[#14132b] bg-[#14132b] px-6 py-3.5 text-xs font-extrabold text-white no-underline shadow-[4px_4px_0_#FACC15] transition-transform hover:-translate-y-0.5"
                    >
                        {t('homePage.b2bSubmitBtn', 'Submit B2B Application (2 mins)')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
