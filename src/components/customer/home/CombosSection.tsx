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
                <h2 className="m-0 mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#FAF3E3]">
                    {t('homePage.comboTitle', 'Home Kitchen & F&B Ingredient Combos')}
                </h2>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {HOME_COMBO_PLANS.map((combo) => (
                    <div
                        key={combo.id}
                        className={`flex flex-col justify-between rounded-[22px] border-2 border-solid border-[#14132b] ${combo.cardBg} p-6 text-[#14132b] shadow-[6px_6px_0_#14132b]`}
                    >
                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className={`rounded-full border border-solid border-[#14132b] ${combo.audienceBadgeBg} px-3 py-1 text-[10px] font-extrabold uppercase`}
                                >
                                    {combo.audienceBadge}
                                </span>
                                <span className="text-xs font-extrabold text-[#DC2626]">
                                    {combo.highlightText}
                                </span>
                            </div>

                            <h3 className="m-0 mt-4 font-serif text-xl font-bold">{combo.title}</h3>
                            <p className="m-0 mt-1.5 text-xs leading-relaxed text-[#4B5563]">
                                {combo.description}
                            </p>

                            <ul className="mt-4 list-none space-y-2 rounded-xl border border-solid border-[#14132b]/20 bg-white/80 p-4 text-xs">
                                {combo.features.map((feat) => (
                                    <li key={feat} className="flex items-start gap-2">
                                        <Check
                                            size={14}
                                            className="mt-0.5 shrink-0 text-[#15803D]"
                                        />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-6 flex items-end justify-between border-0 border-t border-solid border-[#14132b]/15 pt-4">
                            <div>
                                <span
                                    className={`block text-[11px] text-gray-500 ${combo.oldPrice ? 'line-through' : ''}`}
                                >
                                    {combo.priceNote}
                                </span>
                                <span className="font-serif text-2xl font-bold text-[#14132b]">
                                    {combo.price}
                                </span>
                                <span className="text-xs text-gray-600"> {combo.unit}</span>
                            </div>

                            <Link
                                to={combo.ctaLink}
                                className="rounded-full border-2 border-solid border-[#14132b] bg-[#FACC15] px-5 py-2.5 text-xs font-extrabold text-[#14132b] no-underline shadow-[3px_3px_0_#14132b] transition-transform hover:-translate-y-0.5"
                            >
                                {combo.ctaLabel}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
