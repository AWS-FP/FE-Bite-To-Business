import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../common/LanguageSwitcher';
import AboutBusinessDropdown from './AboutBusinessDropdown';

export default function StoreUtilityBar() {
    const { t } = useTranslation('storefront');
    return (
        <div className="border-0 border-b border-solid border-store-cream/15 bg-store-dark">
            <div className="mx-auto flex min-h-[40px] max-w-[1440px] flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-5 py-1.5 text-[11px] leading-[1.5]">
                <AboutBusinessDropdown />
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
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
}
