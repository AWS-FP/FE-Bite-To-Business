import { useTranslation } from 'react-i18next';
import AuthJournal from './AuthJournal';
import AuthWordmark from './AuthWordmark';
import AuthFreshSticker from './AuthFreshSticker';

// Chỉ chứa phần trang trí của trang đăng ký.
export default function RegisterDecoration() {
    const { t } = useTranslation();

    return (
        <>
            {/* Màn hình từ 1200px: giữ các ảnh nằm ngoài hai mép form đăng ký. */}
            <div
                className="auth-desktop-decoration pointer-events-none relative col-start-1 row-start-1 min-h-[1100px] select-none max-[1200px]:hidden"
                aria-hidden="true"
            >
                <AuthWordmark />

                {/* Ảnh gà và thịt bò bên trái. */}
                <div
                    className="auth-photo absolute top-[105px] left-[6%] h-[300px] w-[220px] -rotate-6
 overflow-hidden rounded-t-[130px] border-4 border-solid border-auth-cream
 bg-surface-green shadow-[10px_10px_0_var(--color-auth-ink)]"
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
 bg-warning-soft shadow-[10px_10px_0_var(--color-auth-ink)]"
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
                    className="auth-photo absolute top-[200px] left-[calc(50%_+_325px)] h-[150px]
 w-[clamp(218px,18vw,260px)] rotate-[8deg] overflow-hidden rounded-[100px]
 border-4 border-solid border-auth-cream bg-surface-soft shadow-[10px_10px_0_var(--color-auth-ink)]"
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
 bg-store-mint shadow-[4px_4px_0_var(--color-auth-ink)]"
                >
                    <img
                        src="/images/register/sauces.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <div
                    className="auth-photo absolute top-[850px] left-[calc(50%_+_320px)] h-[150px] w-[150px]
 -rotate-[8deg] overflow-hidden rounded-[32px] border-4 border-solid border-auth-cream
 bg-store-yellow shadow-[10px_10px_0_var(--color-auth-ink)]"
                >
                    <img
                        src="/images/register/ham.jpg"
                        className="block h-full w-full scale-150 object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <AuthFreshSticker className="top-[330px] left-[3%]" />

                {/* Khung Journal dùng chung, trang đăng ký chỉ đặt vị trí. */}
                <AuthJournal className="top-[550px] right-[calc(50%_+_300px)] w-[clamp(250px,calc(50%_-_330px),340px)]" />

                {/* Hướng dẫn đăng ký viết rõ từng bước. */}
                <aside
                    className="auth-paper-note absolute top-[420px] left-[calc(50%_+_310px)]
 w-[clamp(250px,calc(50%_-_340px),320px)] rotate-2 border-2 border-auth-ink bg-white px-7 pt-9 pb-9 shadow-[8px_8px_0_var(--color-auth-ink)]"
                >
                    <span className="absolute -top-3 left-[calc(50%_-_48px)] h-6 w-24 -rotate-3 bg-store-pink/85" />
                    <span className="absolute right-0 bottom-0 h-2 w-16 bg-store-yellow" />
                    <h2 className="m-0 font-subheading text-[24px] leading-[1.15] font-bold">
                        {t('auth.registerNote.title')}
                    </h2>

                    <ol className="mt-7 mb-0 list-none p-0">
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
                        <li className="mt-5 flex items-baseline gap-3 border-0 border-t border-dashed border-auth-ink/15 pt-5">
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
                        <li className="mt-5 flex items-baseline gap-3 border-0 border-t border-dashed border-auth-ink/15 pt-5">
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
        </>
    );
}
