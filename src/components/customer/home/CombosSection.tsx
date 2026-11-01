import { useHomeModelContext } from './HomeModel.tsx';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOME_COMBO_PLANS } from '../../../constants/customer/homeData';

export default function CombosSection() {
    const { t } = useHomeModelContext();
    return (
        <section id="fb-combo-packages" className="mx-auto max-w-[1320px] px-5 pt-12 pb-8">
            <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#FACC15]">
                    {t('homePage.comboTag', 'SAVE UP TO 20% WITH BUNDLED PACKAGES')}
                </span>
                <h2 className="m-0 mt-1 font-['Times_New_Roman',Georgia,serif] lining-nums text-3xl sm:text-4xl font-bold text-[#FAF3E3]">
                    {t('homePage.comboTitle', 'Home Kitchen & F&B Ingredient Combos')}
                </h2>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {HOME_COMBO_PLANS.map((combo) => (
                    <div
                        key={combo.id}
                        className={`flex h-full flex-col rounded-[22px] border-2 border-solid border-[#14132b] ${combo.cardBg} p-6 text-[#14132b] shadow-[6px_6px_0_#14132b]`}
                    >
                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className={`rounded-full border border-solid border-[#14132b] ${combo.audienceBadgeBg} px-3 py-1 text-[10px] font-extrabold uppercase`}
                                >
                                    {t(`homeCombos.${combo.id}.audienceBadge`, combo.audienceBadge)}
                                </span>
                                <span className="text-xs font-extrabold text-[#DC2626]">
                                    {t(`homeCombos.${combo.id}.highlightText`, combo.highlightText)}
                                </span>
                            </div>

                            <h3 className="m-0 mt-4 font-['Times_New_Roman',Georgia,serif] lining-nums text-xl font-bold">{t(`homeCombos.${combo.id}.title`, combo.title)}</h3>
                            <p className="m-0 mt-1.5 text-xs leading-relaxed text-[#4B5563]">
                                {t(`homeCombos.${combo.id}.description`, combo.description)}
                            </p>

                            <ul className="mt-4 list-none space-y-2 rounded-xl border border-solid border-[#14132b]/20 bg-white/80 p-4 text-xs">
                                {combo.features.map((feat, index) => (
                                    <li key={feat} className="flex items-start gap-2">
                                        <Check
                                            size={14}
                                            className="mt-0.5 shrink-0 text-[#15803D]"
                                        />
                                        <span>{t(`homeCombos.${combo.id}.features.${index}`, feat)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fixed footer rows: notes, then price and CTA. */}
                        <div className="mt-auto grid grid-rows-[24px_56px] border-0 border-t border-solid border-[#14132b]/15 pt-4">
                            <p
                                className={`font-price m-0 flex h-6 items-center text-[11px] leading-5 text-gray-500 ${combo.oldPrice ? 'line-through' : ''}`}
                            >
                                {t(`homeCombos.${combo.id}.priceNote`, combo.priceNote)}
                            </p>

                            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                                <div className="flex min-w-0 items-baseline gap-1 whitespace-nowrap">
                                    {/* Use Inter (font-price), NOT font-['Times_New_Roman',Georgia,serif] lining-nums: lining digits share one baseline. */}
                                    <span className="font-price text-[24px] font-extrabold leading-none lining-nums tabular-nums tracking-tight text-[#14132b]">
                                        {combo.price}
                                    </span>
                                    <span className="text-xs leading-none text-gray-600">
                                        {t(`homeCombos.${combo.id}.unit`, combo.unit)}
                                    </span>
                                </div>
                                <Link
                                    to={combo.ctaLink}
                                    className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-solid border-[#14132b] bg-[#FACC15] px-3 py-2 text-[11px] font-extrabold text-[#14132b] no-underline transition-colors hover:bg-[#FFE14D]"
                                >
                                    {t(`homeCombos.${combo.id}.ctaLabel`, combo.ctaLabel)}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
