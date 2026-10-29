import { useHomeModelContext } from './HomeModel.tsx';
import { PARTNER_BRANDS } from '../../../constants/customer/homeData';

export default function PartnerStrip() {
    const { t } = useHomeModelContext();
    return (
        <section className="border-0 border-y-2 border-solid border-[#14132b] bg-[#FAF3E3] py-7 text-[#14132b]">
            <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-6 px-5 lg:flex-row lg:items-center">
                <h2 className="m-0 max-w-[420px] font-serif text-lg sm:text-xl font-bold leading-snug text-[#14132b]">
                    {t(
                        'homePage.partnerTitle',
                        'Bite to Business — Direct sourcing partner from certified farms & official importers.',
                    )}
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                    {PARTNER_BRANDS.map((partner) => (
                        <span
                            key={partner}
                            className="rounded-full border-2 border-solid border-[#14132b] bg-[#FACC15] px-5 py-2 text-xs font-extrabold tracking-wide text-[#14132b] shadow-[3px_3px_0_#14132b]"
                        >
                            {partner}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
