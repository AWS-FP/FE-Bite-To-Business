import { Check } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

// Dùng chung ở Header, auth và các màn hình quản lý.
export default function LanguageSwitcher() {
    const { t, i18n } = useTranslation('common');
    const labelId = useId();
    const isVietnamese = i18n.resolvedLanguage === 'vi';
    const isEnglish = i18n.resolvedLanguage === 'en';

    function changeLanguage(language: string) {
        // i18n đổi nội dung và lưu lựa chọn; không tải lại trang hay xóa form.
        void i18n.changeLanguage(language);
    }

    return (
        <div className="language-switcher inline-flex shrink-0 px-1 pt-2 pb-1">
            <div className="relative h-[58px] w-[109px] -rotate-2 border border-solid border-black bg-white px-[5px] pt-[17px] pb-[5px] font-body text-black shadow-[3px_3px_0_#000]">
                <span
                    className="absolute -top-[9px] left-[7px] border border-solid border-black bg-[#ffe14d] px-[5px] py-px font-label text-[9px] leading-[13.5px] font-semibold tracking-[0.6px] whitespace-nowrap uppercase"
                    id={labelId}
                >
                    {t('language')}
                </span>
                <div className="flex items-center gap-[5px]" role="group" aria-labelledby={labelId}>
                    <button
                        className="flex min-h-[34px] w-[45px] cursor-pointer items-center justify-center gap-1 border border-solid border-black bg-white px-[7px] py-[5px] text-[14px] leading-[21px] font-extrabold text-black hover:bg-[#fff4b8] aria-pressed:bg-[#ffe14d] aria-pressed:shadow-[inset_0_-3px_0_#000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#376e55]"
                        type="button"
                        lang="vi"
                        aria-label="Tiếng Việt"
                        aria-pressed={isVietnamese}
                        onClick={() => changeLanguage('vi')}
                    >
                        VI
                        {isVietnamese && (
                            <Check className="shrink-0" size={12} aria-hidden="true" />
                        )}
                    </button>
                    <button
                        className="flex min-h-[34px] w-[45px] cursor-pointer items-center justify-center gap-1 border border-solid border-black bg-white px-[7px] py-[5px] text-[14px] leading-[21px] font-extrabold text-black hover:bg-[#fff4b8] aria-pressed:bg-[#ffe14d] aria-pressed:shadow-[inset_0_-3px_0_#000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#376e55]"
                        type="button"
                        lang="en"
                        aria-label="English"
                        aria-pressed={isEnglish}
                        onClick={() => changeLanguage('en')}
                    >
                        EN
                        {isEnglish && <Check className="shrink-0" size={12} aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
