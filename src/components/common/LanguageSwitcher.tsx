import { useId } from 'react';
import { useTranslation } from 'react-i18next';

// Dùng chung ở header, trang xác thực và các màn hình quản lý.
export default function LanguageSwitcher({ vertical = false }: { vertical?: boolean }) {
    const { i18n } = useTranslation();
    const isEnglish = i18n.resolvedLanguage === 'en';
    // Several switchers can be on one page; SVG clipPath ids must be unique.
    const flagId = useId().replace(/:/g, '');

    function toggleLanguage() {
        void i18n.changeLanguage(isEnglish ? 'vi' : 'en');
    }

    return (
        <div className="language-switcher inline-flex shrink-0 items-center">
            <button
                type="button"
                role="switch"
                aria-checked={isEnglish}
                aria-label={isEnglish ? 'Language: English. Switch to Vietnamese' : 'Ngôn ngữ: Tiếng Việt. Chuyển sang tiếng Anh'}
                title={isEnglish ? 'Chuyển sang tiếng Việt' : 'Switch to English'}
                onClick={toggleLanguage}
                className={`relative cursor-pointer overflow-hidden rounded-full border-2 border-black bg-[#c8102e] p-0 transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-yellow ${vertical ? 'h-[62px] w-8' : 'h-8 w-[62px]'}`}
            >
                <span aria-hidden="true" className={`absolute bg-[#1e3a8a] ${vertical ? 'inset-x-0 bottom-0 h-1/2' : 'inset-y-0 right-0 w-1/2'}`} />
                <span aria-hidden="true" className={`absolute top-0.5 left-0.5 grid size-6 place-items-center rounded-full border border-black bg-white transition-transform duration-300 ease-in-out motion-reduce:transition-none ${isEnglish ? (vertical ? 'translate-y-[30px]' : 'translate-x-[30px]') : ''}`}>
                    {isEnglish ? (
                        // Union Jack (60x30), cropped to its centre square to fit the round knob.
                        <svg viewBox="15 0 30 30" className="size-5 rounded-full" aria-hidden="true">
                            <defs>
                                <clipPath id={`${flagId}-flag`}>
                                    <path d="M0 0v30h60V0z" />
                                </clipPath>
                                <clipPath id={`${flagId}-diag`}>
                                    <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
                                </clipPath>
                            </defs>
                            <g clipPath={`url(#${flagId}-flag)`}>
                                <path d="M0 0v30h60V0z" fill="#012169" />
                                <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
                                <path
                                    d="M0 0l60 30m0-30L0 30"
                                    clipPath={`url(#${flagId}-diag)`}
                                    stroke="#C8102E"
                                    strokeWidth="4"
                                />
                                <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
                                <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
                            </g>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" className="size-5 rounded-full" aria-hidden="true">
                            <circle cx="12" cy="12" r="12" fill="#c8102e" />
                            <path d="m12 4 1.9 5.8H20l-4.9 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8L4 9.8h6.1z" fill="#ffde00" />
                        </svg>
                    )}
                </span>
            </button>
        </div>
    );
}
