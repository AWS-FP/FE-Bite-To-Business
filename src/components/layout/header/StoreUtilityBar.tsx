import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';
import AboutBusinessDropdown from './AboutBusinessDropdown';

export default function StoreUtilityBar() {
    const { t } = useTranslation('storefront');
    const [deliveryArea, setDeliveryArea] = useState<'ho-chi-minh' | 'ha-noi'>('ho-chi-minh');
    const [isAreaOpen, setIsAreaOpen] = useState(false);
    const areaDropdownRef = useRef<HTMLDivElement>(null);

    const areaOptions = [
        { value: 'ho-chi-minh' as const, label: t('header.city') },
        { value: 'ha-noi' as const, label: t('header.hanoi') },
    ];

    const currentAreaLabel = deliveryArea === 'ho-chi-minh' ? t('header.city') : t('header.hanoi');

    useEffect(() => {
        function handleOutsideClick(e: globalThis.MouseEvent) {
            if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target as Node)) {
                setIsAreaOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className="border-0 border-b border-solid border-store-cream/15 bg-store-dark">
            <div className="mx-auto flex min-h-[40px] max-w-[1440px] flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-5 py-1.5 text-[11px] leading-[1.5] max-[640px]:px-3">
                <div className="flex items-center gap-3">
                    <div ref={areaDropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsAreaOpen((prev) => !prev)}
                            aria-expanded={isAreaOpen}
                            className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-3 text-[11px] text-white transition-colors focus:outline-none ${
                                isAreaOpen
                                    ? 'border-store-yellow bg-white/15 ring-1 ring-store-yellow'
                                    : 'border-store-cream/25 bg-white/8 hover:border-store-yellow/70'
                            }`}
                        >
                            <img
                                className="block shrink-0"
                                src="/images/storefront/map-pin.svg"
                                alt=""
                            />
                            <span className="whitespace-nowrap text-store-cream/85 max-[640px]:sr-only">
                                {t('header.deliveryArea')}
                            </span>
                            <span className="font-extrabold text-white whitespace-nowrap">
                                {currentAreaLabel}
                            </span>
                            <ChevronDown
                                size={12}
                                className={`ml-0.5 text-store-cream/80 transition-transform duration-200 ${
                                    isAreaOpen ? 'rotate-180 text-store-yellow' : ''
                                }`}
                                aria-hidden="true"
                            />
                        </button>

                        {isAreaOpen && (
                            <div className="absolute top-[38px] left-0 z-50 min-w-[200px] overflow-hidden rounded-xl border-2 border-solid border-store-ink bg-[#FAF3E3] p-1 text-store-ink shadow-[4px_4px_0_#14132b]">
                                {areaOptions.map((option) => {
                                    const isSelected = option.value === deliveryArea;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setDeliveryArea(option.value);
                                                setIsAreaOpen(false);
                                            }}
                                            className={`flex w-full cursor-pointer items-center justify-between rounded-lg border-0 px-3 py-2 text-left text-xs font-bold transition-colors ${
                                                isSelected
                                                    ? 'bg-store-yellow text-store-ink'
                                                    : 'bg-transparent text-store-ink hover:bg-store-ink/10'
                                            }`}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && <Check size={13} strokeWidth={3} />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <p className="m-0 hidden items-center gap-1.5 font-bold text-store-yellow min-[1100px]:flex">
                        <img className="block shrink-0" src="/images/storefront/clock.svg" alt="" />
                        {t('header.deliveryNotice')}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className="hidden min-[1280px]:inline-flex"
                        title={t('header.notAvailable')}
                    >
                        <button
                            className="flex items-center gap-2 border-0 bg-transparent p-0 text-store-cream/75 disabled:cursor-not-allowed"
                            type="button"
                            disabled
                        >
                            <img
                                className="block shrink-0"
                                src="/images/storefront/file.svg"
                                alt=""
                            />
                            {t('header.priceList')}
                        </button>
                    </span>
                    <a
                        className="hidden items-center gap-2 text-store-cream/85 no-underline hover:text-store-yellow min-[1440px]:flex"
                        href="/documents/TCVN11892-1_2017_916963.pdf"
                        download="TCVN11892-1_2017_916963.pdf"
                    >
                        <img
                            className="block shrink-0"
                            src="/images/storefront/shield.svg"
                            alt=""
                        />
                        {t('header.certifications')}
                    </a>
                    <AboutBusinessDropdown />
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
}
