import { useTranslation } from 'react-i18next';
import AuthJournal from './AuthJournal';
import AuthWordmark from './AuthWordmark';

// Chỉ chứa phần trang trí của trang đăng ký.
export default function RegisterDecoration() {
    const { t } = useTranslation();

    return (
        <>
            {/* Màn hình từ 1200px: giữ các ảnh nằm ngoài hai mép form đăng ký. */}
            <div
                className="auth-desktop-decoration pointer-events-none absolute inset-0 min-h-[1000px] select-none max-[1200px]:hidden"
                aria-hidden="true"
            >
                <AuthWordmark />

                {/* Ảnh gà và thịt bò bên trái. */}
                <div
                    className="auth-photo absolute top-[105px] left-[6%] h-[300px] w-[220px] -rotate-6
          overflow-hidden rounded-t-[130px] border-4 border-solid border-auth-cream
          bg-[#dce1d5] shadow-[10px_10px_0_#17133a]"
                >
                    <img
                        src="/images/register/chicken-boil.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <div
                    className="auth-photo absolute top-[315px] right-[calc(50%_+_300px)] h-[170px] w-[170px]
          overflow-hidden rounded-full border-4 border-solid border-auth-cream
          bg-[#e7d7c6] shadow-[10px_10px_0_#17133a]"
                >
                    <img
                        src="/images/register/beef.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                {/* Ảnh đồ hộp và nước sốt bên phải. */}
                <div
                    className="auth-photo absolute top-[180px] left-[calc(50%_+_325px)] h-[150px]
          w-[clamp(218px,18vw,260px)] rotate-[8deg] overflow-hidden rounded-[100px]
          border-4 border-solid border-auth-cream bg-[#a0afa5] shadow-[10px_10px_0_#17133a]"
                >
                    <img
                        src="/images/register/canned-food.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <div
                    className="auth-photo absolute top-[45px] left-[calc(50%_+_310px)] h-[112px] w-[112px]
          overflow-hidden rounded-full border-4 border-solid border-auth-cream
          bg-[#c9d5ac] shadow-[4px_4px_0_#17133a]"
                >
                    <img
                        src="/images/register/sauces.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <div
                    className="auth-photo absolute top-[695px] left-[calc(50%_+_320px)] h-[150px] w-[150px]
          -rotate-[8deg] overflow-hidden rounded-[32px] border-4 border-solid border-auth-cream
          bg-[#ddd5b6] shadow-[10px_10px_0_#17133a]"
                >
                    <img
                        src="/images/register/ham.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <div
                    className="auth-fresh-sticker absolute top-[320px] left-[3%] grid h-28 w-28
          -rotate-[14deg] content-center rounded-full bg-[#ff9bd2] text-center font-label
          text-[12px] leading-[1.25] font-bold uppercase shadow-[4px_4px_0_#17133a]"
                >
                    {t('auth.fresh')}
                    <br />
                    {t('auth.everyMorning')}
                    <span className="mt-1">★</span>
                </div>

                {/* Khung Journal dùng chung, trang đăng ký chỉ đặt vị trí. */}
                <AuthJournal className="top-[550px] right-[calc(50%_+_300px)] w-[clamp(250px,calc(50%_-_330px),340px)]" />

                {/* Hướng dẫn đăng ký viết rõ từng bước. */}
                <aside
                    className="auth-paper-note absolute top-[355px] left-[calc(50%_+_310px)]
          w-[clamp(250px,calc(50%_-_340px),290px)] rotate-2 bg-white px-6 pt-7 pb-6 shadow-[8px_8px_0_#17133a]"
                >
                    <span className="absolute -top-3 left-[calc(50%_-_48px)] h-6 w-24 -rotate-3 bg-[#ff9bd2d9]" />
                    <h2 className="m-0 font-subheading text-[24px] leading-[1.15] font-bold">
                        {t('auth.registerNote.title')}
                    </h2>

                    <ol className="mt-5 mb-0 list-none p-0">
                        <li className="flex items-baseline gap-3">
                            <span className="auth-note-number font-display text-[24px] leading-none font-bold text-auth-green">
                                01
                            </span>
                            <div>
                                <strong className="block font-subheading text-[13px] leading-5">
                                    {t('auth.registerNote.step1')}
                                </strong>
                                <p className="mt-0.5 mb-0 font-subtext text-[11px] leading-[1.5] text-auth-muted">
                                    {t('auth.registerNote.detail1')}
                                </p>
                            </div>
                        </li>
                        <li className="mt-3 flex items-baseline gap-3 border-0 border-t border-dashed border-[#17133a25] pt-3">
                            <span className="auth-note-number font-display text-[24px] leading-none font-bold text-auth-green">
                                02
                            </span>
                            <div>
                                <strong className="block font-subheading text-[13px] leading-5">
                                    {t('auth.registerNote.step2')}
                                </strong>
                                <p className="mt-0.5 mb-0 font-subtext text-[11px] leading-[1.5] text-auth-muted">
                                    {t('auth.registerNote.detail2')}
                                </p>
                            </div>
                        </li>
                        <li className="mt-3 flex items-baseline gap-3 border-0 border-t border-dashed border-[#17133a25] pt-3">
                            <span className="auth-note-number font-display text-[24px] leading-none font-bold text-auth-green">
                                03
                            </span>
                            <div>
                                <strong className="block font-subheading text-[13px] leading-5">
                                    {t('auth.registerNote.step3')}
                                </strong>
                                <p className="mt-0.5 mb-0 font-subtext text-[11px] leading-[1.5] text-auth-muted">
                                    {t('auth.registerNote.detail3')}
                                </p>
                            </div>
                        </li>
                    </ol>
                </aside>
            </div>

            {/* Màn hình nhỏ: ba ảnh và lời giới thiệu nằm phía trên form. */}
            <div
                className="auth-mobile-intro mx-auto hidden max-w-[540px] px-2 pt-[18px] pb-[14px]
          max-[1200px]:block max-[600px]:mx-5 max-[600px]:px-0 max-[600px]:pt-4"
                aria-hidden="true"
            >
                <div className="auth-mobile-photos mb-3 flex h-[90px] items-end gap-3">
                    <div
                        className="auth-photo h-[90px] w-16 -rotate-6 overflow-hidden rounded-t-[40px]
            border-2 border-solid border-auth-cream bg-[#dce1d5] shadow-[4px_4px_0_#17133a]"
                    >
                        <img
                            src="/images/register/chicken-boil.jpg"
                            className="block h-full w-full object-cover"
                            alt=""
                            decoding="async"
                        />
                    </div>
                    <div
                        className="auth-photo h-12 w-20 rotate-6 overflow-hidden rounded-[50px]
            border-2 border-solid border-auth-cream bg-[#a0afa5] shadow-[4px_4px_0_#17133a]"
                    >
                        <img
                            src="/images/register/canned-food.jpg"
                            className="block h-full w-full object-cover"
                            alt=""
                            decoding="async"
                        />
                    </div>
                    <div
                        className="auth-photo h-16 w-16 overflow-hidden rounded-full
            border-2 border-solid border-auth-cream bg-[#e7d7c6] shadow-[4px_4px_0_#17133a]"
                    >
                        <img
                            src="/images/register/beef.jpg"
                            className="block h-full w-full object-cover"
                            alt=""
                            decoding="async"
                        />
                    </div>
                </div>

                <p className="mt-0 mb-[5px] text-[11px] font-bold text-[#ff9bd2]">
                    {t('auth.food')} | B2B Journal
                </p>
                <h2 className="m-0 max-w-[380px] font-display text-[19px] leading-[1.2] font-extrabold text-white">
                    {t('auth.heroTitle')}
                </h2>
            </div>
        </>
    );
}
