import { useTranslation } from 'react-i18next';

// Dùng chung ở header, trang xác thực và các màn hình quản lý.
export default function LanguageSwitcher({ vertical = false }: { vertical?: boolean }) {
    const { i18n } = useTranslation();
    const isEnglish = i18n.resolvedLanguage === 'en';

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
                        <svg viewBox="0 0 24 24" className="size-5 rounded-full" aria-hidden="true">
                            <circle cx="12" cy="12" r="12" fill="#1e3a8a" />
                            <path d="M0 12h24M12 0v24" stroke="white" strokeWidth="5" />
                            <path d="M0 12h24M12 0v24" stroke="#c8102e" strokeWidth="2.5" />
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
