import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import {
    dryCategoryKeys,
    freshCategoryKeys,
    getCatalogSearchPath,
} from '@/constants/catalogNavigation';

const SUPPORT_URL = 'https://github.com/AWS-FP';

// Chỉ chứa các thành phần dùng chung, không chứa nội dung riêng của homepage.
export default function Footer() {
    const { t } = useTranslation('storefront');

    return (
        <footer className="border-0 border-t-2 border-solid border-store-cream/15 bg-store-dark font-body text-store-cream">
            <div className="mx-auto max-w-[1440px] px-12 pt-16 pb-10 max-[640px]:px-5 max-[640px]:pt-10 max-[640px]:pb-7">
                <div className="grid grid-cols-[1.4fr_1fr_1.4fr_1fr] gap-8 max-[1024px]:grid-cols-2 max-[640px]:gap-x-5 max-[640px]:gap-y-9 max-[400px]:grid-cols-1">
                    <div className="min-w-0 max-[640px]:col-span-full">
                        <Link
                            className="flex w-fit shrink-0 items-center gap-3 text-white no-underline"
                            to={ROUTES.HOME}
                            aria-label={t('home')}
                        >
                            <img
                                className="block h-auto w-[133px] shrink-0 object-contain max-[640px]:w-[84px]"
                                src="/images/storefront/brand-logo.png"
                                alt=""
                                width={133}
                                height={89}
                            />
                            <span className="brand-name flex flex-col text-[24px] leading-[1.1] tracking-[-0.5px] max-[640px]:text-[20px]">
                                <span>Bite to</span>
                                <span>Business</span>
                            </span>
                        </Link>
                        <p className="mt-4 mb-0 max-w-[310px] font-subtext text-[13.5px] leading-[1.6] text-store-cream/75">
                            {t('footer.description')}
                        </p>
                        <div
                            className="mt-4 flex flex-wrap gap-2"
                            id="store-certifications"
                            aria-label={t('header.certifications')}
                        >
                            <a
                                className="rounded-md border border-solid border-white/25 bg-white/10 px-2.5 py-1 font-label text-[11px] leading-[1.5] font-medium text-store-cream no-underline hover:text-store-yellow hover:underline"
                                href="/documents/TCVN11892-1_2017_916963.pdf"
                                download="TCVN11892-1_2017_916963.pdf"
                            >
                                VietGAP
                            </a>
                            <span className="rounded-md border border-solid border-white/25 bg-white/10 px-2.5 py-1 font-label text-[11px] leading-[1.5] font-medium">
                                GlobalGAP
                            </span>
                            <span className="rounded-md border border-solid border-white/25 bg-white/10 px-2.5 py-1 font-label text-[11px] leading-[1.5] font-medium">
                                ISO 22000 / HACCP
                            </span>
                        </div>
                    </div>

                    <nav aria-labelledby="footer-fresh-title">
                        <h2
                            className="m-0 font-subheading text-[17px] leading-[1.5] font-semibold text-store-yellow"
                            id="footer-fresh-title"
                        >
                            {t('footer.fresh')}
                        </h2>
                        <ul className="mt-5 mb-0 flex list-none flex-col gap-3 p-0">
                            {freshCategoryKeys.map((key) => (
                                <li key={key}>
                                    <Link
                                        className="text-[13.5px] leading-[1.5] text-store-cream/80 no-underline hover:text-store-yellow hover:underline"
                                        to={getCatalogSearchPath(t(`categories.${key}`))}
                                    >
                                        {t(`categories.${key}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-labelledby="footer-dry-title">
                        <h2
                            className="m-0 font-subheading text-[17px] leading-[1.5] font-semibold text-store-yellow"
                            id="footer-dry-title"
                        >
                            {t('footer.dry')}
                        </h2>
                        <ul className="mt-5 mb-0 flex list-none flex-col gap-3 p-0">
                            {dryCategoryKeys.map((key) => (
                                <li key={key}>
                                    <Link
                                        className="text-[13.5px] leading-[1.5] text-store-cream/80 no-underline hover:text-store-yellow hover:underline"
                                        to={getCatalogSearchPath(t(`categories.${key}`))}
                                    >
                                        {t(`categories.${key}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="max-[640px]:col-span-full">
                        <h2 className="m-0 font-subheading text-[17px] leading-[1.5] font-semibold text-store-yellow">
                            {t('footer.support')}
                        </h2>
                        <a
                            className="relative mt-6 ml-8 block size-[99px] overflow-hidden rounded-sm outline-offset-4 hover:opacity-80 max-[640px]:ml-0"
                            href={SUPPORT_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={t('footer.github')}
                        >
                            {/* Giữ kích thước SVG gốc; wrapper cắt phần lề giống frame trong Figma. */}
                            <img
                                className="absolute -top-[24.47px] -left-[19.97px] block"
                                src="/images/storefront/github.svg"
                                alt="GitHub"
                            />
                        </a>
                    </div>
                </div>

                <div className="mt-14 grid grid-cols-[1.6fr_1fr] gap-5 border-0 border-t border-solid border-store-cream/12 pt-6 font-subtext text-[13px] leading-[1.5] text-store-cream/60 max-[640px]:mt-10 max-[640px]:grid-cols-1 max-[640px]:gap-2 max-[640px]:text-[11px]">
                    <p className="m-0">
                        {t('footer.copyright', { year: new Date().getFullYear() })}
                    </p>
                    <p className="m-0">{t('footer.education')}</p>
                </div>
            </div>
        </footer>
    );
}
